import { useMemo, useRef } from "react"
import type { RefObject } from "react"
import { useFrame } from "@react-three/fiber"
import { Line, Sparkles } from "@react-three/drei"
import * as THREE from "three"

const BLUE = "#3657c9"
const BLUE_DARK = "#1b2f6b"
const ORANGE = "#e2912e"

type Node = { position: [number, number, number]; color: string; scale: number }

// A sparse constellation of data points loosely wired together — an
// abstract reading of a market network, not a literal chart. Positions are
// generated once per mount; density is halved on small viewports and on
// the admin section, where it needs to stay out of the way of real work.
function useLatticeGeometry(dense: boolean, calm: boolean) {
  return useMemo(() => {
    const count = calm ? 9 : dense ? 24 : 14
    const rng = mulberry32(7)
    const nodes: Node[] = Array.from({ length: count }, () => {
      const x = (rng() - 0.5) * 12
      const y = (rng() - 0.5) * 7.5
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
        if (dist < 4.5 && edges.length < (calm ? 6 : dense ? 22 : 12)) {
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

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return
    if (document.hidden) return

    if (!reduced) {
      const driftSpeed = calm ? 0.004 : 0.012
      pointerSmoothed.current.x = THREE.MathUtils.lerp(pointerSmoothed.current.x, state.pointer.x, 0.02)
      pointerSmoothed.current.y = THREE.MathUtils.lerp(pointerSmoothed.current.y, state.pointer.y, 0.02)
      group.rotation.y += delta * driftSpeed
      group.rotation.y += pointerSmoothed.current.x * (calm ? 0.0002 : 0.0006)
      group.rotation.x = -pointerSmoothed.current.y * 0.03 + Math.sin(state.clock.elapsedTime * 0.08) * 0.015

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
