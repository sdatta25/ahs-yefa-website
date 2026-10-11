import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { easeOutCubic } from "./easing"

const ORANGE = "#e2912e"
const BLUE_LIGHT = "#7893e8"

type RingConfig = {
  radius: number
  tube: number
  tilt: [number, number, number]
  speed: number
  color: string
  delay: number
}

const RINGS: RingConfig[] = [
  { radius: 1.9, tube: 0.012, tilt: [1.3, 0.2, 0], speed: 0.09, color: ORANGE, delay: 0.1 },
  { radius: 2.3, tube: 0.008, tilt: [1.1, 1.0, 0.3], speed: -0.06, color: BLUE_LIGHT, delay: 0.25 },
  { radius: 1.6, tube: 0.006, tilt: [0.4, 0.9, 1.2], speed: 0.13, color: ORANGE, delay: 0.4 },
]

function Ring({ config, reduced }: { config: RingConfig; reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const startRef = useRef<number | null>(null)

  useFrame((state) => {
    const mesh = ref.current
    if (!mesh) return
    if (startRef.current === null) startRef.current = state.clock.elapsedTime
    const t = state.clock.elapsedTime - startRef.current - config.delay
    const entrance = easeOutCubic(t / 1.1)

    mesh.rotation.z = reduced ? 0 : state.clock.elapsedTime * config.speed
    const scale = THREE.MathUtils.lerp(0, 1, Math.max(0, entrance))
    mesh.scale.setScalar(scale)
    ;(mesh.material as THREE.Material).opacity = Math.max(0, entrance) * 0.8
  })

  return (
    <mesh ref={ref} rotation={config.tilt}>
      <torusGeometry args={[config.radius, config.tube, 16, 120]} />
      <meshBasicMaterial color={config.color} transparent opacity={0} />
    </mesh>
  )
}

export default function OrbitRings({ reduced }: { reduced: boolean }) {
  return (
    <>
      {RINGS.map((config, i) => (
        <Ring key={i} config={config} reduced={reduced} />
      ))}
    </>
  )
}
