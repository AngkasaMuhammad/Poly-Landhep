
/*

semua @vertex harus ada @builtin(instance_index)

*/



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
//@group(0) @binding(1) var<storage> aniresoread:array<mat4x4f>;
@group(0) @binding(3) var<storage> camresoread:array<mat4x4f>;
@group(0) @binding(4) var<storage> gloresoread:array<mat4x4f>;

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

@vertex fn panah_vert(
	
	@location(0) pos:vec3f,
	
	@builtin(instance_index) ii_:u32, //semua @vertex harus ada @builtin(instance_index)
)-> panah_out {
	
	var pout = vec4f(pos,1.,);
	
	return panah_out(
		fcam()*camresoread[1]*pout,
	);
}

struct panah_out{
	@builtin(position) posout:vec4f,
}

@fragment fn panah_frag(
)-> @location(0) vec4f {
	return vec4f(
		vec3f(sin(misc.seek*11.)+.5),
		.1,
	);
}

@vertex fn kain0_vert(
	
	@location(0) jw:vec4u, //3 joints 1 weight
	@location(1) nor:vec4f,
	@location(2) pos:vec3f,
	
	@builtin(instance_index) ii_:u32,
)-> kain0_out {
	
	var pout = vec4f(pos,1.,);
	
	let wei = weiarr[jw[3]];
	let mout =
		gloresoread[jw[0]]*wei.x+
		gloresoread[jw[1]]*wei.y+
		gloresoread[jw[2]]*wei.z
	;
	
	let nout = fnor(mout,nor.xyz,);
	
	pout = mout*pout;
	
	return kain0_out(
		fcam()*pout,
		pos,
		nout,
	);
}

struct kain0_out{
	@builtin(position) posout:vec4f,
	@location(14) p0:vec3f,
	@location(5) nor:vec3f,
}

@fragment fn kain0_frag(
	o:kain0_out,
)-> @location(0) vec4f {
	let wa = vec4f(.1,.1,.1,.5,);
	var wa1 = wa*select(
		1.,
		.8,
		corak0(o.p0.xyz*5.),
	);
	
	let wa_out = fsinar(wa1.rgb,o.nor,);
	return vec4f(wa_out,wa.a,) +vec4f(-o.p0.x*.02);
}

@vertex fn chara0_vert(
	
	@location(0) jw:vec4u, //3 joints 1 weight
	@location(1) nor:vec4f,
	@location(2) pos:vec3f,
	@location(3) tex:vec2f,
	
	@builtin(instance_index) ii_:u32,
)-> chara0_out {
	let seekcast = bitcast<u32>(misc.seek);
	
	var pout = vec4f(pos,1.,);
	
	let wei = weiarr[jw[3]];
	var mout =
		gloresoread[jw[0]]*wei.x+
		gloresoread[jw[1]]*wei.y+
		gloresoread[jw[2]]*wei.z
	;
	//mout = matide;
	let nout = fnor(mout,nor.xyz,);
	
	pout = mout*pout;
//sampe sini, bikin kejangkejang bocchi
	pout += vec4f(vec3f(
		acakbit(pout.yzx,seekcast,),
		acakbit(pout.zxy,seekcast,),
		acakbit(pout.zyx,seekcast,),
	)*1.5*f32(58. < misc.seek),.0,);
	
	return chara0_out(
		fcam()*pout,
		pos,
		nout,
		tex,
	);
}

struct chara0_out{
	@builtin(position) posout:vec4f,
	@location(14) p0:vec3f,
	@location(5) nor:vec3f,
	@location(1) tex:vec2f,
}

@fragment fn chara0_frag(
	o:chara0_out,
)-> @location(0) vec4f {
	return palette0(
		o.p0*5.,
		o.nor,
		o.tex,
	);
}



