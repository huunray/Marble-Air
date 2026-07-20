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
  /**
   * Download the whole clip into memory (Blob) before scrubbing so every seek
   * is instant with no network stalls. Best for smoothness on clips that aren't
   * keyframe-dense or are served in chunks. Falls back to direct streaming if
   * the fetch fails (e.g. CORS).
   */
  preloadBlob?: boolean
  /** Lerp smoothing factor (0..1). Lower = smoother/softer, higher = snappier. */
  smoothing?: number
}

/**
 * Pins a section and scrubs its background <video> by scroll: scrolling the
 * pinned distance plays the clip from first frame to last, then releases into
 * the next section.
 *
 * Smoothness comes from two things: (1) a requestAnimationFrame lerp loop eases
 * the playhead toward the scroll target instead of snapping, and (2) seeks are
 * *gated* — a new `currentTime` is only issued once the previous seek has
 * finished (`video.seeking` is false). Without that gate, seeks queue faster
 * than the decoder can service them and playback stutters/breaks. Optionally the
 * whole file is held in memory as a Blob so seeks never wait on the network.
 *
 * Pin lives on the inner viewport while the trigger is the outer wrapper, so
 * later sections don't premature-unpin or leave a gap.
 */
export function useScrubbedVideo({
  wrapperRef,
  viewportRef,
  videoRef,
  distance = '300%',
  refreshPriority = 0,
  onProgress,
  preloadBlob = false,
  smoothing = 0.1,
}: ScrubbedVideoOptions) {
  useEffect(() => {
    const wrapper = wrapperRef.current
    const viewport = viewportRef.current
    const video = videoRef.current
    if (!wrapper || !viewport || !video) return

    let current = 0 // eased playhead position
    let rafId = 0
    let trigger: ScrollTrigger | null = null
    let killed = false
    let lastProgress = 0
    let blobUrl: string | null = null

    const hasDuration = () =>
      !!video.duration && !Number.isNaN(video.duration) && video.duration > 0

    // Seek only when the decoder is idle. Issuing currentTime while the video is
    // already mid-seek is what causes the intermittent "breaking".
    const applySeek = () => {
      if (!hasDuration() || video.seeking) return
      const time = Math.max(0, Math.min(current, video.duration - 0.05))
      if (Math.abs(video.currentTime - time) < 1 / 60) return // already there
      try {
        video.currentTime = time
      } catch {
        /* seeking may throw transiently; ignored */
      }
    }

    const lerp = () => {
      const target = lastProgress * (hasDuration() ? video.duration : 1)
      current += (target - current) * smoothing
      if (Math.abs(target - current) < 0.001) current = target
      applySeek()
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

    const attachPrime = () => {
      if (video.readyState >= 1) prime()
      else video.addEventListener('loadedmetadata', prime, { once: true })
    }

    // Pull the entire clip into memory so seeks are network-stall free.
    const loadIntoMemory = () => {
      const originalSrc = video.currentSrc || video.src
      if (!originalSrc) return
      fetch(originalSrc, { mode: 'cors' })
        .then((res) => {
          if (!res.ok) throw new Error(`status ${res.status}`)
          return res.blob()
        })
        .then((blob) => {
          if (killed) return
          blobUrl = URL.createObjectURL(blob)
          video.src = blobUrl
          video.load()
          attachPrime()
        })
        .catch(() => {
          // Streaming fallback: keep the original src and scrub as best we can.
          if (!killed) attachPrime()
        })
    }

    video.pause()
    setup()

    if (preloadBlob) {
      loadIntoMemory()
    } else {
      attachPrime()
    }

    return () => {
      killed = true
      cancelAnimationFrame(rafId)
      trigger?.kill()
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
