import { useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"

export default function PostCarousel({ images, alt }: { images: string[]; alt: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const drag = useRef<{ active: boolean; startX: number; startScrollLeft: number; moved: boolean }>({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  })

  function handleScroll() {
    const el = trackRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    setIndex(i)
  }

  function goTo(i: number) {
    const el = trackRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(images.length - 1, i))
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" })
  }

  // Mouse drag-to-scroll — overflow-x containers don't support this natively
  // the way they support touch/trackpad swipes, so we drive it manually.
  // Snap is turned off while dragging: CSS scroll-snap fights any scrollLeft
  // that isn't already aligned to a snap point, which silently cancels drag
  // movement if left on (snaps straight back to the nearest image).
  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return
    const el = trackRef.current
    if (!el) return
    el.style.scrollSnapType = "none"
    drag.current = { active: true, startX: e.clientX, startScrollLeft: el.scrollLeft, moved: false }
    el.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return
    const el = trackRef.current
    if (!el) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 3) drag.current.moved = true
    el.scrollLeft = drag.current.startScrollLeft - dx
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return
    drag.current.active = false
    const el = trackRef.current
    el?.releasePointerCapture(e.pointerId)
    if (el) {
      const i = Math.round(el.scrollLeft / el.clientWidth)
      el.style.scrollSnapType = ""
      goTo(i)
    }
  }

  return (
    <div className="group/carousel relative">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClickCapture={(e) => {
          if (drag.current.moved) e.preventDefault()
        }}
        className="flex aspect-square w-full cursor-grab snap-x snap-proximity overflow-x-auto scroll-smooth active:cursor-grabbing"
        style={{
          scrollbarWidth: "none",
          touchAction: "pan-x",
          overscrollBehaviorX: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${alt} — image ${i + 1} of ${images.length}`}
            draggable={false}
            className="aspect-square w-full shrink-0 snap-center object-cover"
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          {index > 0 && (
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-yefa-navy shadow transition hover:bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}
          {index < images.length - 1 && (
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-yefa-navy shadow transition hover:bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
                className="p-1"
              >
                <span
                  className={`block h-1.5 w-1.5 rounded-full shadow transition-colors ${
                    i === index ? "bg-white" : "bg-white/50"
                  }`}
                />
              </button>
            ))}
          </div>

          <span className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
            {index + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  )
}
