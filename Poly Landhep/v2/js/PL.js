"use strict"

let pl = {}
;(async ()=>{
//let
	let lih = ru.lihat
	let h2 = document.querySelector('h2')
	let canv = pl.canv = document.querySelector('#canv3d')
	let cx = pl.cx = canv.getContext('webgpu')
	let canv2d = pl.canv2d = document.querySelector('#canv2d')
	let cx2d = pl.cx2d = canv2d.getContext('2d')
	let m4 = wgpuMatrix.mat4
	let v3 = wgpuMatrix.vec3
	let w = canv.width
	let h = canv.height
	
	let errmsg = '!!__ERROR__!! : '
	lih('FILE Baru, POLY LANDHEP v2')
//canvas resize
	
	let canvres = e=>{
		let s = canv.style
		let s2d = canv2d.style
		if(innerWidth/innerHeight > canv.width/canv.height){
			s.height = '100%'
			s.width = ''
		}else{
			s.height = ''
			s.width = '100%'
		}
		s2d.height = s.height
		s2d.width = s.width
	}
	addEventListener('resize',canvres,)
	canvres()
//adapter
	
	let adap
	let dv
	let reqdv = pl.reqdv = async ()=>{
		adap = await navigator.gpu.requestAdapter()
		dv = await adap.requestDevice()
		dv.lost.then(lih)
	}
	await reqdv()
//presentationFormat
//	
	let presentationFormat = navigator.gpu.getPreferredCanvasFormat()
	cx.configure({
		device:dv,
		format: presentationFormat,
	})
	
	//meshshader
	let code = await fetch(ru.que('link#meshshader')[0].href)//fetch('js/pl-meshshader.wgsl')
	code = await code.text()
	let meshmod = dv.createShaderModule({
		label:'ini mesh module',
		code,
	})
	let renderPassDescriptor = {
		label: 'our basic canvas meshPass',
		colorAttachments: [
			{
				clearValue: [.2,.2,.3,.8,],
				loadOp: 'clear',
				storeOp: 'store',
				view:null,// <- to be filled out when we render
			},
		],
		depthStencilAttachment: {
			depthClearValue: 0.0,
			depthLoadOp: 'clear',
			depthStoreOp: 'store',
			view:null,// <- to be filled out when we render
		},
	}
	let meshpipe = dv.createRenderPipeline({
		label: 'ini pipa mesh',
		layout: 'auto',
		vertex: {
			module:meshmod,
			entryPoint: 'vs',
			buffers: [

{//pos
	arrayStride:3*4,
	attributes: [{
		shaderLocation:0,
		offset:0,
		format:'float32x3',
	},],
},

{//tex
	arrayStride:2*4,
	attributes: [{
		shaderLocation:1,
		offset:0,
		format:'float32x2',
	},],
},

{//pilih
	arrayStride:2*4,
	attributes: [{
		shaderLocation:2,
		offset:0,
		format:'float32x2',
	},],
},

{//nor
	arrayStride:3*4,
	attributes: [{
		shaderLocation:3,
		offset:0,
		format:'float32x3',
	},],
},

{//joi
	arrayStride:1*4,
	attributes: [{
		shaderLocation:4,
		offset:0,
		format:'uint8x4',
	},],
},

{//wei
	arrayStride:1*4,
	attributes: [{
		shaderLocation:5,
		offset:0,
		format:'unorm8x4',
	},],
},
			],
		},
		fragment: {
			module:meshmod,
			entryPoint: 'fs',
			targets: [{ format: presentationFormat }],
		},
		primitive: {
			cullMode: 'back',
		},
		depthStencil: {
			depthWriteEnabled: true,
			depthCompare: 'greater',
			format: 'depth24plus',
		},
	})
/*












*/
	
	let cambuf = dv.createBuffer({
		label:'ini matrix camera buffer',
		size:1*16*4,
		usage:
			GPUBufferUsage.UNIFORM|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(
		cambuf,
		0,
		m4.identity(),
	)
	
	let ulainbuf = dv.createBuffer({
		label:'ini ulain buffer',
		size:3*4, //w,h,mclen
		usage:
			GPUBufferUsage.UNIFORM|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(
		ulainbuf,
		0,
		new Uint32Array([w,h,0,]),
	)

	let layarbuf = dv.createBuffer({
		label:'ini layar buff',
		size:w*h*4,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_SRC|
			GPUBufferUsage.COPY_DST
		,
	})	
	//material
	let mcobuf = 'math curve ouput'
	let mcbuf = 'math curve'
	let matembuf = 'material matrix'
	let matecbuf = 'material color'
	let matebind = 'material bind'
let drawarr = pl.drawarr = []
/*












*/
//TES TESS DICOOBAAAAAAA

/*












*/
	
	let depthtex = dv.createTexture({
		size: [w,h,],
		format: 'depth24plus',
		usage: GPUTextureUsage.RENDER_ATTACHMENT,
	})

	let tms = 0
	let lukis = async t=>{try{
		pl.lukis = 'tunggu gpu hung, ini akan menjadi fungsi lukis'
		
		let dt = t-tms
		tms = t
		let encoder = dv.createCommandEncoder({
			label: 'encoderrrrrrr',
		})
		renderPassDescriptor.colorAttachments[0].view = cx.getCurrentTexture().createView()
		renderPassDescriptor.depthStencilAttachment.view = depthtex.createView()
		let pass = encoder.beginRenderPass(renderPassDescriptor)
		pass.setPipeline(meshpipe)
		
		for(let dr of drawarr){
			if(!dr.objarr.length){continue}
			
			pass.setBindGroup(1, matebind)
			pass.setBindGroup(0, dr.bind)
			pass.setVertexBuffer(0,dr.pos,)
			pass.setVertexBuffer(1,dr.tex,)
			pass.setVertexBuffer(2,dr.pilih,)
			pass.setVertexBuffer(3,dr.nor,)
			pass.setVertexBuffer(4,dr.joi,)
			pass.setVertexBuffer(5,dr.wei,)
			pass.setIndexBuffer(dr.ind,'uint16',)
			pass.drawIndexed(
				dr.ind.size/2,
				dr.objarr.length,
				0,
				0,
				0,
			)
		}
		
		pass.end()
		dv.queue.submit([encoder.finish()])
		await dv.queue.onSubmittedWorkDone()
		pl.render?.(dt)
		requestAnimationFrame(lukis)
	}catch(e){
		lih(e)
		pl.lukis = lukis
	}}
	let prm//lukis promise
	requestAnimationFrame(lukis)
	lih('sudah submit')

/*












*/

let updcam =
pl.updcam = cam=>dv.queue.writeBuffer(cambuf,0,cam,)
let setmaterial = pl.setmaterial = (
	mcoarr,
	mcarr,
	matemarr,
	matecarr,
)=>{

lih('material() 1x panggil, >1x mungkin bug')
	mcobuf = dv.createBuffer({
		label:'ini buffer',
		size:mcoarr.byteLength,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(
		mcobuf,
		0,
		mcoarr,
	)
	mcbuf = dv.createBuffer({
		label:'ini buffer',
		size:mcarr.byteLength,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(
		mcbuf,
		0,
		mcarr,
	)
	matembuf = dv.createBuffer({
		label:'ini buffer',
		size:matemarr.byteLength,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(
		matembuf,
		0,
		matemarr,
	)
	matecbuf = dv.createBuffer({
		label:'ini buffer',
		size:matecarr.byteLength,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(
		matecbuf,
		0,
		matecarr,
	)
	
	dv.queue.writeBuffer(
		ulainbuf,
		2*4,
		new Uint32Array([mcarr.length/4]),
	)
	
	//bind
	matebind = dv.createBindGroup({
		label: 'material bindddd',
		layout: meshpipe.getBindGroupLayout(1),
		entries: [
			{binding:0,resource:{buffer:cambuf}},
			{binding:1,resource:{buffer:ulainbuf}},
			{binding:2,resource:{buffer:mcobuf}},
			{binding:3,resource:{buffer:mcbuf}},
			{binding:4,resource:{buffer:matembuf}},
			{binding:5,resource:{buffer:matecbuf}},
			{binding:6,resource:{buffer:layarbuf}},
		],
	})

}
let newdraw = pl.newdraw = (
	name,
		//typed array
	posarr,
	texarr,
	piliharr,
	norarr,
	joiarr,
	weiarr,
	indarr,
	mat2darr,
	mat3darr,
	invmat3d,
	objarr,//objek node, 1 objek = 1 instance
	nmax,//max instance, karena n instance selalu berubah
)=>{
	let bufini = null
	let arrini = null
	let bindini = null
	let drawini = {name}

//pos
	arrini = posarr
	bufini = dv.createBuffer({
		label:'ini pos buffer cobaan',
		size:arrini.byteLength,
		usage:
			GPUBufferUsage.VERTEX|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(bufini,0,arrini,)
	drawini.pos = bufini

//tex
	arrini = texarr
	bufini = dv.createBuffer({
		label:'ini buffer cobaan',
		size:arrini.byteLength,
		usage:
			GPUBufferUsage.VERTEX|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(bufini,0,arrini,)
	drawini.tex = bufini

//pilih (mathcurveoutput & mat3)
	arrini = piliharr
	bufini = dv.createBuffer({
		label:'ini buffer cobaan',
		size:arrini.byteLength,
		usage:
			GPUBufferUsage.VERTEX|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(bufini,0,arrini,)
	drawini.pilih = bufini

//nor
	arrini = norarr
	bufini = dv.createBuffer({
		label:'ini buffer cobaan',
		size:arrini.byteLength,
		usage:
			GPUBufferUsage.VERTEX|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(bufini,0,arrini,)
	drawini.nor = bufini

//joi
	arrini = joiarr
	bufini = dv.createBuffer({
		label:'ini buffer cobaan',
		size:arrini.byteLength,
		usage:
			GPUBufferUsage.VERTEX|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(bufini,0,arrini,)
	drawini.joi = bufini

//wei
	arrini = weiarr
	bufini = dv.createBuffer({
		label:'ini buffer cobaan',
		size:arrini.byteLength,
		usage:
			GPUBufferUsage.VERTEX|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(bufini,0,arrini,)
	drawini.wei = bufini

//ind
	arrini = indarr
	bufini = dv.createBuffer({
		label:'ini indices cobaan',
		size:arrini.byteLength,
		usage:
			GPUBufferUsage.INDEX|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(bufini,0,arrini,)
	drawini.ind = bufini

//mat2d
	arrini = drawini.mat2darr = mat2darr
	bufini = dv.createBuffer({
		label:'ini mat2d cobaan',
		//size:arrini.byteLength,
		size:nmax*invmat3d.data.size*16,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(bufini,0,arrini,)
	drawini.mat2dbuf = bufini

//mat3d
	arrini = drawini.mat3darr = mat3darr
	bufini = dv.createBuffer({
		label:'ini mat3dcobaan',
		//size:arrini.byteLength,
		size:nmax*invmat3d.data.size*16,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(bufini,0,arrini,)
	drawini.mat3dbuf = bufini

//invmat3d
drawini.invmat3d = invmat3d
	
	//bind
	bindini = dv.createBindGroup({
		label: 'iiinnnnii  mesh bindGroup',
		layout: meshpipe.getBindGroupLayout(0),
		entries: [
			{binding:2,resource:{buffer:drawini.mat2dbuf}},
			{binding:3,resource:{buffer:drawini.mat3dbuf}},
			{binding:4,resource:{buffer:invmat3d.data}},
			{binding:5,resource:{buffer:invmat3d.len}},
		],
	})
	drawini.bind = bindini
	
	//akhir
	drawini.nmax = nmax
	drawini.objarr = objarr
	drawarr.push(drawini)	
	return drawini
}
let newinvmat3d = pl.newinvmat3d = (
	invmat3darr,
	mat2darr,
)=>{

//invdata
	let arrini = invmat3darr
	let databuf = dv.createBuffer({
		label:'ini inverter',
		size:arrini.byteLength,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(databuf,0,arrini,)
	
//len
	arrini = new Uint32Array([
		invmat3darr.length/16,
		mat2darr.length/12,
	])
	let lenbuf = dv.createBuffer({
		label:'ini panjang inverter',
		size:arrini.byteLength,
		usage:
			GPUBufferUsage.UNIFORM|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(lenbuf,0,arrini,)
	
//
	return {data:databuf,len:lenbuf,}
}
let upddrawmat2d = pl.upddrawmat2d = draw=>{
	dv.queue.writeBuffer(
		draw.mat2dbuf,
		0,
		draw.mat2darr,
	)
}
let upddrawmat3d = pl.upddrawmat3d = draw=>{
	dv.queue.writeBuffer(
		draw.mat3dbuf,
		0,
		draw.mat3darr,
/*========
		0,
		draw.objarr.length*draw.invmat3d.data.size/4,
--------*/
	)
}

/*












*/
})().then(aa=>pl.javascript_ui?.(aa))