/**
 * The freight route as one isometric scene, driven entirely by scroll.
 *
 * Plain three.js in an effect rather than react-three-fiber: R3F adds a second
 * reconciler and ~50 KB gzip on top of three itself, and this scene has no
 * React state inside it at all - it takes one number and draws.
 *
 * Isometric, not perspective: an OrthographicCamera held at the classic
 * 35.264 degrees of elevation and 45 of azimuth. That is the angle where a
 * cube's three visible faces are equal, which is why isometric drawings read as
 * diagrams rather than as photographs - what §11.1 asks for ("реальные или
 * честно смоделированные фрагменты продукта", never a decorative render). The
 * camera never leaves that angle; it only changes what it is pointed at and how
 * close it is, so the scene can travel without ever becoming a fly-through.
 *
 * Everything is procedural. No GLTF, no textures, no external asset - the whole
 * scene is generated at runtime, so it costs no request beyond the library and
 * cannot go stale against a brand change.
 *
 * Materials are the part that decides whether this reads as expensive or as a
 * diagram, and the first version got it wrong: MeshLambertMaterial under a
 * single directional light is flat by construction. It now uses
 * MeshStandardMaterial lit by an image-based environment - `RoomEnvironment`,
 * which three builds procedurally and PMREM convolves into a cubemap in a few
 * milliseconds, no .hdr file and no request - plus GTAO for the contact seams a
 * shadow map knows nothing about.
 *
 * THE API IS ONE NUMBER. `setProgress(0..1)` spans the whole road. Everything
 * else - which stop is active, where the camera is, what each station is doing,
 * where the load is - is derived from it. That is what lets the driver be
 * ScrollTrigger, a reduced-motion snapshot at 0.5, or a test, and it is why
 * there is no timeline here to keep in step with the copy.
 *
 * Idle motion runs on its own clock, because a scene that is completely still
 * between scroll ticks reads as a screenshot. It is deliberately small - a load
 * that breathes, a mast that turns - and the loop stops when the section leaves
 * the viewport or the tab is hidden.
 */

import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"

/** The five stops of §27.7-27.11. */
export const STAGE_COUNT = 5

/* Palette, from the site's tokens. `ROUTE` is the one value not taken
   verbatim: --color-rule is a hairline meant to sit against white, and a tube
   in it disappears against --color-paper. */
const SURFACE = 0xe3e3e8
const SURFACE_2 = 0xd8d8de
const ROUTE = 0xd2d2d6
const INK = 0x121317
const INK_4 = 0xa2a2a2
const VIOLET = 0x6f5197

/* One material family for the whole scene, which is half the clay look: a
   single desaturated surface makes modelled form read as form rather than as a
   colour scheme. Roughness high, metalness zero - painted concrete and steel. */
const clay = (color: number, roughness = 0.72) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 })

function slab(w: number, h: number, d: number, color: number, roughness?: number): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), clay(color, roughness))
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t)
/** Smootherstep. Linear interpolation between camera targets reads as a jerk
    at every hand-over; this has zero first and second derivative at both ends. */
const ease = (t: number) => {
  const x = clamp01(t)
  return x * x * x * (x * (x * 6 - 15) + 10)
}

/**
 * A station.
 *
 * `tick` is what makes the scene play the block rather than merely sit behind
 * it. It receives how near the load is (1 at the stop, 0 a stop away) and the
 * scene's own clock, and each station spends that on the one gesture its stage
 * is about - a board scanning, a bay opening, a trailer coupling, an invoice
 * lifting, five lines converging.
 */
type Station = {
  group: THREE.Group
  tick: (near: number, time: number) => void
}

function board(): Station {
  const g = new THREE.Group()
  const apron = slab(4.4, 0.16, 3.4, SURFACE_2, 0.85)
  apron.position.y = 0.1
  g.add(apron)

  /* `position` on an Object3D is a read-only Vector3 - it is mutated, never
     replaced. Object.assign onto it throws in strict mode, which is how the
     whole scene silently failed to start once. */
  const post = slab(0.3, 1.6, 0.3, SURFACE_2)
  post.position.set(-0.6, 0.95, 0)
  g.add(post)
  const screen = slab(2.4, 1.5, 0.16, SURFACE)
  screen.position.set(0.2, 1.95, 0)
  screen.rotation.y = -0.12
  g.add(screen)

  /* Three result rows. The middle one is the load this page follows, and it is
     the one that lights when the stop is reached. */
  const rows = [0, 1, 2].map((i) => {
    const r = slab(1.8, 0.1, 0.06, SURFACE_2)
    r.position.set(0.2, 2.3 - i * 0.42, 0.1)
    r.rotation.y = -0.12
    g.add(r)
    return r
  })
  const hit = rows[1]

  return {
    group: g,
    tick(near, time) {
      /* A scan runs down the rows, then settles on the match. */
      const scan = (time * 0.9) % 3
      rows.forEach((r, i) => {
        const lit = near * (1 - Math.min(1, Math.abs(scan - i) * 2))
        r.scale.x = 1 + lit * 0.06
        ;(r.material as THREE.MeshStandardMaterial).color.setHex(lit > 0.5 ? VIOLET : SURFACE_2)
      })
      ;(hit.material as THREE.MeshStandardMaterial).color.lerpColors(
        new THREE.Color(SURFACE_2),
        new THREE.Color(VIOLET),
        near,
      )
      hit.position.z = 0.1 + near * 0.12
    },
  }
}

