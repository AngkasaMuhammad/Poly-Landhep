


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
	
	@builtin(instance_index) iid: u32,
)-> vout{
	let m0 = misc.view;
	let fiid = f32(iid);
	var x = (fiid%4)*4.;
	let y = -9.;
	var z = fiid*8./4. +f32(misc.now)*.001;
	z -= 1111.;
	x += a(z);
	let h = .01;
	//derivative dari desmos: b(x) = (a(x+h)-a(x))/h
	let rot = (a(z+h)-a(z))/h*-.7;
	let m1 = mat4x4f(
		 cos(rot)	, 0.0	, sin(rot)	, 0.0	,
		 0.0	, 1.0	, 0.0	, 0.0	,
		-sin(rot)	, 0.0	, cos(rot)	, 0.0	,
		 x	, y	, z	, 1.0	,
	);
	
	return vout(
		m0*m1*vec4f(pos,1.,),
		warna,
	);
}

@fragment fn fff(
	out:vout,
)-> @location(0) vec4f{
	return out.warna;
}

fn a(z:f32)->f32{
	return atan(z/133.-8.)*133.+111.;
}
