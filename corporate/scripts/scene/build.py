"""
Builds the freight-scene stations and writes them out as glTF.

    npm run scene:build -- --station board --out public/scene --preview
    npm run scene:build -- --station all   --out public/scene --preview

Each station is one GLB, so the runtime can fetch only what a stop needs and one
station can be re-authored without re-shipping the other four.

THE ANIMATED PARTS ARE A CONTRACT. freight-scene.ts does not re-create geometry;
it looks parts up by name and drives them frame by frame. For those parts the
name, the size and - critically - the origin must match what the runtime assumes,
because `scale` and `rotation` are applied about the object's own centre:

    board.row.{0,1,2}   scale.x, material colour; row 1 also moves in z
    hall.door.{0..3}    scale.y from centre, position.y
    dock.trailer        an empty; position.x and rotation.y
    dock.lip            rotation.x
    office.cap          uniform scale
    office.plate.{0,1,2}  position, rotation, material opacity, visibility
    tower.mast          rotation.y
    tower.crown         position.y

`slab()` and `cyl()` both centre the object on the location given, which is what
three.js does, so origins line up as long as parts are not re-parented after the
fact. Everything else in a station is free to change.
"""

import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib  # noqa: E402
from lib import SURFACE, SURFACE_2, INK_4, VIOLET, clay, slab, cyl, group, turn  # noqa: E402


def _pad(name: str, w: float, d: float, parent, kerb: bool = True) -> None:
    """The concrete apron every station stands on, plus its kerb.

    The apron floats 2 cm clear of the ground plane. The old scene put its
    underside at y=0 alongside the ground and the two coplanar faces z-fought
    into a dashed black speckle that read, for a while, as AO noise.
    """
    stone = clay("surface.2", SURFACE_2, 0.85)
    slab(f"{name}.apron", (w, 0.16, d), (0, 0.1, 0), stone, bevel=0.03, parent=parent)
    if not kerb:
        return
    for i, (dx, dz, kw, kd) in enumerate(
        [
            (0, d / 2 + 0.02, w + 0.12, 0.1),
            (0, -(d / 2 + 0.02), w + 0.12, 0.1),
            (w / 2 + 0.06, 0, 0.1, d + 0.14),
            (-(w / 2 + 0.06), 0, 0.1, d + 0.14),
        ]
    ):
        slab(f"{name}.kerb.{i}", (kw, 0.09, kd), (dx, 0.145, dz), stone, bevel=0.02, parent=parent)


def board() -> None:
    """Stop 1 - the load board. A roadside gantry showing three results.

    Six unbevelled boxes became a plinth, a post, a bracket carrying the panel
    from behind, a bezel, and three rows that stand proud of the face instead of
    reading as slots cut into it.
    """
    g = group("board")
    body = clay("surface", SURFACE)
    stone = clay("surface.2", SURFACE_2, 0.85)
    trim = clay("ink.4", INK_4, 0.6)
    _pad("board", 4.4, 3.4, g)

    slab("board.base", (0.72, 0.16, 0.72), (-0.6, 0.26, 0), stone, bevel=0.03, parent=g)
    slab("board.post", (0.26, 1.66, 0.26), (-0.6, 1.15, 0), stone, bevel=0.022, parent=g)
    # The bracket runs BEHIND the panel. On the first pass it sat in front and
    # poked through the face.
    turn(slab("board.arm", (1.0, 0.14, 0.12), (-0.2, 1.9, -0.14), stone, bevel=0.022, parent=g), -0.12)

    # Bezel behind, face in front: two plates 4 cm apart give the panel a real
    # edge under the key light instead of a painted-on outline.
    turn(slab("board.screen.frame", (2.16, 1.42, 0.1), (0.2, 1.95, -0.04), stone, bevel=0.026, parent=g), -0.12)
    turn(slab("board.screen", (2.0, 1.26, 0.08), (0.2, 1.95, 0.045), body, bevel=0.02, parent=g), -0.12)
    turn(slab("board.screen.header", (2.0, 0.09, 0.04), (0.2, 2.46, 0.09), trim, bevel=0.012, parent=g), -0.12)

    # Three result rows, standing 6 cm off the face. Each keeps its own material:
    # the runtime lights them one at a time, and a shared material would recolour
    # all three at once.
    # Rows stand 9 cm off the face and are deeper than they are tall, so the key
    # light puts a highlight on the top edge of each. At 0.06 deep they read as
    # slots milled into the panel instead of results sitting on it.
    for i in range(3):
        y = 2.24 - i * 0.4
        turn(slab(f"board.row.{i}", (1.5, 0.13, 0.09), (0.28, y, 0.11), clay(f"board.row.{i}", 0xC6C6CD), bevel=0.02, parent=g), -0.12)
        turn(slab(f"board.chip.{i}", (0.16, 0.16, 0.08), (-0.6, y, 0.11), clay(f"board.chip.{i}", INK_4, 0.5), bevel=0.018, parent=g), -0.12)


