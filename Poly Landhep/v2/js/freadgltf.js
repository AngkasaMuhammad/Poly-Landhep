"use strict"
let freadgltf = (json,bin,)=>{
	// https://www.khronos.org/assets/uploads/developers/presentations/gltf20-reference-guide.pdf
	
	//baca gltf
	let lih = ru.lihat
	let m3 = wgpuMatrix.mat3
	let m4 = wgpuMatrix.mat4
	
	//
	let tyararr = []
	let mat3dpisah = {}
	let mat2dpisah = {}
	let fmap0 = aa=>json.nodes[aa].name
	let ffind0 = aa=>aa.name === name
	let name = null
	
	//material
	let mate = json.materials[0].extras.shadernode
	let colorarr = mate.color
	let matarr = mate.matrix
	let mcarr = mate.mathcurve
	let mcoarr = mate.mathcurveoutput

//obj masuk prop
for(let na in mcarr){
	let o = mcarr[na]
	
	o.namaaa = na
	o.A = mcarr[o.A]??colorarr[o.A]
	o.B = mcarr[o.B]??colorarr[o.B]
	o.matrix = matarr[o.matrix]
	o.urut = null
	o.prev = []
}
for(let na in mcoarr.slice()){
	let s = mcoarr[na]
	mcoarr[na] = mcarr[s]??colorarr[s]
}
/*========
lih('\n======================\nmcarr mcoarr')
lih(mcarr)
lih(mcoarr)
--------*/

//jadi array
colorarr = Object.values(colorarr)
matarr = Object.values(matarr)
mcarr = Object.values(mcarr)

//prev push
for(let na in mcarr){
	let o = mcarr[na]
	o.A?.prev?.push(o)
	if(o.A !== o.B){
		o.B?.prev?.push(o)
	}
}
/*
lih('\n======================\nmcarr')
lih(mcarr)
*/

//urut
mcarr[0].urut = 0
for(let i = 0;i < mcarr.length;i++){
	let oini = mcarr[i]
	let A = oini.A
	let B = oini.B
	if(A && (
		(A.urut === null) ||
		(A.urut <= oini.urut)
	)){
		A.urut = oini.urut+1
		let iA = mcarr.indexOf(A)
		mcarr.splice(iA,1,)
		mcarr.splice(i+1,0,A,)
	}
	if(B && (
		(B.urut === null) ||
		(B.urut <= oini.urut)
	)){
		B.urut = oini.urut+1
		let iB = mcarr.indexOf(B)
		mcarr.splice(iB,1,)
		mcarr.splice(i+1,0,B,)
	}
	for(let oprev of oini.prev){
		if(
			(oprev.urut === null) ||
			(oprev.urut >= oini.urut)
		){
			oprev.urut = oini.urut-1
			let iop = mcarr.indexOf(oprev)
			mcarr.splice(iop,1,)
			mcarr.splice(i+1,0,oprev,)
		}
	}
}


//bikin mccolorarr
let mccolorarr = mcarr.concat(colorarr)

//jadi index
for(let i in mcoarr){
	mcoarr[i] = mccolorarr.indexOf(mcoarr[i])
}
for(let i in mcarr){
	mcarr[i = +i] = [
		mccolorarr[i].curveid,
		matarr.indexOf(mccolorarr[i].matrix),
		mccolorarr.indexOf(mccolorarr[i].A)-i,
		mccolorarr.indexOf(mccolorarr[i].B)-i,
	]
}

//matrix dari 9 ele ke 12 ele
for(let m of matarr){
	m.splice(9,0,0,)
	m.splice(6,0,0,)
	m.splice(3,0,0,)
}

//jadi typed array
let ucolorarr = []
for(let i in colorarr){
	let c = colorarr[i]
	ucolorarr.push(
            Math.round(c[3]*0xff)*0x1
            +Math.round(c[2]*0xff)*0x100
            +Math.round(c[1]*0xff)*0x10000
            +Math.round(c[0]*0xff)*0x1000000
	)
}
ucolorarr = new Uint32Array(ucolorarr)

matarr = new Float32Array(matarr.flat(Infinity))

mcarr = new Uint32Array(mcarr.flat(Infinity))

mcoarr = new Uint32Array(mcoarr)
/*========
lih('\n======================\n')
lih(mcoarr)
lih(mcarr)
lih(matarr)
lih(ucolorarr)
--------*/

//set mate
pl.setmaterial(
	mcoarr,
	mcarr,
	matarr,
	ucolorarr,
)
	
	for(let acce of json.accessors){
		let bvarr = json.bufferViews
		// https://github.com/KhronosGroup/glTF-Tutorials/blob/main/gltfTutorial/gltfTutorial_005_BuffersBufferViewsAccessors.md
		let type = ({
			'5126':Float32Array,
			'5123':Uint16Array,
			'5121':Uint32Array,
		})[acce.componentType+'']
		let bv = bvarr[acce.bufferView]
		let tyar = new type(
			bin,
			bv.byteOffset,
			bv.byteLength/type.BYTES_PER_ELEMENT,
		)
		tyararr.push(tyar)
	}
	
	for(let node of json.nodes){
		if((typeof node.mesh) == 'number'){
			let skin = json.skins[node.skin]
			let ibm = skin.inverseBindMatrices
			
			for(let pri of json.meshes[node.mesh].primitives){
				

//ubah 4 nomalized float ke 1 uint
let iwei = pri.attributes.WEIGHTS_0
let weibaru = new Uint8Array(tyararr[iwei].length)
for(let i in weibaru){
	weibaru[i = +i] = tyararr[iwei][i]*255
}
tyararr[iwei] = new Uint32Array(weibaru.buffer)

//cek indices, harus multiple of 4
let iind = pri.indices
let indtyar = tyararr[iind]
if(indtyar.length%2){
	let arr = Array.from(indtyar)
	arr.push(0)
	tyararr[iind] = new indtyar.constructor(arr)
}

//tambah mat2d
let nmax = node.extras.maxinstance??7 //sementara, nanti dari extras maxinstance
let mat2darr = []
for(let m of node.extras.geomat){
	mat2darr = mat2darr.concat(Array.from(m3.set(...m)))
}
let mat2dnmax = []
for(let i = 0;i < nmax;i++){
	mat2dnmax = mat2dnmax.concat(mat2darr)
}


//tambah mat3d
let mat3darr = []

/*========
for(let i = 0;i < tyararr[ibm].length*99;i += 16){
	mat3darr = mat3darr.concat(Array.from(m4.identity()))
}
--------*/
let tyar = tyararr[ibm]
for(let i = 0;i < tyar.length;i += 16){
	let matini = Array.from(new Float32Array(
		tyar.buffer,
		tyar.byteOffset+i*4,
		16,
	))
	m4.invert(matini,matini,)
	mat3darr = mat3darr.concat(matini)
}
let mat3dnmax = []
for(let i = 0;i < nmax;i++){
	mat3dnmax = mat3dnmax.concat(mat3darr)
}
	let invmat3d = pl.newinvmat3d(//ini berisi info mat3d & mat2d
		tyararr[ibm],
		mat2darr,
	)

let drawini = pl.newdraw(
	skin.name,
	tyararr[pri.attributes.POSITION	],
	tyararr[pri.attributes.TEXCOORD_0	],
	tyararr[pri.attributes.TEXCOORD_1	],
	tyararr[pri.attributes.NORMAL	],
	tyararr[pri.attributes.JOINTS_0	],
	tyararr[pri.attributes.WEIGHTS_0	],
	tyararr[pri.indices	],
	new Float32Array(mat2dnmax),
	new Float32Array(mat3dnmax),
	invmat3d,
	[],//berisi obj node
	nmax,
)
				
	
	let arr = drawini.mat3darr //Float32Array
	let arr2d = drawini.mat2darr //Float32Array
	let invlen = drawini.invmat3d.data.size/4/16
	let mat2dlen = mat2darr.length/12
	let out = mat3dpisah[skin.name] = []
	let out2d = mat2dpisah[skin.name] = []
	lih('inv '+invlen)
	lih('arr '+arr.length/16)
	for(let i = 0;i < arr.length;i += invlen*16){
		let instout = []
		for(let j = 0;j < invlen;j++){
			instout.push(new Float32Array(arr.buffer,(i+j*16)*4,16,))
		}
		out.push(instout)
	}
	
	for(let i = 0;i < nmax;i++){//sampe sini
		let h = [] //hasil
		for(let j = 0;j < mat2dlen;j++){
			h.push(new Float32Array(arr2d.buffer,(j+i*mat2dlen)*12*4,12,))
		}
		out2d.push(h)
	}
	
			}
		}
	}
	return {mat3dpisah,mat2dpisah,}
}