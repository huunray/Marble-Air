import { CTAButton } from '../CTAButton'

/**
 * CTA section featuring a CSS-drawn airplane window: an oval metal bezel
 * wrapping an inner glass pane that frames a night sky and the primary CTA.
 * The sky is drawn with layered gradients so the section is self-contained.
 */
export function FlyBeyond() {
  return (
    <section
      id="book"
      className="flex w-full justify-center px-6 py-32 md:py-44"
      style={{ backgroundColor: '#0b0d12' }}
    >
      <div
        className="relative"
        style={{ width: 'min(560px, 92vw)', aspectRatio: '560 / 700' }}
      >
        {/* Oval metal bezel */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            borderRadius: '50% / 34%',
            background:
              'radial-gradient(120% 120% at 50% 15%, #2a2f3a 0%, #171a21 45%, #0d0f14 100%)',
            boxShadow:
              'inset 0 2px 3px rgba(255,255,255,0.10), inset 0 -14px 40px rgba(0,0,0,0.75), 0 40px 90px rgba(0,0,0,0.6)',
            padding: '30px',
          }}
        >
          {/* Inner glass window */}
          <div
            className="relative h-full w-full overflow-hidden"
            style={{
              borderRadius: '50% / 40%',
              boxShadow:
                'inset 0 3px 10px rgba(255,255,255,0.14), inset 0 -20px 60px rgba(0,0,0,0.85)',
            }}
          >
            {/* Night sky / clouds backdrop */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(90% 70% at 50% 25%, #24405f 0%, #16273c 40%, #0a1020 75%, #060912 100%), linear-gradient(180deg, rgba(60,90,130,0.35), rgba(6,9,18,0.9))',
              }}
            />
            {/* Soft cloud banks */}
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  'radial-gradient(60% 30% at 30% 78%, rgba(120,150,190,0.35), transparent 60%), radial-gradient(50% 26% at 72% 88%, rgba(90,120,160,0.30), transparent 60%), radial-gradient(40% 18% at 50% 96%, rgba(150,175,205,0.25), transparent 60%)',
              }}
            />
            {/* Vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(75% 75% at 50% 45%, transparent 55%, rgba(0,0,0,0.7) 100%)',
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-10 text-center">
              <LightningIcon />
              <h2 className="mt-6 font-serif-tight text-4xl font-light leading-[1.1] text-white md:text-5xl">
                Fly Beyond the
                <br />
                Horizon
              </h2>
              <p className="mt-5 max-w-xs font-sans text-sm font-light leading-relaxed text-white/70">
                Experience comfort, silence, and the beauty of night above the
                clouds
              </p>
              <div className="mt-8">
                <CTAButton href="#book">Book Your Journey</CTAButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LightningIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white/90"
      aria-hidden="true"
    >
      <path d="M13 2 4.5 13.5H11l-1.5 8.5 8.5-12H11.5L13 2z" />
    </svg>
  )
}
