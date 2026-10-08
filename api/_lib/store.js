import { put, list, del } from "@vercel/blob"

const KEEP_VERSIONS = 2

export async function readCollection(prefix) {
  const { blobs } = await list({ prefix })
  if (blobs.length === 0) return []
  const latest = blobs.reduce((a, b) => (a.pathname > b.pathname ? a : b))
  const res = await fetch(latest.url, { cache: "no-store" })
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function writeCollection(prefix, items) {
  const { blobs } = await list({ prefix })
  // Zero-padded timestamp so pathnames sort chronologically as plain strings.
  const pathname = `${prefix}${String(Date.now()).padStart(15, "0")}.json`

  await put(pathname, JSON.stringify(items, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  })

  const stale = blobs.sort((a, b) => (a.pathname < b.pathname ? 1 : -1)).slice(KEEP_VERSIONS - 1)
  if (stale.length > 0) {
    await del(stale.map((b) => b.url)).catch(() => {})
  }
}
