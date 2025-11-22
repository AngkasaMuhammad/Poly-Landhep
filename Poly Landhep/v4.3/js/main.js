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
} from '../../v4/js/utilku.js'



import {
	canv3d,
	canv2d,
	cx3d,
	cx2d,
	tambahinfo,
	
	uiloop,
	contentloaded as cload,
	
	set_getsuara,
	set_freecam,
	set_setspf,
} from './ui.js'



import {
	loadcam,
	fview,
} from './camera.js'


let valtype = val=>{
    if (val === null) {
        return 'null'; // Special case: typeof null is "object", so handle it explicitly.
    }
    if (Array.isArray(val)) {
        return 'array'; // Arrays are technically objects, but we want to distinguish them.
    }
    const type = typeof val;
    if (type === 'object') {
        return 'object'; // Handle plain objects.
    }
    return type; // Return the type for primitives like 'number', 'string', 'boolean', etc.
}

class Deferred {
	constructor() {
		this.promise = new Promise(resolve => {
			this.run = resolve;
		});
	}

	// Make the instance awaitable: await d	=== await d.promise
	then(...args) { return this.promise.then(...args); }
	catch(...args) { return this.promise.catch(...args); }
	finally(...args) { return this.promise.finally(...args); }
}

const taskQueue = []; //wasm asyncs

let enta = async (fn, ...args)=>{ //enqueue task
	let defe = new Deferred()
	taskQueue.push([fn,args,defe,]);
	return defe
}

let runWAsmQueue = async()=>{
	while (taskQueue.length) {
		const [fn,args,defe,] = taskQueue.shift();
		defe.run(await fn(...args)); // ensures order
	}
}

let submitarr = []



let wasm_cce = async ( //createCommandEncoder
	encoreso,
)=>{
	let ce = await reso.get(encoreso)
	ce = dv.createCommandEncoder(ce.descriptor)
	//lih(ce)
	return editenco = ce
}


let editenco = 'kkkkosong'



let wasm_brp = async ( //beginRenderPass
	strrpreso,
)=>{
	let rpreso = await reso.get(strrpreso)
	let descr = rpreso.descriptor
	
	for(let ca of descr.colorAttachments){
		if(ca.view.label === cvd.label){
			ca.view = context.getCurrentTexture().createView(cvd)
		}
	}
	
	let rp = editenco.beginRenderPass(descr)
	//lih(rp)
	return editrp = rp
}


let wasm_cttt = async ( //finish
	src,
	dst,
	size,
)=>{
	await 99999
	
	src = tex.has(src) ?tex.get(src)() :(await reso.get(src))
	dst = tex.has(dst) ?tex.get(dst)() :(await reso.get(dst))
	if(
		src.width !== dst.width ||
		src.height !== dst.height
	) throw Error('size must match')
	
	editenco.copyTextureToTexture(
		{texture:src},
		{texture:dst},
		src,
	)
}


let wasm_finish = async ( //finish
)=>{
	await 99999
	submitarr.push(editenco.finish({label:editenco.label+' --> finishhhhhh'}))
	editenco = 'kkkkosong1'
}



let editrp = 'kosonggg g gg'



let wasm_sp = async ( //setPipeline
	strpipereso
)=>{
	let pipe = await reso.get(strpipereso)
	editrp.setPipeline(pipe)
}


let wasm_svb = async ( //setVertexBuffer
	slot,
	strbufreso,
	offset,
	size,
)=>{
	let buf = await reso.get(strbufreso)
	if(size < 0){
		editrp.setVertexBuffer(slot,buf,offset,)
	}else{
		editrp.setVertexBuffer(slot,buf,offset,size,)
	}
}


let wasm_sib = async ( //setIndexBuffer
	strbufreso,
	indexFormat,
	offset,
	size,
)=>{
	let buf = await reso.get(strbufreso)
	if(size < 0){
		editrp.setIndexBuffer(buf,indexFormat,offset,)
	}else{
		editrp.setIndexBuffer(buf,indexFormat,offset,size,)
	}
}


