import PageHeader from "../components/PageHeader"
import CompetitionsView from "../components/views/CompetitionsView"

export default function Competitions() {
  return (
    <div>
      <PageHeader
        title="Competitions"
        subtitle="Competitions YEFA members can prep for and compete in throughout the year."
      />

      <section className="mx-auto max-w-5xl px-5 py-16">
        <CompetitionsView />
      </section>
    </div>
  )
}
