"use strict"
/*
RENCANA:
=>	updbuf
--	reload row manual
	
*/

import {
	lihat as lih,
	que,
	attr,
} from './utilku.js'
import {
	getsuara,
	freecam, //dari misc
} from './main.js'




let fSH = e=>{
	let cur = e.currentTarget
	let n = cur.classList.toggle('nyala')
	let c = que(attr(cur,'sasaran',))[0].classList
	let s = 'hidechild'
	c.contains(s)?c.remove(s):c.add(s)
	return c.contains(s)
}
let fSHHelp = e=>{
	camlocked = fSH(e)
	freecam[0] = +!camlocked
}

que('#SHhelp')[0].addEventListener('click',fSHHelp,)
que('#SHcontroller')[0].addEventListener('click',fSH,)
que('#SHinfo')[0].addEventListener('click',fSH,)

/*=-=-=-=-=-=-=-=-










=-=-=-=-=-=-=-=-*/
let play = e=>getsuara().play()
let pause = e=>getsuara().pause()
let seekdown = e=>e.currentTarget.requestPointerLock({unadjustedMovement: true,})
let seekmove = e=>{
	if(document.pointerLockElement !== e.currentTarget){ return }
	getsuara().setCurTime(Math.max(0,getsuara().getCurTime()+ +e.movementX/44),)
}
let seekup = e=>document.exitPointerLock()
//let speed = e=>getsuara().setspeed(+e.currentTarget.value)
let speeddown = e=>e.currentTarget.requestPointerLock({unadjustedMovement: true,})
let speedmove = e=>{
	if(document.pointerLockElement !== e.currentTarget){ return }
	let v = getsuara().speed
	let fac = 1.08
	v = Math.log(v)/Math.log(fac)
		v += +e.movementX/44
	v = fac**v
	getsuara().setspeed(v)
}
let speedup = e=>document.exitPointerLock()

export let uiloop = async t=>{
	//lih(333)
	que('#showseek')[0].textContent = getsuara().getCurTime().toFixed(3)
	que('#showspeed')[0].textContent = getsuara().speed.toFixed(3)
	
	que('#pesanselesai')[0].classList[
		(getsuara().getCurTime() < 43)?'add':'remove'
	]('hilang')
	
	/*
	return 0
	let chi = que('#buf')[0].children
	for(let i = 0;i < chi.length;i++){
		let tr = chi[i]
		let rowinfo = getrowinfo(tr)
		let aucon = rowinfo.aucon
		if(
			(rowinfo.usage !== 'controller')
			|| !aucon
		){ continue }
		let curtime =
		tr.querySelector('.curtime').textContent =
		aucon.getCurTime().toFixed(3)
		rowinfo.settime(curtime*1111,0,0,0,)
		
	}
	*/
}
/*=-=-=-=-=-=-=-=-










=-=-=-=-=-=-=-=-*/
//lain - lain
que('#play'	)[0].addEventListener('click'	,play	,)
que('#pause'	)[0].addEventListener('click'	,pause	,)
que('#seek'	)[0].addEventListener('mousedown'	,seekdown	,)
que('#seek'	)[0].addEventListener('mousemove'	,seekmove	,)
que('#seek'	)[0].addEventListener('mouseup'	,seekup	,)
que('#speed'	)[0].addEventListener('mousedown'	,speeddown	,)
que('#speed'	)[0].addEventListener('mousemove'	,speedmove	,)
que('#speed'	)[0].addEventListener('mouseup'	,speedup	,)
que('#showseek')[0].textContent = '----'
que('#showspeed')[0].textContent = '----'

let svg = (queini,f,)=>{//copy gambar tongsampah
	let del = que(queini)[0].cloneNode(true)
	del.classList.remove('hilang')
	del.id = ''
	;(f !== null) && del.addEventListener('click',f,)
	return del
}
let infolist = que('#infolist')[0]
let clearinfo = que('#clearinfo')[0]
let infolistcla = infolist.classList
export let tambahinfo = (i,warna,infokey,)=>{
	i =
	i?.stack ??
	i
	
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
		div.classList.add('baru')
		//div.classList.add('bukainfo')
		div.addEventListener('click',f_info,)
		attr(div,'infokey',infokey,)
		attr(div,'timestamp',Date.now(),)
	let inli = que('#infolist')[0]
	inli.appendChild(div)
	//;(11 <= inli.childElementCount) && inli.removeChild(inli.firstElementChild)
}
let f_info = e=>{
	let div = e.currentTarget
	div.classList.remove('baru')
	if(!(e.detail%2)){
		div.classList.toggle('bukainfo')
	}
}
let camlocked = true
export let fcamlocked = ()=>camlocked

clearinfo.addEventListener('click',e=>{
	infolist.textContent = ''
},)

//setInterval(()=>infolistcla.remove('infoupdate'),1111,)
setInterval(()=>{
	for(let ele of infolist.children){
		ele.style.background = ''
	}
},1111,)
addEventListener('load',()=>tambahinfo(
`Selamat datang di Poly Landhep v4, silakan -->> DOUBLECLICK <<-- info ini (expand & collapse)

--------------------------
Saat ini aku mau tunjukkan:
- Play Pause Seek Speed
	Diharapkan suara & animasi bisa synchronized.
	

Maturnuwun

`,'cyan',),)
/*=-=-=-=-=-=-=-=-










=-=-=-=-=-=-=-=-*/
	//mousetext
	
	let datang = e=>{
		let s = attr(e.target,'mousedescr',)
		moutex.textContent = JSON.parse(`"${s}"`)
	}
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