let wasm_sbg = async ( //setBindGroup
	index,
	strbgreso,
)=>{
	let bg = await reso.get(strbgreso)
	editrp.setBindGroup(index,bg,)
}


let wasm_dii = async ( //drawIndexedIndirect
	strbufreso,
	offset,
)=>{
	let buf = await reso.get(strbufreso)
	editrp.drawIndexedIndirect(buf,offset,)
}


let wasm_di = async ( //drawIndirect
	strbufreso,
	offset,
)=>{
	let buf = await reso.get(strbufreso)
	editrp.drawIndirect(buf,offset,)
}


let wasm_draw = async ( //draw
	vertexCount,
	instanceCount,
	firstVertex,
	firstInstance,
)=>{
	//await 0 //nilai sembarang
	editrp.draw(
		vertexCount,
		instanceCount,
		firstVertex,
		firstInstance,
	)
}


let wasm_end = async ( //end
)=>{
	//await 0 //nilai sembarang
	editrp.end()
	editrp = 'bekas '+editrp.label
}


/*========
let wasm_ = async ( //
)=>{
	let = await reso.get()
	editrp.()
}
--------*/


//audio sekali play
let wasm_auplay = async straucon=>{
	let aucon = await reso.get(straucon)
	let out = []
	for(let con of aucon){
		let bufsrc = con.src
		let when = +con.start
		let whenglo = when +aucx.currentTime
		let vol = +con.volume
		let buftrimstart = +con.buftrimstart
		let buftrimend = con.buftrimend
			buftrimend = (buftrimend === 'src') ?bufsrc.duration :+buftrimend
		let dur = con.bufduration
			dur = (dur === 'trimmed') ?(buftrimend-buftrimstart) :dur //buffer time
			dur = (dur === 'endless') ?'endless' :+dur //buffer time
		let bufscale = +con.bufscale
		
		let source = aucx.createBufferSource()
		out.push(source)
		source.buffer = bufsrc
		source.loop = true
		source.playbackRate.value = 1/bufscale;
		const gainNode = aucx.createGain();		gainNode.gain.value = vol

		source.connect(gainNode).connect(aucx.destination)
		let curtime = aucx.currentTime
		let whencx = curtime +when
		
		source.loopStart = buftrimstart
		source.loopEnd = buftrimend
		let durcx = dur
		
		let offsetlok = buftrimstart
		
		source.start(whencx,offsetlok,)
		if(dur !== 'endless'){
			durcx *= bufscale
			source.stop(whencx+durcx)
		}
	}
	return out
}

let wasm_austop = async aucon=>{
	lih(aucon)
	for(let con of await aucon){
		con.stop()
	}
}

let context = cx3d
let presentationFormat = navigator.gpu.getPreferredCanvasFormat()

let aucx = new AudioContext()
let suara = null
export let getsuara = ()=>suara
set_getsuara(getsuara)

let reso = new Map()
let encoarr = []
let aubuflist = []
let auconlist = [] //duration	src	loop	offset	volume	when	myspeed
let cont = []
let tunggureso = new Deferred()





//+++++++++++++++ resource +++++++++++++++

let reslinkslink = new URLSearchParams(location.search).get('reslinks')
reslinkslink = new URL(reslinkslink,location.href,)
let resosrc = fetch(reslinkslink)
.then(r=>r.text())

//fetch links
.then(str=>Promise.all(
	str
	.split(strnewline)
	.map(aa=>{
		let urlini = new URL(aa,reslinkslink,)
		return fetch(urlini)
		.then(r=>r.json())
		.then(out=>({
			out,
			parenturl:urlini,
		}))
	})
))
.then(arr=>{
	for(let {out,parenturl,} of arr){ for(let k in out){
		let o = out[k]
		o.parenturl = parenturl
	}}
	return Object.assign({},...arr.map(aa=>aa.out),)
})





//+++++++++++++++ wasm +++++++++++++++

let wasmlinkslink = new URLSearchParams(location.search).get('wasmlinks')
wasmlinkslink = new URL(wasmlinkslink,location.href,)
let wasmsrc = fetch(wasmlinkslink)
.then(r=>r.text())

