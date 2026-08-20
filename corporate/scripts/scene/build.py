"""
Builds the freight-scene stations and writes them out as Draco-compressed glTF.

    blender --background --factory-startup --python scripts/scene/build.py -- \
        --station board --out public/scene --preview

Each station is one GLB so the runtime can fetch only what a stop needs, and so
one station can be re-authored without re-shipping the other four.

Read the naming contract in lib.py before renaming anything: freight-scene.ts
drives these parts by name.
"""

import argparse
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib  # noqa: E402
from lib import SURFACE, SURFACE_2, INK_4, VIOLET, clay, slab, group, turn  # noqa: E402


def board() -> None:
    """Stop 1 - the load board.

    Was six unbevelled boxes: a pad, a post, a panel and three bars. The shape
    was right; it simply had no edges and no joinery. Everything added here is
    the joinery - a kerb so the pad meets the ground somewhere, a plinth and a
    bracket so the post carries the panel rather than intersecting it, a bezel so
    the panel has a face, and a status chip per row.
    """
    g = group("board")
    body = clay("surface", SURFACE)
    stone = clay("surface.2", SURFACE_2, 0.85)
    trim = clay("ink.4", INK_4, 0.6)

    # 2 cm of air under everything. The old scene put the apron's underside at
    # y=0 alongside the ground plane and the two coplanar faces z-fought into a
    # dashed black speckle that read, for a while, as AO noise.
    slab("board.apron", (4.4, 0.16, 3.4), (0, 0.1, 0), stone, bevel=0.03, parent=g)
    for i, (dx, dz, w, d) in enumerate(
        [(0, 1.72, 4.52, 0.1), (0, -1.72, 4.52, 0.1), (2.26, 0, 0.1, 3.54), (-2.26, 0, 0.1, 3.54)]
    ):
        slab(f"board.kerb.{i}", (w, 0.09, d), (dx, 0.145, dz), stone, bevel=0.02, parent=g)

    slab("board.base", (0.62, 0.14, 0.62), (-0.6, 0.25, 0), stone, bevel=0.025, parent=g)
    slab("board.post", (0.26, 1.62, 0.26), (-0.6, 1.11, 0), stone, bevel=0.022, parent=g)
    slab("board.collar", (0.34, 0.08, 0.34), (-0.6, 1.86, 0), trim, bevel=0.02, parent=g)
    turn(slab("board.arm", (0.9, 0.12, 0.14), (-0.18, 1.95, 0.02), stone, bevel=0.022, parent=g), -0.12)

    # Bezel behind, face in front: two plates 3 cm apart give the panel a real
    # edge under the key light instead of a painted-on outline.
    turn(slab("board.screen.frame", (2.52, 1.62, 0.1), (0.2, 1.95, -0.04), stone, bevel=0.024, parent=g), -0.12)
    turn(slab("board.screen", (2.4, 1.5, 0.08), (0.2, 1.95, 0.04), body, bevel=0.02, parent=g), -0.12)
    turn(slab("board.screen.header", (2.4, 0.12, 0.05), (0.2, 2.6, 0.08), trim, bevel=0.014, parent=g), -0.12)

    # Three result rows. The middle one is the load this page follows and the one
    # the runtime lights on arrival, so each row keeps its own material - a shared
    # one would recolour all three at once.
    for i in range(3):
        y = 2.3 - i * 0.42
        turn(slab(f"board.row.{i}", (1.8, 0.1, 0.06), (0.2, y, 0.1), clay(f"board.row.{i}", SURFACE_2), bevel=0.014, parent=g), -0.12)
        turn(slab(f"board.chip.{i}", (0.12, 0.12, 0.05), (-0.82, y, 0.1), clay(f"board.chip.{i}", INK_4, 0.5), bevel=0.012, parent=g), -0.12)


STATIONS = {"board": board}


def main() -> None:
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    ap = argparse.ArgumentParser()
    ap.add_argument("--station", default="board", choices=sorted(STATIONS))
    ap.add_argument("--out", default="public/scene")
    ap.add_argument("--preview", action="store_true")
    ap.add_argument("--ortho", type=float, default=7.5)
    # Draco is OFF by default, and the measurement is in the vault: at this
    # triangle count it costs far more than it saves. One station is 74.6 KB
    # plain / 12.0 KB gzipped, or 30.8 KB Draco / 8.7 KB gzipped - a 3.3 KB win
    # over the wire, against a 286 KB wasm decoder the browser has to fetch
    # first. Draco starts paying at hundreds of thousands of triangles; this
    # scene has thousands. Let the CDN compress it.
    ap.add_argument("--draco", action="store_true")
    a = ap.parse_args(argv)

    lib.reset()
    STATIONS[a.station]()
    os.makedirs(a.out, exist_ok=True)

    tris = lib.tri_count()
    if a.preview:
        lib.stage_camera(ortho=a.ortho, target=(0, 1.2, 0))
        lib.stage_light()
        lib.render_preview(os.path.join(a.out, f"{a.station}.preview.png"))

    path = os.path.join(a.out, f"{a.station}.glb")
    size = lib.export_glb(path, draco_level=6 if a.draco else 0)
    import gzip as _gzip
    with open(path, "rb") as fh:
        wire = len(_gzip.compress(fh.read(), 9))
    print(f"RESULT station={a.station} tris={tris} glb={size} gzip={wire}")


main()
