import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useSession } from "../lib/useSession"

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useSession()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-yefa-ink">Loading…</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
