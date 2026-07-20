import { useEffect, useState } from 'react'

/**
 * Full-screen black boarding overlay shown on first load for ~3.4s.
 * Fades out, then unmounts entirely so it never blocks scroll interactions.
 */
export function Preloader() {
  const [progress, setProgress] = useState(0)
  const [fading, setFading] = useState(false)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    const start = performance.now()
    const duration = 3200
    let raf = 0

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      // Ease-out for a graceful fill.
      setProgress(1 - Math.pow(1 - t, 2))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setFading(true)
        window.setTimeout(() => setMounted(false), 900)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-[900ms] ease-out ${
        fading ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden={fading}
    >
      <span className="font-serif-tight text-4xl font-light tracking-wide text-white/90">
        Marble Air
      </span>

      <div className="mt-10 flex flex-col items-center gap-3">
        <span className="font-sans text-[0.7rem] font-light uppercase tracking-[0.45em] text-white/60">
          Boarding…
        </span>
        <div className="h-px w-48 overflow-hidden bg-white/15">
          <div
            className="h-full bg-white/80"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
