


struct stmisc{
	view:mat4x4f,
	now:u32,
	//+3 pads
}
@group(0) @binding(0) var<uniform> misc:stmisc;

struct vout{
	@builtin(position) posout:vec4f,
	@location(0) warna:vec4f,
}

@vertex fn vvvv(
	@location(0) warna:vec4f,
	@location(1) pos:vec3f,
)-> vout{
	let m0 = misc.view;
	let fnow = f32(misc.now)*.001;
	let kelip = vec4f(
	vec3f(
		sin(fnow*.71),
		sin(fnow*.77),
		sin(fnow*.74),
	)*.5+.5,
		1.,
	);
	return vout(
		m0*vec4f(pos,1.,),
		warna*kelip,
		//vec4f(.9,.4,.9,.2,),
	);
}

@fragment fn fff(
	out:vout,
)-> @location(0) vec4f{
	//return vec4f(.9,.4,.9,.2,);
	return out.warna;
}


	
	