import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import FinanceScene from "./FinanceScene"
import { supportsWebGL, usePrefersReducedMotion } from "../../lib/motion"

// Flat stand-in for devices without WebGL: a globe and a coin stack.
function FlatObjects() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <circle cx="120" cy="90" r="58" fill="#2b4fc2" />
      <ellipse cx="120" cy="90" rx="84" ry="22" fill="none" stroke="#e2861c" strokeWidth="5" transform="rotate(-18 120 90)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x="196" y={178 - i * 13} width="80" height="13" fill="#e2861c" />
          <ellipse cx="236" cy={178 - i * 13} rx="40" ry="9" fill="#f0a64d" />
        </g>
      ))}
    </svg>
  )
}

export default function HeroObjects() {
  const reduced = usePrefersReducedMotion()
  const webglSupported = useMemo(() => supportsWebGL(), [])
  const [contextLost, setContextLost] = useState(false)
  const webgl = webglSupported && !contextLost
  const wrap = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const [visible, setVisible] = useState(true)
  const [narrow, setNarrow] = useState(() => window.innerWidth < 1024)

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
    function onResize() {
      setNarrow(window.innerWidth < 1024)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      io.disconnect()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      {webgl ? (
        <Suspense fallback={null}>
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0.2, 8.5], fov: 36 }}
            gl={{ antialias: true, alpha: true }}
            frameloop={visible ? (reduced ? "demand" : "always") : "never"}
            onCreated={({ gl }) => {
              // If the GPU drops the canvas, show the flat drawing instead.
              gl.domElement.addEventListener("webglcontextlost", () => setContextLost(true), { once: true })
            }}
          >
            <FinanceScene reduced={reduced} pointer={pointer} narrow={narrow} />
          </Canvas>
        </Suspense>
      ) : (
        <div className="absolute inset-0 p-8">
          <FlatObjects />
        </div>
      )}
    </div>
  )
}
