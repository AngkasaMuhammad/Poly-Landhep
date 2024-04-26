"use strict"

/*
--	segera
=>	diurus
	sudah

-------------
	bikin class vertdipilih, inddipilih, seeddipilih
	ubah data buffer
	operasi baris: add copy move delete
	atur kamera pake key, saat document.activeElement bukan berupa input / textarea
	bikin fixed table
	texture logic
	bikin new delete
	tekan x y z jadi hilang, perbaiki jadi harus table vert active lalu bisa tekan x y z
=>	pointer digeser:
		voroidx -->> tecond
		joi 0 1 2 3 -->> mat3d
		ind -->> vert
		tejoi -->> mat2d
		tecond start end -->> tepos
	=>	tecond true false -->> tecond & tecolor
*/
let ui = {}
o3dv.javascript_ui = async aa=>{

	let lih = ru.lihat
	let cla = ru.cla
	let que = ru.que
	let attr = ru.attr
	let v3 = wgpuMatrix.vec3
	let v4 = wgpuMatrix.vec4
	let m4 = wgpuMatrix.mat4
	let w = o3dv.canv.width
	let h = o3dv.canv.height
	let docele = document.documentElement

	let moutex = que('#moutex')[0]
	let help = que('#help')[0]
	let vert = que('#vert')[0]
	let ind = que('#ind')[0]
	let tepos = que('#tepos')[0]
	let tecond = que('#tecond')[0]
	let tecolor = que('#tecolor')[0]
	let mat2d = que('#mat2d')[0]
	let mat3d = que('#mat3d')[0]

	let verttbody = que('#vert > tbody')[0]
	let indtbody = que('#ind > tbody')[0]
	let tepostbody = que('#tepos > tbody')[0]
	let tecondtbody = que('#tecond > tbody')[0]
	let tecolortbody = que('#tecolor > tbody')[0]
	let mat2dtbody = que('#mat2d > tbody')[0]
	let mat3dtbody = que('#mat3d > tbody')[0]

	let newvert = que('#newvert')[0]
	let copyvert = que('#copyvert')[0]
	let movevert = que('#movevert')[0]
	let deletevert = que('#deletevert')[0]
	let newind = que('#newind')[0]
	let deleteind = que('#deleteind')[0]
	let newtepos = que('#newtepos')[0]
	let deletetepos = que('#deletetepos')[0]
	let newtecond = que('#newtecond')[0]
	let deletetecond = que('#deletetecond')[0]
	let newtecolor = que('#newtecolor')[0]
	let deletetecolor = que('#deletetecolor')[0]
	let newmat2d = que('#newmat2d')[0]
	let deletemat2d = que('#deletemat2d')[0]
	let newmat3d = que('#newmat3d')[0]
	let deletemat3d = que('#deletemat3d')[0]
	
	let open = que('#open')[0]
	let save = que('#save')[0]
	let saveas = que('#saveas')[0]
	let newfile = que('#newfile')[0]

/*















*/

	//-----------------------------
	let datang = e=>moutex.textContent = attr(e.target,'mousedescr',)
	let pergi = e=>moutex.textContent = ''
	let eleindex = ele=>+Array.from(ele.parentElement.children).indexOf(ele)

	let fpilihtable = e=>pilihtable(e.currentTarget)
	let pilihtable = cur=>{
		let str = 'tabledipilih'
		cla(str)[0]?.classList.remove(str)
		cur.classList.add(str)
		
		str = 'menueditdipilih'
		cla(str)[0]?.classList.remove(str)
		//lih(que('#menuedit'+cur.id)[0])?.classList.add(str)
		que('#'+attr(cur,'menutarget',))[0]?.classList.add(str)
	}
	let fshtable = shele=>{//show hide table
		let table = que('#'+attr(shele,'tabletarget',))[0]
		let menu = que('#'+attr(shele,'menutarget',))[0]
		let nyala = shele.classList.toggle('nyala')
		let cmd = nyala?'remove':'add'
		table.classList[cmd]('hilang')
		if(nyala){
			pilihtable(table)
		}else{
			let str = 'tabledipilih'
			table.classList.remove(str)
			str = 'menueditdipilih'
			menu.classList.remove(str)
		}
	}

	let tableshowvert = ui.tableshowvert = ()=>{
		let posarr = o3dv.posarr
		let texarr = o3dv.texarr
		let voroidxarr = o3dv.voroidxarr
		let joiarr = o3dv.joiarr
		let ch = Array.from(verttbody.children)
		let vesc = Math.floor(vertscroll)
		let s = 'vertdipilih'
		que('.'+s)[0]?.classList.remove(s)
		for(let i = 0;i < ch.length;i++){
			let tr = ch[i]
			let no = tr.children[0]
			let vx = tr.children[1].firstElementChild
			let vy = tr.children[2].firstElementChild
			let vz = tr.children[3].firstElementChild
			let tx = tr.children[4].firstElementChild
			let ty = tr.children[5].firstElementChild
			let voro = tr.children[6].firstElementChild
			let j0 = tr.children[7].firstElementChild
			let j1 = tr.children[8].firstElementChild
			let j2 = tr.children[9].firstElementChild
			let j3 = tr.children[10].firstElementChild
			let w = tr.children[11].firstElementChild
			
			if(i < posarr.length/3-vesc){
				tr.classList.remove('datakosong')
				let ivert = i+vesc
				if(notrvd === ivert){
					tr.classList.add(s)
				}
				no.textContent = ivert
				vx.value = posarr[ivert*3+0]
				vy.value = posarr[ivert*3+1]
				vz.value = posarr[ivert*3+2]
				tx.value = texarr[ivert*2+0]
				ty.value = texarr[ivert*2+1]
				voro.value = voroidxarr[ivert*1+0]
				j0.value = joiarr[ivert*5+0]
				j1.value = joiarr[ivert*5+1]
				j2.value = joiarr[ivert*5+2]
				j3.value = joiarr[ivert*5+3]
				w.value = '0x'+joiarr[ivert*5+4].toString(16).padStart(8,'0',)
			}else{
				tr.classList.add('datakosong')
				no.textContent =
				vx.value =
				vy.value =
				vz.value =
				tx.value =
				ty.value =
				voro.value =
				j0.value =
				j1.value =
				j2.value =
				j3.value =
				w.value =
				'-'
			}
			
		}
		
	}

	let tableshowind = ui.tableshowind = ()=>{
		let indarr = o3dv.indarr
		let ch = Array.from(indtbody.children)
		let indsc = Math.floor(indscroll/2)*2
		let s = 'inddipilih'
		que('.'+s)[0]?.classList.remove(s)
		que('.'+s)[0]?.classList.remove(s)
		
		for(let i = 0;i < ch.length;i++){
			let tr = ch[i]
			let no = tr.children[0]
			let inp0 = tr.children[1].firstElementChild
			let inp1 = tr.children[2].firstElementChild
			let inp2 = tr.children[3].firstElementChild
			
			if(i < indarr.length/3-indsc){
				tr.classList.remove('datakosong')
				let iind = i+indsc
				
				if(notratasid === iind){
					tr.classList.add(s)
					tr.nextElementSibling.classList.add(s)
				}
				
				no.textContent = iind
				inp0.value = indarr[iind*3+0]
				inp1.value = indarr[iind*3+1]
				inp2.value = indarr[iind*3+2]
			}else{
				tr.classList.add('datakosong')
				no.textContent =
				inp0.value =
				inp1.value =
				inp2.value =
				'-'
			}
		}
	}

	let tableshowtepos = ui.tableshowtepos = ()=>{
		let teposarr = o3dv.teposarr
		let tejoiarr = o3dv.tejoiarr
		let ch = Array.from(tepostbody.children)
		let tepossc = Math.floor(teposscroll)
		let s = 'teposdipilih'
		que('.'+s)[0]?.classList.remove(s)
		//
		
		for(let i in ch){
			let tr = ch[i = +i]
			let no = tr.children[0]
			
			let tdx = tr.children[1]	;let inpx = tdx.firstElementChild
			let tdy = tr.children[2]	;let inpy = tdy.firstElementChild
			let tdjoi = tr.children[3]	;let inpjoi = tdjoi.firstElementChild
			
			let itepos = i+tepossc
			
			if(itepos < teposarr.length/2){
				tr.classList.remove('datakosong')
				if(notrtpd === itepos){
					tr.classList.add(s)
				}
				
				no.textContent = itepos
				inpx.value = teposarr[itepos*2+0]
				inpy.value = teposarr[itepos*2+1]
				inpjoi.value = tejoiarr[itepos*1+0]
			}else{
				tr.classList.add('datakosong')
				no.textContent =
				inpx.value =
				inpy.value =
				inpjoi.value = 
				'-'
			}
		}
	}

let tableshowtecond = ui.tableshowtecond = ()=>{
	let tecondarr = o3dv.tecondarr
	let ch = Array.from(tecondtbody.children)
	let tecondsc = Math.floor(tecondscroll)
	let s = 'teconddipilih'
	que('.'+s)[0]?.classList.remove(s)
	//
	
	for(let i in ch){
		let tr = ch[i = +i]
		let no = tr.children[0]
		
		let tds = tr.children[1]	;let inps = tds.firstElementChild
		let tde = tr.children[2]	;let inpe = tde.firstElementChild
		let tdt = tr.children[3]	;let inpt = tdt.firstElementChild
		let tdf = tr.children[4]	;let inpf = tdf.firstElementChild
		
		let itecond = i+tecondsc
		
		if(itecond < tecondarr.length/4){
			tr.classList.remove('datakosong')
			if(notrtcd === itecond){
				tr.classList.add(s)
			}
			
			no.textContent = itecond
			inps.value = tecondarr[itecond*4+0]
			inpe.value = tecondarr[itecond*4+1]
			inpt.value = tecondarr[itecond*4+2]
			inpf.value = tecondarr[itecond*4+3]
		}else{
			tr.classList.add('datakosong')
			no.textContent =
			inps.value =
			inpe.value =
			inpt.value =
			inpf.value =
			'-'
		}
	}
}

let tableshowtecolor = ui.tableshowtecolor = ()=>{
	let tecolorarr = o3dv.tecolorarr
	let ch = Array.from(tecolortbody.children)
	let tecolorsc = Math.floor(tecolorscroll)
	let s = 'tecolordipilih'
	que('.'+s)[0]?.classList.remove(s)
	//
	
	for(let i in ch){
		let tr = ch[i = +i]
		let no = tr.children[0]
		
		let td = tr.children[1]	;let inp = td.firstElementChild
		
		let itecolor = i+tecolorsc
		
		if(itecolor < tecolorarr.length){
			tr.classList.remove('datakosong')
			if(notrtcod === itecolor){
				tr.classList.add(s)
			}
			
			no.textContent = itecolor
			inp.value = '0x'+tecolorarr[itecolor].toString(16).padStart(8,'0',)
		}else{
			tr.classList.add('datakosong')
			no.textContent =
			inp.value =
			'-'
		}
	}
}

let tableshowmat2d = ui.tableshowmat2d = ()=>{
	let mat2darr = o3dv.mat2darr
	let ch = Array.from(mat2dtbody.children)
	let mat2dsc = Math.floor(mat2dscroll)
	let s = 'mat2ddipilih'
	que('.'+s)[0]?.classList.remove(s)
	//
	
	for(let i in ch){
		let tr = ch[i = +i]
		let no = tr.children[0]
		
		let tdxx	= tr.children[1	]	;let inpxx = tdxx.firstElementChild
		let tdxy	= tr.children[2	]	;let inpxy = tdxy.firstElementChild
		let tdxw	= tr.children[3	]	;let inpxw = tdxw.firstElementChild
		let tdp0	= tr.children[4	]
		let tdyx	= tr.children[5	]	;let inpyx = tdyx.firstElementChild
		let tdyy	= tr.children[6	]	;let inpyy = tdyy.firstElementChild
		let tdyw	= tr.children[7	]	;let inpyw = tdyw.firstElementChild
		let tdp1	= tr.children[8	]
		let tdx	= tr.children[9	]	;let inpx = tdx.firstElementChild
		let tdy	= tr.children[10	]	;let inpy = tdy.firstElementChild
		let tdw	= tr.children[11	]	;let inpw = tdw.firstElementChild
		let tdp2	= tr.children[12	]
		
		let imat2d = i+mat2dsc
		
		if(imat2d < mat2darr.length/12){
			tr.classList.remove('datakosong')
			if(notrm2d === imat2d){
				tr.classList.add(s)
			}
			
			no.textContent = imat2d
			inpxx.value	= mat2darr[imat2d*12+0	]
			inpxy.value	= mat2darr[imat2d*12+1	]
			inpxw.value	= mat2darr[imat2d*12+2	]
			tdp0.textContent	= mat2darr[imat2d*12+3	]
			inpyx.value	= mat2darr[imat2d*12+4	]
			inpyy.value	= mat2darr[imat2d*12+5	]
			inpyw.value	= mat2darr[imat2d*12+6	]
			tdp1.textContent	= mat2darr[imat2d*12+7	]
			inpx.value	= mat2darr[imat2d*12+8	]
			inpy.value	= mat2darr[imat2d*12+9	]
			inpw.value	= mat2darr[imat2d*12+10	]
			tdp2.textContent	= mat2darr[imat2d*12+11	]
		}else{
			tr.classList.add('datakosong')
			no.textContent =
			inpxx.value	=
			inpxy.value	=
			inpxw.value	=
			tdp0.textContent	=
			inpyx.value	=
			inpyy.value	=
			inpyw.value	=
			tdp1.textContent	=
			inpx.value	=
			inpy.value	=
			inpw.value	=
			tdp2.textContent	=
			'-'
		}
	}
}

let tableshowmat3d = ui.tableshowmat3d = ()=>{
	let mat3darr = o3dv.mat3darr
	let ch = Array.from(mat3dtbody.children)
	let mat3dsc = Math.floor(mat3dscroll)
	let s = 'mat3ddipilih'
	que('.'+s)[0]?.classList.remove(s)
	//
	
	for(let i in ch){
		let tr = ch[i = +i]
		let no = tr.children[0]
		
		let tdxx	= tr.children[1	]	;let inpxx = tdxx.firstElementChild
		let tdxy	= tr.children[2	]	;let inpxy = tdxy.firstElementChild
		let tdxz	= tr.children[3	]	;let inpxz = tdxz.firstElementChild
		let tdxw	= tr.children[4	]	;let inpxw = tdxw.firstElementChild
		let tdyx	= tr.children[5	]	;let inpyx = tdyx.firstElementChild
		let tdyy	= tr.children[6	]	;let inpyy = tdyy.firstElementChild
		let tdyz	= tr.children[7	]	;let inpyz = tdyz.firstElementChild
		let tdyw	= tr.children[8	]	;let inpyw = tdyw.firstElementChild
		let tdzx	= tr.children[9	]	;let inpzx = tdzx.firstElementChild
		let tdzy	= tr.children[10	]	;let inpzy = tdzy.firstElementChild
		let tdzz	= tr.children[11	]	;let inpzz = tdzz.firstElementChild
		let tdzw	= tr.children[12	]	;let inpzw = tdzw.firstElementChild
		let tdwx	= tr.children[13	]	;let inpwx = tdwx.firstElementChild
		let tdwy	= tr.children[14	]	;let inpwy = tdwy.firstElementChild
		let tdwz	= tr.children[15	]	;let inpwz = tdwz.firstElementChild
		let tdww	= tr.children[16	]	;let inpww = tdww.firstElementChild
		
		let imat3d = i+mat3dsc
		
		if(imat3d < mat3darr.length/16){
			tr.classList.remove('datakosong')
			if(notrm3d === imat3d){
				tr.classList.add(s)
			}
			
			no.textContent = imat3d
			inpxx.value	= mat3darr[imat3d*16+0	]
			inpxy.value	= mat3darr[imat3d*16+1	]
			inpxz.value	= mat3darr[imat3d*16+2	]
			inpxw.value	= mat3darr[imat3d*16+3	]
			inpyx.value	= mat3darr[imat3d*16+4	]
			inpyy.value	= mat3darr[imat3d*16+5	]
			inpyz.value	= mat3darr[imat3d*16+6	]
			inpyw.value	= mat3darr[imat3d*16+7	]
			inpzx.value	= mat3darr[imat3d*16+8	]
			inpzy.value	= mat3darr[imat3d*16+9	]
			inpzz.value	= mat3darr[imat3d*16+10	]
			inpzw.value	= mat3darr[imat3d*16+11	]
			inpwx.value	= mat3darr[imat3d*16+12	]
			inpwy.value	= mat3darr[imat3d*16+13	]
			inpwz.value	= mat3darr[imat3d*16+14	]
			inpww.value	= mat3darr[imat3d*16+15	]
		}else{
			tr.classList.add('datakosong')
			no.textContent =
			inpxx.value	=
			inpxy.value	=
			inpxz.value	=
			inpxw.value	=
			inpyx.value	=
			inpyy.value	=
			inpyz.value	=
			inpyw.value	=
			inpzx.value	=
			inpzy.value	=
			inpzz.value	=
			inpzw.value	=
			inpwx.value	=
			inpwy.value	=
			inpwz.value	=
			inpww.value	=
			'-'
		}
	}
}

	let fpilihvert = e=>{
		let ele = e.currentTarget
		let co = ele.constructor
		
		if(co === HTMLTableRowElement){
			pilihvert(ele)
		}else if(co === HTMLInputElement){
			pilihvert(ele.parentElement.parentElement)
		}
		pilihtable(vert)
	}
	let pilihvert = tr=>{
		if(tr.classList.contains('datakosong')){return}
		let s = 'vertdipilih'
		que('.'+s)[0]?.classList.remove(s)
		tr.classList.add(s)
		notrvd = +tr.firstElementChild.textContent
	}

	let fpilihind = e=>{
		let ele = e.currentTarget
		let co = ele.constructor
		
		if(co === HTMLTableRowElement){
			pilihind(ele)
		}else if(co === HTMLInputElement){
			pilihind(ele.parentElement.parentElement)
		}
		pilihtable(ind)
	}
	let pilihind = tr=>{
		if(tr.classList.contains('datakosong')){return}
		let s = 'inddipilih'
		let i = eleindex(tr)
		let tratas = (i%2)?tr.previousElementSibling:tr
		let trbawah = tratas.nextElementSibling
		
		que('.'+s)[0]?.classList.remove(s)
		que('.'+s)[0]?.classList.remove(s)
		tratas.classList.add(s)
		trbawah.classList.add(s)
		
		notratasid = +tratas.firstElementChild.textContent
	}

	let fpilihseed = e=>{
		let ele = e.currentTarget
		let co = ele.constructor
		
		if(co === HTMLTableRowElement){
			pilihseed(ele)
		}else if(co === HTMLInputElement){
			pilihseed(ele.parentElement.parentElement)
		}
		pilihtable(seedlist)
	}
	let pilihseed = tr=>{
		if(tr.classList.contains('datakosong')){return}
		let s = 'seeddipilih'
		que('.'+s)[0]?.classList.remove(s)
		tr.classList.add(s)
		notrsd = +tr.firstElementChild.textContent
	}

	let fpilihtepos = e=>{
		let ele = e.currentTarget
		let co = ele.constructor
		
		if(co === HTMLTableRowElement){
			pilihtepos(ele)
		}else if(co === HTMLInputElement){
			pilihtepos(ele.parentElement.parentElement)
		}
		pilihtable(tepos)
	}
	let pilihtepos = tr=>{
		if(tr.classList.contains('datakosong')){return}
		let s = 'teposdipilih'
		que('.'+s)[0]?.classList.remove(s)
		tr.classList.add(s)
		notrtpd = +tr.firstElementChild.textContent
		
	}

	let fpilihtecond = e=>{
		let ele = e.currentTarget
		let co = ele.constructor
		
		if(co === HTMLTableRowElement){
			pilihtecond(ele)
		}else if(co === HTMLInputElement){
			pilihtecond(ele.parentElement.parentElement)
		}
		pilihtable(tecond)
	}
	let pilihtecond = tr=>{
		if(tr.classList.contains('datakosong')){return}
		let s = 'teconddipilih'
		que('.'+s)[0]?.classList.remove(s)
		tr.classList.add(s)
		notrtcd = +tr.firstElementChild.textContent
		
	}

	let fpilihtecolor = e=>{
		let ele = e.currentTarget
		let co = ele.constructor
		
		if(co === HTMLTableRowElement){
			pilihtecolor(ele)
		}else if(co === HTMLInputElement){
			pilihtecolor(ele.parentElement.parentElement)
		}
		pilihtable(tecolor)
	}
	let pilihtecolor = tr=>{
		if(tr.classList.contains('datakosong')){return}
		let s = 'tecolordipilih'
		que('.'+s)[0]?.classList.remove(s)
		tr.classList.add(s)
		notrtcod = +tr.firstElementChild.textContent
		
	}

	let fpilihmat2d = e=>{
		let ele = e.currentTarget
		let co = ele.constructor
		
		if(co === HTMLTableRowElement){
			pilihmat2d(ele)
		}else if(co === HTMLInputElement){
			pilihmat2d(ele.parentElement.parentElement)
		}
		pilihtable(mat2d)
	}
	let pilihmat2d = tr=>{
		if(tr.classList.contains('datakosong')){return}
		let s = 'mat2ddipilih'
		que('.'+s)[0]?.classList.remove(s)
		tr.classList.add(s)
		notrm2d = +tr.firstElementChild.textContent
		
	}

	let fpilihmat3d = e=>{
		let ele = e.currentTarget
		let co = ele.constructor
		
		if(co === HTMLTableRowElement){
			pilihmat3d(ele)
		}else if(co === HTMLInputElement){
			pilihmat3d(ele.parentElement.parentElement)
		}
		pilihtable(mat3d)
	}
	let pilihmat3d = tr=>{
		if(tr.classList.contains('datakosong')){return}
		let s = 'mat3ddipilih'
		que('.'+s)[0]?.classList.remove(s)
		tr.classList.add(s)
		notrm3d = +tr.firstElementChild.textContent
		
	}

	let keycodes = {
		[82]:'r',
		[77]:'m',
		[72]:'h',
		[88]:'x',
		[89]:'y',
		[90]:'z',
	}
	let key = {}
	
	let fkey = e=>{
 		//lih(e.keyCode)
		if(
			(document.activeElement !== document.body) ||
			e.ctrlKey ||
			e.shiftKey ||
			e.altKey
		){return}
		let keyini = keycodes[e.keyCode]
		let awal = key[keyini]
		if(awal === undefined){return}
		let akhir = e.type === 'keydown'
		let berubah = awal !== akhir
		key[keyini] = akhir

	if((keyini === 'r') && berubah){
		docele
		.requestPointerLock({
			unadjustedMovement:true,
		})
		ui.camdiputar(key.r)
	}

	if((keyini === 'm') && berubah){
		docele
		.requestPointerLock({
			unadjustedMovement:true,
		})
		ui.camdigeser(key.m)
	}

	if(key.h && berubah){
		ui.camreset()
		fmouse()
	}

	if(
	(
		key.x ||
		key.y ||
		key.z
	)
	&& berubah
	&& (que('.tabledipilih')[0] === vert)
	){
		docele
		.requestPointerLock({
			unadjustedMovement:true,
		})
	}

	if(
		!key.m &&
		!key.r &&
		!key.x &&
		!key.y &&
		!key.z
	){
		document
		.exitPointerLock()
	}

	}

	let tambahvert = (px,py,pz,tx,ty,voro,j0,j1,j2,j3,w,)=>{
		if(o3dv.posarr.length)
			notrvd++
		
		let me = o3dv.me
		me.newvert(notrvd)
		me.setpos(notrvd,px,py,pz,)
		me.settex(notrvd,tx,ty,)
		me.setvoro(notrvd,voro,)
		me.setjoi(notrvd,j0,j1,j2,j3,w,)
		
		let indarrbaru = Array.from(o3dv.indarr)
		for(let i = 0;i < indarrbaru.length;i++){
			if(indarrbaru[i] >= notrvd){
				indarrbaru[i]++
			}
		}
		
		o3dv.setindall(indarrbaru)
		tableshowvert()
		tableshowind()
	}

	let hapusvert = ()=>{
		let indarrbaru = Array.from(o3dv.indarr)
		for(let i = 0;i < indarrbaru.length;i++){
			let itris = Math.floor(i/3)*3
			if(indarrbaru[i] > notrvd){
				indarrbaru[i]--
			}else if(indarrbaru[i] == notrvd){
				indarrbaru[itris+0] =
				indarrbaru[itris+1] =
				indarrbaru[itris+2] = 0
			}
		}
		
		o3dv.me.deletevert(notrvd,)
		notrvd--
		notrvd = Math.max(notrvd,0,)
		
		o3dv.setindall(indarrbaru)
		tableshowvert()
		tableshowind()
	}

	let geservert = ui.geservert = i=>{
		let me = o3dv.me
		let d = me.deletevert(notrvd)//deleted data
		
		let iab = Array.from(o3dv.indarr)//ind arr baru
		for(let j = 0;j < iab.length;j++){
			if(iab[j] === notrvd){
				iab[j] = i
			}else if(
				(notrvd < iab[j]) &&
				(iab[j] <= i)
			){
				iab[j]--
			}else if(
				(i <= iab[j]) &&
				(iab[j] < notrvd )
			){
				iab[j]++
			}
		}
		
		me.newvert(i)
		me.setpos(i,d[0],d[1],d[2],)
		me.settex(i,d[3],d[4],)
		me.setvoro(i,d[5],)
		me.setjoi(i,d[6],d[7],d[8],d[9],d[10],)
		let min = Math.min(notrvd,i,)
		let max = Math.max(notrvd,i,)
		me.updvertbuf(min,max+1,)
		notrvd = i
		
		o3dv.setindall(iab)
		tableshowvert()
		tableshowind()
	}

	let finpsetpos = e=>{
		let inp = e.currentTarget
		let td = inp.parentElement
		let tr = td.parentElement
		if(tr.classList.contains('datakosong')){return}
		let data = [
			+tr.children[1].firstElementChild.value,
			+tr.children[2].firstElementChild.value,
			+tr.children[3].firstElementChild.value,
		]
		let ixyz = eleindex(td)-1
		
		//data[ixyz] = +inp.value
		o3dv.me.setpos(notrvd,...data,)
	}

	let finpsettex = e=>{
		let inp = e.currentTarget
		let td = inp.parentElement
		let tr = td.parentElement
		if(tr.classList.contains('datakosong')){return}
		let data = [
			+tr.children[4].firstElementChild.value,
			+tr.children[5].firstElementChild.value,
		]
		let ixy = eleindex(td)-4
		
		//data[ixy] = +inp.value
		o3dv.me.settex(notrvd,...data,)
	}

	let finpsetvoro = e=>{
		let inp = e.currentTarget
		let td = inp.parentElement
		let tr = td.parentElement
		if(tr.classList.contains('datakosong')){return}
		let data = +tr.children[6].firstElementChild.value
		
		o3dv.me.setvoro(notrvd,data,)
		
	}

	let finpsetjoi = e=>{
		let inp = e.currentTarget
		let td = inp.parentElement
		let tr = td.parentElement
		if(tr.classList.contains('datakosong')){return}
		let data = [
			+tr.children[7].firstElementChild.value,
			+tr.children[8].firstElementChild.value,
			+tr.children[9].firstElementChild.value,
			+tr.children[10].firstElementChild.value,
			+tr.children[11].firstElementChild.value,
		]
		let ixy = eleindex(td)-4
		
		//data[ixy] = +inp.value
		o3dv.me.setjoi(notrvd,...data,)
		
	}

	let finpind = e=>{
		let inp = e.currentTarget
		let td = inp.parentElement
		let tr = td.parentElement
		if(tr.classList.contains('datakosong')){return}
		
		let tratas = (
			+tr.firstElementChild.textContent%2
		)?tr.previousElementSibling:tr
		let trbawah = tratas.nextElementSibling
		let tratasch = tratas.children
		let trbawahch = trbawah.children
		
		let i0 = +tratasch[1].firstElementChild.value
		let i1 = +tratasch[2].firstElementChild.value
		let i2 = +tratasch[3].firstElementChild.value
		let i3 = +trbawahch[1].firstElementChild.value
		let i4 = +trbawahch[2].firstElementChild.value
		let i5 = +trbawahch[3].firstElementChild.value
		o3dv.setind(notratasid*3,i0,i1,i2,i3,i4,i5,)
		
	}

	let finptepos = e=>{
		let inp = e.currentTarget
		let td = inp.parentElement
		let tr = td.parentElement
		if(tr.classList.contains('datakosong')){return}
		let data = [
			+tr.children[1].firstElementChild.value,
			+tr.children[2].firstElementChild.value,
			+tr.children[3].firstElementChild.value,
		]
		let ixy = eleindex(td)-1
		
		//data[ixy] = +inp.value
		o3dv.te.setpos(notrtpd,...data,)
		
	}

	let finptecond = e=>{
		let inp = e.currentTarget
		let td = inp.parentElement
		let tr = td.parentElement
		if(tr.classList.contains('datakosong')){return}
		let data = [
			+tr.children[1].firstElementChild.value,
			+tr.children[2].firstElementChild.value,
			+tr.children[3].firstElementChild.value,
			+tr.children[4].firstElementChild.value,
		]
		let i = eleindex(td)-1
		
		//data[i] = +inp.value
		o3dv.te.setcond(notrtcd,...data,)
	}

	let finptecolor = e=>{
		let inp = e.currentTarget
		let td = inp.parentElement
		let tr = td.parentElement
		if(tr.classList.contains('datakosong')){return}
		
		let data = +tr.children[1].firstElementChild.value
		o3dv.te.setcolor(notrtcod,data,)
	}

	let finpmat2d = e=>{
		let inp = e.currentTarget
		let td = inp.parentElement
		let tr = td.parentElement
		if(tr.classList.contains('datakosong')){return}
		
		let data = [
			+tr.children[1].firstElementChild.value,
			+tr.children[2].firstElementChild.value,
			+tr.children[3].firstElementChild.value,
			0,
			+tr.children[5].firstElementChild.value,
			+tr.children[6].firstElementChild.value,
			+tr.children[7].firstElementChild.value,
			0,
			+tr.children[9].firstElementChild.value,
			+tr.children[10].firstElementChild.value,
			+tr.children[11].firstElementChild.value,
			0,
		]
		let ixy = eleindex(td)-1
		
		//data[ixy] = +inp.value
		o3dv.setmat2d(notrm2d,...data,)
	}

	let finpmat3d = e=>{
		let inp = e.currentTarget
		let td = inp.parentElement
		let tr = td.parentElement
		if(tr.classList.contains('datakosong')){return}
		
		let data = [
			+tr.children[1	].firstElementChild.value,
			+tr.children[2	].firstElementChild.value,
			+tr.children[3	].firstElementChild.value,
			+tr.children[4	].firstElementChild.value,
			+tr.children[5	].firstElementChild.value,
			+tr.children[6	].firstElementChild.value,
			+tr.children[7	].firstElementChild.value,
			+tr.children[8	].firstElementChild.value,
			+tr.children[9	].firstElementChild.value,
			+tr.children[10	].firstElementChild.value,
			+tr.children[11	].firstElementChild.value,
			+tr.children[12	].firstElementChild.value,
			+tr.children[13	].firstElementChild.value,
			+tr.children[14	].firstElementChild.value,
			+tr.children[15	].firstElementChild.value,
			+tr.children[16	].firstElementChild.value,
		]
		
		o3dv.setmat3d(notrm3d,...data,)
	}

	let reqpoi = async e=>{
		e.currentTarget.requestPointerLock({unadjustedMovement: true})
	}
	let lerpsaatw = (va,vb,w,vout,)=>
		v4.lerp(va,vb,
			(va[3]-w)
			/(va[3]-vb[3])
		,vout,)
	
	let lukisgaris = (va,vb,)=>{
		let cx = o3dv.cx2d
		if(
			(va[3] <= minw) &&
			(vb[3] <= minw)
		){
			return
		}
		lerpsaatw(va,vb,minw,vp0,)
		if(
			(va[3] <= minw) &&
			(vb[3] > minw)
		){
			cx.moveTo(vp0[0]/vp0[3],vp0[1]/vp0[3],)
			cx.lineTo(vb[0]/vb[3],vb[1]/vb[3],)
		}else if(
			(va[3] > minw) &&
			(vb[3] <= minw)
		){
			cx.moveTo(va[0]/va[3],va[1]/va[3],)
			cx.lineTo(vp0[0]/vp0[3],vp0[1]/vp0[3],)
		}else{
			cx.moveTo(va[0]/va[3],va[1]/va[3],)
			cx.lineTo(vb[0]/vb[3],vb[1]/vb[3],)
			
		}
		
	}
	let lukistitik = (v,str,)=>{
		if(v[3] <= minw){return}
		let cx = o3dv.cx2d
		let x = v[0]/v[3]
		let y = v[1]/v[3]
		cx.fillRect(x-5,y-5,10,10,)
		
		cx.font = '14px Consolas'
		cx.fillStyle = '#ffffff88'
		let canv2d = o3dv.canv2d
		let w = canv2d.width
		let h = canv2d.height
		cx.fillText(str,x+5,y,)
	}

	//file
	let fhsave = null
	
	let fsaveas = async ()=>{
		fhsave = await showSaveFilePicker()
		attr(save,'mousedescr','Save '+fhsave.name,)
		fsave()
	}
	let fsave = async ()=>{
		if(!fhsave){return}

//	+	+	+	+	+	+	+	+	+	+
let versi = 1
let bytelen = 4

	let posarr = o3dv.posarr
	let vertlen = posarr.length/3
	bytelen += 
		1*4
		+vertlen*3*4
//	=	=	=	=	=	=	=	=	=	=	=

	let texarr = o3dv.texarr
	
	bytelen += 
		1*4
		+vertlen*2*4
//	=	=	=	=	=	=	=	=	=	=	=

	let voroidxarr = o3dv.voroidxarr
	
	bytelen += 
		1*4
		+vertlen*1*4
//	=	=	=	=	=	=	=	=	=	=	=

	let joiarr = o3dv.joiarr
	
	bytelen += 
		1*4
		+vertlen*5*4
//	=	=	=	=	=	=	=	=	=	=	=

	let indarr = o3dv.indarr
	let indlen = indarr.length
	bytelen += 
		1*4
		+indlen*1*2
//	=	=	=	=	=	=	=	=	=	=	=

	let teposarr = o3dv.teposarr
	let teposlen = teposarr.length/2
	bytelen += 
		1*4
		+teposlen*2*4
//	=	=	=	=	=	=	=	=	=	=	=

	let tejoiarr = o3dv.tejoiarr
	
	bytelen += 
		1*4
		+teposlen*1*4
//	=	=	=	=	=	=	=	=	=	=	=

	let tecondarr = o3dv.tecondarr
	let tecondlen = tecondarr.length/4
	bytelen += 
		1*4
		+tecondlen*4*4
//	=	=	=	=	=	=	=	=	=	=	=

	let tecolorarr = o3dv.tecolorarr
	let tecolorlen = tecolorarr.length
	bytelen += 
		1*4
		+tecolorlen*1*4
//	=	=	=	=	=	=	=	=	=	=	=

	let mat2darr = o3dv.mat2darr
	let mat2dlen = mat2darr.length/12
	bytelen += 
		1*4
		+mat2dlen*12*4
//	=	=	=	=	=	=	=	=	=	=	=


	let mat3darr = o3dv.mat3darr
	let mat3dlen = mat3darr.length/16
	bytelen += 
		1*4
		+mat3dlen*16*4
//	=	=	=	=	=	=	=	=	=	=	=

//	+	+	+	+	+	+	+	+	+	+
let byte = new ArrayBuffer(bytelen)
let bytedata = new DataView(byte)
let ib = 0//index byte

bytedata.setUint32(ib,versi,isLE,)
ib += 4

bytedata.setUint32(ib,vertlen,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	

bytedata.setUint32(ib,indlen,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__	_

bytedata.setUint32(ib,teposlen,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__	__

bytedata.setUint32(ib,tecondlen,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__	_

bytedata.setUint32(ib,tecolorlen,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__	_

bytedata.setUint32(ib,mat2dlen,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__	_

bytedata.setUint32(ib,mat3dlen,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__	_

//	+	+	+	+	+	+	+	+	+	+

for(let a = 0;a < vertlen;a++){
//	=	=	=	=	=	=	=	=	=	=	=
bytedata.setFloat32(ib,posarr[a*3+0],
isLE,)
ib += 4
bytedata.setFloat32(ib,posarr[a*3+1],
isLE,)
ib += 4
bytedata.setFloat32(ib,posarr[a*3+2],
isLE,)
ib += 4


//	=	=	=	=	=	=	=	=	=	=	=
bytedata.setFloat32(ib,texarr[a*2+0],
isLE,)
ib += 4
bytedata.setFloat32(ib,texarr[a*2+1],
isLE,)
ib += 4


//	=	=	=	=	=	=	=	=	=	=	=
bytedata.setUint32(ib,voroidxarr[a*1+0],
isLE,)
ib += 4


//	=	=	=	=	=	=	=	=	=	=	=
bytedata.setUint32(ib,joiarr[a*5+0],
isLE,)
ib += 4
bytedata.setUint32(ib,joiarr[a*5+1],
isLE,)
ib += 4
bytedata.setUint32(ib,joiarr[a*5+2],
isLE,)
ib += 4
bytedata.setUint32(ib,joiarr[a*5+3],
isLE,)
ib += 4
bytedata.setUint32(ib,joiarr[a*5+4],
isLE,)
ib += 4

}

for(let a = 0;a < indlen;a++){
//	=	=	=	=	=	=	=	=	=	=	=
bytedata.setUint16(ib,indarr[a*1+0],
isLE,)
ib += 2

}

for(let a = 0;a < teposlen;a++){
//	=	=	=	=	=	=	=	=	=	=	=
bytedata.setFloat32(ib,teposarr[a*2+0],
isLE,)
ib += 4
bytedata.setFloat32(ib,teposarr[a*2+1],
isLE,)
ib += 4


//	=	=	=	=	=	=	=	=	=	=	=
bytedata.setUint32(ib,tejoiarr[a*1+0],
isLE,)
ib += 4

}

for(let a = 0;a < tecondlen;a++){
//	=	=	=	=	=	=	=	=	=	=	=
bytedata.setUint32(ib,tecondarr[a*4+0],
isLE,)
ib += 4
bytedata.setUint32(ib,tecondarr[a*4+1],
isLE,)
ib += 4
bytedata.setUint32(ib,tecondarr[a*4+2],
isLE,)
ib += 4
bytedata.setUint32(ib,tecondarr[a*4+3],
isLE,)
ib += 4

}

for(let a = 0;a < tecolorlen;a++){
//	=	=	=	=	=	=	=	=	=	=	=
bytedata.setUint32(ib,tecolorarr[a*1+0],
isLE,)
ib += 4

}

for(let a = 0;a < mat2dlen;a++){
//	=	=	=	=	=	=	=	=	=	=	=
bytedata.setFloat32(ib,mat2darr[a*12+0],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat2darr[a*12+1],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat2darr[a*12+2],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat2darr[a*12+3],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat2darr[a*12+4],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat2darr[a*12+5],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat2darr[a*12+6],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat2darr[a*12+7],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat2darr[a*12+8],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat2darr[a*12+9],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat2darr[a*12+10],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat2darr[a*12+11],
isLE,)
ib += 4

}

for(let a = 0;a < mat3dlen;a++){
//	=	=	=	=	=	=	=	=	=	=	=
bytedata.setFloat32(ib,mat3darr[a*16+0],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat3darr[a*16+1],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat3darr[a*16+2],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat3darr[a*16+3],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat3darr[a*16+4],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat3darr[a*16+5],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat3darr[a*16+6],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat3darr[a*16+7],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat3darr[a*16+8],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat3darr[a*16+9],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat3darr[a*16+10],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat3darr[a*16+11],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat3darr[a*16+12],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat3darr[a*16+13],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat3darr[a*16+14],
isLE,)
ib += 4
bytedata.setFloat32(ib,mat3darr[a*16+15],
isLE,)
ib += 4

}

		//write file
		let wri = await fhsave.createWritable()
		//await wri.write(new Uint32Array([0x41424344,0x45464748,]))
		//await wri.write(lih(new TextEncoder().encode('ABCDHI')))
		lih(byte)
		await wri.write(byte)
		await wri.close()
	}

	let freadfile = ui.freadfile = byte=>{//GA EKPAKE, udah diganti di readbin.js
		let byteview = new DataView(byte)
		lih(byteview)

//	+	+	+	+	+	+	+	+	+	+
let ib = 0//index byte

let versi =
byteview.getUint32(ib,isLE,)
ib += 4

lih('versi = '+versi)

let vertlen =
byteview.getUint32(ib,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__

let indlen =
byteview.getUint32(ib,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__

let teposlen =
byteview.getUint32(ib,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__

let tecondlen =
byteview.getUint32(ib,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__

let tecolorlen =
byteview.getUint32(ib,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__

let mat2dlen =
byteview.getUint32(ib,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__

let mat3dlen =
byteview.getUint32(ib,isLE,)
ib += 4
//	__	__	__	__	__	__	__	__	__	__

//	+	+	+	+	+	+	+	+	+	+

let vertdata = []
for(let a = 0;a < vertlen;a++){
	let d = []
	
	//pos
	d.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	d.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	d.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	
	//tex
	d.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	d.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	
	//texture idx
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	
	//joi
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	
	vertdata.push(d)
}
o3dv.me.setvertall(vertdata)
tableshowvert()
//	__	__	__	__	__	__	__	__	__	__
lih(vertdata)

let inddata = []
for(let a = 0;a < indlen;a++){
	inddata
	.push(byteview.getUint16(ib,isLE,))
	ib += 2
}
o3dv.setindall(inddata)
tableshowind()
//	__	__	__	__	__	__	__	__	__	__
lih(inddata)

let teposdata = []
for(let a = 0;a < teposlen;a++){
	let d = []
	
	//pos
	d.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	d.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	
	//joi
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	
	teposdata.push(d)
	
}
o3dv.te.setposall(teposdata)
tableshowtepos()
//	__	__	__	__	__	__	__	__	__	__
lih(teposdata)

let teconddata = []
for(let a = 0;a < tecondlen;a++){
	let d = []
	
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	d.push(byteview.getUint32(ib,isLE,))
	ib += 4
	
	teconddata.push(d)
	
}
o3dv.te.setcondall(teconddata)
tableshowtecond()
//	__	__	__	__	__	__	__	__	__	__
lih(teconddata)

let tecolordata = []
for(let a = 0;a < tecolorlen;a++){
	tecolordata
	.push(byteview.getUint32(ib,isLE,))
	ib += 4
}
o3dv.te.setcolorall(tecolordata)
tableshowtecolor()
//	__	__	__	__	__	__	__	__	__	__
lih(tecolordata)

let mat2ddata = []
for(let a = 0;a < mat2dlen;a++){
for(let b = 0;b < 12;b++){	
	mat2ddata
	.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	
}}
o3dv.setmat2dall(mat2ddata)
tableshowmat2d()
//	__	__	__	__	__	__	__	__	__	__
lih(mat2ddata)

let mat3ddata = []
for(let a = 0;a < mat3dlen;a++){
for(let b = 0;b < 16;b++){	
	mat3ddata
	.push(byteview.getFloat32(ib,isLE,))
	ib += 4
	
}}
o3dv.setmat3dall(mat3ddata)
tableshowmat3d()
//	__	__	__	__	__	__	__	__	__	__
lih(mat3ddata)

	}

/*















*/

	//-----------------------------
	for(let ele of que('[mousedescr]')){
		ele.addEventListener('mouseenter',datang,)
		ele.addEventListener('mouseleave',pergi,)
	}
	addEventListener('mousemove',e=>{
		let x = Math.min(e.clientX+11,innerWidth-moutex.clientWidth,)
		let y = Math.min(e.clientY+11,innerHeight-moutex.clientHeight,)
		moutex.style.left = x+'px'
		moutex.style.top = y+'px'
	},)
	
	for(let code in keycodes){
		key[keycodes[code]] = false
	}
	addEventListener('keydown',fkey,)
	addEventListener('keyup',fkey,)

for(
	let i = 0;
	i < 16;
	i++
){
	let tr
	,td
	,inp

//vert
tr = document.createElement('tr')
	tr.addEventListener('mousedown',fpilihvert,)
	//no
	td = document.createElement('td')
		td.textContent = i
	tr.appendChild(td)
	//vx
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihvert,)
			inp.addEventListener('input',finpsetpos,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	//vy
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihvert,)
			inp.addEventListener('input',finpsetpos,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	//vz
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihvert,)
			inp.addEventListener('input',finpsetpos,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	//tx
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihvert,)
			inp.addEventListener('input',finpsettex,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	//ty
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihvert,)
			inp.addEventListener('input',finpsettex,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	//texture index
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihvert,)
			inp.addEventListener('input',finpsetvoro,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	//joi
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihvert,)
			inp.addEventListener('input',finpsetjoi,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihvert,)
			inp.addEventListener('input',finpsetjoi,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihvert,)
			inp.addEventListener('input',finpsetjoi,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihvert,)
			inp.addEventListener('input',finpsetjoi,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	//wei
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihvert,)
			inp.addEventListener('input',finpsetjoi,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
verttbody.appendChild(tr)

//ind
tr = document.createElement('tr')
	tr.addEventListener('mousedown',fpilihind,)
	//no
	td = document.createElement('td')
		td.textContent = '0'
	tr.appendChild(td)
	//index
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihind,)
			inp.addEventListener('input',finpind,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihind,)
			inp.addEventListener('input',finpind,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihind,)
			inp.addEventListener('input',finpind,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
indtbody.appendChild(tr)

//tepos
tr = document.createElement('tr')
	tr.addEventListener('mousedown',fpilihtepos,)
	td = document.createElement('td')
		td.textContent = '0'
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihtepos,)
			inp.addEventListener('input',finptepos,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihtepos,)
			inp.addEventListener('input',finptepos,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihtepos,)
			inp.addEventListener('input',finptepos,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
tepostbody.appendChild(tr)

//tecond
tr = document.createElement('tr')
	td = document.createElement('td')
		td.textContent = '0'
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihtecond,)
			inp.addEventListener('input',finptecond,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihtecond,)
			inp.addEventListener('input',finptecond,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihtecond,)
			inp.addEventListener('input',finptecond,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihtecond,)
			inp.addEventListener('input',finptecond,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
tecondtbody.appendChild(tr)

//tecolor
tr = document.createElement('tr')
	td = document.createElement('td')
		td.textContent = '0'
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihtecolor,)
			inp.addEventListener('input',finptecolor,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
tecolortbody.appendChild(tr)

//mat2d
tr = document.createElement('tr')
	td = document.createElement('td')
		td.textContent = '0'
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat2d,)
			inp.addEventListener('input',finpmat2d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat2d,)
			inp.addEventListener('input',finpmat2d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat2d,)
			inp.addEventListener('input',finpmat2d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		td.textContent = '0'
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat2d,)
			inp.addEventListener('input',finpmat2d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat2d,)
			inp.addEventListener('input',finpmat2d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat2d,)
			inp.addEventListener('input',finpmat2d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		td.textContent = '0'
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat2d,)
			inp.addEventListener('input',finpmat2d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat2d,)
			inp.addEventListener('input',finpmat2d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat2d,)
			inp.addEventListener('input',finpmat2d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		td.textContent = '0'
	tr.appendChild(td)
mat2dtbody.appendChild(tr)

//mat3d
tr = document.createElement('tr')
	td = document.createElement('td')
		td.textContent = '0'
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
	td = document.createElement('td')
		inp = document.createElement('input')
			inp.addEventListener('focus',fpilihmat3d,)
			inp.addEventListener('input',finpmat3d,)
			inp.value = 0
		td.appendChild(inp)
	tr.appendChild(td)
mat3dtbody.appendChild(tr)

}

	for(let ele of que('.tablebisadipilih')){
		ele.addEventListener('mousedown',fpilihtable,)
	}
	for(let ele of que('[tabletarget]')){
		ele.addEventListener('click',e=>fshtable(e.currentTarget),)
		fshtable(ele)
		fshtable(ele)
	}

	let vertscroll = 0
	vert.addEventListener('wheel',e=>{
		e.preventDefault()
		if(document.activeElement !== document.body){
			document.activeElement.blur()
		}
		vertscroll += e.deltaY/111
		vertscroll = Math.max(Math.min(vertscroll,o3dv.posarr.length/3-1,),0,)
		tableshowvert()
		
	},)//{passive:0,},

	let indscroll = 0
	ind.addEventListener('wheel',e=>{
		e.preventDefault()
		if(document.activeElement !== document.body){
			document.activeElement.blur()
		}
		indscroll += e.deltaY/111
		indscroll = Math.max(Math.min(indscroll,o3dv.indarr.length/3-1,),0,)
		tableshowind()
	},)//{passive:0,},

	let teposscroll = 0
	tepos.addEventListener('wheel',e=>{
		e.preventDefault()
		if(document.activeElement !== document.body){
			document.activeElement.blur()
		}
		teposscroll += e.deltaY/111
		teposscroll = Math.max(Math.min(teposscroll,o3dv.teposarr.length/2-1,),0,)
		tableshowtepos()
	},)//{passive:0,},

	let tecondscroll = 0
	tecond.addEventListener('wheel',e=>{
		e.preventDefault()
		if(document.activeElement !== document.body){
			document.activeElement.blur()
		}
		tecondscroll += e.deltaY/111
		tecondscroll = Math.max(Math.min(tecondscroll,o3dv.tecondarr.length/4-1,),0,)
		tableshowtecond()
	},)//{passive:0,},

	let tecolorscroll = 0
	tecolor.addEventListener('wheel',e=>{
		e.preventDefault()
		if(document.activeElement !== document.body){
			document.activeElement.blur()
		}
		tecolorscroll += e.deltaY/111
		tecolorscroll = Math.max(Math.min(tecolorscroll,o3dv.tecolorarr.length-1,),0,)
		tableshowtecolor()
	},)//{passive:0,},

	let mat2dscroll = 0
	mat2d.addEventListener('wheel',e=>{
		e.preventDefault()
		if(document.activeElement !== document.body){
			document.activeElement.blur()
		}
		mat2dscroll += e.deltaY/111
		mat2dscroll = Math.max(Math.min(mat2dscroll,o3dv.mat2darr.length/12-1,),0,)
		tableshowmat2d()
	},)//{passive:0,},

	let mat3dscroll = 0
	mat3d.addEventListener('wheel',e=>{
		e.preventDefault()
		if(document.activeElement !== document.body){
			document.activeElement.blur()
		}
		mat3dscroll += e.deltaY/111
		mat3dscroll = Math.max(Math.min(mat3dscroll,o3dv.mat3darr.length/16-1,),0,)
		tableshowmat3d()
	},)//{passive:0,},

	let notrvd = 0 //nomor tr vertdipilih
	let notratasid = 0 //nomor tr atas inddipilih
	//let notrvod = 0 //nomor tr vorodipilih
	//let notrsd = 0 //nomor tr seeddipilih, lokal, di dalam voro
	let notrtpd = 0//nomor tr teposdipilih
	let notrtcd = 0//nomor tr teconddipilih
	let notrtcod = 0//nomor tr tecolordipilih
	let notrm2d = 0//nomor tr mat2ddipilih
	let notrm3d = 0//nomor tr mat3dipilih

	newvert.addEventListener('click',()=>{
		//tambahvert(1.1,-1000,3.3,4.4,5.5,6,)
		tambahvert(0,0,0,0,0,0,0,0,0,0,0x000000ff,)
		o3dv.me.updvertbuf(notrvd,o3dv.posarr.length,)
	},)

	copyvert.addEventListener('click',()=>{
		let posarr = o3dv.posarr
		if(!posarr.length){return}
		let texarr = o3dv.texarr
		let voroidxarr = o3dv.voroidxarr
		let joiarr = o3dv.joiarr
		
		tambahvert(
			posarr[notrvd*3+0],
			posarr[notrvd*3+1],
			posarr[notrvd*3+2],
			texarr[notrvd*2+0],
			texarr[notrvd*2+1],
			voroidxarr[notrvd*1+0],
			joiarr[notrvd*5+0],
			joiarr[notrvd*5+1],
			joiarr[notrvd*5+2],
			joiarr[notrvd*5+3],
			joiarr[notrvd*5+4],
		)
		o3dv.me.updvertbuf(notrvd,o3dv.posarr.length,)
	},)

	movevert.addEventListener('mousedown',reqpoi,)
	let movebaris = 0
	addEventListener('mousemove',e=>{
		if(document.pointerLockElement !== movevert){return}
		movebaris += e.movementY
		let posarr = o3dv.posarr
		let jarak = 44
		let lanjut = false
		let nobaru = notrvd
		while(movebaris < 0){
			movebaris += jarak
			if(nobaru <= 0){return}
			nobaru--
			lanjut = true
		}
		while(movebaris > jarak){
			movebaris -= jarak
			if(nobaru >= posarr.length/3-1){return}
			nobaru++
			lanjut = true
		}
		if(!lanjut){return}
		geservert(nobaru)
		
	},)

	addEventListener('mousemove',e=>{
		if(!document.pointerLockElement){return}
		if(que('.tabledipilih')[0] !== vert){return}
		
		let posarr = o3dv.posarr
		if(!posarr.length){return}
		
		let xyz = [
			posarr[notrvd*3+0],
			posarr[notrvd*3+1],
			posarr[notrvd*3+2],
		]
		
		m4.copy(camges,mp0,)
		m4.translate(mp0,[
			e.movementX*.001,
			-e.movementY*.001,
			e.movementY*.001,
		],mp0,)
		m4.invert(camges,mp1,)
		m4.mul(mp0,mp1,mp0,)
		v3.copy(xyz,vp0,)
		v3.transformMat4(xyz,mp0,xyz,)
		if(key.x){vp0[0] = xyz[0]}
		if(key.y){vp0[1] = xyz[1]}
		if(key.z){vp0[2] = xyz[2]}
		o3dv.me.setpos(notrvd,...vp0,)
		tableshowvert()
	},)

	deletevert.addEventListener('click',e=>{
		if(e.detail%2){return}
		hapusvert()
		o3dv.me.updvertbuf(notrvd,o3dv.posarr.length,)
	},)

	newind.addEventListener('click',e=>{
		let i = (notratasid += 2)*3 //i berlipat 6
		o3dv.newind(i)
		o3dv.updindbuf(i,o3dv.indarr.length,)
		
		tableshowind()
	},)

	deleteind.addEventListener('click',e=>{
		if(e.detail%2){return}
		let i = notratasid*3 //i berlipat 6
		o3dv.deleteind(i)
		o3dv.updindbuf(i,o3dv.indarr.length,)
		notratasid -= 2
		
		tableshowind()
		
	},)

	let fnewtepos =
	ui.fnewtepos = ()=>{
		let te = o3dv.te
		
		if(o3dv.teposarr.length){
			notrtpd++
		}
		te.newpos(notrtpd)
		
		te.updpos()
		tableshowtepos()
		
		//ubah tecond start end
		let tecondarr = o3dv.tecondarr
		for(let a = 0;a < tecondarr.length;a += 4){
			if(notrtpd <= tecondarr[a+0]){tecondarr[a+0]++}
			if(notrtpd <= tecondarr[a+1]){tecondarr[a+1]++}
		}
		o3dv.te.updcond()
		tableshowtecond()
	}
	newtepos.addEventListener('click',fnewtepos,)

	let fdeletetepos =
	ui.fdeletetepos = e=>{
		if(e.detail%2){return}
		let te = o3dv.te
		let noawal = notrtpd
		
		te.deletepos(notrtpd)
		if(notrtpd){
			notrtpd--
		}
		
		te.updpos()
		tableshowtepos()
		
		//ubah tecond start end
		let tecondarr = o3dv.tecondarr
		for(let a = 0;a < tecondarr.length;a += 4){
			if(noawal === tecondarr[a+0]){tecondarr[a+0] = 0}
			else if(noawal < tecondarr[a+0]){tecondarr[a+0]--}
			if(noawal === tecondarr[a+1]){tecondarr[a+1] = 0}
			else if(noawal < tecondarr[a+1]){tecondarr[a+1]--}
		}
		o3dv.te.updcond()
		tableshowtecond()
	}
	deletetepos.addEventListener('click',fdeletetepos,)

	newtecond.addEventListener('click',e=>{
		let te = o3dv.te
		
		if(o3dv.tecondarr.length){
			notrtcd++
		}
		te.newcond(notrtcd)
		
		//ubah tecond true false
		let tecondarr = o3dv.tecondarr
		for(let a = 0;a < notrtcd;a++){
			let b = a*4
			if(notrtcd <= a+tecondarr[b+2]){tecondarr[b+2]++}
			if(notrtcd <= a+tecondarr[b+3]){tecondarr[b+3]++}
		}
		
		te.updcond()
		tableshowtecond()
		
		//ubah vert voroidx
		let voroidxarr = o3dv.voroidxarr
		for(let a = 0;a < voroidxarr.length;a++){
			if(notrtcd <= voroidxarr[a]){voroidxarr[a]++}
		}
		
		o3dv.me.updvertbuf(0,voroidxarr.length,)
		tableshowvert()
	},)

	deletetecond.addEventListener('click',e=>{
		if(e.detail%2){return}
		let te = o3dv.te
		let noawal = notrtcd
		
		te.deletecond(notrtcd)
		if(notrtcd){
			notrtcd--
		}
		
		//ubah tecond true false
		let tecondarr = o3dv.tecondarr
		for(let a = 0;a <= notrtcd;a++){
			let b = a*4
			if(notrtcd === a+tecondarr[b+2]){tecondarr[b+2] = 0}
			if(notrtcd < a+tecondarr[b+2]){tecondarr[b+2]--}
			if(notrtcd === a+tecondarr[b+3]){tecondarr[b+3] = 0}
			if(notrtcd < a+tecondarr[b+3]){tecondarr[b+3]--}
		}
		
		te.updcond()
		tableshowtecond()
		
		//ubah vert voroidx
		let voroidxarr = o3dv.voroidxarr
		for(let a = 0;a < voroidxarr.length;a++){
			if(noawal === voroidxarr[a]){voroidxarr[a] = 0}
			else if(noawal < voroidxarr[a]){voroidxarr[a]--}
		}
		
		o3dv.me.updvertbuf(0,voroidxarr.length,)
		tableshowvert()
	},)

	newtecolor.addEventListener('click',e=>{
		let te = o3dv.te
		
		if(o3dv.tecolorarr.length){
			notrtcod++
		}
		te.newcolor(notrtcod)
		
		te.updcolor()
		tableshowtecolor()
		
		//ubah tecond true false
		let tecondarr = o3dv.tecondarr
		let clen = tecondarr.length/4
		let colen = o3dv.tecolorarr.length
		for(let a = 0;a < clen;a++){
			let b = a*4
			if(notrtcod+clen <= a+tecondarr[b+2]){tecondarr[b+2]++}
			if(notrtcod+clen <= a+tecondarr[b+3]){tecondarr[b+3]++}
		}
		
		te.updcond()
		tableshowtecond()
		
		//ubah vert voroidx
		let voroidxarr = o3dv.voroidxarr
		for(let a = 0;a < voroidxarr.length;a++){
			if(notrtcod+clen <= voroidxarr[a]){voroidxarr[a]++}
		}
		
		o3dv.me.updvertbuf(0,voroidxarr.length,)
		tableshowvert()
	},)

	deletetecolor.addEventListener('click',e=>{
		if(e.detail%2){return}
		let te = o3dv.te
		let noawal = notrtcod
		
		te.deletecolor(notrtcod)
		if(notrtcod){
			notrtcod--
		}
		
		te.updcolor()
		tableshowtecolor()
		
		//ubah tecond true false
		let tecondarr = o3dv.tecondarr
		let clen = tecondarr.length/4
		let colen = o3dv.tecolorarr.length
		for(let a = 0;a < clen;a++){
			let b = a*4
			if(noawal+clen === a+tecondarr[b+2]){tecondarr[b+2] = 0}
			else if(noawal+clen < a+tecondarr[b+2]){tecondarr[b+2]--}
			if(noawal+clen === a+tecondarr[b+3]){tecondarr[b+3] = 0}
			else if(noawal+clen < a+tecondarr[b+3]){tecondarr[b+3]--}
		}
		
		te.updcond()
		tableshowtecond()
		
		//ubah vert voroidx
		let voroidxarr = o3dv.voroidxarr
		for(let a = 0;a < voroidxarr.length;a++){
			if(noawal+clen === voroidxarr[a]){voroidxarr[a] = 0}
			else if(noawal+clen < voroidxarr[a]){voroidxarr[a]--}
		}
		
		o3dv.me.updvertbuf(0,voroidxarr.length,)
		tableshowvert()
	},)

	newmat2d.addEventListener('click',e=>{
		if(o3dv.mat2darr.length){
			notrm2d++
		}
		o3dv.newmat2d(notrm2d)
		
		o3dv.updmat2d()
		tableshowmat2d()
		
		//ubah tepos joint
		let tejoiarr = o3dv.tejoiarr
		for(let a in tejoiarr){
			if(notrm2d <= tejoiarr[a]){tejoiarr[a]++}
		}
		
		o3dv.te.updpos()
		tableshowtepos()
	},)

	deletemat2d.addEventListener('click',e=>{
		if(e.detail%2){return}
		o3dv.deletemat2d(notrm2d)
		let noawal = notrm2d
		if(notrm2d){
			notrm2d--
		}
		
		o3dv.updmat2d()
		tableshowmat2d()
		
		//ubah tepos joint
		let tejoiarr = o3dv.tejoiarr
		for(let a in tejoiarr){
			if(noawal === tejoiarr[a]){tejoiarr[a] = 0}
			else if(noawal <= tejoiarr[a]){tejoiarr[a]--}
		}
		
		o3dv.te.updpos()
		tableshowtepos()
	},)

	newmat3d.addEventListener('click',e=>{
		if(o3dv.mat3darr.length){
			notrm3d++
		}
		o3dv.newmat3d(notrm3d)
		
		o3dv.updmat3d()
		tableshowmat3d()
		
		//ubah vert joint
		let joiarr = o3dv.joiarr
		for(let a = 0;a < joiarr.length/5;a += 5){
			if(notrm3d <= joiarr[a+0]){joiarr[a+0]++}
		}
		
		o3dv.me.updvertbuf(0,o3dv.voroidxarr.length,)
		tableshowvert()
	},)

	deletemat3d.addEventListener('click',e=>{
		if(e.detail%2){return}
		
		o3dv.deletemat3d(notrm3d)
		if(notrm3d){
			notrm3d--
		}
		
		o3dv.updmat3d()
		tableshowmat3d()
		
		//ubah vert joint
		let joiarr = o3dv.joiarr
		for(let a = 0;a < joiarr.length/5;a += 5){
			if(notrm3d === joiarr[a+0]){joiarr[a+0] = 0}
			else if(notrm3d < joiarr[a+0]){joiarr[a+0]--}
		}
		
		o3dv.me.updvertbuf(0,o3dv.voroidxarr.length,)
		tableshowvert()
	},)

	open.addEventListener('click',async ()=>{
		let pickfile = await showOpenFilePicker()
		;[fhsave] = pickfile
		attr(save,'mousedescr','Save '+fhsave.name,)
		let byte = await fhsave.getFile()
		byte = await byte.arrayBuffer()
		//freadfil/e(byte)
		readbin(byte)
	},)

	save.addEventListener('click',()=>fhsave?fsave():fsaveas(),)
	saveas.addEventListener('click',fsaveas,)

	newfile.addEventListener('click',e=>{
		if(!confirm('WowGGGearing: INGAT! Some changes may not be saved.')){return}
		attr(save,'mousedescr','Save',)
		
		let me = o3dv.me
		let te = o3dv.te
		
		me.setvertall([])
		o3dv.setindall([])
		te.setposall([])
		te.setcondall([])
		te.setcolorall([])
		o3dv.setmat2dall([])
		o3dv.setmat3dall([])
		
		notrvd =
		notratasid =
		notrtpd =
		notrtcd =
		notrtcod =
		notrm2d =
		notrm3d =
		0
		
		tableshowvert()
		tableshowind()
		tableshowtepos()
		tableshowtecond()
		tableshowtecolor()
		tableshowmat2d()
		tableshowmat3d()
	},)

	addEventListener('mouseup',e=>{
		if(document.pointerLockElement === docele){return}
		document.exitPointerLock()
		docele.classList.remove('pegang')
		que('.terima')[0]?.classList.remove('terima')
	})
	addEventListener('beforeunload',e=>{
		e.returnValue = true
	},)
	addEventListener('wheel',e=>{
		if(document.pointerLockElement){
			e.preventDefault()
		}
	},{passive:0,},)
	let notrvdcampos = 0//dari o3dv.render
	addEventListener('mousedown',()=>{
		if(!document.pointerLockElement){return}
		if(
			(que('.tabledipilih')[0] !== vert) &&
			(que('.tabledipilih')[0] !== ind)
		){return}
		vertscroll = notrvd = notrvdcampos
		tableshowvert()
	},)

/*















*/

	//
	pilihtable(help)
	let mp0 = m4.identity()//mat pinjam
	let mp1 = m4.identity()//mat pinjam
	let vp0 = v4.create()
	let minw = .001
	o3dv.render = dt=>{
		ui.render?.(dt)
		
		let cx = o3dv.cx2d
		let view = o3dv.view
		
		m4.identity(mp0)
		m4.scale(mp0,[w/2,-h/2,1,],mp0,)
		m4.translate(mp0,[1,-1,1,],mp0,)
		m4.mul(mp0,view,mp0,)
		
		cx.clearRect(-11,-11,w+11,h+11,)
		
		//sumbu
		let pos00	= v4.transformMat4([0	,0	,0	,1,],mp0,[],)
		let posxaxis	= v4.transformMat4([1000	,0	,0	,1,],mp0,[],)
		let posyaxis	= v4.transformMat4([0	,1000	,0	,1,],mp0,[],)
		let poszaxis	= v4.transformMat4([0	,0	,1000	,1,],mp0,[],)
		
		cx.lineWidth = 2
		cx.strokeStyle = '#ff0000'	;cx.beginPath();lukisgaris(pos00,posxaxis,);cx.stroke()
		cx.strokeStyle = '#00ff00'	;cx.beginPath();lukisgaris(pos00,posyaxis,);cx.stroke()
		cx.strokeStyle = '#0000ff'	;cx.beginPath();lukisgaris(pos00,poszaxis,);cx.stroke()
		
		//vert
		let posarr = o3dv.posarr
		if(
			(
				(que('.tabledipilih')[0] === vert) ||
				(que('.tabledipilih')[0] === ind)
			) &&
			posarr.length
		){
			for(let ele of verttbody.children){
				if(ele.classList.contains('datakosong')){break}
				let xyz = [
					+ele.children[1].firstElementChild.value,
					+ele.children[2].firstElementChild.value,
					+ele.children[3].firstElementChild.value,
				]
				let xyzw = [...xyz,1,]
				let pvert =  v4.transformMat4(xyzw,mp0,[],)
				cx.fillStyle = ele.classList.contains('vertdipilih')?
					ru.rgba(
						Math.random()*255,
						Math.random()*255,
						Math.random()*255,
						1,
					)
				:'grey'
				lukistitik(pvert,ele.children[0].textContent,)
			}
			
			let jarakdekat = Number.MAX_SAFE_INTEGER
			let vertdekat = null//[1111,333,2222,1,]
			let campos = [0,0,0,1,]
			let pojok0 = [0,0,0,1,]
			m4.getTranslation(camges,campos,)
			
			for(let i = 0;i < posarr.length/3;i++){//i vert
				let xyz = [
					posarr[i*3+0],
					posarr[i*3+1],
					posarr[i*3+2],
					1,
				]
				let jarakini = v3.dist(campos,xyz,)
				if(jarakini < jarakdekat){
					vertdekat = xyz
					jarakdekat = jarakini
					notrvdcampos = i
				}
			}
			if(!vertdekat){return}
			
			pojok0[0] = campos[0]
			pojok0[1] = vertdekat[1]
			pojok0[2] = campos[2]
			
			v4.transformMat4(vertdekat,mp0,vertdekat,)
			v4.transformMat4(campos,mp0,campos,)
			v4.transformMat4(pojok0,mp0,pojok0,)
			
			cx.lineWidth = 3
			cx.strokeStyle = 'yellow'
			cx.beginPath();lukisgaris(vertdekat,campos,);cx.stroke()
			cx.lineWidth = 1
			cx.strokeStyle = 'grey'
			cx.beginPath();lukisgaris(vertdekat,pojok0,);cx.stroke()
			cx.beginPath();lukisgaris(pojok0,campos,);cx.stroke()
			
			cx.font = '11px Consolas'
			cx.fillStyle = '#ffffff88'
			let canv2d = o3dv.canv2d
			let w = canv2d.width
			let h = canv2d.height
			cx.fillText('Vertex index: '+notrvdcampos,w/2,h/2,)
		}
	}
	
/*========
	;{
		let f = await fetch('js/rumah.bin')
		f = await f.arrayBuffer()
		//freadfile(f)
		readbin(f)
		lih(f)
	}
--------*/

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
	
	let camdigeser = false
	let camdiputar = false
	ui.camdigeser = (bool = camdigeser)=>camdigeser = !!bool
	ui.camdiputar = (bool = camdiputar)=>camdiputar = !!bool
	let camges = ui.camges = m4.identity()
	let rang = 0
	let camreset = ui.camreset = ()=>{
		m4.identity(camges)
		m4.rotateY(camges,.4,camges,)
		m4.scale(camges,Array(3).fill(1700),camges,)
		rang = -.3
	}
	camreset()
	let fmouse = ui.fmouse = ()=>{
		
		m4.copy(camges,cam,)
		m4.rotateX(cam,rang,cam,)
		m4.translate(cam,[0,0,3,],cam,)
		m4.invert(cam,cam,)
		m4.mul(persp,cam,view,)
		o3dv.updcam(view)
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

	//coba
/*========

o3dv.me.setvertall([
	[0,555,-888,	0,0,	0,	0,0,0,0,	0x000000ff,],
	[0,555,0,	0,1,	0,	1,0,0,0,	0x000000ff,],
	[777,555,0,	1,1,	0,	2,0,0,0,	0x000000ff,],
])
//INGAT! hex dibaca dari kanan ke kiri
tableshowvert()

o3dv.setindall([
	0,1,2,
])
tableshowind()

	o3dv.te.setposall([
		[ .10, .00	,0	,],
		[ .00, .20	,0	,],
		[ .00, .00	,0	,],
		[ .10, .20	,0	,],
		[-.20, .20	,0	,],
		
		[ .00, .00	,1	,],
		[ .40, .00	,1	,],
		[ .00, .40	,1	,],
	])
	tableshowtepos()

o3dv.te.setcondall([
	[2,3,4,5,],
	[0,1,1,2,],
])
tableshowtecond()

========
o3dv.te.setcondall([
	[0,1,1,5,],
	[2,1,1,3,],
	[2,3,1,3,],
	[3,4,1,2,],
	[4,0,6,1,],
	
	[5,6,1,4,],
	[6,7,1,3,],
	[7,5,1,2,],
])
tableshowtecond()

--------

o3dv.te.setcolorall([
	0x00ffff77,
	0x665500ff,
	0x000099bb,
	0x000000aa,
])
tableshowtecolor()

o3dv.setmat2dall([
	1,0,0,0,
	0,1,0,0,
	.38,-.2,1,0,

	1,0,0,0,
	0,1,0,0,
	-.5,.4,1,0,
])
tableshowmat2d()

o3dv.setmat3dall([
	1,0,0,0,
	0,1,0,0,
	0,0,1,0,
	0,511,200,1,
	
	1,0,0,0,
	0,1,0,0,
	0,0,1,0,
	0,-1000,700,1,
	
	1,0,0,0,
	0,1,0,0,
	0,0,1,0,
	1200,0,0,1,
	
])
tableshowmat3d()
--------*/

	ui.javascript_lain?.(aa)
}
