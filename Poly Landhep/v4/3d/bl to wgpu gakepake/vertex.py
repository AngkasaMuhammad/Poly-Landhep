import struct

def write_vertex_data(mesh, filepath):
	# Calculate offsets and formats for attributes
	current_offset = 0
	array_stride = 0
	with open(filepath, 'wb') as vf:
		for attribute in mesh.attributes:
			if attribute.domain == 'POINT':  # Only export point attributes (per-vertex)
				# Determine the format and size of the attribute
				attr_format, attr_size = get_webgpu_format_and_size(attribute.data_type)
				
				# Update the buffer layout stride
				array_stride += attr_size
				
				# Write attribute data based on its type
				if attribute.data_type == 'FLOAT':  # Single float values
					for data in attribute.data:
						vf.write(struct.pack('f', data.value))
				elif attribute.data_type == 'INT':  # 32-bit integers
					for data in attribute.data:
						vf.write(struct.pack('i', data.value))
				elif attribute.data_type == 'FLOAT_VECTOR':  # 3D vectors
					for data in attribute.data:
						vector = data.vector
						vf.write(struct.pack('fff', vector[0], vector[1], vector[2]))
				elif attribute.data_type == 'FLOAT_COLOR':  # RGBA colors (floats)
					for data in attribute.data:
						color = data.color
						vf.write(struct.pack('ffff', color[0], color[1], color[2], color[3]))
				elif attribute.data_type == 'BYTE_COLOR':  # RGBA colors (bytes)
					for data in attribute.data:
						color = data.color
						vf.write(struct.pack('BBBB', int(color[0] * 255), int(color[1] * 255), int(color[2] * 255), int(color[3] * 255)))
				elif attribute.data_type == 'BOOLEAN':  # Boolean values
					for data in attribute.data:
						vf.write(struct.pack('?', data.value))  # '?' for boolean
				elif attribute.data_type == 'FLOAT2':  # 2D vectors
					for data in attribute.data:
						vector = data.vector
						vf.write(struct.pack('ff', vector[0], vector[1]))
				elif attribute.data_type == 'INT8':  # 8-bit signed integers
					for data in attribute.data:
						vf.write(struct.pack('b', data.value))  # 'b' for signed char
				elif attribute.data_type == 'INT32_2D':  # 2D integer vectors
					for data in attribute.data:
						vector = data.vector
						vf.write(struct.pack('ii', vector[0], vector[1]))
				elif attribute.data_type == 'QUATERNION':  # Quaternions
					for data in attribute.data:
						quaternion = data.vector
						vf.write(struct.pack('ffff', quaternion[0], quaternion[1], quaternion[2], quaternion[3]))
				elif attribute.data_type == 'FLOAT4X4':  # 4x4 matrices
					for data in attribute.data:
						matrix = data.value
						for row in matrix:
							vf.write(struct.pack('ffff', row[0], row[1], row[2], row[3]))

	return array_stride

def get_webgpu_format_and_size(data_type):
	"""Returns the WebGPU format and size in bytes for a given data type."""
	format_map = {
		'FLOAT': ('float32', 4),
		'INT': ('sint32', 4),
		'FLOAT_VECTOR': ('float32x3', 12),
		'FLOAT_COLOR': ('float32x4', 16),
		'BYTE_COLOR': ('unorm8x4', 4),
		'BOOLEAN': ('uint8', 1),
		'FLOAT2': ('float32x2', 8),
		'INT8': ('sint8', 1),
		'INT32_2D': ('sint32x2', 8),
		'QUATERNION': ('float32x4', 16),
		'FLOAT4X4': ('float32x16', 64),
	}
	return format_map.get(data_type, ('unknown', 0))