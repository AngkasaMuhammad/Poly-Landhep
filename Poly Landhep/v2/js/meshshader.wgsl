//mesh shader

//texture -->> Y down

struct masuk{
	@location(0) pos:vec3f,
	@location(1) tex:vec2f,
	@location(2) pilih:vec2f,
	@location(3) nor:vec3f,
	@location(4) joi:vec4u,
	@location(5) wei:vec4f,
	@builtin(instance_index) ins:u32,
}
struct hasil{
	@builtin(position) posout:vec4f,
	@location(0) tex:vec2f,
	@location(1) pilihx:f32,
	@location(2) matvert0:vec3f,
	@location(3) matvert1:vec3f,
	@location(4) matvert2:vec3f,
}
struct stmatlen{
	invmat3dlen:u32,
	mat2dlen:u32,
}
struct stcam{
	cam:mat4x4f,
}
struct stulain{
	w:u32,
	h:u32,
	mclen:u32,
}

@group(0) @binding(2) var<storage> mat2d: array<mat3x3f>;
@group(0) @binding(3) var<storage> mat3d: array<mat4x4f>;
@group(0) @binding(4) var<storage> invmat3ddata: array<mat4x4f>;
@group(0) @binding(5) var<uniform> matlen: stmatlen;//matrix length info per instance

@group(1) @binding(0) var<uniform> unicam: stcam;
@group(1) @binding(1) var<uniform> ulain: stulain;
@group(1) @binding(2) var<storage> mco: array<u32>;
@group(1) @binding(3) var<storage> mc: array<vec4u>;
@group(1) @binding(4) var<storage> matem: array<mat3x3f>;
@group(1) @binding(5) var<storage> matec: array<u32>;
@group(1) @binding(6) var<storage,read_write> layar: array<f32>;

@vertex fn vs(
	data:masuk,
) -> hasil {
	
	//
	var iins = data.ins*matlen.invmat3dlen;
	let i0 = data.joi[0];
	let i1 = data.joi[1];
	let i2 = data.joi[2];
	let i3 = data.joi[3];
	
	var pos =
		unicam.cam*(

(mat3d[iins+i0] *invmat3ddata[i0]) *data.wei[0]
+(mat3d[iins+i1] *invmat3ddata[i1]) *data.wei[1]
+(mat3d[iins+i2] *invmat3ddata[i2]) *data.wei[2]
+(mat3d[iins+i3] *invmat3ddata[i3]) *data.wei[3]

		)*vec4f(data.pos,1.,)
	;
	var m = mat2d[
		u32(round(1.-data.pilih.y))
		+data.ins *matlen.mat2dlen
	];
/*=========
	m = mat3x3f(
					 3.0, 0.0, 0.0,
					 0.0, 3.0, 0.0,
					 0.0,-13.0, 1.0,
				);
--------*/
	
	return hasil(
		pos,
		data.tex,
		data.pilih.x,
		m[0],
		m[1],
		m[2],
	);
}

const iterlen = 111u;//angkasukasuka
@fragment fn fs(
	parh: hasil //parameter hasil
) -> @location(0) vec4f {
	let layarku = layar[0];

	let pelen = ulain.mclen;//panjang perintah
	let p = parh.tex;
	var ipe = mco[u32(round(parh.pilihx))];
	var colorini = vec4f(.8);
	
	for(var a = 0u;a < iterlen;a++){
		if(pelen <= ipe){
			colorini = unpack4x8unorm(
				matec[ipe-pelen]
			).abgr;
			break;
		}
		let iawal = ipe;
		//coba
			var pm =
/*========
				*mat3x3f(
					 3.0, 0.0, 0.0,
					 0.0, 3.0, 0.0,
					 0.0,-13.0, 1.0,
				)
--------*/
				matem[mc[ipe][1]]
				*mat3x3f(
					parh.matvert0,
					parh.matvert1,
					parh.matvert2,
				)
				*vec3f(p,1.,);
			pm /= pm.z;
		//
		//di kiri relatif
		ipe += select(
			mc[ipe][2],
			mc[ipe][3],
			bentuk(pm.xy,mc[ipe][0],),
		);
		if(iawal == ipe){
			break;
		}
	}
	
	//blipping transparenccccccc
	let w = ulain.w;
	let h = ulain.h;
	let ilayar =
		u32(parh.posout.x)
		+u32(parh.posout.y)*w
	;
	//angka sukasuka
	var blip =
		sin(layar[ilayar]*2222.3)
		+layar[ilayar+1u]
		+sin(
			parh.posout.x
			+parh.posout.y
			*1111.03
		)
		+2.41
	;
	blip = blip%1.;
	layar[ilayar] = blip;
	if(colorini.a < blip){
		discard;
	}
	return colorini;
}
fn bentuk(
	p:vec2f,
	pilih:u32,
)->bool{
	let x = p.x;
	let y = p.y;
switch(pilih){
	case 0u:{
		return .0 < y;
	}
	case 1u:{
		return abs(x) < y;
	}
	case 2u:{
		return sin(x) < y;
	}
	case 3u:{
		return 1./cos(x) < y;
	}
	case 4u:{
		return tan(x) < y;
	}
	case 5u:{
		return distance(p,vec2f(.0),) < 1.;
	}
	default:{//sukasuka, biasanya ga akan dipiilih
		//return y*sin(x*x) < x*sin(y*y);
		return sin(x)%cos(x) < sin(y);
	}
}}