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
      className="group block rounded-md border border-yefa-rule bg-white p-5 transition-colors hover:border-yefa-blue/50"
    >
      <h3 className="text-lg font-semibold text-yefa-navy">{title}</h3>
      <p className="mt-1 text-sm text-yefa-ink">{description}</p>
      <span className="mt-3 inline-block text-sm font-semibold text-yefa-blue group-hover:underline">
        {openLabel}
      </span>
    </a>
  )
}