function hall(): Station {
  const g = new THREE.Group()
  const apron = slab(4.6, 0.16, 3.6, SURFACE_2, 0.85)
  apron.position.y = 0.1
  g.add(apron)

  const body = slab(3.8, 1.1, 2.6, SURFACE)
  body.position.set(0, 0.73, 0)
  g.add(body)

  for (let i = 0; i < 3; i++) {
    const unit = slab(0.7, 0.3, 0.7, SURFACE_2)
    unit.position.set(-1.1 + i * 1.1, 1.42, -0.3)
    g.add(unit)
  }

  /* Four bay doors. They roll up as the load arrives: the block is about the
     booked load becoming a plan, and a plan opening is a door opening. */
  const doors = [0, 1, 2, 3].map((i) => {
    const d = slab(0.55, 0.62, 0.06, SURFACE_2)
    d.position.set(-1.35 + i * 0.9, 0.47, 1.32)
    g.add(d)
    return d
  })

  return {
    group: g,
    tick(near) {
      doors.forEach((d, i) => {
        /* Staggered, left to right, so it reads as a sequence rather than a
           single shutter. */
        const t = ease(clamp01(near * 1.6 - i * 0.14))
        d.scale.y = 1 - t * 0.92
        d.position.y = 0.47 + t * 0.28
      })
    },
  }
}

function dock(): Station {
  const g = new THREE.Group()
  const apron = slab(4.8, 0.16, 3.6, SURFACE_2, 0.85)
  apron.position.y = 0.1
  g.add(apron)

  const shed = slab(2.6, 0.9, 2.2, SURFACE)
  shed.position.set(-0.8, 0.63, 0)
  g.add(shed)
  const lip = slab(2.6, 0.12, 0.5, SURFACE_2)
  lip.position.set(-0.8, 1.14, 1.0)
  g.add(lip)

  /* The trailer backs onto the dock as the load arrives. */
  const trailer = new THREE.Group()
  const box = slab(2.4, 0.95, 1.1, SURFACE)
  box.position.y = 0.77
  const cab = slab(0.72, 0.7, 1.05, SURFACE_2)
  cab.position.set(1.5, 0.64, 0)
  const wheels = [-0.6, 0.8].map((x) => {
    const w = slab(0.16, 0.28, 1.2, INK_4)
    w.position.set(x, 0.22, 0)
    return w
  })
  trailer.add(box, cab, ...wheels)
  g.add(trailer)

  return {
    group: g,
    tick(near) {
      const t = ease(near)
      trailer.position.x = lerp(3.4, 1.3, t)
      trailer.rotation.y = lerp(0.5, 0.06, t)
      /* The dock lip drops onto the trailer once it is in place. */
      lip.rotation.x = lerp(0, -0.18, ease(clamp01(near * 1.5 - 0.5)))
    },
  }
}

