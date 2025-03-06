// WGSL shader code

struct stmisc{
	persp:mat4x4f,
	pivot:mat4x4f,
	cam:mat4x4f,
	invcam:mat4x4f,
	view:mat4x4f, // = persp*invcam
	now:u32,
	seek:f32,
	//+2 pads
}
@group(0) @binding(0) var<storage, read_write> camout : mat4x4f;
@group(0) @binding(1) var<uniform> misc:stmisc;


@vertex
fn vertexMain(
	
	@builtin(vertex_index) vi:u32,
	@builtin(instance_index) ii:u32,
	
	//
	@location(0) t0: f32,
	//column
	@location(1) c1: vec4f,
	@location(2) c2: vec4f,
	@location(3) c3: vec4f,
	@location(4) c4: vec4f,
	
	//
	@location(5) t1: f32,
	//column
	@location(6) c5: vec4f,
	@location(7) c6: vec4f,
	@location(8) c7: vec4f,
	@location(9) c8: vec4f,
	
) -> stout {
	return stout(
		vec4f(.0,.0,.99,1.,),
		t0, c1,c2,c3,c4,
		t1, c5,c6,c7,c8,
		f32(vi),
		f32(ii),
	);
}

struct stout {
	@builtin(position) position : vec4f,
	
	//
	@location(0) t0: f32,
	//column
	@location(1) c1: vec4f,
	@location(2) c2: vec4f,
	@location(3) c3: vec4f,
	@location(4) c4: vec4f,
	
	//
	@location(5) t1: f32,
	//column
	@location(6) c5: vec4f,
	@location(7) c6: vec4f,
	@location(8) c7: vec4f,
	@location(9) c8: vec4f,
	
	@location(10) fvi: f32,
	@location(11) fii: f32,
}

@fragment
fn fragmentMain(
	out:stout,
) -> @location(0) vec4f {
	/*
	if(out.fii == 1.){
		let aa = vec4f(.5);
		camout = mat4x4f(aa,aa,aa,aa,);
		
	}else
	if(out.fvi < .5){
		camout = mat4x4f(out.c5,out.c6,out.c7,out.c8+vec4f(misc.seek),); //sampe sini,gizmo di bllender
	}else{
		camout *= mat4x4f(out.c5,out.c6,out.c7,out.c8+vec4f(misc.seek),);
	}
	*/
	let t = misc.seek;
	if(out.t0 < t && t < out.t1){
		camout = matmix(
			mat4x4f(out.c1,out.c2,out.c3,out.c4,),
			mat4x4f(out.c5,out.c6,out.c7,out.c8,),
			out.t0,out.t1,t,
		);
	}
	
	return vec4f(.001); // Return red color
}





// Define a function to mix (lerp) two 4x4 matrices based on time
fn matmix(m0: mat4x4<f32>, m1: mat4x4<f32>, t0: f32, t1: f32, t: f32) -> mat4x4<f32> {
    // Calculate the interpolation factor (lerpFactor) based on the current time
    let lerpFactor = (t - t0) / (t1 - t0);

    // Perform the matrix interpolation using the calculated lerpFactor
    return mat4x4<f32>(
        mix(m0[0], m1[0], lerpFactor),  // Interpolate row 0
        mix(m0[1], m1[1], lerpFactor),  // Interpolate row 1
        mix(m0[2], m1[2], lerpFactor),  // Interpolate row 2
        mix(m0[3], m1[3], lerpFactor)   // Interpolate row 3
    );
}