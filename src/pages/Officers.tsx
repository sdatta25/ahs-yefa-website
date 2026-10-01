import PageHeader from "../components/PageHeader"
import OfficerCard from "../components/OfficerCard"
import { OFFICERS } from "../data/officers"

export default function Officers() {
  return (
    <div>
      <PageHeader
        title="Meet the Officers"
        subtitle="The students leading YEFA this year."
      />

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mb-8 rounded-xl border border-dashed border-yefa-orange/50 bg-yefa-orange/5 px-4 py-3 text-sm text-yefa-orange-light">
          <span className="font-semibold text-yefa-orange">Placeholder officers.</span>{" "}
          <span className="text-slate-600">
            Send over the officer introduction social media posts and this grid will be updated
            with real names, positions, and photos.
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {OFFICERS.map((officer, i) => (
            <OfficerCard key={i} officer={officer} />
          ))}
        </div>
      </section>
    </div>
  )
}
