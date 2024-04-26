[
	[
		{
			"text": "\"use strict\"\n\nlet o3dv = {}\n;(async ()=>{\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "0",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "//let\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "99",
					"b": "99",
					"frame": "0"
				}
			]
		},
		{
			"text": "\tlet lih = ru.lihat\n\tlet h2 = document.querySelector('h2')\n\tlet canv = o3dv.canv = document.querySelector('#canv3d')\n\tlet cx = o3dv.cx = canv.getContext('webgpu')\n\tlet canv2d = o3dv.canv2d = document.querySelector('#canv2d')\n\tlet cx2d = o3dv.cx2d = canv2d.getContext('2d')\n\tlet m4 = wgpuMatrix.mat4\n\tlet v3 = wgpuMatrix.vec3\n\tlet w = canv.width\n\tlet h = canv.height\n\t\n\tlet errmsg = '!!__ERROR__!! : '\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "99",
					"b": "99",
					"frame": "0"
				}
			]
		},
		{
			"text": "\n//indices padding, buffer harus 4 byte\nlet indarrpad = ()=>{\n\tif(indarr.length%2){\n\t\tindarr.push(0)\n\t}\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "//canvas resize\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "0",
					"g": "255",
					"b": "0",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\tlet canvres = e=>{\n\t\tlet s = canv.style\n\t\tlet s2d = canv2d.style\n\t\tif(innerWidth/innerHeight > canv.width/canv.height){\n\t\t\ts.height = '100%'\n\t\t\ts.width = ''\n\t\t}else{\n\t\t\ts.height = ''\n\t\t\ts.width = '100%'\n\t\t}\n\t\ts2d.height = s.height\n\t\ts2d.width = s.width\n\t}\n\taddEventListener('resize',canvres,)\n\tcanvres()\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "0",
					"g": "255",
					"b": "0",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "//adapter\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\tlet adap = await navigator.gpu.requestAdapter()\n\tlet dv = await adap.requestDevice()\n",
			"visible": false,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "//presentationFormat\n//",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "0",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\tlet presentationFormat = navigator.gpu.getPreferredCanvasFormat()\n\tcx.configure({\n\t\tdevice:dv,\n\t\tformat: presentationFormat,\n\t})\n",
			"visible": false,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "0",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\t//meshshader\n\tlet code = await fetch('js/O3DV-meshshader.wgsl')\n\tcode = await code.text()\n\tlet meshmod = dv.createShaderModule({\n\t\tlabel:'ini mesh module',\n\t\tcode,\n\t})\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\n/*================\n\t//screenshader\n\tcode = await fetch('js/O3DV-screenshader.wgsl')\n\tcode = await code.text()\n\tlih(code)\n\tlet screenmod = dv.createShaderModule({\n\t\tlabel:'ini screen module',\n\t\tcode,\n\t})\n----------------*/\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "200",
					"g": "200",
					"b": "200",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "\tlet meshpipe = dv.createRenderPipeline({\n\t\tlabel: 'ini pipa mesh',\n\t\tlayout: 'auto',\n\t\tvertex: {\n\t\t\tmodule:meshmod,\n\t\t\tentryPoint: 'vs',\n\t\t\tbuffers: [\n\t\t\t\t{//pos\n\t\t\t\t\tarrayStride: 3 * 4, // 3 floats, 4 bytes each\n\t\t\t\t\tattributes: [\n\t\t\t\t\t\t{shaderLocation: 0, offset: 0, format: 'float32x3'},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{//tex\n\t\t\t\t\tarrayStride: 2 * 4, // 1 floats, 4 bytes each\n\t\t\t\t\tattributes: [\n\t\t\t\t\t\t{shaderLocation: 1, offset: 0, format: 'float32x2'},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{//voroidx\n\t\t\t\t\tarrayStride: 1 * 4,\n\t\t\t\t\tattributes: [\n\t\t\t\t\t\t{shaderLocation: 2, offset: 0, format: 'uint32'},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\tfragment: {\n\t\t\tmodule:meshmod,\n\t\t\tentryPoint: 'fs',\n\t\t\ttargets: [{ format: presentationFormat }],\n\t\t},\n\t\tprimitive: {\n\t\t\tcullMode: 'back',\n\t\t},\n\t\tdepthStencil: {\n\t\t\tdepthWriteEnabled: true,\n\t\t\tdepthCompare: 'greater',\n\t\t\tformat: 'depth24plus',\n\t\t},\n\t})\n",
			"visible": false,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "111",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\tlet renderPassDescriptor = {\n\t\tlabel: 'our basic canvas meshPass',\n\t\tcolorAttachments: [\n\t\t\t{\n\t\t\t\tclearValue: [0.3, 0.1, 0.1, 1],\n\t\t\t\tloadOp: 'clear',\n\t\t\t\tstoreOp: 'store',\n\t\t\t\tview:null,// <- to be filled out when we render\n\t\t\t},\n\t\t],\n\t\tdepthStencilAttachment: {\n\t\t\tdepthClearValue: 0.0,\n\t\t\tdepthLoadOp: 'clear',\n\t\t\tdepthStoreOp: 'store',\n\t\t\tview:null,// <- to be filled out when we render\n\t\t},\n\t}\n",
			"visible": false,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "166",
					"b": "111",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "\n/*\n\n\n\n\n\n\n\n\n\n\n\n\n*/\n",
			"visible": false,
			"time": "622300.9514858138",
			"speed": "1",
			"running": true,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				},
				{
					"r": "0",
					"g": "0",
					"b": "0",
					"frame": ".1"
				}
			]
		}
	],
	[
		{
			"text": "\t\n\tlet posarr =\n\to3dv.posarr = [\n\t\t0,1,0,\n\t\t0,0,0,\n\t\t1,0,0,\n\t\t1,-.4,-1,\n\t\t-1,-.4,-1,\n\t\t-1,-.4,1,\n\t\t1,-.4,1,\n\t\t0,1,-.5,\n\t\t0,-2,-.5,\n\t\t1,-2,-.5,\n\t]\n\t//coba vvv\n\t\tposarr =\n\t\to3dv.posarr =\n\t\t[\n\t\t\t/*0,1,0,\n\t\t\t0,0,0,\n\t\t\t1,0,0,*/\n\t\t]\n\t// ^^^ sudah\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "199",
					"g": "199",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\tlet texarr =\n\to3dv.texarr = [\n\t\t-2,7,\n\t\t-2,-2,\n\t\t7,-2,\n\t\t.6,.6,\n\t\t-.6,.6,\n\t\t-.6,-.6,\n\t\t.6,-.6,\n\t\t0,0,\n\t\t0,0,\n\t\t0,0,\n\t]\n\t//coba vvv\n\t\ttexarr =\n\t\to3dv.texarr =\n\t\t[\n\t\t\t/*-2,7,\n\t\t\t-2,-2,\n\t\t\t7,-2,*/\n\t\t]\n\t// ^^^ sudah\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "99",
					"b": "99",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\tlet voroidxarr =\n\to3dv.voroidxarr = [\n\t\t1,\n\t\t0,\n\t\t2,\n\t\t2,\n\t\t0,\n\t\t1,\n\t\t1,\n\t\t2,\n\t\t2,\n\t\t2,\n\t]\n\t//coba vvv\n\t\tvoroidxarr =\n\t\to3dv.voroidxarr =\n\t\t[\n\t\t\t/*2,\n\t\t\t0,\n\t\t\t2,*/\n\t\t]\n\t// ^^^ sudah\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "234",
					"b": "216",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\tlet indarr =\n\to3dv.indarr = [\n\t\t1,2,0,\n\t\t3,4,5,\n\t\t3,5,6,\n\t\t7,8,9,\n\t]\n\t//coba vvv\n\t\tindarr =\n\t\to3dv.indarr =\n\t\t[]\n\t// ^^^ sudah\n\t\n\tindarrpad()\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "200",
					"b": "177",
					"frame": "0"
				}
			]
		},
		{
			"text": "\n\tlet persp = o3dv.persp = m4.identity()\n\tlet cam = o3dv.cam = m4.identity()\n\tlet view = o3dv.view = m4.identity()//hasil dari persp*cam \n\t\n    m4.perspective(\n        .9,//rad\n        w/h,\n        .01,      // zNear\n        999.01,   // zFar\n        persp,\n    );\n\t\n\t//change z to 1-z\n\tm4.invert(persp,persp,)\n\t\tm4.translate(persp,[0,0,1,],persp)\n\t\tm4.scale(persp,[1,1,-1,],persp,)\n\tm4.invert(persp,persp,)\n\t//it wokkkkkk, HOW?? \n/*================\n----------------*/\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "188",
					"g": "255",
					"b": "188",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\t//let layar\n",
			"visible": false,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "177",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "\t\n\t//let poslen = 0\n\tlet posbuf = dv.createBuffer({\n\t\tlabel:'ini posbuf',\n\t\tsize:0xffff*4,\n\t\tusage:\n\t\t\tGPUBufferUsage.VERTEX|\n\t\t\tGPUBufferUsage.COPY_DST\n\t\t,\n\t})\n\tdv.queue.writeBuffer(\n\t\tposbuf,\n\t\t0,\n\t\tnew Float32Array(posarr),\n\t)\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "144",
					"g": "144",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\t//let texlen = 0\n\tlet texbuf = dv.createBuffer({\n\t\tlabel:'ini texbuf',\n\t\tsize:0xffff*4,\n\t\tusage:\n\t\t\tGPUBufferUsage.VERTEX|\n\t\t\tGPUBufferUsage.COPY_DST\n\t\t,\n\t})\n\tdv.queue.writeBuffer(\n\t\ttexbuf,\n\t\t0,\n\t\tnew Float32Array(texarr),\n\t)\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "211",
					"g": "77",
					"b": "77",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\t//let voroidxlen = 0\n\tlet voroidxbuf = dv.createBuffer({\n\t\tlabel:'ini voroidxbuf',\n\t\tsize:0xffff*4,\n\t\tusage:\n\t\t\tGPUBufferUsage.VERTEX|\n\t\t\tGPUBufferUsage.COPY_DST\n\t\t,\n\t})\n\tdv.queue.writeBuffer(\n\t\tvoroidxbuf,\n\t\t0,\n\t\tnew Uint32Array(voroidxarr),\n\t)\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "215",
					"g": "213",
					"b": "174",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\t//let indlen = 0\n\tlet indbuf = dv.createBuffer({\n\t\tlabel:'ini indbuf',\n\t\tsize:0xffff*4,\n\t\tusage:\n\t\t\tGPUBufferUsage.INDEX|\n\t\t\tGPUBufferUsage.COPY_DST\n\t\t,\n\t})\n\tdv.queue.writeBuffer(\n\t\tindbuf,\n\t\t0,\n\t\tnew Uint16Array(indarr),\n\t)\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "177",
					"g": "144",
					"b": "122",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\tlet matbuf = dv.createBuffer({\n\t\tlabel:'ini matbuf',\n\t\tsize:cam.byteLength,\n\t\tusage:\n\t\t\tGPUBufferUsage.UNIFORM|\n\t\t\tGPUBufferUsage.COPY_DST\n\t\t,\n\t})\n",
			"visible": false,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "144",
					"g": "211",
					"b": "144",
					"frame": "0"
				}
			]
		},
		{
			"text": "\n\tlet layarbuf = dv.createBuffer({\n\t\tlabel:'ini matbuf',\n\t\tsize:w*h*4,\n\t\tusage:\n\t\t\tGPUBufferUsage.STORAGE|\n\t\t\tGPUBufferUsage.COPY_SRC|\n\t\t\tGPUBufferUsage.COPY_DST\n\t\t,\n\t})\n",
			"visible": false,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "188",
					"g": "188",
					"b": "111",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\tlet ulainbuf = dv.createBuffer({\n\t\tlabel:'ini ulain buffer',\n\t\tsize:2*4,\n\t\tusage:\n\t\t\tGPUBufferUsage.STORAGE|\n\t\t\tGPUBufferUsage.COPY_SRC|\n\t\t\tGPUBufferUsage.COPY_DST\n\t\t,\n\t})\n\tdv.queue.writeBuffer(\n\t\tulainbuf,\n\t\t0,\n\t\tnew Uint32Array([w,h,]),\n\t)\n",
			"visible": false,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "206",
					"g": "157",
					"b": "201",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "\n/*\n\n\n\n\n\n\n\n\n\n\n\n\n*/\n",
			"visible": true,
			"time": "622189.3921993319",
			"speed": "1",
			"running": true,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				},
				{
					"r": "0",
					"g": "0",
					"b": "0",
					"frame": ".14"
				}
			]
		}
	],
	[
		{
			"text": "",
			"visible": false,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\t//voronoi tail, batas akhir\n\tlet vorotailarr =\n\to3dv.vorotailarr = []/*========\n\tvorotailarr.push(\n\t\t1+\n\t\t1+\n\t\t1+\n\t\t1\n\t)\n\tvorotailarr.push(\n\t\t1+\n\t\t1+\n\t\t1+\n\tvorotailarr[vorotailarr.length-1])\n\tvorotailarr.push(\n\t\t1+\n\t\t1+\n\t\t1+\n\t\t1+\n\t\t1+\n\t\t1+\n\tvorotailarr[vorotailarr.length-1])\n--------*/\t\n/*========\n\tfor(let naA in vorotailarr){\n\t\tlet vaA =\n\t\tvorotailarr[naA = +naA]\n\t\tvorotailarr[naA] =\n\t\tnaA?\n\t\t(vorotailarr[naA-1]+vaA):\n\t\tvaA\n\t}\n--------*/\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "177",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\t\n\tlet voroposarr =\n\to3dv.voroposarr = [\n/*========\n\t\t-.3,-.3,\n\t\t.3,-.3,\n\t\t.3,.3,\n\t\t-.3,.3,\n\t\t\n\t\t\n\t\t0,0,\n\t\t0,-.4,\n\t\t-.4,0,\n\t\t\n\t\t\n\t\t-.1,0,\n\t\t0,.1,\n\t\t0,-.1,\n\t\t-.3,0,\n\t\t0,-.3,\n\t\t0,.3,\n--------*/\n\t]\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "222",
					"g": "188",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\t\n\tlet vorocolorarr =\n\to3dv.vorocolorarr = [\n/*========\n\t\t0x00ff00ff,\n\t\t0x77004499,\n\t\t0xff0011aa,\n\t\t0x4400ffbb,\n\t\t\n\t\t\n\t\t0xffffffcc,\n\t\t0x888811dd,\n\t\t0xff0022ff,\n\t\t\n\t\t\n\t\t0xff0000ff,\n\t\t0xffffffff,\n\t\t0xaaaaaaff,\n\t\t0xcc0000ff,\n\t\t0x005500ff,\n\t\t0x000000ff,\n--------*/\n\t]\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "188",
					"b": "155",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "",
			"visible": false,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\t//let vorotaillen = 0\n\tlet vorotailbuf = dv.createBuffer({\n\t\tlabel:'ini voronoi tail buf',\n\t\tsize:0xffff*4,\n\t\tusage:\n\t\t\tGPUBufferUsage.STORAGE|\n\t\t\tGPUBufferUsage.COPY_SRC|\n\t\t\tGPUBufferUsage.COPY_DST\n\t\t,\n\t})\n\tdv.queue.writeBuffer(\n\t\tvorotailbuf,\n\t\t0,\n\t\tnew Uint32Array(vorotailarr),\n\t)\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "127",
					"g": "203",
					"b": "201",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\t//let voroposlen = 0\n\tlet voroposbuf = dv.createBuffer({\n\t\tlabel:'ini voronoi pos buf',\n\t\tsize:0xffff*4,\n\t\tusage:\n\t\t\tGPUBufferUsage.STORAGE|\n\t\t\tGPUBufferUsage.COPY_SRC|\n\t\t\tGPUBufferUsage.COPY_DST\n\t\t,\n\t})\n\tdv.queue.writeBuffer(\n\t\tvoroposbuf,\n\t\t0,\n\t\tnew Float32Array(voroposarr),\n\t)\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "174",
					"g": "138",
					"b": "211",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\t//let vorocolorlen = 0\n\tlet vorocolorbuf = dv.createBuffer({\n\t\tlabel:'ini voronoi color buf',\n\t\tsize:0xffff*4,\n\t\tusage:\n\t\t\tGPUBufferUsage.STORAGE|\n\t\t\tGPUBufferUsage.COPY_SRC|\n\t\t\tGPUBufferUsage.COPY_DST\n\t\t,\n\t})\n\tdv.queue.writeBuffer(\n\t\tvorocolorbuf,\n\t\t0,\n\t\tnew Uint32Array(vorocolorarr),\n\t)\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "223",
					"g": "144",
					"b": "126",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "\n/*\n\n\n\n\n\n\n\n\n\n\n\n\n*/\n",
			"visible": true,
			"time": "622174.1928993325",
			"speed": "1",
			"running": true,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				},
				{
					"r": "0",
					"g": "0",
					"b": "0",
					"frame": ".12"
				}
			]
		}
	],
	[
		{
			"text": "\t\n\tlet depthtex = dv.createTexture({\n\t\tsize: [w,h,],\n\t\tformat: 'depth24plus',\n\t\tusage: GPUTextureUsage.RENDER_ATTACHMENT,\n\t})\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "177",
					"g": "155",
					"b": "133",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "\t\n\tlet meshbind = dv.createBindGroup({\n\t\tlabel: 'iiinnnnii  mesh bindGroup',\n\t\tlayout: meshpipe.getBindGroupLayout(0),\n\t\tentries: [\n\t\t\t{ binding: 0, resource: { buffer: matbuf} },\n\t\t\t{ binding: 1, resource: { buffer: layarbuf} },\n\t\t\t{ binding: 2, resource: { buffer: ulainbuf} },\n\t\t\t{binding:3,resource:{buffer:vorotailbuf,},},\n\t\t\t{binding:4,resource:{buffer:voroposbuf,},},\n\t\t\t{binding:5,resource:{buffer:vorocolorbuf,},},\n\t\t],\n\t});\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "177",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "\n\tlet tms = 0\n\tlet lukis = async t=>{\n\t\tlet dt = t-tms\n\t\ttms = t\n\t\t//dv.queue.writeBuffer(layarbuf,0,new Uint32Array(w*h).fill(0),)\n\t\tlet encoder = dv.createCommandEncoder({\n\t\t\tlabel: 'encoderrrrrrr',\n\t\t})\n\t\trenderPassDescriptor.colorAttachments[0].view = cx.getCurrentTexture().createView()\n\t\trenderPassDescriptor.depthStencilAttachment.view = depthtex.createView()\n\t\tlet pass = encoder.beginRenderPass(renderPassDescriptor)\n\t\tif(indarr.length){\n\t\t\n\t\t\n\t\tpass.setPipeline(meshpipe)\n\t\tpass.setBindGroup(0, meshbind)\n\t\tpass.setVertexBuffer(0,posbuf,)\n\t\tpass.setVertexBuffer(1,texbuf,)\n\t\tpass.setVertexBuffer(2,voroidxbuf,)\n\t\tpass.setIndexBuffer(indbuf,'uint16',)\n\t\tpass.drawIndexed(indarr.length,1,0,0,0,)\n\t\tpass.end()\n\t\t\n\t\t\n\t\t}else{\n\t\t\tpass.end()\n\t\t}\n\t\tdv.queue.submit([encoder.finish()])\n\t\tawait dv.queue.onSubmittedWorkDone()\n\t\to3dv.render?.(dt)\n\t\trequestAnimationFrame(lukis)\n\t\t//lukis()\n\t}\n\tlet prm//lukis promise\n\trequestAnimationFrame(lukis)\n\tlih('sudah submit')\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "177",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "\n/*\n\n\n\n\n\n\n\n\n\n\n\n\n*/\n",
			"visible": true,
			"time": "588487.0666997763",
			"speed": "1",
			"running": true,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				},
				{
					"r": "0",
					"g": "0",
					"b": "0",
					"frame": ".1"
				}
			]
		}
	],
	[
		{
			"text": "",
			"visible": false,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\t\n\tlet camdigeser = false\n\tlet camdiputar = false\n\to3dv.camdigeser = (bool = camdigeser)=>camdigeser = !!bool\n\to3dv.camdiputar = (bool = camdiputar)=>camdiputar = !!bool\n\tlet camges = o3dv.camges = m4.identity()\n\tlet rang = 0\n\tlet camreset = o3dv.camreset = ()=>{\n\t\tm4.identity(camges)\n\t\tm4.scale(camges,Array(3).fill(1000),camges,)\n\t\trang = -.7\n\t}\n\tcamreset()\n\tlet fmouse = o3dv.fmouse = ()=>{\n\t\t\n\t\tm4.copy(camges,cam,)\n\t\tm4.rotateX(cam,rang,cam,)\n\t\tm4.translate(cam,[0,0,3,],cam,)\n\t\tm4.invert(cam,cam,)\n\t\tm4.mul(persp,cam,view,)\n\t\tdv.queue.writeBuffer(matbuf,0,view,)\n\t}\n\taddEventListener('mousemove',e=>{\n\t\tif(camdigeser){\n\t\t\tm4.translate(camges,[\n\t\t\t\te.movementX*.004,\n\t\t\t\t0,\n\t\t\t\te.movementY*.004,\n\t\t\t],camges,)\n\t\t\t\n\t\t\tfmouse()\n\t\t}//else\n\t\tif(camdiputar){\n\t\t\trang += -e.movementY*.01\n\t\t\t\n\t\t\tlet pi = Math.PI\n\t\t\trang = Math.max(Math.min(pi/2,rang,),-pi/2,)\n\t\t\tm4.rotateY(camges,-e.movementX*.01,camges,)\n\t\t\t\n\t\t\tfmouse()\n\t\t}\n\t},)\n\taddEventListener('wheel',e=>{\n\t\tif(camdigeser){\n\t\t\tm4.translate(camges,[\n\t\t\t\t0,\n\t\t\t\te.deltaY*.001,\n\t\t\t\t0,\n\t\t\t],camges,)\n\t\t\t\n\t\t\tfmouse()\n\t\t\t\n\t\t}//else\n\t\tif(camdiputar){\n\t\t\tlet s = 1.001**(e.deltaY)\n\t\t\tm4.scale(camges,[s,s,s,],camges,)\n\t\t\t\n\t\t\tfmouse()\n\t\t}\n\t},)\n\tfmouse()\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "0",
					"g": "177",
					"b": "255",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "",
			"visible": false,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\n//mesh\nlet me = \no3dv.me = {}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "0",
					"g": "255",
					"b": "177",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nme.newvert = i=>{\n\tlet vertlen = posarr.length/3\n\tposarr.splice(i*3,0,\t0,0,0,)\n\ttexarr.splice(i*2,0,\t0,0,)\n\tvoroidxarr.splice(i*1,0,\t0,)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nme.deletevert = i=>{\n\tlet pos = posarr.splice(i*3,3,)\n\tlet tex = texarr.splice(i*2,2,)\n\tlet voro = voroidxarr.splice(i*1,1,)\n\treturn [\n\t\tpos[0],\n\t\tpos[1],\n\t\tpos[2],\n\t\ttex[0],\n\t\ttex[1],\n\t\tvoro[0],\n\t]\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "222",
					"g": "222",
					"b": "222",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nme.setvertall = data=>{\n/*========\n\tdata = [\n\t\t[vx,vy,vz,tx,ty,voro,],\n\t\t...\n\t]\n--------*/\n\tlet poslen = posarr.length\n\tlet texlen = texarr.length\n\tlet voroidxlen = voroidxarr.length\n//panjang array jadi aman, ok\n\tru.habisarr(posarr)\n\tru.habisarr(texarr)\n\tru.habisarr(voroidxarr)\n\tfor(let i in data){\n\t\tlet vert = data[i = +i]\n/*========\n\t\tposarr[i*3+0] = vert[0]\n\t\tposarr[i*3+1] = vert[1]\n\t\tposarr[i*3+2] = vert[2]\n\t\t\n\t\ttexarr[i*2+0] = vert[3]\n\t\ttexarr[i*2+1] = vert[4]\n\t\t\n\t\tvoroidxarr[i] = vert[5]\n---------*/\n\t\tposarr.push(vert[0])\n\t\tposarr.push(vert[1])\n\t\tposarr.push(vert[2])\n\t\t\n\t\ttexarr.push(vert[3])\n\t\ttexarr.push(vert[4])\n\t\t\n\t\tvoroidxarr.push(vert[5])\n\t}\n\t//tyar -> typed array\n\tlet postyar = new Float32Array(Math.max(poslen,posarr.length,))\t;postyar.set(posarr)\n\tlet textyar = new Float32Array(Math.max(texlen,texarr.length,))\t;textyar.set(texarr)\n\tlet voroidxtyar = new Uint32Array(Math.max(voroidxlen,voroidxarr.length,))\t;voroidxtyar.set(voroidxarr)\n\tdv.queue.writeBuffer(posbuf\t\t,0,postyar,)\n\tdv.queue.writeBuffer(texbuf\t\t,0,textyar,)\n\tdv.queue.writeBuffer(voroidxbuf\t,0,voroidxtyar,)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "199",
					"g": "199",
					"b": "199",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nme.setpos = (ipos,x,y,z,)=>{\n/*========\n\tipos -> index pos\n--------*/\n\tlet i = ipos*3\n\tposarr[i+0] = x\n\tposarr[i+1] = y\n\tposarr[i+2] = z\n\tdv.queue.writeBuffer(\n\t\tposbuf,\n\t\ti*4,\n\t\tnew Float32Array([x,y,z,]),\n\t)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "177",
					"b": "99",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nme.settex = (itc,x,y,)=>{\n/*========\n\titc -> index tex coo\n--------*/\n\tlet i = itc*2\n\ttexarr[i+0] = x\n\ttexarr[i+1] = y\n\tdv.queue.writeBuffer(\n\t\ttexbuf,\n\t\ti*4,\n\t\tnew Float32Array([x,y,]),\n\t)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "99",
					"g": "177",
					"b": "0",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nme.setvoro = (i,ref,)=>{\n/*========\n\ti -> index voro\n\tref -> ref ke vorotail\n--------*/\n\tvoroidxarr[i] = ref\n\tdv.queue.writeBuffer(\n\t\tvoroidxbuf,\n\t\ti*4,\n\t\tnew Uint32Array([ref]),\n\t)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "177",
					"g": "111",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nme.updvertbuf = (awal,akhir,)=>{\n\tlet possli = posarr.slice(awal*3,akhir*3,)\n\tlet postyar = new Float32Array(possli)\n\tdv.queue.writeBuffer(posbuf,awal*3*4,postyar,)\n\t\n\tlet texsli = texarr.slice(awal*2,akhir*2,)\n\tlet textyar = new Float32Array(texsli)\n\tdv.queue.writeBuffer(texbuf,awal*2*4,textyar,)\n\t\n\tlet vorosli = voroidxarr.slice(awal*1,akhir*1,)\n\tlet vorotyar = new Uint32Array(vorosli)\n\tdv.queue.writeBuffer(voroidxbuf,awal*1*4,vorotyar,)\n\t\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "177",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "",
			"visible": false,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\n//indices\nlet newind = \no3dv.newind = i=>{\n\t//i harus berlipat 6\n\tindarr.splice(i,0,\n\t\t...Array(6).\n\t\tfill(0),\n\t)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "77",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nlet deleteind = \no3dv.deleteind = i=>{\n\t//i harus berlipat 6\n\tindarr.splice(i,6,)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "122",
					"g": "122",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nlet setindall =\no3dv.setindall = data=>{\n\tlet indlen = indarr.length\n\tru.habisarr(indarr)\n\tfor(let i in data){\n\t\t//indarr[i = +i] = data[i]\n\t\tindarr.push(data[i])\n\t}\n\tlet indtyar = new Uint16Array(Math.max(indlen,indarr.length,))\n\tindtyar.set(indarr)\n\tdv.queue.writeBuffer(\n\t\tindbuf,\n\t\t0,\n\t\tindtyar,\n\t)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nlet setind = \no3dv.setind = (iind,i0,i1,i2,i3,i4,i5,)=>{\n\tlet i = iind\n\tindarr[i+0] = i0\n\tindarr[i+1] = i1\n\tindarr[i+2] = i2\n\tindarr[i+3] = i3\n\tindarr[i+4] = i4\n\tindarr[i+5] = i5\n\tdv.queue.writeBuffer(\n\t\tindbuf,\n\t\ti*2,\n\t\tnew Uint16Array([i0,i1,i2,i3,i4,i5,]),\n\t)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "177",
					"g": "177",
					"b": "177",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nlet updindbuf =\no3dv.updindbuf = (awal,akhir,)=>{\n\tlet indsli = indarr.slice(awal,akhir,)\n\tlet indtyar = new Uint16Array(indsli)\n\tdv.queue.writeBuffer(indbuf,awal*6*2,indtyar,)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "156",
					"g": "156",
					"b": "156",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "",
			"visible": false,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\n//voronoi\nlet vo =\no3dv.vo = {}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "99",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nvo.newvoro = i=>{\n\tlet a = vorotailarr\n\t\n\ta.splice(i,0,\n\t\ti && a[i-1],\n\t)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "222",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nvo.deletevoro = i=>{\n\tlet head = i && vorotailarr[i-1]\n\tlet tail = vorotailarr[i]\n\tlet len = tail-head\n\tlet pos = voroposarr.splice(head*2,len*2,)\n\tlet color = vorocolorarr.splice(head*1,len*1,)\n\tfor(let j = i;j < vorotailarr.length;j++){\n\t\tvorotailarr[j] -= len\n\t}\n\tvorotailarr.splice(i,1,)\n\t\n\treturn {pos,color,}\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "222",
					"b": "222",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nvo.geservoro = (ilama,ibaru,)=>{\n/*========\n\tlet head = ilama && vorotailarr[ilama-1]\n\tlet tail = vorotailarr[ilama]\n\tlet len = tail-head\n\tlet pos = voroposarr.splice(head*2,len*2,)\n\tlet color = vorocolorarr.splice(head*1,len*1,)\n\t\n\tfor(let i = ilama;i < vorotailarr.length;i++){\n\t\tvorotailarr[i] -= len\n\t}\n\tvorotailarr.splice(ilama,1,)\n--------*/\n\tlet h = vo.deletevoro(ilama)//hasil\n\tlet pos = h.pos\n\tlet color - h.color\n\t\n\t//\n\tvorotailarr.splice(ibaru,0,ibaru && vorotailarr[ibaru-1],)\n\tfor(let i = ibaru;i < vorotailarr.length;i++){\n\t\tvorotailarr[i] += len\n\t}\n\thead = ibaru && vorotailarr[ibaru-1]\n\tvoroposarr.splice(head*2,0,...pos,)\n\tvorocolorarr.splice(head*1,0,...color,)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "99",
					"g": "177",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nvo.setvoroall = data=>{\n/*========\n\tdata = [\n\t\t[\n\t\t\t[x,y,color,],\n\t\t\t...\n\t\t],\n\t\t...\n\t]\n--------*/\n\tlet vorotaillen = vorotailarr.length\n\tlet voroposlen = voroposarr.length\n\tlet vorocolorlen = vorocolorarr.length\n\tru.habisarr(vorotailarr)\n\tru.habisarr(voroposarr)\n\tru.habisarr(vorocolorarr)\n\tfor(let i_voro in data){\n\t\tlet voro = data[i_voro = +i_voro]\n\t\t//vorotailarr[i_voro] = i_voro?vorotailarr[i_voro-1]:0\n\t\tvorotailarr.push(i_voro?vorotailarr[i_voro-1]:0)\n\t\tfor(let i_seed in voro){\n\t\t\tlet seed = voro[i_seed = +i_seed]\n\t\t\tlet i = vorotailarr[i_voro]\n\t\t\tvoroposarr.push(seed[0])\n\t\t\tvoroposarr.push(seed[1])\n\t\t\tvorocolorarr.push(seed[2])\n/*========\n\t\t\tvoroposarr[i*2+0] = seed[0]\n\t\t\tvoroposarr[i*2+1] = seed[1]\n\t\t\tvorocolorarr[i] = seed[2]\n--------*/\n\t\t\tvorotailarr[i_voro]++\n\t\t}\n\t}\n\tlet vorotailtyar = new Uint32Array(Math.max(vorotaillen,vorotailarr.length,))\t;vorotailtyar.set(vorotailarr)\n\tlet voropostyar = new Float32Array(Math.max(voroposlen,voroposarr.length,))\t;voropostyar.set(voroposarr)\n\tlet vorocolortyar = new Uint32Array(Math.max(vorocolorlen,vorocolorarr.length,))\t;vorocolortyar.set(vorocolorarr)\n\t\n\tdv.queue.writeBuffer(vorotailbuf,0, vorotailtyar,)\n\tdv.queue.writeBuffer(voroposbuf,0,voropostyar,)\n\tdv.queue.writeBuffer(vorocolorbuf,0,vorocolortyar,)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "222",
					"b": "177",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nvo.newseed = (ivoro,iseed,)=>{//iseed lokal dalam voro\n\tfor(let i = ivoro;i < vorotailarr.length;i++){\n\t\tvorotailarr[i]++\n\t}\n\t\n\tlet head = ivoro && vorotailarr[ivoro-1]\n//let tail = vorotailarr[ivoro]\n\tlet iseedglo = head+iseed\n\t\n\tvoroposarr.splice(iseedglo *2,0,\t0,0,)\n\tvorocolorarr.splice(iseedglo *1,0,\t0,)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "200",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nvo.setpos = (itail,ipos,x,y,)=>{\n\t\n\t//itail -> index tail\n\t//ipos -> index lokal\n\t\n\tlet i = itail?vorotailarr[itail-1]:0\n\ti += ipos\n\ti *= 2\n\t\n\tvoroposarr[i+0] = x\n\tvoroposarr[i+1] = y\n\tdv.queue.writeBuffer(\n\t\tvoroposbuf,\n\t\ti*4, //i*xy*byte\n\t\tnew Float32Array([x,y,]),\n\t)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "177",
					"g": "177",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nvo.setcolor = (itail,icol,color,)=>{\n\t\n\t//itail -> index tail\n\t//icol-> index lokal\n\t\n\tlet i = itail?vorotailarr[itail-1]:0\n\ti += icol//index global\n\t\n\tvorocolorarr[i] = color\n\tdv.queue.writeBuffer(\n\t\tvorocolorbuf,\n\t\ti*4, //i*byte\n\t\tnew Uint32Array([color]),\n\t)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "177",
					"b": "177",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nvo.deleteseed = (ivoro,iseed,)=>{//iseed lokal dalam voro\n\tfor(let i = ivoro;i < vorotailarr.length;i++){\n\t\tvorotailarr[i]--\n\t}\n\t\n\tlet head = ivoro && vorotailarr[ivoro-1]\n\tlet iseedglo = head+iseed\n\t\n\tvoroposarr.splice(iseedglo *2,2,)\n\tvorocolorarr.splice(iseedglo *1,1,)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "177",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nvo.updvorobuf = ()=>{//coba ga pake param:awal,akhir,\n\tlet vorotailtyar = new Uint32Array(vorotailarr)\n\tdv.queue.writeBuffer(vorotailbuf,0,vorotailtyar,)\n\t\n\tlet voropostyar = new Float32Array(voroposarr)\n\tdv.queue.writeBuffer(voroposbuf,0,voropostyar,)\n\tlet vorocolortyar = new Uint32Array(vorocolorarr)\n\tdv.queue.writeBuffer(vorocolorbuf,0,vorocolortyar,)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "",
			"visible": false,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\n//seed\n/*========\nvo.newseed = ()=>{\n\tvoroposarr.push(0)\n\tvoroposarr.push(0)\n\t\n\tvorocolorarr.push(0)\n}\n--------*/\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "0",
					"g": "199",
					"b": "199",
					"frame": "0"
				}
			]
		},
		{
			"text": "\n/*========\nvo.deleteseed = ()=>{\n\tvoroposarr.pop()\n\tvoroposarr.pop()\n\t\n\tvorocolorarr.pop()\n}\n--------*/\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "255",
					"g": "200",
					"b": "255",
					"frame": "0"
				}
			]
		},
		{
			"text": "\nvo.setseed = (iseed,x,y,color,)=>{\n\tvoroposarr[iseed*2+0] = x\n\tvoroposarr[iseed*2+1] = y\n\t\n\tvorocolorarr[iseed] = color\n\tdv.queue.writeBuffer(voroposbuf,iseed*2*4,new Float32Array([x,y,]),)\n\tdv.queue.writeBuffer(vorocolorbuf,iseed*4,new Uint32Array([color,]),)\n}\n",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "196",
					"g": "196",
					"b": "255",
					"frame": "0"
				}
			]
		}
	],
	[
		{
			"text": "})().then(aa=>o3dv.javascript_ui?.(aa))",
			"visible": true,
			"time": "0",
			"speed": "1",
			"running": false,
			"color": [
				{
					"r": "0",
					"g": "255",
					"b": "255",
					"frame": "0"
				}
			]
		}
	]
]