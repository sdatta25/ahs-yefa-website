import { useEffect, useState } from "react"
import PageHeader from "../components/PageHeader"
import { fetchDocuments, type DocItem } from "../lib/api"

export default function Resources() {
  const [docs, setDocs] = useState<DocItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments("resources")
      .then(setDocs)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="Resources" subtitle="Guides and materials to help you prep and get involved." />

      <section className="mx-auto max-w-3xl px-5 py-20">
        {loading ? (
          <p className="text-center text-sm text-yefa-ink">Loading&hellip;</p>
        ) : docs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="text-lg font-semibold text-yefa-navy">Resources coming soon.</h2>
            <p className="mt-2 text-sm text-yefa-ink">Study guides, prep materials, and links will live here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {docs.map((d) => (
              <a
                key={d.id}
                href={d.url}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-yefa-blue/30 hover:shadow-[0_18px_30px_-18px_rgba(16,20,43,0.25)]"
              >
                <h3 className="text-lg font-semibold text-yefa-navy">{d.title}</h3>
                {d.description && <p className="mt-1 text-sm text-yefa-ink">{d.description}</p>}
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-yefa-blue">
                  Open
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </span>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
