import struct
import bmesh

def write_index_data(mesh, filepath):
	# Triangulate the mesh
	bm = bmesh.new()
	bm.from_mesh(mesh)
	bmesh.ops.triangulate(bm, faces=bm.faces[:])
	bm.to_mesh(mesh)
	bm.free()

	# Write triangulated index data
	num_indices = 0
	with open(filepath, 'wb') as f:
		for polygon in mesh.polygons:
			for loop_index in polygon.loop_indices:
				f.write(struct.pack('H', mesh.loops[loop_index].vertex_index))  # 'H' for unsigned short (uint16)
				num_indices += 1

	return num_indices