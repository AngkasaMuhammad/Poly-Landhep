
struct stmisc{
	persp:mat4x4f,
	pivot:mat4x4f,
	cam:mat4x4f,
	invcam:mat4x4f,
	view:mat4x4f, // = persp*invcam
	now:u32,
	seek:f32,
	freecam:u32,
	prevseek:f32,
	ranfl:f32,
}
@group(0) @binding(0) var<uniform> misc:stmisc;

struct stmisc1{
	sk:vec2f, //sudut katrol depan & belakang
}
@group(0) @binding(1) var<storage,read_write,> misc1:stmisc1;
@group(0) @binding(2) var<storage> misc1read:stmisc1;
@group(0) @binding(3) var<storage> camresoread:array<mat4x4f>;
@group(0) @binding(4) var<storage> camreso:array<mat4x4f>;

//dari js Math.PI.toFixed(100)
const pi = 3.141592653589793115997963468544185161590576171875;
const matide = mat4x4f(
	1,0,0,0,
	0,1,0,0,
	0,0,1,0,
	0,0,0,1,
);

const m_arahsiang = mat4x4f(0.808, -0.479, 0.342, 0, 0.442, 0.878, 0.187, 0, -0.389, 0, 0.921, 0, 0, 0, 0, 1);
//const m_arahmalam = mat4x4f(-0.498, 0.841, -0.21, 0, -0.775, -0.54, -0.328, 0, -0.389, 0, 0.921, 0, 0, 0, 0, 1);

//arah sumber matahari
const arahsiang = normalize(m_arahsiang[1].xyz); //vec3f(.2,.3,.2,);
//const arahmalam = normalize(m_arahmalam[1].xyz);;

const wbs = vec4f(.4,.4,.4,.45,); //warna belakang siang
const wds = vec4f(.9,.9,.9,.25,); //warna depan siang
//const wbm = vec4f(.0,.0,.0,.7,); //warna belakang malam
//const wdm = vec4f(.0,.0,.0,.9,); //warna depan malam



const tp = vec4f(.9,.9,.0,1.,);


@vertex fn tanah_vert(
	@location(0) p:vec3f,
	
	//@builtin(vertex_index) vi:u32,
	@builtin(instance_index) ii_:u32,
)-> tanah_out {
	let pout = vec4f(p,1.,);	
	return tanah_out(
		fcam()*pout,
		pout,
	);
}

struct tanah_out{
	@builtin(position) posout:vec4f,
	@location(0) p:vec4f,
}

@fragment fn tanah_frag(
	o:tanah_out,
)-> @location(0) vec4f {
	//return o.p;
	let x = o.p.x;
	let y = o.p.y;
	let z = o.p.z;
	let seek = misc.seek;
	
	return select(
		select(
			vec4f(1.,.8,.4,1.9,),
			vec4f(.8,.7,.3,1.9,),
			corak0(o.p.xyz),
			//sin(sin(x*z)) < pow(5.,sin(z*sin(x+y)),)*sin(9.*x), //ini rapi
			//tan(x*z) < sin(z),
		),
		select(
			vec4f(.85,.75,.4,1.9,),
			vec4f(.75,.65,.3,1.9,),
			//sin(x*z-z)+cos(z*z) < atan(x*z),
			sin(x)%cos(x) < sin(z),
			//x*x+z*z < tan(200.*z/x),
		),
		tan(x+pow(.7,z,)) < sin(z+pow(1.,x,)+.2*x),
	);
}

//const r = 2.; //rasio (mesin/katrol belakang)
//const rg = log(r)/log(2.); //geser sabuk

@vertex fn gear0_vert(
	
	@location(0) nor:vec4f,
	@location(1) p:vec3f,
	
	//@location(2) ii:u32,
	
	//bikin pake inst buffer aja, instance_index ngilangin mesh (cuma di project ini)
	@builtin(instance_index) ii_:u32, //makes mesh not appeared
)-> gear0_out {
	let pilih = u32(1u < ii_);
	
	let ms = mesin_speed();
	let ks = katrol_speed(r());
	let ps = .5*(-ks-ms); //planet speed
	let ds = .5*(ks-ms); //diff speed
	
	let sp = spur(nor,p,ii_,ds,);
	let be = bevel(nor,p,ii_, r(),ps,ds,);
	let sg = shaftgear(nor,p,ii_, ds,);
	return array(
		sp,sp,
		be,be,be,be,
		sg,
	)[ii_];
}

