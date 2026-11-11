import { useEffect, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { clearToken, hasToken, login } from "../../lib/api"
import { Link } from "react-router-dom"
import PasswordInput from "../PasswordInput"
import AuthLayout from "../auth/AuthLayout"
import { OFFICER_LOGOUT_EVENT, takeIdleNotice } from "../../lib/idleTimeout"

export default function AuthGate({
  children,
  header,
  onLogout,
}: {
  children: (logout: () => void) => ReactNode
  header?: ReactNode // shown above the content once signed in
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
      <AuthLayout>
        {idleNotice && (
          <p className="auth-alert mb-5 bg-amber-50 text-amber-900">You were signed out after 30 minutes of inactivity.</p>
        )}
        <div className="auth-card">
          <h1 className="text-3xl font-bold sm:text-4xl">Officer sign in</h1>
          <p className="mt-3 text-lg leading-relaxed text-yefa-ink">Use the officer team's username and password.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="officer-username" className="auth-label">Username</label>
              <input
                id="officer-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                className="auth-field"
                required
              />
            </div>
            <div>
              <label htmlFor="officer-password" className="auth-label">Password</label>
              <PasswordInput
                id="officer-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="auth-field"
                required
              />
            </div>
            {error && (
              <p role="alert" className="auth-alert bg-red-50 text-red-700">
                {error}
              </p>
            )}
            <button type="submit" disabled={loggingIn} className="btn btn-primary">
              {loggingIn && <span className="spinner" aria-hidden="true" />}
              {loggingIn ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
        <p className="mt-7 text-center text-base text-yefa-ink">
          Member?{" "}
          <Link to="/login" className="font-semibold text-yefa-blue underline-offset-4 hover:underline">
            Sign in to the Member Portal
          </Link>
        </p>
      </AuthLayout>
    )
  }

  return (
    <>
      {header}
      {children(handleLogout)}
    </>
  )
}
