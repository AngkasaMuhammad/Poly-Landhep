
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
@group(0) @binding(1) var<storage,read> ani:array<mat4x4f>;
@group(0) @binding(2) var<storage,read> anicam:mat4x4f;

const m_arahsiang = mat4x4f(0.808, -0.479, 0.342, 0, 0.442, 0.878, 0.187, 0, -0.389, 0, 0.921, 0, 0, 0, 0, 1);
const m_arahmalam = mat4x4f(-0.498, 0.841, -0.21, 0, -0.775, -0.54, -0.328, 0, -0.389, 0, 0.921, 0, 0, 0, 0, 1);
//arah sumber matahari
const arahsiang = normalize(m_arahsiang[1].xyz); //vec3f(.2,.3,.2,);
const arahmalam = normalize(m_arahmalam[1].xyz);;

const wbs = vec4f(.4,.4,.4,.45,); //warna belakang siang
const wds = vec4f(.9,.9,.9,.25,); //warna depan siang
const wbm = vec4f(.0,.0,.0,.7,); //warna belakang malam
const wdm = vec4f(.0,.0,.0,.9,); //warna depan malam

const matide = mat4x4f(
	1,0,0,0,
	0,1,0,0,
	0,0,1,0,
	0,0,0,1,
);

/*









*/

@vertex fn pompa_vert(
	@builtin(vertex_index) vi:u32,
	
	@location(0) meshid:i32,
	@location(1) nor:i32, // 3nor
	@location(2) pos:vec3f,
	@location(3) tex:vec2f,
)-> vout0{
	let seek = misc.seek;
	
	var p = pos;
	var m = matide;
	var p1 = p;
	var m1 = m;
	var _using = false; // untuk select
	var tampil = true;





//tandon luar
_using = meshid == Ptl;

	let tlt = //tampil
		(seek < 10. || 12.5 < seek) 
		&& (seek < 29. || 38. < seek)
	;
	p1 = pos;// vec3f(pos.xy ,pos.z+20.,);
	p1 = select(vec3f(0.),p1,tlt,);

p = select(p,p1,_using,);





//bola
_using = meshid == Pb;

	tampil = 28. < seek;
	var sudut = clamp(misc.seek,33.,34.,)-34.5;
	m1 = putarZ(sudut*.5);
	
	let ykatup = select(.0,18.,seek < 30.,);
	m1[3] = vec4f(-3.,15.,.0,1.,);
	m1[3].y += ykatup;
	
	p1 = pos-vec3f(-3.,15.,.0,);
	p1 = select(vec3f(0.),p1,tampil,);

p = select(p,p1,_using,);
m = array(m,m1,)[u32(_using)];





//katup bola
_using = meshid == Pkb;

	//tampil dari bola
	p1 = pos;
	p1.y += ykatup;
	p1 = select(vec3f(0.),p1,tampil,);

p = select(p,p1,_using,);





	
	let pout = m*vec4f(p,1.,);
	let nor1 = fnor(m,nor,);
	
	let aaaaa = ani[0];
	
	var cam = misc.view;
	let viof = u32(misc.seek*377.);
	return vout0(
		misc.persp*fcam()*pout/f32(vi < viof), //animasi cyan
		nor1,
		tex,
		viof-vi,
	);
}

struct vout0{
	@builtin(position) posout:vec4f,
	@location(0) nor:vec3f,
	@location(1) tex:vec2f,
	@location(2) @interpolate(flat) viof:u32, //vi offset
}

@fragment fn pompa_frag(
	o:vout0,
)-> @location(0) vec4f{
	let x = o.tex.x;
	let y = o.tex.y;

let ff = select(vec4f(1.),vec4f(.5,.5,.5,1.,),x < .0,);
let ee = select(vec4f(.6,.1,.0,1.,),vec4f(.0,.0,.0,1.,),x < 4.,);
let dd = select(vec4f(.0,.0,.2,1.,),vec4f(.5,.5,.0,1.,),y < 4.5,);
let cc = select(dd,ee,y < .0,);
let bb = select(cc,vec4f(.0,.0,.4,1.,),x < .0,);
let aa = select(bb,ff,y < -4.,);

//cyan
let is_cyan = misc.seek < 7.;

let warna = aa;
	
	return select(
	
	vec4f(
		fsinar(warna.xyz,o.nor,)
	,warna.w,),
	select(
		vec4f(.0,.4,.4,.5,),
		vec4f(.3,1.,1.,1.,),
		o.viof < 66u,
	),
	is_cyan,
	
	);
}

