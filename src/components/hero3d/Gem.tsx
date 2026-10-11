import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { easeOutBack } from "./easing"

const BLUE = "#3657c9"
const BLUE_LIGHT = "#8aa3ef"

export default function Gem({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const startRef = useRef<number | null>(null)

  // Low-poly icosahedron, stretched vertically — reads as a cut gem / rising
  // index rather than a generic sphere.
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 0)
    geo.scale(0.82, 1.18, 0.82)
    return geo
  }, [])

  useFrame((state, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    if (startRef.current === null) startRef.current = state.clock.elapsedTime

    const t = state.clock.elapsedTime - startRef.current
    const entrance = easeOutBack(t / 1.3)

    const baseSpin = reduced ? 0 : state.clock.elapsedTime * 0.18
    mesh.rotation.y = baseSpin + (1 - entrance) * -2.4
    mesh.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.08 * (reduced ? 0 : 1) + (1 - entrance) * 0.6

    const scale = THREE.MathUtils.lerp(0.25, 1, entrance)
    mesh.scale.setScalar(scale)

    if (!reduced) {
      mesh.rotation.z += delta * 0.01
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={BLUE}
        emissive={BLUE_LIGHT}
        emissiveIntensity={0.08}
        metalness={0.65}
        roughness={0.18}
        clearcoat={0.6}
        clearcoatRoughness={0.25}
        flatShading
      />
    </mesh>
  )
}
