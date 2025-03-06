"use strict"



import {
	canv3d,
	canv2d,
	cx3d,
	cx2d,
} from './ui.js'



import {
	lihat as lih,
} from './utilku.js'


	
	let context = cx3d
	let presentationFormat = navigator.gpu.getPreferredCanvasFormat();

	let adap = await navigator.gpu.requestAdapter()
	export let dv = await adap.requestDevice()
	context.configure({
		device:dv,
		format: presentationFormat,
	});

export let write = (buf,arr,)=>{
	let data = arr?.buffer ?? arr
	let max = Math.min(buf.size,data.byteLength,)
	dv.queue.writeBuffer(buf,0,data,0,max,)
}

export let pantau_gpudevice = []
dv.addEventListener('uncapturederror',e=>{
	for(let f of pantau_gpudevice){
		f(e)
	}
})

export let bikinmodule = async (code)=>{
	dv.pushErrorScope('validation')
	let mod = dv.createShaderModule({
		label: 'ini shader '+Date()+'_'+Math.random().toFixed(13),
		code,
	})
	let info = lih(await dv.popErrorScope())
	//return info??mod
	if(info){ throw info }
	return mod
}

export let bikinUNISTObuf = (data,isUNI,)=>{
	let buf = dv.createBuffer({
		label: 'innii UniSto buffer '+Date()+'_'+Math.random().toFixed(13),
		size: data.byteLength,
		usage: GPUBufferUsage[isUNI?'UNIFORM':'STORAGE']| GPUBufferUsage.COPY_DST,
	});
	setUNISTObuf(buf,data,)
	return buf
}
let setUNISTObuf = (buf,data,)=>
	dv.queue.writeBuffer(buf, 0, data,)

export let bikinattrinfo = infoarr=>{
	let arrayStride = 0
	let attributes = []
	let formaterrorarr = []
	let loc = 0
	for(let info of infoarr){
		attributes.push({shaderLocation: loc, offset: arrayStride, format: info,})
		if(attrinfo[info] === undefined){
			formaterrorarr.push(info)
		}
		arrayStride += attrinfo[info]
		loc++
	}
	
	return {
		stepMode:'vertex',
		arrayStride,
		attributes,
		formaterrorarr,
	}
}
let attrinfo = {
/*========
//4 byte size
	'uint8x4':1,
	
	'float32':1,
	'float32x2':2,
	'float32x3':3,
	'float32x4':4,
	
	'sint32':1,
	'unorm8x4':1,
--------*/
	uint8x2	:2	,
	uint8x4	:4	,
	sint8x2	:2	,
	sint8x4	:4	,
	unorm8x2	:2	,
	unorm8x4	:4	,
	snorm8x2	:2	,
	snorm8x4	:4	,
	uint16x2	:4	,
	uint16x4	:8	,
	sint16x2	:4	,
	sint16x4	:8	,
	unorm16x2	:4	,
	unorm16x4	:8	,
	snorm16x2	:4	,
	snorm16x4	:8	,
	float16x2	:4	,
	float16x4	:8	,
	float32	:4	,
	float32x2	:8	,
	float32x3	:12	,
	float32x4	:16	,
	uint32	:4	,
	uint32x2	:8	,
	uint32x3	:12	,
	uint32x4	:16	,
	sint32	:4	,
	sint32x2	:8	,
	sint32x3	:12	,
	sint32x4	:16	,
}

export let bikindeptex = (w,h,)=>dv.createTexture({
	label:'ini deptex '+Date()+'_'+Math.random().toFixed(13),
	size: [w,h,],
	format: 'depth24plus',
	usage: GPUTextureUsage.RENDER_ATTACHMENT,
})

export let bikinrenderPassDescriptor = (
	clearValue,
	deptex,
)=>({
	label: 'our basic canvas renderPass '+Date()+'_'+Math.random().toFixed(13),
	colorAttachments: [
		{
			//view --> muncul saat render
			clearValue, //[0.0, 0.3, 0.5, 1]
			loadOp: 'clear',
			storeOp: 'store',
		},
	],
	depthStencilAttachment: {
		view:deptex.createView(),
		depthClearValue: .0,
		depthLoadOp: 'clear',
		depthStoreOp: 'store',
	},
})

export let bikinrenpip = (module,attrinfo,)=>{
	return dv.createRenderPipeline({
		label: 'ini pipeline '+Date()+'_'+Math.random().toFixed(13),
		layout: 'auto',
		vertex: {
			module,
			//entryPoint:'vs',
			buffers:[attrinfo],
/*========
			buffers:[
				{
					stepMode:'vertex',
					arrayStride: 3*4,
					attributes: [
						{shaderLocation: 0, offset: 0, format: 'float32x3'},
					],
				}
			]
--------*/
		},
		fragment: {
			module,
			//entryPoint:'fs',
			targets: [{
				format: presentationFormat,
				blend: {
					color: {
						srcFactor: 'src-alpha',
						dstFactor: 'one-minus-src-alpha',
						operation: 'add',
					},
					alpha: {
						srcFactor: 'one',
						dstFactor: 'one-minus-src-alpha',
						operation: 'add',
					},
				},
			}],
		},
		primitive: {
			topology: 'triangle-list',
			cullMode: 'back',
		},
		depthStencil: {
			depthWriteEnabled: true,
			depthCompare: 'greater',
			format: 'depth24plus',
		},
	});
	
}

