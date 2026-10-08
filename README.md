# AHS YEFA Website

The official website for AHS YEFA (Youth Economics & Finance Association) — club info,
officer introductions, a meetings/competitions calendar, sign-up forms, resources, and how
to join.

Built with React + TypeScript + Vite + Tailwind CSS + Framer Motion, plus a small Vercel
Serverless API (`/api`) backed by Vercel Blob storage for the calendar, forms, and
resources, all managed through a password-protected Admin page.

## Running it locally

This project has a backend API (`/api`), so use the Vercel CLI dev server instead of plain
`vite dev` — it runs the frontend *and* the API routes together:

```bash
npm install
npx vercel dev
```

Then open the URL it prints. (Plain `npm run dev` also works but only for pages that don't
call the API — the calendar, Forms/Resources, and Admin page need `vercel dev` or a
deployed URL. Note: `vercel dev`'s local SPA rewrite emulation can misbehave on a hard
reload of a sub-page like `/admin` — if that happens, navigate to `/` first and click
through instead. This is a local-dev-only quirk; it doesn't happen on the real deployment.)

To build for production:

```bash
npm run build
```

## Project structure

```
src/
  components/
    admin/        AuthGate (login), EventManager (calendar CRUD), DocumentManager (forms/resources CRUD)
    BrandLogo, RevolvingLogo, Navbar, Footer, EventCalendar, OfficerCard, ...
  pages/           One file per page (Home, About, Officers, MeetingsCompetitions, Forms, Resources, Contact, Admin)
  data/            Editable content — site info, officer list
  lib/             api.ts (calls to /api), date.ts (calendar + Eastern Time formatting helpers)
public/images/     Logo images (Alpharetta HS crest + YEFA wordmark)
api/               Serverless functions: events.js, documents.js, upload.js, auth.js
```

## How to update content

- **Club name / tagline / contact email / Instagram** → edit `src/data/site.ts`.
- **Officers** (names, positions, photos, bios) → edit `src/data/officers.ts`. Each officer
  is one entry: `{ name, position, photo, bio }`. Drop photo files into `public/images/` and
  reference them like `photo: "/images/your-photo.jpg"`.
- **Meetings, competitions, forms, and resources** → don't edit code for these — use the
  **Admin page** (see below). That's the whole point of it.
- **About / mission text** → edit `src/pages/About.tsx` directly.
- **Logos** → replace `public/images/ahs-crest.png` and/or `public/images/yefa-wordmark.png`
  (same filenames) to update the combined logo everywhere (`BrandLogo.tsx` renders both).

After editing, run `npx vercel dev` to preview changes before publishing.

## Admin page

The Admin page lives at **`/admin`** — it is intentionally **not** in the main navigation
or listed anywhere members would stumble onto it, so regular visitors never see it. There's
a small "Officer Login" link in the footer for officers to find it. Officers sign in there
with a shared password, then manage three things from one place — changes go live on the
public site immediately, no redeploy needed:

- **Meetings & Competitions** — add/edit/delete calendar items. All times are entered and
  displayed in **Eastern Time**.
- **Forms** — add sign-up forms either by pasting a link (e.g. a Google Form) or uploading a
  file directly (max 4MB).
- **Resources** — same as Forms, but for the public Resources page.

Notes:

- The password is **not stored in the code** — it's a Vercel environment variable called
  `OFFICER_PASSWORD`, set in the Vercel project dashboard (Project → Settings →
  Environment Variables). To change it, update that value there and redeploy.
- `SESSION_SECRET` (also an env var) signs officer login sessions — don't need to touch it
  unless you want to invalidate all logged-in officers at once (change it and everyone is
  logged out).
- All data (calendar items, forms, resources, uploaded files) is stored in **Vercel Blob**
  storage, automatically provisioned for this project — no separate database to manage.

## Officer photos — placeholders

The Officers grid currently uses placeholder names/positions. Once the officer
introduction posts are shared, update `src/data/officers.ts` with real names, positions,
and photos.

## Deploying

This project is deployed on **Vercel** (not just any static host, since it needs the
`/api` serverless functions and Blob storage):

- Production: https://ahsyefa.vercel.app
- Connected to this GitHub repo — every push to `main` auto-deploys.

## Giving someone else access

1. Add them as a collaborator on this GitHub repo (Settings → Collaborators).
2. Add them to the Vercel project (Vercel dashboard → Project → Settings → Members).
3. Share the Admin password separately (not through GitHub/this README), and let them know
   the Admin page is at `/admin` (or the "Officer Login" link in the footer).
4. Point them to this README for how the content is organized.
