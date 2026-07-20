const COLUMNS: { heading: string; links: string[] }[] = [
  { heading: 'Explore', links: ['Flights', 'Destinations', 'Experience', 'Fleet'] },
  { heading: 'Company', links: ['Who We Are', 'Careers', 'Press', 'Sustainability'] },
  { heading: 'Support', links: ['Contact', 'Baggage', 'Manage Booking', 'FAQ'] },
]

const SOCIALS = ['Instagram', 'X', 'LinkedIn']

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full bg-black">
      <div className="mx-auto max-w-[1400px] px-6 py-20">
        {/* Top row */}
        <div className="flex flex-col justify-between gap-14 md:flex-row">
          <div className="max-w-sm">
            <span className="font-serif-tight text-2xl font-light tracking-wide text-white">
              Marble Air
            </span>
            <p className="mt-6 font-sans text-sm font-light leading-relaxed text-white/60">
              A new era of flying. Marble Air composes every journey around
              stillness, craft, and the quiet luxury of the sky.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <h4 className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-white/50">
                  {col.heading}
                </h4>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="font-sans text-sm font-light text-white/75 transition-colors hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="font-sans text-xs font-light text-white/50">
            © {year} Marble Air. All rights reserved.
          </p>
          <ul className="flex items-center gap-8">
            {SOCIALS.map((social) => (
              <li key={social}>
                <a
                  href="#"
                  className="font-sans text-xs font-light uppercase tracking-widest text-white/60 transition-colors hover:text-white"
                >
                  {social}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