//pompa
const Ptl = 1i; //tandon luar
const Pb = 2i; //bola
const Pkb = 3i; //katup bola
const Ptt = 4i; //tutup tandon

@vertex fn tanah_vert(
	@builtin(vertex_index) vi:u32,
	
	@location(0) pos:vec3f,
)-> vout1{
	let p = vec4f(pos,1.,);
	
	let aaaaa = ani[0];
	
	var cam = misc.view;
	return vout1(
		misc.persp*fcam()*p,
		p,
	);
}

struct vout1{
	@builtin(position) posout:vec4f,
	@location(0) pos:vec4f,
}

@fragment fn tanah_frag(
	o:vout1,
)-> @location(0) vec4f{
	let x = o.pos.x;
	let z = o.pos.z;
	let x1 = x;//sin(x)%cos(x);
	let z1 = z;//sin(z+pow(.9,x,)+.2*x);
	return select(
		select(
			vec4f(.9,.8,.4,.99,),
			vec4f(.8,.7,.3,.99,),
			sin(sin(x*z)) < pow(5.,sin(z*sin(x)),)*sin(9.*x),
		),
		select(
			vec4f(.85,.75,.4,.99,),
			vec4f(.75,.65,.3,.99,),
			sin(x)%cos(x) < sin(z),
		),
		tan(x1+pow(.7,z,)) < sin(z1+pow(.9,x,)+.2*x1),
	)
	*vec4f(vec3f(select(.3,1.,is_siang(),)),1.,);
}

@vertex fn rumput_vert(
	@builtin(vertex_index) vi:u32,
	@builtin(instance_index) ii:u32,
	
	@location(0) pos:vec3f,
)-> vout4{
	let seek = misc.seek;
	var p = vec3f(.0); //instance
	let fii = f32(ii);
	
	p.x = ((fii*.11) % 888.)-444.;
	p.z = ((fii*4.7) % 888.)-444.;
	
	p += randomxz0(p);
	
	p.y = pos.y*((fii*2.51) % 5.);
	
	
	
	//ani
	let tumbuh = clamp(seek-41.,.0,9.,)/9.;
	
	p.z += pow(p.y,2.,)
	*(1.+asft(
		fii +seek*2.7*((fii % .711)+.6)
	))
	*.01;
	
	
	
	
	let pout = vec4f(
		(pos+p)
		*vec3f(1.,tumbuh,1.,)
		*f32(41. < seek)
	,1.,);
	
	let aaaaa = ani[0];
	
	var cam = misc.view;
	return vout4(
		misc.persp*fcam()*pout,
		//pout,
		fii,
		p,
	);
}

struct vout4{
	@builtin(position) posout:vec4f,
	//@location(0) p:vec4f,
	@location(1) fii:f32,
	@location(2) pinst:vec3f,
}

@fragment fn rumput_frag(
	o:vout4,
)-> @location(0) vec4f{
	return vec4f(.0,.6,.0,1.,)
	*vec4f(
		vec3f(select(.3,1.,is_siang(),))
		*(1. -asft(misc.seek +o.fii*.31)*.4)
	,1.,)
	;
}

@vertex fn kunang_vert(
	//@builtin(vertex_index) vi:u32,
	@builtin(instance_index) ii:u32,
	
	@location(0) meshid:i32,
	@location(1) pos:vec3f,
)-> vout5{
	let seek = misc.seek;
	let fii = f32(ii);
	var p = pos; //vertex
	var p1 = vec3f(.0); //vertex
	var p2 = vec3f(.0); //instance	
	var m = matide;
	var m1 = matide;
	var _using = false;





//bukan sayap
_using = meshid != Ks;
	
	p1 = pos *f32(45.+fii*.1 < seek);
	m1 = putarY(seek*.3);
	m1[3] = vec4f(.0,11.,.0,1.,);
	
	m1[3].x = (asft(fii*.06112)+.5)*444.;
	m1[3].z = (asft(fii*.07191)+.5)*444.;
	
	m1[3].x += sin(seek+fii*.3117)*15.107;
	m1[3].y += sin(seek*.2+fii*.7372)*22.332 +22.;
	m1[3].z += sin(seek+fii*.9919)*18.721;
	
	let j = distance(m1[3].xyz,misc.cam[3].xyz,); //jarak kamera
	
p = select(p,p1,_using,);
m = array(m,m1,)[u32(_using)];





//sayap
_using = meshid == Ks;
	
	var putar = asft(seek*88.+fii)*2.5 +1.3;
	putar *= select(1.,-1.,pos.x < .0,);
	m1 = m1*putarZ(putar);
	
p = select(p,p1,_using,);
m = array(m,m1,)[u32(_using)];






	let pout = m*vec4f(p,1.,);
	
	let aaaaa = ani[0];
	
	var cam = misc.view;
	return vout5(
		misc.persp*fcam()*pout,
		vec4f(pos,1.,),
		meshid,
		j,
		fii,
	);
}

