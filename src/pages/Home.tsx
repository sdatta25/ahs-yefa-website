import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Hero3D from "../components/Hero3D"
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

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50 to-white px-5 pb-16 pt-14">
        <Hero3D />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mx-auto mt-6 max-w-2xl text-center"
        >
          <p className="text-lg text-slate-600">{SITE.tagline}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="rounded-full bg-yefa-blue px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-yefa-blue/30 transition hover:bg-yefa-blue-dark"
            >
              Join YEFA
            </Link>
            <Link
              to="/about"
              className="rounded-full border-2 border-yefa-orange px-7 py-3 text-sm font-semibold text-yefa-orange transition hover:bg-yefa-orange hover:text-white"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-yefa-blue/40 hover:shadow-lg"
            >
              <h3 className="text-lg font-bold text-yefa-navy group-hover:text-yefa-blue">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-yefa-orange">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-yefa-blue-dark px-5 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">What is {SITE.shortName}?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            YEFA is a student-led club dedicated to building financial literacy, economic
            thinking, and real-world investing skills through competitions, guest speakers,
            and hands-on workshops. <span className="text-yefa-orange-light">Content coming soon</span> —
            check back for our full mission statement.
          </p>
        </div>
      </section>
    </div>
  )
}
