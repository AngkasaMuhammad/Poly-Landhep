"use strict"

import {
	bikinclinfo,
	hapusclinfo,
	
	bufdict,
	updbuf,
	buffile,
	bikinbufarr,
	hapusbuf,
	
	bikinpassarr,
	updpass,
	hapuspass,
} from './main.js'

import {
	lihat as lih,
	que,
	attr,
} from './utilku.js'
/*
let lih = ru.lihat
let que = ru.que
let attr = ru.attr
*/

let fSH = e=>{
	let cur = e.currentTarget
	let n = cur.classList.toggle('nyala')
	let c = que(attr(cur,'sasaran',))[0].classList
	let s = 'hidechild'
	c.contains(s)?c.remove(s):c.add(s)
}
que('#SHhelp')[0].addEventListener('click',fSH,)
que('#SHdata')[0].addEventListener('click',fSH,)
que('#SHinfo')[0].addEventListener('click',fSH,)

let supaurl = que('#supaurl')[0]
let supakey = que('#supakey')[0]
/*=-=-=-=-=-=-=-=-










=-=-=-=-=-=-=-=-*/
//cl
export let uicl = cldict=>{
	let tbody = que('#cl')[0]
	tbody.innerHTML = ''
	
	for(let k in cldict){
		let tr,td
		let cl = cldict[k]
		tr = document.createElement('tr')
			td = document.createElement('td')
				td.appendChild(svghapus(hapuscl))
			tr.appendChild(td)
			td = document.createElement('td')
				td.textContent = k
			tr.appendChild(td)
			td = document.createElement('td')
				td.textContent = cl.supabaseUrl
			tr.appendChild(td)
			td = document.createElement('td')
				td.textContent = cl.supabaseKey
			tr.appendChild(td)
		tbody.appendChild(tr)
	}
}
que('#newcl')[0].addEventListener('click',e=>{
	let url = supaurl.value
	let key = supakey.value
	bikinclinfo(url,key,).catch(e=>tambahinfo(e,'red',))
	supaurl.value =
	supakey.value = ''
},)
let hapuscl = e=>{
	if(e.detail%2){return}
	let cur = e.currentTarget
	cur.onmouseleave(e)
	let trch = cur
	.parentElement
	.parentElement
	.children
	
	supaurl.value = trch[2].textContent
	supakey.value = trch[3].textContent
	
	hapusclinfo(lih(
		trch[1]
		.textContent
	))
}
/*=-=-=-=-=-=-=-=-










=-=-=-=-=-=-=-=-*/
//buf
que('#newbuf')[0].addEventListener('click',e=>{
	bikinbufarr(que('#bufclid')[0].value,[[
		que('#bufusage')[0].value,
		new ArrayBuffer(16*4),
		'database',
	]],)
},)
let f_hapusbuf = e=>{
	if(e.detail%2){return}
	let cur = e.currentTarget
	cur.onmouseleave(e)
	let tr = cur
	.parentElement
	.parentElement
	lih(tr)
	hapusbuf(...attr(tr,'bufkey',).split(' '))
	
}
export let uiinsbuf = (clid,id,)=>{
	
	let tbody = que('#buf')[0]
	let tr,td,select
	let k = `${clid} ${id}`
	let buf = bufdict[k]
	let k0 = clid
	let k1 = id
	tr = document.createElement('tr')
		attr(tr,'bufkey',k,)
		
		td = document.createElement('td')
			td.appendChild(svghapus(f_hapusbuf))
		tr.appendChild(td)
		td = document.createElement('td')
			td.textContent = k0
		tr.appendChild(td)
		td = document.createElement('td')
			td.textContent = k1
		tr.appendChild(td)
		td = document.createElement('td')
			let button = document.createElement('button')
				button.textContent = '{kosong}'
				button.addEventListener('click',bukafilebuf,)
			td.appendChild(button)
			let inp = document.createElement('input')
				inp.type = 'checkbox'
				inp.addEventListener('input',realtimecheck,)
				inp.checked = false
				attr(inp,'mousedescr','Realtime',)
			td.appendChild(inp)
		tr.appendChild(td)
		td = document.createElement('td')
			td.textContent = buf.usage
		tr.appendChild(td)
		td = document.createElement('td')
			select = document.createElement('select')
				select.innerHTML = `

<option value="database"	>database	</option>
<option value="camera"	>camera	</option>

				`
				select.addEventListener('change',pilihsource,)
				select.value = buf.source
			td.appendChild(select)
		tr.appendChild(td)
	tbody.appendChild(tr)
}
let realtimecheck = e=>{
	let inp = e.currentTarget
	let trch = inp
	.parentElement
	.parentElement
	.children
	
	let clid = trch[1].textContent
	let id = trch[2].textContent
	let buf = bufdict[`${clid} ${id}`]
	inp.checked = buf.realtime = !buf.realtime
}
let pilihsource = e=>{
	let trch = e
	.currentTarget
	.parentElement
	.parentElement
	.children
	
	updbuf(
		trch[1].textContent,
		trch[2].textContent,
		null,
		trch[5].firstElementChild.value,
	)
}
let bukafilebuf = async e=>{
	let button = e.currentTarget
	let tr = button
	.parentElement
	.parentElement
	
	let [fsfh] = await showOpenFilePicker()
	let k = attr(tr,'bufkey',)
	bufdict[k].fsfh = fsfh
	buffile(k)
	button.textContent = fsfh.name
}
export let uiupdbuf = (clid,id,)=>{
	que(`
		[bufkey="${clid} ${id}"]
		> :nth-child(6)
		> *
	`)[0].value = bufdict[`${clid} ${id}`].source
}
export let uidelbuf = k=>{
	que(`[bufkey="${k}"]`)[0].remove()
}
//setInterval(upduibuf,333,)
/*=-=-=-=-=-=-=-=-










=-=-=-=-=-=-=-=-*/
//pass
let fsfhwgsl = null
que('#filewgsl')[0].addEventListener('click',async e=>{
	let button = e.currentTarget
	
	;[fsfhwgsl] = await showOpenFilePicker()
	button.textContent = fsfhwgsl.name
	
},)
que('#newpass')[0].addEventListener('click',async e=>{
	if(!fsfhwgsl){ return tambahinfo('kolom wgsl harus ada file.','orange',) }
	lih('upload pass')
	let wgsldata = await fsfhwgsl.getFile()
	bikinpassarr(que('#passclid')[0].value,[[
			que('#attrarr')[0].value,
			que('#bindarr')[0].value,
			0,//draw
			0,//index
			0,//vertex
			await wgsldata.text(),
			0,//order
		]],
	)
},)
let f_updpass = e=>{
	let inp = e.currentTarget
	let tr = inp
	.parentElement
	.parentElement
	let [clid,id,] = attr(tr,'passkey',).split(' ')
	updpass(
		clid,
		id,
		attr(inp,'updcol',),
		+inp.value,
	)
}
let f_hapuspass = e=>{
	if(e.detail%2){return}
	let cur = e.currentTarget
	cur.onmouseleave(e)
	let tr = cur
	.parentElement
	.parentElement
	lih(tr)
	hapuspass(...attr(tr,'passkey',).split(' '))
	
}