struct vout5{
	@builtin(position) posout:vec4f,
	@location(0) p:vec4f,
	@location(1) @interpolate(flat) meshid:i32,
	@location(2) j:f32,
	@location(3) fii:f32,
}

@fragment fn kunang_frag(
	o:vout5,
)-> @location(0) vec4f{
	
	let hitam = vec4f(.0,.0,.0,1.,);
	let kuning = vec4f(.8,1.,.0,1.,);
	let putih = vec4f(1.,1.,1.,.5,);
	
	let badan = select(
		hitam,
		kuning,
		o.p.z < -.01,
	);
	let sayap = putih;
	
	let cerah = o.j*sin(misc.seek*5.+o.fii*3.11);
	let sinar0 = vec4f(kuning.rgb,.008*cerah,);
	let sinar1 = vec4f(kuning.rgb,.005*cerah,);
	
	var warna = select(badan,sayap,o.meshid == Ks,);
	warna = select(warna,sinar0,o.meshid == Ksi0);
	warna = select(warna,sinar1,o.meshid == Ksi1);
	
	return warna;
}

//kunang
const Kb = 1i; // badan
const Ks = 2i; // sayap
const Ksi0 = 3i; // sinar0
const Ksi1 = 4i; // sinar1

@vertex fn air_vert(
	@builtin(vertex_index) vi:u32,
	
	@location(0) meshid:i32,
	@location(1) pos:vec3f,
	@location(2) tex:vec2f,
)-> vout2{
	let seek = misc.seek;
	var p = pos;
	var p1 = pos;
	var m = matide;
	var m1 = matide;
	var _using = false;





//bocor
_using = meshid == Abo;

	let bot = 13. < seek && seek < 39.; //tampil
	p1 = pos;
	p1 = select(vec3f(0.),p1,bot,);

p = select(p,p1,_using,);





//banjir
_using = meshid == Aba;

	let bat = 14. < seek && seek < 40.; //tampil
	p1 = pos;
	p1 = select(vec3f(0.),p1,bat,);

p = select(p,p1,_using,);





//arus0
_using = meshid == Aa0;

	let a0t = 7. < seek && seek < 30.; //tampil
	p1 = pos;
	p1 = select(vec3f(0.),p1,a0t,);

p = select(p,p1,_using,);





//arus1
_using = meshid == Aa1;

	let a1t = 30. < seek && seek < 33.5; //tampil
	p1 = pos;
	p1 = select(vec3f(0.),p1,a1t,);

p = select(p,p1,_using,);





//level
_using = meshid == Al;

	let lt = 7. < seek; //tampil
	p1 = pos;
	p1 = select(vec3f(0.),p1,lt,);
	
	m1 = matide;
	m1[1][1] = clamp(
		(seek-10.)*1.8
	,.2,2.8,);

p = select(p,p1,_using,);
m = array(m,m1,)[u32(_using)];





	let pout = m*vec4f(p,1.,);
	
	let aaaaa = ani[0];
	
	var cam = misc.view;
	return vout2(
		misc.persp*fcam()*pout,
		tex,
		sin(f32(vi))*1.4,
	);
}

struct vout2{
	@builtin(position) posout:vec4f,
	@location(0) tex:vec2f,
	@location(1) vi:f32,
}

@fragment fn air_frag(
	o:vout2,
)-> @location(0) vec4f{
	let t1 = misc.seek*5.;
	let x = o.tex.x  +asft(t1*.4)*2.1;
	let y = o.tex.y  +t1  +asft(t1*.5+o.vi)*.5;
	
	let aa = (sin(y)+2.3)*1.8;
	let bb = sin(x*.5);
	let cc = bb*-.5;
	
	let fac0 =

	f32(
			bb+4.1
		<
			aa
	) * f32(
			aa  +asft(misc.seek  +o.tex.x*.1  +o.tex.y*.4)+.3
		<
			bb+4.5
	)
+
	f32(
			cc+3.2
		<
			aa
	) * f32(
			aa
		<
			cc+3.9
	)

	;
	
	return select(
		vec4f(.5,.9,.9,.9,),
		vec4f(.0,.9,.9,.5,),
		fac0 < .5,
	);
}

