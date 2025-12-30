import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import SignupForm from '@/components/ui/SignupForm'

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <PageHeader
        title="Sign Up"
        breadcrumbs={[
          { label: 'Home', href: '/pages/home' },
          { label: 'Sign Up', href: null },
        ]}
      />

      {/* Signup Form Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <SignupForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

