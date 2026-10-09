import PageHeader from "../components/PageHeader"
import OfficerCard from "../components/OfficerCard"
import { OFFICERS } from "../data/officers"

export default function Officers() {
  return (
    <div>
      <PageHeader title="Meet the Officers" subtitle="The students leading YEFA this year." />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {OFFICERS.map((officer, i) => (
            <OfficerCard key={i} officer={officer} />
          ))}
        </div>
      </section>
    </div>
  )
}
