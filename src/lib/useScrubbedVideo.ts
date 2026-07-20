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
  /** Scroll distance for the pin, e.g. '500%'. */
  distance?: string
  /** Explicit ScrollTrigger.refreshPriority for cross-section ordering. */
  refreshPriority?: number
  /** Called each tick with pin progress (0..1) so callers can drive copy. */
  onProgress?: (progress: number) => void
}

/**
 * Sets up a pinned section whose background <video> is scrubbed by scroll.
 *
 * The video is primed (a short seek to force buffering) before scrubbing is
 * enabled. Playback position is driven by a requestAnimationFrame lerp loop so
 * the frame changes read as smooth motion rather than discrete seeks.
 *
 * Pin lives on the inner viewport while the trigger is the outer wrapper —
 * required so later sections don't premature-unpin or leave a black gap.
 */
export function useScrubbedVideo({
  wrapperRef,
  viewportRef,
  videoRef,
  distance = '500%',
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

    const lerp = () => {
      current += (target - current) * 0.12
      if (Math.abs(target - current) < 0.001) current = target
      if (video.duration && !Number.isNaN(video.duration)) {
        video.currentTime = Math.min(current, video.duration - 0.05)
      }
      rafId = requestAnimationFrame(lerp)
    }

    const setup = () => {
      if (killed) return
      const duration = video.duration || 1

      trigger = ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: `+=${distance}`,
        pin: viewport,
        pinSpacing: true,
        scrub: true,
        refreshPriority,
        onUpdate: (self) => {
          target = self.progress * duration
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

    // Prime the video: seek a few frames to force the browser to buffer,
    // then wire up scrubbing once metadata + a decoded frame are ready.
    const prime = () => {
      const kick = () => {
        try {
          video.currentTime = Math.min(0.1, (video.duration || 1) - 0.05)
        } catch {
          /* seeking may throw before metadata; ignored */
        }
        setup()
      }
      if (video.readyState >= 2) {
        kick()
      } else {
        video.addEventListener('loadeddata', kick, { once: true })
        video.addEventListener('loadedmetadata', kick, { once: true })
      }
    }

    video.pause()
    prime()

    return () => {
      killed = true
      cancelAnimationFrame(rafId)
      trigger?.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
