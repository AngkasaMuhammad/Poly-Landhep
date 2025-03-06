'use strict'

/*
import {
	vec3 as v3,
	mat4 as m4,
} from 'https://wgpu-matrix.org/dist/3.x/wgpu-matrix.module.js'
*/
let v3 = wgpuMatrix.vec3
let m4 = wgpuMatrix.mat4




import {
	lihat as lih,
	sleep,
	tyarr_b64,
	b64_tyarr,
	pisahstr,
	//getWordByIndex,
} from './utilku.js'



import {
	canv3d,
	canv2d,
	cx3d,
	cx2d,
	tambahinfo,
	
	uiloop,
} from './ui.js'



import {
	loadcam,
	fview,
} from './camera.js'


let context = cx3d
let presentationFormat = navigator.gpu.getPreferredCanvasFormat()

let aucx = new AudioContext()
let suara = null
export let getsuara = ()=>suara



let urlparam = new URLSearchParams(location.search)

let resosrclink = new URL(urlparam.get('resource') ?? 'resources.json',location.href,) //
let resosrc = fetch(resosrclink)
.then(r=>r.json())

let encosrclink = new URL(urlparam.get('encoder') ?? 'encoder.json',location.href,) //
let encosrc = fetch(encosrclink)
.then(r=>r.json())

let contsrclink = new URL(urlparam.get('controller') ?? 'controller.json',location.href,) //
let contsrc = fetch(contsrclink)
.then(r=>r.json())

let dv = navigator.gpu.requestAdapter()
.then(adap=>adap.requestDevice())

let reso = new Map()
let encoarr
let cont



let cvd = {label:'canvas color view '+Math.random()}//canvas view descriptor
let _aucon = class {
	constructor(audioData) {
		let curtime = aucx.currentTime
		this.audioContext = aucx;
		this.audioData = audioData;
		this.sources = [];
		this.gainNodes = [];
		this.isPlaying = false;
		this.speed = 1;
		this.startTime = curtime;// global
		this.curtime = 0;// global, ga realtime
		this.lastseek = 0;// local
		this.stopTime = curtime;// global
	}

	createSource(audioBuffer, volume, loop,newspeed,) {
		const source = this.audioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.playbackRate.value = newspeed;
		source.loop = loop;

		const gainNode = this.audioContext.createGain();
		gainNode.gain.value = volume;

		source.connect(gainNode).connect(this.audioContext.destination);

		return { source, gainNode };
	}

	start_at(seek,newspeed,) {
		if (this.isPlaying) return;
		this.isPlaying = true;
		
		let curtime = this.audioContext.currentTime
		
		let newstartTime = curtime
		
		this.audioData.forEach(({ src, when, offset, duration, volume, loop, }) => {
			const { source, gainNode } = this.createSource(src, volume, loop,newspeed,);
			
			let whenglo	= newstartTime + (when - seek)/newspeed	;	;whenglo = Math.max(0,whenglo,)
			let offsetlok	= Math.max(offset,offset + seek - when,)	;	;offsetlok = Math.max(0,offsetlok,)
			
			if(duration === null){
//cobaan, 
if(loop){
	offsetlok %= src.duration
}
//
				source.start(whenglo,offsetlok,)
			}else{
				let durglo = Math.min(duration,duration + when - seek,) ;durglo = Math.max(0,durglo,)
				source.start(whenglo,offsetlok,durglo,)
			}
			this.sources.push(source);
			this.gainNodes.push(gainNode);
			
		});
		//akhir
		this.speed = newspeed
		this.startTime = curtime
		this.lastseek = seek

	}
	
	getCurTime() {//realtime
		let curtime = this.audioContext.currentTime
		return this.isPlaying
		? (
			(this.isPlaying ? curtime : this.stopTime)
			- this.startTime
		)*this.speed + this.lastseek
		: this.curtime
	}

	destroy() {
		if (!this.isPlaying) return
		this.curtime = this.getCurTime()
		this.isPlaying = false;
		this.stopTime = this.audioContext.currentTime
		this.sources.forEach((source) => {
			source.stop();
			source.disconnect();
		});
		this.gainNodes.forEach((gainNode) => gainNode.disconnect());
		this.sources = [];
		this.gainNodes = [];
	}
	
	//lainlain
	play(){
		//"this.curtime" beda dengan "curtime"
		this.start_at(this.curtime,this.speed,)
	}
	pause(){
		this.destroy()
	}
	setCurTime(time){
		if(this.isPlaying){
			this.destroy()
			this.start_at(time,this.speed,)
		}else{
			this.curtime = time
		}
	}
	setspeed(speed){
		if(this.isPlaying){
			this.destroy()
			this.start_at(this.curtime,speed,)
		}else{
			this.speed = speed
		}
	}
};

addEventListener('mousedown',e=>aucx.resume(),)

