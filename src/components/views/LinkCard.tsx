export default function LinkCard({
  href,
  title,
  description,
  openLabel = "Open form",
}: {
  href: string
  title: string
  description: string
  openLabel?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-yefa-blue/30 hover:shadow-[0_18px_30px_-18px_rgba(16,20,43,0.25)]"
    >
      <h3 className="text-lg font-semibold text-yefa-navy">{title}</h3>
      <p className="mt-1 text-sm text-yefa-ink">{description}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-yefa-blue">
        {openLabel}
        <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
      </span>
    </a>
  )
}
