import { useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { clearToken, hasToken, login } from "../../lib/api"

export default function AuthGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(hasToken())
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loggingIn, setLoggingIn] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoggingIn(true)
    try {
      await login(password)
      setUnlocked(true)
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
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white p-7">
        <h2 className="text-base font-semibold text-yefa-navy">Officer Sign In</h2>
        <p className="mt-1 text-sm text-yefa-ink">Enter the officer password to manage the site.</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Officer password"
            autoFocus
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loggingIn}
            className="w-full rounded-full bg-yefa-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-yefa-blue-dark disabled:opacity-60"
          >
            {loggingIn ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex justify-end">
        <button onClick={handleLogout} className="text-sm font-semibold text-yefa-ink hover:text-yefa-blue">
          Log out
        </button>
      </div>
      {children}
    </div>
  )
}
