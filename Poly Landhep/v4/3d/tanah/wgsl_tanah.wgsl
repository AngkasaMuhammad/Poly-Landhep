

struct stmisc{
	view:mat4x4f,
	now:u32,
	seek:f32,
	//+2 pads
}
@group(0) @binding(0) var<uniform> misc:stmisc;

var<private> posarr = array(
	vec4f(-1.,1.,.5,1.,),
	vec4f(-1.,-1.,.5,1.,),
	vec4f(1.,1.,.5,1.,),
	vec4f(1.,-1.,.5,1.,),
);



@vertex fn vvvv(
	@location(0) pos:vec3f,
	
	@builtin(vertex_index) vid:u32,
)-> vout{
	let m0 = misc.view;
	let seek = misc.seek;
	var aniposlok = vec4f(.0);
	var aniposview = vec4f(.0);
	
	
	
	//animasi vertex
	if(
		18. < seek
		&& seek < 32.
	){
		aniposview = posarr[vid];
	}else{
		aniposlok = vec4f(pos,1.,);
		aniposview = m0*aniposlok;
	}
	
	
	
	return vout(
		aniposview,//m0*poslok,
		aniposlok,
	);
}


struct vout{
	@builtin(position) posout:vec4f,
	
	@location(1) pos:vec4f,
}


@fragment fn fff(
	out:vout,
	//@builtin(front_facing) depan:bool,
)-> @location(0) vec4f{
	let x = out.pos.x;
	let z = out.pos.z;
	/*
	if(!depan){
		return vec4f(.4,.3,.0,1.,);
	}
	*/
	let seek = misc.seek;
	
	
	
	//animasi warna
	if(seek < 17.){
		return teta(x,z,);//normal
		
		
		
	}else if(seek < 18.){
		return teta(x,z,)
		+vec4f(
			vec3f(1.)
			*(seek-18.)
			+1.,
			1.,
		);//cerah
		
		
		
	}else if(seek < 32.){
		return vec4f(.0,.0,.0,
			32.-seek
		,);//hitam ke transparan
		
		
		
	}else if(seek < 34.){
		return teta(x,z,)
		*vec4f(vec3f(.2),
			seek-32.
		,);//transparan ke texture gelap
		
		
		
	}else{
		return clamp(
			sinar(x,z,seek,),
			vec4f(.2),
			vec4f(1.),
		)*teta(x,z,);
	}
	//return vec4f(.7);
}



fn teta(//texture tanah
	x:f32,
	z:f32,
)->vec4f{
	return select(
		select(
			vec4f(1.,.8,.4,1.9,),
			vec4f(.8,.7,.3,1.9,),
			sin(sin(x*z)) < pow(5.,sin(z*sin(x)),)*sin(9.*x),
			//tan(x*z) < sin(z),
		),
		select(
			vec4f(.85,.75,.4,1.9,),
			vec4f(.75,.65,.3,1.9,),
			//sin(x*z-z)+cos(z*z) < atan(x*z),
			sin(x)%cos(x) < sin(z),
			//x*x+z*z < tan(200.*z/x),
		),
		tan(x+pow(.7,z,)) < sin(z+pow(1.,x,)+.2*x),
	);
}



fn sinar(
	fx:f32,//fragment x
	fz:f32,//fragment z
	seek:f32,
)->vec4f{
	let out = (3.-distance(
		vec2f(fx,fz,)*.6,
		vec2f(.0),
	))
	*vec3f(1.);
	return vec4f(out,1.,);
}