let misc = new ArrayBuffer((
	+16 //perspective
	+16 //camera pivot
	+16 //camera
	+16 //camera inverse
	+16 //camera view
	+1 //time now
	+1 //seek
	+2 // (pad)
)*4)
let miof = 0 //misc offset
let fmiof = off=>{ //offset
	let cur = miof
	miof += off
	return cur
}

let persp = new Float32Array(misc,( fmiof(16) )*4,16,)
let pivot = new Float32Array(misc,( fmiof(16) )*4,16,)
let cam = new Float32Array(misc,( fmiof(16) )*4,16,)
let invcam = new Float32Array(misc,( fmiof(16) )*4,16,)
let view = new Float32Array(misc,( fmiof(16) )*4,16,)
let now = new Uint32Array(misc,( fmiof(1) )*4,1,)
let seek = new Float32Array(misc,( fmiof(1) )*4,1)
export let freecam = new Uint32Array(misc,( fmiof(1) )*4,1)
fview((
	_persp,
	_pivot,
	_cam,
	_invcam,
	_view,
)=>{
	m4.copy(_persp,persp,)
	m4.copy(_pivot,pivot,)
	m4.copy(_cam,cam,)
	m4.copy(_invcam,invcam,)
	m4.copy(_view,view,)
})
let miscbuf

let create_gpu_object = new Map()

create_gpu_object.set(
'gpu_buffer',async ({
	type,
	descriptor:descr,
	data,
})=>{
	await lih(type)
	await lih(type)
	
	descr = fetch(new URL(descr,resosrclink,))
	data = fetch(new URL(data,resosrclink,))
	
	descr = (await descr).json()
	data = (await data).arrayBuffer()
	
	let buf = dv.createBuffer(await descr)
	
	dv.queue.writeBuffer(buf,0,await data,)
	return buf
},)

create_gpu_object.set(
'gpu_texture',async ({
	type,
	descriptor:descr,
	data,
})=>{
	await lih(type)
	await lih(type)
	
	let ibm = null //image bitmap
	if(data !== null){
		let img = document.createElement("img")
		img.crossOrigin = "anonymous" // Enable CORS
		img.src = new URL(data,resosrclink,).toString()
		await img.decode()
		ibm = await createImageBitmap(img)
		
	}
	
	if(texsize.has(descr.size)){
		descr.size = texsize.get(descr.size)(ibm)
	}
	let tex = dv.createTexture(descr)
	
	if(data !== null){	
		dv.queue.copyExternalImageToTexture(
			{ source: ibm},
			{ texture: tex},
			[ibm.width, ibm.height],
		)
	}
	
	return tex
},)



let texsize = new Map()//texture size

texsize.set(
	'(canvas)',
	()=>canv3d, //ambil width & height doang
)
texsize.set(
	'(image_data)',
	ibm=>[ibm.width,ibm.height,], //ambil width & height doang
)

create_gpu_object.set(
'gpu_texture_view',async ({
	type,
	descriptor:descr,
	data,
})=>{
	await lih(type)
	await lih(type)
	
	let view = (await reso.get(data)).createView(descr)
	return view
},)



let texview = new Map()//texture view
texview.set(
	'(context)',
	()=>context.getCurrentTexture().createView(cvd),
)

create_gpu_object.set(
'audio_buffer',async ({
	type,
	descriptor:descr,
	data,
})=>{
	await lih(type)
	await lih(type)
	
	//sampe sini, audio_buffer
	const response = await fetch(new URL(data,resosrclink,));
	const arrayBuffer = await response.arrayBuffer();
	let aubuf = await aucx.decodeAudioData(arrayBuffer);
	
	return aubuf
},)

create_gpu_object.set(
'gpu_render_pipe',async ({
	type,
	descriptor:descr,
	data,
})=>{
	await lih(type)
	await lih(type)
	
//fragment module
	descr.fragment.module =
	await reso
	.get(descr.fragment.module)
	
//vertex module
	descr.vertex.module =
	await reso
	.get(descr.vertex.module)
	
//format
	for(let target of descr.fragment.targets){
		if(pf.has(target.format)){
			target.format = pf.get(target.format)
		}
	}
	
//buffer
	descr.vertex.buffers = await Promise.all(
		descr.vertex.buffers
		.map(link=>
			fetch(new URL(link,resosrclink,))
			.then(res=>res.json())
		)
	)
	
	
	return await dv.createRenderPipelineAsync(descr)
},)



let pf = new Map() //pipe format
pf.set(
	'(preferred_canvas_format)',
	navigator.gpu.getPreferredCanvasFormat(),
)

create_gpu_object.set(
'gpu_shader_module',async ({
	type,
	descriptor:descr,
	data,
})=>{
	await lih(type)
	await lih(type)
	
	descr.code = fetch(new URL(descr.code,resosrclink,))
	descr.code = (await descr.code).text()
	descr.code = await descr.code
	return dv.createShaderModule(descr)
},)

