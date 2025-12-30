import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import ServiceDetails from '@/components/ui/ServiceDetails'
import PricingDetails from '@/components/ui/PricingDetails'
import RentalProcess from '@/components/ui/RentalProcess'
import WhyChooseUs from '@/components/ui/WhyChooseUs'
import DetailsFAQ from '@/components/ui/DetailsFAQ'
import CTABanner from '@/components/ui/CTABanner'

export default function DetailsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <PageHeader
        title="Details"
        breadcrumbs={[
          { label: 'Home', href: '/pages/home' },
          { label: 'Details', href: null },
        ]}
      />

      <ServiceDetails />
      <RentalProcess />
      <PricingDetails />
      <WhyChooseUs />
      <DetailsFAQ />
      <CTABanner />

      <Footer />
    </main>
  )
}

