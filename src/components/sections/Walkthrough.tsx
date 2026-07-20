import { useRef, useState } from 'react'
import { ASSETS } from '../../lib/assets'
import { useScrubbedVideo } from '../../lib/useScrubbedVideo'

interface Block {
  eyebrow: string
  title: string
  body: string
  side: 'left' | 'right'
  at: number // progress center where this block is fully revealed
}

const BLOCKS: Block[] = [
  {
    eyebrow: '01 — Arrival',
    title: 'The journey begins long before takeoff',
    body: 'From the private lounge to the jet bridge, every moment is composed with intention and quiet.',
    side: 'left',
    at: 0.12,
  },
  {
    eyebrow: '02 — Ascent',
    title: 'Rise above the ordinary',
    body: 'A cabin engineered for silence, where altitude becomes a feeling rather than a number.',
    side: 'right',
    at: 0.32,
  },
  {
    eyebrow: '03 — Craft',
    title: 'Considered in every detail',
    body: 'Hand-finished materials, tailored lighting, and service shaped around the rhythm of your day.',
    side: 'left',
    at: 0.52,
  },
  {
    eyebrow: '04 — Comfort',
    title: 'Rest, unhurried',
    body: 'Space to work, dine, and sleep — an interior that adapts to how you wish to travel.',
    side: 'right',
    at: 0.72,
  },
  {
    eyebrow: '05 — Horizon',
    title: 'Arrive as your finest self',
    body: 'Descend renewed, carried by an experience made to feel effortless from first light to landing.',
    side: 'left',
    at: 0.9,
  },
]

const WINDOW = 0.11 // half-width of the reveal window around each block's `at`

export function Walkthrough() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)

  useScrubbedVideo({
    wrapperRef,
    viewportRef,
    videoRef,
    distance: '500%',
    refreshPriority: 2,
    onProgress: setProgress,
  })

  return (
    <div ref={wrapperRef} className="relative w-full bg-black">
      <div
        ref={viewportRef}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
        >
          <source src={ASSETS.walkthrough.webm} type="video/webm" />
          <source src={ASSETS.walkthrough.mp4} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0">
          {BLOCKS.map((block, i) => {
            const active = Math.abs(progress - block.at) < WINDOW
            return (
              <WalkthroughBlock key={i} block={block} active={active} />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function WalkthroughBlock({
  block,
  active,
}: {
  block: Block
  active: boolean
}) {
  const alignLeft = block.side === 'left'
  return (
    <div
      className={`absolute top-1/2 max-w-md -translate-y-1/2 px-8 transition-opacity duration-700 md:px-16 ${
        alignLeft ? 'left-0 md:left-[6%]' : 'right-0 md:right-[6%]'
      } ${active ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className={`flex gap-5 ${alignLeft ? '' : 'flex-row-reverse text-right'}`}>
        {/* Vertical hairline + dot indicator */}
        <div className="flex flex-col items-center pt-2">
          <span
            className={`h-2 w-2 rounded-full bg-white transition-transform duration-700 ${
              active ? 'scale-100' : 'scale-0'
            }`}
          />
          <span
            className="mt-2 w-px flex-1 bg-white/40 transition-[height] duration-700"
            style={{ height: active ? '5rem' : '0rem' }}
          />
        </div>

        <div>
          <p className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.4em] text-white/60">
            {block.eyebrow}
          </p>
          <h3
            className="mt-4 overflow-hidden font-serif-tight text-3xl font-light leading-tight text-white transition-[clip-path] duration-[900ms] ease-out md:text-4xl"
            style={{
              clipPath: active ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
            }}
          >
            {block.title}
          </h3>
          <p
            className="mt-4 overflow-hidden font-sans text-sm font-light leading-relaxed text-white/70 transition-[clip-path] duration-[900ms] ease-out"
            style={{
              clipPath: active ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
              transitionDelay: active ? '120ms' : '0ms',
            }}
          >
            {block.body}
          </p>
        </div>
      </div>
    </div>
  )
}
