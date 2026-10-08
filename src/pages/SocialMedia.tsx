import { useEffect, useState } from "react"
import PageHeader from "../components/PageHeader"
import { fetchDocuments, type DocItem } from "../lib/api"
import { SITE } from "../data/site"

export default function SocialMedia() {
  const [posts, setPosts] = useState<DocItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments("social")
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="Social Media" subtitle="Recent posts from our Instagram." />

      <section className="mx-auto max-w-5xl px-5 py-20">
        {loading ? (
          <p className="text-center text-sm text-yefa-ink">Loading&hellip;</p>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="text-lg font-semibold text-yefa-navy">No recent posts yet.</h2>
            <p className="mt-2 text-sm text-yefa-ink">
              Follow us on Instagram{" "}
              <a href={SITE.instagram} target="_blank" rel="noreferrer" className="font-semibold text-yefa-blue hover:underline">
                @alpharettayefa
              </a>{" "}
              for the latest.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-yefa-blue/30 hover:shadow-[0_18px_30px_-18px_rgba(16,20,43,0.25)]"
                >
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="aspect-square w-full object-cover" />
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center bg-yefa-blue-50 text-yefa-blue">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor" className="h-12 w-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.19 2.19 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.19 2.19 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-yefa-navy">{p.title}</h3>
                    {p.description && <p className="mt-1 text-sm text-yefa-ink">{p.description}</p>}
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-yefa-blue">
                      View post
                      <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <p className="mt-10 text-center text-sm text-yefa-ink">
              Follow us on Instagram{" "}
              <a href={SITE.instagram} target="_blank" rel="noreferrer" className="font-semibold text-yefa-blue hover:underline">
                @alpharettayefa
              </a>{" "}
              for more.
            </p>
          </>
        )}
      </section>
    </div>
  )
}