export let uiinspass = (clid,id,)=>{
	let tbody = que('#pass')[0]
	
	let tr,td,div,inp
	let k = `${clid} ${id}`
	let pass = passdict[k]
	tr = document.createElement('tr')
		attr(tr,'passkey',k,)
		
		td = document.createElement('td')
			td.appendChild(svghapus(f_hapuspass))
		tr.appendChild(td)
		td = document.createElement('td')
			td.textContent = clid
		tr.appendChild(td)
		td = document.createElement('td')
			td.textContent = id
		tr.appendChild(td)
		td = document.createElement('td')
			let str = ''
			for(let strattr of pass.attrinfo.attributes){
				str += strattr.format+'\n'
			}
			td.textContent = str//pass.attrinfo.attributes.reduce((a,b,)=>a+'\n'+b.format,undefined,)
		tr.appendChild(td)
		td = document.createElement('td')
			td.textContent = pass.entries_ui
		tr.appendChild(td)
		td = document.createElement('td')
			inp = document.createElement('input')
				attr(inp,'updcol','draw',)
				inp.addEventListener('change',f_updpass,)
				inp.type = 'number'
				inp.value = +pass.draw.split(' ')[1]
			td.appendChild(inp)
		tr.appendChild(td)
		td = document.createElement('td')
			inp = document.createElement('input')
				attr(inp,'updcol','index',)
				inp.addEventListener('change',f_updpass,)
				inp.type = 'number'
				inp.value = +pass.index.split(' ')[1]
			td.appendChild(inp)
		tr.appendChild(td)
		td = document.createElement('td')
			inp = document.createElement('input')
				attr(inp,'updcol','vertex',)
				inp.addEventListener('change',f_updpass,)
				inp.type = 'number'
				inp.value = +pass.vertex.split(' ')[1]
			td.appendChild(inp)
		tr.appendChild(td)
		td = document.createElement('td')
		tr.appendChild(td)
		td = document.createElement('td')
			inp = document.createElement('input')
				attr(inp,'updcol','passorder',)
				inp.addEventListener('change',f_updpass,)
				inp.type = 'number'
				inp.value = +pass.order
			td.appendChild(inp)
		tr.appendChild(td)
	tbody.appendChild(tr)
}
export let uiupdpass = (clid,id,)=>{
	lih('update pass')
	let k = `${clid} ${id}`
	let pass = passdict[k]
	que(`[passkey="${k}"] [updcol="draw"]`)[0].value = pass.draw.split(' ')[1]
	que(`[passkey="${k}"] [updcol="index"]`)[0].value = pass.index.split(' ')[1]
	que(`[passkey="${k}"] [updcol="vertex"]`)[0].value = pass.vertex.split(' ')[1]
	que(`[passkey="${k}"] [updcol="passorder"]`)[0].value = pass.order
}
export let uidelpass = k=>{
	que(`[passkey="${k}"]`)[0].remove()
}
/*=-=-=-=-=-=-=-=-










=-=-=-=-=-=-=-=-*/
//lain - lain
let svghapus = f=>{//copy gambar tongsampah
	let del = que('#del')[0].cloneNode(true)
	del.classList.remove('hilang')
	del.id = ''
	del.addEventListener('click',f,)+
	attr(del,'mousedescr','Hapus (double click)',)
	return del
}
let infolist = que('#infolist')[0]
let infolistcla = infolist.classList
export let tambahinfo = (i,warna,infokey,)=>{
	let cek = Math.random()
	let adaele
	if((infokey ?? cek) !== cek){//apakah infoke berupa null atau undefined
		adaele	= que(`#infolist [infokey="${infokey}"`)[0]
	}
	if(adaele){
		//infolistcla.add('infoupdate')
		adaele.style.background = `rgba(66,66,66,${Math.random()})`
		let t = Date.now()
		if(4 < t-attr(adaele,'timestamp',)){// biar ga spam info
			adaele.textContent = ''
		}
		attr(adaele,'timestamp',t,)
		adaele.textContent += i+'\n'
		return 0
	}
	let div = document.createElement('div')
		div.textContent = i
		div.style.color = warna
		//div.classList.add('bukainfo')
		div.addEventListener('click',f_info,)
		attr(div,'infokey',infokey,)
		attr(div,'timestamp',Date.now(),)
	let inli = que('#infolist')[0]
	inli.appendChild(div)
	//;(11 <= inli.childElementCount) && inli.removeChild(inli.firstElementChild)
}
let f_info = e=>{
	if(!(e.detail%2)){
		e.currentTarget.classList.toggle('bukainfo')
	}
}

