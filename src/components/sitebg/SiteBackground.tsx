import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import Orbs from "./Orbs"
import { supportsWebGL, usePrefersReducedMotion } from "../../lib/motion"

export default function SiteBackground({ calm = false }: { calm?: boolean }) {
  const scrollRef = useRef(0)
  const reduced = usePrefersReducedMotion()
  const webglOk = useMemo(() => supportsWebGL(), [])
  const [dense, setDense] = useState(() => window.innerWidth >= 768)

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      scrollRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    function onResize() {
      setDense(window.innerWidth >= 768)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  if (!webglOk) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 7], fov: 50 }}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          frameloop={reduced ? "demand" : "always"}
        >
          <Orbs reduced={reduced} dense={dense} calm={calm} scrollRef={scrollRef} />
        </Canvas>
      </Suspense>
    </div>
  )
}
