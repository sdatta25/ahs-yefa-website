import type { ReactNode } from "react"

const STAGE =
  "radial-gradient(50% 80% at 85% 110%, rgba(226,134,28,0.2), transparent 70%), radial-gradient(120% 140% at 15% 0%, #1c3486 0%, #0f1b3d 50%, #070d22 100%)"

// tone="dark" is the navy band used on the signed-in dashboards.
export default function PageHeader({
  title,
  subtitle,
  tone = "light",
}: {
  title: string
  subtitle?: ReactNode
  tone?: "light" | "dark"
}) {
  const dark = tone === "dark"
  return (
    <header className={dark ? "text-white" : "border-b border-yefa-rule"} style={dark ? { background: STAGE } : undefined}>
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:pb-12 sm:pt-20">
        <h1 className={`display-wide text-[2.75rem] sm:text-6xl ${dark ? "text-white" : "text-yefa-navy"}`}>{title}</h1>
        {subtitle && (
          <p
            className={`mt-4 max-w-2xl text-lg leading-relaxed ${
              dark ? "text-slate-300 [&_button]:text-yefa-orange-light" : "text-yefa-ink"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </header>
  )
}
