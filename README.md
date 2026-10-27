# Mohit Kumar — portfolio

Vite + React + TypeScript, GSAP ScrollTrigger and Lenis smooth scroll.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

## Editing content
Everything personal (bio, projects, timeline, skills, links) lives in `src/content.ts`.
Images are listed in [ASSETS.md](ASSETS.md). Replace `public/resume.pdf` to update the resume.

## Page order
Preloader (MK → MOHIT KUMAR) → Hero (spotlight reveal) → Marquee → About (pinned scroll-fill) →
Featured Projects → Marquee (reversed) → Path (timeline) → Contact.

## Where the motion lives
| Effect | File |
|---|---|
| Lenis + ScrollTrigger wiring, intro hand-off event | `src/lib/motion.ts` |
| MK → full-name intro, FLIP into the hero | `src/components/Preloader.tsx` |
| Cursor, magnetic buttons (`data-magnetic`), cursor labels (`data-cursor`) | `src/components/Cursor.tsx` |
| Lerped spotlight mask, word reveal, hero parallax | `src/components/Hero.tsx` |
| Scroll-velocity marquee | `src/components/Marquee.tsx` |
| Breathing cards, tilt + spotlight, View More | `src/components/Projects.tsx` |

`prefers-reduced-motion` skips the intro and disables smooth scroll and parallax.

## Deploying
It's a static build, so any static host works. On Vercel or Netlify, import the repo and set the root
directory to `portfolio`. Both detect Vite automatically.
