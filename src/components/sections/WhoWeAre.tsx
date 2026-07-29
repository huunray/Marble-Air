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
const COPY_LINES = [
  'No matter how the world changes, what truly enriches',
  'human life remains the same. Across continents and skies,',
  'we nurture the journey through craft, shape every detail',
  'through care, and guide a return to oneself.',
]

/**
 * "Aperture" — the section opens through an expanding circular lens.
 *
 * Choreography across the pin:
 *   0.00–0.45  the aperture widens from a small port to full bleed while the
 *              image inside counter-zooms (opposing motion reads as depth)
 *   0.00–0.40  the giant wordmark splits, each half drifting outward as the
 *              aperture grows between them
 *   0.00–0.35  a technical ring rotates and dissolves around the port
 *   0.45–1.00  the scrim settles and the copy wipes in line by line
 *
 * Every layer moves on its own curve and its own rate, driven by one eased
 * requestAnimationFrame loop so the whole thing glides rather than tracking
 * the wheel step-for-step.
 */
export function WhoWeAre() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const apertureRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGSVGElement>(null)
  const splitLeftRef = useRef<HTMLDivElement>(null)
  const splitRightRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLSpanElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const ctaRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const viewport = viewportRef.current
    if (!wrapper || !viewport) return

    let rafId = 0
    let target = 0
    let eased = 0

    const render = () => {
      const p = eased
      const vw = viewport.clientWidth
      const vh = viewport.clientHeight

      // ---- Aperture: small port → full bleed -------------------------
      // Eased both ends so the lens holds shut a beat before it opens.
      const open = smooth(clamp(p / 0.45))
      const rMin = Math.min(vw, vh) * 0.1
      const rMax = Math.hypot(vw, vh) / 2 + 4
      const r = rMin + (rMax - rMin) * open
      const aperture = apertureRef.current
      if (aperture) {
        aperture.style.clipPath = `circle(${r.toFixed(1)}px at 50% 50%)`
      }

      // Image counter-zooms as the port widens, and drifts a touch.
      const img = imageRef.current
      if (img) {
        img.style.transform = `scale(${(1.55 - open * 0.55).toFixed(3)}) translateY(${(
          (1 - open) * -3
        ).toFixed(2)}%)`
      }

      // Scrim deepens once the image fills the frame, so copy stays readable.
      const scrim = scrimRef.current
      if (scrim) {
        scrim.style.opacity = String(0.12 + smooth(clamp((p - 0.3) / 0.4)) * 0.58)
      }

      // ---- Technical ring: rotates, then dissolves --------------------
      const ring = ringRef.current
      if (ring) {
        const ringFade = 1 - smooth(clamp((p - 0.06) / 0.3))
        ring.style.opacity = String(ringFade)
        ring.style.transform = `translate(-50%, -50%) rotate(${(p * 190).toFixed(2)}deg) scale(${(
          1 + open * 2.4
        ).toFixed(3)})`
      }

      // ---- Wordmark: the aperture drives the halves apart --------------
      // Each half is anchored to its own side of centre (centring both would
      // stack them) and rides just outside the lens edge, so the opening
      // aperture is what physically pushes the wordmark open.
      const sl = splitLeftRef.current
      const sr = splitRightRef.current
      if (sl && sr) {
        const edge = r + 26
        const fade = 1 - smooth(clamp((p - 0.14) / 0.24))
        sl.style.transform = `translate(-100%, -50%) translateX(${(-edge).toFixed(1)}px)`
        sr.style.transform = `translate(0%, -50%) translateX(${edge.toFixed(1)}px)`
        sl.style.opacity = String(fade)
        sr.style.opacity = String(fade)
      }

      // Corner meta drifts out with the wordmark.
      const meta = metaRef.current
      if (meta) {
        meta.style.opacity = String(1 - smooth(clamp((p - 0.1) / 0.25)))
      }

      // ---- Revealed content -------------------------------------------
      const eyebrow = eyebrowRef.current
      if (eyebrow) {
        const t = smooth(clamp((p - 0.46) / 0.16))
        eyebrow.style.opacity = String(t)
        eyebrow.style.transform = `translateY(${((1 - t) * 18).toFixed(1)}px)`
      }

      const heading = headingRef.current
      if (heading) {
        const t = smooth(clamp((p - 0.5) / 0.2))
        heading.style.opacity = String(t)
        heading.style.transform = `translateY(${((1 - t) * 30).toFixed(1)}px)`
        heading.style.letterSpacing = `${(-0.04 + t * 0.03).toFixed(3)}em`
      }

      // Body copy wipes upward, line by line.
      lineRefs.current.forEach((line, i) => {
        if (!line) return
        const t = smooth(clamp((p - (0.6 + i * 0.045)) / 0.16))
        line.style.transform = `translateY(${((1 - t) * 105).toFixed(1)}%)`
        line.style.opacity = String(0.25 + t * 0.75)
      })

      const cta = ctaRef.current
      if (cta) {
        const t = smooth(clamp((p - 0.82) / 0.14))
        cta.style.opacity = String(t)
        cta.style.transform = `translateY(${((1 - t) * 22).toFixed(1)}px)`
      }
    }

    const tick = () => {
      eased += (target - eased) * 0.085
      if (Math.abs(target - eased) < 0.00001) eased = target
      render()
      rafId = requestAnimationFrame(tick)
    }

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: '+=340%',
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

    const onResize = () => render()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      trigger.kill()
    }
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full bg-black">
      <div
        ref={viewportRef}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        {/* ---- Aperture: image revealed through an expanding lens ------ */}
        <div
          ref={apertureRef}
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: 'circle(10% at 50% 50%)' }}
        >
          <img
            ref={imageRef}
            src={ASSETS.whoWeAreBg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
            style={{ transform: 'scale(1.55)' }}
            draggable={false}
          />
          <div
            ref={scrimRef}
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.12 }}
          />
        </div>

        {/* Grain over everything for a filmic finish */}
        <div className="ap-grain pointer-events-none absolute inset-0" />

        {/* ---- Technical ring around the port -------------------------- */}
        <svg
          ref={ringRef}
          className="pointer-events-none absolute top-1/2 left-1/2"
          width="440"
          height="440"
          viewBox="0 0 440 440"
          style={{ transform: 'translate(-50%, -50%)' }}
          aria-hidden="true"
        >
          <circle
            cx="220"
            cy="220"
            r="196"
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1"
            strokeDasharray="2 12"
          />
          <circle
            cx="220"
            cy="220"
            r="212"
            fill="none"
            stroke="rgba(120,180,255,0.35)"
            strokeWidth="1"
            strokeDasharray="46 320"
          />
        </svg>

        {/* ---- Giant wordmark splitting around the aperture ------------ */}
        <div
          ref={splitLeftRef}
          className="ap-split pointer-events-none absolute top-1/2 left-1/2 will-change-transform"
          style={{ transform: 'translate(-100%, -50%) translateX(-10vmin)' }}
          aria-hidden="true"
        >
          MARBLE
        </div>
        <div
          ref={splitRightRef}
          className="ap-split pointer-events-none absolute top-1/2 left-1/2 will-change-transform"
          style={{ transform: 'translate(0%, -50%) translateX(10vmin)' }}
          aria-hidden="true"
        >
          AIR
        </div>

        {/* ---- Corner meta -------------------------------------------- */}
        <div ref={metaRef} className="pointer-events-none absolute inset-0">
          <span className="ap-meta absolute top-[9%] left-[6%]">Est. Above the Clouds</span>
          <span className="ap-meta absolute top-[9%] right-[6%]">N 51.4700 / W 0.4543</span>
          <span className="ap-meta absolute bottom-[9%] left-[6%]">Altitude 41,000 FT</span>
          <span className="ap-meta absolute right-[6%] bottom-[9%]">Marble Air ®</span>
        </div>

        {/* ---- Revealed content --------------------------------------- */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <div className="w-full max-w-3xl text-center">
            <span
              ref={eyebrowRef}
              className="ap-meta block"
              style={{ opacity: 0 }}
            >
              Who we are
            </span>

            <h2
              ref={headingRef}
              className="mt-6 font-serif-tight text-4xl font-light leading-[1.06] text-white md:text-[4.2rem]"
              style={{ opacity: 0 }}
            >
              The quiet luxury
              <br />
              of flight
            </h2>

            <div className="mx-auto mt-9 max-w-2xl">
              {COPY_LINES.map((line, i) => (
                <span key={i} className="ap-line">
                  <span
                    ref={(el) => {
                      lineRefs.current[i] = el
                    }}
                    className="font-sans text-sm font-light leading-[2] text-white/85 md:text-base"
                    style={{ transform: 'translateY(105%)' }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </div>

            <div
              ref={ctaRef}
              className="pointer-events-auto mt-10 flex justify-center"
              style={{ opacity: 0 }}
            >
              <CTAButton href="#company">View Company</CTAButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
