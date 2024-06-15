import bpy

def cekmatrix(node,v0,v1,v2,):
	links0 = node.inputs[v0].links
	links1 = node.inputs[v1].links
	links2 = node.inputs[v2].links
	if (
		len(links0) == 0 or
		len(links1) == 0 or
		len(links2) == 0
	):
		print(node.name+' ada yang kosong. Semua harus terhubung')
		return ''
	
	node0 = links0[0].from_node
	node1 = links1[0].from_node
	node2 = links2[0].from_node
	if (
		node0 != node1 or
		node0 != node2
	):
		print(node.name+' socket tidak sama.')
		return ''
	return node0.name
#for mate in bpy.data.materials:
mate = bpy.data.materials[0]
if True:
	sn = {
		'color':{},
		'matrix':{},
		'mathcurve':{},
		'mathcurveoutput':[],
	}
	for inp in mate.node_tree.nodes['colorgate'].inputs:
		sn['mathcurveoutput'].append(inp.links[0].from_node.name)
	nodearr = mate.node_tree.nodes 
	for node in nodearr:
		if node.type == 'GROUP':
			ism = node.node_tree.name == 'matrix'
			if node.node_tree.name == 'color':
				deva = node.inputs[0].default_value
				sn['color'][node.name] = deva
			elif ism:
				v0 = node.inputs[0].default_value
				v1 = node.inputs[1].default_value
				v2 = node.inputs[2].default_value
				matku = [
					v0[0],v0[1],v0[2],
					v1[0],v1[1],v1[2],
					v2[0],v2[1],v2[2],
				]
				
				sn['matrix'][node.name] = matku
			elif node.node_tree.name == 'mathcurve':
				macu = {
					'A':None,
					'B':None,
					'matrix':'',
					'curveid':0,
				}
				
				linksA = node.inputs['A'].links
				linksB = node.inputs['B'].links
				if len(linksA) != 0:
					macu['A'] = linksA[0].from_node.name
				if len(linksB) != 0:
					macu['B'] = linksB[0].from_node.name
				
				macu['matrix'] = cekmatrix(node,1,2,3,)
				macu['curveid'] = node.inputs['pilih'].default_value
				
				sn['mathcurve'][node.name] = macu
	#print(sn)
	mate['shadernode'] = sn

#geonode matrix
for obj in bpy.data.objects:
	geomat = []
	mod = None
	for mod in obj.modifiers:
		if mod.type == 'NODES':
			print(mod.node_group.name)
			break
	if not(mod):
		continue
	
	#cari node akhir
	rantai = []
	for node in mod.node_group.nodes:
		if node.type == 'GROUP' and node.node_tree.name == 'pilihmat':
			print('okkkk')
			
			out = node.outputs
			out0 = out['v0']
			out1 = out['v1']
			out2 = out['v2']
			link0 = out0.links[0].to_node if len(out0.links) else None
			link1 = out1.links[0].to_node if len(out1.links) else None
			link2 = out2.links[0].to_node if len(out2.links) else None
			if link0 != link1 or link0 != link2:
				raise Exception('Node tidak sama, soket harus terhubung ke node yang sama. '+node.name)
			
			#-------------
			if link0 and link0.type == 'GROUP_OUTPUT':
				rantai.insert(0,node,)
	
	for unused in mod.node_group.nodes:#sampe sini, rantai
		node = rantai[0] 
		inp = node.inputs
		inp0 = inp['v0']
		inp1 = inp['v1']
		inp2 = inp['v2']
		link0 = inp0.links[0].from_node if len(inp0.links) else None
		link1 = inp1.links[0].from_node if len(inp1.links) else None
		link2 = inp2.links[0].from_node if len(inp2.links) else None
		if link0 != link1 or link0 != link2:
			raise Exception('Node tidak sama, soket harus terhubung ke node yang sama. '+node.name)
		v3 = inp['v3'].default_value
		v4 = inp['v4'].default_value
		v5 = inp['v5'].default_value
		
		geomat.insert(0,[
			v3[0],v3[1],v3[2],
			v4[0],v4[1],v4[2],
			v5[0],v5[1],v5[2],
		],)
		if not(link0):
			print(rantai)
			break
		rantai.insert(0,link0,)
	
	obj['geomat'] = geomat
	print(obj['maxinstance'])

