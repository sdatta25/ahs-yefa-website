import { useLayoutEffect, useMemo, useRef } from "react"
import type { MutableRefObject } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { buildMarket, COLS, ROWS } from "./marketData"

const STEP_X = 0.46
const STEP_Z = 0.62
const BAR_W = 0.3
const INTRO_SECONDS = 2.6
const HEIGHT_SCALE = 0.62

const COLOR_UP = new THREE.Color("#2b4fc2")
const COLOR_DOWN = new THREE.Color("#b9c3dc")
const COLOR_TODAY = new THREE.Color("#e2861c")

// Camera starts low and close to the first day, then settles back to show
// the whole market.
const CAM_START = new THREE.Vector3(-8.5, 0.8, 3.6)
const CAM_END = new THREE.Vector3(-1.6, 5.2, 17.5)
const LOOK_START = new THREE.Vector3(-6.5, 0.5, 0)
const LOOK_END = new THREE.Vector3(2.3, 1.4, 0)
// Narrow (phone) canvases frame the most recent days, closer in.
const CAM_END_NARROW = new THREE.Vector3(2.2, 4.4, 12.5)
const LOOK_END_NARROW = new THREE.Vector3(4.4, 1.7, 0)

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

export default function MarketScene({
  reduced,
  pointer,
}: {
  reduced: boolean
  pointer: MutableRefObject<{ x: number; y: number }>
}) {
  const bars = useMemo(() => buildMarket(), [])
  const mesh = useRef<THREE.InstancedMesh>(null)
  const elapsed = useRef(reduced ? INTRO_SECONDS : 0)
  const look = useRef(new THREE.Vector3())
  const { camera, invalidate, size } = useThree()
  const narrow = size.width / size.height < 1.25
  const camEnd = narrow ? CAM_END_NARROW : CAM_END
  const lookEnd = narrow ? LOOK_END_NARROW : LOOK_END
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(BAR_W, 1, BAR_W)
    g.translate(0, 0.5, 0) // grow up from the floor
    return g
  }, [])

  const placeBars = (progress: number) => {
    const m = mesh.current
    if (!m) return
    bars.forEach((bar, i) => {
      // A wave from the first day to today, front rows slightly ahead.
      const delay = (bar.col / COLS) * 0.62 + ((ROWS - 1 - bar.row) / ROWS) * 0.08
      const local = easeOutCubic(clamp01((progress - delay) / 0.3))
      dummy.position.set((bar.col - (COLS - 1) / 2) * STEP_X, 0, (bar.row - (ROWS - 1) / 2) * STEP_Z)
      dummy.scale.set(1, Math.max(0.0001, bar.height * HEIGHT_SCALE * local), 1)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    })
    m.instanceMatrix.needsUpdate = true
  }

  useLayoutEffect(() => {
    const m = mesh.current
    if (!m) return
    bars.forEach((bar, i) => m.setColorAt(i, bar.today ? COLOR_TODAY : bar.up ? COLOR_UP : COLOR_DOWN))
    if (m.instanceColor) m.instanceColor.needsUpdate = true
    placeBars(reduced ? 1 : 0)
    camera.position.copy(reduced ? camEnd : CAM_START)
    look.current.copy(reduced ? lookEnd : LOOK_START)
    camera.lookAt(look.current)
    invalidate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bars, reduced])

  useFrame((_, delta) => {
    const introDone = elapsed.current >= INTRO_SECONDS
    if (!introDone) {
      elapsed.current = Math.min(INTRO_SECONDS, elapsed.current + Math.min(delta, 0.05))
      placeBars(elapsed.current / INTRO_SECONDS)
    }

    const t = easeInOut(clamp01(elapsed.current / INTRO_SECONDS))
    const target = new THREE.Vector3().lerpVectors(CAM_START, camEnd, t)
    const lookTarget = new THREE.Vector3().lerpVectors(LOOK_START, lookEnd, t)

    // After the intro, the camera leans a little toward the pointer.
    if (introDone && !reduced) {
      target.x += pointer.current.x * 0.9
      target.y += pointer.current.y * 0.5
    }
    camera.position.lerp(target, introDone ? 0.06 : 1)
    look.current.lerp(lookTarget, introDone ? 0.06 : 1)
    camera.lookAt(look.current)
  })

  return (
    <>
      <hemisphereLight args={["#ffffff", "#aab6d6", 1.9]} />
      <directionalLight position={[5, 12, 8]} intensity={2.4} />
      <directionalLight position={[-9, 5, -3]} intensity={0.6} />
      <fog attach="fog" args={["#f4f6fa", 16, 30]} />
      <instancedMesh ref={mesh} args={[geometry, undefined, bars.length]}>
        <meshStandardMaterial roughness={0.55} metalness={0.05} />
      </instancedMesh>
    </>
  )
}
