bl_info = {
    "name": "Export Mesh with Vertex and Index Data",
    "author": "Your Name",
    "version": (1, 0),
    "blender": (4, 3, 0),
    "location": "File > Export",
    "description": "Exports mesh vertex and index data to .bin files and generates a WebGPU-compatible .json metadata file",
    "category": "Import-Export",
}
import bpy
from bpy.types import TOPBAR_MT_file_export
from .exporter import ExportMeshWithVertexAndIndexData

# Registration
def register():
    bpy.utils.register_class(ExportMeshWithVertexAndIndexData)
    # Add the operator to the File > Export menu
    TOPBAR_MT_file_export.append(menu_func_export)

def unregister():
    bpy.utils.unregister_class(ExportMeshWithVertexAndIndexData)
    # Remove the operator from the File > Export menu
    TOPBAR_MT_file_export.remove(menu_func_export)

# Function to add the operator to the export menu
def menu_func_export(self, context):
    self.layout.operator(ExportMeshWithVertexAndIndexData.bl_idname, text="Export Mesh Vertex and Index Data")

if __name__ == "__main__":
    register()