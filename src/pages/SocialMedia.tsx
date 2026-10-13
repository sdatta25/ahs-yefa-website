import PageHeader from "../components/PageHeader"
import SocialFeedView from "../components/views/SocialFeedView"

export default function SocialMedia() {
  return (
    <div>
      <PageHeader title="Social Media" subtitle="Recent posts from our Instagram." />

      <section className="mx-auto max-w-5xl px-5 py-20">
        <SocialFeedView />
      </section>
    </div>
  )
}