struct gear0_out{
	@builtin(position) posout:vec4f,
	@location(0) nor:vec3f,
	@location(1) nor0:vec4f,
	@location(2) pos0:vec3f,
}

@fragment fn gear0_frag(
	o:gear0_out,
)-> @location(0) vec4f {
	let wa = warnagear(o.pos0);
	var wa1 = wa*select(
		1.,
		.9,
		corak0(o.pos0+o.nor0.xyz*11.),
	);
	
	//tanda putar
	let p = o.pos0;
	wa1 = select(
		wa1,
		tp,
		-.03 < p.x &&
		p.x < .03 &&
		.0 < p.y,
	);
	
	let wa_out = fsinar(wa1.rgb,o.nor.xyz,);
	return vec4f(wa_out,wa.a,);
}





const g0luas = vec4f(.7,.7,.9,1.,);
const g0gelap = vec4f(.4,.4,.7,1.,);
const g0sedang = vec4f(.5,.5,.8,1.,);
const g0cerah = vec4f(.6,.6,.9,1.,);
fn warnagear(
	p:vec3f,
)->vec4f{
	
	//warna gear
	var out = select(
		g0cerah,
		g0sedang,
		length(p.xy) < .508,
	);
	out = select(
		out,
		g0gelap,
		length(p.xy) < .482,
	);
	out = select(
		g0luas,
		out,
		-.057 < p.z &&
		p.z < .057,
	);
	
	return out;
}

//=============================================

fn spur(
	
	nor:vec4f,
	pos:vec3f,
	ii:u32,
	ds:f32,
		
)-> gear0_out {
	
	//muncul saat
	let p = pos/f32(8.5 < misc.seek);
	
	let arah = select(-1.,1.,ii < 1u,);
	let putar = putarZ(mesin_speed()*arah);
	let nor1 = fnor(putar,nor.xyz,);
	
	var pout = vec4f(p,1.,);
	pout = putar*pout;
	pout.x += select(.0,1.,bool(ii),);
	pout.z -= 1.;
	
	return gear0_out(
		fcam()*posmobil(ds)*pout,
		nor1,
		nor,
		p,
	);
}

fn bevel(
	
	nor:vec4f,
	pos:vec3f,
	ii:u32,
	
	r:f32, //rasio
	ps:f32, //planet speed
	ds:f32, //diff speed
		
)-> gear0_out {
	
	//muncul saat
	let p = pos/f32(12.5 < misc.seek);
	
	let is_p = bool(ii%2u); //is_planet
	
	var putar = putarZ(ps*select(-1.,1.,is_p,));
	putar = putarY(f32(ii)*pi*.5) *putar;
	putar = putarZ(ds)*putar;
	var pout = vec4f(p,1.,);
	pout.z += .1;
	
	let s = pout.z*2.;//scale
	pout.x *= s;
	pout.y *= s;
	pout = putar*pout;
	pout.x += 1.;
	
	let nor1 = fnor(putar,nor.xyz,);
	return gear0_out(
		fcam()*posmobil(ds)*pout,
		nor1,
		nor,
		p,
	);
}

fn shaftgear(
	
	nor:vec4f,
	pos:vec3f,
	ii:u32,
	
	ds:f32, //diff speed
		
)-> gear0_out {
	
	//muncul saat
	let p = pos/f32(12.7 < misc.seek);
	
	let putar = putarY(-.5*pi)*putarZ(ds);
	var pout = vec4f(p,1.,);
	pout.z *= .25;
	pout.z += .3;
	
	let s = pout.z*2.;//scale
	pout.x *= s;
	pout.y *= s;
	pout = putar*pout;
	pout.x += 1.;
	
	let nor1 = fnor(putar,nor.xyz,);
	
	return gear0_out(
		fcam()*posmobil(ds)*pout,
		nor1,
		nor,
		p,
	);
}

