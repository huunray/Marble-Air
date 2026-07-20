import { useRef, useState } from 'react'
import { ASSETS } from '../../lib/assets'
import { useScrubbedVideo } from '../../lib/useScrubbedVideo'

interface Chapter {
  title: string
  subtext: string
  side: 'left' | 'right'
}

const CHAPTERS: Chapter[] = [
  {
    title: 'The World\nWithin Reach',
    subtext:
      'Every horizon becomes a destination. A network drawn across the globe, connecting the places that matter most.',
    side: 'left',
  },
  {
    title: 'Connecting Continents,\nCreating Possibilities',
    subtext:
      'From one shore to another, we carry more than passengers — we carry intention, calm, and the quiet promise of arrival.',
    side: 'right',
  },
]

export function SkyGlobe() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)

  useScrubbedVideo({
    wrapperRef,
    viewportRef,
    videoRef,
    distance: '500%',
    refreshPriority: 1,
    onProgress: setProgress,
  })

  // Crossfade: first chapter dominant early, second dominant late.
  const firstOpacity = clamp(1 - (progress - 0.28) / 0.18)
  const secondOpacity = clamp((progress - 0.5) / 0.18)

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
          <source src={ASSETS.skyGlobe.webm} type="video/webm" />
          <source src={ASSETS.skyGlobe.mp4} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />

        <Chapter chapter={CHAPTERS[0]} opacity={firstOpacity} />
        <Chapter chapter={CHAPTERS[1]} opacity={secondOpacity} />
      </div>
    </div>
  )
}

function Chapter({ chapter, opacity }: { chapter: Chapter; opacity: number }) {
  const alignLeft = chapter.side === 'left'
  return (
    <div
      className={`absolute inset-y-0 flex max-w-2xl flex-col justify-center px-8 md:px-20 ${
        alignLeft ? 'left-0 items-start text-left' : 'right-0 items-end text-right'
      }`}
      style={{ opacity, transform: `translateY(${(1 - opacity) * 24}px)` }}
    >
      <h2 className="font-serif-tight text-5xl font-light leading-[1.05] text-white md:text-7xl">
        {chapter.title.split('\n').map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h2>
      <p className="mt-6 max-w-md font-sans text-base font-light leading-relaxed text-white/70">
        {chapter.subtext}
      </p>
    </div>
  )
}

function clamp(v: number) {
  return Math.max(0, Math.min(1, v))
}
