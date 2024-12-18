'use strict'

import {
	vec3 as v3,
	mat4 as m4,
} from 'https://wgpu-matrix.org/dist/3.x/wgpu-matrix.module.js'



import {
	lihat as lih,
	sleep,
	tyarr_b64,
	b64_tyarr,
	pisahstr,
	//getWordByIndex,
} from './utilku.js'



import {
	render,
	bikinrenderPassDescriptor,
	bikindeptex,
	bikinDRAWbuf,
	bikinbind,
	bikinINDbuf,
	bikinVERTbuf,
	bikinrenpip,
	bikinUNISTObuf,
	bikinattrinfo,
	bikinmodule,
	bikinentry,
	write,
	pantau_gpudevice,
} from './pl.js'



import {
	canv3d,
	canv2d,
	cx3d,
	cx2d,
	tambahinfo,
	
	uicl,
	
	uiinsbuf,
	uiupdbuf,
	uidelbuf,
	
	uiinspass,
	uiupdpass,
	uidelpass,
} from './ui.js'



import {
	loadcam,
	fview,
} from './camera.js'

//cldict & subdict ga aku gabungin, script terlanjur ruwettt
export let cldict = {}
export let subdict = {} //jumlahnya = cldict

export let bufdict = {}
export let passdict = {}
export let animPdict = {}//player
export let animMdict = {}//mat2x2
export let animDdict = {}//data

let w = canv3d.width
let h = canv3d.height

let deptex =
bikindeptex(w,h,)

let rpd =
bikinrenderPassDescriptor(
	[0.0, 0.1, 0.2, 1,],
	deptex,
)

loadcam()

pantau_gpudevice.push(e=>{
	tambahinfo(e.error.message,'#ff00ffff','gpudeviceinfo',)
})

export let main = async()=>{ try{
	lih('teess, ini main js')
	
	requestAnimationFrame(loop)
/*========
	let cl = window.cl = await bikinclinfo(
		'https://hmbtdoeieiezztgpexpw.supabase.co',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtYnRkb2VpZWllenp0Z3BleHB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2Nzg0NjUsImV4cCI6MjA0NzI1NDQ2NX0.q1lwtj-oqhSXBPdvYRNpOxGQ4HJ-VX6g_jJws4eX_0A',
	)

	let cl = window.cl = await bikinclinfo(
		'https://gwpezptjslssarivlqro.supabase.co',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3cGV6cHRqc2xzc2FyaXZscXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0OTc4NzYsImV4cCI6MjA0ODA3Mzg3Nn0.MddHNM2aeBTNdys19AW544maLh-7ipzsQz8Yzl7h6AA',
	)
--------*/

	
}catch(err){
	lih(err)
} }

let loop = async t=>{
	
	await renderpassdict()
	requestAnimationFrame(loop)
	//setTimeout(loop,111,)
}

//let view = m4.create()
let misc = new ArrayBuffer((
	+16 //camera view
	+4 //time now & 3 pad
)*4)
let view = new Float32Array(misc,( 0 )*4,16,)
let now = new Uint32Array(misc,( 0+16 )*4,4,)
fview(camera_view=>{
	m4.copy(camera_view,view,)
})


let clid = 0
export let bikinclinfo = async (supabaseUrl, supabaseKey,)=>{
	//bikin client
	let clini = supabase.createClient(supabaseUrl, supabaseKey,)
	lih(clini)
	
	await _getbufarr(clini)
	await getpassarr(clid)
	await getanimParr(clid)
	await getanimMarr(clid)
	await getanimDarr(clid)
	pantaubufarr(clid)
	pantaupassarr(clid)
	pantauanimParr(clid)
	pantauanimMarr(clid)
	pantauanimDarr(clid)
	
	uicl(cldict)
	
	return clid++
}

export let hapusclinfo = clid=>{
	let f = f_cl_cari
	clid = String(clid)
	
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	subdict[clid].buf.unsubscribe()
	subdict[clid].pass.unsubscribe()
	delete subdict[clid]
	
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	f(passdict,clid,k=>{
		delete passdict[k]
		urutkanpass = true
		uidelpass(k)
	})
	
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	f(bufdict,clid,k=>{
		bufdict[k].buffer.destroy()
		delete bufdict[k]
		uidelbuf(k)
	})
	
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	f(animPdict,clid,k=>{ delete animPdict[k] })
	f(animMdict,clid,k=>{ delete animMdict[k] })
	f(animDdict,clid,k=>{ delete animDdict[k] })
	
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	delete cldict[clid]
	
	uicl(cldict)
	lih(`cl ${clid} deletedddd`)
}



