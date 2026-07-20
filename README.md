# Marble Air — A New Era of Flying

A premium, cinematic single-page marketing site for the luxury airline **Marble Air**.
A long-scroll, video-heavy experience with pinned scroll-scrubbed sections, GSAP
ScrollTrigger animations, and a strict dark/black editorial aesthetic.

## Tech Stack

- **React 19** + **TanStack Start** (Vite) + **TypeScript**
- **Tailwind CSS v4** via `src/styles.css` using `@theme` tokens
- **GSAP + ScrollTrigger** for all scroll animation
- File-based routing under `src/routes/`

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Design System

- Background: pure black (`#000`) throughout
- Text: white with opacity variants (`text-white`, `/85`, `/70`, `/60`)
- Serif headlines: **Cormorant Garamond** (light) — headlines & taglines only
- Sans body/UI: **Urbanist** (light → medium)
- Fonts are loaded via `<link>` in the root route `<head>` and mapped in
  `src/styles.css` under `@theme` as `--font-serif` / `--font-sans`
- Signature CTA: white pill, black text, black circular chip with a white
  diagonal up-right arrow (`src/components/CTAButton.tsx`)

## Page Structure (single route `/`)

1. **Hero** — full-bleed autoplay video, glass-morphism nav, editorial headline
2. **Walkthrough** — pinned, scroll-scrubbed video with 5 alternating copy blocks
3. **Sky Globe** — pinned, scroll-scrubbed video with two crossfading chapters
4. **Who We Are** — full-bleed image with overlay and brand narrative
5. **Our Cabins** — three cabin articles with scrubbed image reveals
6. **Fly Beyond the Horizon** — CSS-drawn airplane window CTA
7. **Footer** — brand blurb, link columns, socials

A full-screen **Preloader** ("Boarding…") shows on first load, then fades out.

## Scroll Architecture

Pinned sections put the ScrollTrigger `trigger` on an **outer wrapper** and `pin`
on the **inner viewport**, each with an explicit `refreshPriority`, plus a
post-mount `ScrollTrigger.sort()` + `refresh()` inside `requestAnimationFrame`.
This ordering prevents later sections from premature-unpinning or leaving a black
gap. Scrubbed videos are driven by `video.currentTime` through a
`requestAnimationFrame` lerp loop for smooth playback — see
`src/lib/useScrubbedVideo.ts`.
