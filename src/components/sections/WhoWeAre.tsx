import { ASSETS } from '../../lib/assets'
import { CTAButton } from '../CTAButton'

export function WhoWeAre() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
      <img
        src={ASSETS.whoWeAreBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center">
        <h2 className="font-serif-tight text-5xl font-light text-white md:text-6xl">
          Who we are
        </h2>

        <p className="mt-10 font-sans text-base font-light leading-[1.9] text-white/80">
          No matter how the world changes, what truly enriches human life
          remains the same. Across continents and skies, we nurture the journey
          through craft, shape every detail through care, and guide a return to
          oneself through the quiet luxury of flight.
        </p>
        <p className="mt-6 font-sans text-base font-light leading-[1.9] text-white/80">
          Across cultures and borders, we carry a way of being — timeless and
          quietly alive — where every traveler's inner calm is free to unfold.
        </p>

        <div className="mt-12">
          <CTAButton href="#company">View Company</CTAButton>
        </div>
      </div>
    </section>
  )
}