let f_cl_cari = (dict,str,f,)=>{
	for (let key of Object.keys(dict)) {
		if (key.startsWith(str+' ')) {
			f(key)
		}
	}
}

let _getbufarr = async cl=>{ //juga untuk cek url & key found
	let payload = await cl
	.from('buffer_list')
	.select('*')
	
	if(payload.error){
		let i = payload.error.details
		tambahinfo(i,'#ff0000ff',) 
		throw i
	}
	cldict[clid] = cl
	subdict[clid] = {
		buf:null,
		pass:null,
		animP:null,
		animM:null,
		animD:null,
	}
	
	let o = {
		eventType:'INSERT',
	}
	for(let rowini of payload.data){
		o.new = rowini
		rowbuf(clid,o,)
	}
	
	return payload
}

export let bikinbufarr = async (clid,inparr,)=>{
	let cl = cldict[clid]
	if(!cl){return tambahinfo(`client id: ${clid} tidak ditemukan.`,'orange',)}
	let outarr = []

	for(let row of inparr){
		outarr.push({
			waktu_edit:Date.now(),
			usage:row[0],
			buffer:tyarr_b64(row[1]),
			source:row[2],
		})
	}
	
	return await cl
	.from('buffer_list')
	.insert(outarr)
	.select()
}

export let updbuf = async (clid,bufid,buf,source,)=>{
	let o = { waktu_edit:Date.now(), }
	buf && (o.buffer = tyarr_b64(buf))
	source && (o.source = source)
	
	return await cldict[clid]
	.from('buffer_list')
	.update(o)
	.eq('id',bufid,)
	.select()
}

export let hapusbuf = async (clid,bufid,)=>{
	return await cldict[clid]
	.from('buffer_list')
	.delete()
	.eq('id',bufid,)
}

let getpassarr = async clid=>{
	let payload = await cldict[clid]
	.from('pass_list')
	.select('*')
	
	let o = {
		eventType:'INSERT',
	}
	for(let rowini of payload.data){
		o.new = rowini
		rowpass(clid,o,)
	}
	
	return payload
}

export let bikinpassarr = async (clid,inparr,)=>{
	let cl = cldict[clid]
	if(!cl){return tambahinfo(`client id: ${clid} tidak ditemukan.`,'orange',)}
	let outarr = []

	for(let row of inparr){
		outarr.push({
			waktu_edit	:Date.now(),
			attrarr	:row[0],
			bindarr	:row[1],
			draw	:row[2],
			index	:row[3],
			vertex	:row[4],
			wgsl	:row[5],
			passorder	:row[6],
		})
	}
	
	return await cl
	.from('pass_list')
	.insert(outarr)
	.select()
}

export let updpass = async (clid,id,col,val,)=>{
	return await cldict[clid]
	.from('pass_list')
	.update({
		waktu_edit:Date.now(),
		[col]:val,
	})
	.eq('id',id,)
	.select()
}

export let hapuspass = async (clid,passid,)=>{
	return await cldict[clid]
	.from('pass_list')
	.delete()
	.eq('id',passid,)
}

let getanimParr = async clid=>{ //animP
	let payload = await cldict[clid]
	.from('animplayer_list')
	.select('*')
	
	let o = {
		eventType:'INSERT',
	}
	for(let rowini of payload.data){
		o.new = rowini
		rowanimP(clid,o,)
	}
	
	return payload
}

let bikinanimParr = async (clid,inparr,)=>{
	let outarr = []

	for(let row of inparr){
		outarr.push({
			waktu_edit	:Date.now(),
			transformer	:row[0],
			target	:row[1],
			byteoffset	:row[2],
		})
	}
	
	return await cldict[clid]
	.from('animplayer_list')
	.insert(outarr)
	.select()
}

