import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { easeOutBack } from "./easing"

const BLUE = "#3657c9"
const BLUE_DARK = "#1b2f6b"
const ORANGE = "#e2912e"

// An ascending cluster of faceted prisms — a rising index / growth chart
// rendered as crystalline architecture, not a generic gem or sphere.
const PILLARS = [
  { x: -1.35, height: 0.9, depth: 0, color: BLUE_DARK, delay: 0.1 },
  { x: -0.68, height: 1.35, depth: 0.15, color: BLUE, delay: 0.2 },
  { x: 0, height: 1.85, depth: -0.05, color: BLUE, delay: 0.3 },
  { x: 0.68, height: 2.3, depth: 0.12, color: ORANGE, delay: 0.4 },
  { x: 1.35, height: 1.55, depth: -0.1, color: BLUE_DARK, delay: 0.5 },
]

function Pillar({
  x,
  height,
  depth,
  color,
  delay,
}: {
  x: number
  height: number
  depth: number
  color: string
  delay: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const startRef = useRef<number | null>(null)

  // Hexagonal, tapered prism — reads as a cut-crystal column rather than a
  // plain box or a cylinder (which would look round, not faceted).
  const geometry = useMemo(() => new THREE.CylinderGeometry(0.24, 0.3, 1, 6, 1), [])

  useFrame((state) => {
    const mesh = ref.current
    if (!mesh) return
    if (startRef.current === null) startRef.current = state.clock.elapsedTime

    const t = state.clock.elapsedTime - startRef.current - delay
    const entrance = easeOutBack(t / 1.1)
    const h = Math.max(0.001, height * Math.max(0, entrance))

    mesh.scale.y = h
    mesh.position.y = h / 2 - 1.1
    mesh.position.x = x
    mesh.position.z = depth
    mesh.rotation.y = Math.PI / 6
  })

  return (
    <mesh ref={ref} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={color}
        metalness={0.6}
        roughness={0.22}
        clearcoat={0.5}
        clearcoatRoughness={0.3}
        flatShading
      />
    </mesh>
  )
}

export default function Gem({ reduced }: { reduced: boolean }) {
  const clusterRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const group = clusterRef.current
    if (!group || reduced) return
    group.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.45
  })

  return (
    <group ref={clusterRef} rotation={[0.08, -0.3, 0]}>
      {PILLARS.map((p, i) => (
        <Pillar key={i} {...p} />
      ))}
    </group>
  )
}
