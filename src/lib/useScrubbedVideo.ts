import { useEffect } from 'react'
import type { RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrubbedVideoOptions {
  wrapperRef: RefObject<HTMLElement | null>
  viewportRef: RefObject<HTMLElement | null>
  videoRef: RefObject<HTMLVideoElement | null>
  /** Scroll distance for the pin, e.g. '300%'. Longer = slower playback. */
  distance?: string
  /** Explicit ScrollTrigger.refreshPriority for cross-section ordering. */
  refreshPriority?: number
  /** Called each tick with pin progress (0..1) so callers can drive UI. */
  onProgress?: (progress: number) => void
}

/**
 * Pins a section and scrubs its background <video> by scroll: scrolling the
 * pinned distance plays the clip from first frame to last, then releases into
 * the next section.
 *
 * The video is primed (a short seek to force buffering) before scrubbing is
 * enabled. Playback position is driven by a requestAnimationFrame lerp loop so
 * the frames read as smooth motion rather than discrete seeks. Pin lives on the
 * inner viewport while the trigger is the outer wrapper, so later sections
 * don't premature-unpin or leave a gap.
 */
export function useScrubbedVideo({
  wrapperRef,
  viewportRef,
  videoRef,
  distance = '300%',
  refreshPriority = 0,
  onProgress,
}: ScrubbedVideoOptions) {
  useEffect(() => {
    const wrapper = wrapperRef.current
    const viewport = viewportRef.current
    const video = videoRef.current
    if (!wrapper || !viewport || !video) return

    let current = 0 // last-applied currentTime
    let target = 0 // desired currentTime
    let rafId = 0
    let trigger: ScrollTrigger | null = null
    let killed = false

    let lastProgress = 0

    const hasDuration = () =>
      !!video.duration && !Number.isNaN(video.duration) && video.duration > 0

    const lerp = () => {
      target = lastProgress * (hasDuration() ? video.duration : 1)
      current += (target - current) * 0.12
      if (Math.abs(target - current) < 0.001) current = target
      if (hasDuration() && video.seekable.length > 0) {
        video.currentTime = Math.min(current, video.duration - 0.05)
      }
      rafId = requestAnimationFrame(lerp)
    }

    // Create the pin immediately so the section behaves correctly even if the
    // video is still buffering; scrubbing attaches once frames are available.
    const setup = () => {
      if (killed) return

      trigger = ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: `+=${distance}`,
        pin: viewport,
        pinSpacing: true,
        scrub: true,
        refreshPriority,
        onUpdate: (self) => {
          lastProgress = self.progress
          onProgress?.(self.progress)
        },
      })

      rafId = requestAnimationFrame(lerp)

      // Ensure correct measurement now that this pin exists.
      requestAnimationFrame(() => {
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
      })
    }

    // Prime the video: seek a few frames to force the browser to buffer.
    const prime = () => {
      if (killed) return
      try {
        video.currentTime = Math.min(0.1, (video.duration || 1) - 0.05)
      } catch {
        /* seeking may throw before metadata; ignored */
      }
      ScrollTrigger.refresh()
    }

    video.pause()
    setup()

    if (video.readyState >= 1) {
      prime()
    } else {
      video.addEventListener('loadedmetadata', prime, { once: true })
    }

    return () => {
      killed = true
      cancelAnimationFrame(rafId)
      trigger?.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
