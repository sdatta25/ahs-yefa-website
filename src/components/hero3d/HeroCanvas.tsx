import { Suspense, useEffect, useMemo, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import HeroScene from "./HeroScene"
import { supportsWebGL, usePrefersReducedMotion } from "../../lib/motion"

function StaticFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-40 w-40 rotate-45 rounded-3xl bg-gradient-to-br from-yefa-blue via-yefa-blue-light to-yefa-orange opacity-80 blur-[1px]" />
    </div>
  )
}

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef(0)
  const reduced = usePrefersReducedMotion()
  const webglOk = useMemo(() => supportsWebGL(), [])

  useEffect(() => {
    function onScroll() {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 while the hero is fully in view near the top, approaching 1 as it
      // scrolls out of view — drives the restrained scroll-linked motion.
      const progress = THREE_clamp((vh - rect.top) / (vh + rect.height), 0, 1)
      scrollRef.current = progress
    }
    function THREE_clamp(v: number, min: number, max: number) {
      return Math.min(Math.max(v, min), max)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full max-w-xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0d1330] via-[#10142b] to-[#161b3d] shadow-[0_40px_90px_-30px_rgba(16,20,43,0.55)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-white/10" />
      {webglOk ? (
        <Suspense fallback={<StaticFallback />}>
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: [0, 0.3, 4.4], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            shadows="basic"
          >
            <HeroScene reduced={reduced} scrollRef={scrollRef} />
          </Canvas>
        </Suspense>
      ) : (
        <StaticFallback />
      )}
    </div>
  )
}
