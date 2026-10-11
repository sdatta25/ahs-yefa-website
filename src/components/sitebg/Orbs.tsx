import { useMemo, useRef } from "react"
import type { RefObject } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const BLUE = "#3657c9"
const BLUE_DARK = "#1b2f6b"
const ORANGE = "#e2912e"

type Orb = { position: [number, number, number]; color: string; scale: number; phase: number }

// Keeps a generated point clear of the centered content column — pushes it
// radially outward past a safe ellipse instead of discarding it.
function pushFromCenter(x: number, y: number, safeX: number, safeY: number, rng: () => number) {
  const d = Math.sqrt((x / safeX) ** 2 + (y / safeY) ** 2)
  if (d >= 1 || d === 0) return [x, y] as const
  const scale = (1.05 + rng() * 0.55) / d
  return [x * scale, y * scale] as const
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

// A handful of soft, out-of-focus orbs drifting slowly at different depths —
// quiet atmosphere, not a thing to look at. No connecting lines, no hard
// edges, no eye-catching color: everything here is meant to sit beneath
// notice. Positions are generated once per mount; count drops further on
// small viewports and on the admin section.
function useOrbs(dense: boolean, calm: boolean) {
  return useMemo(() => {
    const count = calm ? 2 : dense ? 5 : 3
    const rng = mulberry32(11)
    return Array.from({ length: count }, (): Orb => {
      const rawX = (rng() - 0.5) * 13
      const rawY = (rng() - 0.5) * 8
      const [x, y] = pushFromCenter(rawX, rawY, 3.4, 2.2, rng)
      const z = (rng() - 0.5) * 5 - 1.5
      const accent = rng() > 0.88
      return {
        position: [x, y, z],
        color: accent ? ORANGE : rng() > 0.5 ? BLUE : BLUE_DARK,
        scale: 0.09 + rng() * 0.08,
        phase: rng() * Math.PI * 2,
      }
    })
  }, [dense, calm])
}

function OrbMesh({ orb, opacity, reduced }: { orb: Orb; opacity: number; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    const group = ref.current
    if (!group || document.hidden || reduced) return
    const t = state.clock.elapsedTime * 0.1 + orb.phase
    group.position.x = orb.position[0] + Math.sin(t) * 0.2
    group.position.y = orb.position[1] + Math.cos(t * 0.8) * 0.25
  })

  return (
    <group ref={ref} position={orb.position}>
      <mesh>
        <sphereGeometry args={[orb.scale, 16, 16]} />
        <meshBasicMaterial color={orb.color} transparent opacity={opacity} depthWrite={false} />
      </mesh>
    </group>
  )
}

export default function Orbs({
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
  const orbs = useOrbs(dense, calm)
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    const group = groupRef.current
    if (!group || document.hidden) return
    const scrollT = calm || reduced ? 0 : (scrollRef.current ?? 0)
    group.position.y = -scrollT * 0.5
  })

  const opacity = calm ? 0.1 : 0.18

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <OrbMesh key={i} orb={orb} opacity={opacity} reduced={reduced} />
      ))}
    </group>
  )
}
