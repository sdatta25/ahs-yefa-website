import type { ReactNode } from "react"

export default function PageHeader({ title, subtitle }: { title: string; subtitle?: ReactNode }) {
  return (
    <header className="border-b border-yefa-rule">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:pb-12 sm:pt-20">
        <h1 className="display-wide text-[2.75rem] text-yefa-navy sm:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-yefa-ink">{subtitle}</p>}
      </div>
    </header>
  )
}
