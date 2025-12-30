import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import ContactBookingForm from '@/components/ui/ContactBookingForm'
import ContactInfoSection from '@/components/ui/ContactInfoSection'
import BlogPostsSection from '@/components/ui/BlogPostsSection'
import CarBrandsSection from '@/components/ui/CarBrandsSection'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <PageHeader
        title="Contact Us"
        breadcrumbs={[
          { label: 'Home', href: '/pages/home' },
          { label: 'Contact Us', href: null },
        ]}
      />

      {/* Main Content - Booking Form and Image */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left - Booking Form */}
            <ContactBookingForm />

            {/* Right - Image */}
            <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden">
              <img
                src="https://media.istockphoto.com/id/1426471241/photo/congratulations-for-buying-a-new-car.jpg?s=612x612&w=0&k=20&c=QG9G4FUJKPhkbCwpBiP9qqjeyZQo7Jr5oR7XupWyJQI="
                alt="Contact us - Car rental service"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <ContactInfoSection />

      {/* Blog Posts */}
      <BlogPostsSection />

      {/* Car Brands */}
      <CarBrandsSection />

      <Footer />
    </main>
  )
}

