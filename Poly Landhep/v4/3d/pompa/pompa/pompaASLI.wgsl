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
	return p;
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



@vertex fn vvvv(
	@location(0) nor:vec4f,
	@location(1) pos:vec3f,
	@location(2) tex:vec2f,
)-> vout{
	let p = vec4f(anipos(pos),1.,);
	return vout(
		misc.view*p,
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
