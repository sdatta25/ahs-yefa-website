import { useState } from "react"
import type { FormEvent } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import PageHeader from "../components/PageHeader"
import PasswordInput from "../components/PasswordInput"
import { supabase } from "../lib/supabase"

type Step = "email" | "sent" | "confirm"
type Method = "password" | "link"
type PasswordMode = "signin" | "signup"

const MIN_PASSWORD = 8
const fieldClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"

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

  return (
    <div>
      <PageHeader title="Member Sign In" subtitle="Sign in with Google, or with any email and a password." />

      <section className="mx-auto max-w-sm px-5 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-7">
          {step === "email" ? (
            <>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleLoading}
                className="flex w-full items-center justify-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-yefa-navy ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.4 0-13.8 4.1-17.1 10.1z" />
                  <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6c-2.1 1.5-4.8 2.5-7.7 2.5-5.2 0-9.6-3.3-11.3-7.9l-6.5 5.1C9.9 39.6 16.4 44 24 44z" />
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C40.9 36 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z" />
                </svg>
                Continue with Google
              </button>

              <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                or
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="mb-4 grid grid-cols-2 gap-1 rounded-full bg-slate-100 p-1 text-sm font-semibold">
                {(["password", "link"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMethod(m)}
                    className={`rounded-full px-3 py-1.5 transition ${
                      method === m ? "bg-white text-yefa-blue shadow-sm" : "text-yefa-ink hover:text-yefa-blue"
                    }`}
                  >
                    {m === "password" ? "Password" : "Email link"}
                  </button>
                ))}
              </div>

              {method === "password" ? (
                <form onSubmit={handlePassword} className="space-y-3">
                  {mode === "signup" && (
                    <label className="block text-sm font-medium text-yefa-ink">
                      Name
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        className={`mt-1 ${fieldClass}`}
                        required
                      />
                    </label>
                  )}
                  <label className="block text-sm font-medium text-yefa-ink">
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={`mt-1 ${fieldClass}`}
                      required
                    />
                  </label>
                  <label className="block text-sm font-medium text-yefa-ink">
                    Password
                    <div className="mt-1">
                      <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={mode === "signin" ? "current-password" : "new-password"}
                        className={fieldClass}
                        required
                      />
                    </div>
                  </label>
                  {mode === "signup" && (
                    <label className="block text-sm font-medium text-yefa-ink">
                      Confirm password
                      <div className="mt-1">
                        <PasswordInput
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          autoComplete="new-password"
                          className={fieldClass}
                          required
                        />
                      </div>
                    </label>
                  )}
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-lg bg-yefa-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-yefa-blue-dark disabled:opacity-60"
                  >
                    {sending ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
                  </button>
                  <p className="text-center text-sm text-yefa-ink">
                    {mode === "signin" ? "New here? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode(mode === "signin" ? "signup" : "signin")
                        setError(null)
                      }}
                      className="font-semibold text-yefa-blue hover:underline"
                    >
                      {mode === "signin" ? "Create an account" : "Sign in"}
                    </button>
                  </p>
                  {mode === "signin" && (
                    <p className="text-center text-xs text-slate-500">
                      Forgot your password, or signed up with Google? Use the email link, then set a password
                      under Account.
                    </p>
                  )}
                </form>
              ) : (
                <form onSubmit={handleSendLink} className="space-y-3">
                  <label className="block text-sm font-medium text-yefa-ink">
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={`mt-1 ${fieldClass}`}
                      required
                    />
                  </label>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-lg bg-yefa-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-yefa-blue-dark disabled:opacity-60"
                  >
                    {sending ? "Sending…" : "Email me a sign-in link"}
                  </button>
                </form>
              )}
            </>
          ) : step === "confirm" ? (
            <div className="space-y-3 text-center">
              <h2 className="text-base font-semibold text-yefa-navy">Confirm your email</h2>
              <p className="text-sm text-yefa-ink">
                We sent a confirmation link to <span className="font-semibold">{email}</span>. Click it, then
                come back and sign in with your password.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep("email")
                  setMode("signin")
                  setError(null)
                }}
                className="w-full text-center text-sm font-medium text-yefa-ink hover:text-yefa-blue"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <div className="space-y-3 text-center">
              <h2 className="text-base font-semibold text-yefa-navy">Check your email</h2>
              <p className="text-sm text-yefa-ink">
                We sent a sign-in link to <span className="font-semibold">{email}</span>. Open the email and
                click <span className="font-semibold">Sign in</span> — it'll bring you straight to the member
                portal.
              </p>
              <p className="text-xs text-slate-500">
                Don't see it? Check your spam folder. The link expires soon and only works once.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep("email")
                  setError(null)
                }}
                className="w-full text-center text-sm font-medium text-yefa-ink hover:text-yefa-blue"
              >
                Use a different email
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-yefa-ink">
          Officer?{" "}
          <Link to="/officer" className="font-semibold text-yefa-blue hover:underline">
            Sign in here
          </Link>
        </p>
      </section>
    </div>
  )
}
