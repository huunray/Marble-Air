import { createFileRoute } from '@tanstack/react-router'
import { Preloader } from '../components/Preloader'
import { Hero } from '../components/sections/Hero'
import { Experience } from '../components/sections/Experience'
import { WhoWeAre } from '../components/sections/WhoWeAre'
import { FlyBeyond } from '../components/sections/FlyBeyond'
import { Footer } from '../components/sections/Footer'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="relative w-full bg-black">
      <Preloader />
      <Hero />
      <Experience />
      <WhoWeAre />
      <FlyBeyond />
      <Footer />
    </main>
  )
}
