"use strict"

/*
--	segera
=>	diurus
	sudah

-------------
	bikin class vertdipilih, inddipilih, seeddipilih
	ubah data buffer
	operasi baris: add copy move delete
--	ganti nama voronoi
	atur kamera pake key, saat document.activeElement bukan berupa input / textarea
	bikin fixed table
	coba "let vorodipilih" gausah dipake --> pake notrvod
=>	texture logic
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
	let docele = document.documentElement
	let isLE//isLittleEndian, untuk interaksi ArrayBuffer, antara TypedArray & DataView
	;{
		let f = new Float32Array([12.345,])//angka sukasuka
		let dv = new DataView(f.buffer)
		isLE = dv.getFloat32(0,) !== f[0]
		lih('Pakai Little Endian? '+isLE)
	}
	
	let moutex = que('#moutex')[0]
	let help = que('#help')[0]
	let vert = que('#vert')[0]
	let ind = que('#ind')[0]
	let vorolist = que('#vorolist')[0]
	let seedlist = que('#seedlist')[0]
	let tepos = que('#tepos')[0]
	let tecond = que('#tecond')[0]
	let tecolor = que('#tecolor')[0]
	
	let verttbody = que('#vert > tbody')[0]
	let indtbody = que('#ind > tbody')[0]
	let vorolisttbody = que('#vorolist > tbody')[0]
	let seedlisttbody = que('#seedlist > tbody')[0]
	let tepostbody = que('#tepos > tbody')[0]
	let tecolortbody = que('#tecolor > tbody')[0]
	let tecondtbody = que('#tecond > tbody')[0]
	/*
	let shhelp = que('#shhelp')[0]
	let shvert = que('#shvert')[0]
	let shind = que('#shind')[0]
	let shvoro = que('#shvoro')[0]
	*/
	let newvert = que('#newvert')[0]
	let copyvert = que('#copyvert')[0]
	let movevert = que('#movevert')[0]
	let deletevert = que('#deletevert')[0]
	let newind = que('#newind')[0]
	let deleteind = que('#deleteind')[0]
	let newvoro = que('#newvoro')[0]
	let copyvoro = que('#copyvoro')[0]
	let movevoro = que('#movevoro')[0]
	let deletevoro = que('#deletevoro')[0]
	let newseed = que('#newseed')[0]
	let deleteseed = que('#deleteseed')[0]
	let newtepos = que('#newtepos')[0]
	let deletetepos = que('#deletetepos')[0]
	let open = que('#open')[0]
	let save = que('#save')[0]
	let saveas = que('#saveas')[0]
	let newfile = que('#newfile')[0]
	
	//-----------------------------
	let datang = e=>moutex.textContent = attr(e.target,'mousedescr',)
	let pergi = e=>moutex.textContent = ''
	
	let eleindex = ele=>+Array.from(ele.parentElement.children).indexOf(ele)
	let stylepegang = e=>{
		let tr = e.currentTarget.parentElement
		if(tr.classList.contains('datakosong')){return}
		docele.classList.add('pegang')
		if(tr.parentElement === verttbody){
			indtbody.classList.add('terima')
		}else if(tr.parentElement === vorolisttbody){
			verttbody.classList.add('terima')
		}
	}
	let vertterimavoro = e=>{
		//if(!que('.pegang')[0]){return}
		if(que('.terima')[0] !== verttbody){return}
		let td = e.currentTarget
		let tr = td.parentElement
		if(tr.classList.contains('datakosong')){return}
		
		o3dv.me.setvoro(
			+tr.firstElementChild.textContent,
			td.textContent = +que('.vorodipilih')[0]?.firstElementChild.textContent,
		)
		/*
		lih(
			que('.pegang')[0]+
			' | voro no '+
			que('.vorodipilih')[0]?.firstElementChild.textContent+
			' masuk vert no '+
			tr.firstElementChild.textContent
		)
		*/
	}
	let indterimavert = e=>{
		//if(!que('.pegang')[0]){return}
		if(que('.terima')[0] !== indtbody){return}
		let td = e.currentTarget
		let tr = td.parentElement
		if(tr.classList.contains('datakosong')){return}
		
		let itratas = Math.floor(+tr.firstElementChild.textContent/2)*2
		let icell = (eleindex(tr)%2)*3+eleindex(td)-1//lokal
		let imulai = itratas*3
		let inddata = o3dv.indarr.slice(
			imulai,
			imulai+6,
		)
		td.textContent = inddata[icell] = notrvd
		
		o3dv.setind(imulai,...inddata,)
		/*
		lih(inddata)
		lih(
			que('.pegang')[0]+
			' | vert no '+
			notrvd+
			' masuk ind no '+
			itratas+'->'+icell+
			' kirim mulai '+itratas*3
		)
		*/
	}
	
	let tableshowvert = ui.tableshowvert = ()=>{
		let posarr = o3dv.posarr
		let texarr = o3dv.texarr
		let voroidxarr = o3dv.voroidxarr
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
			let voro = tr.children[6]
			
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
				voro.textContent = voroidxarr[ivert*1+0]
			}else{
				tr.classList.add('datakosong')
				no.textContent =
				vx.value =
				vy.value =
				vz.value =
				tx.value =
				ty.value =
				voro.textContent =
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
			let inp0 = tr.children[1]
			let inp1 = tr.children[2]
			let inp2 = tr.children[3]
			
			if(i < indarr.length/3-indsc){
				tr.classList.remove('datakosong')
				let iind = i+indsc
				
				if(notratasid === iind){
					tr.classList.add(s)
					tr.nextElementSibling.classList.add(s)
				}
				
				no.textContent = iind
				inp0.textContent = indarr[iind*3+0]
				inp1.textContent = indarr[iind*3+1]
				inp2.textContent = indarr[iind*3+2]
			}else{
				tr.classList.add('datakosong')
				no.textContent =
				inp0.textContent =
				inp1.textContent =
				inp2.textContent =
				'-'
			}
		}
	}
	let tableshowvoro = ui.tableshowvoro = ()=>{
		let vorotailarr = o3dv.vorotailarr
		let ch = Array.from(vorolisttbody.children)
		let vorosc = Math.floor(voroscroll)
		let s = 'vorodipilih'
		que('.'+s)[0]?.classList.remove(s)
		
		for(let i = 0;i < ch.length;i++){
			let tr = ch[i]
			let no = tr.children[0]
			let nama = tr.children[1]
			
			if(i < vorotailarr.length-vorosc){
				tr.classList.remove('datakosong')
				let ivoro = i+vorosc
				if(notrvod === ivoro){
					tr.classList.add(s)
				}
				no.textContent = ivoro
				nama.textContent = 'Voronoi#'+ivoro
			}else{
				tr.classList.add('datakosong')
				no.textContent =
				nama.textContent =
				'-'
			}
		}
	}
	let tableshowseed = ui.tableshowseed = ()=>{
		//vorodipilih --> notrvod
		let awal = notrvod?o3dv.vorotailarr[notrvod-1]:0
		let ekor = o3dv.vorotailarr[notrvod]
		seedscroll = Math.max(Math.min(seedscroll,ekor-awal-1,),0,)
		
		let vorotailarr = o3dv.vorotailarr
		let voroposarr = o3dv.voroposarr
		let vorocolorarr = o3dv.vorocolorarr
		let ch = Array.from(seedlisttbody.children)
		let seedsc = Math.floor(seedscroll)
		//vorodipilih --> notrvod
		let iawal = notrvod?vorotailarr[notrvod-1]:0
		let iekor = vorotailarr[notrvod]
		let s = 'seeddipilih'
		que('.'+s)[0]?.classList.remove(s)
		
		for(let i = 0;i < ch.length;i++){
			let tr = ch[i]
			let no = tr.children[0]
			let inpx = tr.children[1].firstElementChild
			let inpy = tr.children[2].firstElementChild
			let inpcolor = tr.children[3].firstElementChild
			
			if(i < iekor-iawal-seedsc){
				tr.classList.remove('datakosong')
				let iseed = i+seedsc
				if(notrsd === iseed){
					tr.classList.add(s)
				}
				let iseedglo = iseed+iawal
				no.textContent = iseed
				inpx.value = voroposarr[iseedglo*2+0]
				inpy.value = voroposarr[iseedglo*2+1]
				inpcolor.value = '0x'+
					vorocolorarr[iseedglo*1+0]
					.toString(16)
					.padStart(8,'0',)
				
			}else{
				tr.classList.add('datakosong')
				no.textContent =
				inpx.value =
				inpy.value =
				inpcolor.value =
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
			let tdwei = tr.children[4]	;let inpwei = tdwei.firstElementChild
			
			let itepos = i+tepossc
			
			if(itepos < teposarr.length/2){
				tr.classList.remove('datakosong')
				if(notrtpd === itepos){
					tr.classList.add(s)
				}
				
				no.textContent = itepos
				inpx.value = teposarr[itepos*2+0]
				inpy.value = teposarr[itepos*2+1]//sampe sini, tampilin joi wei
				inpjoi.value = '0x'+tejoiarr[itepos*2+0].toString(16).padEnd(8,'0',)
				inpwei.value = '0x'+tejoiarr[itepos*2+1].toString(16).padEnd(8,'0',)
			}else{
				tr.classList.add('datakosong')
				no.textContent =
				inpx.value =
				inpy.value =
				inpjoi.value = 
				inpwei.value = 
				'-'
			}
		}
	}
	
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
	let fpilihvert = e=>{
		let ele = e.currentTarget
		let co = ele.constructor
		
		if(co === HTMLTableRowElement){
			pilihvert(ele)
		}else if(co === HTMLInputElement){
			pilihvert(ele.parentElement.parentElement)
		}
	}
	let fpilihind = e=>{pilihind(e.currentTarget)}
	let fpilihvoro = e=>{pilihvoro(e.currentTarget)}
	let fpilihseed = e=>{
		let ele = e.currentTarget
		let co = ele.constructor
		
		if(co === HTMLTableRowElement){
			pilihseed(ele)
		}else if(co === HTMLInputElement){
			pilihseed(ele.parentElement.parentElement)
		}
	}
	let fpilihtepos = e=>{
		let ele = e.currentTarget
		let co = ele.constructor
		
		if(co === HTMLTableRowElement){
			pilihtepos(ele)
		}else if(co === HTMLInputElement){
			pilihtepos(ele.parentElement.parentElement)
		}
	}
	let pilihvert = tr=>{
		if(tr.classList.contains('datakosong')){return}
		let s = 'vertdipilih'
		que('.'+s)[0]?.classList.remove(s)
		tr.classList.add(s)
		notrvd = +tr.firstElementChild.textContent
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
	let pilihvoro = tr=>{
		if(tr.classList.contains('datakosong')){return}
		let s = 'vorodipilih'
		que('.'+s)[0]?.classList.remove(s)
		tr.classList.add(s)
		notrvod = +tr.firstElementChild.textContent
		
		tableshowseed()
	}
	let pilihseed = tr=>{
		if(tr.classList.contains('datakosong')){return}
		let s = 'seeddipilih'
		que('.'+s)[0]?.classList.remove(s)
		tr.classList.add(s)
		notrsd = +tr.firstElementChild.textContent
	}
	let pilihtepos = tr=>{
		if(tr.classList.contains('datakosong')){return}
		let s = 'teposdipilih'
		que('.'+s)[0]?.classList.remove(s)
		tr.classList.add(s)
		notrtpd = +tr.firstElementChild.textContent
		
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
			(document.activeElement !== document.body)
			/*||
			e.ctrlKey ||
			e.shiftKey ||
			e.altKey*/
		){return}
		let keyini = keycodes[e.keyCode]
		let awal = key[keyini]
		if(awal === undefined){return}
		let akhir = e.type === 'keydown'
		let berubah = awal !== akhir
		key[keyini] = akhir
		
		if((keyini === 'r') && berubah){
			docele.requestPointerLock({unadjustedMovement: true})
			o3dv.camdiputar(key.r)
		}
		if((keyini === 'm') && berubah){
			docele.requestPointerLock({unadjustedMovement: true})
			o3dv.camdigeser(key.m)
		}
		if(key.h && berubah){
			o3dv.camreset()
			o3dv.fmouse()
		}
		if((
			key.x ||
			key.y ||
			key.z
		)&& berubah){
			docele.requestPointerLock({unadjustedMovement: true})
		}
		if(
			!key.m &&
			!key.r &&
			!key.x &&
			!key.y &&
			!key.z
		){
			document.exitPointerLock()
		}
	}
	let tambahvert = (px,py,pz,tx,ty,voro,)=>{
		if(o3dv.posarr.length)
			notrvd++
		
		let me = o3dv.me
		me.newvert(notrvd)
		me.setpos(notrvd,px,py,pz,)
		me.settex(notrvd,tx,ty,)
		me.setvoro(notrvd,voro,)
		
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
		
		data[ixyz] = +inp.value
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
		
		data[ixy] = +inp.value
		o3dv.me.settex(notrvd,...data,)
	}
	let finpvoropos = e=>{
		let inp = e.currentTarget
		let td = inp.parentElement
		let tr = td.parentElement
		if(tr.classList.contains('datakosong')){return}
		let data = [
			+tr.children[1].firstElementChild.value,
			+tr.children[2].firstElementChild.value,
		]
		let ixy = eleindex(td)-1
		
		data[ixy] = +inp.value
		o3dv.vo.setpos(notrvod,notrsd,...data,)
	}
	let finpvorocolor = e=>{
		let inp = e.currentTarget
		let td = inp.parentElement
		let tr = td.parentElement
		if(tr.classList.contains('datakosong')){return}
		let data = [
			+tr.children[3].firstElementChild.value,
		]
		let icolor = eleindex(td)-1
		
		data[icolor] = +inp.value
		o3dv.vo.setcolor(notrvod,notrsd,...data,)
	}
	let finpsettepos = e=>{
		let inp = e.currentTarget
		let td = inp.parentElement
		let tr = td.parentElement
		if(tr.classList.contains('datakosong')){return}
		let data = [
			+tr.children[1].firstElementChild.value,
			+tr.children[2].firstElementChild.value,
		]
		let ixy = eleindex(td)-1
		
		data[ixy] = +inp.value
		o3dv.te.setpos(notrtpd,...data,)
		
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
	let lukistitik = v=>{
		if(v[3] <= minw){return}
		let cx = o3dv.cx2d
		let x = v[0]/v[3]
		let y = v[1]/v[3]
		cx.fillRect(x-5,y-5,10,10,)
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
		
		let posarr = o3dv.posarr
		let texarr = o3dv.texarr
		let voroidxarr = o3dv.voroidxarr
		let indarr = o3dv.indarr
		let vorotailarr = o3dv.vorotailarr
		let voroposarr = o3dv.voroposarr
		let vorocolorarr = o3dv.vorocolorarr
		
		let versi = 1
		let vertlen = posarr.length/3
		let indlen = indarr.length
		let vorolen = vorotailarr.length
		let seedlen = voroposarr.length/2
		
		let byte = new ArrayBuffer(
			5*4
			+vertlen*6*4
			+indlen*2
			+vorolen*4
			+seedlen*3*4
		)
		
		//		offset				length	elecount	typesize	
		let infodata	= new DataView(byte	,0		+0		,5	*1	*4	,)
		let vertdata	= new DataView(byte	,infodata	.byteOffset	+infodata	.byteLength	,vertlen	*6	*4	,)
		let inddata	= new DataView(byte	,vertdata	.byteOffset	+vertdata	.byteLength	,indlen	*1	*2	,)
		let vorodata	= new DataView(byte	,inddata	.byteOffset	+inddata	.byteLength	,vorolen	*1	*4	,)
		let seeddata	= new DataView(byte	,vorodata	.byteOffset	+vorodata	.byteLength	,seedlen	*3	*4	,)
		
		infodata.setUint32(0	*4	,versi	,isLE,)
		infodata.setUint32(1	*4	,vertlen	,isLE,)
		infodata.setUint32(2	*4	,indlen	,isLE,)
		infodata.setUint32(3	*4	,vorolen	,isLE,)
		infodata.setUint32(4	*4	,seedlen	,isLE,)
		
		for(let i = 0;i < vertlen;i++){
			vertdata.setFloat32	((i*6+0)*4,posarr	[i*3+0],isLE,)
			vertdata.setFloat32	((i*6+1)*4,posarr	[i*3+1],isLE,)
			vertdata.setFloat32	((i*6+2)*4,posarr	[i*3+2],isLE,)
			vertdata.setFloat32	((i*6+3)*4,texarr	[i*2+0],isLE,)
			vertdata.setFloat32	((i*6+4)*4,texarr	[i*2+1],isLE,)
			vertdata.setUint32	((i*6+5)*4,voroidxarr	[i*1+0],isLE,)
		}
		for(let i = 0;i < indlen;i++){
			inddata.setUint16(i*2,indarr[i],isLE,)
		}
		for(let i = 0;i < vorolen;i++){
			vorodata.setUint32(i*4,vorotailarr[i],isLE,)
		}
		for(let i = 0;i < seedlen;i++){
			seeddata.setFloat32	((i*3+0)*4,voroposarr	[i*2+0],isLE,)
			seeddata.setFloat32	((i*3+1)*4,voroposarr	[i*2+1],isLE,)
			seeddata.setUint32	((i*3+2)*4,vorocolorarr	[i*1+0],isLE,)
		}
		
		/*
		lih(infodata	)
		lih(vertdata	)
		lih(inddata	)
		lih(vorodata	)
		lih(seeddata	)
		*/
		
		//write file
		let wri = await fhsave.createWritable()
		//await wri.write(new Uint32Array([0x41424344,0x45464748,]))
		//await wri.write(lih(new TextEncoder().encode('ABCDHI')))
		await wri.write(byte)
		await wri.close()
	}
	let freadfile = byte=>{
		let byteview = new DataView(byte)
		lih(byteview)
		
		//pisah
		let versi	= byteview.getUint32(0*4,isLE,)//	;lih(versi)
		let vertlen	= byteview.getUint32(1*4,isLE,)//	;lih(vertlen)
		let indlen	= byteview.getUint32(2*4,isLE,)//	;lih(indlen)
		let vorolen	= byteview.getUint32(3*4,isLE,)//	;lih(vorolen)
		let seedlen	= byteview.getUint32(4*4,isLE,)//	;lih(seedlen)
		
		//		offset				length	elecount	typesize	
		let infodata	= new DataView(byte	,0		+0		,5	*1	*4	,)//;lih(infodata	)
		let vertdata	= new DataView(byte	,infodata	.byteOffset	+infodata	.byteLength	,vertlen	*6	*4	,)//;lih(vertdata	)
		let inddata	= new DataView(byte	,vertdata	.byteOffset	+vertdata	.byteLength	,indlen	*1	*2	,)//;lih(inddata	)
		let vorodata	= new DataView(byte	,inddata	.byteOffset	+inddata	.byteLength	,vorolen	*1	*4	,)//;lih(vorodata	)
		let seeddata	= new DataView(byte	,vorodata	.byteOffset	+vorodata	.byteLength	,seedlen	*3	*4	,)//;lih(seeddata	)
		
		//
		let me = o3dv.me
		let vo = o3dv.vo
		
		//vertex
		let vertarr = []
		for(let i = 0;i < vertlen;i++){
			vertarr.push([
				vertdata.getFloat32	((i*6+0)*4,isLE,),
				vertdata.getFloat32	((i*6+1)*4,isLE,),
				vertdata.getFloat32	((i*6+2)*4,isLE,),
				vertdata.getFloat32	((i*6+3)*4,isLE,),
				vertdata.getFloat32	((i*6+4)*4,isLE,),
				vertdata.getUint32	((i*6+5)*4,isLE,),
			])
		}
		me.setvertall(vertarr)
		me.updvertbuf(0,vertlen,)
		tableshowvert()		
		
		//index
		let indarr = []
		for(let i = 0;i < indlen;i++){
			indarr.push(inddata.getUint16	(i*2,isLE,))
		}
		o3dv.setindall(indarr)
		o3dv.updindbuf(0,indlen,)
		tableshowind()
		
		//voronoi
		let voroarr = []
		let awal = 0
		for(let ivoro = 0;ivoro < vorolen;ivoro++){
			let akhir = vorodata.getUint32(ivoro*4,isLE,)
			let seedarr = []
			for(let iseed = awal;iseed < akhir;iseed++){
				seedarr.push([
					seeddata.getFloat32	((iseed*3+0)*4,isLE,),
					seeddata.getFloat32	((iseed*3+1)*4,isLE,),
					seeddata.getUint32	((iseed*3+2)*4,isLE,),
				])
			}
			awal = akhir
			voroarr.push(seedarr)
		}
		vo.setvoroall(voroarr)
		vo.updvorobuf()
		tableshowvoro()
		tableshowseed()
		
		//tableshowtepos()
	}
	
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
	
	for(let i = 0;i < 16;i++){
		let tr,td,inp
		
		//vert
		tr = document.createElement('tr')
			tr.addEventListener('mousedown',fpilihvert,)
			//no
			td = document.createElement('td')
				td.textContent = i
				td.addEventListener('mousedown',stylepegang,)
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
			//voro
			td = document.createElement('td')
				td.textContent = ''
				td.addEventListener('mouseup',vertterimavoro,)
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
				td.textContent = '0'
				td.addEventListener('mouseup',indterimavert,)
			tr.appendChild(td)
			td = document.createElement('td')
				td.textContent = '0'
				td.addEventListener('mouseup',indterimavert,)
			tr.appendChild(td)
			td = document.createElement('td')
				td.textContent = '0'
				td.addEventListener('mouseup',indterimavert,)
			tr.appendChild(td)
		indtbody.appendChild(tr)
		
		//vorolist
		tr = document.createElement('tr')
			tr.addEventListener('mousedown',fpilihvoro,)
			td = document.createElement('td')
				td.textContent = '0'
				td.addEventListener('mousedown',stylepegang,)
			tr.appendChild(td)
			td = document.createElement('td')
				td.textContent = '0'
			tr.appendChild(td)
		vorolisttbody.appendChild(tr)
		
		//seedlist
		tr = document.createElement('tr')
			tr.addEventListener('mousedown',fpilihseed,)
			td = document.createElement('td')
				td.textContent = '0'
			tr.appendChild(td)
			td = document.createElement('td')
				inp = document.createElement('input')
					inp.addEventListener('focus',fpilihseed,)
					inp.addEventListener('input',finpvoropos,)
					inp.value = 0
				td.appendChild(inp)
			tr.appendChild(td)
			td = document.createElement('td')
				inp = document.createElement('input')
					inp.addEventListener('focus',fpilihseed,)
					inp.addEventListener('input',finpvoropos,)
					inp.value = 0
				td.appendChild(inp)
			tr.appendChild(td)
			td = document.createElement('td')
				inp = document.createElement('input')
					inp.addEventListener('focus',fpilihseed,)
					inp.addEventListener('input',finpvorocolor,)
					inp.value = 0
				td.appendChild(inp)
			tr.appendChild(td)
		seedlisttbody.appendChild(tr)
		
		//tepos
		tr = document.createElement('tr')
			tr.addEventListener('mousedown',fpilihtepos,)
			td = document.createElement('td')
				td.textContent = '0'
			tr.appendChild(td)
			td = document.createElement('td')
				inp = document.createElement('input')
					inp.addEventListener('focus',fpilihtepos,)
					inp.addEventListener('input',finpsettepos,)
					inp.value = 0
				td.appendChild(inp)
			tr.appendChild(td)
			td = document.createElement('td')
				inp = document.createElement('input')
					inp.addEventListener('focus',fpilihtepos,)
					inp.addEventListener('input',finpsettepos,)
					inp.value = 0
				td.appendChild(inp)
			tr.appendChild(td)
			td = document.createElement('td')
				inp = document.createElement('input')
					inp.addEventListener('focus',fpilihtepos,)
					inp.addEventListener('input',finpsettepos,)
					inp.value = 0
				td.appendChild(inp)
			tr.appendChild(td)
			td = document.createElement('td')
				inp = document.createElement('input')
					inp.addEventListener('focus',fpilihtepos,)
					inp.addEventListener('input',finpsettepos,)
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
				td.textContent = '0'
			tr.appendChild(td)
			td = document.createElement('td')
				td.textContent = '0'
			tr.appendChild(td)
			td = document.createElement('td')
				td.textContent = '0'
			tr.appendChild(td)
			td = document.createElement('td')
				td.textContent = '0'
			tr.appendChild(td)
		tecondtbody.appendChild(tr)
		
		//tecolor
		tr = document.createElement('tr')
			td = document.createElement('td')
				td.textContent = '0'
			tr.appendChild(td)
			td = document.createElement('td')
				inp = document.createElement('input')
					inp.value = 0
				td.appendChild(inp)
			tr.appendChild(td)
		tecolortbody.appendChild(tr)
		
	}
	let vertscroll = 0
	let indscroll = 0
	let voroscroll = 0
	let seedscroll = 0
	let teposscroll = 0
	vert.addEventListener('wheel',e=>{
		e.preventDefault()
		vertscroll += e.deltaY/111
		vertscroll = Math.max(Math.min(vertscroll,o3dv.posarr.length/3-1,),0,)
		tableshowvert()
		
	},)//{passive:0,},
	ind.addEventListener('wheel',e=>{
		e.preventDefault()
		indscroll += e.deltaY/111
		indscroll = Math.max(Math.min(indscroll,o3dv.indarr.length/3-1,),0,)
		tableshowind()
	},)//{passive:0,},
	vorolist.addEventListener('wheel',e=>{
		e.preventDefault()
		voroscroll += e.deltaY/111
		voroscroll = Math.max(Math.min(voroscroll,o3dv.vorotailarr.length-1,),0,)
		tableshowvoro()
	},)//{passive:0,},
	seedlist.addEventListener('wheel',e=>{
		e.preventDefault()
		seedscroll += e.deltaY/111
		tableshowseed()
	},)//{passive:0,},
	tepos.addEventListener('wheel',e=>{
		e.preventDefault()
		teposscroll += e.deltaY/111
		teposscroll = Math.max(Math.min(teposscroll,o3dv.teposarr.length/2-1,),0,)
		tableshowtepos()
	},)//{passive:0,},
	
	for(let ele of que('.tablebisadipilih')){
		ele.addEventListener('mousedown',fpilihtable,)
	}
	for(let ele of que('[tabletarget]')){
		ele.addEventListener('click',e=>fshtable(e.currentTarget),)
		fshtable(ele)
		fshtable(ele)
	}
	let notrvd = 0 //nomor tr vertdipilih
	let notratasid = 0 //nomor tr atas inddipilih
	let notrvod = 0 //nomor tr vorodipilih
	let notrsd = 0 //nomor tr seeddipilih, lokal, di dalam voro
	let notrtpd = 0//tr teposdipilih
	
	newvert.addEventListener('click',()=>{
		//tambahvert(1.1,-1000,3.3,4.4,5.5,6,)
		tambahvert(0,0,0,0,0,0,)
		o3dv.me.updvertbuf(notrvd,o3dv.posarr.length,)
	},)
	copyvert.addEventListener('click',()=>{
		let posarr = o3dv.posarr
		if(!posarr.length){return}
		let texarr = o3dv.texarr
		let voroidxarr = o3dv.voroidxarr
		
		tambahvert(
			posarr[notrvd*3+0],
			posarr[notrvd*3+1],
			posarr[notrvd*3+2],
			texarr[notrvd*2+0],
			texarr[notrvd*2+1],
			voroidxarr[notrvd*1+0],
		)
		o3dv.me.updvertbuf(notrvd,o3dv.posarr.length,)
	},)
	movevert.addEventListener('mousedown',reqpoi,)
	let movebaris = 0
	addEventListener('mousemove',e=>{
		if(document.pointerLockElement !== movevert){return}
		movebaris += e.movementY
		let posarr = o3dv.posarr
		let texarr = o3dv.texarr
		let voroidxarr = o3dv.voroidxarr
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
		if(document.pointerLockElement !== movevoro){return}
		movebaris += e.movementY
		let vorotailarr = o3dv.vorotailarr
		let jarak = 44
		let lanjut = false
		let nobaru = notrvod
		while(movebaris < 0){
			movebaris += jarak
			if(nobaru <= 0){return}
			nobaru--
			lanjut = true
		}
		while(movebaris > jarak){
			movebaris -= jarak
			if(nobaru >= vorotailarr.length-1){return}
			nobaru++
			lanjut = true
		}
		if(!lanjut){return}
		
		//vert, ubah  voroidx, kapankapan 
		let vo = o3dv.vo
		let me = o3dv.me	
		
		vo.geservoro(notrvod,nobaru,)
		notrvod = nobaru
		
		me.updvertbuf(0,o3dv.posarr.length/3,)
		vo.updvorobuf()
		tableshowvert()
		tableshowvoro()
		tableshowseed()
	},)
	addEventListener('mousemove',e=>{
		if(!document.pointerLockElement){return}
		if(que('.tabledipilih')[0] !== vert){return}
		
		let posarr = o3dv.posarr
		let xyz = [
			posarr[notrvd*3+0],
			posarr[notrvd*3+1],
			posarr[notrvd*3+2],
		]
		
		m4.copy(o3dv.camges,mp0,)
		m4.translate(mp0,[
			e.movementX*.001,
			-e.movementY*.001,
			e.movementY*.001,
		],mp0,)
		m4.invert(o3dv.camges,mp1,)
		m4.mul(mp0,mp1,mp0,)
		v3.copy(xyz,vp0,)
		v3.transformMat4(xyz,mp0,xyz,)
		if(key.x){vp0[0] = xyz[0]}
		if(key.y){vp0[1] = xyz[1]}
		if(key.z){vp0[2] = xyz[2]}
		o3dv.me.setpos(notrvd,...vp0,)
		tableshowvert()
	},)
	addEventListener('mouseup',e=>{
		if(document.pointerLockElement === docele){return}
		document.exitPointerLock()
		docele.classList.remove('pegang')
		que('.terima')[0]?.classList.remove('terima')
	})
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
	newvoro.addEventListener('click',e=>{
		if(o3dv.vorotailarr.length){
			notrvod++
		}
		let vo = o3dv.vo
		vo.newvoro(notrvod)
		
		vo.updvorobuf()
		tableshowvoro()
		tableshowseed()
	},)
	copyvoro.addEventListener('click',e=>{
		let vorotailarr = o3dv.vorotailarr
		let voroposarr = o3dv.voroposarr
		let vorocolorarr = o3dv.vorocolorarr
		let head = notrvod && vorotailarr[notrvod-1]
		let tail = vorotailarr[notrvod]
		let seedlen = tail-head
		
		lih(head+' '+tail+'\n------')
		let pos = voroposarr.slice(head*2,tail*2,)
		let color = vorocolorarr.slice(head*1,tail*1,)
		
		//newvoro =====================
		notrvod++
		let vo = o3dv.vo
		vo.newvoro(notrvod)
		
		//newseed =====================
		for(let i in color){
			vo.newseed(notrvod,i = +i,)
			vo.setpos(notrvod,i,
				pos[i*2+0],
				pos[i*2+1],
			)
			vo.setcolor(notrvod,i,
				color[i*1+0],
			)
		}
		
		//
		vo.updvorobuf()
		tableshowvoro()
		tableshowseed()
	},)
	movevoro.addEventListener('mousedown',reqpoi,)
	deletevoro.addEventListener('click',e=>{
		if(e.detail%2){return}
		let vo = o3dv.vo
		let me = o3dv.me
		
		let voroidxarr = o3dv.voroidxarr
		lih(vo.deletevoro(notrvod))
		
		//vert
		for(let i in voroidxarr){
			if(voroidxarr[i] === notrvod){
				voroidxarr[i] = 0
			}else if(voroidxarr[i] > notrvod){
				voroidxarr[i]--
			}
		}
		
		//
		if(notrvod){
			notrvod--
		}
		
		me.updvertbuf(0,o3dv.posarr.length/3,)
		vo.updvorobuf()
		tableshowvert()
		tableshowvoro()
		tableshowseed()
	},)
	newseed.addEventListener('click',e=>{
		let vorotailarr = o3dv.vorotailarr
		let head = notrvod && vorotailarr[notrvod-1]
		let tail = vorotailarr[notrvod]
		let seedlen = tail-head
		if(seedlen <= notrsd){
			notrsd = seedlen
		}else{
			notrsd++//lokal, di dalam voro
		}
		let vo = o3dv.vo
		vo.newseed(notrvod,notrsd,)
		
		vo.updvorobuf()
		tableshowvoro()
		tableshowseed()
	},)
	deleteseed.addEventListener('click',e=>{
		if(e.detail%2){return}
		let vorotailarr = o3dv.vorotailarr
		let head = notrvod && vorotailarr[notrvod-1]
		let tail = vorotailarr[notrvod]
		let seedlen = tail-head
		if(seedlen <= notrsd){return}
		let vo = o3dv.vo
		vo.deleteseed(notrvod,notrsd,)
		if(notrsd){
			notrsd--
		}
		
		vo.updvorobuf()
		tableshowvoro()
		tableshowseed()
		
	},)
	newtepos.addEventListener('click',e=>{
		let te = o3dv.te
		
		if(o3dv.teposarr.length){
			notrtpd++
		}
		te.newpos(notrtpd)
		
		te.updpos()
		tableshowtepos()
	},)
	deletetepos.addEventListener('click',e=>{
		if(e.detail%2){return}
		let te = o3dv.te
		
		te.deletepos(notrtpd)
		if(notrtpd){
			notrtpd--
		}
		
		te.updpos()
		tableshowtepos()
		
	},)
	
	open.addEventListener('click',async ()=>{
		let pickfile = await showOpenFilePicker()
		;[fhsave] = pickfile
		attr(save,'mousedescr','Save '+fhsave.name,)
		let byte = await fhsave.getFile()
		byte = await byte.arrayBuffer()
		freadfile(byte)
	},)
	save.addEventListener('click',()=>fhsave?fsave():fsaveas(),)
	saveas.addEventListener('click',fsaveas,)
	newfile.addEventListener('click',e=>{
		if(!confirm('WowGGGearing: INGAT! Some changes may not be saved.')){return}
		attr(save,'mousedescr','Save',)
		
		let me = o3dv.me
		let vo = o3dv.vo
		
		me.setvertall([])
		o3dv.setindall([])
		vo.setvoroall([])
		
		notrvd =
		notratasid =
		notrvod =
		notrsd = 0
		
		tableshowvert()
		tableshowind()
		tableshowvoro()
		tableshowseed()
	},)
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
		if((que('.tabledipilih')[0] !== vert)){return}
		vertscroll = notrvd = notrvdcampos
		tableshowvert()
	},)
	
	//
	pilihtable(help)
	let mp0 = m4.identity()//mat pinjam
	let mp1 = m4.identity()//mat pinjam
	let vp0 = v4.create()
	let minw = .001
	o3dv.render = dt=>{
		let w = o3dv.canv.width
		let h = o3dv.canv.height
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
		if(que('.tabledipilih')[0] === vert){
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
				lukistitik(pvert)
			}
			
			let jarakdekat = Number.MAX_SAFE_INTEGER
			let vertdekat = null//[1111,333,2222,1,]
			let campos = [0,0,0,1,]
			let pojok0 = [0,0,0,1,]
			m4.getTranslation(o3dv.camges,campos,)
			
			let posarr = o3dv.posarr
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
		}
	}
	
	;{
		let f = await fetch('js/rumah.bin')
		f = await f.arrayBuffer()
		freadfile(f)
		lih(f)
	}
	//coba
	o3dv.te.setposall([
		[0	,.2	,0x55ff3344	,0x11223366	,],
		[-.44	,3	,0xaacc55ff	,0x55000022	,],
		[5	,123	,0x55aa9922	,0x11550077	,],
		[1.2	,-99	,0x22112222	,0xff55aa11	,],
	])
	tableshowtepos()
	/*
	o3dv.me.setvertall([
		[0	,1000	,0	,-1,0,0,],
		[0	,500	,0	,0,0,0,],
		[1000	,0	,0	,1,0,0,],
		[1000	,1000	,0	,1,0,0,],
		[-2000	,500	,0	,1,0,0,],
	])
	o3dv.setindall([
		0,1,2,0,2,3,
		0,2,1,0,3,2,
	])
	o3dv.vo.setvoroall([
		[
			[.1,0,0xff0000ff,],
			[.3,0,0x00ff00ff,],
			[.5,0,0x0000ffff,],
		],
		[
			[-.2,0,0xffffffee,],
			[.6,0,0xff0011bb,],
		],
	])
	
	tableshowvert()
	tableshowind()
	tableshowvoro()
	tableshowseed()
	*/
	//
}