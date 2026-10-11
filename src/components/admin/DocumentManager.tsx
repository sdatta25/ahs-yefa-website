import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import {
  createDocument,
  deleteDocument,
  fetchDocuments,
  fetchLinkPreview,
  updateDocument,
  uploadFile,
  type DocItem,
  type DocSection,
} from "../../lib/api"

const EMPTY_DRAFT = { title: "", description: "", url: "", image: "", images: [] as string[], captionsText: "" }

export default function DocumentManager({ section, label }: { section: DocSection; label: string }) {
  const isSocial = section === "social"

  const [docs, setDocs] = useState<DocItem[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchingPreview, setFetchingPreview] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    load()
  }, [])

  function load() {
    setLoading(true)
    fetchDocuments(section)
      .then(setDocs)
      .catch(() => setError("Couldn't load the list."))
      .finally(() => setLoading(false))
  }

  function startEdit(doc: DocItem) {
    setEditingId(doc.id)
    setDraft({
      title: doc.title,
      description: doc.description || "",
      url: doc.url,
      image: doc.image || "",
      images: doc.images || [],
      captionsText: (doc.captions || []).join("\n"),
    })
    setPreviewUrl(doc.url)
    setError(null)
    if (fileRef.current) fileRef.current.value = ""
    if (imageRef.current) imageRef.current.value = ""
  }

  function resetForm() {
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
    setPreviewUrl("")
    setError(null)
    if (fileRef.current) fileRef.current.value = ""
    if (imageRef.current) imageRef.current.value = ""
  }

  async function handleFetchPreview() {
    const url = draft.url.trim()
    if (!url) return
    setError(null)
    setFetchingPreview(true)
    try {
      const preview = await fetchLinkPreview(url)
      setDraft((d) => ({
        ...d,
        title: preview.title || d.title,
        image: preview.image || d.image,
        images: preview.image ? [preview.image] : d.images,
      }))
      setPreviewUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't fetch a preview for that link.")
    } finally {
      setFetchingPreview(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (isSocial && !draft.url.trim()) {
      setError("Link to the post is required.")
      return
    }
    if (!isSocial && !draft.title.trim()) {
      setError("Title is required.")
      return
    }
    const file = fileRef.current?.files?.[0]
    if (!isSocial && !file && !draft.url.trim()) {
      setError("Upload a file or paste a link.")
      return
    }
    if (isSocial && !draft.title.trim()) {
      setError("Fetch a preview first (or type a caption) before adding.")
      return
    }

    setSaving(true)
    try {
      let url = draft.url.trim()
      if (!isSocial && file) url = await uploadFile(file)

      let image = draft.image.trim()
      let images = draft.images
      const imageFiles = imageRef.current?.files
      if (imageFiles && imageFiles.length > 0) {
        images = await Promise.all([...imageFiles].map((f) => uploadFile(f)))
        image = images[0]
      }

      const captions = isSocial && draft.captionsText.trim() ? draft.captionsText.split("\n") : []

      const payload = {
        section,
        title: draft.title.trim(),
        description: draft.description.trim(),
        url,
        image,
        images,
        captions,
      }
      const updated = editingId ? await updateDocument({ id: editingId, ...payload }) : await createDocument(payload)
      setDocs(updated.filter((d) => d.section === section))
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return
    try {
      const updated = await deleteDocument(id)
      setDocs(updated.filter((d) => d.section === section))
      if (editingId === id) resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete item.")
    }
  }

  async function handleTogglePin(doc: DocItem) {
    try {
      const updated = await updateDocument({ ...doc, pinned: !doc.pinned })
      setDocs(updated.filter((d) => d.section === section))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update item.")
    }
  }

  const showAutoPreview = isSocial && draft.url.trim() && draft.url.trim() !== previewUrl

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="font-semibold text-yefa-navy">{editingId ? `Edit ${label}` : `Add to ${label}`}</h3>

        {isSocial ? (
          <div className="mt-4 space-y-4">
            <label className="block text-sm font-medium text-yefa-ink">
              Paste the Instagram post link
              <div className="mt-1 flex gap-2">
                <input
                  type="url"
                  value={draft.url}
                  onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                  onBlur={handleFetchPreview}
                  placeholder="https://www.instagram.com/p/…"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
                />
                <button
                  type="button"
                  onClick={handleFetchPreview}
                  disabled={fetchingPreview || !draft.url.trim()}
                  className="shrink-0 rounded-lg bg-yefa-blue-50 px-4 text-sm font-semibold text-yefa-blue transition hover:bg-yefa-blue/10 disabled:opacity-60"
                >
                  {fetchingPreview ? "Fetching…" : "Fetch preview"}
                </button>
              </div>
              <span className="mt-1 block text-xs text-slate-500">
                We'll automatically pull the caption and photo from the post.
              </span>
            </label>

            {showAutoPreview && !fetchingPreview && (
              <p className="text-xs text-yefa-orange">Click "Fetch preview" (or click out of the field) to load it.</p>
            )}

            {(draft.image || draft.title) && (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                {draft.image ? (
                  <img src={draft.image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-xs text-slate-500">
                    No image
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Preview</p>
                  <p className="truncate text-sm text-yefa-navy">{draft.title || "No caption found"}</p>
                </div>
              </div>
            )}

            <label className="block text-sm font-medium text-yefa-ink">
              Caption {draft.title ? "(fetched automatically — edit if you'd like)" : ""}
              <input
                type="text"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
              />
            </label>

            <details className="rounded-lg border border-slate-200 p-3">
              <summary className="cursor-pointer text-sm font-medium text-yefa-ink">
                Advanced: upload your own image(s) instead
              </summary>
              <label className="mt-3 block text-sm font-medium text-yefa-ink">
                Select all images from the post, in order (optional, max 4MB each)
                <input
                  ref={imageRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-yefa-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-yefa-blue"
                />
                {draft.images.length > 0 && (
                  <span className="mt-1 block text-xs text-slate-500">
                    {draft.images.length} image{draft.images.length > 1 ? "s" : ""} currently saved — choose new files
                    to replace them.
                  </span>
                )}
              </label>

              <label className="mt-3 block text-sm font-medium text-yefa-ink">
                Caption for each image (optional) — one line per image, same order as the files above
                <textarea
                  value={draft.captionsText}
                  onChange={(e) => setDraft({ ...draft, captionsText: e.target.value })}
                  rows={4}
                  placeholder={"President — Jane Doe\nVP of Operations — John Smith\n…"}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
                />
                <span className="mt-1 block text-xs text-slate-500">
                  Shown under each photo as you page through it — handy for officer team posts (e.g. "President —
                  Jane Doe"). Leave a line blank to skip a caption for that image.
                </span>
              </label>
            </details>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-yefa-ink sm:col-span-2">
              Title
              <input
                type="text"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
                required
              />
            </label>

            <label className="text-sm font-medium text-yefa-ink sm:col-span-2">
              Description (optional)
              <input
                type="text"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
              />
            </label>

            <label className="text-sm font-medium text-yefa-ink">
              Link (Google Form, Drive, etc.)
              <input
                type="url"
                value={draft.url}
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                placeholder="https://…"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-yefa-blue focus:outline-none focus:ring-1 focus:ring-yefa-blue"
              />
            </label>

            <label className="text-sm font-medium text-yefa-ink">
              Or upload a file (max 4MB)
              <input
                ref={fileRef}
                type="file"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-yefa-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-yefa-blue"
              />
            </label>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

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
        <h3 className="font-semibold text-yefa-navy">{label} — All Items</h3>
        {loading ? (
          <p className="mt-3 text-sm text-yefa-ink">Loading&hellip;</p>
        ) : docs.length === 0 ? (
          <p className="mt-3 text-sm text-yefa-ink">Nothing added yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {docs.map((d) => (
              <div
                key={d.id}
                className={`flex flex-col gap-3 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between ${
                  d.pinned ? "border-yefa-orange/40" : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {d.image && (
                    <img src={d.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      {d.pinned && (
                        <span className="rounded-full bg-yefa-orange/10 px-2 py-0.5 text-xs font-semibold text-yefa-orange">
                          📌 Pinned
                        </span>
                      )}
                      <h4 className="font-semibold text-yefa-navy">{d.title}</h4>
                    </div>
                    {d.description && <p className="text-sm text-yefa-ink">{d.description}</p>}
                    <a href={d.url} target="_blank" rel="noreferrer" className="text-sm text-yefa-blue hover:underline">
                      {d.url}
                    </a>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleTogglePin(d)}
                    className="rounded-full px-3 py-1.5 text-sm font-semibold text-yefa-orange ring-1 ring-inset ring-yefa-orange/30 transition hover:bg-yefa-orange/10"
                  >
                    {d.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button
                    onClick={() => startEdit(d)}
                    className="rounded-full px-3 py-1.5 text-sm font-semibold text-yefa-blue ring-1 ring-inset ring-yefa-blue/30 transition hover:bg-yefa-blue-50"
                  >
                    Edit
                  </button>
                  {!d.pinned && (
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="rounded-full px-3 py-1.5 text-sm font-semibold text-red-600 ring-1 ring-inset ring-red-200 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
