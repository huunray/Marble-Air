import type { ReactNode } from 'react'

interface CTAButtonProps {
  children: ReactNode
  href?: string
  className?: string
}

/**
 * Signature Marble Air call-to-action: a white pill with black text and a
 * small black circular chip on the right holding a white diagonal up-right
 * arrow. Reused across every section.
 */
export function CTAButton({ children, href = '#', className = '' }: CTAButtonProps) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-4 rounded-full bg-white py-2 pr-2 pl-6 text-black transition-transform duration-300 hover:-translate-y-0.5 ${className}`}
    >
      <span className="font-sans text-sm font-medium tracking-wide">
        {children}
      </span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
        <ArrowUpRight />
      </span>
    </a>
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
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  )
}
