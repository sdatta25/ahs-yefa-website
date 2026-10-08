import PageHeader from "../components/PageHeader"

export default function Forms() {
  return (
    <div>
      <PageHeader title="Forms" subtitle="Sign-ups and submissions for YEFA competitions and events." />

      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12">
          <h2 className="text-lg font-semibold text-yefa-navy">Competition sign-up forms coming soon.</h2>
          <p className="mt-2 text-sm text-yefa-ink">Check back here once registration opens.</p>
        </div>
      </section>
    </div>
  )
}
