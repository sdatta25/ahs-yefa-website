import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import PageHeader from "../components/PageHeader"
import { supabase } from "../lib/supabase"

type Step = "email" | "code"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || "/member"

  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSendCode(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return

    setSending(true)
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: { shouldCreateUser: true },
      })
      if (otpError) throw otpError
      setStep("code")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send a code. Try again.")
    } finally {
      setSending(false)
    }
  }

  async function handleVerifyCode(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!code.trim()) return

    setVerifying(true)
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code.trim(),
        type: "email",
      })
      if (verifyError) throw verifyError
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code didn't work. Check it and try again.")
    } finally {
      setVerifying(false)
    }
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
      <PageHeader title="Member Sign In" subtitle="Sign in with Google or any email to access the member portal." />

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

              <form onSubmit={handleSendCode} className="space-y-3">
                <label className="block text-sm font-medium text-yefa-ink">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoFocus
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
                    required
                  />
                </label>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-lg bg-yefa-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-yefa-blue-dark disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Email me a code"}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-3">
              <h2 className="text-base font-semibold text-yefa-navy">Check your email</h2>
              <p className="text-sm text-yefa-ink">
                We sent a 6-digit code to <span className="font-semibold">{email}</span>.
              </p>
              <label className="block text-sm font-medium text-yefa-ink">
                Code
                <input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  autoFocus
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-lg tracking-[0.4em] focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
                  required
                />
              </label>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={verifying}
                className="w-full rounded-lg bg-yefa-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-yefa-blue-dark disabled:opacity-60"
              >
                {verifying ? "Verifying…" : "Sign in"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("email")
                  setCode("")
                  setError(null)
                }}
                className="w-full text-center text-sm font-medium text-yefa-ink hover:text-yefa-blue"
              >
                Use a different email
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-yefa-ink">
          Officer?{" "}
          <Link to="/admin" className="font-semibold text-yefa-blue hover:underline">
            Sign in here
          </Link>
        </p>
      </section>
    </div>
  )
}