@vertex fn mesin_vert(
	
	@location(0) warna:vec4f,
	@location(1) nor:vec4f,
	@location(2) p:vec3f,
	
	@builtin(instance_index) ii_:u32,
)-> mesin_out {
	let t = misc.seek;

	let ms = mesin_speed();
	let ks = katrol_speed(r());
	let ds = .5*(ks-ms); //diff speed
	
	let pout = vec4f(p,1.,);
/*========
	/f32(
		p.x < .5
		|| 11. < t
	);
--------*/
	let nor1 = vec4f(fnor(
		matide,
		nor.xyz,
	),1.,);
	
	return mesin_out(
		fcam()*posmobil(ds)*pout,
		warna,
		nor1,
	);
}

struct mesin_out{
	@builtin(position) posout:vec4f,
	@location(0) warna:vec4f,
	@location(1) nor:vec4f,
}

@fragment fn mesin_frag(
	o:mesin_out,
)-> @location(0) vec4f {
	
	let wa = o.warna.xyz;
	let wa1 = wa*select(
		1.,
		.9,
		corak0(o.nor.xyz*55.),
	);
	let wa_out = fsinar(wa1.rgb,o.nor.xyz,);
	return vec4f(wa_out,o.warna.a,);
}

@vertex fn katrol_vert(
	
	@location(0) nor:vec4f,
	@location(1) pos:vec3f,
	
	//@location(2) ii:u32,
	
	@builtin(instance_index) ii_:u32,
)-> katrol_out {
/*
	0	1



	2	3
*/
	
	//muncul saat
	let p = pos/f32(10.5 < misc.seek);

	let ms = mesin_speed();
	let ks = katrol_speed(r());
	let ds = .5*(ks-ms); //diff speed

	let arahbool = bool(ii_%2u);
	let fii = f32(ii_);
	let x = f32(1u < ii_);
	let z = 1.2;
	var putar = putarZ(select(
		ks,
		ms,
		ii_ < 2u,
	))*putarX(pi*f32(arahbool),);
	var pout = putar*vec4f(p,1.,);
	pout.x += x;
	pout.z += z +rg()*.04*f32(ii_ == 0u || ii_ == 3u);
	
	let nor1 = fnor(putar,nor.xyz,);
	
	return katrol_out(
		fcam()*posmobil(ds)*pout,
		nor1,
		pout,
		p,
	);
}

struct katrol_out{
	@builtin(position) posout:vec4f,
	@location(0) nor:vec3f,
	@location(1) pos:vec4f,
	@location(14) p0:vec3f,
}

@fragment fn katrol_frag(
	o:katrol_out,
)-> @location(0) vec4f {
	
	let wa = vec4f(.4,.6,.4,1.,);
	var wa1 = wa*select(
		1.,
		.9,
		corak0(o.p0.xyz*11.),
	);
	
	//tanda putar
	let p = o.p0;
	wa1 = select(
		wa1,
		tp,
		-.03 < p.x &&
		p.x < .03 &&
		.0 < p.y,
	);
	
	let wa_out = fsinar(wa1.rgb,o.nor.xyz,);
	return vec4f(wa_out,wa.a,);
}


@vertex fn gear1_vert(
	
	@location(0) nor:vec4f,
	@location(1) pos:vec3f,
	
	@builtin(instance_index) ii_:u32,
)-> gear1_out {
	
	//muncul saat
	let p = pos/f32(12.6 < misc.seek);

	let ms = mesin_speed();
	let ks = katrol_speed(r());
	let ds = .5*(ks-ms); //diff speed
	
	var pout = vec4f(p,1.,);
	
	let putar = putarZ(ds);
	pout = putar*pout;
	pout.x += 1.;
	
	let nor1 = fnor(putar,nor.xyz,);
	
	return gear1_out(
		fcam()*posmobil(ds)*pout,
		nor1,
		p,
	);}

struct gear1_out{
	@builtin(position) posout:vec4f,
	@location(0) nor:vec3f,
	@location(1) p0:vec3f,
}