fn palette0(
	p0:vec3f,
	nor:vec3f,
	tex:vec2f,
)-> vec4f {
	let x = tex.x;
	let y = tex.y;
	
	let ffF = vec4f(.398,.308,.251,1.,);
	let ffT = vec4f(1.,);
	let ggF = vec4f(.305,.309,.6,1.,);
	let ggT = vec4f(.424,.166,.397,1.,);
	let hhF = vec4f(1.,.0,.0,1.,);
	let hhT = vec4f(.0,1.,.0,1.,);
	let iiF = vec4f(.574,.545,.545,1.,);
	let iiT = vec4f(1.,.982,.687,1.,);
	let jjF = vec4f(.014,.0,1.,1.,);
	let kkF = vec4f(.397,.0,.0,1.,);
	let kkT = vec4f(.0,.0,.0,1.,);
	let mmF = belahapokat(p0);
	let mmT = vec4f(.331,.578,.007,1.,);
	let nnF = vec4f(.811,1.,.092,1.,);
	let nnT = vec4f(.731,.882,.09,1.,);
	
	let nn = select(nnF,nnT,		y > 13.		);
	let mm = select(mmF,mmT,		y > 11.		);
	let ll = select(mm,nn,		y > 12.		);
	let kk = select(kkF,kkT,		y > 10.		);
	let jj = select(jjF,ll,		y > 10.		);
	let ii = select(iiF,iiT,		y > -10.		);
	let hh = select(hhF,hhT,		y > -10.		);
	let gg = select(ggF,ggT,		x > 10.		);
	let ff = select(ffF,ffT,		x > 10.		);
	let ee = select(jj,kk,		x > -10.		);
	let dd = select(hh,ii,		x > -10.		);
	let cc = select(ff,gg,		y > .0		);
	let bb = select(dd,ee,		y > .0		);
	let aa = select(bb,cc,		x > .0		);
	
	
	
	
	let wa = aa;
	var wa1 = wa /* *select(
		1.,
		.9,
		corak0(p0*5.),
	) */ ;
	
	let wa_out = fsinar(wa1.rgb,nor,);
	return vec4f(wa_out,wa.a,) ;
	//return vec4f(aa);
}


fn belahapokat(
	p0:vec3f,
)-> vec4f {
	let ijo = vec4f(.0,.363,.046,1.,);
	let mulai0 = 1.8865+9.;
	let mulai1 = 1.889+9.;
	
	let belah = -.05 < p0.z+sin((p0.x+p0.y)*66.)*.01;
	let p1 = p0*11.;
	let getar = p0.z+5. < tan(pow(-p1.z,2.,)*.07+p1.y);
	
	return ijo
	+fxfade(mulai0,p0,getar,)
	+fxfade(mulai1,p0,belah,);
}



fn fxfade(
	mulai:f32,
	p0:vec3f,
	muncul:bool,
)-> vec4f {
	let t0 = misc.seek-mulai;
	return vec4f(
		f32(
			muncul && p0.y*.0001 < t0
		)
		*clamp(1.-t0*444.,.0,1.,)
	);
}

@vertex fn subtitle_vert(
	
	@location(0) start:f32,
	@location(1) len:f32,
	@location(2) pos:vec3f,
	
	@builtin(instance_index) ii_:u32,
)-> subtitle_out {
	
	var pout =
		vec4f(pos,1.,)
		*f32(start < misc.seek && misc.seek < start+len)
	;
	
	return subtitle_out(
		pout,
	);
}

struct subtitle_out{
	@builtin(position) posout:vec4f,
}

@fragment fn subtitle_frag(
	
)-> @location(0) vec4f {
	return vec4f(1.);
}

