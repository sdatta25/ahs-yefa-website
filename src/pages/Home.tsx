import { Link } from "react-router-dom"
import { motion, type Variants } from "framer-motion"
import BackgroundBlobs from "../components/BackgroundBlobs"
import RevolvingLogo from "../components/RevolvingLogo"
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
    title: "Meetings & Competitions",
    desc: "Calendar of meetings, deadlines, and registration info.",
    to: "/meetings-competitions",
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
      <section className="relative isolate overflow-hidden border-b border-slate-200/70 bg-yefa-blue-50">
        <BackgroundBlobs />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-16 sm:pb-28 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="inline-flex items-center gap-2 rounded-full border border-yefa-blue/20 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-yefa-blue"
            >
              Economics &middot; Finance &middot; Investing
            </motion.p>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="mt-5 text-4xl font-bold leading-[1.1] text-yefa-navy sm:text-5xl lg:text-[3.4rem]"
            >
              <span className="text-yefa-ink">AHS</span>{" "}
              <span className="text-yefa-blue">YEFA</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-5 max-w-lg text-lg text-yefa-ink"
            >
              {SITE.tagline}
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/contact"
                className="rounded-full bg-yefa-blue px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(54,87,201,0.55)] transition hover:bg-yefa-blue-dark"
              >
                Join YEFA
              </Link>
              <Link
                to="/about"
                className="rounded-full px-7 py-3 text-sm font-semibold text-yefa-navy ring-1 ring-inset ring-slate-300 transition hover:bg-white"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            <RevolvingLogo />
          </motion.div>
        </div>
      </section>

      <section className="border-b border-slate-200/70 bg-white px-5 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-yefa-orange">Our Mission</p>
          <h2 className="mt-2 text-2xl font-bold text-yefa-navy sm:text-3xl">What is {SITE.shortName}?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-yefa-ink">
            YEFA is a student-led club dedicated to building financial literacy, economic
            thinking, and real-world investing skills through competitions, guest speakers,
            and hands-on workshops.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-yefa-orange">Get Involved</p>
          <h2 className="mt-2 text-2xl font-bold text-yefa-navy sm:text-3xl">Where to start</h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {QUICK_LINKS.map((item, i) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                to={item.to}
                className="group block h-full rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-yefa-blue/30 hover:shadow-[0_18px_30px_-18px_rgba(16,20,43,0.25)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yefa-blue-50 text-yefa-blue transition group-hover:bg-yefa-blue group-hover:text-white">
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
    </div>
  )
}
