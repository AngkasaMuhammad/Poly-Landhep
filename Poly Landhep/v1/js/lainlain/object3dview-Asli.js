"use strict"

let o3dv = {}

;{
	let lih = ru.lihat
	let h2 = document.querySelector('h2')
	let canv = o3dv.canv = document.querySelector('canvas')
	let cx = o3dv.cx = canv.getContext('webgpu')
	let w = canv.width
	let h = canv.height
	let d = +canv.getAttribute('mydepth')
	let layar2dbufcopy
	
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
	
	navigator
	.gpu
	.requestAdapter()
	.then(adap=>
		adap.requestDevice()
	).then(dv=>{
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
		let mod = dv.createShaderModule({
			label:'ini module',
			code:`





struct suniu{
	w:u32,
	h:u32,
	d:u32
};

@group(0) @binding(0) var<storage, read_write> layar2d: array<u32>;
@group(0) @binding(1) var<storage, read_write> layar3d: array<u32>;
@group(0) @binding(2) var<uniform> uniu: suniu;

@compute @workgroup_size(1) fn hitung(
	@builtin(global_invocation_id) id: vec3u
) {
	//biar ga error jumlah (entries / yang terpakai)
	let sek = layar3d[0]+layar2d[0]+uniu.h;
	//ok lanjut
	let w = uniu.w;
	let h = uniu.h;
	let d = uniu.d;
	/*
	let r:u32 = layar3d[i]/0x1000000;
	let g:u32 = layar3d[i]/0x10000;
	let b:u32 = layar3d[i]/0x100;
	let a:u32 = layar3d[i]/0x1;
	layar2d[i] =
		r*0x1000000
		+g*0x10000
		+b*0x100
		+a*0x1
	;
	*/
	
	layar2d[
		id.x
		+id.y*w
		+id.z*w*h
	] = 123u;
}



			`,
		})
		let compipe = dv.createComputePipeline({
			label: 'ini pipa hitung',
			layout: 'auto',
			compute: {
				module:mod,
				entryPoint: 'hitung',
			},
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
		let layar2darr = new Uint32Array(w*h*d)
		let layar2dbuf = dv.createBuffer({
			label: 'ini layar2d arr buf',
			size: layar2darr.byteLength,
			usage:  GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
		})
		layar2dbufcopy = dv.createBuffer({
			label: 'layar2d copy',
			size: layar2darr.byteLength,
			usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
		})
		let layar3darr = new Uint32Array(w*h*d)
		let layar3dbuf = dv.createBuffer({
			label: 'layar 3d arr buf',
			size: layar3darr.byteLength,
			usage:  GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
		})
		layar3darr.fill(0xff8800ff,2+w*2,7+w*2,)
		layar3darr.fill(0xff8800ff,2+w*3,7+w*3,)
		layar3darr.fill(0xff8800ff,2+w*4,7+w*4,)
		dv.queue.writeBuffer(layar3dbuf,0,layar3darr,)
		let uniuarr = new Uint32Array([w,h,d,])
		let uniubuf = dv.createBuffer({
			label: 'uniubuf berisi w h d',
			size: uniuarr.byteLength,
			usage:  GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		})
		dv.queue.writeBuffer(uniubuf,0,uniuarr,)
		let combind = dv.createBindGroup({
			label: 'compute bindGroup',
			layout: compipe.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: { buffer: layar2dbuf} },
				{ binding: 1, resource: { buffer: layar3dbuf} },
				{ binding: 2, resource: { buffer: uniubuf} },
			],
		});
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
			
			let pass = encoder.beginComputePass({
				label: 'ini compass',
			});
			pass.setPipeline(compipe)
			pass.setBindGroup(0, combind)
			pass.dispatchWorkgroups(w,h,d,)
			pass.end()
			encoder.copyBufferToBuffer(layar2dbuf,0,layar2dbufcopy,0,layar2dbuf.size)
			
			renderPassDescriptor.colorAttachments[0].view = cx.getCurrentTexture().createView()
			pass = encoder.beginRenderPass(renderPassDescriptor)
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
		
		//return layar2dbufcopy.mapAsync(GPUMapMode.READ)
	}).then(()=>{
		return 0
		let layar2darrcopy = lih(new Uint32Array(layar2dbufcopy.getMappedRange().slice()))
		layar2dbufcopy.unmap()
	}).catch(e=>h2.textContent = ru.lihat(e))
}






//----------------