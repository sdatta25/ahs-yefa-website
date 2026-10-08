import { useRef } from "react"
import type { PointerEvent } from "react"
import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from "framer-motion"
import BrandLogo from "./BrandLogo"

const REVOLUTION_MS = 16000

export default function RevolvingLogo() {
  const ref = useRef<HTMLDivElement>(null)
  const autoY = useMotionValue(0)
  const py = useMotionValue(0.5)
  const springX = useSpring(useTransform(py, [0, 1], [8, -8]), { stiffness: 120, damping: 20 })

  useAnimationFrame((t) => {
    autoY.set((t / REVOLUTION_MS) * 360)
  })

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    py.set((e.clientY - rect.top) / rect.height)
  }

  function handleLeave() {
    py.set(0.5)
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative mx-auto flex w-full max-w-sm items-center justify-center [perspective:1400px]"
    >
      <div className="absolute inset-6 rounded-[2rem] bg-white/60 blur-2xl" />

      <motion.div
        style={{ rotateY: autoY, rotateX: springX, transformStyle: "preserve-3d" }}
        className="relative w-full"
      >
        <div
          className="relative flex w-full items-center justify-center rounded-[2rem] border border-white bg-white/90 p-8 shadow-[0_30px_60px_-20px_rgba(27,47,107,0.3)] backdrop-blur"
          style={{ backfaceVisibility: "hidden" }}
        >
          <BrandLogo size="lg" />
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center rounded-[2rem] border border-white/20 bg-gradient-to-br from-yefa-blue-dark to-yefa-blue p-8 shadow-[0_30px_60px_-20px_rgba(27,47,107,0.3)]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-2xl font-black tracking-wide text-white/90">AHS YEFA</span>
        </div>
      </motion.div>
    </div>
  )
}
