[**Русский**](./README.ru.md)

# Tier List Master

> **Drag-and-drop tier list builder.** Create, customize, and export tier lists — entirely in your browser. No uploads, no servers, no tracking.

[**Live Demo**](https://zoom1fy.github.io/tier-list-master/)

---

## Features

- **Drag & drop** — mouse and touch support. Move items between tiers, back to the pool, or drop on the trash zone to delete.
- **Image upload** — paste any image URL or upload a file from your device. Nothing leaves your browser.
- **Custom tiers** — rename any tier label (up to 15 chars). Layout adjusts automatically.
- **Screenshot export** — save your tier list as a high-res PNG with a built-in watermark.
- **Trash zone** — a delete area appears when dragging. Drop items there to remove them.
- **Fully static** — zero backend. Your images stay on your device. Refresh clears everything.
- **Open source** — built with Next.js, React, TypeScript, Tailwind CSS.

## Tech Stack

[Next.js](https://nextjs.org/) 16 · [React](https://react.dev/) 19 · [TypeScript](https://www.typescriptlang.org/) · [Tailwind CSS](https://tailwindcss.com/) v4 · [Vitest](https://vitest.dev/) · [Base UI](https://base-ui.com/) · [dom-to-image-more](https://github.com/1904labs/dom-to-image-more)

## Getting Started

### Prerequisites

- Node.js 20+
- npm / bun / pnpm / yarn

### Install & Run

```bash
git clone https://github.com/zoom1fy/tier-list-master.git
cd tier-list-master
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (static export) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

### Build

```bash
npm run build
```

Static files are written to `out/`. Deploy anywhere — GitHub Pages, Vercel, Cloudflare Pages, etc.

## Project Structure

```
app/               — App router pages
components/        — UI components
  tier-list/       — Tier list core (Workflow, Card, Line, ImageUpload)
  ui/              — Design system (button, dialog, sheet, etc.)
lib/               — Utilities
types/             — TypeScript types
tests/             — Test setup
public/            — Static assets
```

## Contributing

Issues and PRs are welcome. Make sure tests pass before submitting:

```bash
npm test
```

---

<p align="center">
  <sub>Built with Next.js · Designed by <a href="https://x.com/mipublicita">@mipublicita</a></sub>
</p>
