import { ASSETS, CONTAINER_WIDTH } from '../../lib/assets'
import { CTAButton } from '../CTAButton'
import { Nav } from '../Nav'

/**
 * 100vh full-bleed hero with an autoplay/muted/loop background video, the
 * glass nav, and bottom-aligned editorial headline + primary CTA.
 */
export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={ASSETS.heroVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {/* Gentle bottom gradient so the headline stays legible without heavy shadows */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

      <Nav />

      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-16">
        <div style={{ width: CONTAINER_WIDTH }}>
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
    </section>
  )
}