//air
const Abo = 1i; // bocor
const Aba = 2i; // banjir
const Aa0 = 3i; // arus0
const Aa1 = 4i; // arus1
const Al = 5i; // level

@vertex fn langit_vert(
	@builtin(vertex_index) vi:u32,
	
	@location(0) meshid:i32,
	@location(1) pos:vec3f,
)-> vout3{
	let AAANNNNIIIIIICCAAMMM = anicam;
	var p = pos;
	var p1 = p;
	var warna = vec4f(.9);
	var warna1 = vec4f(.9);
	var m = matide;
	var m1 = m;
	var _using = false; // untuk select





//langit
_using = meshid == Ll;
	
	p1 = pos;
	m1 = matide;
	warna1 = select(vec4f(.0,.0,.0,1.,),vec4f(.3,.7,.9,1.,),is_siang(),);
	
p = select(p,p1,_using,);
m = array(m,m1,)[u32(_using)];
warna = select(warna,warna1,_using,);





//matahari
_using = meshid == Lm;
	
	p1 = pos;
	m1 = fcam();
	m1 = misc.persp * mat4x4f(
		vec4f(normalize(m1[0].xyz),.0,),
		vec4f(normalize(m1[1].xyz),.0,),
		vec4f(normalize(m1[2].xyz),.0,),
		vec4f(.0,.0,.0,1.,),
	)
	*array(m_arahmalam,m_arahsiang,)[u32(is_siang())];
	warna1 = vec4f(1.);
	
p = select(p,p1,_using,);
m = array(m,m1,)[u32(_using)];
warna = select(warna,warna1,_using,);





//bnitang
_using = meshid == Lbi;
	
	p1 = pos *f32(!is_siang());
	//m1 dari mataahari
	warna1 = vec4f(1.);
	
p = select(p,p1,_using,);
m = array(m,m1,)[u32(_using)];
warna = select(warna,warna1,_using,);





//bulan
_using = meshid == Lbu;
	
	p1 = pos *f32(!is_siang());
	//m1 dari mataahari
	warna1 = vec4f(1.,1.,.5,1.,);
	
p = select(p,p1,_using,);
m = array(m,m1,)[u32(_using)];
warna = select(warna,warna1,_using,);





	let pout = m*vec4f(p,1.,);
	
	let aaaaa = ani[0];
	
	return vout3(
		pout,
		warna,
	);
}

struct vout3{
	@builtin(position) posout:vec4f,
	@location(0) warna:vec4f,
}

@fragment fn langit_frag(
	o:vout3,
)-> @location(0) vec4f{
	return o.warna;
}

//langit
const Ll = 1i; //langit
const Lm = 2i; //matahari
const Lbi = 3i; //bintang
const Lbu = 4i; //bulan

@vertex fn CAM_vert(
)-> @builtin(position) vec4f {
	let AAANNNNIIIIIICCAAMMM = anicam;
	let seek = misc.seek;
	
	let aaaaa = ani[0];
	
	
	return vec4f(.0);
}

//


@fragment fn CAM_frag(
)-> @location(0) vec4f {
	return vec4f(.0);
}

/*










*/

