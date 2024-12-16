


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
	@location(0) warna:vec4f,
	@location(1) pos:vec3f,
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
	let p = out.posglo;
	
	return select(
		vec4f(.7),
		vec4f(.4),
		(mymod(p.y,.2,) < .1) && (
			(mymod(p.x,.2,) < .1) !=
			(mymod(p.z,.2,) < .1)
		)
		,
	);
}

//util
fn mymod(x:f32, y:f32,) -> f32 {//ga pake minus
    let remainder = x%y;
    return select(
		remainder,
		remainder+y,
		remainder < .0,
	);
}