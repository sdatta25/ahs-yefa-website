import { useState } from "react"
import type { FormEvent, ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { useNavigate } from "react-router-dom"
import PasswordInput from "../PasswordInput"
import { supabase } from "../../lib/supabase"
import { displayName } from "../../lib/useSession"

const MIN_PASSWORD = 8

const fieldClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
const inputClass = `mt-1 ${fieldClass}`
const primaryButton =
  "rounded-lg bg-yefa-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-yefa-blue-dark disabled:opacity-60"
const secondaryButton =
  "rounded-lg px-4 py-2 text-sm font-semibold text-yefa-ink ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 disabled:opacity-60"

function errorText(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback
}

function Card({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-yefa-navy">{title}</h2>
      {description && <p className="mt-1 text-sm text-yefa-ink">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

function ProfileCard({ user }: { user: User }) {
  const [name, setName] = useState(displayName(user))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const providers = (user.identities ?? []).map((i) => i.provider)
  const methods = [
    providers.includes("google") && "Google",
    providers.includes("email") && "Email",
  ].filter(Boolean)

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    const trimmed = name.trim()
    if (!trimmed) {
      setError("Enter your name.")
      return
    }
    setSaving(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ data: { full_name: trimmed } })
      if (updateError) throw updateError
      setMessage("Saved.")
    } catch (err) {
      setError(errorText(err, "Couldn't save your name."))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card title="Profile">
      <form onSubmit={handleSave} className="space-y-3">
        <label className="block text-sm font-medium text-yefa-ink">
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="name" />
        </label>
        <label className="block text-sm font-medium text-yefa-ink">
          Email
          <input
            value={user.email ?? ""}
            disabled
            className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
          />
          <span className="mt-1 block text-xs text-slate-500">Your email can't be changed.</span>
        </label>
        {methods.length > 0 && <p className="text-xs text-slate-500">Signed in with: {methods.join(", ")}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button type="submit" disabled={saving} className={primaryButton}>
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </Card>
  )
}

// Supabase emails a one-time code (reauthentication), which must be passed
// back with the new password.
function PasswordCard({ user }: { user: User }) {
  const [step, setStep] = useState<"start" | "verify" | "done">("start")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendCode() {
    setError(null)
    setBusy(true)
    try {
      const { error: reauthError } = await supabase.auth.reauthenticate()
      if (reauthError) throw reauthError
      setStep("verify")
    } catch (err) {
      setError(errorText(err, "Couldn't send the code. Try again."))
    } finally {
      setBusy(false)
    }
  }

  async function handleChange(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < MIN_PASSWORD) {
      setError(`Use at least ${MIN_PASSWORD} characters.`)
      return
    }
    if (password !== confirm) {
      setError("The passwords don't match.")
      return
    }
    setBusy(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password, nonce: code.trim() })
      if (updateError) throw updateError
      setStep("done")
      setCode("")
      setPassword("")
      setConfirm("")
    } catch (err) {
      setError(errorText(err, "Couldn't change your password. Check the code and try again."))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card
      title="Password"
      description="Set a password so you can also sign in with your email and password. Google sign-in keeps working."
    >
      {step === "start" && (
        <div className="space-y-3">
          <p className="text-sm text-yefa-ink">
            First we'll email a verification code to <span className="font-semibold">{user.email}</span>.
          </p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button onClick={sendCode} disabled={busy} className={primaryButton}>
            {busy ? "Sending…" : "Email me a code"}
          </button>
        </div>
      )}

      {step === "verify" && (
        <form onSubmit={handleChange} className="space-y-3">
          <p className="text-sm text-yefa-ink">
            Enter the code we sent to <span className="font-semibold">{user.email}</span>, then your new password.
          </p>
          <label className="block text-sm font-medium text-yefa-ink">
            Verification code
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              className={`${inputClass} tracking-[0.3em]`}
              required
            />
          </label>
          <label className="block text-sm font-medium text-yefa-ink">
            New password
            <div className="mt-1">
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className={fieldClass}
                required
              />
            </div>
          </label>
          <label className="block text-sm font-medium text-yefa-ink">
            Confirm new password
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
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busy} className={primaryButton}>
              {busy ? "Saving…" : "Change password"}
            </button>
            <button type="button" onClick={sendCode} disabled={busy} className={secondaryButton}>
              Send a new code
            </button>
          </div>
        </form>
      )}

      {step === "done" && (
        <div className="space-y-3">
          <p className="text-sm text-green-700">Your password was changed.</p>
          <button onClick={() => setStep("start")} className={secondaryButton}>
            Change it again
          </button>
        </div>
      )}
    </Card>
  )
}

function DeleteCard() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setError(null)
    setBusy(true)
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) throw new Error("You're signed out. Sign in again first.")
      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || "Couldn't delete your account.")
      await supabase.auth.signOut()
      navigate("/", { replace: true })
    } catch (err) {
      setError(errorText(err, "Couldn't delete your account."))
      setBusy(false)
    }
  }

  return (
    <Card title="Delete account" description="This permanently deletes your member account. It can't be undone.">
      {!open ? (
        <button onClick={() => setOpen(true)} className="rounded-lg px-4 py-2 text-sm font-semibold text-red-600 ring-1 ring-inset ring-red-200 transition hover:bg-red-50">
          Delete my account
        </button>
      ) : (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-yefa-ink">
            Type <span className="font-semibold">DELETE</span> to confirm
            <input value={typed} onChange={(e) => setTyped(e.target.value)} className={inputClass} autoComplete="off" />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDelete}
              disabled={busy || typed !== "DELETE"}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {busy ? "Deleting…" : "Delete permanently"}
            </button>
            <button
              onClick={() => {
                setOpen(false)
                setTyped("")
                setError(null)
              }}
              disabled={busy}
              className={secondaryButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}

export default function AccountSettings({ user }: { user: User }) {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <ProfileCard user={user} />
      <PasswordCard user={user} />
      <DeleteCard />
    </div>
  )
}
