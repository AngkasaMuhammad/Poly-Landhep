def generate_metadata(vertex_buffer_stride, num_indices):
	"""Generates the JSON metadata for the vertex and index buffers."""
	metadata = {
		"vertexBuffers": [
			{
				"arrayStride": vertex_buffer_stride,
				"stepMode": "vertex",
				"attributes": []
			}
		],
		"indexBuffer": {
			"format": "uint16",
			"byteLength": num_indices * 2  # Each index is 2 bytes (uint16)
		}
	}

	return metadata