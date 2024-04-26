"use strict"

let o3dv = {}
;(async ()=>{
//let
	let lih = ru.lihat
	let h2 = document.querySelector('h2')
	let canv = o3dv.canv = document.querySelector('#canv3d')
	let cx = o3dv.cx = canv.getContext('webgpu')
	let canv2d = o3dv.canv2d = document.querySelector('#canv2d')
	let cx2d = o3dv.cx2d = canv2d.getContext('2d')
	let m4 = wgpuMatrix.mat4
	let v3 = wgpuMatrix.vec3
	let w = canv.width
	let h = canv.height
	
	let errmsg = '!!__ERROR__!! : '

//indices padding, buffer harus 4 byte
let indarrpad = ()=>{
	if(indarr.length%2){
		indarr.push(0)
	}
}
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
	
	let adap = await navigator.gpu.requestAdapter()
	let dv = await adap.requestDevice()
	dv.lost.then(lih)
//presentationFormat
//	
	let presentationFormat = navigator.gpu.getPreferredCanvasFormat()
	cx.configure({
		device:dv,
		format: presentationFormat,
	})
	
	//meshshader
	let code = await fetch(ru.que('link#meshshader')[0].href)//fetch('js/O3DV-meshshader.wgsl')
	code = await code.text()
	let meshmod = dv.createShaderModule({
		label:'ini mesh module',
		code,
	})
	let meshpipe = dv.createRenderPipeline({
		label: 'ini pipa mesh',
		layout: 'auto',
		vertex: {
			module:meshmod,
			entryPoint: 'vs',
			buffers: [
				{//pos
					arrayStride: 3 * 4, // 3 floats, 4 bytes each
					attributes: [
						{shaderLocation: 0, offset: 0, format: 'float32x3'},
					],
				},
				{//tex
					arrayStride: 2 * 4, // 1 floats, 4 bytes each
					attributes: [
						{shaderLocation: 1, offset: 0, format: 'float32x2'},
					],
				},
				{//voroidx
					arrayStride: 1 * 4,
					attributes: [
						{shaderLocation: 2, offset: 0, format: 'uint32'},
					],
				},
				{//joi
					attributes: [
						{shaderLocation: 3, offset: (0)*4, format: 'uint32x4'},
						{shaderLocation: 4, offset: (0+4)*4, format: 'unorm8x4'},
					],
					arrayStride: (0+4+1)*4,//sampe sini
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
	let renderPassDescriptor = {
		label: 'our basic canvas meshPass',
		colorAttachments: [
			{
				clearValue: [.1,.1,.1,.8,],
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

/*












*/
	
	let posarr =
	o3dv.posarr = []
	
	let texarr =
	o3dv.texarr = []
	
	let voroidxarr =
	o3dv.voroidxarr = []

	let joiarr =
	o3dv.joiarr = []
	
	let indarr =
	o3dv.indarr = []
	
	indarrpad()

/*================
	let persp = o3dv.persp = m4.identity()
	let cam = o3dv.cam = m4.identity()
	let view = o3dv.view = m4.identity()//hasil dari persp*cam 
	
    m4.perspective(
        .9,//rad
        w/h,
        .01,      // zNear
        Number.MAX_SAFE_INTEGER,//999.01,   // zFar
        persp,
    );
	
	//change z to 1-z
	m4.invert(persp,persp,)
		m4.translate(persp,[0,0,1,],persp)
		m4.scale(persp,[1,1,-1,],persp,)
	m4.invert(persp,persp,)
	//it wokkkkkk, HOW?? 
----------------*/
	
	//let layar
	
	//let poslen = 0
	let posbuf = dv.createBuffer({
		label:'ini posbuf',
		size:0xffff*4,
		usage:
			GPUBufferUsage.VERTEX|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(
		posbuf,
		0,
		new Float32Array(posarr),
	)
	
	//let texlen = 0
	let texbuf = dv.createBuffer({
		label:'ini texbuf',
		size:0xffff*4,
		usage:
			GPUBufferUsage.VERTEX|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(
		texbuf,
		0,
		new Float32Array(texarr),
	)
	
	//let voroidxlen = 0
	let voroidxbuf = dv.createBuffer({
		label:'ini voroidxbuf',
		size:0xffff*4,
		usage:
			GPUBufferUsage.VERTEX|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(
		voroidxbuf,
		0,
		new Uint32Array(voroidxarr),
	)
	
	let joibuf = dv.createBuffer({
		label:'ini joibuf',
		size:0xffff*4,
		usage:
			GPUBufferUsage.VERTEX|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(
		joibuf,
		0,
		new Uint32Array(joiarr),
	)
	
	//let indlen = 0
	let indbuf = dv.createBuffer({
		label:'ini indbuf',
		size:0xffff*4,
		usage:
			GPUBufferUsage.INDEX|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(
		indbuf,
		0,
		new Uint16Array(indarr),
	)
	
	let matbuf = dv.createBuffer({
		label:'ini matbuf',
		size:16*4,//cam.byteLength,
		usage:
			GPUBufferUsage.UNIFORM|
			GPUBufferUsage.COPY_DST
		,
	})

	let layarbuf = dv.createBuffer({
		label:'ini matbuf',
		size:w*h*4,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_SRC|
			GPUBufferUsage.COPY_DST
		,
	})
	
	let ulainbuf = dv.createBuffer({
		label:'ini ulain buffer',
		size:3*4, //w,h,panjang tecond/4
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_SRC|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(
		ulainbuf,
		0,
		new Uint32Array([w,h,0,]),
	)

/*












*/
	
	//voronoi tail, batas akhir
	let vorotailarr =
	o3dv.vorotailarr = []
	
	
	let voroposarr =
	o3dv.voroposarr = []
	
	
	let vorocolorarr =
	o3dv.vorocolorarr = []
	
	//let vorotaillen = 0
	let vorotailbuf = dv.createBuffer({
		label:'ini voronoi tail buf',
		size:0xffff*4,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_SRC|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(
		vorotailbuf,
		0,
		new Uint32Array(vorotailarr),
	)
	
	//let voroposlen = 0
	let voroposbuf = dv.createBuffer({
		label:'ini voronoi pos buf',
		size:0xffff*4,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_SRC|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(
		voroposbuf,
		0,
		new Float32Array(voroposarr),
	)
	
	//let vorocolorlen = 0
	let vorocolorbuf = dv.createBuffer({
		label:'ini voronoi color buf',
		size:0xffff*4,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_SRC|
			GPUBufferUsage.COPY_DST
		,
	})
	dv.queue.writeBuffer(
		vorocolorbuf,
		0,
		new Uint32Array(vorocolorarr),
	)

/*












*/
//texture logic
	
	//position
	let teposarr =
	o3dv.teposarr = []

	//joint
	let tejoiarr =
	o3dv.tejoiarr = []

	//condition
	let tecondarr =
	o3dv.tecondarr = []

	//color
	let tecolorarr =
	o3dv.tecolorarr = []

	let teposbuflen = 0//dari arr len nya
	let teposbuf = dv.createBuffer({
		label:'ini tepos buf',
		size:0xffff*4,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_SRC|
			GPUBufferUsage.COPY_DST
		,
	})

	let tejoibuflen = 0//dari arr len nya
	let tejoibuf = dv.createBuffer({
		label:'ini tejoi buf',
		size:0xffff*4,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_SRC|
			GPUBufferUsage.COPY_DST
		,
	})

	let tecondbuflen = 0//dari arr len nya
	let tecondbuf = dv.createBuffer({
		label:'innniiii tecond buf',
		size:0xffff*4,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_SRC|
			GPUBufferUsage.COPY_DST
		,
	})

	let tecolorbuflen = 0//dari arr len nya
	let tecolorbuf = dv.createBuffer({
		label:'tecolor buffffff',
		size:0xffff*4,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_SRC|
			GPUBufferUsage.COPY_DST
		,
	})
//matrix
	
	//mat2d
	let mat2darr =
	o3dv.mat2darr = []
	
	//mat3d
	let mat3darr =
	o3dv.mat3darr = []

	let mat2dbuflen = 0//dari arr len nya
	let mat2dbuf = dv.createBuffer({
		label:'ini mat2d buf',
		size:0xffff*4,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_SRC|
			GPUBufferUsage.COPY_DST
		,
	})

	let mat3dbuflen = 0//dari arr len nya
	let mat3dbuf = dv.createBuffer({
		label:'ini mat3d buf',
		size:0xffff*4,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_SRC|
			GPUBufferUsage.COPY_DST
		,
	})

/*












*/
	
	let depthtex = dv.createTexture({
		size: [w,h,],
		format: 'depth24plus',
		usage: GPUTextureUsage.RENDER_ATTACHMENT,
	})
	
	let meshbind = dv.createBindGroup({
		label: 'iiinnnnii  mesh bindGroup',
		layout: meshpipe.getBindGroupLayout(0),
		entries: [
			{ binding: 0, resource: { buffer: matbuf} },
			{ binding: 1, resource: { buffer: layarbuf} },
			{ binding: 2, resource: { buffer: ulainbuf} },
/*========
			{binding:3,resource:{buffer:vorotailbuf,},},
			{binding:4,resource:{buffer:voroposbuf,},},
			{binding:5,resource:{buffer:vorocolorbuf,},},
--------*/
			{binding:6,resource:{buffer:teposbuf,},},
			{binding:7,resource:{buffer:tejoibuf,},},
			{binding:8,resource:{buffer:tecondbuf,},},
			{binding:9,resource:{buffer:tecolorbuf,},},
			{binding:10,resource:{buffer:mat2dbuf,},},
			{binding:11,resource:{buffer:mat3dbuf,},},

		],
	});

	let tms = 0
	let lukis = async t=>{try{
		o3dv.lukis = 'tunggu gpu hung, ini akan menjadi fungsi lukis'
		
		let dt = t-tms
		tms = t
		//dv.queue.writeBuffer(layarbuf,0,new Uint32Array(w*h).fill(0),)
		let encoder = dv.createCommandEncoder({
			label: 'encoderrrrrrr',
		})
		renderPassDescriptor.colorAttachments[0].view = cx.getCurrentTexture().createView()
		renderPassDescriptor.depthStencilAttachment.view = depthtex.createView()
		let pass = encoder.beginRenderPass(renderPassDescriptor)
		if(indarr.length){
		
		
		pass.setPipeline(meshpipe)
		pass.setBindGroup(0, meshbind)
		pass.setVertexBuffer(0,posbuf,)
		pass.setVertexBuffer(1,texbuf,)
		pass.setVertexBuffer(2,voroidxbuf,)
		pass.setVertexBuffer(3,joibuf,)//sampe sini
		pass.setIndexBuffer(indbuf,'uint16',)
		pass.drawIndexed(indarr.length,1,0,0,0,)
		pass.end()
		
		
		}else{
			pass.end()
		}
		dv.queue.submit([encoder.finish()])
		await dv.queue.onSubmittedWorkDone()
		o3dv.render?.(dt)
		requestAnimationFrame(lukis)
	}catch(e){
		lih(e)
		o3dv.lukis = lukis
	}}
	let prm//lukis promise
	requestAnimationFrame(lukis)
	lih('sudah submit')

/*












*/

/*========
	let camdigeser = false
	let camdiputar = false
	o3dv.camdigeser = (bool = camdigeser)=>camdigeser = !!bool
	o3dv.camdiputar = (bool = camdiputar)=>camdiputar = !!bool
	let camges = o3dv.camges = m4.identity()
	let rang = 0
	let camreset = o3dv.camreset = ()=>{
		m4.identity(camges)
		m4.rotateY(camges,.4,camges,)
		m4.scale(camges,Array(3).fill(1700),camges,)
		rang = -.3
	}
	camreset()
	let fmouse = o3dv.fmouse = ()=>{
		
		m4.copy(camges,cam,)
		m4.rotateX(cam,rang,cam,)
		m4.translate(cam,[0,0,3,],cam,)
		m4.invert(cam,cam,)
		m4.mul(persp,cam,view,)
		dv.queue.writeBuffer(matbuf,0,view,)
	}
	addEventListener('mousemove',e=>{
		if(camdigeser){
			m4.translate(camges,[
				e.movementX*.004,
				0,
				e.movementY*.004,
			],camges,)
			
			fmouse()
		}//else
		if(camdiputar){
			rang += -e.movementY*.01
			
			let pi = Math.PI
			rang = Math.max(Math.min(pi/2,rang,),-pi/2,)
			m4.rotateY(camges,-e.movementX*.01,camges,)
			
			fmouse()
		}
	},)
	addEventListener('wheel',e=>{
		if(camdigeser){
			m4.translate(camges,[
				0,
				-e.deltaY*.001,
				0,
			],camges,)
			
			fmouse()
			
		}//else
		if(camdiputar){
			let s = 1.001**(e.deltaY)
			m4.scale(camges,[s,s,s,],camges,)
			
			fmouse()
		}
	},)
	fmouse()
--------*/

let updcam =
o3dv.updcam = cam=>dv.queue.writeBuffer(matbuf,0,cam,)

//mesh
let me = 
o3dv.me = {}

me.newvert = i=>{
	let vertlen = posarr.length/3
	posarr.splice(i*3,0,	0,0,0,)
	texarr.splice(i*2,0,	0,0,)
	voroidxarr.splice(i*1,0,	0,)
	joiarr.splice(i*5,0,	0,0,0,0,0,)
}

me.deletevert = i=>{
	let pos = posarr.splice(i*3,3,)
	let tex = texarr.splice(i*2,2,)
	let voro = voroidxarr.splice(i*1,1,)
	let joi = joiarr.splice(i*5,5,)
	return [
		pos[0],pos[1],pos[2],
		tex[0],tex[1],
		voro[0],
		joi[0],joi[1],joi[2],joi[3],joi[4],
	]
}

me.setvertall = data=>{
/*========
	data = [
		[vx,vy,vz,	tx,ty,	voro,	joi0,joi1,joi2,joi3,wei,],
		...
	]
--------*/
	let poslen = posarr.length
	let texlen = texarr.length
	let voroidxlen = voroidxarr.length
	let joilen = joiarr.length
//panjang array jadi aman, ok
	ru.habisarr(posarr)
	ru.habisarr(texarr)
	ru.habisarr(voroidxarr)
	ru.habisarr(joiarr)
	for(let i in data){
		let vert = data[i = +i]
		
		posarr.push(vert[0],vert[1],vert[2],)
		texarr.push(vert[3],vert[4],)
		voroidxarr.push(vert[5],)
		joiarr.push(vert[6],vert[7],vert[8],vert[9],vert[10],)//sampe sini
	}
	//tyar -> typed array
	let postyar = new Float32Array(Math.max(poslen,posarr.length,))	;postyar.set(posarr)
	let textyar = new Float32Array(Math.max(texlen,texarr.length,))	;textyar.set(texarr)
	let voroidxtyar = new Uint32Array(Math.max(voroidxlen,voroidxarr.length,))	;voroidxtyar.set(voroidxarr)
	let joityar = new Uint32Array(Math.max(joilen,joiarr.length,))	;joityar.set(joiarr)
	dv.queue.writeBuffer(posbuf		,0,postyar,)
	dv.queue.writeBuffer(texbuf		,0,textyar,)
	dv.queue.writeBuffer(voroidxbuf	,0,voroidxtyar,)
	dv.queue.writeBuffer(joibuf	,0,joityar,)
}

me.setpos = (ipos,x,y,z,)=>{
/*========
	ipos -> index pos
--------*/
	let i = ipos*3
	posarr[i+0] = x
	posarr[i+1] = y
	posarr[i+2] = z
	dv.queue.writeBuffer(
		posbuf,
		i*4,
		new Float32Array([x,y,z,]),
	)
}

me.settex = (itc,x,y,)=>{
/*========
	itc -> index tex coo
--------*/
	let i = itc*2
	texarr[i+0] = x
	texarr[i+1] = y
	dv.queue.writeBuffer(
		texbuf,
		i*4,
		new Float32Array([x,y,]),
	)
}

me.setvoro = (i,ref,)=>{
/*========
	i -> index voro
	ref -> ref ke vorotail
--------*/
	voroidxarr[i] = ref
	dv.queue.writeBuffer(
		voroidxbuf,
		i*4,
		new Uint32Array([ref]),
	)
}

me.setjoi = (ijoi,j0,j1,j2,j3,w,)=>{
	let i = ijoi*5
	
	joiarr[i+0] = j0
	joiarr[i+1] = j1
	joiarr[i+2] = j2
	joiarr[i+3] = j3
	joiarr[i+4] = w
	
	dv.queue.writeBuffer(
		joibuf,
		i*4,
		new Uint32Array([j0,j1,j2,j3,w,]),
	)
}

me.updvertbuf = (awal,akhir,)=>{
	let possli = posarr.slice(awal*3,akhir*3,)
	let postyar = new Float32Array(possli)
	dv.queue.writeBuffer(posbuf,awal*3*4,postyar,)
	
	let texsli = texarr.slice(awal*2,akhir*2,)
	let textyar = new Float32Array(texsli)
	dv.queue.writeBuffer(texbuf,awal*2*4,textyar,)
	
	let vorosli = voroidxarr.slice(awal*1,akhir*1,)
	let vorotyar = new Uint32Array(vorosli)
	dv.queue.writeBuffer(voroidxbuf,awal*1*4,vorotyar,)
	
	let joisli = joiarr.slice(awal*5,akhir*5,)
	let joityar = new Uint32Array(joisli)
	dv.queue.writeBuffer(joibuf,awal*5*4,joityar,)//sampe sini
	
}

//indices
let newind = 
o3dv.newind = i=>{
	//i harus berlipat 6
	indarr.splice(i,0,
		...Array(6).
		fill(0),
	)
}

let deleteind = 
o3dv.deleteind = i=>{
	//i harus berlipat 6
	indarr.splice(i,6,)
}

let setindall =
o3dv.setindall = data=>{
	let indlen = indarr.length
	ru.habisarr(indarr)
	for(let i = 0;i < Math.ceil(data.length/6)*6;i++){
		//indarr[i = +i] = data[i]
		indarr.push(data[i]??0)
	}
	let indtyar = new Uint16Array(Math.max(indlen,indarr.length,))
	indtyar.set(indarr)
	dv.queue.writeBuffer(
		indbuf,
		0,
		indtyar,
	)
}

let setind = 
o3dv.setind = (iind,i0,i1,i2,i3,i4,i5,)=>{
	let i = iind
	indarr[i+0] = i0
	indarr[i+1] = i1
	indarr[i+2] = i2
	indarr[i+3] = i3
	indarr[i+4] = i4
	indarr[i+5] = i5
	dv.queue.writeBuffer(
		indbuf,
		i*2,
		new Uint16Array([i0,i1,i2,i3,i4,i5,]),
	)
}

let updindbuf =
o3dv.updindbuf = (awal,akhir,)=>{
	let indsli = indarr.slice(awal,akhir,)
	let indtyar = new Uint16Array(indsli)
	dv.queue.writeBuffer(indbuf,awal*6*2,indtyar,)
}

//voronoi
let vo =
o3dv.vo = {}

vo.newvoro = i=>{
	let a = vorotailarr
	
	a.splice(i,0,
		i && a[i-1],
	)
}

vo.deletevoro = i=>{
	let head = i && vorotailarr[i-1]
	let tail = vorotailarr[i]
	let len = tail-head
	let pos = voroposarr.splice(head*2,len*2,)
	let color = vorocolorarr.splice(head*1,len*1,)
	for(let j = i;j < vorotailarr.length;j++){
		vorotailarr[j] -= len
	}
	vorotailarr.splice(i,1,)
	
	return {pos,color,}
}

vo.geservoro = (ilama,ibaru,)=>{
	let head = ilama && vorotailarr[ilama-1]
	let tail = vorotailarr[ilama]
	let len = tail-head
	let pos = voroposarr.splice(head*2,len*2,)
	let color = vorocolorarr.splice(head*1,len*1,)
	
	for(let i = ilama;i < vorotailarr.length;i++){
		vorotailarr[i] -= len
	}
	vorotailarr.splice(ilama,1,)
	
	//
	vorotailarr.splice(ibaru,0,ibaru && vorotailarr[ibaru-1],)
	for(let i = ibaru;i < vorotailarr.length;i++){
		vorotailarr[i] += len
	}
	head = ibaru && vorotailarr[ibaru-1]
	voroposarr.splice(head*2,0,...pos,)
	vorocolorarr.splice(head*1,0,...color,)
}

vo.setvoroall = data=>{
/*========
	data = [
		[
			[x,y,color,],
			...
		],
		...
	]
--------*/
	let vorotaillen = vorotailarr.length
	let voroposlen = voroposarr.length
	let vorocolorlen = vorocolorarr.length
	ru.habisarr(vorotailarr)
	ru.habisarr(voroposarr)
	ru.habisarr(vorocolorarr)
	for(let i_voro in data){
		let voro = data[i_voro = +i_voro]
		//vorotailarr[i_voro] = i_voro?vorotailarr[i_voro-1]:0
		vorotailarr.push(i_voro?vorotailarr[i_voro-1]:0)
		for(let i_seed in voro){
			let seed = voro[i_seed = +i_seed]
			let i = vorotailarr[i_voro]
			voroposarr.push(seed[0])
			voroposarr.push(seed[1])
			vorocolorarr.push(seed[2])
/*========
			voroposarr[i*2+0] = seed[0]
			voroposarr[i*2+1] = seed[1]
			vorocolorarr[i] = seed[2]
--------*/
			vorotailarr[i_voro]++
		}
	}
	let vorotailtyar = new Uint32Array(Math.max(vorotaillen,vorotailarr.length,))	;vorotailtyar.set(vorotailarr)
	let voropostyar = new Float32Array(Math.max(voroposlen,voroposarr.length,))	;voropostyar.set(voroposarr)
	let vorocolortyar = new Uint32Array(Math.max(vorocolorlen,vorocolorarr.length,))	;vorocolortyar.set(vorocolorarr)
	
	dv.queue.writeBuffer(vorotailbuf,0, vorotailtyar,)
	dv.queue.writeBuffer(voroposbuf,0,voropostyar,)
	dv.queue.writeBuffer(vorocolorbuf,0,vorocolortyar,)
}

vo.newseed = (ivoro,iseed,)=>{//iseed lokal dalam voro
	for(let i = ivoro;i < vorotailarr.length;i++){
		vorotailarr[i]++
	}
	
	let head = ivoro && vorotailarr[ivoro-1]
//let tail = vorotailarr[ivoro]
	let iseedglo = head+iseed
	
	voroposarr.splice(iseedglo *2,0,	0,0,)
	vorocolorarr.splice(iseedglo *1,0,	0,)
}

vo.setpos = (itail,ipos,x,y,)=>{
	
	//itail -> index tail
	//ipos -> index lokal
	
	let i = itail?vorotailarr[itail-1]:0
	i += ipos
	i *= 2
	
	voroposarr[i+0] = x
	voroposarr[i+1] = y
	dv.queue.writeBuffer(
		voroposbuf,
		i*4, //i*xy*byte
		new Float32Array([x,y,]),
	)
}

vo.setcolor = (itail,icol,color,)=>{
	
	//itail -> index tail
	//icol-> index lokal
	
	let i = itail?vorotailarr[itail-1]:0
	i += icol//index global
	
	vorocolorarr[i] = color
	dv.queue.writeBuffer(
		vorocolorbuf,
		i*4, //i*byte
		new Uint32Array([color]),
	)
}

vo.deleteseed = (ivoro,iseed,)=>{//iseed lokal dalam voro
	for(let i = ivoro;i < vorotailarr.length;i++){
		vorotailarr[i]--
	}
	
	let head = ivoro && vorotailarr[ivoro-1]
	let iseedglo = head+iseed
	
	voroposarr.splice(iseedglo *2,2,)
	vorocolorarr.splice(iseedglo *1,1,)
}

vo.updvorobuf = ()=>{//coba ga pake param:awal,akhir,
	let vorotailtyar = new Uint32Array(vorotailarr)
	dv.queue.writeBuffer(vorotailbuf,0,vorotailtyar,)
	
	let voropostyar = new Float32Array(voroposarr)
	dv.queue.writeBuffer(voroposbuf,0,voropostyar,)
	let vorocolortyar = new Uint32Array(vorocolorarr)
	dv.queue.writeBuffer(vorocolorbuf,0,vorocolortyar,)
}

vo.setseed = (iseed,x,y,color,)=>{
	voroposarr[iseed*2+0] = x
	voroposarr[iseed*2+1] = y
	
	vorocolorarr[iseed] = color
	dv.queue.writeBuffer(voroposbuf,iseed*2*4,new Float32Array([x,y,]),)
	dv.queue.writeBuffer(vorocolorbuf,iseed*4,new Uint32Array([color,]),)
}

//te --> texture logic
let te = o3dv.te = {}

te.newpos = i=>{
	teposarr.splice(i*2,0,	0,0,)
	tejoiarr.splice(i*1,0,	0,)
}

te.deletepos = i=>{
	teposarr.splice(i*2,2,)
	tejoiarr.splice(i*1,1,)
}

te.setpos = (ipos,x,y,joi,)=>{
	let i = ipos
	teposarr[i*2+0] = x
	teposarr[i*2+1] = y
	tejoiarr[i*1+0] = joi
	
	let tepostyar = new Float32Array([x,y,])
	let tejoityar = new Uint32Array([joi,])
	dv.queue.writeBuffer(teposbuf,i*2*4,tepostyar,)
	dv.queue.writeBuffer(tejoibuf,i*1*4,tejoityar,)
}

te.setposall = data=>{
	ru.habisarr(teposarr)
	ru.habisarr(tejoiarr)
	for(let pos of data){
		teposarr.push(pos[0],pos[1],)
		tejoiarr.push(pos[2],)
	}
	
	te.updpos()
}

te.updpos = ()=>{
	let maxlen = Math.max(teposbuflen,teposarr.length,)
	let tyar = new Float32Array(maxlen)
	tyar.set(teposarr)
	dv.queue.writeBuffer(teposbuf,0,tyar,)
	teposbuflen = teposarr.length
	
	maxlen = Math.max(tejoibuflen,tejoiarr.length,)
	tyar = new Uint32Array(maxlen)
	tyar.set(tejoiarr)
	dv.queue.writeBuffer(tejoibuf,0,tyar,)
	tejoibuflen = tejoiarr.length
}

te.newcond = i=>{
	tecondarr.splice(i*4,0,	0,0,0,0,)
}

te.deletecond = i=>{
	tecondarr.splice(i*4,4,)
}

te.setcond = (icond,s,e,t,f,)=>{
	let i = icond*4
	tecondarr[i+0] = s
	tecondarr[i+1] = e
	tecondarr[i+2] = t
	tecondarr[i+3] = f
	
	let tecondtyar = new Uint32Array([s,e,t,f,])
	dv.queue.writeBuffer(tecondbuf,i*4,tecondtyar,)
}

te.setcondall = data=>{
	ru.habisarr(tecondarr)
	for(let cond of data){
		tecondarr.push(...cond,)
	}
	
	te.updcond()
}

te.updcond = ()=>{
	let maxlen = Math.max(tecondbuflen,tecondarr.length,)
	let tyar = new Uint32Array(maxlen)
	tyar.set(tecondarr)
	dv.queue.writeBuffer(tecondbuf,0,tyar,)
	tecondbuflen = tecondarr.length
	
	dv.queue.writeBuffer(
		ulainbuf,
		2*4,
		new Uint32Array([tecondbuflen/4,]),
	)
}

te.newcolor = i=>{
	tecolorarr.splice(i,0,	0,)
}

te.deletecolor = i=>{
	tecolorarr.splice(i,1,)
}

te.setcolor = (i,c,)=>{
	tecolorarr[i] = c
	
	let tecolortyar = new Uint32Array([c,])
	dv.queue.writeBuffer(tecolorbuf,i*4,tecolortyar,)
}

te.setcolorall = data=>{
	ru.habisarr(tecolorarr)
	tecolorarr.push(...data)
	
	te.updcolor()
}

te.updcolor = ()=>{
	let maxlen = Math.max(tecolorbuflen,tecolorarr.length,)
	let tyar = new Uint32Array(maxlen)
	tyar.set(tecolorarr)
	dv.queue.writeBuffer(tecolorbuf,0,tyar,)
	
	tecolorbuflen = tecolorarr.length
}

o3dv.newmat2d = i=>{
	mat2darr.splice(i*12,0,
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
	)
}

o3dv.deletemat2d = i=>{
	mat2darr.splice(i*12,12,)
}

o3dv.setmat2d = (imat2d,
	xx	,xy	,xw	,pad0	,
	yx	,yy	,yw	,pad1	,
	x	,y	,w	,pad2	,
)=>{
	let i = imat2d*12	
	mat2darr[i+0] = xx
	mat2darr[i+1] = xy
	mat2darr[i+2] = xw
	mat2darr[i+3] = pad0
	mat2darr[i+4] = yx
	mat2darr[i+5] = yy
	mat2darr[i+6] = yw
	mat2darr[i+7] = pad1
	mat2darr[i+8] = x
	mat2darr[i+9] = y
	mat2darr[i+10] = w
	mat2darr[i+11] = pad2
	
	let mat2dtyar = new Float32Array([
		xx	,xy	,xw	,pad0	,
		yx	,yy	,yw	,pad1	,
		x	,y	,w	,pad2	,
	])
	dv.queue.writeBuffer(mat2dbuf,i*4,mat2dtyar,)
}

o3dv.setmat2dall = data=>{
	ru.habisarr(mat2darr)
	mat2darr.push(...data)
	
	o3dv.updmat2d()
}

o3dv.updmat2d = ()=>{
	let maxlen = Math.max(mat2dbuflen,mat2darr.length,)
	let tyar = new Float32Array(maxlen)
	tyar.set(mat2darr)
	dv.queue.writeBuffer(mat2dbuf,0,tyar,)
	
	mat2dbuflen = mat2darr.length
}

o3dv.newmat3d = i=>{
	mat3darr.splice(i*16,0,
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1,
	)
}

o3dv.deletemat3d = i=>{
	mat3darr.splice(i*16,16,)
}

o3dv.setmat3d = (imat3d,
	xx,xy,xz,xw,
	yx,yy,yz,yw,
	zx,zy,zz,zw,
	x,y,z,w,
)=>{
	let i = imat3d*16
	mat3darr[i+0	] = xx
	mat3darr[i+1	] = xy
	mat3darr[i+2	] = xz
	mat3darr[i+3	] = xw
	mat3darr[i+4	] = yx
	mat3darr[i+5	] = yy
	mat3darr[i+6	] = yz
	mat3darr[i+7	] = yw
	mat3darr[i+8	] = zx
	mat3darr[i+9	] = zy
	mat3darr[i+10	] = zz
	mat3darr[i+11	] = zw
	mat3darr[i+12	] = x
	mat3darr[i+13	] = y
	mat3darr[i+14	] = z
	mat3darr[i+15	] = w
	
	let mat3dtyar = new Float32Array([
		xx,xy,xz,xw,
		yx,yy,yz,yw,
		zx,zy,zz,zw,
		x,y,z,w,
	])
	dv.queue.writeBuffer(mat3dbuf,i*4,mat3dtyar,)
}

o3dv.setmat3dall = data=>{
	ru.habisarr(mat3darr)
	mat3darr.push(...data)
	
	o3dv.updmat3d()
}

o3dv.updmat3d = ()=>{
	let maxlen = Math.max(mat3dbuflen,mat3darr.length,)
	let tyar = new Float32Array(maxlen)
	tyar.set(mat3darr)
	dv.queue.writeBuffer(mat3dbuf,0,tyar,)
	
	mat3dbuflen = mat3darr.length
}
})().then(aa=>o3dv.javascript_ui?.(aa))