@vertex fn bunga_vert(
	
	@location(0) nor:vec4f,
	@location(1) posv:vec3f,
	
	@location(2) petik:f32, ///mulai petik
	@location(3) posinst:vec3f,
	
	@builtin(instance_index) ii_:u32,
)-> bunga_out {
	
	let fii = f32(ii_);
	let mesh = u32(3. < posv.y); //1u = bunga atas
	var pout = vec4f(posv,1.,);
	var m = array(
		putarY(f32(ii_)),
		matide,
	)[mesh];
	m[3] = vec4f(posinst,1.,);
	
	pout = m*pout;



//animasi goyang +++++

let a5 = (misc.ranfl+fii*.237)%1.;
let seek = mix(misc.seek,misc.prevseek,a5,);
let seekpetik = seek-petik;
let a4 = sin(fii*2.1+seek*.4); //kecepatan0
let a3 = sin(fii)+7.; //kecepatan1
let a0 = pow(max(pout.y,.0,),2.,); //lengkung
let a1 = sin(fii+seek*a3)*.02*a4; //timer
let a2 = .05; //tarik
pout.x += a0*(a1+a2); //hasil

//++++++++++++++++++



//animasi bunga +++++
var m1 = matide;





//awal
var p2 = vec4f(posinst,1.,);		m1[3] = p2;
//naik
p2.y += 8.;		m1[3] = mix(m1[3],p2,		cublerp(seekpetik-.0)		,);

//kumpul
p2 = vec4f(.7,3.7,-1.5,1.,);		m1[3] = mix(m1[3],p2,		cublerp((seekpetik-5.6)*(.3+(fii%.2924)))		,);

//hilang
p2 = m1[3];		m1 *= mix(1.,.0,		cublerp((misc.seek-33.3)*1.4)		,);		m1[3] = p2;

//jadi pecut - muncul
let bjp = 40.031; //batas jadi pecut
let jadipecut0 = bjp < misc.seek;
p2 = vec4f(.0,47.,3.5,1.,);		m1 = array(m1,matide,)[u32(jadipecut0)];		m1[3] = select(m1[3],p2,jadipecut0,);

//jadi pecut - baris, slepet
m1 = anisle(m1,bjp,fii,);

//semua bunga mengecil & hilang
let s = cublerp(1.-(misc.seek-41.148));
m1[0u][0u] *= s;
m1[1u][1u] *= s;
m1[2u][2u] *= s;





//
m1 *= putarY(max(.0,(seekpetik-.8)*3.,));
var p1 = vec4f(posv,1.,);
p1.y -= 3.;
p1 = m1*p1;
p1 = mix(pout,p1,		cublerp(seekpetik)		,); //dari goyang ke tetap

//++++++++++++++++++




	pout = select(pout,p1,bool(mesh),);
	m = array(m,m1,)[mesh];
	let nout = fnor(m,nor.xyz,);
	return bunga_out(
		fcam()*pout,
		nout,
		mesh,
	);
}

struct bunga_out{
	@builtin(position) posout:vec4f,
	@location(0) nor:vec3f,
	@location(1) @interpolate(flat) mesh:u32,
}

@fragment fn bunga_frag(
	o:bunga_out,
)-> @location(0) vec4f {
	let nor = o.nor;
	let mesh = o.mesh;
	
	let wa1 = select(
		vec4f(.0,.5,.0,1.,),
		vec4f(.5,.0,.5,1.,),
		bool(mesh),
	);
	let wa_out = fsinar(wa1.rgb,nor,);
	return vec4f(wa_out,wa1.a,);
}

fn anisle(// animasi slepet
	m:mat4x4f,
	bjp:f32,
	fii:f32,
)->mat4x4f{
	var m1 = m;
	let t = misc.seek-bjp; //t lokal
	
//		40.8 -->> batas naik

	let turun = fii*.2  -pow(		max(.0,t-.7,)*22.		,2.,);
	//let naik = -fii*.2  -pow(		(.0)*22.		,2.,); //awal
	let naik = -4.-fii*.5  +(misc.seek-40.8)*111.; //baru
	
	let ysle = max(turun,naik,); //y lokal
	let p2 = vec4f(.0,50. +ysle ,8.5,1.,);
	m1[3] = mix(m1[3],p2,		clamp(t*(6./(fii*.0023+.4)),.0,1.,)		,);
	
	//let s = mix(.0,1.7,tanh(-turun+naik)*.5+.5,); //tanh() di beberapa browser & gpu muncul bug
	let s = mix(.0,1.7,atan((-turun+naik)*2.)/pi+.5,);
	m1[0][0] += s;
	m1[1][1] += s;
	m1[2][2] += s;
	
	return m1;
}

//anisle asli -->>

/*========
fn anisle(
	m:mat4x4f,
	bjp:f32,
	fii:f32,
)->mat4x4f{
	var m1 = m;
	//sle -->> slepet
	var tsle = tanh((misc.seek-bjp-.9)*11.)*11.+22.;
	
	tsle = fii*.2-(tsle-1.); //time tiap bunga
	
	let ysle = abs(tsle); //y lokal
	let p2 = vec4f(.0,50. +ysle ,8.5,1.,);
	m1[3] = mix(m1[3],p2,		clamp((misc.seek-bjp)*(6./(fii*.0023+.4)),.0,1.,)		,);
	
	let s = mix(.0,1.7,tanh(-tsle*2.7)*.5+.5,);
	m1[0u][0u] += s;
	m1[1u][1u] += s;
	m1[2u][2u] += s;
	
	return m1;
}
--------*/

