import { lazy, Suspense, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { SITE } from "../data/site"
import { COMPETITIONS } from "../data/competitions"
import { OFFICERS } from "../data/officers"
import { fetchEvents, type EventItem } from "../lib/api"
import { formatTime12h, todayISO } from "../lib/date"

const HeroObjects = lazy(() => import("../components/hero/HeroObjects"))

function dateParts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    day: d,
    weekday: date.toLocaleDateString("en-US", { weekday: "long" }),
  }
}

function useUpcoming(limit: number) {
  const [events, setEvents] = useState<EventItem[] | null>(null)
  useEffect(() => {
    fetchEvents()
      .then((all) => {
        const today = todayISO()
        setEvents(
          all
            .filter((e) => e.date >= today)
            .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
            .slice(0, limit),
        )
      })
      .catch(() => setEvents([]))
  }, [limit])
  return events
}

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
  const upcoming = useUpcoming(3)
  const reduceMotion = useReducedMotion()

  return (
    <div>
      {/* Hero: 3D finance objects float in on the right, text holds the left. */}
      <section className="relative isolate overflow-hidden border-b border-yefa-rule">
        <div className="relative h-[40vh] min-h-[280px] lg:absolute lg:inset-y-0 lg:left-[38%] lg:right-0 lg:h-auto">
          <Suspense fallback={null}>
            <HeroObjects />
          </Suspense>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-16 lg:flex lg:min-h-[min(calc(100vh-4.25rem),50rem)] lg:items-center lg:py-24">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            className="max-w-md"
          >
            <h1 className="display-wide text-[4.5rem] text-yefa-navy sm:text-[6rem] lg:text-[7.25rem]">
              AHS
              <br />
              YEFA
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-yefa-ink">
              The Youth Economics &amp; Finance Association at Alpharetta High School. Members learn how
              markets work and compete in national economics, finance and investing competitions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="rounded-md bg-yefa-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-yefa-blue-dark"
              >
                Join YEFA
              </Link>
              <Link
                to="/calendar"
                className="rounded-md px-6 py-3 text-sm font-semibold text-yefa-navy ring-1 ring-inset ring-yefa-navy/20 transition-colors hover:bg-white"
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
            {upcoming === null ? (
              <p className="mt-8 text-yefa-ink">Loading the calendar…</p>
            ) : upcoming.length === 0 ? (
              <p className="mt-8 max-w-md leading-relaxed text-yefa-ink">
                Nothing is scheduled yet. New meetings and competition deadlines go on the calendar as soon as
                they're set.
              </p>
            ) : (
              <ol className="mt-8 divide-y divide-yefa-rule border-y border-yefa-rule">
                {upcoming.map((e) => {
                  const d = dateParts(e.date)
                  return (
                    <li key={e.id} className="flex gap-6 py-5">
                      <div className="w-14 shrink-0 text-center">
                        <div className="text-xs font-semibold text-yefa-ink">{d.month}</div>
                        <div className="tabular font-display text-3xl font-extrabold leading-none [font-stretch:125%]">
                          {d.day}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {e.title}
                          {e.type === "competition" && (
                            <span className="ml-2 rounded bg-yefa-orange/15 px-1.5 py-0.5 align-middle text-xs font-semibold text-yefa-orange-ink">
                              Competition
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-sm text-yefa-ink">
                          {d.weekday}, {formatTime12h(e.time)}
                          {e.location ? `, ${e.location}` : ""}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            )}
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