//fetch links
.then(async str=>{
	let strconst = {
		builtins: ["js-string"], // Enable JavaScript string builtins
		importedStringConstants: "myStrings", // Enable imported global string constants
	}
	
	lih('tunggu reso')
	let impobj = {
	main:{
		lihat:(...args)=>enta(lih, ...args),
		auplay:(...args)=>enta(wasm_auplay, ...args),
		austop:(...args)=>enta(wasm_austop, ...args),
		
		cce:(...args)=>enta(wasm_cce, ...args),
			brp:(...args)=>enta(wasm_brp, ...args),
				sp:(...args)=>enta(wasm_sp, ...args),
				svb:(...args)=>enta(wasm_svb, ...args),
				sib:(...args)=>enta(wasm_sib, ...args),
				sbg:(...args)=>enta(wasm_sbg, ...args),
				draw:(...args)=>enta(wasm_draw, ...args),
				di:(...args)=>enta(wasm_di, ...args),
				dii:(...args)=>enta(wasm_dii, ...args),
				end:(...args)=>enta(wasm_end, ...args),
			//clear buffer blum bikin
			//copy buf to buf blum bikin
			cttt:(...args)=>enta(wasm_cttt, ...args),
			finish:(...args)=>enta(wasm_finish, ...args),
			
	},
	memory:lih(await tunggureso)
	}
	lih('reso loaded')
	
	
	
	return Promise.all(
	str
	.split(strnewline)
	.map(aa=>{
		let urlini = new URL(aa,wasmlinkslink,)
		return WebAssembly.instantiateStreaming(
			fetch(urlini),
			impobj,
			strconst,
		)
	})
	
	
	
)})





//sampe sini, 
	/*
1. 
				fgoi(key,'LOAD '+key,)
	*/



let urlparam = new URLSearchParams(location.search)

/*========
let resosrclink = new URL(urlparam.get('resource') ?? 'resources.json',location.href,) //
let resosrc = fetch(resosrclink)
.then(r=>r.json())

let encosrclink = new URL(urlparam.get('encoder') ?? 'encoder.json',location.href,) //
let encosrc = fetch(encosrclink)
.then(r=>r.json())

let contsrclink = new URL(urlparam.get('controller') ?? 'controller.json',location.href,) //
let contsrc = fetch(contsrclink)
//.then(r=>r.json())
	.then(r=>r.text())
	.then(r=>lih(tsvToObj(r)))
--------*/


let dv = navigator.gpu.requestAdapter()
.then(adap=>adap.requestDevice({
	requiredFeatures: ['indirect-first-instance'], // Enable the feature here
}))



let cvd = {label:'canvas color view '+Math.random()}//canvas view descriptor

