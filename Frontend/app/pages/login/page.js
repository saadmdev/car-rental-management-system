'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHeader from '@/components/ui/PageHeader'
import LoginForm from '@/components/ui/LoginForm'
import { isAuthenticated } from '@/lib/api/auth'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirect = searchParams.get('redirect')

  useEffect(() => {
    // If already authenticated, redirect
    if (isAuthenticated()) {
      router.push(redirect || '/admin/dashboard')
    }
  }, [redirect, router])

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <PageHeader
        title="Login"
        breadcrumbs={[
          { label: 'Home', href: '/pages/home' },
          { label: 'Login', href: null },
        ]}
      />

      {/* Login Form Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <LoginForm redirect={redirect} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

