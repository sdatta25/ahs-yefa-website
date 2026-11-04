import { useMemo, useRef } from "react"
import type { MutableRefObject, ReactNode } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import * as THREE from "three"

// Four simple finance objects built from primitives, in the logo's colors.
const BLUE = "#2b4fc2"
const BLUE_LIGHT = "#7d93e0"
const ORANGE = "#e2861c"
const ORANGE_DARK = "#b9660c"
const NAVY = "#0f1b3d"
const PAPER = "#f4f6fa"
const PIG = "#f3b5c5"

const INTRO_SECONDS = 2.4
const easeOutBack = (t: number) => {
  const c1 = 1.4
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

// Flies an object in from `from` (and a spin) to its resting place, then
// lets it bob gently.
function Arrive({
  children,
  at,
  from,
  spin = [0, 0, 0],
  rest = [0, 0, 0],
  delay,
  bob = 0.08,
  reduced,
  clock,
}: {
  children: ReactNode
  at: [number, number, number]
  from: [number, number, number]
  spin?: [number, number, number]
  rest?: [number, number, number]
  delay: number
  bob?: number
  reduced: boolean
  clock: MutableRefObject<number>
}) {
  const group = useRef<THREE.Group>(null)
  const phase = useMemo(() => delay * 7.3, [delay])

  useFrame(() => {
    const g = group.current
    if (!g) return
    const t = reduced ? 1 : easeOutBack(clamp01((clock.current - delay) / 1.1))
    const idle = reduced ? 0 : Math.max(0, clock.current - INTRO_SECONDS)
    const float = reduced ? 0 : Math.sin(idle * 0.9 + phase) * bob * clamp01(idle)
    g.position.set(
      from[0] + (at[0] - from[0]) * t,
      from[1] + (at[1] - from[1]) * t + float,
      from[2] + (at[2] - from[2]) * t,
    )
    g.rotation.set(
      rest[0] + spin[0] * (1 - t),
      rest[1] + spin[1] * (1 - t) + (reduced ? 0 : Math.sin(idle * 0.5 + phase) * 0.06),
      rest[2] + spin[2] * (1 - t),
    )
    g.scale.setScalar(Math.max(0.001, reduced ? 1 : clamp01((clock.current - delay) / 0.35)))
  })

  return <group ref={group}>{children}</group>
}

function Coin({ y = 0, x = 0, z = 0, tilt = 0 }: { y?: number; x?: number; z?: number; tilt?: number }) {
  return (
    <group position={[x, y, z]} rotation={[0, 0, tilt]}>
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 0.13, 48]} />
        <meshStandardMaterial color={ORANGE} roughness={0.38} metalness={0.12} />
      </mesh>
      {/* raised rim on the top face */}
      <mesh position={[0, 0.068, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.025, 12, 48]} />
        <meshStandardMaterial color={ORANGE_DARK} roughness={0.42} metalness={0.1} />
      </mesh>
    </group>
  )
}

function CoinStack() {
  const offsets = [0, 0.03, -0.02, 0.04, -0.01, 0.02]
  return (
    <group>
      {offsets.map((dx, i) => (
        <Coin key={i} x={dx} z={-dx} y={i * 0.14} />
      ))}
    </group>
  )
}

