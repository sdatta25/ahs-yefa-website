import { useRef } from "react"
import type { PointerEvent } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"

const STEPS = 16
const STEP_SIZE = 2.6

function buildExtrudeShadow() {
  const shadows: string[] = []
  for (let i = 1; i <= STEPS; i++) {
    const color = i % 2 === 0 ? "#e8923a" : "#1e3a8a"
    shadows.push(`drop-shadow(${i * STEP_SIZE}px ${i * STEP_SIZE}px 0 ${color})`)
  }
  return shadows.join(" ")
}

const EXTRUDE_FILTER = buildExtrudeShadow()

const TEXT_EXTRUDE_SHADOW = Array.from({ length: 10 })
  .map((_, i) => {
    const n = i + 1
    const color = n % 2 === 0 ? "#e8923a" : "#1e3a8a"
    return `${n * 1.6}px ${n * 1.6}px 0 ${color}`
  })
  .join(", ")

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const idleAngle = useMotionValue(0)

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const springX = useSpring(px, { stiffness: 90, damping: 16 })
  const springY = useSpring(py, { stiffness: 90, damping: 16 })

  useAnimationFrame((t) => {
    idleAngle.set(Math.sin(t / 1800) * 7)
  })

  const mouseRotX = useTransform(springY, [0, 1], [14, -14])
  const mouseRotY = useTransform(springX, [0, 1], [-16, 16])
  const rotateY = useTransform(
    [mouseRotY, idleAngle],
    (values: number[]) => values[0] + values[1],
  )

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  function handlePointerLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="perspective-1000 flex w-full select-none flex-col items-center justify-center py-6"
    >
      <motion.div
        className="preserve-3d flex flex-col items-center"
        style={{ rotateX: mouseRotX, rotateY }}
        initial={{ scale: 0.25, opacity: 0, rotateZ: -8 }}
        animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 11, delay: 0.1 }}
      >
        <h2
          className="text-2xl font-black tracking-[0.3em] text-yefa-blue-dark sm:text-3xl"
          style={{ textShadow: TEXT_EXTRUDE_SHADOW }}
        >
          AHS
        </h2>
        <img
          src="/images/yefa-logo.svg"
          alt="YEFA"
          className="mt-4 w-[70vw] max-w-xl drop-shadow-xl"
          style={{ filter: EXTRUDE_FILTER }}
        />
      </motion.div>
    </div>
  )
}
