import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ASSETS } from '../../lib/assets'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Card {
  tag: string
  title: string
  brand: string
  scene: string // decorative gradient "scene" for the glass panel
}

const CARDS: Card[] = [
  {
    tag: 'Suites',
    title: 'A Private Suite\nAbove the Clouds',
    brand: 'First',
    scene:
      'radial-gradient(120% 90% at 30% 20%, #1c3a34 0%, #0d1f1c 55%, #05100e 100%)',
  },
  {
    tag: 'The Lounge',
    title: 'The Lounge\nBetween Worlds',
    brand: 'Marble',
    scene:
      'radial-gradient(120% 90% at 70% 25%, #23324f 0%, #131c30 55%, #070c16 100%)',
  },
  {
    tag: 'Dining',
    title: 'Dining at Forty\nThousand Feet',
    brand: 'Atelier',
    scene:
      'radial-gradient(120% 90% at 40% 30%, #3a2740 0%, #201427 55%, #0d0812 100%)',
  },
  {
    tag: 'Rest',
    title: 'Silence,\nPerfectly Tuned',
    brand: 'Cabin',
    scene:
      'radial-gradient(120% 90% at 60% 20%, #17323f 0%, #0e2029 55%, #05111a 100%)',
  },
  {
    tag: 'The View',
    title: 'A Room With\na Skyline View',
    brand: 'Horizon',
    scene:
      'radial-gradient(120% 90% at 35% 25%, #2b2c50 0%, #171833 55%, #090a1a 100%)',
  },
  {
    tag: 'Arrival',
    title: 'Arrive\nEntirely Renewed',
    brand: 'Marble',
    scene:
      'radial-gradient(120% 90% at 65% 30%, #123534 0%, #0b2120 55%, #04100f 100%)',
  },
]

const N = CARDS.length
const ZUNIT = 820 // px of depth per card step
const SPREAD_X = 0.44 // lateral spread (fraction of viewport width) when off-focus
const ROT = 27 // max rotateY degrees

// Distinct scatter direction per card so simultaneously-visible cards never
// stack on the same spot (which would overlap their titles into a smear).
const DIR: { x: number; y: number }[] = [
  { x: -1.0, y: 0.28 },
  { x: 0.95, y: -0.34 },
  { x: -0.62, y: -0.5 },
  { x: 0.72, y: 0.46 },
  { x: -0.92, y: -0.12 },
  { x: 0.58, y: 0.4 },
]

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const smooth = (v: number) => {
  const x = clamp(v)
  return x * x * (3 - 2 * x)
}