@fragment fn gear1_frag(
	o:gear1_out,
)-> @location(0) vec4f {
	let wa = vec4f(.5,.3,.3,1.,);
	var wa1 = wa*select(
		1.,
		.9,
		corak0(o.p0+o.nor*4.),
	);
	
	//tanda putar
	let p = o.p0;
	wa1 = select(
		wa1,
		tp,
		-.03 < p.x &&
		p.x < .03 &&
		.0 < p.y,
	);
	
	let wa_out = fsinar(wa1.rgb,o.nor.xyz,);
	return vec4f(wa_out,wa.a,);
}

@vertex fn ban_vert(
	
	@location(0) nor:vec4f,
	@location(1) p:vec3f,
	
	//@location(2) ii:u32,
	
	@builtin(instance_index) ii_:u32,
)-> ban_out {

	let ms = mesin_speed();
	let ks = katrol_speed(r());
	let ds = .5*(ks-ms); //diff speed
	
	var putar = putarX(.5*pi) *putarY(-ds);
	putar[3][0] = 5.5;
	putar[3][2] = 2.6*select(1.,-1.,bool(ii_),);
	let pout = putar*vec4f(p,1.,);
	
	let nor1 = fnor(putar,nor.xyz,);
	
	return ban_out(
		fcam()*posmobil(ds)*pout,
		nor1,
		nor.xyz,
		p,
	);
}

struct ban_out{
	@builtin(position) posout:vec4f,
	@location(0) nor:vec3f,
	@location(1) nor0:vec3f,
	@location(2) p0:vec3f,
}

@fragment fn ban_frag(
	o:ban_out,
)-> @location(0) vec4f {
	let wa = vec4f(.0,.0,.0,1.,);
	var wa1 = wa+select(
		.0,
		.1,
		corak0(o.p0+o.nor0*11.),
	);
	
	//tanda putar
	let p = o.p0;
	wa1 = select(
		wa1,
		tp,
		-.03 < p.x &&
		p.x < .03 &&
		.0 < p.y,
	);
	
	let wa_out = fsinar(wa1.rgb,o.nor.xyz,);
	return vec4f(wa_out,wa.a,);
}


@vertex fn sabuk_vert(
	
	@location(0) nor:vec4f,
	@location(1) pos:vec3f,
	
	@builtin(instance_index) ii_:u32,
)-> sabuk_out {
	
	//muncul saat
	let p = pos/f32(10.5 < misc.seek);

	let ms = mesin_speed();
	let ks = katrol_speed(r());
	let ds = .5*(ks-ms); //diff speed
	
	var pout = vec4f(p,1.,);
	
	let belakangkah = 0. < pout.x;
	
	let r1 = select(rg(),-rg(),belakangkah,) *.08;
	let xysize = length(pout.xy);
	let size = normalize(pout.xy)*(xysize +r1);
	pout = vec4f(size,pout.zw,);
	
	pout.x += f32(belakangkah);
	pout.z += 1.2 +rg()*.02;
	
	
	let nor1 = fnor(matide,nor.xyz,);
	let tex = putarZ(ms)*pout;
	
	return sabuk_out(
		fcam()*posmobil(ds)*pout,
		nor1,
		tex.xyz,
	);
}

struct sabuk_out{
	@builtin(position) posout:vec4f,
	@location(0) nor:vec3f,
	@location(13) p0:vec3f,
}

@fragment fn sabuk_frag(
	o:sabuk_out,
)-> @location(0) vec4f {
	let wa = vec4f(.0,.0,.0,1.,);
	let wa1 = wa+select(
		.0,
		.1,
		corak0(o.p0*66.),
	);
	let wa_out = fsinar(wa1.rgb,o.nor.xyz,);
	return vec4f(wa_out,wa.a,);
}


@vertex fn panah_vert(
	
	@location(0) pos:vec3f,
	
	@builtin(instance_index) ii_:u32, //bikin mesh muncul juga, semua @vertex harus ada @builtin(instance_index)
)-> panah_out {
	
	var pout = vec4f(pos,1.,);
	
	return panah_out(
		fcam()*camresoread[2]*pout,
	);
}

struct panah_out{
	@builtin(position) posout:vec4f,
}

@fragment fn panah_frag(
)-> @location(0) vec4f {
	return vec4f(
		vec3f(sin(misc.seek*11.)+.5),
		1.,
	);
}


