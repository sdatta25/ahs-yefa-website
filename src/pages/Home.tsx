import { lazy, Suspense } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { SITE } from "../data/site"
import ErrorBoundary from "../components/ErrorBoundary"
import { COMPETITIONS } from "../data/competitions"
import { OFFICERS } from "../data/officers"
import UpcomingList from "../components/views/UpcomingList"
import { useSession } from "../lib/useSession"

const OrbitVisual = lazy(() => import("../components/hero/OrbitVisual"))

const DOES = [
  {
    term: "Compete",
    body: `Members enter national economics, finance and business competitions, from the National Economics Challenge to stock pitches and case competitions. We track ${COMPETITIONS.length} of them.`,
  },
  {
    term: "Learn",
    body: "Meetings, guest speakers and hands-on workshops on personal finance, markets and how the economy works. No experience needed.",
  },
  {
    term: "Lead",
    body: `YEFA is run entirely by students. A team of ${OFFICERS.length} officers plans meetings, tracks deadlines and keeps the club going.`,
  },
]

export default function Home() {
  const { session } = useSession()
  const signedIn = Boolean(session)
  const reduceMotion = useReducedMotion()

  return (
    <div>
      {/* Hero: the 3D orbit on a deep navy stage, headline on the left. */}
      <section
        className="relative isolate overflow-hidden text-white"
        style={{ background: "radial-gradient(60% 50% at 78% 88%, rgba(226,134,28,0.22), transparent 70%), radial-gradient(120% 90% at 28% 18%, #1c3486 0%, #0f1b3d 46%, #070d22 100%)" }}
      >
        <div className="relative h-[40vh] min-h-[280px] lg:absolute lg:inset-y-0 lg:left-[40%] lg:right-0 lg:h-auto">
          <ErrorBoundary>
            <Suspense fallback={null}>
              <OrbitVisual />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-16 lg:flex lg:min-h-[min(calc(100vh-4.25rem),50rem)] lg:items-center lg:py-24">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            className="max-w-md"
          >
            <h1 className="display-wide text-[4rem] text-white sm:text-[6rem] lg:text-[7.25rem]">
              AHS YEFA
              <br />
              X YEI
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              The Youth Entrepreneurship &amp; Finance Association at Alpharetta High School, officially partnered with the Youth Economics Initiative. Members learn how
              markets work and compete in national economics, finance and investing competitions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-yefa-navy transition-colors hover:bg-yefa-blue-50"
              >
                Join YEFA
              </Link>
              <Link
                to="/calendar"
                className="rounded-md px-6 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 transition-colors hover:bg-white/10"
              >
                See the calendar
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What members do */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:py-28">
        <h2 className="text-3xl font-bold sm:text-4xl">What members do</h2>
        <dl className="divide-y divide-yefa-rule border-y border-yefa-rule">
          {DOES.map((item) => (
            <div key={item.term} className="grid gap-2 py-7 sm:grid-cols-[10rem_1fr] sm:gap-8">
              <dt className="font-display text-xl font-bold [font-stretch:118%]">{item.term}</dt>
              <dd className="max-w-xl leading-relaxed text-yefa-ink">{item.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Next up + competitions */}
      <section className="border-t border-yefa-rule bg-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-3xl font-bold sm:text-4xl">Next up</h2>
              <Link to="/calendar" className="text-sm font-semibold text-yefa-blue hover:underline">
                Full calendar
              </Link>
            </div>
            <div className="mt-8">
              <UpcomingList limit={3} />
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-3xl font-bold sm:text-4xl">Competitions</h2>
              <Link to="/competitions" className="text-sm font-semibold text-yefa-blue hover:underline">
                All {COMPETITIONS.length}
              </Link>
            </div>
            <ul className="mt-8 divide-y divide-yefa-rule border-y border-yefa-rule">
              {COMPETITIONS.slice(0, 6).map((name) => (
                <li key={name} className="py-3.5 text-yefa-navy">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Reminders */}
      <section className="overflow-hidden border-t border-yefa-rule">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Never miss a meeting.</h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-yefa-ink">
              Turn on reminders and your phone or laptop pings you 3 days, 2 days and 1 day before every meeting and
              competition, and again on the day, with the time and the room.
            </p>
            <ul className="mt-6 space-y-2 text-yefa-ink">
              <li>Works on Android, iPhone (once you add the site to your home screen) and laptops.</li>
              <li>Tap a reminder to open the calendar.</li>
              <li>Turn it off anytime under Account.</li>
            </ul>
            <Link
              to={signedIn ? "/member?tab=account" : "/login"}
              state={signedIn ? undefined : { from: "/member?tab=account" }}
              className="mt-8 inline-block rounded-md bg-yefa-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-yefa-blue-dark"
            >
              {signedIn ? "Turn on reminders" : "Sign in to turn on reminders"}
            </Link>
          </div>

          {/* Example of the four reminders a member gets */}
          <div aria-hidden="true" className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(43,79,194,0.18),transparent)]" />
            <div className="space-y-3">
              {[
                ["In 3 days", "Thursday, Dec 4 · 3:35 PM ET · Room 2317", "opacity-60 scale-[0.94]"],
                ["In 2 days", "Thursday, Dec 4 · 3:35 PM ET · Room 2317", "opacity-75 scale-[0.96]"],
                ["Tomorrow", "3:35 PM ET · Room 2317", "opacity-90 scale-[0.98]"],
                ["Today", "3:35 PM ET · Room 2317", "ring-2 ring-yefa-orange"],
              ].map(([when, detail, look]) => (
                <div
                  key={when}
                  className={`flex items-start gap-3 rounded-2xl border border-yefa-rule bg-white/95 p-4 shadow-[0_16px_32px_-20px_rgba(15,27,61,0.45)] backdrop-blur ${look}`}
                >
                  <img src="/icon-192.png" alt="" className="h-10 w-10 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-yefa-navy">YEFA</span>
                      <span>{when === "Today" ? "now" : "7:00 AM"}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm font-semibold text-yefa-navy">{when}: General Meeting</p>
                    <p className="truncate text-sm text-yefa-ink">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join */}
      <section className="bg-yefa-navy text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:flex-row sm:items-end sm:justify-between lg:py-20">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold sm:text-4xl">Anyone at AHS can join.</h2>
            <p className="mt-4 leading-relaxed text-slate-300">
              Fill out the sign-up form and an officer will reach out with meeting times. New members are
              welcome all year. Questions? Email{" "}
              <a href={`mailto:${SITE.contactEmail}`} className="text-white underline underline-offset-2">
                {SITE.contactEmail}
              </a>
              .
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 self-start rounded-md bg-white px-6 py-3 text-sm font-semibold text-yefa-navy transition-colors hover:bg-yefa-blue-50 sm:self-auto"
          >
            Join YEFA
          </Link>
        </div>
      </section>
    </div>
  )
}