def hall() -> None:
    """Stop 2 - the hall. Four bay doors roll up as the load arrives.

    The doors were four floating panels. They now sit in real openings: a recessed
    reveal behind, jambs either side, a lintel above and a track over that, none
    of which move. The moving panel keeps its name, size and centre.
    """
    g = group("hall")
    body = clay("surface", SURFACE)
    stone = clay("surface.2", SURFACE_2, 0.85)
    trim = clay("ink.4", INK_4, 0.6)
    _pad("hall", 4.6, 3.6, g)

    slab("hall.body", (3.8, 1.1, 2.6), (0, 0.73, 0), body, bevel=0.03, parent=g)
    # Overhangs the body, so no two faces are coplanar.
    slab("hall.parapet", (3.92, 0.12, 2.72), (0, 1.34, 0), stone, bevel=0.025, parent=g)

    for i in range(3):
        x = -1.1 + i * 1.1
        slab(f"hall.unit.{i}", (0.7, 0.3, 0.7), (x, 1.42, -0.3), stone, bevel=0.025, parent=g)
        slab(f"hall.unit.vent.{i}", (0.5, 0.05, 0.5), (x, 1.6, -0.3), trim, bevel=0.014, parent=g)

    for i in range(4):
        x = -1.35 + i * 0.9
        # The opening: a dark reveal set back into the wall, so an open door has
        # somewhere to have gone.
        slab(f"hall.reveal.{i}", (0.55, 0.66, 0.06), (x, 0.47, 1.26), clay("reveal", 0x9A9AA0, 0.9), bevel=0.0, parent=g)
        slab(f"hall.jamb.{i}.l", (0.07, 0.78, 0.12), (x - 0.31, 0.5, 1.32), stone, bevel=0.018, parent=g)
        slab(f"hall.jamb.{i}.r", (0.07, 0.78, 0.12), (x + 0.31, 0.5, 1.32), stone, bevel=0.018, parent=g)
        slab(f"hall.lintel.{i}", (0.69, 0.09, 0.14), (x, 0.85, 1.33), stone, bevel=0.018, parent=g)
        slab(f"hall.track.{i}", (0.62, 0.06, 0.1), (x, 0.95, 1.3), trim, bevel=0.014, parent=g)
        # ANIMATED: scale.y about the centre, plus position.y. Do not move the
        # origin and do not change the 0.55 x 0.62 x 0.06 size.
        d = slab(f"hall.door.{i}", (0.55, 0.62, 0.06), (x, 0.47, 1.32), stone, bevel=0.014, parent=g)
        for k in range(3):
            slab(f"hall.door.{i}.rib.{k}", (0.5, 0.03, 0.02), (x, 0.28 + k * 0.19, 1.36), trim, bevel=0.008, parent=d)


