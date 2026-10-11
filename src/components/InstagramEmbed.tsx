import { useEffect, useRef } from "react"

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } }
  }
}

let scriptPromise: Promise<void> | null = null

function loadEmbedScript(): Promise<void> {
  if (window.instgrm) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://www.instagram.com/embed.js"
      script.async = true
      script.onload = () => resolve()
      document.body.appendChild(script)
    })
  }
  return scriptPromise
}

export default function InstagramEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    loadEmbedScript().then(() => {
      if (!cancelled) window.instgrm?.Embeds.process()
    })
    return () => {
      cancelled = true
    }
  }, [url])

  return (
    <div ref={ref} className="mx-auto flex justify-center overflow-hidden rounded-2xl">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ margin: 0, width: "100%", maxWidth: 540, minWidth: 280 }}
      />
    </div>
  )
}