//setInterval(()=>infolistcla.remove('infoupdate'),1111,)
setInterval(()=>{
	for(let ele of infolist.children){
		ele.style.background = ''
		//sampe sini
	}
},1111,)
addEventListener('load',()=>tambahinfo(
`Selamat datang di Realtime 3d, silakan -->> DOUBLECLICK <<-- info ini (expand & collapse)

--------------------------
"Antrian kendaraan menuju Damaskus setelah runtuhnya Assad"

Web ini sedang Work_In_Progress

Saat ini aku mau tunjukkan:
- Perubahan bentuk objek secara realtime
	Aku edit dari Blender, hasilnya langsung terlihat
	Supabase sebagai storage kumpulan objek 3d

Untuk memulai:
1. Click Show/Hide data (icon mata)
2. Click "Tambah client"
3. Data jangan diotak atik, cukup dilihat, atau Click Show/Hide data, biar ga kepejet
4. Gerakkan kamera, baca petunjuk

Next: bikin gerakan armature (pohon goyang, engsel, dll)
Tunggu update selanjutnya

Maturnuwun

`,'cyan',),)
/*=-=-=-=-=-=-=-=-










=-=-=-=-=-=-=-=-*/
	//mousetext
	
	let datang = e=>moutex.textContent = attr(e.target,'mousedescr',)
	let pergi = e=>moutex.textContent = ''
	
	let moutex = que('#moutex')[0]
	/*
	for(let ele of que('[mousedescr]')){
		ele.addEventListener('mouseenter',datang,)
		ele.addEventListener('mouseleave',pergi,)
	}
	*/
	let berimouseevent = e=>{
		if(//kasih event listener
			attr(e.target,'mousedescr',) &&
			!e.target.onmouseenter
		){
			;(e.target.onmouseenter = datang)({target:e.target})
			e.target.onmouseleave = pergi
		}
	}
	addEventListener('mousedown',berimouseevent,)
	addEventListener('mousemove',e=>{
		berimouseevent(e)
		let x = Math.min(e.clientX+11,innerWidth-moutex.clientWidth,)
		let y = Math.min(e.clientY+11,innerHeight-moutex.clientHeight,)
		moutex.style.left = x+'px'
		moutex.style.top = y+'px'
	})
	
	//canvas resize
	export let canv3d = document.querySelector('#canv3d')
	export let canv2d = document.querySelector('#canv2d')
	export let cx3d = canv3d.getContext('webgpu')
	export let cx2d = canv2d.getContext('2d')
	let canvres = e=>{
		let s3d = canv3d.style
		let s2d = canv2d.style
		if(innerWidth/innerHeight > canv3d.width/canv3d.height){
			s3d.height = '100%'
			s3d.width = ''
		}else{
			s3d.height = ''
			s3d.width = '100%'
		}
		s2d.height = s3d.height
		s2d.width = s3d.width
	}
	addEventListener('resize',canvres,)
	canvres()