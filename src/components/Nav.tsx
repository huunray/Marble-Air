import { ASSETS, CONTAINER_WIDTH } from '../lib/assets'

const LINKS = ['Flights', 'Destinations', 'Experience', 'Contact']

/**
 * Glass-morphism top navigation. Absolutely positioned (not fixed) so it
 * scrolls away with the hero rather than following the viewport.
 */
export function Nav() {
  return (
    <nav className="absolute inset-x-0 top-6 z-40 flex justify-center">
      <div
        className="flex items-center justify-between rounded-full border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-xl"
        style={{ width: CONTAINER_WIDTH }}
      >
        <a href="#" className="flex shrink-0 items-center" aria-label="Marble Air home">
          <img
            src={ASSETS.logo}
            alt="Marble Air"
            className="h-14 w-auto"
            draggable={false}
          />
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="font-sans text-sm font-light tracking-wide text-white/85 transition-colors hover:text-white"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#"
          className="shrink-0 rounded-full border border-white/30 px-6 py-2 font-sans text-sm font-light tracking-wide text-white transition-colors hover:border-white/70"
        >
          Sign in
        </a>
      </div>
    </nav>
  )
}
