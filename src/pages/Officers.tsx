import { useState } from "react"
import PageHeader from "../components/PageHeader"
import OfficerCard from "../components/OfficerCard"
import OfficerPortal from "../components/OfficerPortal"
import { OFFICERS } from "../data/officers"

export default function Officers() {
  const [portalOpen, setPortalOpen] = useState(false)

  return (
    <div>
      <PageHeader title="Meet the Officers" subtitle="The students leading YEFA this year." />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-10 flex items-start gap-3 rounded-2xl border border-yefa-orange/25 bg-yefa-orange/5 px-5 py-4 text-sm">
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-yefa-orange" />
          <p className="text-yefa-ink">
            <span className="font-semibold text-yefa-navy">Placeholder officers.</span>{" "}
            Send over the officer introduction social media posts and this grid will be
            updated with real names, positions, and photos.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {OFFICERS.map((officer, i) => (
            <OfficerCard key={i} officer={officer} />
          ))}
        </div>

        <div className="mt-16 border-t border-slate-200 pt-10">
          <button
            onClick={() => setPortalOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-yefa-ink hover:text-yefa-blue"
          >
            <span className={`inline-block transition-transform ${portalOpen ? "rotate-90" : ""}`}>&rsaquo;</span>
            Officer Portal
          </button>
          {portalOpen && (
            <div className="mt-6">
              <OfficerPortal />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