const weiarr = array(
vec3f(0.000000, 1.000000, 0.000000,), // 0  
vec3f(0.000000, 0.933334, 0.066667,), // 1  
vec3f(0.000000, 0.866667, 0.133334,), // 2  
vec3f(0.000000, 0.800000, 0.200000,), // 3  
vec3f(0.000000, 0.733334, 0.266667,), // 4  
vec3f(0.000000, 0.666667, 0.333334,), // 5  
vec3f(0.000000, 0.600000, 0.400000,), // 6  
vec3f(0.000000, 0.533334, 0.466667,), // 7  
vec3f(0.000000, 0.466667, 0.533334,), // 8  
vec3f(0.000000, 0.400000, 0.600000,), // 9  
vec3f(0.000000, 0.333334, 0.666667,), // 10 
vec3f(0.000000, 0.266667, 0.733334,), // 11 
vec3f(0.000000, 0.200000, 0.800000,), // 12 
vec3f(0.000000, 0.133334, 0.866667,), // 13 
vec3f(0.000000, 0.066667, 0.933334,), // 14 
vec3f(0.000000, 0.000000, 1.000000,), // 15 
vec3f(0.066667, 0.933334, 0.000000,), // 16 
vec3f(0.066667, 0.866667, 0.066667,), // 17 
vec3f(0.066667, 0.800000, 0.133334,), // 18 
vec3f(0.066667, 0.733334, 0.200000,), // 19 
vec3f(0.066667, 0.666667, 0.266667,), // 20 
vec3f(0.066667, 0.600000, 0.333334,), // 21 
vec3f(0.066667, 0.533334, 0.400000,), // 22 
vec3f(0.066667, 0.466667, 0.466667,), // 23 
vec3f(0.066667, 0.400000, 0.533334,), // 24 
vec3f(0.066667, 0.333334, 0.600000,), // 25 
vec3f(0.066667, 0.266667, 0.666667,), // 26 
vec3f(0.066667, 0.200000, 0.733334,), // 27 
vec3f(0.066667, 0.133334, 0.800000,), // 28 
vec3f(0.066667, 0.066667, 0.866667,), // 29 
vec3f(0.066667, 0.000000, 0.933334,), // 30 
vec3f(0.133334, 0.866667, 0.000000,), // 31 
vec3f(0.133334, 0.800000, 0.066667,), // 32 
vec3f(0.133334, 0.733334, 0.133334,), // 33 
vec3f(0.133334, 0.666667, 0.200000,), // 34 
vec3f(0.133334, 0.600000, 0.266667,), // 35 
vec3f(0.133334, 0.533334, 0.333334,), // 36 
vec3f(0.133334, 0.466667, 0.400000,), // 37 
vec3f(0.133334, 0.400000, 0.466667,), // 38 
vec3f(0.133334, 0.333334, 0.533334,), // 39 
vec3f(0.133334, 0.266667, 0.600000,), // 40 
vec3f(0.133334, 0.200000, 0.666667,), // 41 
vec3f(0.133334, 0.133334, 0.733334,), // 42 
vec3f(0.133334, 0.066667, 0.800000,), // 43 
vec3f(0.133334, 0.000000, 0.866667,), // 44 
vec3f(0.200000, 0.800000, 0.000000,), // 45 
vec3f(0.200000, 0.733334, 0.066667,), // 46 
vec3f(0.200000, 0.666667, 0.133334,), // 47 
vec3f(0.200000, 0.600000, 0.200000,), // 48 
vec3f(0.200000, 0.533334, 0.266667,), // 49 
vec3f(0.200000, 0.466667, 0.333334,), // 50 
vec3f(0.200000, 0.400000, 0.400000,), // 51 
vec3f(0.200000, 0.333334, 0.466667,), // 52 
vec3f(0.200000, 0.266667, 0.533334,), // 53 
vec3f(0.200000, 0.200000, 0.600000,), // 54 
vec3f(0.200000, 0.133334, 0.666667,), // 55 
vec3f(0.200000, 0.066667, 0.733334,), // 56 
vec3f(0.200000, 0.000000, 0.800000,), // 57 
vec3f(0.266667, 0.733334, 0.000000,), // 58 
vec3f(0.266667, 0.666667, 0.066667,), // 59 
vec3f(0.266667, 0.600000, 0.133334,), // 60 
vec3f(0.266667, 0.533334, 0.200000,), // 61 
vec3f(0.266667, 0.466667, 0.266667,), // 62 
vec3f(0.266667, 0.400000, 0.333334,), // 63 
vec3f(0.266667, 0.333334, 0.400000,), // 64 
vec3f(0.266667, 0.266667, 0.466667,), // 65 
vec3f(0.266667, 0.200000, 0.533334,), // 66 
vec3f(0.266667, 0.133334, 0.600000,), // 67 
vec3f(0.266667, 0.066667, 0.666667,), // 68 
vec3f(0.266667, 0.000000, 0.733334,), // 69 
vec3f(0.333334, 0.666667, 0.000000,), // 70 
vec3f(0.333334, 0.600000, 0.066667,), // 71 
vec3f(0.333334, 0.533334, 0.133334,), // 72 
vec3f(0.333334, 0.466667, 0.200000,), // 73 
vec3f(0.333334, 0.400000, 0.266667,), // 74 
vec3f(0.333334, 0.333334, 0.333334,), // 75 
vec3f(0.333334, 0.266667, 0.400000,), // 76 
vec3f(0.333334, 0.200000, 0.466667,), // 77 
vec3f(0.333334, 0.133334, 0.533334,), // 78 
vec3f(0.333334, 0.066667, 0.600000,), // 79 
vec3f(0.333334, 0.000000, 0.666667,), // 80 
vec3f(0.400000, 0.600000, 0.000000,), // 81 
vec3f(0.400000, 0.533334, 0.066667,), // 82 
vec3f(0.400000, 0.466667, 0.133334,), // 83 
vec3f(0.400000, 0.400000, 0.200000,), // 84 
vec3f(0.400000, 0.333334, 0.266667,), // 85 
vec3f(0.400000, 0.266667, 0.333334,), // 86 
vec3f(0.400000, 0.200000, 0.400000,), // 87 
vec3f(0.400000, 0.133334, 0.466667,), // 88 
vec3f(0.400000, 0.066667, 0.533334,), // 89 
vec3f(0.400000, 0.000000, 0.600000,), // 90 
vec3f(0.466667, 0.533334, 0.000000,), // 91 
vec3f(0.466667, 0.466667, 0.066667,), // 92 
vec3f(0.466667, 0.400000, 0.133334,), // 93 
vec3f(0.466667, 0.333334, 0.200000,), // 94 
vec3f(0.466667, 0.266667, 0.266667,), // 95 
vec3f(0.466667, 0.200000, 0.333334,), // 96 
vec3f(0.466667, 0.133334, 0.400000,), // 97 
vec3f(0.466667, 0.066667, 0.466667,), // 98 
vec3f(0.466667, 0.000000, 0.533334,), // 99 
vec3f(0.533334, 0.466667, 0.000000,), // 100
vec3f(0.533334, 0.400000, 0.066667,), // 101
vec3f(0.533334, 0.333334, 0.133334,), // 102
vec3f(0.533334, 0.266667, 0.200000,), // 103
vec3f(0.533334, 0.200000, 0.266667,), // 104
vec3f(0.533334, 0.133334, 0.333334,), // 105
vec3f(0.533334, 0.066667, 0.400000,), // 106
vec3f(0.533334, 0.000000, 0.466667,), // 107
vec3f(0.600000, 0.400000, 0.000000,), // 108
vec3f(0.600000, 0.333334, 0.066667,), // 109
vec3f(0.600000, 0.266667, 0.133334,), // 110
vec3f(0.600000, 0.200000, 0.200000,), // 111
vec3f(0.600000, 0.133334, 0.266667,), // 112
vec3f(0.600000, 0.066667, 0.333334,), // 113
vec3f(0.600000, 0.000000, 0.400000,), // 114
vec3f(0.666667, 0.333334, 0.000000,), // 115
vec3f(0.666667, 0.266667, 0.066667,), // 116
vec3f(0.666667, 0.200000, 0.133334,), // 117
vec3f(0.666667, 0.133334, 0.200000,), // 118
vec3f(0.666667, 0.066667, 0.266667,), // 119
vec3f(0.666667, 0.000000, 0.333334,), // 120
vec3f(0.733334, 0.266667, 0.000000,), // 121
vec3f(0.733334, 0.200000, 0.066667,), // 122
vec3f(0.733334, 0.133334, 0.133334,), // 123
vec3f(0.733334, 0.066667, 0.200000,), // 124
vec3f(0.733334, 0.000000, 0.266667,), // 125
vec3f(0.800000, 0.200000, 0.000000,), // 126
vec3f(0.800000, 0.133334, 0.066667,), // 127
vec3f(0.800000, 0.066667, 0.133334,), // 128
vec3f(0.800000, 0.000000, 0.200000,), // 129
vec3f(0.866667, 0.133334, 0.000000,), // 130
vec3f(0.866667, 0.066667, 0.066667,), // 131
vec3f(0.866667, 0.000000, 0.133334,), // 132
vec3f(0.933334, 0.066667, 0.000000,), // 133
vec3f(0.933334, 0.000000, 0.066667,), // 134
vec3f(1.000000, 0.000000, 0.000000,), // 135
vec3f(0.022223, 0.955556, 0.022223,), // 136
vec3f(0.022223, 0.888889, 0.088889,), // 137
vec3f(0.022223, 0.822223, 0.155556,), // 138
vec3f(0.022223, 0.755556, 0.222223,), // 139
vec3f(0.022223, 0.688889, 0.288889,), // 140
vec3f(0.022223, 0.622223, 0.355556,), // 141
vec3f(0.022223, 0.555556, 0.422223,), // 142
vec3f(0.022223, 0.488889, 0.488889,), // 143
vec3f(0.022223, 0.422223, 0.555556,), // 144
vec3f(0.022223, 0.355556, 0.622223,), // 145
vec3f(0.022223, 0.288889, 0.688889,), // 146
vec3f(0.022223, 0.222223, 0.755556,), // 147
vec3f(0.022223, 0.155556, 0.822223,), // 148
vec3f(0.022223, 0.088889, 0.888889,), // 149
vec3f(0.022222, 0.022222, 0.955556,), // 150
vec3f(0.088889, 0.888889, 0.022223,), // 151
vec3f(0.088889, 0.822223, 0.088889,), // 152
vec3f(0.088889, 0.755556, 0.155556,), // 153
vec3f(0.088889, 0.688889, 0.222223,), // 154
vec3f(0.088889, 0.622223, 0.288889,), // 155
vec3f(0.088889, 0.555556, 0.355556,), // 156
vec3f(0.088889, 0.488889, 0.422223,), // 157
vec3f(0.088889, 0.422223, 0.488889,), // 158
vec3f(0.088889, 0.355556, 0.555556,), // 159
vec3f(0.088889, 0.288889, 0.622223,), // 160
vec3f(0.088889, 0.222223, 0.688889,), // 161
vec3f(0.088889, 0.155556, 0.755556,), // 162
vec3f(0.088889, 0.088889, 0.822223,), // 163
vec3f(0.088889, 0.022223, 0.888889,), // 164
vec3f(0.155556, 0.822223, 0.022223,), // 165
vec3f(0.155556, 0.755556, 0.088889,), // 166
vec3f(0.155556, 0.688889, 0.155556,), // 167
vec3f(0.155556, 0.622223, 0.222223,), // 168
vec3f(0.155556, 0.555556, 0.288889,), // 169
vec3f(0.155556, 0.488889, 0.355556,), // 170
vec3f(0.155556, 0.422223, 0.422223,), // 171
vec3f(0.155556, 0.355556, 0.488889,), // 172
vec3f(0.155556, 0.288889, 0.555556,), // 173
vec3f(0.155556, 0.222223, 0.622223,), // 174
vec3f(0.155556, 0.155556, 0.688889,), // 175
vec3f(0.155556, 0.088889, 0.755556,), // 176
vec3f(0.155556, 0.022223, 0.822223,), // 177
vec3f(0.222223, 0.755556, 0.022223,), // 178
vec3f(0.222223, 0.688889, 0.088889,), // 179
vec3f(0.222223, 0.622223, 0.155556,), // 180
vec3f(0.222223, 0.555556, 0.222223,), // 181
vec3f(0.222223, 0.488889, 0.288889,), // 182
vec3f(0.222223, 0.422223, 0.355556,), // 183
vec3f(0.222223, 0.355556, 0.422223,), // 184
vec3f(0.222223, 0.288889, 0.488889,), // 185
vec3f(0.222223, 0.222223, 0.555556,), // 186
vec3f(0.222223, 0.155556, 0.622223,), // 187
vec3f(0.222223, 0.088889, 0.688889,), // 188
vec3f(0.222223, 0.022223, 0.755556,), // 189
vec3f(0.288889, 0.688889, 0.022223,), // 190
vec3f(0.288889, 0.622223, 0.088889,), // 191
vec3f(0.288889, 0.555556, 0.155556,), // 192
vec3f(0.288889, 0.488889, 0.222223,), // 193
vec3f(0.288889, 0.422223, 0.288889,), // 194
vec3f(0.288889, 0.355556, 0.355556,), // 195
vec3f(0.288889, 0.288889, 0.422223,), // 196
vec3f(0.288889, 0.222223, 0.488889,), // 197
vec3f(0.288889, 0.155556, 0.555556,), // 198
vec3f(0.288889, 0.088889, 0.622223,), // 199
vec3f(0.288889, 0.022223, 0.688889,), // 200
vec3f(0.355556, 0.622223, 0.022223,), // 201
vec3f(0.355556, 0.555556, 0.088889,), // 202
vec3f(0.355556, 0.488889, 0.155556,), // 203
vec3f(0.355556, 0.422223, 0.222223,), // 204
vec3f(0.355556, 0.355556, 0.288889,), // 205
vec3f(0.355556, 0.288889, 0.355556,), // 206
vec3f(0.355556, 0.222223, 0.422223,), // 207
vec3f(0.355556, 0.155556, 0.488889,), // 208
vec3f(0.355556, 0.088889, 0.555556,), // 209
vec3f(0.355556, 0.022223, 0.622223,), // 210
vec3f(0.422223, 0.555556, 0.022223,), // 211
vec3f(0.422223, 0.488889, 0.088889,), // 212
vec3f(0.422223, 0.422223, 0.155556,), // 213
vec3f(0.422223, 0.355556, 0.222223,), // 214
vec3f(0.422223, 0.288889, 0.288889,), // 215
vec3f(0.422223, 0.222223, 0.355556,), // 216
vec3f(0.422223, 0.155556, 0.422223,), // 217
vec3f(0.422223, 0.088889, 0.488889,), // 218
vec3f(0.422223, 0.022223, 0.555556,), // 219
vec3f(0.488889, 0.488889, 0.022223,), // 220
vec3f(0.488889, 0.422223, 0.088889,), // 221
vec3f(0.488889, 0.355556, 0.155556,), // 222
vec3f(0.488889, 0.288889, 0.222223,), // 223
vec3f(0.488889, 0.222223, 0.288889,), // 224
vec3f(0.488889, 0.155556, 0.355556,), // 225
vec3f(0.488889, 0.088889, 0.422223,), // 226
vec3f(0.488889, 0.022223, 0.488889,), // 227
vec3f(0.555556, 0.422223, 0.022223,), // 228
vec3f(0.555556, 0.355556, 0.088889,), // 229
vec3f(0.555556, 0.288889, 0.155556,), // 230
vec3f(0.555556, 0.222223, 0.222223,), // 231
vec3f(0.555556, 0.155556, 0.288889,), // 232
vec3f(0.555556, 0.088889, 0.355556,), // 233
vec3f(0.555556, 0.022223, 0.422223,), // 234
vec3f(0.622223, 0.355556, 0.022223,), // 235
vec3f(0.622223, 0.288889, 0.088889,), // 236
vec3f(0.622223, 0.222223, 0.155556,), // 237
vec3f(0.622223, 0.155556, 0.222223,), // 238
vec3f(0.622223, 0.088889, 0.288889,), // 239
vec3f(0.622223, 0.022223, 0.355556,), // 240
vec3f(0.688889, 0.288889, 0.022223,), // 241
vec3f(0.688889, 0.222223, 0.088889,), // 242
vec3f(0.688889, 0.155556, 0.155556,), // 243
vec3f(0.688889, 0.088889, 0.222223,), // 244
vec3f(0.688889, 0.022223, 0.288889,), // 245
vec3f(0.755556, 0.222223, 0.022223,), // 246
vec3f(0.755556, 0.155556, 0.088889,), // 247
vec3f(0.755556, 0.088889, 0.155556,), // 248
vec3f(0.755556, 0.022223, 0.222223,), // 249
vec3f(0.822223, 0.155556, 0.022223,), // 250
vec3f(0.822223, 0.088889, 0.088889,), // 251
vec3f(0.822223, 0.022223, 0.155556,), // 252
vec3f(0.888889, 0.088889, 0.022223,), // 253
vec3f(0.888889, 0.022223, 0.088889,), // 254
vec3f(0.955556, 0.022223, 0.022223,), // 255
);

