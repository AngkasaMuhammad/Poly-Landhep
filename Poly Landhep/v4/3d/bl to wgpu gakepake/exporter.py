import bpy
from bpy_extras.io_utils import ExportHelper
from .vertex import write_vertex_data
from .index import write_index_data
from .metadata import generate_metadata

class ExportMeshWithVertexAndIndexData(bpy.types.Operator, ExportHelper):
    """Export mesh vertex and index data to .bin files and generate a WebGPU-compatible .json metadata file"""
    bl_idname = "export_mesh.vertex_and_index_data"
    bl_label = "Export Mesh Vertex and Index Data"
    
    filename_ext = ".json"

    def execute(self, context):
        # Get the active object
        obj = bpy.context.active_object
        
        if obj is None or obj.type != 'MESH':
            self.report({'ERROR'}, "Please select a mesh object.")
            return {'CANCELLED'}
        
        # Ensure we are working with the evaluated version of the object (with modifiers applied)
        depsgraph = bpy.context.evaluated_depsgraph_get()
        evaluated_obj = obj.evaluated_get(depsgraph)
        
        # Get the mesh data from the evaluated object
        mesh = evaluated_obj.to_mesh()

        # Prepare file paths
        base_filepath = self.filepath.replace(".json", "")
        vertices_filepath = f"{base_filepath}_vertices.bin"
        indices_filepath = f"{base_filepath}_indices.bin"
        json_filepath = self.filepath

        # Write vertex data to binary file
        vertex_buffer_stride = write_vertex_data(mesh, vertices_filepath)

        # Write index data to binary file
        num_indices = write_index_data(mesh, indices_filepath)

        # Generate metadata
        metadata = generate_metadata(vertex_buffer_stride, num_indices)

        # Write JSON metadata file
        with open(json_filepath, 'w') as json_file:
            json.dump(metadata, json_file, indent=4)
        
        print(f"Exported vertex data to {vertices_filepath}")
        print(f"Exported index data to {indices_filepath}")
        print(f"Metadata written to {json_filepath}")

        # Free the temporary mesh created by evaluated_obj.to_mesh()
        evaluated_obj.to_mesh_clear()

        return {'FINISHED'}