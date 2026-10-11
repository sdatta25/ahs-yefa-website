import { Link } from "react-router-dom"
import { motion, type Variants } from "framer-motion"
import { SITE } from "../data/site"

const QUICK_LINKS = [
  {
    title: "Meet the Officers",
    desc: "Get to know the students leading YEFA this year.",
    to: "/officers",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM15.75 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    ),
  },
  {
    title: "Calendar",
    desc: "Upcoming meetings and competition deadlines, all in one place.",
    to: "/calendar",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008Z"
      />
    ),
  },
  {
    title: "Resources",
    desc: "Guides and materials to help you prep and get involved.",
    to: "/resources",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
      />
    ),
  },
]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1 + i * 0.08, ease: "easeOut" },
  }),
}

export default function Home() {
  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section
        className="relative isolate overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(54,87,201,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(54,87,201,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(54,87,201,0.07),transparent)]" />

        <div className="relative mx-auto max-w-3xl px-5 py-28 text-center sm:py-36">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-yefa-blue"
          >
            Economics &middot; Finance &middot; Investing
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-[3.4rem] font-extrabold leading-[0.95] tracking-tight text-yefa-navy sm:text-[4.6rem] lg:text-[5.4rem] xl:text-[6.2rem]"
          >
            AHS
            <br />
            <span className="relative inline-block text-yefa-blue">
              YEFA
              <span className="absolute -bottom-2 left-1/2 h-[5px] w-[72%] -translate-x-1/2 rounded-full bg-yefa-orange" />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-yefa-ink"
          >
            {SITE.tagline}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/contact"
              className="rounded-xl bg-yefa-blue px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(54,87,201,0.55)] transition hover:-translate-y-0.5 hover:bg-yefa-blue-dark"
            >
              Join YEFA
            </Link>
            <Link
              to="/about"
              className="rounded-xl px-7 py-3 text-sm font-semibold text-yefa-navy ring-1 ring-inset ring-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Mission — asymmetric editorial layout                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-slate-200/70 px-5 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.6fr_1fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yefa-orange">Our Mission</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-yefa-navy sm:text-4xl">
              What is {SITE.shortName}?
            </h2>
          </div>
          <div className="border-l-2 border-yefa-blue/15 pl-6 sm:pl-10">
            <p className="text-xl font-medium leading-relaxed text-yefa-navy sm:text-2xl">
              YEFA is a student-led club dedicated to building financial literacy, economic
              thinking, and real-world investing skills.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-yefa-ink">
              We get there through competitions, guest speakers, and hands-on workshops —
              built by students, for students.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Quick links                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yefa-orange">Get Involved</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-yefa-navy sm:text-4xl">Where to start</h2>
          </div>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
          {QUICK_LINKS.map((item, i) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white"
            >
              <Link to={item.to} className="group block h-full p-8 transition hover:bg-yefa-blue-50/60">
                <span className="font-display text-sm font-semibold text-slate-300 transition group-hover:text-yefa-blue/40">
                  0{i + 1}
                </span>
                <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-yefa-blue-50 text-yefa-blue transition group-hover:bg-yefa-blue group-hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="h-5 w-5">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-yefa-navy">{item.title}</h3>
                <p className="mt-2 text-sm text-yefa-ink">{item.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-yefa-blue">
                  Explore
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Closing CTA                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section
        className="relative overflow-hidden bg-yefa-navy px-5 py-20 text-white sm:py-28"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_100%,rgba(226,145,46,0.1),transparent)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yefa-orange-light">New members welcome all year</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Ready to join YEFA?</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Fill out the sign-up form and an officer will follow up with next steps and
            meeting times.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-3 text-sm font-semibold text-yefa-navy transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            Join YEFA
          </Link>
        </div>
      </section>
    </div>
  )
}
