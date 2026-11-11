import { useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import Navbar from "./Navbar"
import Footer from "./Footer"
import ErrorBoundary from "./ErrorBoundary"
import { useIdleSignOut } from "../lib/idleTimeout"

function PageCrashed() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24">
      <h1 className="text-3xl font-bold">This page didn't load.</h1>
      <p className="mt-3 leading-relaxed text-yefa-ink">
        Something went wrong while showing it. Reload to try again, or use the menu to go to another page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 rounded-md bg-yefa-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-yefa-blue-dark"
      >
        Reload page
      </button>
    </div>
  )
}

export default function Layout() {
  useIdleSignOut()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()

  // Every page opens at the top, not where the last page was scrolled to.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])

  // Coming back from Google (or an email link) onto the homepage: once the
  // sign-in finishes, go to the member dashboard.
  useEffect(() => {
    const { pathname: path, search, hash } = window.location
    if (path !== "/" || !/[?&#](code|access_token)=/.test(search + hash)) return
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) navigate("/member", { replace: true })
    })
    return () => data.subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary resetKey={pathname} fallback={<PageCrashed />}>
          <motion.div
            key={pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
