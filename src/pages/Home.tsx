import { Link } from "react-router-dom"
import { motion, type Variants } from "framer-motion"
import BackgroundBlobs from "../components/BackgroundBlobs"
import { SITE } from "../data/site"

const QUICK_LINKS = [
  {
    title: "Meet the Officers",
    desc: "Get to know the students leading YEFA this year.",
    to: "/officers",
  },
  {
    title: "Competitions",
    desc: "Deadlines, registration info, and prep resources.",
    to: "/competitions",
  },
  {
    title: "Events & Meetings",
    desc: "Upcoming meetings, guest speakers, and workshops.",
    to: "/events",
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
            className="relative mx-auto flex w-full max-w-sm items-center justify-center"
          >
            <div className="absolute inset-6 rounded-[2rem] bg-white/60 blur-2xl" />
            <div className="relative flex w-full items-center justify-center rounded-[2rem] border border-white bg-white/80 p-10 shadow-[0_30px_60px_-20px_rgba(27,47,107,0.25)] backdrop-blur">
              <img src="/images/yefa-logo.svg" alt="YEFA logo" className="w-full" />
            </div>
          </motion.div>
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
                <h3 className="text-lg font-semibold text-yefa-navy">{item.title}</h3>
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

      <section className="border-t border-white/10 bg-yefa-navy px-5 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-yefa-orange-light">
            Our Mission
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">What is {SITE.shortName}?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-slate-300">
            YEFA is a student-led club dedicated to building financial literacy, economic
            thinking, and real-world investing skills through competitions, guest speakers,
            and hands-on workshops.{" "}
            <span className="text-yefa-orange-light">Full mission statement coming soon.</span>
          </p>
        </div>
      </section>
    </div>
  )
}
