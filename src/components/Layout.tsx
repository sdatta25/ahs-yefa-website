import { lazy, Suspense } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"

const SiteBackground = lazy(() => import("./sitebg/SiteBackground"))

export default function Layout() {
  const { pathname } = useLocation()
  const calm = pathname.startsWith("/admin")

  return (
    <div className="relative flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <SiteBackground calm={calm} />
      </Suspense>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