function Globe() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.78, 48, 32]} />
        <meshStandardMaterial color={BLUE} roughness={0.5} />
      </mesh>
      {/* latitude and longitude lines */}
      {[-0.42, 0, 0.42].map((y) => (
        <mesh key={`lat${y}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[Math.sqrt(0.79 * 0.79 - y * y), 0.008, 6, 96]} />
          <meshBasicMaterial color={BLUE_LIGHT} />
        </mesh>
      ))}
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((r) => (
        <mesh key={`lon${r}`} rotation={[0, r, 0]}>
          <torusGeometry args={[0.79, 0.008, 6, 96]} />
          <meshBasicMaterial color={BLUE_LIGHT} />
        </mesh>
      ))}
      {/* orbit ring */}
      <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[1.1, 0.028, 12, 96]} />
        <meshStandardMaterial color={ORANGE} roughness={0.38} metalness={0.12} />
      </mesh>
      <mesh position={[1.08, 0.16, 0.08]}>
        <sphereGeometry args={[0.08, 16, 12]} />
        <meshStandardMaterial color={ORANGE} roughness={0.38} metalness={0.12} />
      </mesh>
    </group>
  )
}

function PiggyBank() {
  const legs: [number, number][] = [
    [0.42, 0.28],
    [0.42, -0.28],
    [-0.42, 0.28],
    [-0.42, -0.28],
  ]
  return (
    <group>
      <mesh scale={[1.15, 0.9, 0.88]}>
        <sphereGeometry args={[0.62, 40, 28]} />
        <meshStandardMaterial color={PIG} roughness={0.45} />
      </mesh>
      {/* snout */}
      <mesh position={[0.72, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.22, 0.16, 32]} />
        <meshStandardMaterial color={PIG} roughness={0.45} />
      </mesh>
      <mesh position={[0.805, 0.05, 0.07]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.02, 12]} />
        <meshStandardMaterial color={NAVY} />
      </mesh>
      <mesh position={[0.805, 0.05, -0.07]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.02, 12]} />
        <meshStandardMaterial color={NAVY} />
      </mesh>
      {/* eyes */}
      <mesh position={[0.5, 0.25, 0.27]}>
        <sphereGeometry args={[0.045, 12, 10]} />
        <meshStandardMaterial color={NAVY} />
      </mesh>
      <mesh position={[0.5, 0.25, -0.27]}>
        <sphereGeometry args={[0.045, 12, 10]} />
        <meshStandardMaterial color={NAVY} />
      </mesh>
      {/* ears */}
      <mesh position={[0.25, 0.52, 0.24]} rotation={[0.3, 0, -0.3]}>
        <coneGeometry args={[0.12, 0.22, 16]} />
        <meshStandardMaterial color={PIG} roughness={0.45} />
      </mesh>
      <mesh position={[0.25, 0.52, -0.24]} rotation={[-0.3, 0, -0.3]}>
        <coneGeometry args={[0.12, 0.22, 16]} />
        <meshStandardMaterial color={PIG} roughness={0.45} />
      </mesh>
      {legs.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, -0.55, z]}>
          <cylinderGeometry args={[0.1, 0.1, 0.24, 16]} />
          <meshStandardMaterial color={PIG} roughness={0.45} />
        </mesh>
      ))}
      {/* coin slot, with a coin going in */}
      <mesh position={[-0.05, 0.555, 0]}>
        <boxGeometry args={[0.36, 0.03, 0.07]} />
        <meshStandardMaterial color={NAVY} />
      </mesh>
      <group position={[-0.05, 0.74, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.17, 0.17, 0.04, 32]} />
          <meshStandardMaterial color={ORANGE} roughness={0.38} metalness={0.12} />
        </mesh>
      </group>
      {/* tail */}
      <mesh position={[-0.74, 0.12, 0]} rotation={[0, 0, 0.6]}>
        <torusGeometry args={[0.07, 0.022, 8, 20, Math.PI * 1.5]} />
        <meshStandardMaterial color={PIG} roughness={0.45} />
      </mesh>
    </group>
  )
}

function Calculator() {
  const keys: { x: number; y: number; accent: boolean }[] = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      keys.push({ x: -0.3 + c * 0.2, y: -0.06 - r * 0.2, accent: c === 3 })
    }
  }
  return (
    <group>
      <RoundedBox args={[1, 1.4, 0.16]} radius={0.07} smoothness={4}>
        <meshStandardMaterial color={NAVY} roughness={0.5} />
      </RoundedBox>
      {/* screen */}
      <RoundedBox args={[0.8, 0.3, 0.04]} radius={0.02} smoothness={3} position={[0, 0.43, 0.085]}>
        <meshStandardMaterial color="#dfe7f7" roughness={0.3} />
      </RoundedBox>
      {keys.map((k) => (
        <RoundedBox
          key={`${k.x}${k.y}`}
          args={[0.15, 0.15, 0.05]}
          radius={0.025}
          smoothness={3}
          position={[k.x, k.y, 0.09]}
        >
          <meshStandardMaterial color={k.accent ? ORANGE : PAPER} roughness={0.4} />
        </RoundedBox>
      ))}
    </group>
  )
}

export default function FinanceScene({
  reduced,
  pointer,
  narrow,
}: {
  reduced: boolean
  pointer: MutableRefObject<{ x: number; y: number }>
  narrow: boolean
}) {
  const clock = useRef(reduced ? INTRO_SECONDS : 0)
  const rig = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    clock.current += Math.min(delta, 0.25)
    // The whole set leans a little toward the pointer.
    const g = rig.current
    if (g && !reduced) {
      g.rotation.y += (pointer.current.x * 0.25 - g.rotation.y) * 0.05
      g.rotation.x += (-pointer.current.y * 0.12 - g.rotation.x) * 0.05
    }
  })

  const common = { reduced, clock }
  const s = narrow ? 0.95 : 1

  return (
    <>
      <hemisphereLight args={["#ffffff", "#b8c4e3", 1.6]} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} />
      <directionalLight position={[-5, 2, -2]} intensity={0.5} />

      <group ref={rig} scale={s} position={[narrow ? 0 : 0.35, 0, 0]}>
        <Arrive {...common} at={[0.5, 1.15, -0.4]} from={[0.5, 4.5, -0.4]} spin={[0, 3, 0.6]} rest={[0.2, 0, 0.15]} delay={0}>
          <Globe />
        </Arrive>
        <Arrive {...common} at={[-1.45, -0.6, 0.3]} from={[-5, -0.6, 0.3]} spin={[0, -1.4, 0]} rest={[0.1, 0.5, 0]} delay={0.25}>
          <PiggyBank />
        </Arrive>
        <Arrive {...common} at={[1.85, -0.3, -0.2]} from={[5.5, -0.3, -0.2]} spin={[0, 1.6, -0.5]} rest={[-0.12, -0.45, -0.12]} delay={0.45}>
          <Calculator />
        </Arrive>
        <Arrive {...common} at={[0.25, -1.35, 0.9]} from={[0.25, -4.5, 0.9]} spin={[0, 2.2, 0]} rest={[0.12, 0.3, 0]} delay={0.65} bob={0.05}>
          <CoinStack />
        </Arrive>
        {/* a few loose coins for depth */}
        <Arrive {...common} at={[-0.9, 1.5, -1.2]} from={[-3, 4, -1.2]} spin={[2, 0, 1]} rest={[1.2, 0, 0.4]} delay={0.85} bob={0.12}>
          <Coin />
        </Arrive>
        <Arrive {...common} at={[2.2, 1.55, -0.8]} from={[5, 4, -0.8]} spin={[-2, 0, -1]} rest={[1.1, 0, -0.6]} delay={1.0} bob={0.1}>
          <Coin />
        </Arrive>
      </group>

    </>
  )
}
