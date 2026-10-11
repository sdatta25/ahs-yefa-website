import { useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"

export default function PostCarousel({
  images,
  captions,
  alt,
}: {
  images: string[]
  captions?: string[]
  alt: string
}) {
  const [index, setIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, width: 0 })

  function clamp(i: number) {
    return Math.max(0, Math.min(images.length - 1, i))
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    const el = containerRef.current
    if (!el || images.length < 2) return
    drag.current = { active: true, startX: e.clientX, width: el.clientWidth }
    setIsDragging(true)
    el.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return
    let dx = e.clientX - drag.current.startX
    // Rubber-band resistance past the first/last image.
    if ((index === 0 && dx > 0) || (index === images.length - 1 && dx < 0)) {
      dx = dx / 3
    }
    setDragOffset(dx)
  }

  function endDrag(e: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return
    drag.current.active = false
    containerRef.current?.releasePointerCapture(e.pointerId)
    const threshold = drag.current.width * 0.18
    let next = index
    if (dragOffset < -threshold) next = clamp(index + 1)
    else if (dragOffset > threshold) next = clamp(index - 1)
    setIndex(next)
    setDragOffset(0)
    setIsDragging(false)
  }

  const trackStyle = {
    transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
    transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.2, 0, 0.1, 1)",
  }

  const caption = captions?.[index]?.trim()

  return (
    <div>
      <div
        ref={containerRef}
        className="group/carousel relative select-none overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ touchAction: "pan-y" }}
      >
        <div className="flex aspect-square w-full cursor-grab active:cursor-grabbing" style={trackStyle}>
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${alt} — image ${i + 1} of ${images.length}`}
              draggable={false}
              className="aspect-square w-full shrink-0 object-cover"
            />
          ))}
        </div>

        {images.length > 1 && (
          <>
            {index > 0 && (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  setIndex(clamp(index - 1))
                }}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-yefa-navy shadow transition hover:bg-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
            {index < images.length - 1 && (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  setIndex(clamp(index + 1))
                }}
                aria-label="Next image"
                className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-yefa-navy shadow transition hover:bg-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`block h-1.5 w-1.5 rounded-full shadow transition-colors ${
                    i === index ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>

            <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
              {index + 1}/{images.length}
            </span>
          </>
        )}
      </div>

      {caption && (
        <p className="border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-medium text-yefa-navy">
          {caption}
        </p>
      )}
    </div>
  )
}
