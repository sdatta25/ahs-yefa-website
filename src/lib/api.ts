export type EventType = "meeting" | "competition"

export type EventItem = {
  id: string
  type: EventType
  title: string
  date: string // YYYY-MM-DD (Eastern Time calendar day)
  time: string // HH:MM 24h (Eastern Time)
  location?: string
  description?: string
}

export type EventDraft = Omit<EventItem, "id">

const TOKEN_KEY = "yefa_officer_token"

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}
export function hasToken() {
  return Boolean(getToken())
}

export async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch("/api/events")
  if (!res.ok) throw new Error("Failed to load events")
  const data = await res.json()
  return data.events as EventItem[]
}

export async function login(password: string): Promise<string> {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || "Login failed")
  setToken(data.token)
  return data.token
}

async function authedFetch(path: string, options: RequestInit) {
  const token = getToken()
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  })
  if (res.status === 401) {
    clearToken()
    throw new Error("Session expired — please log in again.")
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || "Request failed")
  return data
}

export async function createEvent(draft: EventDraft): Promise<EventItem[]> {
  const data = await authedFetch("/api/events", { method: "POST", body: JSON.stringify({ event: draft }) })
  return data.events
}

export async function updateEvent(event: EventItem): Promise<EventItem[]> {
  const data = await authedFetch("/api/events", { method: "PUT", body: JSON.stringify({ event }) })
  return data.events
}

export async function deleteEvent(id: string): Promise<EventItem[]> {
  const data = await authedFetch("/api/events", { method: "DELETE", body: JSON.stringify({ id }) })
  return data.events
}
