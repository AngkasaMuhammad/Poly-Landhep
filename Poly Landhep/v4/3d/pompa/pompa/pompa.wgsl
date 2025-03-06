/*
var<private> biru = vec3f(.0,.0,.4);
var<private> biru1 = vec3f(.0,.0,.3);
var<private> hitam = vec3f(.0);
var<private> kuning = vec3f(.5,.5,.0);
*/

fn biru()->vec3f{ return vec3f(.0,.0,.4); }
fn biru1()->vec3f{ return vec3f(.0,.0,.3); }
fn hitam()->vec3f{ return vec3f(.0); }
fn kuning()->vec3f{ return vec3f(.5,.5,.0); }

fn fwarna0(
	tex:vec2f,
)->vec3f{
	if(.9 < tex.y){
		return kuning();
	}else
		if(tex.y < .1){
			return hitam();
		}else
			if(tex.x < .8){
				return biru();
			}else{
				return biru1();
			}
}



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

if(
  6.7 < seek &&
  seek < 9.
){
	let seek1 = seek*22.;
	let s = sin(seek1);
	let c = cos(seek1);
	let y = sin(seek*7.)*3.;
	let pv4 = mat4x4f(
		c,0.0,-s,0.0,
		0.0,1.0,0.0,0.0,
		s,0.0,c,0.0,
		0.0,y,0.0,1.0,
	) *vec4f(p,1.,);
	return pv4.xyz;
}else

if(
  18. < seek &&
  seek < 60.
){
	return vec3f(.0);
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
	@location(2) tex:vec2f,
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
		tex,
	);
}


struct vout{
	@builtin(position) posout:vec4f,
	@location(0) pos:vec4f,
	@location(1) nor:vec4f,
	@location(2) tex:vec2f,
}


@fragment fn fff(
	o:vout,
)-> @location(0) vec4f{
	let p = o.pos;
	
	let warna0 = fwarna0(o.tex.xy);//fwarna0(p.xyz);
	
	let arah = vec3f(.2,.3,.2,);
	let wb = vec4f(.1,.1,.1,.6,); //warna belakang
	let wd = vec4f(.9,.9,.9,.1,); //warna depan
	let berat = dot(
		o.nor.xyz,
		normalize(arah),
	);
	let wbaru = select(wb,wd,.5 < berat,); //warna baru
	
	return vec4f(
		mix(warna0,wbaru.xyz,wbaru.w,),
		1.,
	);
}
