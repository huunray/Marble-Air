import { useRef, useState } from 'react'
import { ASSETS } from '../../lib/assets'
import { useScrubbedVideo } from '../../lib/useScrubbedVideo'

interface Block {
  headline: string
  subtext: string
}

const BLOCKS: Block[] = [
  {
    headline: 'Sensory Cabin Acoustics',
    subtext: 'Studio-grade silence, tuned to every frequency of calm.',
  },
  {
    headline: 'Bespoke Culinary Haven',
    subtext: 'Chef-crafted menus, plated on demand.',
  },
  {
    headline: 'Circadian Microclimate',
    subtext: "Light and air that follow your body's clock.",
  },
  {
    headline: 'Intelligent Ergonomic Repose',
    subtext: 'Seating that reshapes itself around you.',
  },
  {
    headline: 'Celestial Multi-Channel Link',
    subtext: 'Uninterrupted connection, from anywhere on earth.',
  },
]

const SEG = 1 / BLOCKS.length

const clamp = (v: number) => Math.max(0, Math.min(1, v))
const smooth = (v: number) => {
  const x = clamp(v)
  return x * x * (3 - 2 * x)
}

export function Experience() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)

  useScrubbedVideo({
    wrapperRef,
    viewportRef,
    videoRef,
    distance: '500%',
    refreshPriority: 3,
    onProgress: setProgress,
    preloadBlob: true, // hold the whole clip in memory for stall-free scrubbing
    smoothing: 0.1,
  })

  const activeIndex = Math.min(BLOCKS.length - 1, Math.floor(progress / SEG))

  return (
    <div ref={wrapperRef} className="relative w-full bg-black">
      <div
        ref={viewportRef}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={ASSETS.experienceVideo}
          muted
          playsInline
          preload="metadata"
        />
        {/* Section eyebrow */}
        <div className="absolute inset-x-0 top-[12%] flex justify-center">
          <span className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.5em] text-white/55">
            The Marble Experience
          </span>
        </div>

        {/* Reveal stack — each block occupies the same space and takes its turn */}
        <div className="absolute inset-0 flex items-center justify-center">
          {BLOCKS.map((block, i) => (
            <RevealBlock key={i} block={block} index={i} progress={progress} />
          ))}
        </div>

        {/* Progress index + ticks */}
        <div className="absolute inset-x-0 bottom-[9%] flex flex-col items-center gap-4">
          <div className="flex items-baseline gap-2 font-serif-tight text-white">
            <span className="text-2xl font-light">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-sm text-white/40">
              / {String(BLOCKS.length).padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {BLOCKS.map((_, i) => (
              <span
                key={i}
                className="h-px bg-white transition-all duration-500"
                style={{
                  width: i === activeIndex ? '2.25rem' : '1rem',
                  opacity: i === activeIndex ? 0.9 : 0.3,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function RevealBlock({
  block,
  index,
  progress,
}: {
  block: Block
  index: number
  progress: number
}) {
  // Local time within this block's segment (0 → 1).
  const t = (progress - index * SEG) / SEG
  const inSegment = t >= 0 && t <= 1

  // Enter over the first third, exit over the last quarter.
  const enter = smooth(t / 0.34)
  const enterDelayed = smooth((t - 0.08) / 0.34)
  const exit = smooth((t - 0.74) / 0.26)

  const visible = inSegment ? enter * (1 - exit) : 0
  const lift = (1 - enter) * 46 - exit * 46 // rise in, drift up on exit

  return (
    <div
      className="absolute max-w-3xl px-8 text-center"
      style={{
        opacity: visible,
        transform: `translateY(${lift}px)`,
        pointerEvents: visible > 0.5 ? 'auto' : 'none',
      }}
      aria-hidden={visible < 0.5}
    >
      {/* Expanding hairline above the headline */}
      <span
        className="mx-auto mb-7 block h-px bg-white/70"
        style={{ width: `${enter * 3.5}rem` }}
      />

      {/* Headline wipes in left → right with the scroll */}
      <h2
        className="font-serif-tight text-5xl font-light leading-[1.05] text-white md:text-7xl"
        style={{ clipPath: `inset(0 ${(1 - enter) * 100}% 0 0)` }}
      >
        {block.headline}
      </h2>

      {/* Subtext follows, slightly staggered */}
      <p
        className="mt-6 font-sans text-base font-light leading-relaxed text-white/75 md:text-lg"
        style={{
          opacity: enterDelayed * (1 - exit),
          transform: `translateY(${(1 - enterDelayed) * 16}px)`,
        }}
      >
        {block.subtext}
      </p>
    </div>
  )
}
