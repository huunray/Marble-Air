import { useRef, useState } from 'react'
import { ASSETS } from '../../lib/assets'
import { useScrubbedVideo } from '../../lib/useScrubbedVideo'

// The video shows the open sky first, then transforms into a globe. We split
// the scroll into a "sky" phase and a "globe" phase to match it.
const PHASE_SPLIT = 0.6

interface SkyBlock {
  header: string
  sub: string
}

const SKY_BLOCKS: SkyBlock[] = [
  {
    header: 'Fly Through the World',
    sub: 'From one horizon to the next, every journey with Marble Air is drawn with intention.',
  },
  {
    header: 'A Network Without Limits',
    sub: 'Continents brought closer, cultures within reach — the sky reshaped around you.',
  },
  {
    header: 'The Sky Has No Borders',
    sub: 'Wherever the world calls, we chart the course and carry you gently across it.',
  },
]

interface Destination {
  city: string
  sub: string
}

const DESTINATIONS: Destination[] = [
  { city: 'Tokyo', sub: 'Where tradition meets tomorrow.' },
  { city: 'Paris', sub: 'The quiet art of arrival.' },
  { city: 'Dubai', sub: 'Above the golden desert.' },
  { city: 'Singapore', sub: 'A garden between the skies.' },
]

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const smooth = (v: number) => {
  const x = clamp(v)
  return x * x * (3 - 2 * x)
}

export function Destinations() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)

  useScrubbedVideo({
    wrapperRef,
    viewportRef,
    videoRef,
    distance: '600%',
    refreshPriority: 2,
    onProgress: setProgress,
    preloadBlob: true,
    smoothing: 0.1,
  })

  const skySeg = PHASE_SPLIT / SKY_BLOCKS.length
  const destSeg = (1 - PHASE_SPLIT) / DESTINATIONS.length

  return (
    <div ref={wrapperRef} className="relative w-full bg-black">
      <div
        ref={viewportRef}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={ASSETS.destinationsVideo}
          muted
          playsInline
          preload="metadata"
        />

        {/* Section eyebrow */}
        <div className="pointer-events-none absolute inset-x-0 top-[10%] flex justify-center">
          <span
            className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.5em] text-white/70"
            style={{ textShadow: '0 1px 12px rgba(0,0,0,0.6)' }}
          >
            Marble Air — Destinations
          </span>
        </div>

        {/* Phase 1 — sky: frosted boxes scroll up, one by one */}
        {SKY_BLOCKS.map((block, i) => {
          const t = (progress - i * skySeg) / skySeg
          const inSeg = t >= 0 && t <= 1
          const enter = smooth(t / 0.3)
          const exit = smooth((t - 0.7) / 0.3)
          const opacity = inSeg ? enter * (1 - exit) : 0
          const y = (0.5 - t) * 150 // scroll upward through the centre
          return (
            <div
              key={`sky-${i}`}
              className="absolute top-1/2 left-1/2 w-[min(560px,88vw)] rounded-3xl border border-white/20 bg-white/10 px-12 py-14 text-center backdrop-blur-2xl"
              style={{
                opacity,
                transform: `translate(-50%, -50%) translateY(${y}px)`,
                boxShadow: '0 30px 90px rgba(0,0,0,0.35)',
                pointerEvents: opacity > 0.5 ? 'auto' : 'none',
              }}
              aria-hidden={opacity < 0.5}
            >
              <h3 className="font-serif-tight text-4xl font-light leading-[1.1] text-white md:text-5xl">
                {block.header}
              </h3>
              <p className="mx-auto mt-5 max-w-md font-sans text-base font-light leading-relaxed text-white/80">
                {block.sub}
              </p>
            </div>
          )
        })}

        {/* Phase 2 — globe: smaller frosted destination cards slide left → right */}
        {DESTINATIONS.map((dest, j) => {
          const start = PHASE_SPLIT + j * destSeg
          const t = (progress - start) / destSeg
          const inSeg = t >= 0 && t <= 1
          const enter = smooth(t / 0.35)
          const exit = smooth((t - 0.65) / 0.35)
          const opacity = inSeg ? enter * (1 - exit) : 0
          const x = (t - 0.5) * 220 // travel from left to right
          return (
            <div
              key={`dest-${j}`}
              className="absolute top-1/2 left-1/2 w-[min(400px,82vw)] rounded-2xl border border-white/20 bg-white/10 px-9 py-7 text-left backdrop-blur-2xl"
              style={{
                opacity,
                transform: `translate(-50%, -50%) translateX(${x}px)`,
                boxShadow: '0 24px 70px rgba(0,0,0,0.35)',
                pointerEvents: opacity > 0.5 ? 'auto' : 'none',
              }}
              aria-hidden={opacity < 0.5}
            >
              <span className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-white/55">
                Destination {String(j + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-serif-tight text-2xl font-light leading-tight text-white md:text-3xl">
                {dest.city}
              </h3>
              <p className="mt-2 font-sans text-sm font-light leading-relaxed text-white/75">
                {dest.sub}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
