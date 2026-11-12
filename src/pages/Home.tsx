import { lazy, Suspense } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { SITE } from "../data/site"
import ErrorBoundary from "../components/ErrorBoundary"
import { COMPETITIONS } from "../data/competitions"
import { OFFICERS } from "../data/officers"
import UpcomingList from "../components/views/UpcomingList"

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
