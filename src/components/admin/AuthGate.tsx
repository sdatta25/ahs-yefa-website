import { useEffect, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { clearToken, hasToken, login } from "../../lib/api"
import PasswordInput from "../PasswordInput"
import { OFFICER_LOGOUT_EVENT, takeIdleNotice } from "../../lib/idleTimeout"

export default function AuthGate({
  children,
  onLogout,
}: {
  children: (logout: () => void) => ReactNode
  onLogout?: () => void
}) {
  const [unlocked, setUnlocked] = useState(hasToken())
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loggingIn, setLoggingIn] = useState(false)
  const [idleNotice, setIdleNotice] = useState(takeIdleNotice)

  useEffect(() => {
    function onIdleLogout() {
      setUnlocked(false)
      setIdleNotice(true)
      onLogout?.()
    }
    window.addEventListener(OFFICER_LOGOUT_EVENT, onIdleLogout)
    return () => window.removeEventListener(OFFICER_LOGOUT_EVENT, onIdleLogout)
  }, [onLogout])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoggingIn(true)
    try {
      await login(username.trim(), password)
      setUnlocked(true)
      setIdleNotice(false)
      setUsername("")
      setPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoggingIn(false)
    }
  }

  function handleLogout() {
    clearToken()
    setUnlocked(false)
    onLogout?.()
  }

  if (!unlocked) {
    return (
      <div className="px-5 py-12">
      <div className="mx-auto max-w-sm rounded-md border border-yefa-rule bg-white p-7">
        <h2 className="text-base font-semibold text-yefa-navy">Officer Sign In</h2>
        <p className="mt-1 text-sm text-yefa-ink">Use the officer team's username and password.</p>
        {idleNotice && (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
            You were signed out after 30 minutes of inactivity.
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            autoCapitalize="none"
            autoFocus
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
            required
          />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loggingIn}
            className="w-full rounded-md bg-yefa-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-yefa-blue-dark disabled:opacity-60"
          >
            {loggingIn ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
      </div>
    )
  }

  return <>{children(handleLogout)}</>
}
