"""
Shared vocabulary for the freight scene, authored in Blender and shipped as glTF.

The web scene (components/scene/freight-scene.ts) built every shape from a single
BoxGeometry, which is why it reads flat: an unbevelled cube has no edge for light
to catch, so form only ever comes from flat-shaded facets. Everything here exists
to fix that one thing - real bevels, shared materials, and a named hierarchy the
runtime can still drive frame by frame.

THE NAMING CONTRACT IS LOad-BEARING. The runtime does not re-create geometry; it
looks parts up by name and mutates them exactly as it does today. Rename a part
here and the corresponding animation in freight-scene.ts stops finding it. Names
are `station.part` or `station.part.index`, lowercase, dot-separated.

Blender is Z-up, three.js is Y-up. Author in Blender's convention; the exporter's
`export_yup` rotates on the way out. Camera and light positions given in three.js
coordinates are converted by `to_blender()` so both files can quote the same
numbers.
"""

import math
import bpy

# --- palette -----------------------------------------------------------------
# Hex values are copied verbatim from freight-scene.ts. Do not drift them; the
# runtime recolours some of these materials per frame and the two must agree.
SURFACE = 0xE3E3E8
SURFACE_2 = 0xD8D8DE
ROUTE = 0xD2D2D6
INK = 0x121317
INK_4 = 0xA2A2A2
VIOLET = 0x6F5197

_materials: dict[str, bpy.types.Material] = {}


def to_blender(x: float, y: float, z: float) -> tuple[float, float, float]:
    """three.js (Y-up) -> Blender (Z-up)."""
    return (x, -z, y)


def srgb_to_linear(c: float) -> float:
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def clay(name: str, hexcol: int, rough: float = 0.72) -> bpy.types.Material:
    """One material per name, reused everywhere.

    The web scene called `new MeshStandardMaterial` inside `slab()`, so 31 boxes
    carried 31 materials and 31 draw calls. Caching by name here means the export
    carries a handful of materials and the runtime batches.
    """
    if name in _materials:
        return _materials[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    r, g, b = (
        srgb_to_linear((hexcol >> 16 & 255) / 255),
        srgb_to_linear((hexcol >> 8 & 255) / 255),
        srgb_to_linear((hexcol & 255) / 255),
    )
    bsdf.inputs["Base Color"].default_value = (r, g, b, 1.0)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = 0.0
    _materials[name] = m
    return m


def slab(
    name: str,
    size: tuple[float, float, float],
    loc: tuple[float, float, float],
    mat: bpy.types.Material,
    bevel: float = 0.018,
    segments: int = 2,
    parent: bpy.types.Object | None = None,
) -> bpy.types.Object:
    """A bevelled box. `size` and `loc` are three.js (w, h, d) / (x, y, z).

    The bevel is the entire point of moving to Blender. 18 mm at this scale is
    about a hand's width of chamfer on a building - enough for the key light to
    draw an edge, small enough that the silhouette stays architectural.
    """
    w, h, d = size
    bpy.ops.mesh.primitive_cube_add(size=1, location=to_blender(*loc))
    o = bpy.context.object
    o.name = name
    o.scale = to_blender(w, h, d)
    o.scale = (abs(o.scale[0]), abs(o.scale[1]), abs(o.scale[2]))
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0:
        # Clamp so the chamfer can never eat a thin part - a 60 mm invoice plate
        # with an 18 mm bevel is a lozenge, not a plate.
        width = min(bevel, min(w, h, d) * 0.28)
        b = o.modifiers.new("bevel", "BEVEL")
        b.width, b.segments, b.limit_method = width, segments, "ANGLE"
        b.angle_limit = math.radians(30)
        b.harden_normals = True
    o.data.materials.append(mat)
    bpy.ops.object.shade_auto_smooth(angle=math.radians(35))
    if parent is not None:
        o.parent = parent
        o.matrix_parent_inverse = parent.matrix_world.inverted()
    return o


def group(name: str, loc: tuple[float, float, float] = (0, 0, 0)) -> bpy.types.Object:
    """An empty standing in for THREE.Group. Exports as a glTF node with no mesh."""
    e = bpy.data.objects.new(name, None)
    e.empty_display_size = 0.4
    e.location = to_blender(*loc)
    bpy.context.scene.collection.objects.link(e)
    return e


def reset() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    _materials.clear()


# --- preview -----------------------------------------------------------------
# The preview render exists to judge FORM, not colour. Final appearance is decided
# by three.js - ACES tone mapping, RoomEnvironment IBL, GTAO - none of which
# Blender reproduces. Read these images for silhouette, proportion and how the
# bevels catch light; ignore the exact greys.

def stage_camera(ortho: float = 26.0, target: tuple[float, float, float] = (0, 0, 0)):
    """The web scene's camera: orthographic, 35.264 deg elevation, 45 deg turn.

    Offset (20, 16.33, 20) in three.js terms - atan(16.33 / sqrt(20^2 + 20^2))
    is 30 deg, the isometric angle freight-scene.ts uses.
    """
    cam_d = bpy.data.cameras.new("preview.camera")
    cam_d.type = "ORTHO"
    cam_d.ortho_scale = ortho
    cam = bpy.data.objects.new("preview.camera", cam_d)
    bpy.context.scene.collection.objects.link(cam)
    ox, oy, oz = to_blender(20.0, 16.33, 20.0)
    tx, ty, tz = to_blender(*target)
    cam.location = (tx + ox, ty + oy, tz + oz)
    cam.rotation_euler = (math.atan2(math.hypot(ox, oy), oz), 0.0, math.radians(45))
    bpy.context.scene.camera = cam
    return cam


def stage_light() -> None:
    """Matches the runtime key light at three.js (15, 24, 11), plus fill."""
    key_d = bpy.data.lights.new("preview.key", "SUN")
    key_d.energy = 3.2
    key_d.angle = math.radians(9)
    key = bpy.data.objects.new("preview.key", key_d)
    bpy.context.scene.collection.objects.link(key)
    kx, ky, kz = to_blender(15.0, 24.0, 11.0)
    key.rotation_euler = (math.atan2(math.hypot(kx, ky), kz), 0.0, math.atan2(ky, kx) + math.pi / 2)
    w = bpy.data.worlds.new("preview.world")
    w.use_nodes = True
    w.node_tree.nodes["Background"].inputs[0].default_value = (0.86, 0.86, 0.88, 1)
    w.node_tree.nodes["Background"].inputs[1].default_value = 0.55
    bpy.context.scene.world = w


def render_preview(path: str, width: int = 1280, height: int = 900, samples: int = 64) -> None:
    sc = bpy.context.scene
    sc.render.engine = "BLENDER_EEVEE"
    sc.render.resolution_x, sc.render.resolution_y = width, height
    sc.render.film_transparent = False
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "AgX - Base Contrast"
    try:
        sc.eevee.taa_render_samples = samples
    except AttributeError:
        pass
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)