let updanimP = async (clid,id,col,val,)=>{
	return await cldict[clid]
	.from('animplayer_list')
	.update({
		waktu_edit:Date.now(),
		[col]:val,
	})
	.eq('id',id,)
	.select()
}

let hapusanimP = async (clid,id,)=>{
	return await cldict[clid]
	.from('animplayer_list')
	.delete()
	.eq('id',id,)
}

let getanimMarr = async clid=>{ //animM
	let payload = await cldict[clid]
	.from('animmat2_list')
	.select('*')
	
	let o = {
		eventType:'INSERT',
	}
	for(let rowini of payload.data){
		o.new = rowini
		rowanimM(clid,o,)
	}
	
	return payload
}

let bikinanimMarr = async (clid,inparr,)=>{
	let outarr = []

	for(let row of inparr){
		outarr.push({
			waktu_edit	:Date.now(),
			time	:row[0],
			mat	:row[1],
			datasrc	:row[2],
		})
	}
	
	return await cldict[clid]
	.from('animmat2_list')
	.insert(outarr)
	.select()
}

let updanimM = async (clid,id,col,val,)=>{
	return await cldict[clid]
	.from('animmat2_list')
	.update({
		waktu_edit:Date.now(),
		[col]:val,
	})
	.eq('id',id,)
	.select()
}

let hapusanimM = async (clid,id,)=>{
	return await cldict[clid]
	.from('animmat2_list')
	.delete()
	.eq('id',id,)
}

let getanimDarr = async clid=>{ //animD
	let payload = await cldict[clid]
	.from('animdata_list')
	.select('*')
	
	let o = {
		eventType:'INSERT',
	}
	for(let rowini of payload.data){
		o.new = rowini
		rowanimD(clid,o,)
	}
	
	return payload
}

let bikinanimDarr = async (clid,inparr,)=>{
	let outarr = []

	for(let row of inparr){
		outarr.push({
			waktu_edit	:Date.now(),
			time	:row[0],
			data	:row[1],
			size	:row[2],
		})
	}
	
	return await cldict[clid]
	.from('animdata_list')
	.insert(outarr)
	.select()
}

let updanimD = async (clid,id,col,val,)=>{
	return await cldict[clid]
	.from('animdata_list')
	.update({
		waktu_edit:Date.now(),
		[col]:val,
	})
	.eq('id',id,)
	.select()
}

let hapusanimD = async (clid,id,)=>{
	return await cldict[clid]
	.from('animdata_list')
	.delete()
	.eq('id',id,)
}

let pantaubufarr = clid=>
	subdict[clid].buf = cldict[clid]
	.channel('pantau buffer')
	.on(
	'postgres_changes',
	{
		event:'*',
		schema:'public',
		table:'buffer_list'
	},
	pa=>f_pantaubufarr(clid,pa,),
	).subscribe()

let f_pantaubufarr = (clid,payload,)=>{
	//lih('ada updateee')
	//lih(payload)
	if(payload.errors){ return errors }
	rowbuf(clid,payload,)
}

let rowbuf = (clid,payload,)=>{
	let newdata = payload.new
	pantaubuf[payload.eventType](
		clid,
		newdata?.id ?? payload.old.id,
		new Date(+newdata?.waktu_edit),
		newdata?.usage,
		newdata?.buffer,
		newdata?.source,
	)
}

let pantaupassarr = clid=>
	subdict[clid].pass = cldict[clid]
	.channel('pantau pass')
	.on(
	'postgres_changes',
	{
		event:'*',
		schema:'public',
		table:'pass_list'
	},
	pa=>f_pantaupassarr(clid,pa,),
	).subscribe()


let f_pantaupassarr = (clid,payload,)=>{
	//lih('ada updateee')
	//lih(payload)
	if(payload.errors){ return errors }
	rowpass(clid,payload,)
}

let rowpass = (clid,payload,)=>{
	pantaupass[payload.eventType](clid,payload,)
}

let pantauanimParr = clid=>
	subdict[clid].animP = cldict[clid]
	.channel('pantau animP')
	.on(
	'postgres_changes',
	{
		event:'*',
		schema:'public',
		table:'animplayer_list'
	},
	pa=>f_pantauanimParr(clid,pa,),
	).subscribe()