def dock() -> None:
    """Stop 3 - the dock. A trailer reverses on and the lip drops onto it.

    The web scene's proportions did not survive being modelled. Its trailer floor
    sat at y=0.3 while the dock lip sat at 1.14, so the lip dropped onto thin air
    and the load would have been unloaded a metre above the deck. With boxes for
    wheels nobody could see it; with round ones it is the first thing you notice.

    So the trailer now stands at dock height - floor at 1.14, wheels 0.72 across
    carrying it - and the shed grew to 2 m so the building is taller than the
    truck backed into it. None of that touches the contract: the runtime moves
    `dock.trailer` as a whole and rotates `dock.lip`, and both keep their names,
    their origins and the positions the runtime lerps between.
    """
    g = group("dock")
    body = clay("surface", SURFACE)
    stone = clay("surface.2", SURFACE_2, 0.85)
    trim = clay("ink.4", INK_4, 0.6)
    rubber = clay("rubber", 0x3A3A40, 0.9)
    _pad("dock", 4.8, 3.6, g)

    slab("dock.shed", (2.6, 2.0, 2.2), (-0.8, 1.18, 0), body, bevel=0.03, parent=g)
    slab("dock.shed.parapet", (2.72, 0.12, 2.32), (-0.8, 2.24, 0), stone, bevel=0.024, parent=g)
    # The dock face: a recessed opening at deck height, so the lip leads somewhere.
    slab("dock.opening", (1.9, 0.86, 0.08), (-0.8, 1.62, 1.06), clay("reveal", 0x9A9AA0, 0.9), bevel=0.0, parent=g)
    for i, x in enumerate((-1.62, 0.02)):
        slab(f"dock.bumper.{i}", (0.3, 0.4, 0.14), (x, 1.0, 1.14), rubber, bevel=0.03, parent=g)
    # ANIMATED: rotation.x about the centre.
    slab("dock.lip", (2.6, 0.12, 0.5), (-0.8, 1.14, 1.0), stone, bevel=0.02, parent=g)

    # ANIMATED: the empty is moved and turned as a whole. It must sit at the
    # station origin so the runtime's lerp from x=3.4 to x=1.3 lands where it did.
    # The trailer's parts are shifted +0.5 in local x so that at the runtime's
    # parked position (x=1.3) its rear clears the shed's +x face at 0.5 instead
    # of ending up half inside the building.
    #
    # OPEN, for the wiring step: the source scene is self-contradictory here. The
    # lip is modelled on the +z face and rotation.x tips its outer edge down,
    # which is correct leveller behaviour only for a trailer arriving from +z -
    # but the runtime brings the trailer in along x. Either the runtime moves the
    # trailer in z, or the lip needs a different axis. Parked alongside is the
    # honest compromise until that is decided.
    t = group("dock.trailer")
    t.parent = g
    TX = 0.5
    slab("dock.trailer.chassis", (2.5, 0.14, 0.86), (TX, 1.0, 0), trim, bevel=0.018, parent=t)
    slab("dock.trailer.box", (2.4, 0.95, 1.1), (TX, 1.62, 0), body, bevel=0.028, parent=t)
    slab("dock.trailer.rail", (2.44, 0.07, 1.14), (TX, 2.07, 0), stone, bevel=0.018, parent=t)
    slab("dock.trailer.doors", (0.06, 0.84, 1.02), (TX - 1.22, 1.6, 0), stone, bevel=0.016, parent=t)
    for i, z in enumerate((-0.26, 0.26)):
        slab(f"dock.trailer.hinge.{i}", (0.05, 0.78, 0.06), (TX - 1.26, 1.6, z), trim, bevel=0.012, parent=t)
    slab("dock.trailer.flap", (0.05, 0.3, 0.9), (TX - 1.16, 0.72, 0), rubber, bevel=0.012, parent=t)

    slab("dock.trailer.cab", (0.78, 1.15, 1.05), (TX + 1.52, 1.42, 0), stone, bevel=0.035, parent=t)
    slab("dock.trailer.cab.glass", (0.05, 0.34, 0.86), (TX + 1.9, 1.72, 0), clay("glass", 0x8E8E96, 0.35), bevel=0.014, parent=t)
    slab("dock.trailer.fairing", (0.56, 0.24, 0.94), (TX + 1.3, 2.06, 0), stone, bevel=0.06, parent=t)
    slab("dock.trailer.tank", (0.36, 0.22, 0.18), (TX + 1.14, 0.86, 0.5), trim, bevel=0.06, parent=t)

    # Round wheels: a tandem under the trailer, a drive axle and a steer under
    # the tractor. 0.36 radius is a real 0.72 m tyre at this scale.
    for i, x in enumerate((TX - 0.92, TX - 0.12, TX + 1.18, TX + 1.86)):
        for j, z in enumerate((-0.5, 0.5)):
            cyl(f"dock.trailer.wheel.{i}.{j}", 0.36, 0.18, (x, 0.54, z), rubber, axis="z", parent=t)
            cyl(f"dock.trailer.hub.{i}.{j}", 0.14, 0.2, (x, 0.54, z), stone, axis="z", verts=12, parent=t)