# --- export ------------------------------------------------------------------

def export_glb(path: str, draco_level: int = 6) -> int:
    """Draco-compressed GLB, hierarchy intact.

    `export_apply` bakes modifiers (the bevels) but leaves the object tree alone,
    so every named part survives as its own glTF node and the runtime can still
    find and move it. Never enable mesh joining here.
    """
    for o in bpy.context.scene.objects:
        o.select_set(o.name.split(".")[0] != "preview")
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_draco_mesh_compression_enable=draco_level > 0,
        export_draco_mesh_compression_level=max(draco_level, 1),
        export_draco_position_quantization=12,
        export_draco_normal_quantization=8,
        export_cameras=False,
        export_lights=False,
        export_extras=False,
    )
    import os
    return os.path.getsize(path)


def tri_count() -> int:
    dg = bpy.context.evaluated_depsgraph_get()
    n = 0
    for o in bpy.context.scene.objects:
        if o.type != "MESH":
            continue
        m = o.evaluated_get(dg).to_mesh()
        m.calc_loop_triangles()
        n += len(m.loop_triangles)
        o.evaluated_get(dg).to_mesh_clear()
    return n


def turn(o: bpy.types.Object, y: float) -> bpy.types.Object:
    """Rotate about the vertical axis, given in three.js `rotation.y` radians.

    A Y-up turn maps to a Z-up turn with the sign preserved, so the number can be
    copied straight across from freight-scene.ts.
    """
    o.rotation_euler = (o.rotation_euler[0], o.rotation_euler[1], y)
    return o


def cyl(
    name: str,
    radius: float,
    depth: float,
    loc: tuple[float, float, float],
    mat: bpy.types.Material,
    axis: str = "x",
    verts: int = 20,
    bevel: float = 0.012,
    parent: bpy.types.Object | None = None,
) -> bpy.types.Object:
    """A cylinder, for the handful of things a box cannot fake.

    Wheels are the obvious one: the web scene used 0.16 x 0.28 x 1.2 boxes, and
    a rectangular wheel is the single clearest tell that a scene is placeholder
    geometry. 20 sides is plenty at this camera distance.
    """
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius, depth=depth, vertices=verts, location=to_blender(*loc)
    )
    o = bpy.context.object
    o.name = name
    # Cylinders are born along Blender's Z. Lay them down onto the requested
    # three.js axis.
    if axis == "x":
        o.rotation_euler = (0.0, math.radians(90), 0.0)
    elif axis == "z":
        o.rotation_euler = (math.radians(90), 0.0, 0.0)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
    if bevel > 0:
        b = o.modifiers.new("bevel", "BEVEL")
        b.width, b.segments, b.limit_method = min(bevel, radius * 0.3), 2, "ANGLE"
        b.angle_limit = math.radians(40)
        b.harden_normals = True
    o.data.materials.append(mat)
    bpy.ops.object.shade_auto_smooth(angle=math.radians(35))
    if parent is not None:
        o.parent = parent
        o.matrix_parent_inverse = parent.matrix_world.inverted()
    return o


def frame_all(pad: float = 1.35) -> tuple[tuple[float, float, float], float]:
    """Bounding box of everything built, as a three.js centre and an ortho scale.

    Stations differ a lot in size - the tower is 5 m tall, the board 2.8 - so a
    fixed ortho_scale either crops one or strands the other in white space.
    """
    xs, ys, zs = [], [], []
    for o in bpy.context.scene.objects:
        if o.type != "MESH":
            continue
        for corner in o.bound_box:
            wx, wy, wz = o.matrix_world @ __import__("mathutils").Vector(corner)
            xs.append(wx)
            ys.append(wy)
            zs.append(wz)
    if not xs:
        return (0.0, 0.0, 0.0), 10.0
    cx, cy, cz = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, (min(zs) + max(zs)) / 2
    span = max(max(xs) - min(xs), max(ys) - min(ys), max(zs) - min(zs))
    # Blender (X, Y, Z) back to three.js (x, y, z).
    return (cx, cz, -cy), span * pad
