import { createFileRoute } from '@tanstack/react-router'
import { Preloader } from '../components/Preloader'
import { Hero } from '../components/sections/Hero'
import { Walkthrough } from '../components/sections/Walkthrough'
import { SkyGlobe } from '../components/sections/SkyGlobe'
import { WhoWeAre } from '../components/sections/WhoWeAre'
import { Cabins } from '../components/sections/Cabins'
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
      <Walkthrough />
      <SkyGlobe />
      <WhoWeAre />
      <Cabins />
      <FlyBeyond />
      <Footer />
    </main>
  )
}
