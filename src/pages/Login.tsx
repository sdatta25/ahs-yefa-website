import { useState } from "react"
import type { FormEvent } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import AuthLayout from "../components/auth/AuthLayout"
import PasswordInput from "../components/PasswordInput"
import { supabase } from "../lib/supabase"
import { takeIdleNotice } from "../lib/idleTimeout"

type Step = "email" | "sent" | "confirm"
type Method = "password" | "link"
type PasswordMode = "signin" | "signup"

const MIN_PASSWORD = 8

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const from = (location.state as { from?: string } | null)?.from || "/member"

  const [step, setStep] = useState<Step>("email")
  const [method, setMethod] = useState<Method>("password")
  const [mode, setMode] = useState<PasswordMode>("signin")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [idleNotice] = useState(takeIdleNotice)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSendLink(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return

    setSending(true)
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        // Clicking the link in the email brings them back here, signed in.
        options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}${from}` },
      })
      if (otpError) throw otpError
      setStep("sent")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send the sign-in link. Try again.")
    } finally {
      setSending(false)
    }
  }

  async function handlePassword(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !password) return

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Enter your name.")
        return
      }
      if (password.length < MIN_PASSWORD) {
        setError(`Use at least ${MIN_PASSWORD} characters for your password.`)
        return
      }
      if (password !== confirm) {
        setError("The passwords don't match.")
        return
      }
    }

    setSending(true)
    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: trimmed, password })
        if (signInError) throw signInError
        navigate(from, { replace: true })
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: trimmed,
          password,
          options: { data: { full_name: name.trim() }, emailRedirectTo: `${window.location.origin}${from}` },
        })
        if (signUpError) throw signUpError
        // Supabase answers a sign-up for an existing email with a user that
        // has no identities, and sends no email.
        if (data.user && data.user.identities?.length === 0) {
          setMode("signin")
          setError(
            "There's already an account with this email. Sign in with Google or the email link, then set a password under Account.",
          )
          return
        }
        // No session back means Supabase wants the email confirmed first.
        if (data.session) navigate(from, { replace: true })
        else setStep("confirm")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.")
    } finally {
      setSending(false)
    }
  }

  function switchMethod(next: Method) {
    setMethod(next)
    setError(null)
  }

  async function handleGoogle() {
    setError(null)
    setGoogleLoading(true)
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}${from}` },
      })
      if (oauthError) throw oauthError
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't start Google sign-in.")
      setGoogleLoading(false)
    }
  }

  const alert = error && (
    <p role="alert" className="auth-alert bg-red-50 text-red-700">
      {error}
    </p>
  )

  return (
    <AuthLayout>
      {idleNotice && (
        <p className="auth-alert mb-5 bg-amber-50 text-amber-900">You were signed out after 30 minutes of inactivity.</p>
      )}

      <div className="auth-card">
        {step === "email" ? (
          <>
            <h1 className="text-3xl font-bold sm:text-4xl">{mode === "signup" && method === "password" ? "Create your account" : "Sign in"}</h1>
            <p className="mt-3 text-lg leading-relaxed text-yefa-ink">
              Members get the calendar, points, forms and resources in one place.
            </p>

            <button type="button" onClick={handleGoogle} disabled={googleLoading} className="btn btn-quiet mt-8">
              {googleLoading ? (
                <span className="spinner" aria-hidden="true" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.4 0-13.8 4.1-17.1 10.1z" />
                  <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6c-2.1 1.5-4.8 2.5-7.7 2.5-5.2 0-9.6-3.3-11.3-7.9l-6.5 5.1C9.9 39.6 16.4 44 24 44z" />
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C40.9 36 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z" />
                </svg>
              )}
              Continue with Google
            </button>

            <div className="my-7 flex items-center gap-4 text-sm font-medium text-slate-500">
              <span className="h-px flex-1 bg-yefa-rule" />
              or use your email
              <span className="h-px flex-1 bg-yefa-rule" />
            </div>

            <div role="tablist" aria-label="Sign-in method" className="mb-6 grid grid-cols-2 gap-1.5 rounded-[0.875rem] bg-yefa-paper p-1.5">
              {(["password", "link"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={method === m}
                  onClick={() => switchMethod(m)}
                  className={`h-12 rounded-[0.625rem] text-base font-semibold transition-all ${
                    method === m
                      ? "bg-white text-yefa-blue shadow-[0_2px_8px_-2px_rgba(15,27,61,0.25)]"
                      : "text-yefa-ink hover:text-yefa-navy"
                  }`}
                >
                  {m === "password" ? "Password" : "Email link"}
                </button>
              ))}
            </div>

            {method === "password" ? (
              <form onSubmit={handlePassword} className="space-y-5" noValidate={false}>
                {mode === "signup" && (
                  <div>
                    <label htmlFor="auth-name" className="auth-label">Name</label>
                    <input id="auth-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="auth-field" required />
                  </div>
                )}
                <div>
                  <label htmlFor="auth-email" className="auth-label">Email</label>
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="auth-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="auth-password" className="auth-label">Password</label>
                  <PasswordInput
                    id="auth-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    className="auth-field"
                    required
                  />
                  {mode === "signup" && <p className="mt-2 text-sm text-slate-500">At least {MIN_PASSWORD} characters.</p>}
                </div>
                {mode === "signup" && (
                  <div>
                    <label htmlFor="auth-confirm" className="auth-label">Confirm password</label>
                    <PasswordInput
                      id="auth-confirm"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      autoComplete="new-password"
                      className="auth-field"
                      required
                    />
                  </div>
                )}
                {alert}
                <button type="submit" disabled={sending} className="btn btn-primary">
                  {sending && <span className="spinner" aria-hidden="true" />}
                  {sending ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
                </button>
                <p className="pt-1 text-center text-base text-yefa-ink">
                  {mode === "signin" ? "New here? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "signin" ? "signup" : "signin")
                      setError(null)
                    }}
                    className="font-semibold text-yefa-blue underline-offset-4 hover:underline"
                  >
                    {mode === "signin" ? "Create an account" : "Sign in"}
                  </button>
                </p>
                {mode === "signin" && (
                  <p className="text-center text-sm leading-relaxed text-slate-500">
                    Forgot your password, or signed up with Google? Use the email link, then set a password under
                    Account.
                  </p>
                )}
              </form>
            ) : (
              <form onSubmit={handleSendLink} className="space-y-5">
                <div>
                  <label htmlFor="auth-link-email" className="auth-label">Email</label>
                  <input
                    id="auth-link-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="auth-field"
                    required
                  />
                  <p className="mt-2 text-sm text-slate-500">We'll email you a link that signs you in. No password needed.</p>
                </div>
                {alert}
                <button type="submit" disabled={sending} className="btn btn-primary">
                  {sending && <span className="spinner" aria-hidden="true" />}
                  {sending ? "Sending…" : "Email me a sign-in link"}
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="auth-rise text-center" role="status">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yefa-blue-50 text-yefa-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2.5" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </div>
            <h1 className="mt-6 text-3xl font-bold">{step === "confirm" ? "Confirm your email" : "Check your email"}</h1>
            <p className="mt-3 text-lg leading-relaxed text-yefa-ink">
              {step === "confirm" ? "We sent a confirmation link to " : "We sent a sign-in link to "}
              <span className="font-semibold text-yefa-navy">{email}</span>.{" "}
              {step === "confirm"
                ? "Click it, then come back and sign in with your password."
                : "Open it and click Sign in to go straight to your dashboard."}
            </p>
            <p className="mt-3 text-sm text-slate-500">Nothing there? Check spam. The link expires soon and works once.</p>
            <button
              type="button"
              onClick={() => {
                setStep("email")
                if (step === "confirm") setMode("signin")
                setError(null)
              }}
              className="btn btn-quiet mt-8"
            >
              {step === "confirm" ? "Back to sign in" : "Use a different email"}
            </button>
          </div>
        )}
      </div>

      <p className="mt-7 text-center text-base text-yefa-ink">
        Officer?{" "}
        <Link to="/officer" className="font-semibold text-yefa-blue underline-offset-4 hover:underline">
          Sign in to the Officer Portal
        </Link>
      </p>
    </AuthLayout>
  )
}