@vertex fn duar_vert(
	@location(0) p:vec3f,
	
	//@builtin(vertex_index) vi:u32,
	@builtin(instance_index) ii_:u32,
)-> duar_out {
	let p1 = p*max(misc.seek-41.143,.0,)*222. +vec3f(.0,.0,8.5,);
	let pout = vec4f(p1,1.,);
	
	return duar_out(
		fcam()*pout,
	);
}

struct duar_out{
	@builtin(position) posout:vec4f,
}

@fragment fn duar_frag(
	
)-> @location(0) vec4f {
	
	let t = misc.seek-41.143;
	return vec4f(vec3f(1.),1.-t,);
}

/*










*/

const weiarr = array(

vec3f(0.577350,0.577350,0.577350,), //0  
vec3f(0.590167,0.590167,0.550823,), //1  
vec3f(0.603877,0.563619,0.563619,), //2  
vec3f(0.602901,0.602901,0.522514,), //3  
vec3f(0.617540,0.576371,0.535201,), //4  
vec3f(0.632175,0.547885,0.547885,), //5  
vec3f(0.615457,0.615457,0.492366,), //6  
vec3f(0.631055,0.588984,0.504844,), //7  
vec3f(0.646696,0.560470,0.517357,), //8  
vec3f(0.662266,0.529813,0.529813,), //9  
vec3f(0.627730,0.627730,0.460336,), //10 
vec3f(0.644305,0.601351,0.472490,), //11 
vec3f(0.660979,0.572848,0.484718,), //12 
vec3f(0.677631,0.542105,0.496929,), //13 
vec3f(0.694117,0.509019,0.509019,), //14 
vec3f(0.639602,0.639602,0.426401,), //15 
vec3f(0.657162,0.613351,0.438108,), //16 
vec3f(0.674882,0.584898,0.449921,), //17 
vec3f(0.692636,0.554109,0.461757,), //18 
vec3f(0.710271,0.520865,0.473514,), //19 
vec3f(0.727607,0.485071,0.485071,), //20 
vec3f(0.650945,0.650945,0.390567,), //21 
vec3f(0.669483,0.624851,0.401690,), //22 
vec3f(0.688247,0.596481,0.412948,), //23 
vec3f(0.707107,0.565685,0.424264,), //24 
vec3f(0.725901,0.532327,0.435540,), //25 
vec3f(0.744437,0.496292,0.446663,), //26 
vec3f(0.762493,0.457496,0.457496,), //27 
vec3f(0.661622,0.661622,0.352865,), //28 
vec3f(0.681115,0.635707,0.363261,), //29 
vec3f(0.700904,0.607450,0.373816,), //30 
vec3f(0.720854,0.576683,0.384456,), //31 
vec3f(0.740797,0.543251,0.395092,), //32 
vec3f(0.760530,0.507020,0.405616,), //33 
vec3f(0.779813,0.467888,0.415900,), //34 
vec3f(0.798369,0.425797,0.425797,), //35 
vec3f(0.671492,0.671492,0.313363,), //36 
vec3f(0.691898,0.645772,0.322886,), //37 
vec3f(0.712671,0.617649,0.332580,), //38 
vec3f(0.733674,0.586939,0.342381,), //39 
vec3f(0.754732,0.553470,0.352208,), //40 
vec3f(0.775632,0.517088,0.361961,), //41 
vec3f(0.796117,0.477670,0.371521,), //42 
vec3f(0.815892,0.435143,0.380750,), //43 
vec3f(0.834622,0.389490,0.389490,), //44 
vec3f(0.680414,0.680414,0.272166,), //45 
vec3f(0.701670,0.654892,0.280668,), //46 
vec3f(0.723364,0.626916,0.289346,), //47 
vec3f(0.745356,0.596285,0.298142,), //48 
vec3f(0.767467,0.562809,0.306987,), //49 
vec3f(0.789474,0.526316,0.315790,), //50 
vec3f(0.811107,0.486664,0.324443,), //51 
vec3f(0.832050,0.443760,0.332820,), //52 
vec3f(0.851943,0.397573,0.340777,), //53 
vec3f(0.870388,0.348155,0.348155,), //54 
vec3f(0.688247,0.688247,0.229416,), //55 
vec3f(0.710271,0.662919,0.236757,), //56 
vec3f(0.732798,0.635092,0.244266,), //57 
vec3f(0.755689,0.604551,0.251896,), //58 
vec3f(0.778761,0.571092,0.259587,), //59 
vec3f(0.801784,0.534522,0.267261,), //60 
vec3f(0.824475,0.494685,0.274825,), //61 
vec3f(0.846499,0.451466,0.282166,), //62 
vec3f(0.867472,0.404820,0.289157,), //63 
vec3f(0.886969,0.354787,0.295656,), //64 
vec3f(0.904534,0.301511,0.301511,), //65 
vec3f(0.694862,0.694862,0.185296,), //66 
vec3f(0.717547,0.669711,0.191346,), //67 
vec3f(0.740797,0.642024,0.197546,), //68 
vec3f(0.764471,0.611577,0.203859,), //69 
vec3f(0.788383,0.578147,0.210235,), //70 
vec3f(0.812296,0.541530,0.216612,), //71 
vec3f(0.835917,0.501550,0.222911,), //72 
vec3f(0.858898,0.458079,0.229039,), //73 
vec3f(0.880830,0.411054,0.234888,), //74 
vec3f(0.901263,0.360505,0.240337,), //75 
vec3f(0.919709,0.306570,0.245256,), //76 
vec3f(0.935674,0.249513,0.249513,), //77 
vec3f(0.700140,0.700140,0.140028,), //78 
vec3f(0.723364,0.675140,0.144673,), //79 
vec3f(0.747203,0.647576,0.149441,), //80 
vec3f(0.771517,0.617213,0.154303,), //81 
vec3f(0.796117,0.583819,0.159223,), //82 
vec3f(0.820764,0.547176,0.164153,), //83 
vec3f(0.845154,0.507093,0.169031,), //84 
vec3f(0.868927,0.463428,0.173785,), //85 
vec3f(0.891657,0.416107,0.178332,), //86 
vec3f(0.912871,0.365148,0.182574,), //87 
vec3f(0.932055,0.310685,0.186411,), //88 
vec3f(0.948683,0.252982,0.189737,), //89 
vec3f(0.962250,0.192450,0.192450,), //90 
vec3f(0.703985,0.703985,0.093865,), //91 
vec3f(0.727607,0.679100,0.097014,), //92 
vec3f(0.751882,0.651631,0.100251,), //93 
vec3f(0.776671,0.621336,0.103556,), //94 
vec3f(0.801784,0.587975,0.106905,), //95 
vec3f(0.826977,0.551318,0.110264,), //96 
vec3f(0.851943,0.511166,0.113592,), //97 
vec3f(0.876309,0.467365,0.116841,), //98 
vec3f(0.899640,0.419832,0.119952,), //99 
vec3f(0.921443,0.368577,0.122859,), //100
vec3f(0.941184,0.313728,0.125491,), //101
vec3f(0.958315,0.255551,0.127775,), //102
vec3f(0.972306,0.194461,0.129641,), //103
vec3f(0.982683,0.131024,0.131024,), //104
vec3f(0.706322,0.706322,0.047088,), //105
vec3f(0.730189,0.681509,0.048679,), //106
vec3f(0.754732,0.654101,0.050315,), //107
vec3f(0.779813,0.623850,0.051987,), //108
vec3f(0.805242,0.590511,0.053683,), //109
vec3f(0.830773,0.553849,0.055385,), //110
vec3f(0.856095,0.513657,0.057073,), //111
vec3f(0.880830,0.469776,0.058722,), //112
vec3f(0.904534,0.422116,0.060302,), //113
vec3f(0.926703,0.370681,0.061780,), //114
vec3f(0.946792,0.315597,0.063119,), //115
vec3f(0.964236,0.257130,0.064282,), //116
vec3f(0.978492,0.195698,0.065233,), //117
vec3f(0.989071,0.131876,0.065938,), //118
vec3f(0.995585,0.066372,0.066372,), //119
vec3f(0.707107,0.707107,0.000000,), //120
vec3f(0.731055,0.682318,0.000000,), //121
vec3f(0.755689,0.654931,0.000000,), //122
vec3f(0.780869,0.624695,0.000000,), //123
vec3f(0.806405,0.591364,0.000000,), //124
vec3f(0.832050,0.554700,0.000000,), //125
vec3f(0.857493,0.514496,0.000000,), //126
vec3f(0.882353,0.470588,0.000000,), //127
vec3f(0.906183,0.422885,0.000000,), //128
vec3f(0.928477,0.371391,0.000000,), //129
vec3f(0.948683,0.316228,0.000000,), //130
vec3f(0.966235,0.257663,0.000000,), //131
vec3f(0.980581,0.196116,0.000000,), //132
vec3f(0.991228,0.132164,0.000000,), //133
vec3f(0.997785,0.066519,0.000000,), //134
vec3f(1.000000,0.000000,0.000000,), //135
vec3f(0.590370,0.577251,0.564132,), //136
vec3f(0.603443,0.590033,0.536394,), //137
vec3f(0.617773,0.562860,0.549132,), //138
vec3f(0.616381,0.602683,0.506802,), //139
vec3f(0.631676,0.575527,0.519378,), //140
vec3f(0.646963,0.546324,0.531947,), //141
vec3f(0.629078,0.615099,0.475304,), //142
vec3f(0.645364,0.587999,0.487609,), //143
vec3f(0.661693,0.558763,0.499946,), //144
vec3f(0.677938,0.527285,0.512220,), //145
vec3f(0.641419,0.627165,0.441866,), //146
vec3f(0.658709,0.600157,0.453777,), //147
vec3f(0.676100,0.570929,0.465757,), //148
vec3f(0.693458,0.539356,0.477715,), //149
vec3f(0.710625,0.505333,0.489542,), //150
vec3f(0.653273,0.638755,0.406481,), //151
vec3f(0.671567,0.611872,0.417864,), //152
vec3f(0.690025,0.582688,0.429349,), //153
vec3f(0.708508,0.551062,0.440849,), //154
vec3f(0.726847,0.516869,0.452260,), //155
vec3f(0.744845,0.480011,0.463459,), //156
vec3f(0.664501,0.649734,0.369167,), //157
vec3f(0.683783,0.623002,0.379880,), //158
vec3f(0.703297,0.593895,0.390720,), //159
vec3f(0.722897,0.562253,0.401610,), //160
vec3f(0.742409,0.527935,0.412449,), //161
vec3f(0.761619,0.490821,0.423122,), //162
vec3f(0.780282,0.450829,0.433490,), //163
vec3f(0.674958,0.659959,0.329979,), //164
vec3f(0.695193,0.633398,0.339872,), //165
vec3f(0.715730,0.604394,0.349912,), //166
vec3f(0.736420,0.572771,0.360027,), //167
vec3f(0.757078,0.538367,0.370127,), //168
vec3f(0.777482,0.501044,0.380102,), //169
vec3f(0.797366,0.460700,0.389823,), //170
vec3f(0.816429,0.417286,0.399143,), //171
vec3f(0.684495,0.669284,0.289009,), //172
vec3f(0.705627,0.642905,0.297932,), //173
vec3f(0.727132,0.614022,0.307011,), //174
vec3f(0.748857,0.582444,0.316184,), //175
vec3f(0.770611,0.547990,0.325369,), //176
vec3f(0.792160,0.510503,0.334468,), //177
vec3f(0.813224,0.469862,0.343361,), //178
vec3f(0.833476,0.425999,0.351912,), //179
vec3f(0.852554,0.378913,0.359967,), //180
vec3f(0.692964,0.677565,0.246387,), //181
vec3f(0.714916,0.651368,0.254193,), //182
vec3f(0.737309,0.622616,0.262154,), //183
vec3f(0.759988,0.591101,0.270218,), //184
vec3f(0.782757,0.556627,0.278314,), //185
vec3f(0.805371,0.519017,0.286354,), //186
vec3f(0.827536,0.478132,0.294235,), //187
vec3f(0.848906,0.433885,0.301833,), //188
vec3f(0.869089,0.386262,0.309009,), //189
vec3f(0.887659,0.335338,0.315612,), //190
vec3f(0.700225,0.684664,0.202287,), //191
vec3f(0.722897,0.658640,0.208837,), //192
vec3f(0.746073,0.630017,0.215532,), //193
vec3f(0.769596,0.598575,0.222328,), //194
vec3f(0.793267,0.564101,0.229166,), //195
vec3f(0.816833,0.526403,0.235974,), //196
vec3f(0.839985,0.485325,0.242662,), //197
vec3f(0.862360,0.440762,0.249126,), //198
vec3f(0.883543,0.392686,0.255246,), //199
vec3f(0.903076,0.341162,0.260889,), //200
vec3f(0.920478,0.286371,0.265916,), //201
vec3f(0.706149,0.690456,0.156922,), //202
vec3f(0.729421,0.664583,0.162093,), //203
vec3f(0.753250,0.636078,0.167389,), //204
vec3f(0.777482,0.604708,0.172774,), //205
vec3f(0.801911,0.570248,0.178202,), //206
vec3f(0.826279,0.532491,0.183618,), //207
vec3f(0.850268,0.491266,0.188949,), //208
vec3f(0.873498,0.446455,0.194111,), //209
vec3f(0.895533,0.398015,0.199007,), //210
vec3f(0.915891,0.346003,0.203531,), //211
vec3f(0.934060,0.290597,0.207569,), //212
vec3f(0.949528,0.232107,0.211006,), //213
vec3f(0.710625,0.694833,0.110542,), //214
vec3f(0.734358,0.669081,0.114233,), //215
vec3f(0.758690,0.640672,0.118018,), //216
vec3f(0.783468,0.609364,0.121873,), //217
vec3f(0.808485,0.574922,0.125764,), //218
vec3f(0.833476,0.537129,0.129652,), //219
vec3f(0.858116,0.495800,0.133485,), //220
vec3f(0.882014,0.450807,0.137202,), //221
vec3f(0.904717,0.402096,0.140734,), //222
vec3f(0.925722,0.349717,0.144001,), //223
vec3f(0.944495,0.293843,0.146921,), //224
vec3f(0.960495,0.234788,0.149410,), //225
vec3f(0.973215,0.173016,0.151389,), //226
vec3f(0.713567,0.697710,0.063428,), //227
vec3f(0.737606,0.672041,0.065565,), //228
vec3f(0.762274,0.643698,0.067758,), //229
vec3f(0.787416,0.612435,0.069993,), //230
vec3f(0.812825,0.578009,0.072251,), //231
vec3f(0.838235,0.540196,0.074510,), //232
vec3f(0.863312,0.498802,0.076739,), //233
vec3f(0.887659,0.453692,0.078903,), //234
vec3f(0.910812,0.404805,0.080961,), //235
vec3f(0.932255,0.352185,0.082867,), //236
vec3f(0.951436,0.296002,0.084572,), //237
vec3f(0.967798,0.236573,0.086026,), //238
vec3f(0.980814,0.174367,0.087183,), //239
vec3f(0.990028,0.110003,0.088002,), //240
vec3f(0.714916,0.699029,0.015887,), //241
vec3f(0.739097,0.673399,0.016424,), //242
vec3f(0.763920,0.645088,0.016976,), //243
vec3f(0.789231,0.613846,0.017538,), //244
vec3f(0.814822,0.579429,0.018107,), //245
vec3f(0.840424,0.541607,0.018676,), //246
vec3f(0.865705,0.500185,0.019238,), //247
vec3f(0.890260,0.455022,0.019784,), //248
vec3f(0.913623,0.406055,0.020303,), //249
vec3f(0.935270,0.353324,0.020784,), //250
vec3f(0.954642,0.297000,0.021214,), //251
vec3f(0.971173,0.237398,0.021582,), //252
vec3f(0.984327,0.174991,0.021874,), //253
vec3f(0.993641,0.110405,0.022081,), //254
vec3f(0.998768,0.044390,0.022195,), //255

);
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

fn cublerp(t: f32) -> f32 { //cubic_interp
    let clamped_t = clamp(t, 0.0, 1.0);
    return clamped_t * clamped_t * (3.0 - 2.0 * clamped_t);
}

//dari tour to wgsl, 27 Agustus 2025
fn acakbit(
	p:vec3f,
	t:u32, //time
)->f32{
	let x = bitcast<u32>(atan(p.x));
	let y = bitcast<u32>(tanh(p.y));
	let z = bitcast<u32>(sinh(p.z));
	let v = (x * (y >> x) + t) * (y << (x + t));
	var vcast = bitcast<f32>(v);
	vcast = select(vcast,sin(f32(t)),is_nan(vcast) || is_inf(vcast),);
	
	return sin(vcast)*.5+.5;
}


fn is_nan(
	v:f32,
) -> bool{
	return v != v;
}





fn is_inf(x: f32) -> bool {
    let bits: u32 = bitcast<u32>(x);
    let exp  = (bits >> 23u) & 0xffu;
    let mant = bits & 0x7fffffu;
    return exp == 0xffu && mant == 0u;
}