let f_pantauanimParr = (clid,payload,)=>{
	//lih('ada updateee')
	//lih(payload)
	if(payload.errors){ return errors }
	rowanimP(clid,payload,)
}

let rowanimP = (clid,payload,)=>{
	pantauanimP[payload.eventType](clid,payload,)
}

let pantauanimMarr = clid=>
	subdict[clid].animM = cldict[clid]
	.channel('pantau animM')
	.on(
	'postgres_changes',
	{
		event:'*',
		schema:'public',
		table:'animmat2_list'
	},
	pa=>f_pantauanimMarr(clid,pa,),
	).subscribe()


let f_pantauanimMarr = (clid,payload,)=>{
	//lih('ada updateee')
	//lih(payload)
	if(payload.errors){ return errors }
	rowanimM(clid,payload,)
}

let rowanimM = (clid,payload,)=>{
	pantauanimM[payload.eventType](clid,payload,)
}

let pantauanimDarr = clid=>
	subdict[clid].animD = cldict[clid]
	.channel('pantau animD')
	.on(
	'postgres_changes',
	{
		event:'*',
		schema:'public',
		table:'animdata_list'
	},
	pa=>f_pantauanimDarr(clid,pa,),
	).subscribe()


let f_pantauanimDarr = (clid,payload,)=>{
	//lih('ada updateee')
	//lih(payload)
	if(payload.errors){ return errors }
	rowanimD(clid,payload,)
}

let rowanimD = (clid,payload,)=>{
	pantauanimD[payload.eventType](clid,payload,)
}

let usfubuf = { //usage_function buffer
	vertex:bikinVERTbuf,
	index:bikinINDbuf,
	uniform:bikinUNISTObuf,
	storage:bikinUNISTObuf,
	draw:bikinDRAWbuf,
}
let pantaubuf = {}

let pantaupass = {}

let pantauanimP = {}

let pantauanimM = {}

let pantauanimD = {}

pantaubuf.INSERT = async ( clid, id, waktu_edit, usage, buffer, source, )=>{
	let gpubuf = usfubuf[usage]( b64_tyarr(buffer), usage === 'uniform', )
	let key = `${clid} ${id}`
	
	//f_source[source]?.(key)
	bufdict[key] = {
		waktu_edit,
		usage,
		buffer:gpubuf,
		source,
		passarr:[],
		fsfh:null, //file system file handler
		realtime:false,
		lastmod:null,
	}
	uiinsbuf(clid,id,)
}

pantaupass.INSERT = async ( clid, payload, )=>{
	let newdata = payload.new
	let adaerror = null
	
	let mod = await bikinmodule(newdata.wgsl);		if(mod instanceof GPUValidationError){ adaerror = mod }
	let attrarr = newdata.attrarr
	let attrinfo = bikinattrinfo(pisahstr(attrarr))
	
	let id = newdata.id
	let waktu_edit = new Date(+newdata.waktu_edit)
	
	let entries = []
	let pass = passdict[`${clid} ${id}`] = {}
	
	for(let info of attrinfo.formaterrorarr){
		adaerror = adaerror ?? {message:''}
		adaerror.message +=
`format: ${info} tidak valid.
	di table Pass
	di kolom attrarr
	di client id ${clid}
	di id ${id}
`
	}
	let gpupipe = adaerror?null:bikinrenpip(mod,attrinfo,)
	if(!adaerror){
		let i = 0
		for(let bufid of pisahstr(newdata.bindarr)){
			let buf = bufdict[`${clid} ${bufid}`]
			if(!buf){
				adaerror = {message:
`buffer id: ${bufid} tidak ditemukan. 
	di table Pass
	di kolom bindarr
	di client id ${clid}
	di id ${id}
`
				}
				continue
			}
			let buffer = buf.buffer
			let entry = bikinentry(i,buffer,)
			entry.resource = buf
			buf.passarr.push(pass)
			entries.push(entry)
			
			i++
		}
	}
	
	let bind = adaerror?null:bikinbind(gpupipe,0,entries,)
	
	let vertex = `${clid} ${newdata.vertex}`
	let index = `${clid} ${newdata.index}`
	let draw = `${clid} ${newdata.draw}`

	pass.waktu_edit	= waktu_edit
	pass.attrinfo	= attrinfo
	pass.entries	= entries
	pass.entries_ui = newdata.bindarr
	
	pass.gpupipe	= gpupipe
	pass.vertex	= vertex
	pass.index	= index
	pass.bind	= bind
	pass.draw	= draw
	pass.order	= newdata.passorder
	
	pass.getvertex = passgetvertex
	pass.getindex = passgetindex
	pass.getdraw = passgetdraw
	
	urutkanpass = true
	uiinspass(clid,id,)
	;adaerror && tambahinfo(adaerror.message,'orange',)
}
/*=-=-=-=-=-=-=-=-










=-=-=-=-=-=-=-=-*/
let passgetvertex = pass=>cekpassget(pass,'vertex',)
let passgetindex = pass=>cekpassget(pass,'index',)
let passgetdraw = pass=>cekpassget(pass,'draw',)

