"use strict"

ui.mulai = async ()=>{
	let lih = ru.lihat
	let m3 = wgpuMatrix.mat3
	let m4 = wgpuMatrix.mat4
	let matide = m4.identity()
	
	lih('ini objek js')
	let lain = ui.newobj('rangkalain')
	let minco = pl.drawarr[0]?.objarr?.[0]?.node?.mat2d?.[2]
	//m3.scale(minco,[1,-1,],minco,)
//zoom jurang
/*========
	m3.copy([
		2.852884934275289e-37,0,0,0,
		0,-2.852884934275289e-37,0,0,
		1.5764747853500625e-39,-0.9090909361839294,1,0,
	],minco,)
--------*/
//zoom serabut
	m3.copy([
		706.90234375,0,0,0,
		0,-706.90234375,0,0,
		1.5764747853500625e-39,-0.9090909361839294,1,0,
	],minco,)
		let poros0 = ui.newobj('rangkaporos')
	let mpo0 = poros0.matlok
	m4.translate(matide,[0,0,40,],mpo0,)
	m4.rotateX(mpo0,Math.PI/2,mpo0,)
	m4.scale(mpo0,[1,22,1,],mpo0,)
	let poros1 = ui.newobj('rangkaporos')
	let mpo1 = poros1.matlok
	m4.translate(matide,[0,0,62,],mpo1,)
	m4.rotateX(mpo1,Math.PI/2,mpo1,)
	m4.scale(mpo1,[3,.5,3,],mpo1,)
	let engkol = ui.newobj
	('rangkaengkol')
	m4.identity(engkol.matlok)
	
	let piston0 = ui.newobj('rangkapiston'); let mpi0 = piston0.matlok; m4.translate(matide,[0,0,9,],mpi0,)
	let piston1 = ui.newobj('rangkapiston'); let mpi1 = piston1.matlok; m4.translate(matide,[0,0,3,],mpi1,)
	let piston2 = ui.newobj('rangkapiston'); let mpi2 = piston2.matlok; m4.translate(matide,[0,0,-3,],mpi2,)
	let piston3 = ui.newobj('rangkapiston'); let mpi3 = piston3.matlok; m4.translate(matide,[0,0,-9,],mpi3,)
	let mper =
	m4.identity()
	mper[7] = .5
	let gear0 = ui.newobj('rangkagear20')
	let mg0 = gear0.matlok
	m4.translate(matide,[0,0,67,],mg0,)
	m4.rotateX(mg0,Math.PI/2,mg0,)
	
	m4.translate(mg0,[0,-2,0,],mg0,)
	m4.mul(mg0,mper,mg0,)
	
	m4.translate(mg0,[0,-1.2,0,],mg0,)
	m4.scale(mg0,[1,.05,1,],mg0,)
	let gear1 = ui.newobj('rangkagear20')
	let mg1 = gear1.matlok
	m4.translate(matide,[0,0,67,],mg1,)
	m4.rotateZ(mg1,-Math.PI/2,mg1,)
	
	m4.translate(mg1,[0,-2,0,],mg1,)
	m4.mul(mg1,mper,mg1,)
	
	m4.translate(mg1,[0,-1.2,0,],mg1,)
	m4.scale(mg1,[1,.05,1,],mg1,)
	let gear2 = ui.newobj('rangkagear16')
	let mg2 = gear2.matlok
	m4.translate(matide,[0,0,67,],mg2,)
	m4.rotateZ(mg2,Math.PI/2,mg2,)
	
	m4.translate(mg2,[0,-2,0,],mg2,)
	m4.mul(mg2,mper,mg2,)
	
	m4.translate(mg2,[0,1,0,],mg2,)
	m4.scale(mg2,[1,.5,1,],mg2,)
	let gear3 = ui.newobj('rangkagear16')
	let mg3 = gear3.matlok
	m4.translate(matide,[0,0,67,],mg3,)
	m4.rotateZ(mg3,-Math.PI/2,mg3,)
	
	m4.translate(mg3,[0,-2,0,],mg3,)
	m4.mul(mg3,mper,mg3,)
	
	m4.translate(mg3,[0,1,0,],mg3,)
	m4.scale(mg3,[1,.5,1,],mg3,)
	let gear4 = ui.newobj('rangkagear16')
	let mg4 = gear4.matlok
	m4.translate(matide,[0,0,67,],mg4,)
	let gear5 = ui.newobj('rangkagear16')
	let mg5 = gear5.matlok
	m4.translate(matide,[0,0,67,],mg5,)
	let poros2 = ui.newobj('rangkaporos')
	let mpo2 = poros2.matlok
	m4.copy(mg5,mpo2,)
	let kotak0 = ui.newobj('rangkakotak')
	let mk0 = kotak0.matlok
	m4.translate(matide,[0,0,67,],mk0,)
	
	let kotak1 = ui.newobj('rangkakotak')
	let mk1 = kotak1.matlok
	m4.copy(mk0,mk1,)

	let poros3 = ui.newobj('rangkaporos')
	let mpo3 = poros3.matlok
	m4.copy(mg5,mpo3,)
	m4.translate(mpo3,[13,0,0,],mpo3,)
	m4.rotateZ(mpo3,Math.PI/2,mpo3,)
	m4.scale(mpo3,[.7,12,.7,],mpo3,)
	let poros4 = ui.newobj('rangkaporos')
	let mpo4 = poros4.matlok
	m4.copy(mg5,mpo4,)
	m4.translate(mpo4,[-13,0,0,],mpo4,)
	m4.rotateZ(mpo4,Math.PI/2,mpo4,)
	m4.scale(mpo4,[.7,12,.7,],mpo4,)
	let ban0 = ui.newobj('rangkaban')
	let mba0 = ban0.matlok
	m4.translate(matide,[25,0,67,],mba0,)
	m4.rotateZ(mba0,Math.PI/2,mba0,)
	m4.scale(mba0,[11,11,11,],mba0,)
	let ban1 = ui.newobj('rangkaban')
	let mba1 = ban1.matlok
	m4.translate(matide,[-25,0,67,],mba1,)
	m4.rotateZ(mba1,Math.PI/2,mba1,)
	m4.scale(mba1,[11,11,11,],mba1,)
let rot = 0
let difrot = 0
let speed = .0006
let difspeed = .0004
let tunda = 0
ui.render = dt=>{
	speed = ru.cla('cepatmesin')[0].value/33333
	difspeed = ru.cla('cepatdiff')[0].value/33333
	rot += dt*speed
	difrot += dt*difspeed
	
	let m2d0
	
	let b0
	let b0a
	let b1

	let pbatang = 10//panjang batang
	let pengkol = 3//panjang engkol
//engkol ---- gear1
b0 = engkol.chi[1].matlok
	m4.rotateZ(matide,rot,b0,)
	
b0 = poros0.chi[1].matlok
	m4.rotateY(matide,rot,b0,)
	m4.copy(b0,poros1.chi[1].matlok,)
	
b0 = gear0.chi[1].matlok
	m4.rotateY(matide,rot,b0,)
b0 = gear1.chi[1].matlok
	m4.rotateY(matide,-rot,b0,)
b0 = kotak0.chi[1].matlok
	m4.rotateX(matide,-rot,b0,)
	m4.translate(b0,[-2,2.5,0,],b0,)
	m4.scale(b0,[3,.5,1.5,],b0,)
	b0a = kotak1.chi[1].matlok
		m4.copy(b0,b0a,)
	m4.translate(b0a,[0,-10,0,],b0a,)
b0 = poros2.chi[1].matlok
	m4.rotateX(matide,-rot,b0,)
	m4.scale(b0,[.4,2,.4,],b0,)
	
	//coba mat2d
m2d0 = engkol.mat2d[0]
	m3.invert(m2d0,m2d0,)
	m3.rotate(m2d0,.01,m2d0,)
	m3.invert(m2d0,m2d0,)
	m3.rotate(m2d0,.023,m2d0,)
//gear 4 & 5 ---- roda 0 & 1
b0 = gear4.chi[1].matlok
	m4.rotateX(matide,-rot,b0,)
	b0a = gear5.chi[1].matlok
		m4.copy(b0,b0a,)
	m4.translate(b0,[0,-2,0,],b0,)
	m4.mul(b0,mper,b0,)
	m4.translate(b0,[0,1,0,],b0,)
	m4.scale(b0,[1,.5,1,],b0,)
	m4.rotateX(b0a,rot+Math.PI,b0a,)
	m4.invert(b0a,b0a,)
	m4.mul(b0a,b0,b0a,)
	
	m4.rotateY(b0,difrot,b0,)
	m4.rotateY(b0a,difrot,b0a,)
b0 = gear2.chi[1].matlok
b1 = gear3.chi[1].matlok
	m4.rotateY(matide,rot-difrot,b0,)
	m4.rotateY(matide,-rot-difrot,b1,)
	b0a = m4.copy(b0,poros3.chi[1].matlok,)
		//m4.invert(b0a,b0a,)
	b0a = m4.copy(b1,poros4.chi[1].matlok,)
		m4.invert(b0a,b0a,)
	b0a = m4.copy(b0,ban0.chi[1].matlok,)
		//m4.invert(b0a,b0a,)
	b0a = m4.copy(b1,ban1.chi[1].matlok,)
		m4.invert(b0a,b0a,)
	
	//coba mat2d
m2d0 = ban0.mat2d[1]
	m3.rotate(m2d0,.01,m2d0,)
	m3.translate(m2d0,[.1,.2,],m2d0,)
//piston 0 & 3
b0 = piston0.chi[1].matlok
b1 = piston0.chi[1].chi[0].matlok
	m4.rotateZ(matide,rot+Math.PI,b0,)
	m4.translate(b0,[0,pengkol,0,],b0,)
	m4.rotateZ(b0,-rot+Math.PI,b0,)
	m4.rotateZ(b0,Math.asin(b0[12]/pbatang),b0,)
		m4.translate(matide,[0,pbatang,0,],b1,)
		m4.rotateZ(b1,Math.asin(-b0[12]/pbatang),b1,)
	m4.copy(b0,piston3.chi[1].matlok,)
	m4.copy(b1,piston3.chi[1].chi[0].matlok,)
//piston 1 & 2
b0 = piston1.chi[1].matlok
b1 = piston1.chi[1].chi[0].matlok
	m4.rotateZ(matide,rot,b0,)
	m4.translate(b0,[0,pengkol,0,],b0,)
	m4.rotateZ(b0,-rot,b0,)
	m4.rotateZ(b0,Math.asin(b0[12]/pbatang),b0,)
		m4.translate(matide,[0,pbatang,0,],b1,)
		m4.rotateZ(b1,Math.asin(-b0[12]/pbatang),b1,)
	m4.copy(b0,piston2.chi[1].matlok,)
	m4.copy(b1,piston2.chi[1].chi[0].matlok,)
	//coba mat2d
	m2d0 = lain.mat2d[0]
	m3.rotate(m2d0,.002,m2d0,)
	
	//intelcore
	m3.rotate(minco,.002,minco,)
/*=======
	ru.key.naik && m3.translate(minco,[0,-.01,],minco,)
	ru.key.turun && m3.translate(minco,[0,.01,],minco,)
	ru.key.kiri && m3.translate(minco,[-.01,0,],minco,)
	ru.key.kanan && m3.translate(minco,[.01,0,],minco,)
--------*/
	let zin = .97
	let zout = 1.03
	ru.key.zoomin && m3.scale(minco,[zin,zin,],minco,)
	ru.key.zoomout && m3.scale(minco,[zout,zout,],minco,)
}

}
