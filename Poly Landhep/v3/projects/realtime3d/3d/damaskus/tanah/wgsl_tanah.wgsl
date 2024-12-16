


struct stmisc{
	view:mat4x4f,
	now:u32,
	//+3 pads
}
@group(0) @binding(0) var<uniform> misc:stmisc;

struct vout{
	@builtin(position) posouttttt:vec4f,
	@location(0) pos:vec3f,
}

@vertex fn vvvv(
	@location(0) pos:vec3f,
	
	@builtin(instance_index) iid: u32,
)-> vout{
	let m0 = misc.view;
	let pos1 = 
		pos
		*vec3f(22.,1.,1111.,)
		+vec3f(.0,-9.,.0,)
	;
	
	return vout(
		m0*vec4f(pos1,1.,),
		pos1/111.,
	);
}

@fragment fn fff(
	out:vout,
)-> @location(0) vec4f{
	let t = f32(misc.now)*.001;
	let pos = out.pos*111.;
	var x = pos.x;
	var z = pos.z;
	x = -x+a(z)+8.23;
	z -= t;
	return vec4f(
		(sin(x)/2+1.1)
		*(cos(z)/2+1.1)
		
		/(pow(x*.11,2,)+.9)
	)-vec4f(.0,.0,.2,.0,);
}

fn a(z:f32)->f32{
	return atan(z/133.-8.)*133.+111.;
}