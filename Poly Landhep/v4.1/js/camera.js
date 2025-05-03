"use strict"



import {
	canv3d,
	canv2d,
	cx3d,
	cx2d,
	fcamlocked,
} from './ui.js'



import {
	lihat as lih,
	fkey,
	newkey,
} from '../../v4/js/utilku.js'



let camera = window.camera = {
	fview:null,
}
let v3 = wgpuMatrix.vec3
let m3 = wgpuMatrix.mat3
let m4 = wgpuMatrix.mat4
let w = canv3d.width
let h = canv3d.height
//camera
let persp = camera.persp = m4.identity()
let cam = camera.cam = m4.identity()
let invcam = camera.invcam = m4.identity()
let view = camera.matview = m4.identity()//hasil dari persp*cam 

export let loadcam = async aa=>{
	lih('ini camerraaaa')

	//keyboard
	fkey.push((key,namakey,berubah,)=>{
		//jika putar kamera = true
		if(fcamlocked()){return}
		
		//
		if((namakey === 'm') && key.m && berubah){
			digeser = true
			document.body.requestPointerLock({unadjustedMovement:true,})
		}else
		if((namakey === 'r') && key.r && berubah){
			diputar = true
			document.body.requestPointerLock({unadjustedMovement:true,})
		}
		
		if(!key.m && berubah){digeser = false}
		if(!key.r && berubah){diputar = false}
		
		if(
			!key.m &&
			!key.r &&
			berubah
		){
			document.exitPointerLock()
		}
		if(key.h){
			camreset()
			fcam()
		}
	})
	document.body.addEventListener('wheel',e=>
		document.pointerLockElement
		&& e.preventDefault()
	,{passive:0,},)
	
	newkey('KeyM','m',) //move cam
	newkey('KeyR','r',) //rotate cam
	newkey('KeyH','h',) //reset cam
	
		
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
	
	let camges = camera.camges = m4.identity()
	let rang = 0
	let camreset = ()=>{
		m4.identity(camges)
		m4.rotateY(camges,.4,camges,)
		m4.scale(camges,Array(3).fill(11),camges,)
		rang = -.5
	}
	camreset()
	let fcam = ()=>{
		m4.copy(camges,cam,)
		m4.rotateX(cam,rang,cam,)
		m4.translate(cam,[0,0,3,],cam,)
		m4.invert(cam,invcam,)
		m4.mul(persp,invcam,view,)
		camera.fview?.(
			persp,
			camges,// pivot
			cam,
			invcam,
			view,
		)
	}
	fcam()
	
	//gerak camera
	let digeser = false
	let diputar = false
		
	addEventListener('mousemove',e=>{
		if(digeser){
			m4.translate(camges,[
				e.movementX/555,
				0,
				e.movementY/555,
			],camges,)
		}
		if(diputar){
			m4.rotateY(camges,-e.movementX/99,camges,)
			rang -= e.movementY/99
			let pi = Math.PI
			rang = Math.max(-pi/2,rang,)
			rang = Math.min(pi/2,rang,)
		}
		
			fcam()
	},)
	addEventListener('wheel',e=>{
		if(digeser){
			m4.translate(camges,[
				0,
				e.deltaY/3333,
				0,
			],camges,)
		}
		if(diputar){
			let s = 2**(e.deltaY/999)
			m4.scale(camges,Array(3).fill(s),camges,)
		}
		
		fcam()
	},)
}

export let fview = f=>
(typeof f === 'function')
?(camera.fview = f)
:camera.fview

