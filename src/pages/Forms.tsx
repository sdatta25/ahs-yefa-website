import PageHeader from "../components/PageHeader"
import DocumentListView from "../components/views/DocumentListView"
import LinkCard from "../components/views/LinkCard"
import { SITE } from "../data/site"

export default function Forms() {
  return (
    <div>
      <PageHeader title="Forms" subtitle="Sign-ups and submissions for YEFA competitions and events." />

      <section className="mx-auto max-w-3xl px-5 py-20">
        <div className="mb-4">
          <LinkCard href={SITE.econBowlForm} title="Econ Bowl Sign-Up" description="Sign up to compete in the Econ Bowl." />
        </div>
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
