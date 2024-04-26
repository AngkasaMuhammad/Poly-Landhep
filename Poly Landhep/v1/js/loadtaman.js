"use strict"

let cobaan = {}

ui.javascript_lain = async aa=>{
	let lih = ru.lihat
	let que = ru.que
	let m3 = wgpuMatrix.mat3
	let m4 = wgpuMatrix.mat4
	
	lih('ini cobaan ,,,,,,,')
	lih(o3dv)
	
	//coba
/*========
	o3dv.me.setvertall([
		[0,555,-888,	0,0,	0,	0,0,0,0,	0x000000ff,],
		[0,555,0,	0,1,	0,	1,0,0,0,	0x000000ff,],
		[777,555,0,	1,1,	0,	2,0,0,0,	0x000000ff,],
	])
	//INGAT! hex dibaca dari kanan ke kiri
	ui.tableshowvert()
	
	o3dv.setindall([
		0,1,2,
	])
	ui.tableshowind()
	
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
	ui.tableshowtepos()
	
	o3dv.te.setcondall([
		[2,3,4,5,],
		[0,1,1,2,],
	])
	ui.tableshowtecond()
	
	o3dv.te.setcolorall([
		0x00ffff77,
		0x665500ff,
		0x000099bb,
		0x000000aa,
	])
	ui.tableshowtecolor()
	
	o3dv.setmat2dall([
		1,0,0,0,
		0,1,0,0,
		.38,-.2,1,0,
	
		1,0,0,0,
		0,1,0,0,
		-.5,.4,1,0,
	])
	ui.tableshowmat2d()
	
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
	ui.tableshowmat3d()
--------*/
	;{
		let f = await fetch('js/taman.bin')
		f = await f.arrayBuffer()
		//ui.freadfile(f)
		readbin(f)
		lih(f)
		
		ui.tableshowind()
		ui.tableshowmat2d()
		ui.tableshowmat3d()
		ui.tableshowtecolor()
		ui.tableshowtecond()
		ui.tableshowtepos()
		ui.tableshowvert()
	}
	return 0
	//render
	let putar = 0
	let step = 0
	let dt = 0
	let tunda = 0
	let anigetar = false
	
	
	;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	;;;;;;;;   ;;;;;;;;;;;;;;;   ;;;;;;;;
	;;;;;;;;   ;;;;;;;;;;;;;;;   ;;;;;;;;
	;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	;;;;;;;;;;                 ;;;;;;;;;;
	;;;;;;;;;;;               ;;;;;;;;;;;
	;;;;;;;;;;;;;;         ;;;;;;;;;;;;;;
	;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
	
	ui.render = dtini=>{//return 0
		dt += dtini
		if(step < tunda){
			step++
			return
		}
		
		//mat3d
		let m = m4.identity()
		let mpo = m4.identity()
		let getar = m4.identity()
		let putarawal = putar
		putar += 1.9*dt*.001
		let wei = Math.random()
		let wg = anigetar?(putar*wei+putarawal*(1-wei)):putar//waktu getar
		let ayun = Math.sin(wg)
		
		for(let a = 12;a < 15;a++){
			if(!anigetar){break}
			let u = 15//ukuran
			getar[a] += (Math.random()*2-1)*u
		}
		m4.translate(mpo,[0,1811,0,],mpo,)
		m4.copy(mpo,m,)
		m4.translate(m,[0,0,-555,],m,)
		m4.rotateX(m,ayun,m,)
		m4.invert(mpo,mpo,)
		m4.mul(m,mpo,m,)
		m4.mul(m,getar,m,)
		
		o3dv.setmat3d(1,...m,)
		
		let mpohon = m4.identity()
		let mpohges = m4.identity()
		
		m4.translate(mpohon,[
			Math.sin(wg*.2)*1111,
		0,0,],mpohon,)
		m4.rotateZ(mpohon,
			Math.sin(5+wg*2.4)*.01
			+Math.sin(5+wg*.4)*.1
		,mpohon,)
		m4.scale(mpohon,[
			1+Math.sin(wg*2.4)*.02,
		1,1,],mpohon,)
		o3dv.setmat3d(2,...mpohon,)
		
		ui.tableshowmat3d()
		
		//mat2d
		let s0 = m3.identity()//batas sungai 0
		let s1 = m3.identity()//batas sungai 1
		
		m3.translate(s0,[0,Math.sin(wg*.7)*222,],s0,)
		m3.translate(s1,[0,-Math.sin(wg*.7)*155,],s1,)
		o3dv.setmat2d(0,...s0,)
		o3dv.setmat2d(1,...s1,)
		
		ui.tableshowmat2d()
		
		//warna
		o3dv.te.setcolor(1,0x0000aaff+Math.floor(0x55*(
			Math.sin(wg*.4)*.5+1
		))*0x00010000)
		
		ui.tableshowtecolor()
		
		//
		dt = step = 0
	}
}