let cekpassget = (pass,usage,)=>{
	let k = pass[usage]
	let buf = bufdict[k]
	let [clid,id,] = k.split(' ')
	buf??tambahinfo(
`buffer id: ${id} tidak ditemukan
	di table Pass
	di kolom ${usage}
	di client id ${clid}
	di id ${id}
`
	,'red','errorbufid',)
	return buf?.buffer
}

pantauanimP.INSERT = async(clid,payload,)=>{
	let newdata = payload.new
	let id = newdata.id
	
	animPdict[`${clid} ${id}`] = newdata
}

pantauanimM.INSERT = async(clid,payload,)=>{
	let newdata = payload.new
	let id = newdata.id
	
	animMdict[`${clid} ${id}`] = newdata
}

pantauanimD.INSERT = async(clid,payload,)=>{
	let newdata = payload.new
	let id = newdata.id
	
	animDdict[`${clid} ${id}`] = newdata
}

pantaubuf.UPDATE = async ( clid, id, waktu_edit, usage, buffer, source, )=>{
	let bufini = bufdict[`${clid} ${id}`]
	
	bufini.waktu_edit = waktu_edit
	bufini.source = source
	uiupdbuf(clid,id,)
	
	if(source !== 'database'){
		return null
	}
	if((buffer = b64_tyarr(buffer)) === 'kosong'){
		return null
	}
	if(buffer.byteLength === bufini.buffer.size){
		write(bufini.buffer,buffer,)		//;lih('write')
		return null
	}
	bufini.buffer.destroy()		//;lih('ganti buffer size')
	bufini.buffer = usfubuf[usage](buffer,usage === 'uniform',)
	
	for(let pass of bufini.passarr){
		pass.bind = 'kosong'
	}
}

pantaupass.UPDATE = async(clid,payload,)=>{
	//uiupdpass()
	
	let newdata = payload.new
	let k = `${clid} ${newdata.id}`

	let pass = passdict[k]
	pass.draw = `${clid} ${newdata.draw}`
	pass.index = `${clid} ${newdata.index}`
	pass.vertex = `${clid} ${newdata.vertex}`
	pass.order = newdata.passorder
	
	urutkanpass = true
	uiupdpass(clid,newdata.id,)
}

pantauanimP.UPDATE = async(clid,payload,)=>{
	
}

pantauanimM.UPDATE = async(clid,payload,)=>{
	
}

pantauanimD.UPDATE = async(clid,payload,)=>{
	
}

pantaubuf.DELETE = async ( clid, id, )=>{
	let k = `${clid} ${id}`
	//lih('delete')
	bufdict[k].buffer.destroy()
	delete bufdict[k]
	uidelbuf(k)
}

pantaupass.DELETE = async ( clid, payload, )=>{
	//lih('delete')
	let k = `${clid} ${payload.old.id}`
	for(let entry of passdict[k].entries){
		let arr = entry.resource.passarr
		arr.splice(arr.indexOf(passdict[k]),1,)
	}
	delete passdict[k]
	urutkanpass = true
	uidelpass(k)
}

pantauanimP.DELETE = async(clid,payload,)=>{
	
}

pantauanimM.DELETE = async(clid,payload,)=>{
	
}

pantauanimD.DELETE = async(clid,payload,)=>{
	
}

