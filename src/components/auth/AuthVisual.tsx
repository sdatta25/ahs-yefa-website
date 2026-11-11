import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import AuthScene from "./AuthScene"
import { supportsWebGL, usePrefersReducedMotion } from "../../lib/motion"

// Canvas for the sign-in visual. Without WebGL (or if the GPU drops the
// canvas) the panel's gradient simply shows on its own.
export default function AuthVisual() {
  const reduced = usePrefersReducedMotion()
  const supported = useMemo(() => supportsWebGL(), [])
  const [lost, setLost] = useState(false)
  const [visible, setVisible] = useState(true)
  const wrap = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })

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
      {supported && !lost && (
        <Suspense fallback={null}>
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 10.6], fov: 40 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            frameloop={visible ? (reduced ? "demand" : "always") : "never"}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", () => setLost(true), { once: true })
            }}
          >
            <AuthScene reduced={reduced} pointer={pointer} />
          </Canvas>
        </Suspense>
      )}
    </div>
  )
}
