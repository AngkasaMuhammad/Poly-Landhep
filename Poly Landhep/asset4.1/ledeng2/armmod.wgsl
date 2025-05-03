
@vertex fn vvv(
	@builtin(vertex_index) vi:u32,
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






@group(0) @binding(3) var<storage, read> par:array<u32>;
@group(0) @binding(2) var<storage, read> invglo:array<mat4x4f>;
@group(0) @binding(1) var<storage, read_write> aniloc:array<mat4x4f>;

@fragment fn fffff(
	o:stout,
)->@location(0) vec4f {
	let vi = o.vi;
	
	var anigloout = invglo[vi];
	var parini = vi;
	for(var a = 0u;a < 0xffu;a++){
		if(parini >= 0xffu){ break; }
		anigloout = aniloc[parini]*anigloout;//aniloc
		parini = getpar(parini);
	}
	aniglo[vi] = anigloout;
	/*
	//coba parent
	if(vi == 0u){
		aniglo[0] = aniloc[0]	*invglo[0];
		aniglo[1] = aniloc[getpar(1)]*aniloc[1]	*invglo[1];
	}
	*/
	
	let aaaa = aniloc[0];
	let bbbb = par[0];
	let cccc = invglo[0];
	let dddd = aniglo[0];
	
	
	return vec4f(.001); // sembarang
}
@group(0) @binding(0) var<storage, read_write> aniglo:array<mat4x4f>;

var<private> matinit = mat4x4f(
	 1.0, 0.0, 0.0, 0.0,
	 0.0, 1.0, 0.0, 0.0,
	 0.0, 0.0, 1.0, 0.0,
	 0.0, 0.0, 0.0, 1.0,
);





fn getpar(
	u:u32,
)->u32{
	return u32_4u8(par[u/4u])[u%4u];
}

fn u32_4u8(u32_value: u32) -> vec4<u32> {
    let byte0: u32 = (u32_value >> 0) & 0xFF;   // Least significant byte
    let byte1: u32 = (u32_value >> 8) & 0xFF;
    let byte2: u32 = (u32_value >> 16) & 0xFF;
    let byte3: u32 = (u32_value >> 24) & 0xFF;  // Most significant byte
    return vec4<u32>(byte0, byte1, byte2, byte3);
}