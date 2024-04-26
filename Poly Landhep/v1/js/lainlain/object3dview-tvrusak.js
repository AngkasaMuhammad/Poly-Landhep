"use strict"

let o3dv = {}
;(async ()=>{
	let lih = ru.lihat
	let h2 = document.querySelector('h2')
	let canv = o3dv.canv = document.querySelector('canvas')
	let cx = o3dv.cx = canv.getContext('webgpu')
	
	let canvres = e=>{
		let s = canv.style
		if(innerWidth/innerHeight > canv.width/canv.height){
			s.height = '100%'
			s.width = ''
		}else{
			s.height = ''
			s.width = '100%'
		}
	}
	addEventListener('resize',canvres,)
	canvres()
	
	let adap = await navigator.gpu.requestAdapter()
	let dv = await adap.requestDevice()
	
	let presentationFormat = navigator.gpu.getPreferredCanvasFormat()
	cx.configure({
		device:dv,
		format: presentationFormat,
	})
	let rendermod = dv.createShaderModule({
		label:'ini render module',
		code:`


struct hasil{
	@builtin(position) pos: vec4f,
	@location(0) tex: vec2f,
}
@vertex fn vs(
	@builtin(vertex_index) vertexIndex : u32
) -> hasil {
	let pos = array(
		vec2f( -0.9,  2.7),
		vec2f(-0.9, -0.9),
		vec2f( 2.7, -0.9)
	);
	
	let xy = pos[vertexIndex];
	return hasil(
		vec4f(xy, 0.0, 1.0),
		xy,
	);
}
@group(0) @binding(0) var<storage, read_write> layar3d: array<f32>;
@fragment fn fs(
	parh: hasil//parameter hasil
) -> @location(0) vec4f {
	
	layar3d[0] += .006;
	if(layar3d[0] > .94){
		layar3d[0] = .0;
	}
	
	return vec4f(
		parh.tex,
		layar3d[0],
		1,
	);
}


			`,
		})
	let renderpipe = dv.createRenderPipeline({
		label: 'ini pipa render',
		layout: 'auto',
		vertex: {
			module:rendermod,
			entryPoint: 'vs',
		},
		fragment: {
			module:rendermod,
			entryPoint: 'fs',
			targets: [{ format: presentationFormat }],
		}
	})
	let renderPassDescriptor = {
		label: 'our basic canvas renderPass',
		colorAttachments: [
			{
				clearValue: [0.3, 0.3, 0.7, 1],
				loadOp: 'clear',
				storeOp: 'store',
				view:null,
			},
		],
	}
	let layar3darr = new Uint32Array([0,])
	let layar3dbuf = dv.createBuffer({
		label: 'layar 3d arr buf',
		size: layar3darr.byteLength,
		usage:  GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
	})
	let renderbind = dv.createBindGroup({
		label: 'iiinnnnii  render bindGroup',
		layout: renderpipe.getBindGroupLayout(0),
		entries: [
			{ binding: 0, resource: { buffer: layar3dbuf} },
		],
	});
		let lukis = ()=>{
			let encoder = dv.createCommandEncoder({
				label: 'encoderrrrrrr',
			})
			renderPassDescriptor.colorAttachments[0].view = cx.getCurrentTexture().createView()
			let pass = encoder.beginRenderPass(renderPassDescriptor)
			pass.setPipeline(renderpipe)
			pass.setBindGroup(0, renderbind)
			pass.draw(3)
			pass.end()
			
			dv.queue.writeBuffer(layar3dbuf,0,layar3darr,0,1,)
			dv.queue.submit([encoder.finish()])
			dv.queue.onSubmittedWorkDone().then(prm=prm?prm:e=>{
				requestAnimationFrame(lukis)
			})
		}
		let prm//lukis promise
		requestAnimationFrame(lukis)
		lih('sudah submit')
})()