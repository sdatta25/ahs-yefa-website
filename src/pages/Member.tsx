import PageHeader from "../components/PageHeader"
import { useSession } from "../lib/useSession"
import { supabase } from "../lib/supabase"

export default function Member() {
  const { session } = useSession()
  const email = session?.user.email ?? ""

  return (
    <div>
      <PageHeader title="Member Portal" subtitle={`Signed in as ${email}`} />

      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-yefa-navy">You're signed in.</h2>
          <p className="mt-2 text-sm text-yefa-ink">
            Calendar, resources, points, social, competitions, and forms land here next.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-6 rounded-lg px-5 py-2 text-sm font-semibold text-yefa-ink ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </section>
    </div>
  )
}
