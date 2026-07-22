import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Marble Air — A New Era of Flying' },
      {
        name: 'description',
        content:
          'Marble Air — A New Era of Flying. A cinematic luxury airline experience: private suites above the clouds, quiet comfort, and the beauty of night above the horizon.',
      },
      { name: 'theme-color', content: '#000000' },
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Marble Air — A New Era of Flying' },
      {
        property: 'og:description',
        content:
          'A cinematic luxury airline experience. Where every flight begins with excellence.',
      },
      { property: 'og:site_name', content: 'Marble Air' },
      {
        property: 'og:image',
        content:
          '/__l5e/assets-v1/f79ed6ef-dea9-4dcb-afc9-53d952a8890b/marble_logo.png',
      },
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Marble Air — A New Era of Flying' },
      {
        name: 'twitter:description',
        content:
          'A cinematic luxury airline experience. Where every flight begins with excellence.',
      },
      {
        name: 'twitter:image',
        content:
          '/__l5e/assets-v1/f79ed6ef-dea9-4dcb-afc9-53d952a8890b/marble_logo.png',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Anton&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Urbanist:wght@300;400;500;600;700;800&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-black text-white antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
