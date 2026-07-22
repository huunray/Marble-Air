import { useRef } from 'react'
import { ASSETS, CONTAINER_WIDTH } from '../../lib/assets'
import { CTAButton } from '../CTAButton'
import { Nav } from '../Nav'
import { useScrubbedVideo } from '../../lib/useScrubbedVideo'

/**
 * Pinned hero: the background video is scrubbed by scroll from first frame to
 * last across the pin, then releases into the next section. The headline + CTA
 * fade out over the final stretch so the handoff stays clean.
 */
export function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useScrubbedVideo({
    wrapperRef,
    viewportRef,
    videoRef,
    distance: '300%',
    refreshPriority: 4,
    onProgress: (p) => {
      // Fade the headline + CTA out over the last 25% of the scrub.
      const fade = 1 - Math.max(0, (p - 0.75) / 0.25)
      const content = contentRef.current
      if (content) {
        content.style.opacity = String(fade)
        content.style.transform = `translateY(${(1 - fade) * -24}px)`
      }
    },
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
          src={ASSETS.heroVideo}
          muted
          playsInline
          preload="auto"
        />
        {/* Gentle bottom gradient so the headline stays legible without heavy shadows */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

        <Nav />

        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-16">
          <div ref={contentRef} style={{ width: CONTAINER_WIDTH }}>
            <h1 className="font-serif-tight text-4xl font-light leading-[1.1] text-white md:text-4xl">
              Where Every Flight Begins
              <br />
              With Excellence
            </h1>

            <div className="mt-8">
              <CTAButton href="#book">Book a flight</CTAButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