export function FlightExperience() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const dissolveRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const wrapper = wrapperRef.current
    const viewport = viewportRef.current
    if (!wrapper || !viewport) return

    let killed = false
    let rafId = 0
    let target = 0 // scroll progress 0..1
    let cam = 0 // eased progress

    // ---- Scrubbed background video --------------------------------------
    const video = videoRef.current
    let seeking = false // in-flight seek flag, reset by the `seeked` event
    let blobUrl: string | null = null
    const hasDur = () =>
      !!video && !!video.duration && !Number.isNaN(video.duration) && video.duration > 0

    // Scrub the background video to the eased scroll position, gating seeks so
    // they never pile up (the key to smooth playback).
    const pumpVideo = () => {
      if (!video || !hasDur()) return
      if (seeking && !video.seeking) seeking = false
      if (seeking) return
      const time = Math.max(0, Math.min(cam * video.duration, video.duration - 0.05))
      if (Math.abs(video.currentTime - time) < 1 / 120) return
      seeking = true
      try {
        video.currentTime = time
      } catch {
        seeking = false
      }
    }
    const onSeeked = () => {
      seeking = false
      pumpVideo()
    }
    if (video) {
      video.pause()
      video.addEventListener('seeked', onSeeked)
      // Hold the whole clip in memory for stall-free scrubbing; fall back to
      // streaming if the fetch is blocked.
      const src = video.currentSrc || video.src
      if (src) {
        fetch(src, { mode: 'cors' })
          .then((r) => {
            if (!r.ok) throw new Error(String(r.status))
            return r.blob()
          })
          .then((blob) => {
            if (killed) return
            blobUrl = URL.createObjectURL(blob)
            video.src = blobUrl
            video.load()
          })
          .catch(() => {})
      }
    }

    // ---- Background particle field --------------------------------------
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d') ?? null
    let particles: {
      x: number
      y: number
      z: number
      r: number
      c: string
    }[] = []
    const COLORS = [
      'rgba(120,230,200,',
      'rgba(200,130,255,',
      'rgba(120,190,255,',
      'rgba(255,120,180,',
    ]
    const sizeCanvas = () => {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = viewport.clientWidth * dpr
      canvas.height = viewport.clientHeight * dpr
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const seedParticles = () => {
      const count = 150
      particles = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        r: Math.random() * 1.6 + 0.4,
        c: COLORS[(Math.random() * COLORS.length) | 0],
      }))
    }
    sizeCanvas()
    seedParticles()

    // ---- Per-frame render -----------------------------------------------
    const render = () => {
      const vw = viewport.clientWidth
      const vh = viewport.clientHeight
      const camPos = cam * (N + 1) - 1

      for (let i = 0; i < N; i++) {
        const el = cardRefs.current[i]
        if (!el) continue
        const t = i - camPos // >0 ahead, 0 focal, <0 passed
        const dir = DIR[i]
        const e = smooth(Math.min(Math.abs(t), 1)) // off-focus amount

        const z = -t * ZUNIT
        const x = dir.x * SPREAD_X * vw * e
        const y = dir.y * 90 * e - t * 6
        const rotY = -Math.sign(dir.x) * ROT * e

        // fade in from the distance, fade out as it passes the camera
        const farFade = smooth((2.5 - t) / 1.0)
        const nearFade = smooth((t + 0.82) / 0.82)
        const opacity = clamp(Math.min(farFade, nearFade))

        const blur = t > 0.6 ? Math.min((t - 0.6) * 2.6, 6) : 0

        el.style.transform =
          `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg)`
        el.style.opacity = String(opacity)
        el.style.filter = blur ? `blur(${blur}px)` : 'none'
        el.style.zIndex = String(2000 - Math.round(t * 100))
        el.style.visibility = opacity < 0.01 ? 'hidden' : 'visible'

        // Off-focus cards dim their text so only the focal title reads crisply.
        const content = contentRefs.current[i]
        if (content) {
          content.style.opacity = String(
            clamp(1 - smooth(clamp((Math.abs(t) - 0.12) / 0.78))),
          )
        }

        // dissolve intensifies as the card sweeps past the camera
        const dis = dissolveRefs.current[i]
        if (dis) dis.style.opacity = String(clamp(-t / 0.82) * opacity)
      }

      // parallax particle dust
      if (ctx && canvas) {
        ctx.clearRect(0, 0, vw, vh)
        for (const p of particles) {
          const depth = (p.z + cam * 1.4) % 1
          const scale = 0.4 + depth * 1.4
          const px = ((p.x + (0.5 - cam) * 0.12 * (1 - depth)) % 1) * vw
          const py = ((p.y + cam * 0.08 * depth) % 1) * vh
          const alpha = 0.15 + depth * 0.5
          ctx.beginPath()
          ctx.fillStyle = p.c + alpha.toFixed(3) + ')'
          ctx.arc(px, py, p.r * scale, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const tick = () => {
      cam += (target - cam) * 0.09 // eased camera → smooth scrubbing
      if (Math.abs(target - cam) < 0.00001) cam = target
      render()
      pumpVideo()
      rafId = requestAnimationFrame(tick)
    }

    // ---- ScrollTrigger pin ----------------------------------------------
    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: '+=600%',
      pin: viewport,
      pinSpacing: true,
      scrub: true,
      refreshPriority: 1,
      onUpdate: (self) => {
        target = self.progress
      },
    })

    rafId = requestAnimationFrame(tick)
    requestAnimationFrame(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    })

    const onResize = () => sizeCanvas()
    window.addEventListener('resize', onResize)

    return () => {
      killed = true
      void killed
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      video?.removeEventListener('seeked', onSeeked)
      if (blobUrl) URL.revokeObjectURL(blobUrl)
      trigger.kill()
    }
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full bg-black">
      <div
        ref={viewportRef}
        className="relative h-screen w-full overflow-hidden"
        style={{
          perspective: '1500px',
          background:
            'radial-gradient(120% 100% at 50% 20%, #0c0b16 0%, #06060c 55%, #000 100%)',
        }}
      >
        {/* Scroll-scrubbed background video */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={ASSETS.flightVideo}
          muted
          playsInline
          preload="metadata"
        />
        {/* Darken so the 3D cards stay legible over the video */}
        <div className="pointer-events-none absolute inset-0 bg-black/60" />

        {/* Background particle dust */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        {/* Section label */}
        <div className="pointer-events-none absolute inset-x-0 top-[9%] z-[3000] flex flex-col items-center">
          <span className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.5em] text-white/45">
            Marble Air
          </span>
          <h2 className="mt-2 font-serif-tight text-2xl font-light tracking-wide text-white/80 md:text-3xl">
            The Flight Experience
          </h2>
        </div>

        {/* 3D card stage */}
        <div
          ref={stageRef}
          className="fx-stage absolute inset-0"
        >
          {CARDS.map((card, i) => (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              className="fx-card"
              style={{ opacity: 0 }}
            >
              <div className="fx-card__scene" style={{ background: card.scene }} />
              <div className="fx-card__sheen" />

              <div
                ref={(el) => {
                  contentRefs.current[i] = el
                }}
                className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center"
              >
                <span className="mb-5 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.5em] text-white/60">
                  {card.brand}
                </span>
                <h3 className="fx-title text-3xl font-light leading-[1.12] text-white md:text-5xl">
                  {card.title.split('\n').map((line, j) => (
                    <span key={j} className="block">
                      {line}
                    </span>
                  ))}
                </h3>
                <span className="mt-6 font-sans text-[0.62rem] font-light uppercase tracking-[0.45em] text-white/45">
                  {card.tag}
                </span>
              </div>

              <div
                ref={(el) => {
                  dissolveRefs.current[i] = el
                }}
                className="fx-card__dissolve"
              />
            </div>
          ))}
        </div>

        {/* Bottom-left index UI (mirrors the reference composition) */}
        <div className="pointer-events-none absolute bottom-[8%] left-[6%] z-[3000] hidden md:block">
          <p className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.4em] text-white/40">
            The Experience
          </p>
          <ul className="mt-4 space-y-2">
            {CARDS.map((c, i) => (
              <li
                key={i}
                className="font-sans text-xs font-light tracking-wide text-white/55"
              >
                {String(i + 1).padStart(2, '0')} — {c.tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
