import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import InfoSection from '@/components/home/InfoSection'
import FeaturedCars from '@/components/home/FeaturedCars'
import FactsInNumbers from '@/components/home/FactsInNumbers'
import MobileApp from '@/components/home/MobileApp'
import Newsletter from '@/components/home/Newsletter'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <InfoSection />
      <FeaturedCars />
      <FactsInNumbers />
      <MobileApp />
      <Newsletter />
      <Footer />
    </main>
  )
}

