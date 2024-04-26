//mesh shader

//texture -->> Y down

struct masuk{
	@location(0) pos : vec3f,//xyz
	@location(1) tex : vec2f,
	@location(2) voroidx : u32,
	@location(3) joi : vec4u,
	@location(4) wei : vec4f,
}
struct hasil{
	@builtin(position) pos: vec4f,
	@location(0) tex:vec2f,
	@location(1) @interpolate(flat) voroidx:u32,
}
struct datamat{
	mat:mat4x4f,
}
			
@group(0) @binding(0) var<uniform> unimat: datamat;
@group(0) @binding(1) var<storage,read_write> layar:array<f32>;
@group(0) @binding(2) var<storage> ulain: array<u32>;
/*=======
@group(0) @binding(3) var<storage> vorotail: array<u32>; //voronoi
@group(0) @binding(4) var<storage> voropos: array<vec2f>;
@group(0) @binding(5) var<storage> vorocolor: array<u32>;
--------*/
@group(0) @binding(6) var<storage> tepos: array<vec2f>;
@group(0) @binding(7) var<storage> tejoi: array<u32>;
@group(0) @binding(8) var<storage> tecond: array<u32>;
@group(0) @binding(9) var<storage> tecolor: array<u32>;
@group(0) @binding(10) var<storage> mat2d: array<mat3x3f>;
@group(0) @binding(11) var<storage> mat3d: array<mat4x4f>;

@vertex fn vs(
	data:masuk,
) -> hasil {
	let joi = data.joi;
	let wei = data.wei;
	let pos = unimat.mat*(
		mat3d[joi[0]]*wei[0]
		+mat3d[joi[1]]*wei[1]
		+mat3d[joi[2]]*wei[2]
		+mat3d[joi[3]]*wei[3]
	)*vec4f(data.pos,1.,);//xyzw
	return hasil(
		pos,
		data.tex,
		data.voroidx,
	);
}

const iterlen = 111u;//angkasukasuka
@fragment fn fs(
	parh: hasil //parameter hasil
) -> @location(0) vec4f {



let bentar1 = layar	[0];
let bentar2 = ulain	[0];
let bentar3 = tepos	[0];
let bentar4 = tejoi	[0];
let bentar5 = tecond	[0];
let bentar6 = tecolor	[0];
let bentar7 = mat2d	[0];
let bentar8 = mat3d	[0];



	let pelen = ulain[2];//panjang perintah
	let p = parh.tex;
	var ipe = parh.voroidx;//index dalam pe, bukan per perintah
	var colorini = vec4f(.5);
	
	for(var a = 0u;a < iterlen;a++){
		if(pelen <= ipe){
			colorini = unpack4x8unorm(
				tecolor[ipe-pelen]
			).abgr;
			break;
		}
		let iglo = ipe*4;
		let praw0 = tepos[tecond[iglo+0]];
		let praw1 = tepos[tecond[iglo+1]];
		let pmat0 = mat2d[tejoi[tecond[iglo+0]]]*vec3f(praw0,1.,);
		let pmat1 = mat2d[tejoi[tecond[iglo+1]]]*vec3f(praw1,1.,);
		let p0 = pmat0/pmat0.z;
		let p1 = pmat1/pmat1.z;
		let v0 = vec3f(p0.xy,.0,);
		let v1 = vec3f(p1.xy,.0,);
		let v2 = vec3f(p,.0,);
		let iawal = ipe;
		//di kiri relatif
		ipe += select(
			tecond[iglo+2],
			tecond[iglo+3],
			cross(v1-v0,v1-v2,).z > .0,
		);
		if(iawal == ipe){
			//return colorini;
			break;
		}
	}
	
	//blipping transparenccccccc
	let w = ulain[0];
	let h = ulain[1];
	let ilayar =
		u32(parh.pos.x)
		+u32(parh.pos.y)*w
	;
	var blip =
		sin(layar[ilayar]*2222.3)
		+layar[ilayar+1u]
		+sin(parh.pos.x+parh.pos.y*1111.03)
		+2.41
	;
	blip = blip%1.;
	layar[ilayar] = blip;
	if(colorini.a < blip){
		discard;
	}
	return colorini;
}