create_gpu_object.set(
'gpu_buffer_binding',async ({
	type,
	descriptor:descr,
	data,
})=>{
	await lih(type)
	await lih(type)
	
	
	descr.buffer = 
	bbf.has(descr.buffer)
	?bbf.get(descr.buffer)
	:await reso.get(descr.buffer)
	
	return descr
},)



let bbf //buffer binding format

create_gpu_object.set(
'gpu_bind_group',async ({
	type,
	descriptor:descr,
	data,
})=>{
	await lih(type)
	await lih(type)
	
	for(let entry of descr.entries){
		entry.resource = await reso.get(entry.resource)
	}
	descr.layout = (await reso.get(descr.layout.pipe))
	.getBindGroupLayout(descr.layout.layout)
	
	return dv.createBindGroup(descr)
},)

let mepa = new Map()//method param

mepa.set(
'set_pipeline',
async met=>{
	met[0] = await reso.get(met[0])
	return {
		'method':'setPipeline',
		'param':met,
	}
},)

mepa.set(
'set_vertex_buffer',
async met=>{
	met[1] = await reso.get(met[1])
	return {
		'method':'setVertexBuffer',
		'param':met,
	}
},)

mepa.set(
'set_index_buffer',
async met=>{
	met[0] = await reso.get(met[0])
	return {
		'method':'setIndexBuffer',
		'param':met,
	}
},)

mepa.set(
'set_bind_group',
async met=>{
	met[1] = await reso.get(met[1])
	return {
		'method':'setBindGroup',
		'param':met,
	}
},)


mepa.set(
'draw_indexed_indirect',
async met=>{
	met[0] = await reso.get(met[0])
	return {
		'method':'drawIndexedIndirect',
		'param':met,
	}
},)


mepa.set(
'draw',
async met=>{
	return {
		'method':'draw',
		'param':met,
	}
},)


mepa.set(
'draw_indirect',
async met=>{
	met[0] = await reso.get(met[0])
	return {
		'method':'drawIndirect',
		'param':met,
	}
},)


export let main = async ()=>{

resosrc = await resosrc
dv = await dv

context.configure({
	device:dv,
	format: presentationFormat,
});

loadcam()

miscbuf = dv.createBuffer({
	label: 'innii Uniform buffer '+Date()+'_'+Math.random().toFixed(13),
	size: misc.byteLength,
	usage:
		GPUBufferUsage.UNIFORM
		| GPUBufferUsage.COPY_SRC
		| GPUBufferUsage.COPY_DST,
})
bbf = new Map()//buffer binding format
bbf.set(
	'(misc)',
	miscbuf,
)


lih(resosrc)
for(let key in resosrc.create){
	let info = resosrc.create[key]
	reso.set(key,
		create_gpu_object
		.get(info.type)
		?.(info),
	)
}
lih(reso)

encoarr = await encosrc
for(let enco of encoarr){
	for(let rp of enco.renderpasses){
		for(let ca of rp.descriptor.colorAttachments){
			ca.view = texview.has(ca.view)
			?texview.get(ca.view)()
			:await reso.get(ca.view)
		}
		let dsa = rp.descriptor.depthStencilAttachment
		dsa.view = await reso.get(dsa.view)
		
		for(let i = 0;i < rp.methods.length;i++){
			let met = rp.methods[i]
			rp.methods[i] = await mepa.get(met.shift())(met)
		}
	}
}
lih(encoarr)


cont = await contsrc
lih(cont)
for(let sound of cont){
	sound.src = await reso.get(sound.src)
}
suara = new _aucon(cont)
lih(suara)
suara.play()

let waitgpu = null
let draw = async t=>{
	let submit = []
	for(let {
		descriptor:descr,
		renderpasses:rp,
	} of encoarr){
		let enco = dv.createCommandEncoder(descr)
		for(let {
			descriptor:descr,
			methods,
		} of rp){
			for(let ca of descr.colorAttachments){
				if(ca.view.label === cvd.label){
					ca.view = context.getCurrentTexture().createView(cvd)
				}
			}
			
			let pass = enco.beginRenderPass(descr)
			for(let met of methods){
				pass[met.method](...met.param)
			}
			pass.end()
		}
		submit.push(enco.finish())
	}
	dv.queue.submit(submit)
	waitgpu = dv.queue.onSubmittedWorkDone()
	
	uiloop(t)
}

let loop = async t=>{
	await waitgpu //taruh di sebelum createView(), destroyed karena nunggu
	
	now[0] = Math.round(performance.now())
	seek[0] = suara.getCurTime()
	dv.queue.writeBuffer(miscbuf,0,misc,)
	await draw(t)
	requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

/*











*/

}
