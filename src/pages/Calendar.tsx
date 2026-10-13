import PageHeader from "../components/PageHeader"
import CalendarView from "../components/views/CalendarView"

export default function Calendar() {
  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle="This is where you can find upcoming YEFA meetings and competitions throughout the year. All times Eastern."
      />

      <section className="mx-auto max-w-5xl px-5 py-16">
        <CalendarView />
      </section>
    </div>
  )
}
