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

export type DocSection = "forms" | "resources" | "social"

export type DocItem = {
  id: string
  section: DocSection
  title: string
  description?: string
  url: string
  image?: string
  pinned?: boolean
}

export type DocDraft = Omit<DocItem, "id">

export async function fetchDocuments(section?: DocSection): Promise<DocItem[]> {
  const res = await fetch("/api/documents")
  if (!res.ok) throw new Error("Failed to load documents")
  const data = await res.json()
  const docs = data.documents as DocItem[]
  return section ? docs.filter((d) => d.section === section) : docs
}

export async function createDocument(draft: DocDraft): Promise<DocItem[]> {
  const data = await authedFetch("/api/documents", { method: "POST", body: JSON.stringify({ document: draft }) })
  return data.documents
}

export async function updateDocument(doc: DocItem): Promise<DocItem[]> {
  const data = await authedFetch("/api/documents", { method: "PUT", body: JSON.stringify({ document: doc }) })
  return data.documents
}

export async function deleteDocument(id: string): Promise<DocItem[]> {
  const data = await authedFetch("/api/documents", { method: "DELETE", body: JSON.stringify({ id }) })
  return data.documents
}

export async function uploadFile(file: File): Promise<string> {
  const dataBase64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(",")[1] ?? "")
    }
    reader.onerror = () => reject(new Error("Couldn't read file"))
    reader.readAsDataURL(file)
  })

  const data = await authedFetch("/api/upload", {
    method: "POST",
    body: JSON.stringify({ filename: file.name, contentType: file.type, dataBase64 }),
  })
  return data.url as string
}
