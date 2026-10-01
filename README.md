# AHS YEFA Website

The official website for AHS YEFA (Youth Economics & Finance Association) — club info,
officer introductions, competitions, events/meetings, and how to join.

Built with React + TypeScript + Vite + Tailwind CSS + Framer Motion (for the animated 3D
hero on the homepage).

## Running it locally

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
```

This outputs a static site to `dist/`, which can be deployed to Vercel, Netlify, GitHub
Pages, or any static host.

## Project structure

```
src/
  components/   Navbar, Footer, Hero3D (homepage animation), PageHeader, OfficerCard
  pages/        One file per page (Home, About, Officers, Competitions, Events, Contact)
  data/         Editable content — site info, officer list
public/images/  Logo and other static images
```

## How to update content (no coding experience needed for most of this)

- **Club name / tagline / contact email / Instagram** → edit `src/data/site.ts`.
- **Officers** (names, positions, photos, bios) → edit `src/data/officers.ts`. Each officer
  is one entry: `{ name, position, photo, bio }`. Drop photo files into `public/images/` and
  reference them like `photo: "/images/your-photo.jpg"`.
- **Competitions** (deadlines, descriptions) → edit the `COMPETITIONS` list at the top of
  `src/pages/Competitions.tsx`.
- **Meetings / events** → edit the `MEETINGS` and `OPPORTUNITIES` lists at the top of
  `src/pages/Events.tsx`.
- **About / mission text** → edit `src/pages/About.tsx` directly.
- **Logo** → replace `public/images/yefa-logo.svg` with the official logo file (same
  filename, or update the `src="/images/yefa-logo.svg"` references in `Navbar.tsx`,
  `Footer.tsx`, `Hero3D.tsx`, and `index.html`).

After editing, run `npm run dev` to preview changes before publishing.

## Officer photos — placeholders

The Officers page currently uses placeholder names/positions (initials shown instead of
photos). Once the officer introduction posts are shared, update `src/data/officers.ts` with
real names, positions, and photos.

## Deploying

The simplest option is [Vercel](https://vercel.com) or [Netlify](https://netlify.com):
1. Connect this GitHub repo.
2. Build command: `npm run build`
3. Output directory: `dist`

Every push to `main` will auto-deploy. Give future Presidents access to this GitHub repo
and the hosting account (Vercel/Netlify) so they can keep maintaining the site.

## Giving someone else access

1. Add them as a collaborator on this GitHub repo (Settings → Collaborators).
2. Add them to the Vercel/Netlify project (if deployed there).
3. Point them to this README for how the content is organized.
