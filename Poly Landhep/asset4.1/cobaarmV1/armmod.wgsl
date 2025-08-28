
@vertex fn vertfun(
	@builtin(vertex_index) vi:u32,
	@builtin(instance_index) ii:u32,
)->stout{
	return stout(
		vec4f(.0,.0,.99,1.),
		vi,
	);
}

struct stout{
	@builtin(position) position : vec4f,
	@location(0) @interpolate(flat) vi:u32,
}

@group(0) @binding(0) var<uniform> par:array<vec4u,16u,>;
@group(0) @binding(1) var<storage, read> invglo:array<mat4x4f>;
@group(0) @binding(2) var<storage, read> locani:array<mat4x4f>;

@group(0) @binding(3) var<storage, read_write> glo:array<mat4x4f>;



@fragment fn fragfun(
	o:stout,
)->@location(0) vec4f {
	let vi = o.vi;
	
	var anigloout = invglo[vi];
	var parini = vi;
	for(var a = 0u;a < 0xffu;a++){
		if(parini >= 0xffu){ break; }
		anigloout = locani[parini]*anigloout;
		parini = getpar(parini);
	}
	glo[vi] = anigloout; //ASLI
	//sampe sini,
	//glo[vi] = array(matide,mat4x4f(.0,.0,.0,.0,.0,.0,.0,.0,.0,.0,.0,.0,.0,.0,.0,1.0,),)[u32(vi == 7u)];
	
	
	return vec4f(.001); // sembarang
}

fn getpar(
	u:u32,
)->u32{
	let level0 = u/16u;
	let level1 = (u/4u)%4u;
	let level2 = u%4u;
	
	return u32_4u8(par[level0][level1])[level2];
}

fn u32_4u8(u32_value: u32) -> vec4<u32> {
    let byte0: u32 = (u32_value >> 0) & 0xFF;   // Least significant byte
    let byte1: u32 = (u32_value >> 8) & 0xFF;
    let byte2: u32 = (u32_value >> 16) & 0xFF;
    let byte3: u32 = (u32_value >> 24) & 0xFF;  // Most significant byte
    return vec4<u32>(byte0, byte1, byte2, byte3);
}

/*
fn getpar(
	u:u32,
)->u32{
	return u32_4u8(par[u/4u])[u%4u];
}

*/

var<private> matide = mat4x4f(
	 1.0, 0.0, 0.0, 0.0,
	 0.0, 1.0, 0.0, 0.0,
	 0.0, 0.0, 1.0, 0.0,
	 0.0, 0.0, 0.0, 1.0,
);
