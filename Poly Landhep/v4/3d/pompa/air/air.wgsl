





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





fn anialpha(
	o:vout,
)->f32{
	let p = o.pos;
	let at = o.at;
	let seek = misc.seek;
return select(.0,.99,



//pipa
(p.z < 2.1 &&(
	//naik
	(32. < seek && seek < 38. &&
		at < seek-33.
	) ||
	
	//turun
	(38. < seek && seek < 60. &&
		at < 38.-33.-(seek-38.)*.2
	) ||
	
	//stop
	(57. < seek &&
		at < 1.2
	) ||
	
bool(0))) ||



//pancing
(2.1 < p.z && p.z < 2.3 &&(
	//masuk
	(
		3.-(seek-30.)*3. < p.y &&
		p.y < 3.-(seek-31.)*3.
	) ||
	
bool(0))) ||



//tampung
(2.3 < p.z &&(
	//naik
	(seek < 48. &&
		p.y < -.4+(seek-31.3)*1.4
	) ||
	
	//turun
	(48. < seek &&
		p.y < 1.-(seek-48.)*.5
	) ||
	
bool(0))) ||



bool(0));
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
	@location(0) at:f32, //air time
	@location(1) nor:vec4f,
	@location(2) pos:vec3f,
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
		at,
	);
}


struct vout{
	@builtin(position) posout:vec4f,
	@location(0) pos:vec4f,
	@location(1) nor:vec4f,
	@location(2) at:f32,
}


@fragment fn fff(
	o:vout,
)-> @location(0) vec4f{
	let seek = misc.seek;
	let cout = vec3f(.0,.0,.9,);
	/*
	let arah = vec3f(.2,.3,.2,);
	let wb = vec4f(.2,.2,.2,.8,); //warna belakang
	let wd = vec4f(.9,.9,.9,.3,); //warna depan
	let berat = dot(
		o.nor.xyz,
		normalize(arah),
	);
	let wbaru = select(wb,wd,.5 < berat,); //warna baru
	*/
	return vec4f(
		cout,//mix(cout,wbaru.xyz,wbaru.w,),
		anialpha(o),
	);
}
