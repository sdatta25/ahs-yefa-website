import { useMemo, useRef } from "react"
import type { RefObject } from "react"
import { useFrame } from "@react-three/fiber"
import { Line, Sparkles } from "@react-three/drei"
import * as THREE from "three"

const BLUE = "#3657c9"
const BLUE_DARK = "#1b2f6b"
const ORANGE = "#e2912e"

type Node = { position: [number, number, number]; color: string; scale: number }

// Keeps a generated point clear of the centered content column — pushes it
// radially outward past a safe ellipse instead of discarding it, so every
// node stays fully specified and the layout stays predictable.
function pushFromCenter(x: number, y: number, safeX: number, safeY: number, rng: () => number) {
  const d = Math.sqrt((x / safeX) ** 2 + (y / safeY) ** 2)
  if (d >= 1 || d === 0) return [x, y] as const
  const scale = (1.05 + rng() * 0.55) / d
  return [x * scale, y * scale] as const
}

// Two nodes can each sit clear of the text column while the straight line
// between them still cuts across it — sample along the segment and reject
// it if any point dips inside the safe ellipse.
function edgeClearsCenter(a: [number, number, number], b: [number, number, number], safeX: number, safeY: number) {
  for (let t = 0.15; t <= 0.85; t += 0.1) {
    const x = a[0] + (b[0] - a[0]) * t
    const y = a[1] + (b[1] - a[1]) * t
    if ((x / safeX) ** 2 + (y / safeY) ** 2 < 1) return false
  }
  return true
}

// A sparse scatter of floating data points, lightly wired together — an
// abstract reading of a market network, not a literal chart. Nodes keep
// clear of the centered text column so motion never sits behind a headline.
// Positions are generated once per mount; density is halved on small
// viewports and on the admin section, where it needs to stay out of the
// way of real work.
function useLatticeGeometry(dense: boolean, calm: boolean) {
  return useMemo(() => {
    const count = calm ? 8 : dense ? 20 : 12
    const rng = mulberry32(7)
    const nodes: Node[] = Array.from({ length: count }, () => {
      const rawX = (rng() - 0.5) * 12
      const rawY = (rng() - 0.5) * 7.5
      const [x, y] = pushFromCenter(rawX, rawY, 3.2, 2, rng)
      const z = (rng() - 0.5) * 5 - 1
      const accent = rng() > 0.8
      return {
        position: [x, y, z],
        color: accent ? ORANGE : rng() > 0.5 ? BLUE : BLUE_DARK,
        scale: accent ? 0.15 : 0.08 + rng() * 0.05,
      }
    })

    const edges: [THREE.Vector3, THREE.Vector3][] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i].position
        const b = nodes[j].position
        const dist = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
        const withinBudget = edges.length < (calm ? 3 : dense ? 10 : 6)
        if (dist < 4.5 && withinBudget && edgeClearsCenter(a, b, 3.2, 2)) {
          edges.push([new THREE.Vector3(...a), new THREE.Vector3(...b)])
        }
      }
    }
    return { nodes, edges }
  }, [dense, calm])
}

function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function Lattice({
  reduced,
  dense,
  calm,
  scrollRef,
}: {
  reduced: boolean
  dense: boolean
  calm: boolean
  scrollRef: RefObject<number>
}) {
  const { nodes, edges } = useLatticeGeometry(dense, calm)
  const groupRef = useRef<THREE.Group>(null)
  const pointerSmoothed = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    const group = groupRef.current
    if (!group) return
    if (document.hidden) return

    if (!reduced) {
      // Bounded sway rather than continuous rotation — the scene never
      // turns far enough for a node pushed clear of the text column to
      // drift back behind it.
      const maxSwing = calm ? 0.05 : 0.09
      pointerSmoothed.current.x = THREE.MathUtils.lerp(pointerSmoothed.current.x, state.pointer.x, 0.02)
      pointerSmoothed.current.y = THREE.MathUtils.lerp(pointerSmoothed.current.y, state.pointer.y, 0.02)
      group.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * maxSwing + pointerSmoothed.current.x * 0.03
      group.rotation.x = -pointerSmoothed.current.y * 0.02 + Math.sin(state.clock.elapsedTime * 0.08) * 0.015

      const scrollT = calm ? 0 : (scrollRef.current ?? 0)
      group.rotation.z = scrollT * 0.025
      group.position.y = -scrollT * 0.6
    }
  })

  const lineOpacity = calm ? 0.2 : 0.4
  const nodeOpacity = calm ? 0.45 : 0.85

  return (
    <group ref={groupRef}>
      {edges.map(([a, b], i) => (
        <Line
          key={i}
          points={[a, b]}
          color={BLUE}
          transparent
          opacity={lineOpacity}
          lineWidth={1.2}
        />
      ))}
      {nodes.map((n, i) => (
        <mesh key={i} position={n.position}>
          <icosahedronGeometry args={[n.scale, 0]} />
          <meshBasicMaterial color={n.color} transparent opacity={nodeOpacity} />
        </mesh>
      ))}
      {!calm && (
        <Sparkles count={dense ? 60 : 30} scale={[12, 7.5, 6]} size={1.6} speed={reduced ? 0 : 0.08} color={BLUE} opacity={0.5} />
      )}
    </group>
  )
}
