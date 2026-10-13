import PageHeader from "../components/PageHeader"
import DocumentListView from "../components/views/DocumentListView"

export default function Forms() {
  return (
    <div>
      <PageHeader title="Forms" subtitle="Sign-ups and submissions for YEFA competitions and events." />

      <section className="mx-auto max-w-3xl px-5 py-20">
        <DocumentListView
          section="forms"
          emptyTitle="Competition sign-up forms coming soon."
          emptyBody="Check back here once registration opens."
          openLabel="Open form"
        />
      </section>
    </div>
  )
}
