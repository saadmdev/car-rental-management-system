import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import CompanyValues from '@/components/ui/CompanyValues'
import VideoPlayer from '@/components/ui/VideoPlayer'
import FactsSection from '@/components/ui/FactsSection'
import MemoriesSection from '@/components/ui/MemoriesSection'
import MobileApp from '@/components/home/MobileApp'
import ReviewsSection from '@/components/ui/ReviewsSection'
import FAQ from '@/components/ui/FAQ'
import CTABanner from '@/components/ui/CTABanner'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <PageHeader
        title="About Us"
        breadcrumbs={[
          { label: 'Home', href: '/pages/home' },
          { label: 'About Us', href: null },
        ]}
      />

      <CompanyValues />
      <VideoPlayer />
      <FactsSection />
      <MemoriesSection />
      <MobileApp variant="purple" />
      <ReviewsSection />
      <FAQ />
      <CTABanner />

      <Footer />
    </main>
  )
}

