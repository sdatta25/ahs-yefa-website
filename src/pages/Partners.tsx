import PageHeader from "../components/PageHeader"
import { PARTNERS } from "../data/partners"

export default function Partners() {
  return (
    <div>
      <PageHeader title="Partners" subtitle="Organizations we work with." />

      <section className="mx-auto max-w-5xl px-5 py-20">
        {PARTNERS.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="text-lg font-semibold text-yefa-navy">No partners listed yet.</h2>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNERS.map((p) => {
              const Card = (
                <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-center transition hover:-translate-y-0.5 hover:border-yefa-blue/30 hover:shadow-[0_18px_30px_-18px_rgba(16,20,43,0.25)]">
                  {p.logo ? (
                    <img src={p.logo} alt={p.name} className="h-16 w-auto object-contain" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yefa-blue-50 text-xl font-bold text-yefa-blue">
                      {p.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-yefa-navy">{p.name}</h3>
                    {p.description && <p className="mt-1 text-sm text-yefa-ink">{p.description}</p>}
                  </div>
                </div>
              )
              return p.url ? (
                <a key={p.name} href={p.url} target="_blank" rel="noreferrer">
                  {Card}
                </a>
              ) : (
                <div key={p.name}>{Card}</div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