function office(): Station {
  const g = new THREE.Group()
  const apron = slab(4.4, 0.16, 3.4, SURFACE_2, 0.85)
  apron.position.y = 0.1
  g.add(apron)

  for (let i = 0; i < 3; i++) {
    const floor = slab(2.4 - i * 0.25, 0.62, 1.9 - i * 0.18, SURFACE)
    floor.position.set(0, 0.5 + i * 0.72, 0)
    g.add(floor)
    /* Overhangs the floor below and sits inside the one above, so no two faces
       are ever coplanar - see the note on z-fighting in the vault. */
    const band = slab(2.52 - i * 0.25, 0.1, 2.02 - i * 0.18, SURFACE_2)
    band.position.set(0, 0.79 + i * 0.72, 0)
    g.add(band)
  }
  const cap = slab(0.9, 0.14, 0.9, VIOLET)
  cap.position.set(0, 2.74, 0)
  g.add(cap)

  /* Three plates lift off the roof and go: the invoice leaving for payment. */
  const plates = [0, 1, 2].map((i) => {
    const p = slab(0.62, 0.06, 0.44, SURFACE)
    p.position.set(0, 2.9 + i * 0.02, 0)
    p.visible = false
    g.add(p)
    return p
  })

  return {
    group: g,
    tick(near, time) {
      cap.scale.setScalar(1 + near * 0.12)
      plates.forEach((p, i) => {
        const t = clamp01(near * 1.4 - i * 0.18)
        p.visible = t > 0.01
        const e = ease(t)
        p.position.y = 2.9 + e * (1.5 + i * 0.35)
        p.position.x = e * (1.1 + i * 0.5)
        p.rotation.z = e * 0.5
        p.rotation.y = time * 0.6 + i
        ;(p.material as THREE.MeshStandardMaterial).opacity = 1 - e * 0.75
        ;(p.material as THREE.MeshStandardMaterial).transparent = true
      })
    },
  }
}

function tower(pointsFrom: THREE.Vector3[]): Station {
  const g = new THREE.Group()
  const apron = slab(4.4, 0.16, 3.4, SURFACE_2, 0.85)
  apron.position.y = 0.1
  g.add(apron)

  const shaft = slab(1.5, 3.2, 1.5, SURFACE)
  shaft.position.y = 1.78
  g.add(shaft)
  const deck = slab(2.5, 0.5, 2.5, SURFACE_2)
  deck.position.y = 3.52
  g.add(deck)
  const crown = slab(2.1, 0.3, 2.1, VIOLET)
  crown.position.y = 3.87
  g.add(crown)
  const mast = slab(0.1, 1.2, 0.1, INK_4)
  mast.position.y = 4.62
  mast.castShadow = false
  g.add(mast)

  /* One line per upstream station, drawn to the crown. The block is about the
     five products resolving into one view, and this is that sentence in
     geometry: nothing converges until the reader reaches the stop. */
  const head = new THREE.Vector3(0, 3.95, 0)
  const links = pointsFrom.map((from) => {
    const local = from.clone()
    const geo = new THREE.BufferGeometry().setFromPoints([local, head])
    const line = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({ color: VIOLET, transparent: true, opacity: 0 }),
    )
    g.add(line)
    return { line, from: local }
  })

  return {
    group: g,
    tick(near, time) {
      mast.rotation.y = time * 0.5
      crown.position.y = 3.87 + Math.sin(time * 1.2) * 0.02 * near
      links.forEach((l, i) => {
        const t = ease(clamp01(near * 1.5 - i * 0.1))
        ;(l.line.material as THREE.LineBasicMaterial).opacity = t * 0.75
        const geo = l.line.geometry as THREE.BufferGeometry
        const p = l.from.clone().lerp(head, t)
        geo.setFromPoints([l.from, p])
      })
    },
  }
}

/** A figure, for scale. Three boxes; it only has to be person-sized. */
function figure(): THREE.Group {
  const g = new THREE.Group()
  const body = slab(0.16, 0.42, 0.13, INK_4, 0.9)
  body.position.y = 0.36
  const head = slab(0.14, 0.14, 0.14, INK_4, 0.9)
  head.position.y = 0.64
  const legs = slab(0.15, 0.26, 0.12, INK_4, 0.9)
  legs.position.y = 0.13
  g.add(body, head, legs)
  return g
}

const container = () => slab(1.9, 0.75, 0.85, SURFACE_2, 0.8)

export type SceneHandle = {
  setProgress: (t: number) => void
  /** How much of the frame, 0..1 from the top, the copy has taken. */
  setBand: (top: number) => void
  resize: () => void
  dispose: () => void
  /** Start and stop the idle clock: it must not run off screen. */
  play: () => void
  pause: () => void
}

