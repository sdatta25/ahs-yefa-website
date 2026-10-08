import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import {
  clearToken,
  createEvent,
  deleteEvent,
  fetchEvents,
  hasToken,
  login,
  updateEvent,
  type EventItem,
  type EventType,
} from "../lib/api"
import { formatDateLabel, formatTime12h } from "../lib/date"

const EMPTY_DRAFT = {
  type: "meeting" as EventType,
  title: "",
  date: "",
  time: "",
  location: "",
  description: "",
}

export default function OfficerPortal() {
  const [unlocked, setUnlocked] = useState(hasToken())
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loggingIn, setLoggingIn] = useState(false)

  const [events, setEvents] = useState<EventItem[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (unlocked) loadEvents()
  }, [unlocked])

  function loadEvents() {
    setLoadingEvents(true)
    fetchEvents()
      .then((list) => setEvents(list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))))
      .catch(() => setFormError("Couldn't load events."))
      .finally(() => setLoadingEvents(false))
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoginError(null)
    setLoggingIn(true)
    try {
      await login(password)
      setUnlocked(true)
      setPassword("")
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoggingIn(false)
    }
  }

  function handleLogout() {
    clearToken()
    setUnlocked(false)
    setEvents([])
  }

  function startEdit(ev: EventItem) {
    setEditingId(ev.id)
    setDraft({
      type: ev.type,
      title: ev.title,
      date: ev.date,
      time: ev.time,
      location: ev.location || "",
      description: ev.description || "",
    })
    setFormError(null)
  }

  function resetForm() {
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
    setFormError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!draft.title.trim() || !draft.date || !draft.time) {
      setFormError("Title, date, and time are required.")
      return
    }

    setSaving(true)
    try {
      const updated = editingId
        ? await updateEvent({ id: editingId, ...draft })
        : await createEvent(draft)
      setEvents(updated.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)))
      resetForm()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return
    try {
      const updated = await deleteEvent(id)
      setEvents(updated.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)))
      if (editingId === id) resetForm()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't delete event.")
    }
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white p-7">
        <h3 className="text-base font-semibold text-yefa-navy">Officer Portal</h3>
        <p className="mt-1 text-sm text-yefa-ink">Officers can log in to manage meetings and competitions.</p>
        <form onSubmit={handleLogin} className="mt-4 space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Officer password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
            required
          />
          {loginError && <p className="text-sm text-red-600">{loginError}</p>}
          <button
            type="submit"
            disabled={loggingIn}
            className="w-full rounded-full bg-yefa-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-yefa-blue-dark disabled:opacity-60"
          >
            {loggingIn ? "Logging in…" : "Log In"}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-yefa-navy">Officer Portal</h3>
        <button onClick={handleLogout} className="text-sm font-semibold text-yefa-ink hover:text-yefa-blue">
          Log out
        </button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6">
        <h4 className="font-semibold text-yefa-navy">{editingId ? "Edit Item" : "Add Meeting or Competition"}</h4>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-yefa-ink">
            Type
            <select
              value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value as EventType })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
            >
              <option value="meeting">Meeting</option>
              <option value="competition">Competition</option>
            </select>
          </label>

          <label className="text-sm font-medium text-yefa-ink">
            Title
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
              required
            />
          </label>

          <label className="text-sm font-medium text-yefa-ink">
            Date
            <input
              type="date"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
              required
            />
          </label>

          <label className="text-sm font-medium text-yefa-ink">
            Time (Eastern)
            <input
              type="time"
              value={draft.time}
              onChange={(e) => setDraft({ ...draft, time: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
              required
            />
          </label>

          <label className="text-sm font-medium text-yefa-ink sm:col-span-2">
            Location (optional)
            <input
              type="text"
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
            />
          </label>

          <label className="text-sm font-medium text-yefa-ink sm:col-span-2">
            Description (optional)
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
            />
          </label>
        </div>

        {formError && <p className="mt-3 text-sm text-red-600">{formError}</p>}

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-yefa-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-yefa-blue-dark disabled:opacity-60"
          >
            {saving ? "Saving…" : editingId ? "Save Changes" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-yefa-ink ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h4 className="font-semibold text-yefa-navy">All Items</h4>
        {loadingEvents ? (
          <p className="mt-3 text-sm text-yefa-ink">Loading&hellip;</p>
        ) : events.length === 0 ? (
          <p className="mt-3 text-sm text-yefa-ink">Nothing added yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {events.map((e) => (
              <div
                key={e.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-yefa-orange">{e.type}</span>
                  <h5 className="font-semibold text-yefa-navy">{e.title}</h5>
                  <p className="text-sm text-yefa-ink">
                    {formatDateLabel(e.date)} &middot; {formatTime12h(e.time)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(e)}
                    className="rounded-full px-3 py-1.5 text-sm font-semibold text-yefa-blue ring-1 ring-inset ring-yefa-blue/30 transition hover:bg-yefa-blue-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="rounded-full px-3 py-1.5 text-sm font-semibold text-red-600 ring-1 ring-inset ring-red-200 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
