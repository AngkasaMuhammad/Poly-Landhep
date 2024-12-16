


struct stmisc{
	view:mat4x4f,
	now:u32,
	//+3 pads
}
@group(0) @binding(0) var<uniform> misc:stmisc;

struct vout{
	@builtin(position) posout:vec4f,
	@location(0) posglo:vec4f,
}

@vertex fn vvvv(
	@location(0) pos:vec3f,
)-> vout{
	let m0 = misc.view;
	let posglo = vec4f(pos,1.,);
	return vout(
		m0*posglo,
		posglo,
	);
}

@fragment fn fff(
	out:vout,
)-> @location(0) vec4f{
	return out.posglo;
}


	
	