import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import MarketScene from "./MarketScene"
import { buildMarket, COLS, ROWS } from "./marketData"
import { supportsWebGL, usePrefersReducedMotion } from "../../lib/motion"

// Flat version of the same market for devices without WebGL: the front row
// as a bar chart.
function FlatMarket() {
  const bars = useMemo(() => buildMarket().filter((b) => b.row === ROWS - 1), [])
  const max = Math.max(...bars.map((b) => b.height))
  return (
    <svg viewBox={`0 0 ${COLS * 10} 120`} className="h-full w-full" preserveAspectRatio="xMidYMax meet">
      {bars.map((b) => {
        const h = (b.height / max) * 110
        return (
          <rect
            key={b.col}
            x={b.col * 10 + 2}
            y={120 - h}
            width={6}
            height={h}
            fill={b.today ? "#e2861c" : b.up ? "#2b4fc2" : "#b9c3dc"}
          />
        )
      })}
    </svg>
  )
}

export default function HeroMarket() {
  const reduced = usePrefersReducedMotion()
  const webgl = useMemo(() => supportsWebGL(), [])
  const wrap = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    io.observe(el)
    function onMove(e: PointerEvent) {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      }
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener("pointermove", onMove)
    }
  }, [])

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      {webgl ? (
        <Suspense fallback={null}>
          <Canvas
            dpr={[1, 1.75]}
            camera={{ fov: 38, near: 0.1, far: 60 }}
            gl={{ antialias: true, alpha: true }}
            frameloop={visible ? (reduced ? "demand" : "always") : "never"}
          >
            <MarketScene reduced={reduced} pointer={pointer} />
          </Canvas>
        </Suspense>
      ) : (
        <div className="absolute inset-x-0 bottom-0 h-2/3 px-6">
          <FlatMarket />
        </div>
      )}
    </div>
  )
}