fn i_4u(i32_value: i32) -> vec4<u32> { // extract_i32_to_vec4u
    // Extract individual bytes using bitwise operations
    let byte0: u32 = u32((i32_value >> 0) & 0xFF);  // Least significant byte
    let byte1: u32 = u32((i32_value >> 8) & 0xFF);
    let byte2: u32 = u32((i32_value >> 16) & 0xFF);
    let byte3: u32 = u32((i32_value >> 24) & 0xFF); // Most significant byte

    // Return the extracted bytes as a vec4<u32>
    return vec4<u32>(byte0, byte1, byte2, byte3);
}

fn fnor(
	m:mat4x4f,
	n:i32,
)->vec3f{
	return mat3x3f(
		m[0].xyz,
		m[1].xyz,
		m[2].xyz,
	)
	*(
		vec3f(i_4u(n).xyz)
		/127.5
		-1.
	);
}

fn fsinar(
	warna:vec3f,
	nor:vec3f,
)->vec3f{
	let berat = dot(
		nor,
		select(arahmalam,arahsiang,is_siang(),),
	);
	let wb = select(wbm,wbs,is_siang(),);
	let wd = select(wdm,wds,is_siang(),);
	let wbaru = select(wb,wd,.5 < berat,);
	return mix(warna,wbaru.xyz,wbaru.w,);
}

//anime slow fast timing
fn asft(
	t1:f32,
)->f32{
	let t = t1%3.;
	return (3.*abs(t-1.)-t-3)/4.;
}

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

fn is_siang(
)->bool{
	let s = misc.seek;
	return 8. < s && s < 45.;
}

fn randomxz0(
	p:vec3f,
)->vec3f{
	return vec3f(
		sin(f32(u32(p.x*999.2) << u32(p.z*555.7)))*22.	+sin(p.z)*11.,
		0.,
		sin(f32(u32(p.x*777.4) | u32(p.z*444.1)))*22.	+sin(p.x)*13.,
	);
}

fn fcam()->mat4x4f{
	return array(
		anicam,//misc.persp*anicam,
		misc.invcam,//misc.view,
	)[misc.freecam];
}
