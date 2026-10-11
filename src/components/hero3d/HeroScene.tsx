import { useRef } from "react"
import type { RefObject } from "react"
import { useFrame } from "@react-three/fiber"
import { Sparkles } from "@react-three/drei"
import * as THREE from "three"
import Gem from "./Gem"
import OrbitRings from "./OrbitRings"
import { lerp } from "./easing"

export default function HeroScene({
  reduced,
  scrollRef,
}: {
  reduced: boolean
  scrollRef: RefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const pointerSmoothed = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    const group = groupRef.current
    if (!group) return

    if (!reduced) {
      pointerSmoothed.current.x = lerp(pointerSmoothed.current.x, state.pointer.x, 0.04)
      pointerSmoothed.current.y = lerp(pointerSmoothed.current.y, state.pointer.y, 0.04)
    }

    const scrollT = scrollRef.current ?? 0
    group.rotation.y = pointerSmoothed.current.x * 0.35
    group.rotation.x = -pointerSmoothed.current.y * 0.2 + scrollT * 0.3
    group.position.y = -scrollT * 0.9
    const scale = 1 - scrollT * 0.15
    group.scale.setScalar(scale)
  })

  return (
    <group ref={groupRef}>
      <Gem reduced={reduced} />
      <OrbitRings reduced={reduced} />
      <Sparkles count={40} scale={4.5} size={1.4} speed={reduced ? 0 : 0.15} color="#8aa3ef" opacity={0.5} />

      <ambientLight intensity={0.35} color="#8aa3ef" />
      <directionalLight position={[3, 4, 3]} intensity={1.4} color="#ffffff" castShadow />
      <pointLight position={[-3, -1.5, 2]} intensity={1.1} color="#e2912e" distance={8} />
      <pointLight position={[0, -2.5, -3]} intensity={0.5} color="#3657c9" distance={10} />
    </group>
  )
}
