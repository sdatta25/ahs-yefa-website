import { useRef } from "react"
import type { PointerEvent, ReactNode } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

export default function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const springX = useSpring(px, { stiffness: 150, damping: 20 })
  const springY = useSpring(py, { stiffness: 150, damping: 20 })

  const rotateX = useTransform(springY, [0, 1], [8, -8])
  const rotateY = useTransform(springX, [0, 1], [-8, 8])
  const shineX = useTransform(springX, [0, 1], [0, 100])
  const shineY = useTransform(springY, [0, 1], [0, 100])

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  function handleLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div className="[perspective:1200px]" ref={ref} onPointerMove={handleMove} onPointerLeave={handleLeave}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative ${className}`}
      >
        {children}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background: useTransform(
              [shineX, shineY],
              ([x, y]: number[]) =>
                `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.5), transparent 55%)`,
            ),
          }}
        />
      </motion.div>
    </div>
  )
}