def office() -> None:
    """Stop 4 - the office. Three invoice plates lift off the roof and go.

    Each floor overhangs the one below and sits inside the one above, so no two
    faces are ever coplanar. Window slots are recessed strips rather than painted
    lines, which is the only way they read in a single-colour clay scene.
    """
    g = group("office")
    body = clay("surface", SURFACE)
    stone = clay("surface.2", SURFACE_2, 0.85)
    glass = clay("glass.2", 0x9A9AA2, 0.45)
    _pad("office", 4.4, 3.4, g)

    for i in range(3):
        w, d = 2.4 - i * 0.25, 1.9 - i * 0.18
        y = 0.5 + i * 0.72
        slab(f"office.floor.{i}", (w, 0.62, d), (0, y, 0), body, bevel=0.028, parent=g)
        slab(f"office.band.{i}", (w + 0.12, 0.1, d + 0.12), (0, y + 0.29, 0), stone, bevel=0.022, parent=g)
        # Glazing on the two faces the camera can see, set back into the floor.
        slab(f"office.glass.{i}.f", (w - 0.3, 0.26, 0.04), (0, y + 0.02, d / 2 - 0.01), glass, bevel=0.01, parent=g)
        slab(f"office.glass.{i}.s", (0.04, 0.26, d - 0.3), (w / 2 - 0.01, y + 0.02, 0), glass, bevel=0.01, parent=g)

    slab("office.canopy", (1.3, 0.07, 0.5), (0, 0.62, 1.12), stone, bevel=0.018, parent=g)
    slab("office.door", (0.6, 0.5, 0.06), (0, 0.35, 0.96), glass, bevel=0.014, parent=g)

    # ANIMATED: uniform scale about the centre.
    slab("office.cap", (0.9, 0.14, 0.9), (0, 2.74, 0), clay("violet", VIOLET, 0.5), bevel=0.02, parent=g)

    # ANIMATED: moved, turned, faded and hidden. Kept in the export so the
    # runtime does not have to build them; it sets visible=false on load.
    for i in range(3):
        slab(f"office.plate.{i}", (0.62, 0.06, 0.44), (0, 2.9 + i * 0.02, 0), clay(f"office.plate.{i}", SURFACE), bevel=0.012, parent=g)


def tower() -> None:
    """Stop 5 - the tower. Lines from every upstream station converge on the crown.

    The convergence lines are drawn by the runtime from live station positions,
    so they are not modelled here. The shaft gained fins and the deck a railing:
    at 5 m it is the tallest thing on the road and a bare extruded square reads
    as a missing texture.
    """
    g = group("tower")
    body = clay("surface", SURFACE)
    stone = clay("surface.2", SURFACE_2, 0.85)
    trim = clay("ink.4", INK_4, 0.6)
    _pad("tower", 4.4, 3.4, g)

    slab("tower.base", (2.1, 0.4, 2.1), (0, 0.38, 0), stone, bevel=0.035, parent=g)
    slab("tower.shaft", (1.5, 3.2, 1.5), (0, 1.78, 0), body, bevel=0.03, parent=g)
    for i, (dx, dz, fw, fd) in enumerate(
        [(0.86, 0, 0.24, 0.9), (-0.86, 0, 0.24, 0.9), (0, 0.86, 0.9, 0.24), (0, -0.86, 0.9, 0.24)]
    ):
        slab(f"tower.fin.{i}", (fw, 2.9, fd), (dx, 1.78, dz), stone, bevel=0.02, parent=g)

    slab("tower.deck", (2.5, 0.5, 2.5), (0, 3.52, 0), stone, bevel=0.03, parent=g)
    for i, (dx, dz, rw, rd) in enumerate(
        [(0, 1.22, 2.5, 0.06), (0, -1.22, 2.5, 0.06), (1.22, 0, 0.06, 2.5), (-1.22, 0, 0.06, 2.5)]
    ):
        slab(f"tower.rail.{i}", (rw, 0.16, rd), (dx, 3.85, dz), trim, bevel=0.014, parent=g)

    # ANIMATED: position.y breathes with the stop.
    slab("tower.crown", (2.1, 0.3, 2.1), (0, 3.87, 0), clay("violet", VIOLET, 0.5), bevel=0.024, parent=g)
    # ANIMATED: rotation.y.
    slab("tower.mast", (0.1, 1.2, 0.1), (0, 4.62, 0), trim, bevel=0.012, parent=g)
    slab("tower.mast.arm", (0.44, 0.05, 0.05), (0, 5.06, 0), trim, bevel=0.01, parent=g)