export function createScene(canvas: HTMLCanvasElement): SceneHandle {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  /* PCFSoft is deprecated in three 0.185 and silently falls back to PCF, so
     ask for what we actually get. The softness comes from shadow.radius. */
  renderer.shadowMap.type = THREE.PCFShadowMap
  /* ACES compresses the highlights an environment map produces; without it the
     lit faces clip to white and the clay turns to plastic. Exposure is under 1
     because the page ground is already near-white. */
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.86

  const scene = new THREE.Scene()

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400)
  /* The isometric offset, fixed for the whole journey. Only what the camera
     looks at and how wide it sees ever change. */
  const OFFSET = new THREE.Vector3(20, 16.33, 20)

  const pmrem = new THREE.PMREMGenerator(renderer)
  pmrem.compileEquirectangularShader()
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = env.texture
  scene.environmentIntensity = 0.85

  const key = new THREE.DirectionalLight(0xffffff, 1.15)
  key.position.set(15, 24, 11)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.camera.left = -26
  key.shadow.camera.right = 26
  key.shadow.camera.top = 26
  key.shadow.camera.bottom = -26
  key.shadow.camera.far = 90
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.02
  key.shadow.radius = 3
  scene.add(key)

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120),
    new THREE.ShadowMaterial({ opacity: 0.22 }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.002
  ground.receiveShadow = true
  scene.add(ground)

  /* The route. One curve through the five stops, drawn as a thin tube so it
     reads as a road rather than as a chart line. */
  const points = [
    new THREE.Vector3(-17, 0.06, 6),
    new THREE.Vector3(-8.5, 0.06, -2),
    new THREE.Vector3(0, 0.06, 3),
    new THREE.Vector3(8.5, 0.06, -3),
    new THREE.Vector3(17, 0.06, 2),
  ]
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.35)

  scene.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(curve, 200, 0.09, 8, false),
      new THREE.MeshBasicMaterial({ color: ROUTE }),
    ),
  )
  const travelledGeo = new THREE.TubeGeometry(curve, 200, 0.12, 8, false)
  scene.add(travelledGeo && new THREE.Mesh(travelledGeo, new THREE.MeshBasicMaterial({ color: VIOLET })))
  const travelledCount = travelledGeo.index ? travelledGeo.index.count : 0

  /* Where each station stands, and where the camera looks when it is the stop. */
  const AT = [0, 0.25, 0.5, 0.75, 1]
  const seats = AT.map((at, i) => {
    const p = curve.getPointAt(at)
    return new THREE.Vector3(p.x, 0, p.z + (i % 2 === 0 ? 3.6 : -3.6))
  })

  const stations: Station[] = [
    board(),
    hall(),
    dock(),
    office(),
    /* The tower's links start at the other four stations, in its own space. */
    tower(seats.slice(0, 4).map((s) => s.clone().sub(seats[4]).setY(1.2))),
  ]
  stations.forEach((st, i) => {
    st.group.position.copy(seats[i])
    st.group.rotation.y = Math.PI / 4 + (i % 2 === 0 ? 0 : Math.PI)
    scene.add(st.group)
  })

  /* Props, from a fixed table rather than at random: a scene that rearranges
     itself between builds cannot be screenshot-checked. */
  const PROPS: [number, number, "figure" | "container", number][] = [
    [-14.2, 8.6, "figure", 0.6],
    [-9.6, -5.4, "container", 0.3],
    [-4.8, 6.2, "figure", -1.1],
    [-1.4, -6.6, "container", 1.2],
    [2.6, 6.8, "figure", 2.2],
    [6.2, -7.1, "container", -0.5],
    [10.0, 5.6, "figure", 0.2],
    [13.4, -4.8, "container", 0.9],
    [16.0, 7.0, "figure", -2.0],
  ]
  for (const [x, z, kind, rot] of PROPS) {
    const o = kind === "figure" ? figure() : container()
    o.position.set(x, kind === "container" ? 0.39 : 0, z)
    o.rotation.y = rot
    scene.add(o)
  }

  /* The load: one box that travels the whole route. */
  const load = new THREE.Group()
  const body = slab(1.5, 0.9, 1.1, INK)
  body.position.y = 0.58
  const deck = slab(1.7, 0.12, 1.25, VIOLET)
  deck.position.y = 0.08
  load.add(body, deck)
  scene.add(load)

  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const ao = new GTAOPass(scene, camera)
  /* `?ao=debug` renders the occlusion buffer alone. Tuning AO by looking at the
     composite is guesswork: "I see no difference" and "it is not running" look
     identical. */
  ao.output =
    new URLSearchParams(location.search).get("ao") === "debug"
      ? GTAOPass.OUTPUT.AO
      : GTAOPass.OUTPUT.Default
  ao.blendIntensity = 1.45
  ao.updateGtaoMaterial({ radius: 1.2, distanceExponent: 1.0, thickness: 1.4, scale: 1.9, samples: 32 })
  ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2.5, normalPhi: 3.5, radius: 4, rings: 2, samples: 16 })
  composer.addPass(ao)
  composer.addPass(new OutputPass())

  let progress = 0
  let time = 0
  let raf = 0
  let running = false
  const look = new THREE.Vector3()

  const draw = () => {
    const t = clamp01(progress)

    /* Which stop, and how far into the hand-over. */
    const scaled = t * (STAGE_COUNT - 1)
    const i = Math.min(STAGE_COUNT - 2, Math.floor(scaled))
    const f = ease(scaled - i)

    /* Camera: same isometric offset throughout, only the subject changes. It
       closes in on a stop and pulls back between them, which is what makes a
       hand-over read as travel rather than as a cut. */
    look.copy(seats[i]).lerp(seats[i + 1], f)
    /* Raising what the camera looks at pushes the subject DOWN the frame. The
       stop's copy and its proof own the top half of the screen, so the station
       has to sit in the bottom half or the two fight for the same pixels - and
       a drawing behind body text is a drawing nobody looks at and text nobody
       can read. This is the single number that keeps them out of each other's
       way. */
    look.y = 8.4
    const between = Math.sin(f * Math.PI)
    /* Wider at a stop than the first pass: the structures grew, and at 19 the
       station filled the frame and lost the road it stands on. */
    const span = lerp(25, 33, between)

    camera.position.copy(look).add(OFFSET)
    camera.lookAt(look)
    setSpan(span)

    /* The load rides the curve, sits a little into the ground at a stop and
       lifts between them, and breathes on the idle clock. */
    const p = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)
    load.position.set(p.x, 0.05 + between * 0.12 + Math.sin(time * 1.6) * 0.02, p.z)
    load.rotation.y = Math.atan2(tangent.x, tangent.z)
    load.rotation.z = Math.sin(time * 1.1) * 0.012

    travelledGeo.setDrawRange(0, Math.max(0, Math.floor(travelledCount * t)))

    stations.forEach((st, n) => {
      /* 1 at the stop, 0 one stop away. Every station's own gesture is a
         function of this and nothing else. */
      const near = clamp01(1 - Math.abs(t - AT[n]) * (STAGE_COUNT - 1))
      st.tick(near, time)
      st.group.position.y = ease(near) * 0.22
    })

    composer.render()
  }

  let currentSpan = 22
  /* How much of the frame the copy has taken, 0..1 from the top. */
  let bandTop = 0

  function setSpan(span: number) {
    currentSpan = span
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    const aspect = w / h
    camera.left = -span / 2
    camera.right = span / 2
    camera.top = span / 2 / aspect
    camera.bottom = -span / 2 / aspect

    /* Centre the picture in the band the copy has left, rather than in the
       window.

       Pushing the camera's look-at target up in world space did this at first,
       with one hard-coded number. It could not work: the stops are not the same
       height - the load board with its layer open is 830px and the driver stop
       is 400 - so one offset either buried the station under a tall stop or
       stranded it in white space under a short one.

       `setViewOffset` renders a shifted sub-rectangle of the same frustum, so
       the scene's own scale is untouched and only where it sits moves. Shifting
       up by half the band puts the subject in the middle of what is left. */
    /* Capped at a quarter of the frame. Uncapped, the tallest stop asks for a
       shift big enough to push the station out of the bottom of the window
       entirely - the scene disappears exactly where it was supposed to be
       making room. A quarter is as far as the subject can travel and still be
       wholly on screen. */
    const shift = Math.min(bandTop, 0.5) * h * 0.5
    if (shift > 1) camera.setViewOffset(w, h, 0, -shift, w, h)
    else camera.clearViewOffset()

    camera.updateProjectionMatrix()
  }

  const loop = () => {
    if (!running) return
    time += 1 / 60
    draw()
    raf = requestAnimationFrame(loop)
  }

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    renderer.setSize(w, h, false)
    composer.setSize(w, h)
    setSpan(currentSpan)
    draw()
  }

  resize()

  return {
    setProgress: (t) => {
      progress = t
      if (!running) draw()
    },
    setBand: (top) => {
      const next = clamp01(top)
      if (Math.abs(next - bandTop) < 0.005) return
      bandTop = next
      setSpan(currentSpan)
      if (!running) draw()
    },
    resize,
    play: () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(loop)
    },
    pause: () => {
      running = false
      cancelAnimationFrame(raf)
    },
    dispose: () => {
      running = false
      cancelAnimationFrame(raf)
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
        const mat = m.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
        else mat?.dispose()
      })
      env.texture.dispose()
      pmrem.dispose()
      composer.dispose()
      renderer.dispose()
    },
  }
}

/** Everything the scene needs from the environment before it is worth loading. */
export function canRender(): boolean {
  if (typeof window === "undefined") return false
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false
  try {
    const c = document.createElement("canvas")
    return !!(c.getContext("webgl2") || c.getContext("webgl"))
  } catch {
    return false
  }
}
