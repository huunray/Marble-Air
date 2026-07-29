import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CTAButton } from '../CTAButton'
import { ASSETS } from '../../lib/assets'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const smooth = (v: number) => {
  const x = clamp(v)
  return x * x * (3 - 2 * x)
}

/**
 * Pinned intro panel that is progressively covered by a full-bleed gradient
 * panel rising from below, revealing the brand statement, copy and CTA.
 *
 * Motion is driven by an eased requestAnimationFrame loop (rather than writing
 * scroll progress straight to the DOM) so the reveal glides instead of
 * tracking the wheel step-for-step.
 */
export function WhoWeAre() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const coverRef = useRef<HTMLDivElement>(null)
  const coverInnerRef = useRef<HTMLDivElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const viewport = viewportRef.current
    if (!wrapper || !viewport) return

    let rafId = 0
    let target = 0
    let eased = 0

    const render = () => {
      const p = eased

      // The cover panel rises from below to hide the intro.
      const rise = smooth(clamp(p / 0.62))
      const cover = coverRef.current
      if (cover) {
        cover.style.transform = `translate3d(0, ${(1 - rise) * 100}%, 0)`
      }

      // Intro settles back slightly as it is covered — adds depth.
      const intro = introRef.current
      if (intro) {
        intro.style.transform = `scale(${1 - rise * 0.06}) translateY(${-rise * 40}px)`
        intro.style.opacity = String(1 - rise * 0.55)
      }

      // Cover contents lift in once the panel has largely landed.
      const inner = coverInnerRef.current
      if (inner) {
        const t = smooth(clamp((p - 0.42) / 0.34))
        inner.style.opacity = String(t)
        inner.style.transform = `translateY(${(1 - t) * 44}px)`
      }

      // Glow drifts upward through the reveal.
      const orb = orbRef.current
      if (orb) {
        orb.style.transform = `translate3d(0, ${(1 - p) * 90 - 30}px, 0) scale(${
          0.85 + p * 0.3
        })`
      }
    }

    const tick = () => {
      eased += (target - eased) * 0.09
      if (Math.abs(target - eased) < 0.00001) eased = target
      render()
      rafId = requestAnimationFrame(tick)
    }

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: '+=260%',
      pin: viewport,
      pinSpacing: true,
      scrub: true,
      refreshPriority: 0,
      onUpdate: (self) => {
        target = self.progress
      },
    })

    rafId = requestAnimationFrame(tick)
    requestAnimationFrame(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    })

    return () => {
      cancelAnimationFrame(rafId)
      trigger.kill()
    }
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full bg-black">
      <div
        ref={viewportRef}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        {/* ---- Intro panel (gets covered) ---------------------------- */}
        <div
          ref={introRef}
          className="absolute inset-0 flex items-center justify-center bg-[#07070b]"
        >
          <img
            src={ASSETS.whoWeAreBg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/45" />
          {/* Faint editorial grid over the image */}
          <div className="wwa-grid pointer-events-none absolute inset-0" />

          <div className="relative z-10 px-6 text-center">
            <span className="font-sans text-[0.68rem] font-medium uppercase tracking-[0.5em] text-white/50">
              Marble Air
            </span>
            <h2 className="mx-auto mt-6 max-w-3xl font-serif-tight text-4xl font-light leading-[1.12] text-white md:text-6xl">
              A new era of flying
            </h2>
          </div>
        </div>

        {/* ---- Cover panel (rises to reveal) ------------------------- */}
        <div
          ref={coverRef}
          className="wwa-cover absolute inset-0 flex items-center justify-center overflow-hidden will-change-transform"
          style={{ transform: 'translate3d(0, 100%, 0)' }}
        >
          {/* Glowing orb */}
          <div
            ref={orbRef}
            className="wwa-orb left-1/2 h-[58vh] w-[58vh] -translate-x-1/2"
            style={{ top: '6%' }}
            aria-hidden="true"
          />

          <div
            ref={coverInnerRef}
            className="relative z-10 mx-auto max-w-2xl px-6 text-center"
            style={{ opacity: 0 }}
          >
            <span className="font-sans text-[0.68rem] font-medium uppercase tracking-[0.5em] text-white/70">
              Who we are
            </span>

            <h2 className="mt-6 font-serif-tight text-4xl font-light leading-[1.08] text-white md:text-6xl">
              The quiet luxury
              <br />
              of flight
            </h2>

            <p className="mt-8 font-sans text-base font-light leading-[1.9] text-white/85">
              No matter how the world changes, what truly enriches human life
              remains the same. Across continents and skies, we nurture the
              journey through craft, shape every detail through care, and guide a
              return to oneself through the quiet luxury of flight.
            </p>
            <p className="mt-5 font-sans text-base font-light leading-[1.9] text-white/75">
              Across cultures and borders, we carry a way of being — timeless and
              quietly alive — where every traveler's inner calm is free to unfold.
            </p>

            <div className="mt-10 flex justify-center">
              <CTAButton href="#company">View Company</CTAButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
