import { useRef, useState } from 'react'
import { ASSETS } from '../../lib/assets'
import { useScrubbedVideo } from '../../lib/useScrubbedVideo'

// The video shows the open sky first, then transforms into a globe. The sky
// phase runs long (~70%), then a short pause (~2s of the clip), then the globe
// phase brings up the destinations (~30%).
const SKY_END = 0.64 // sky boxes finish revealing by here
const DEST_START = 0.7 // destinations begin after the pause

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

  const skySeg = SKY_END / SKY_BLOCKS.length
  const destSeg = (1 - DEST_START) / DESTINATIONS.length

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

        {/* Phase 1 — sky: small dark-glass boxes scroll up, one by one */}
        {SKY_BLOCKS.map((block, i) => {
          const t = (progress - i * skySeg) / skySeg
          const inSeg = t >= 0 && t <= 1
          const enter = smooth(t / 0.3)
          const exit = smooth((t - 0.7) / 0.3)
          const opacity = inSeg ? enter * (1 - exit) : 0
          const y = (0.5 - t) * 90 // scroll upward through its resting spot
          return (
            <div
              key={`sky-${i}`}
              className="dest-card absolute bottom-[9%] left-[5%] w-[min(400px,84vw)] px-8 py-7 text-left"
              style={{
                opacity,
                transform: `translateY(${y}px)`,
                pointerEvents: opacity > 0.5 ? 'auto' : 'none',
              }}
              aria-hidden={opacity < 0.5}
            >
              <h3 className="font-serif-tight text-2xl font-light leading-[1.14] text-white md:text-3xl">
                {block.header}
              </h3>
              <p className="mt-3 max-w-xs font-sans text-sm font-light leading-relaxed text-white/80">
                {block.sub}
              </p>
            </div>
          )
        })}

        {/* Phase 2 — globe: smaller dark-glass destination cards slide left → right */}
        {DESTINATIONS.map((dest, j) => {
          const start = DEST_START + j * destSeg
          const t = (progress - start) / destSeg
          const inSeg = t >= 0 && t <= 1
          const enter = smooth(t / 0.35)
          const exit = smooth((t - 0.65) / 0.35)
          const opacity = inSeg ? enter * (1 - exit) : 0
          const x = (t - 0.5) * 90 // subtle travel from left to right
          return (
            <div
              key={`dest-${j}`}
              className="dest-card absolute bottom-[9%] left-[5%] w-[min(320px,80vw)] px-7 py-6 text-left"
              style={{
                opacity,
                transform: `translateX(${x}px)`,
                pointerEvents: opacity > 0.5 ? 'auto' : 'none',
              }}
              aria-hidden={opacity < 0.5}
            >
              <span className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.42em] text-blue-200/70">
                Destination {String(j + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2.5 font-serif-tight text-xl font-light leading-tight text-white md:text-2xl">
                {dest.city}
              </h3>
              <p className="mt-2 font-sans text-xs font-light leading-relaxed text-white/75 md:text-sm">
                {dest.sub}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