export let bikinINDbuf = (data)=>{
	//;(data instanceof Uint16Array) || lih(data.constructor.name+', data harus berupa Uint16Array')
	let buf = dv.createBuffer({
		label: 'ini index buffer '+Date()+'_'+Math.random().toFixed(13),
		size: data.byteLength,
		usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
	});
	setINDbuf(buf,data,)
	return buf
}
let setINDbuf = (buf,data,)=>
	dv.queue.writeBuffer(buf, 0, data,)

export let bikinVERTbuf = (data)=>{//data -->> ArrayBuffer
	let buf = dv.createBuffer({
		label: 'innii vertexbuffer '+Date()+'_'+Math.random().toFixed(13),
		size: data.byteLength,
		usage: GPUBufferUsage.VERTEX| GPUBufferUsage.COPY_DST,
	});
	setVERTbuf(buf,data,)
	return buf
}
let setVERTbuf = (
	buf,data,
)=>
	dv.queue.writeBuffer(buf, 0, data,)

export let bikinDRAWbuf = (data)=>{//data -->> ArrayBuffer
	let buf = dv.createBuffer({
		label: 'innii drawcount buffer '+Date()+'_'+Math.random().toFixed(13),
		size: data.byteLength,
		usage: GPUBufferUsage.INDIRECT| GPUBufferUsage.COPY_DST,
	});
	setDRAWbuf(buf,data,)
	return buf
}
let setDRAWbuf = (buf,data,)=>
	dv.queue.writeBuffer(buf, 0, data,)

export let bikinentry = (binding,buffer,)=>({
	binding,
	resource:{buffer,},
})

export let bikinbind = (
	pipeline,
	layout,
	entries,
)=>
entries.length?
dv.createBindGroup({
	label: 'inii bind group '+Date()+'_'+Math.random().toFixed(13),
	layout: pipeline.getBindGroupLayout(layout),
	entries,
/*========
	entries: [
		{ binding: 0, resource: { buffer: uniformBuffer }},
	],
--------*/
}):null

export let bund = (
	pipeline,
	bindGroup,
	vertexBuffer,
	indexBuffer,
	drawbuf,
)=>{
	const bund = dv.createRenderBundleEncoder({
		colorFormats: [presentationFormat],
		depthStencilFormat: 'depth24plus',
	});
	bund.setPipeline(pipeline)
	if(bindGroup){
		bund.setBindGroup(0, bindGroup,)
	}
    bund.setVertexBuffer(0, vertexBuffer);
    bund.setIndexBuffer(indexBuffer, 'uint16')
	bund.drawIndexedIndirect(drawbuf,0,)

	return bund.finish()
}

let depthview = bikindeptex(
	canv3d.width,
	canv3d.height,
).createView()
export let render = async(
	passurut,
	passgetdata,
)=>{
	const encoder = dv.createCommandEncoder(ce);
	let bikinview = context.getCurrentTexture().createView()
	let err = null
	for(let irpd = 0;irpd < passurut.length; irpd++){ try{
		let renderPassDescriptor = passurut[irpd].data
		renderPassDescriptor
		.colorAttachments[0]
		.view = bikinview
		
		renderPassDescriptor
		.depthStencilAttachment
		.view = depthview
		
		const pass = encoder.beginRenderPass(renderPassDescriptor);
		
		for(let i in renderPassDescriptor.pass){
			let passinfo = renderPassDescriptor.pass[i]
			
			
			
			;passinfo.pipe && pass.setPipeline(passgetdata(passinfo.pipe,))
			for(let ibind in (passinfo.bind ?? [])){
				pass.setBindGroup(+ibind, passgetdata(passinfo.bind[ibind]),)
			}
			for(let ivert in (passinfo.vert ?? [])){
				pass.setVertexBuffer(+ivert,passgetdata(passinfo.vert[ivert]),)
			}
			;passinfo.ind && pass.setIndexBuffer(passgetdata(passinfo.ind), 'uint16')
			;passinfo.blend && pass.setBlendConstant(passinfo.blend)
			let drbuf = passgetdata(passinfo.draw) //sampe sini, vert ind draw -->> get untuk realtime
			if(drbuf){
				let geser = 5*4
				for(let idraw = 0;idraw+geser <= drbuf.size;idraw += geser){
					pass.drawIndexedIndirect(drbuf,idraw,)
				}
			}
			
			
			
		}
		pass.end();
	}catch(e){
		err = e.stack
		continue
	} }
	const commandBuffer = encoder.finish();
	dv.queue.submit([commandBuffer]);
	await dv.queue.onSubmittedWorkDone()
	return err
}
let ce = { label: 'our encoder '+Date()+'_'+Math.random().toFixed(13) }
//	-	-	-	-	-	-	-	-	-	-	-	---
