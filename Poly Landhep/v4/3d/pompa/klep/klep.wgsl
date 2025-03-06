


fn anipos(
	p:vec3f,
	seek:f32,
)->vec3f{
if(
  5.1 < seek &&
  seek < 6.4
){
	
	return vec3f(
		p.x+(sin(seek*(99.77+p.x+p.y))*2.-1.),
		p.y+(sin(seek*(111.77+p.y+p.z))*2.-1.),
		p.z+(sin(seek*(136.77+p.z+p.x))*2.-1.),
	);
}else
{
	return p;
}
}





struct stmisc{
	persp:mat4x4f,
	pivot:mat4x4f,
	cam:mat4x4f,
	invcam:mat4x4f,
	view:mat4x4f, // = persp*invcam
	now:u32,
	seek:f32,
	freecam:u32,
	//+1 pads
}
@group(0) @binding(0) var<uniform> misc:stmisc;
@group(0) @binding(1) var<storage> anicam:mat4x4f;



@vertex fn vvvv(
	@location(0) nor:vec4f,
	@location(1) pos:vec3f,
)-> vout{
	let p = vec4f(anipos(pos,misc.seek,),1.,);
	var cam:mat4x4f;
	if(bool(misc.freecam)){
		cam = misc.view;
	}else{
		cam = misc.persp*anicam;
	}
	return vout(
		cam*p,
		p,
		nor,
	);
}


struct vout{
	@builtin(position) posout:vec4f,
	@location(0) pos:vec4f,
	@location(1) nor:vec4f,
}


@fragment fn fff(
	o:vout,
)-> @location(0) vec4f{
	let cout = vec3f(.2,);
	
	let arah = vec3f(.2,.3,.2,);
	let wb = vec4f(.2,.2,.2,.8,); //warna belakang
	let wd = vec4f(.9,.9,.9,.3,); //warna depan
	let berat = dot(
		o.nor.xyz,
		normalize(arah),
	);
	let wbaru = select(wb,wd,.5 < berat,); //warna baru
	
	return vec4f(
		mix(cout,wbaru.xyz,wbaru.w,),
		1.,
	);
}