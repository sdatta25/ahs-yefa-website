import { useMemo, useRef } from "react"
import type { MutableRefObject, ReactNode } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Environment, Float, Lightformer, Sparkles } from "@react-three/drei"
import * as THREE from "three"

// "The YEFA orbit": a polished globe at the centre, three gold orbits each
// carrying one object (coin, gem, moon), glass shards drifting at depth and
// a slow field of particles. Everything turns slowly and leans to the pointer.
const BLUE = "#2447c4"
const LINE = "#9db2ff"
const GOLD = "#f0a64d"
const ORANGE = "#e2861c"
const INTRO = 2.4
const CAM_Z = 7.6
const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3)

function Orbit({
  radius,
  tilt,
  speed,
  phase,
  clock,
  children,
}: {
  radius: number
  tilt: [number, number, number]
  speed: number
  phase: number
  clock: MutableRefObject<number>
  children: ReactNode
}) {
  const spin = useRef<THREE.Group>(null)
  useFrame(() => {
    if (spin.current) spin.current.rotation.z = phase + clock.current * speed
  })
  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.011, 8, 180]} />
        <meshStandardMaterial color={GOLD} emissive={ORANGE} emissiveIntensity={0.55} metalness={0.7} roughness={0.25} />
      </mesh>
      <group ref={spin}>
        <group position={[radius, 0, 0]}>{children}</group>
      </group>
    </group>
  )
}

function Globe({ clock }: { clock: MutableRefObject<number> }) {
  const g = useRef<THREE.Group>(null)
  useFrame(() => {
    if (g.current) g.current.rotation.y = clock.current * 0.12
  })
  return (
    <group ref={g} rotation={[0.25, 0, 0.12]}>
      <mesh>
        <sphereGeometry args={[1.25, 64, 48]} />
        <meshPhysicalMaterial color={BLUE} roughness={0.18} metalness={0.25} clearcoat={1} clearcoatRoughness={0.12} envMapIntensity={1.3} />
      </mesh>
      {[-0.7, 0, 0.7].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[Math.sqrt(1.258 * 1.258 - y * y), 0.006, 6, 120]} />
          <meshBasicMaterial color={LINE} transparent opacity={0.7} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} rotation={[0, (i * Math.PI) / 6, 0]}>
          <torusGeometry args={[1.258, 0.006, 6, 120]} />
          <meshBasicMaterial color={LINE} transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  )
}

export default function AuthScene({
  reduced,
  pointer,
}: {
  reduced: boolean
  pointer: MutableRefObject<{ x: number; y: number }>
}) {
  const clock = useRef(reduced ? 40 : 0)
  const rig = useRef<THREE.Group>(null)
  const { size } = useThree()
  const aspect = size.width / size.height
  // Fit the outer orbit to whichever side of the panel is shorter.
  const fit = Math.min(1, (Math.tan((20 * Math.PI) / 180) * CAM_Z * Math.min(aspect, 1.15)) / 3.05)
  const mobile = size.width < 640

  const shards = useMemo(
    () =>
      [
        [-3.6, 2.3, -2.5, 0.34],
        [3.5, 2.6, -3.2, 0.42],
        [-3.1, -2.5, -1.6, 0.26],
        [3.3, -2.2, -2.2, 0.3],
        [0.4, 3.3, -4, 0.36],
        [-0.8, -3.4, -3.4, 0.3],
      ] as [number, number, number, number][],
    [],
  )

  useFrame(({ camera }, delta) => {
    if (!reduced) clock.current += Math.min(delta, 0.1)
    const t = reduced ? 1 : ease(clock.current / INTRO)
    const r = rig.current
    if (r) {
      r.scale.setScalar(fit * (0.82 + 0.18 * t))
      const px = reduced ? 0 : pointer.current.x
      const py = reduced ? 0 : pointer.current.y
      r.rotation.y += (px * 0.28 - r.rotation.y) * 0.04
      r.rotation.x += (-py * 0.16 - r.rotation.x) * 0.04
      camera.position.x += (px * 0.45 - camera.position.x) * 0.03
      camera.position.y += (py * 0.3 - camera.position.y) * 0.03
    }
    camera.position.z = CAM_Z + (1 - t) * 3
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <fog attach="fog" args={["#070d22", 7, 16]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 4]} intensity={2.2} color="#dfe7ff" />
      <pointLight position={[-4, -2, 3]} intensity={30} color={ORANGE} distance={12} />
      <pointLight position={[3, 3, -3]} intensity={24} color="#5f7dff" distance={12} />
      {/* Procedural studio lights for reflections: no network, tiny cube map. */}
      <Environment resolution={64}>
        <Lightformer form="rect" intensity={4} position={[0, 5, -2]} scale={[10, 3, 1]} color="#cfdcff" />
        <Lightformer form="rect" intensity={2.5} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} color="#6f8cff" />
        <Lightformer form="rect" intensity={3} position={[5, -3, 2]} rotation-y={-Math.PI / 2} scale={[5, 2, 1]} color={GOLD} />
      </Environment>

      <group ref={rig}>
        <Globe clock={clock} />
        <Orbit radius={1.95} tilt={[1.25, 0.2, 0]} speed={0.32} phase={0.4} clock={clock}>
          <mesh rotation={[Math.PI / 2, 0, 0.5]}>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 40]} />
            <meshPhysicalMaterial color={GOLD} metalness={0.9} roughness={0.22} clearcoat={0.6} />
          </mesh>
        </Orbit>
        <Orbit radius={2.5} tilt={[1.05, -0.55, 0.3]} speed={-0.2} phase={2.4} clock={clock}>
          <mesh>
            <octahedronGeometry args={[0.17, 0]} />
            <meshPhysicalMaterial color="#bfd0ff" metalness={0.4} roughness={0.08} clearcoat={1} flatShading />
          </mesh>
        </Orbit>
        <Orbit radius={3.05} tilt={[1.45, 0.7, -0.2]} speed={0.13} phase={4.6} clock={clock}>
          <mesh>
            <sphereGeometry args={[0.13, 24, 18]} />
            <meshPhysicalMaterial color="#ffffff" metalness={0.2} roughness={0.2} clearcoat={1} />
          </mesh>
        </Orbit>

        {shards.map(([x, y, z, s], i) => (
          <Float key={i} speed={reduced ? 0 : 0.9} rotationIntensity={0.9} floatIntensity={1.1}>
            <mesh position={[x, y, z]} scale={s} rotation={[i, i * 1.7, 0]}>
              {i % 2 ? <icosahedronGeometry args={[1, 0]} /> : <octahedronGeometry args={[1, 0]} />}
              <meshPhysicalMaterial
                color={i % 3 === 0 ? GOLD : "#4a6ae0"}
                metalness={0.55}
                roughness={0.16}
                clearcoat={1}
                flatShading
                transparent
                opacity={0.9}
              />
            </mesh>
          </Float>
        ))}
      </group>

      <Sparkles count={mobile ? 28 : 70} scale={[11, 8, 6]} size={2.2} speed={reduced ? 0 : 0.25} opacity={0.55} color={LINE} />
    </>
  )
}
