import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ASSETS } from '../../lib/assets'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Cabin {
  index: string
  name: string
  headline: string
  body: string
  cta: string
  img: string
}

const CABINS: Cabin[] = [
  {
    index: '01',
    name: 'First',
    headline: 'A private suite above the clouds.',
    body: 'A sanctuary of your own — sliding doors, a full-flat bed dressed in fine linen, and a dining experience composed course by course.',
    cta: 'View First',
    img: ASSETS.cabins.first,
  },
  {
    index: '02',
    name: 'Business',
    headline: 'Space to think. Room to rest.',
    body: 'Generous, considered, and quiet. A workspace by day and a restful retreat by night, with direct aisle access throughout.',
    cta: 'View Business',
    img: ASSETS.cabins.business,
  },
  {
    index: '03',
    name: 'Economy',
    headline: 'The quiet comfort of considered design.',
    body: 'Thoughtful ergonomics, softened lighting, and refined materials bring a sense of calm to every journey.',
    cta: 'View Economy',
    img: ASSETS.cabins.economy,
  },
]

export function Cabins() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-cabin-item]')

      items.forEach((item) => {
        const image = item.querySelector<HTMLElement>('[data-cabin-image]')
        const texts = item.querySelectorAll<HTMLElement>('[data-cabin-text]')

        if (image) {
          // Scrubbed image reveal across the item's viewport travel.
          gsap.fromTo(
            image,
            { scale: 1.15, opacity: 0.4 },
            {
              scale: 1,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        }

        // Staggered text reveal when the item hits 75% of the viewport.
        gsap.fromTo(
          texts,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: item,
              start: 'top 75%',
            },
          },
        )
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="w-full bg-black py-28">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Header row */}
        <div className="flex flex-col justify-between gap-8 pb-16 md:flex-row md:items-end">
          <h2 className="font-serif-tight text-5xl font-light leading-[1.05] text-white md:text-6xl">
            Our Cabins.
            <br />
            Comfort in every Sides.
          </h2>
          <p className="max-w-sm font-sans text-sm font-light leading-relaxed text-white/60">
            Three ways to travel, one standard of care. Each cabin is designed
            around stillness — a considered response to the noise of the world
            below.
          </p>
        </div>

        {CABINS.map((cabin) => (
          <article
            key={cabin.index}
            data-cabin-item
            className="grid grid-cols-1 items-center gap-10 border-t border-white/10 py-16 last:border-b md:grid-cols-12 md:gap-16"
          >
            {/* Text — 6 cols */}
            <div className="md:col-span-6">
              <span
                data-cabin-text
                className="font-sans text-xs font-medium uppercase tracking-[0.4em] text-white/40"
              >
                {cabin.index} — {cabin.name}
              </span>
              <h3
                data-cabin-text
                className="mt-6 font-serif-tight text-4xl font-light leading-tight text-white md:text-5xl"
              >
                {cabin.headline}
              </h3>
              <p
                data-cabin-text
                className="mt-6 max-w-md font-sans text-base font-light leading-relaxed text-white/70"
              >
                {cabin.body}
              </p>
              <a
                data-cabin-text
                href="#"
                className="mt-8 inline-flex items-center gap-4 font-serif-tight text-2xl font-light text-white transition-opacity hover:opacity-70"
              >
                <span className="h-px w-10 bg-white" />
                {cabin.cta}
              </a>
            </div>

            {/* Portrait 4:5 image — 6 cols */}
            <div className="md:col-span-6">
              <div className="relative aspect-4/5 w-full overflow-hidden bg-white/5">
                <img
                  data-cabin-image
                  src={cabin.img}
                  alt={`${cabin.name} cabin`}
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
