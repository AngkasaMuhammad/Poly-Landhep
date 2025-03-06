

//tesss 
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
//@group(0) @binding(1) var tex:texture_2d<f32>;//sampe sini, sedang diurus

@vertex fn vvvv(
	//@location(0) warna:vec4f,
	@location(0) pos:vec3f,
	@location(1) instpos:vec3f,
	
	@builtin(instance_index) iid:u32,
)-> vout{
	var m0:mat4x4f;
	if(misc.freecam == 1u){
		m0 = misc.view;
	}else{
		m0 = misc.persp*anicam;
	}
	
	let fiid = f32(iid);
	let seek = misc.seek+fiid;
	let z = pos.z
	+sin(seek*22.+pos.x)*pos.x*.2;
	
	let poslok = vec4f(
		pos.xy,
		z,
		1.,
	);
	let posglo = m0*(poslok +vec4f(instpos,1.,));//+vec4f(2.,.0,.0,.0,);
	return vout(
		posglo,
		//warna,
		poslok,
		fiid,
	);
}


struct vout{
	@builtin(position) posout:vec4f,
	//@location(0) warna:vec4f,
	@location(1) pos:vec4f,
	@location(2) fiid:f32,
}


@fragment fn fff(
	out:vout,
)-> @location(0) vec4f{
	//let pix = getPixel(tex,out.pos.xy,0,);
	let warnasaatid = out.fiid*.01;
	let seek = misc.seek;
	if(seek < 18.){
		return bendera(out.pos);
	}else if(warnasaatid < seek-34.){
		if(u32(out.fiid) != 0){
			return sirewel(out.pos)
			*clamp(
				vec4f(vec3f(-warnasaatid+seek-34.),1.,),
				vec4f(.0),
				vec4f(1.),
			);
		}else{
			return bendera(out.pos);
		}
	}else{
		return vec4f(vec3f(.0),1.,);
	}
	//return out.warna;
}





// Define the colors as constants
const hijau: vec3<f32> = vec3<f32>(0.0, 0.5, 0.0);  // Green
const putih: vec3<f32> = vec3<f32>(0.99, 0.99, 0.99);  // White
const merah: vec3<f32> = vec3<f32>(0.99, 0.0, 0.0);  // Red
const hitam: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);  // Black
const abuabu: vec3<f32> = vec3<f32>(0.5, 0.5, 0.5);  // Gray
const biru: vec3<f32> = vec3<f32>(.5,.5,1.,);  // biruuuuuuu
fn bendera(
	pos:vec4f,
)->vec4f{
    var rgb: vec3f;  // Output color
	
    // Conditional logic
    if (-0.3 < pos.x) {
        rgb = abuabu;  // Gray if pos.x > -0.3
    } else if (abs(pos.y) < -4.9 - pos.x) {
        rgb = merah;  // Red if |pos.y| < -4.9 - pos.x
    } else if (0.4 < pos.y) {
        rgb = hitam;  // Black if pos.y > 0.4
    } else if (pos.y < -0.4) {
        rgb = hijau;  // Green if pos.y < -0.4
    } else {
        rgb = putih;  // White for all other cases
    }
	
	return vec4f(rgb,1.,);
}
fn sirewel(
	pos:vec4f,
)->vec4f{
    var rgb: vec3f;  // Output color
	
    // Conditional logic
    if (-0.3 < pos.x) {
        rgb = abuabu;  // Gray if pos.x > -0.3
    } else if (
		pos.y < -.6
		|| pos.y > .6
	) {
        rgb = biru;  // Green if pos.y < -0.4
    } else {
        rgb = putih;  // White for all other cases
    }
	
	return vec4f(rgb,1.,);
}

/*
// Function to get a pixel from the texture using normalized float coordinates
fn getPixel(
	texture: texture_2d<f32>,
	coords: vec2f,
	mipLevel: i32,
) -> vec4f {
	let textureSize = textureDimensions(texture, mipLevel);
	let texelCoords = vec2<i32>(coords * vec2f(textureSize));
	return textureLoad(texture, texelCoords, mipLevel);
}
*/