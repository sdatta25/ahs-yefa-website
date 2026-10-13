import PageHeader from "../components/PageHeader"
import DocumentListView from "../components/views/DocumentListView"

export default function Resources() {
  return (
    <div>
      <PageHeader title="Resources" subtitle="Guides and materials to help you prep and get involved." />

      <section className="mx-auto max-w-3xl px-5 py-20">
        <DocumentListView
          section="resources"
          emptyTitle="Resources coming soon."
          emptyBody="Study guides, prep materials, and links will live here."
        />
      </section>
    </div>
  )
}
