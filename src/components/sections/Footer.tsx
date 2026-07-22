const NAV_LINKS = ['Home', 'About', 'Experience', 'Destinations', 'Contact']
const SOCIALS = ['Instagram', 'X', 'LinkedIn']

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative w-full overflow-hidden bg-black">
      {/* Texture layers */}
      <div className="footer-grid pointer-events-none absolute inset-0" />
      <div className="footer-grain pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-8 pt-16 pb-10 md:px-12">
        {/* ---- Top row -------------------------------------------------- */}
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-start">
          {/* Left: wordmark */}
          <a
            href="#"
            className="footer-wordmark inline-flex items-start text-2xl text-marble-cream"
          >
            MARBLE·AIR
            <span className="ml-1 font-sans text-[0.6rem] not-italic">®</span>
          </a>

          {/* Center: bracketed nav */}
          <div className="flex items-center gap-5">
            <span
              className="inline-block font-sans text-5xl font-thin leading-none text-marble-cream/70"
              style={{ transform: 'scaleY(2.2)' }}
            >
              [
            </span>
            <ul className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-sans text-sm font-bold uppercase tracking-wide text-marble-cream transition-colors hover:text-marble-accent"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
            <span
              className="inline-block font-sans text-5xl font-thin leading-none text-marble-cream/70"
              style={{ transform: 'scaleY(2.2)' }}
            >
              ]
            </span>
          </div>

          {/* Right: newsletter */}
          <div className="w-full max-w-md">
            <h2 className="footer-heading text-3xl uppercase text-marble-cream md:text-4xl">
              Sign up to our newsletter
            </h2>
            <form
              className="mt-5 flex items-center gap-2 rounded-full bg-marble-accent py-2 pr-2 pl-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="YOUR EMAIL"
                aria-label="Your email"
                className="w-full bg-transparent font-sans text-sm font-semibold tracking-wide text-black placeholder:text-black/60 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-marble-accent transition-transform duration-300 hover:rotate-45"
              >
                <ArrowUpRight />
              </button>
            </form>
          </div>
        </div>

        {/* ---- Giant wordmark ------------------------------------------ */}
        <div className="relative mt-14 mb-12 w-full overflow-hidden">
          <div
            className="footer-wordmark select-none text-center text-marble-cream"
            style={{ fontSize: 'clamp(3.5rem, 22vw, 22rem)' }}
          >
            MARBLE AIR
          </div>
        </div>

        {/* ---- Bottom row ---------------------------------------------- */}
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:flex-wrap">
          <p className="font-sans text-[0.7rem] font-semibold uppercase leading-relaxed tracking-wide text-marble-cream/80">
            © {year} Marble Air /
            <br />
            All rights reserved
          </p>

          <p className="font-sans text-[0.7rem] font-semibold uppercase leading-relaxed tracking-wide text-marble-cream/80">
            Conditions of Carriage
            <br />
            Privacy Policy
            <br />
            Terms of Use
          </p>

          <ul className="flex gap-6">
            {SOCIALS.map((social) => (
              <li key={social}>
                <a
                  href="#"
                  className="font-sans text-[0.7rem] font-semibold uppercase tracking-wide text-marble-accent transition-opacity hover:opacity-70"
                >
                  {social}
                </a>
              </li>
            ))}
          </ul>

          <p className="font-sans text-[0.7rem] font-semibold uppercase leading-relaxed tracking-wide text-marble-cream/80">
            A New Era
            <br />
            Of Flying
          </p>
        </div>
      </div>
    </footer>
  )
}

function ArrowUpRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  )
}