# --- preview poses -----------------------------------------------------------
# A station at rest is not what anyone sees. The runtime holds every stop at
# near=1 while the reader is on it, so judging form against the resting pose
# means judging a trailer parked inside a building and doors that never opened.
# These reproduce the arrived state for the render only - `one()` exports first,
# then poses, so nothing here reaches the GLB.
#
# Axes: three.js Y-up maps to Blender Z-up, so a three `position.y` is a Blender
# `location.z`, a `rotation.y` is a `rotation_euler.z`, and `rotation.x` carries
# straight across.

def _obj(name):
    import bpy
    return bpy.data.objects.get(name)


def _violet(name):
    import bpy
    o = _obj(name)
    if not o or not o.data.materials:
        return
    m = o.data.materials[0]
    b = m.node_tree.nodes["Principled BSDF"]
    r, g, bl = (lib.srgb_to_linear((VIOLET >> k & 255) / 255) for k in (16, 8, 0))
    b.inputs["Base Color"].default_value = (r, g, bl, 1.0)


def pose_board():
    _violet("board.row.1")
    _violet("board.chip.1")
    row = _obj("board.row.1")
    if row:
        row.location.y -= 0.12          # three z+ is Blender y-
        row.scale.x = 1.06


def pose_hall():
    for i in range(4):
        d = _obj(f"hall.door.{i}")
        if not d:
            continue
        t = max(0.0, min(1.0, 1.6 - i * 0.14))
        d.scale.z = 1 - t * 0.92
        d.location.z += t * 0.28


def pose_dock():
    t = _obj("dock.trailer")
    if t:
        t.location.x = 1.3
        t.rotation_euler = (0.0, 0.0, 0.06)
    lip = _obj("dock.lip")
    if lip:
        lip.rotation_euler = (-0.18, 0.0, 0.0)


def pose_office():
    cap = _obj("office.cap")
    if cap:
        cap.scale = (1.12, 1.12, 1.12)
    # Mid-flight, not the full throw: at e=1 the plates are 2 m out of frame.
    for i in range(3):
        p = _obj(f"office.plate.{i}")
        if not p:
            continue
        e = 0.8 - i * 0.26
        p.location.z += e * (1.5 + i * 0.35)
        p.location.x += e * (1.1 + i * 0.5)
        p.rotation_euler = (0.0, -e * 0.5, 0.6 + i)


def pose_tower():
    import math
    m = _obj("tower.mast")
    if m:
        m.rotation_euler = (0.0, 0.0, math.radians(30))
    a = _obj("tower.mast.arm")
    if a:
        a.rotation_euler = (0.0, 0.0, math.radians(30))


POSES = {"board": pose_board, "hall": pose_hall, "dock": pose_dock,
         "office": pose_office, "tower": pose_tower}


STATIONS = {"board": board, "hall": hall, "dock": dock, "office": office, "tower": tower}


def one(name: str, out: str, preview: bool, draco: bool) -> str:
    lib.reset()
    STATIONS[name]()
    tris = lib.tri_count()

    # Export BEFORE posing. The pose is a preview device; baking it into the GLB
    # would ship a trailer already parked and doors already open.
    path = os.path.join(out, f"{name}.glb")
    size = lib.export_glb(path, draco_level=6 if draco else 0)

    if preview:
        POSES[name]()
        centre, ortho = lib.frame_all()
        lib.stage_camera(ortho=ortho, target=centre)
        lib.stage_light()
        lib.render_preview(os.path.join(out, f"{name}.preview.png"))

    import gzip

    with open(path, "rb") as fh:
        wire = len(gzip.compress(fh.read(), 9))
    return f"RESULT station={name} tris={tris} glb={size} gzip={wire}"


def main() -> None:
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    ap = argparse.ArgumentParser()
    ap.add_argument("--station", default="all", choices=sorted(STATIONS) + ["all"])
    ap.add_argument("--out", default="public/scene")
    ap.add_argument("--preview", action="store_true")
    # Draco is OFF by default, and the measurement is in the vault: at this
    # triangle count it costs far more than it saves. One station is 74.6 KB
    # plain / 12.0 KB gzipped, or 30.8 KB Draco / 8.7 KB gzipped - a 3.3 KB win
    # over the wire, against a 286 KB wasm decoder the browser must fetch first.
    # Draco starts paying at hundreds of thousands of triangles; this scene has
    # thousands. Let the CDN compress it.
    ap.add_argument("--draco", action="store_true")
    a = ap.parse_args(argv)

    os.makedirs(a.out, exist_ok=True)
    names = sorted(STATIONS) if a.station == "all" else [a.station]
    for n in names:
        print(one(n, a.out, a.preview, a.draco))


main()