let urutkanpass = false
let passurut = []
let renderpassdict = async ()=>{
	now[0] = Math.round(performance.now())
	
	//cek bind update
	for(let passid in passdict){
		let pass = passdict[passid]
		if(pass.bind === 'kosong'){ pass.bind = bikinbind(pass.gpupipe,0,pass.entries,) }
	}
	
	if(urutkanpass){
		urutkanpass = false
		//sampe sini, nanti
		passurut = Object
		.values(passdict)
		.sort((a,b,)=>a.order-b.order)
	}
	
	for(let k in bufdict){
		let buf = bufdict[k]
		
		if(buf.fsfh && buf.realtime){
			buffile(k)
		}
		
		f_source[buf.source]?.(k)
	}
	
	//render
	await render(rpd,[],passurut,)
}

export let buffile = async k=>{
	let buf = bufdict[k]
	let file = await buf.fsfh.getFile()
	if(buf.lastmod !== file.lastModified){
		buf.lastmod = file.lastModified
		let idarr = k.split(' ')
		updbuf(
			idarr[0],
			idarr[1],
			await file.arrayBuffer(),
			null,
		)
	}
}

let f_source = {}

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
f_source.camera = key=>{
	let buf = bufdict[key]
	write(buf.buffer,view,)
}
window.cldict = cldict
window.subdict = subdict

window.bufdict = bufdict
window.passdict = passdict
window.animPdict = animPdict
window.animMdict = animMdict
window.animDdict = animDdict

//window.bikinclinfo = bikinclinfo
//window.hapusclinfo = hapusclinfo

//window.bikinbufarr = bikinbufarr
//window.updbuf = updbuf
//window.hapusbuf = hapusbuf

//window.bikinpassarr = bikinpassarr
//window.bikinanimParr = bikinanimParr

window.renderpassdict = renderpassdict

/*=============










----------------*/

window.coba = async()=>{ //=-=-=-=-=-=-=-=-

	let mod =
	await bikinmodule(`



@group(0) @binding(0) var<uniform> mat:mat4x4f;

struct vout{
	@builtin(position) posout:vec4f,
	@location(0) warna:vec4f,
}

@vertex fn vvvv(
	@location(0) pos:vec3f,
	@location(1) warna:vec4f,
)-> vout{
	let m0 = mat;
	return vout(
		m0*vec4f(pos,1.,),
		warna,
	);
}

@fragment fn fff(
	out:vout,
)-> @location(0) vec4f{
	return out.warna;
}


	
	`)

	let attrinfo =
	bikinattrinfo([
		'float32x3', //pos
		'unorm8x4', //warna
	])

	let stobuf =
	bikinUNISTObuf(
	new Float32Array([ //mat
		0.5, 0.0, 0.0, 0.0,
		0.0, 0.5, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0,
	])
	,true,)
	
	let gpupipe =
	bikinrenpip(
		mod,
		attrinfo,
	)

	let entries = []
	entries.push(
	bikinentry(
		0,
		stobuf,
	)
	)

/*========
	let deptex =
	bikindeptex(w,h,)
--------*/

	let vertex =
	bikinVERTbuf(
	new Float32Array([
		0,1.2,.5, -2555532.3453,
		0,0,.5, 95.2,
		.7,0,.5, -.0011457,
	])
	)

	let index =
	bikinINDbuf(
	new Uint16Array([
		0,1,2, 0,
	])
	)

	let bind =
	bikinbind(
		gpupipe,
		0,
		entries,
	)

	let draw =
	bikinDRAWbuf(
	new Uint32Array([
		3,1,0,0,0,
	])
	)

/*========
	let rpd =
	bikinrenderPassDescriptor(
		[0.0, 0.1, 0.2, 1,],
		deptex,
	)
--------*/

	let passarr = []
	passarr.push({
		gpupipe,
		vertex:{buffer:vertex,},
		index:{buffer:index,},
		bind,
		draw:{buffer:draw,},
	})

await render(rpd,[],passarr,)

	} /*-=+-=+-=+-=+-=+-=+-=+-=+

/*
-=-===-=-=-==--=-=-=--==--==--=











-=-===-=-=-==--=-=-=--==--==--=
*/