let strnewline = /\r\n|\r|\n/

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
		
		//sekali play
		
	}

	createSource(audioBuffer, volume, newspeed,) {//loop,
		const source = this.audioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.playbackRate.value = newspeed;
		//source.loop = loop;
		source.loop = true

		const gainNode = this.audioContext.createGain();
		gainNode.gain.value = volume;

		source.connect(gainNode).connect(this.audioContext.destination);

		return { source, gainNode };
	}

	start_at(seek,newspeed,) {
		if (this.isPlaying) return;
		this.isPlaying = true;
		
		let curtime = this.audioContext.currentTime
		
		//let newstartTime = curtime
		
		//let info0 = 'seek = '+seek+' ===================\n'
		this.audioData.forEach(({
			
			src:bufsrc,
			start:when,
			//offset, //mau diganti buftrimstart
			bufduration,
			volume,
			//loop,
			//myspeed = 1, //mau dihapus
			
			buftrimstart,
			buftrimend, // < 0, bufsrc.duration
			bufscale,
			
		},i,) => {
			when *= 1
			//offset *= 1
			volume *= 1
			//myspeed *= 1
			//loop = loop === 'true'
			
			buftrimstart *= 1
			buftrimend = (buftrimend === 'src') ?bufsrc.duration :+buftrimend
			
			bufduration = (bufduration === 'trimmed') ?(buftrimend-buftrimstart) :bufduration //buffer time
			bufduration = (bufduration === 'endless') ?'endless' :+bufduration //buffer time
			
			bufscale *= 1
			/*
			cara pakai start()
				when:contexttime,
				offset:sourcetime,
			*/
/*=======
//ASLI
			
			//const { source, gainNode } = this.createSource(bufsrc, volume, loop,newspeed,); ASLI
			const { source, gainNode } = this.createSource(bufsrc, volume, loop,newspeed*myspeed,); //COBA
			
			
			let whenglo	= curtime + (when - seek)/newspeed	;	;whenglo = Math.max(0,whenglo,)
			//let offsetlok	= Math.max(offset,offset + seek - when,)	;	;offsetlok = Math.max(0,offsetlok,) ASLI
			let offsetlok	= Math.max(offset,offset + (seek - when)*myspeed,)	;	;offsetlok = Math.max(0,offsetlok,) //COBA
			
			
			
			if(bufduration < 0){
				source.start(whenglo,offsetlok,)
			}else{
				if(loop){
					offsetlok = offsetlok % bufsrc.duration
				}
				
				let durglo = Math.min(bufduration,bufduration + when - seek,) ;durglo = Math.max(0,durglo,) ;durglo /= newspeed*myspeed
				source.start(whenglo,offsetlok,durglo,)
			}
--------*/
			//COBA
			const { source, gainNode } = this.createSource(bufsrc, volume, newspeed/bufscale,); //COBA1
			//let nabrak = //context nabrak when
			
			let whenglo = when
			let whencx = Math.max(0,curtime +(whenglo-seek)/newspeed,)
			
			source.loopStart = buftrimstart
			source.loopEnd = buftrimend //(buftrimend < 0)?bufsrc.duration:buftrimend
			let durcx = bufduration //(bufduration < 0)?bufsrc.duration:bufduration
			
			let offsetlok = Math.max(0,-whenglo+seek,)/bufscale
			offsetlok = offsetlok % (source.loopEnd-source.loopStart)
			offsetlok += buftrimstart
			
			source.start(whencx,offsetlok,) //parameter start() duration tidak jelas, ganti pake stop()
			if(bufduration !== 'endless'){
				durcx *= 1/newspeed*bufscale
				source.stop(whencx+durcx)
			}
			
			//info0 += `${i}| ${offsetlok.toFixed(3)}\n`
			
			
			
			//
			this.sources.push(source);
			this.gainNodes.push(gainNode);
			
		});
		//tambahinfo('lihataucon'+info0,'cyan','lihataucon',)
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

const tsvToObj = (tsv, key = null) => {
	const [header, ...rows] =
		tsv.trim()
			.split(strnewline)
			.map(r => r.split('\t'));

	if (key === null) {
		// Return an array of objects
		return rows.map(row =>
			Object.fromEntries(
				header.map((col, i) => [col, row[i]])
			)
		);
	} else {
		// Return an object keyed by the given column name
		const keyIndex = header.indexOf(key);
		if (keyIndex === -1)
			throw new Error(`Key "${key}" not found in header`);

		return rows.reduce((out, row) => {
			out[row[keyIndex]] = Object.fromEntries(
				header
					.map((col, i) => [col, row[i]])
					.filter(([col]) => col !== key)
			);
			return out;
		}, {});
	}
};

let misc = new ArrayBuffer((
	+16 //perspective
	+16 //camera pivot
	+16 //camera
	+16 //camera inverse
	+16 //camera view
	+1 //time now
	+1 //seek
	+1 //free cam
	+1 //previous seek
	+1 //random float
	+3 // (pad)
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
let prevseek = new Float32Array(misc,( fmiof(1) )*4,1)
let ranfl = new Float32Array(misc,( fmiof(1) )*4,1)
set_freecam(freecam)
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

let gpu_object_info = {}
let fgoi = (k,str,)=>{ //fungsi gpu object info
	let goi =  gpu_object_info
	goi[k] = str
	
	let out = ''
	for(let k1 in goi){
		out += goi[k1]+'\n'
	}
	
	tambahinfo(out,'#5555ff','objinfo',)
}

let create_gpu_object = new Map()

create_gpu_object.set(
'object',async ({
	type,
	descriptor:descr,
	data,
	parenturl,
})=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
	
	return data
},)

create_gpu_object.set(
'wat_memory',async ({
	type,
	descriptor:descr,
	data,
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
	
				fgoi(key,'LOAD\t\t'+key,)
	let arrbuf = await fetch(new URL(data,parenturl,))
	arrbuf = await arrbuf.arrayBuffer()
				fgoi(key,'DONE '+key,)
	let pages = Math.max(Math.ceil(arrbuf.byteLength / 65536),1,)
	let mem = new WebAssembly.Memory({ initial: pages });
	new Uint8Array(mem.buffer)
	.set(new Uint8Array(arrbuf), 0,)
	
	return mem
},)

create_gpu_object.set(
'gpu_buffer',async ({
	type,
	descriptor:descr, //d_
	data, //da_
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
	
	//let d_obj
	let d_key = (valtype(descr) === 'string') && (reso.get(descr) !== undefined)
	let d_link = (valtype(descr) === 'string') && (reso.get(descr) === undefined)
	//let da_null
	let da_link = data !== null
	
				fgoi(key,'LOAD\t\t'+key,)
	d_key && (descr = await reso.get(descr))
	d_link && (descr = fetch(new URL(descr,parenturl,)))
	d_link && (descr = (await descr).json())
	da_link && (data = fetch(new URL(data,parenturl,)))
	da_link && (data = (await data).arrayBuffer())
				fgoi(key,'DONE '+key,)
	
	let buf = dv.createBuffer(await descr)
	da_link && dv.queue.writeBuffer(buf,0,await data,)
	return buf
},)

create_gpu_object.set(
'gpu_texture',async ({
	type,
	descriptor:descr,
	data,
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
	
	let ibm = null //image bitmap
	if(data !== null){
		let img = document.createElement("img")
		img.crossOrigin = "anonymous" // Enable CORS
		img.src = new URL(data,parenturl,).toString()
				fgoi(key,'LOAD\t\t'+key,)
		await img.decode()
		ibm = await createImageBitmap(img)
				fgoi(key,'DONE '+key,)
		
	}
	
	if(pf.has(descr.format)){
		descr.format = pf.get(descr.format)
	}
	if(texsize.has(descr.size)){
		descr.size = texsize.get(descr.size)(ibm)
	}
	let texini = dv.createTexture(descr)
	
	if(data !== null){	
		dv.queue.copyExternalImageToTexture(
			{ source: ibm},
			{ texture: texini},
			[ibm.width, ibm.height],
		)
	}
	
	return texini
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


let tex = new Map()//texture
tex.set(
	'(context)',
	()=>context.getCurrentTexture(),
)

create_gpu_object.set(
'gpu_texture_view',async ({
	type,
	descriptor:descr,
	data,
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
	
	let view = (await reso.get(data)).createView(descr)
	return view
},)



let texview = new Map()//texture view
texview.set(
	'(context)',
	()=>context.getCurrentTexture().createView(cvd),
)

create_gpu_object.set(
'gpu_sampler',async ({
	type,
	descriptor:descr,
	data,
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
	
	return dv.createSampler(descr)
},)

create_gpu_object.set(
'audio_buffer_list',async ({
	type,
	descriptor:descr,
	data,
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	let wait = new Deferred()
	aubuflist.push(wait)
	
	await 0 //lih(type)
	await 0 //lih(type)
	
				fgoi(key,'LOAD\t\t'+key,)
	let arr = await fetch(new URL(data,parenturl,))
	arr = await arr.text()
	
	let out = tsvToObj(arr,'key',)
	
	//request, link
	for(let a in out){
		let b = out[a]
		let f0 = await fetch(new URL(b.data,parenturl,));
		b.data = f0.arrayBuffer();
	}
				fgoi(key,'DONE '+key,)
	
	//tunggu buffer
	for(let a in out){
		let b = out[a]
		let arrayBuffer = await b.data
		b.data = await aucx.decodeAudioData(arrayBuffer);
	}
	wait.run(out)
	return out
},)

create_gpu_object.set(
'audio_controller',async ({
	type,
	descriptor:descr,
	data,
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	let wait = new Deferred()
	descr.backsound && cont.push(wait)
	
	await 0 //lih(type)
	await 0 //lih(type)
	
				fgoi(key,'LOAD\t\t'+key,)
	let obj = await fetch(new URL(data,parenturl,))
	obj = await obj.text()
				fgoi(key,'DONE '+key,)
	obj = tsvToObj(obj,null,)
	auconlist.push(obj)
	
	wait.run(obj)
	return obj
},)

create_gpu_object.set(
'gpu_pipeline_layout',async ({
	type,
	descriptor:descr,
	data,
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
	
	let bglarr = descr.bindGroupLayouts
	bglarr.forEach(async (bgl,i,arr,)=>arr[i] = await reso.get(bgl))
	await Promise.all(bglarr)
	
	return dv.createPipelineLayout(descr)
},)

create_gpu_object.set(
'gpu_render_pipe',async ({
	type,
	descriptor:descr,
	data,
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
	
//layout
	let aa = descr.layout
	descr.layout = await reso.get(descr.layout)
	
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
				fgoi(key,'LOAD\t\t'+key,)
	descr.vertex.buffers = await Promise.all(
		descr.vertex.buffers
		.map(str=>
			(valtype(str) === 'string')
			?
			fetch(new URL(str,parenturl,))
			.then(res=>res.json())
			:
			str
		)
	)
				fgoi(key,'DONE '+key,)
	
	
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
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
	
	descr.code = fetch(new URL(descr.code,parenturl,))
				fgoi(key,'LOAD\t\t'+key,)
	descr.code = (await descr.code).text()
	descr.code = await descr.code
				fgoi(key,'DONE '+key,)
	return dv.createShaderModule(descr)
},)

create_gpu_object.set(
'gpu_buffer_binding',async ({
	type,
	descriptor:descr,
	data,
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
	
	
	descr.buffer = 
	bbf.has(descr.buffer)
	?bbf.get(descr.buffer)
	:await reso.get(descr.buffer)
	
	return descr
},)



let bbf //buffer binding format

create_gpu_object.set(
'gpu_bind_group_layout',async ({
	type,
	descriptor:descr,
	data,
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
	
	return dv.createBindGroupLayout(descr)
},)

create_gpu_object.set(
'gpu_bind_group',async ({
	type,
	descriptor:descr,
	data,
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
	
	for(let entry of descr.entries){
		entry.resource = await reso.get(entry.resource)
	}
/*========
	descr.layout = (await reso.get(descr.layout.pipe))
	.getBindGroupLayout(descr.layout.layout)
--------*/
	let aaaa
	descr.layout = await reso.get(aaaa = descr.layout)
	
	return dv.createBindGroup(descr)
},)

create_gpu_object.set(
'gpu_command_encoder',async ({
	type,
	descriptor:descr,
	data,
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
	
		for(let k_encometh in data){
			let encometh = data[k_encometh] = await reso.get(data[k_encometh])
		}
	
	let o = {
		descriptor:descr,
		data,
	}
	return o
},)

create_gpu_object.set(
'gpu_begin_render_pass',async (
/*========
{
	type,
	descriptor:descr,
	data,
	parenturl,
}
--------*/
	encometh,
	key,
)=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
			
			for(let ca of encometh.descriptor.colorAttachments){
				ca.view = texview.has(ca.view)
				?texview.get(ca.view)()
				:await reso.get(ca.view)
			}
			let dsa = encometh.descriptor.depthStencilAttachment
			dsa.view = await reso.get(dsa.view)
	
	return encometh
},)

create_gpu_object.set(
'gpu_clear_buffer',async ({
	type,
	descriptor:descr,
	data,
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
	
	data[0] = await reso.get(data[0])
	
	return {
		type,
		descriptor:descr,
		data,
	}
},)

create_gpu_object.set(
'gpu_copy_buffer_to_buffer',async ({
	type,
	descriptor:descr,
	data,
	parenturl,
},key,)=>{
	//dulu resosrclink, sekarang parenturl
	
	await 0 //lih(type)
	await 0 //lih(type)
	
	let i = (5 <= data.length)?2:1
	data[0] = await reso.get(data[0])
	data[i] = await reso.get(data[i])
	
	return {
		type,
		descriptor:descr,
		data,
	}
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
	usage:
		GPUTextureUsage.RENDER_ATTACHMENT |
		GPUTextureUsage.COPY_DST
	,
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


//lih(resosrc)
for(let key in resosrc){// resosrc.create
	let info = resosrc[key]// resosrc.create[key]
	reso.set(key,
		create_gpu_object
		.get(info.type)
		?.(info,key,),
	)
}
lih(reso)

let memorydict = {};
for (const [k,v,] of reso) {
	if ((await v) instanceof WebAssembly.Memory) memorydict[k] = await v;
}

tunggureso.run(memorydict)
wasmsrc = await Promise.all(await wasmsrc)
lih(wasmsrc)

aubuflist = Object.assign(...(await Promise.all(aubuflist)))

//ASLI
//cont = await contsrc

//COBA
cont = [].concat(...(await Promise.all(cont)))
lih(cont)
//
lih(auconlist)
for(let contgroup of auconlist){
for(let con of contgroup){
	con.src = aubuflist[con.src].data
}
}
/*========
for(let sound of cont){
	sound.src = aubuflist[sound.src].data
}
--------*/

suara = new _aucon(cont)
suara.play()

cload('menutup info...')




let waitgpu = null

let draw = async t=>{
	submitarr = []
	
	encoarr = []
	let wasmwait = []
	for(let wasm of wasmsrc){
		wasmwait.push(wasm.instance.exports.main?.(seek[0]))
	}
	await Promise.all(wasmwait)
	await runWAsmQueue()
	
	dv.queue.submit(submitarr)
	waitgpu = dv.queue.onSubmittedWorkDone()
}


/*========
= = = = = =
 = = = = = =
= = = = = =
 = = = = = =

let f_gpuce = {}//GPUCommandEncoder

f_gpuce['gpu_begin_render_pass'] = (
	{
		descriptor:descr,
		data:rpmeth,
	},
	enco,
)=>{
	for(let ca of descr.colorAttachments){
		if(ca.view.label === cvd.label){
			ca.view = context.getCurrentTexture().createView(cvd)
		}
	}
	
	let pass = enco.beginRenderPass(descr)
	for(let met of rpmeth){
		pass[met.method](...met.param)
	}
	pass.end()
	
}

f_gpuce['gpu_clear_buffer'] = (
	{
		descriptor:descr,
		data,
	},
	enco,
)=>{
	enco.clearBuffer(...data)
}

f_gpuce['gpu_copy_buffer_to_buffer'] = (
	{
		descriptor:descr,
		data,
	},
	enco,
)=>{
	enco.copyBufferToBuffer(...data)
}

f_gpuce['gpu_copy_texture_to_texture'] = (
	{
		descriptor:descr,
		data,
	},
	enco,
)=>{
	
	
	enco.copyTextureToTexture(
		{texture:data.src},
		{texture:data.dst},
		[data.w,data.h,],
	)
}

= = = = = =
 = = = = = =
= = = = = =
 = = = = = =
--------*/

let step = 0
let spf = 1 //steps per frame
set_setspf(val=>spf = val)

let loop = async t=>{
	now[0] = Math.round(performance.now())
	if(step-- <= 1){
		prevseek[0] = seek[0]
		seek[0] = suara.getCurTime()
		ranfl[0] = Math.random()
		
		step = spf
		await waitgpu //taruh di sebelum createView(); destroyed karena nunggu
		dv.queue.writeBuffer(miscbuf,0,misc,)
		draw(t)
	}
	
	requestAnimationFrame(loop)
	uiloop(t)
}
requestAnimationFrame(loop)

/*











*/

}