@vertex fn teks0_vert(
	
	@location(0) pos:vec3f,
	
	@builtin(instance_index) ii_:u32,
)-> teks0_out {
	
	//muncul saat
	let p = pos/f32(40.5 < misc.seek)
	+vec3f(
		sin((f32(misc.now)+pos.y)*111.252),
		sin((f32(misc.now)+pos.x)*112.7811),
		0,
	)*.004;
	
	var pout = vec4f(p,1.,);
let bentarrrrr = fcam();
	
	return teks0_out(
		pout,
	);
}

struct teks0_out{
	@builtin(position) posout:vec4f,
}

@fragment fn teks0_frag(
)-> @location(0) vec4f {
	return vec4f(1.);
}

@vertex fn rpm_vert(
	
	@builtin(vertex_index) vi:u32,
)-> rpm_out {
	
	return rpm_out(
		vec4f(.0,.0,.99,1.,),
		vi,
	);
}

struct rpm_out{
	@builtin(position) posout:vec4f,
	@location(0) @interpolate(flat) vi:u32,
}

@fragment fn rpm_frag(
	o:rpm_out,
)-> @location(0) vec4f {
	let ds = misc.seek-misc.prevseek;//delta sekk
	
/*========
	let coba = f32(o.vi < 555u);
	misc1.sk[0] += ds*coba;
	misc1.sk[1] += ds*r()*coba;
--------*/
	misc1.sk[o.vi] += ds*7.*select(1.,r(),bool(o.vi),); //f32(o.vi+1u)*.01;
	return vec4f(.001);
}

/*










*/

fn mesin_speed(
)-> f32 {
	return misc1read.sk[0u]; //misc.seek;
}

fn katrol_speed(
	r:f32, //rasio
)-> f32 {
	return misc1read.sk[1u]; //misc.seek*r;
}

fn r()->f32{ //rasio (mesin/katrol belakang)
	//return select(2.,.5,misc.seek < 11.,);

	//let a = 2.*atan(3.*(misc.seek-11.));
	//return pow(2,a/pi,);
	//return pow(10,-44,);
	return camresoread[1][3][0];
}



fn rg()->f32{ //geser sabuk
	return log(r())/log(2.);
}

fn posmobil(
	ds:f32,
)->mat4x4f{
	let x = 0.;//-ds;//misc.cam[3].x;
	let m = mat4x4f(
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		x,0,0,1,
	);
	return m;
}


/*










*/

fn putarX(
	r:f32,
)->mat4x4f{
	let s = sin(r);
	let c = cos(r);
	let m = mat4x4f(
		1,0,0,0,
		0,c,s,0,
		0,-s,c,0,
		0,0,0,1,
	);
	return m;
}

fn putarY(
	r:f32,
)->mat4x4f{
	let s = sin(r);
	let c = cos(r);
	let m = mat4x4f(
		c,0,s,0,
		0,1,0,0,
		-s,0,c,0,
		0,0,0,1,
	);
	return m;
}

fn putarZ(
	r:f32,
)->mat4x4f{
	let s = sin(r);
	let c = cos(r);
	let m = mat4x4f(
		c,s,0,0,
		-s,c,0,0,
		0,0,1,0,
		0,0,0,1,
	);
	return m;
}

fn fcam()->mat4x4f{
	return array(
		misc.persp*camresoread[0],
		misc.view,
	)[misc.freecam];
}

fn fnor(
	m:mat4x4f,
	n:vec3f,
)->vec3f{
	return mat3x3f(
		m[0].xyz,
		m[1].xyz,
		m[2].xyz,
	)*(n*2.-1.);
}

fn corak0(
	p:vec3f,
)-> bool {
	//return o.p;
	let x = p.x;
	let y = p.y;
	let z = p.z;
	
	return sin(sin(x*z)) < pow(5.,sin(z*sin(x+y)),)*sin(9.*x);
}

fn fsinar(
	warna:vec3f,
	nor:vec3f,
)->vec3f{
	let berat = dot(
		nor,
		arahsiang,
	);
	let wb = wbs;
	let wd = wds;
	let wbaru = select(wb,wd,.0 < berat,);
	return mix(warna,wbaru.xyz,wbaru.w,);
}
