"use strict"

	let isLE//isLittleEndian, untuk interaksi ArrayBuffer, antara TypedArray & DataView
	;{
		let f = new Float32Array([12.345,])//angka sukasuka
		let dv = new DataView(f.buffer)
		isLE = dv.getFloat32(0,) !== f[0]
		ru.lihat('Pakai Little Endian? '+isLE)
	}
let readbin = byte=>{
		let lih = ru.lihat
		let byteview = new DataView(byte)
		lih(byteview)

//	+	+	+	+	+	+	+	+	+	+
let ib = 0//index byte

let versi =
byteview.getUint32(ib,isLE,)
ib += 4

lih('versi = '+versi)

let vertlen =
byteview.getUint32(ib,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__

let indlen =
byteview.getUint32(ib,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__

let teposlen =
byteview.getUint32(ib,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__

let tecondlen =
byteview.getUint32(ib,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__

let tecolorlen =
byteview.getUint32(ib,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__

let mat2dlen =
byteview.getUint32(ib,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__

let mat3dlen =
byteview.getUint32(ib,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__

//	+	+	+	+	+	+	+	+	+	+

let vertdata = []
for(let a = 0;a < vertlen;a++){
	let d = []
	
	//pos
	d.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	d.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	d.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	
	//tex
	d.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	d.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	
	//texture idx
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	
	//joi
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	
	vertdata.push(d)
}
o3dv.me.setvertall(vertdata)
//tableshowvert()
//	__	__	__	__	__	__	__	__	__	__
lih(vertdata)

let inddata = []
for(let a = 0;a < indlen;a++){
	inddata
	.push(byteview.getUint16(ib,isLE,))
	ib += 2
}
o3dv.setindall(inddata)
//tableshowind()
//	__	__	__	__	__	__	__	__	__	__
lih(inddata)

let teposdata = []
for(let a = 0;a < teposlen;a++){
	let d = []
	
	//pos
	d.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	d.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	
	//joi
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	
	teposdata.push(d)
	
}
o3dv.te.setposall(teposdata)
//tableshowtepos()
//	__	__	__	__	__	__	__	__	__	__
lih(teposdata)

let teconddata = []
for(let a = 0;a < tecondlen;a++){
	let d = []
	
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	
	teconddata.push(d)
	
}
o3dv.te.setcondall(teconddata)
//tableshowtecond()
//	__	__	__	__	__	__	__	__	__	__
lih(teconddata)

let tecolordata = []
for(let a = 0;a < tecolorlen;a++){
	tecolordata
	.push(byteview.getUint32(ib,isLE,))
	ib += 4
}
o3dv.te.setcolorall(tecolordata)
//tableshowtecolor()
//	__	__	__	__	__	__	__	__	__	__
lih(tecolordata)

let mat2ddata = []
for(let a = 0;a < mat2dlen;a++){
for(let b = 0;b < 12;b++){	
	mat2ddata
	.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	
}}
o3dv.setmat2dall(mat2ddata)
//tableshowmat2d()
//	__	__	__	__	__	__	__	__	__	__
lih(mat2ddata)

let mat3ddata = []
for(let a = 0;a < mat3dlen;a++){
for(let b = 0;b < 16;b++){	
	mat3ddata
	.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	
}}
o3dv.setmat3dall(mat3ddata)
//tableshowmat3d()
//	__	__	__	__	__	__	__	__	__	__
lih(mat3ddata)

	}

/*















*/
