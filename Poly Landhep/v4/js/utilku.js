'use strict'

export let lihat = a=>{
	console.groupCollapsed(a)
	console.trace(a)
	console.groupEnd()
	return a
}
export let que = str=>document.querySelectorAll(str)
export let attr = (ele,nama,val,)=>{
	if(nama === undefined)
		return ele.attributes
	
	if(val === null)
		ele.removeAttribute(nama)
	else
	if(val !== undefined)
		ele.setAttribute(nama,val,)
	
	return ele.getAttribute(nama)
}

let sleepms
let sleepf = r => setTimeout(r, sleepms)
export let sleep = msinp => {
	sleepms = msinp
	return new Promise(sleepf)
}

//typedarray ke base64
export let tyarr_b64 = async buffer=>{
	if(!buffer){return 'kosong'}
	const byteArray = new Uint8Array(buffer);
	return btoa(String.fromCharCode(...byteArray));
}
export let b64_tyarr = async base64String=>{
	//if(typeof base64String !== 'string'){throw 'harus string'}
	const binaryString = atob(base64String);
	const byteArray = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		byteArray[i] = binaryString.charCodeAt(i);
	}
	return byteArray.buffer
}

//
export let getWordByIndex = (str, index)=>{
    let wordStart = 0;
    let wordEnd = 0;
    let currentWordIndex = 0;

    for (let i = 0; i <= str.length; i++) {
        // Check for a space or the end of the string
        if (str[i] === ' ' || i === str.length) {
            if (currentWordIndex === index) {
                // Return the substring for the target word
                return str.slice(wordStart, i);
            }
            currentWordIndex++;
            wordStart = i + 1; // Move the start to the next word
        }
    }

    return null; // Return null if the index is out of range
}

export let pisahstr = str=>(str === '')?[]:str.split(/\s+/)


//keyboard
let keycodes = {}
export let key = {}
export let fkey = []

let fkeyini = e=>{
	if(
		(document.activeElement !== document.body)/* ||
		e.ctrlKey ||
		e.shiftKey ||
		e.altKey*/
	){return}
	let namakey = keycodes[e.code]
	let awal = key[namakey]
	if(awal === undefined){return}
	let akhir = e.type === 'keydown'
	let berubah = awal !== akhir
	key[namakey] = akhir
	for(let k of fkey){
		k?.(key,namakey,berubah,)
	}
}
export let newkey = (code,name,)=>{
	keycodes[code] = name
	key[name] = false
}
addEventListener('keydown',fkeyini,)
addEventListener('keyup',fkeyini,)