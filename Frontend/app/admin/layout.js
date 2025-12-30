'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/layout/AdminLayout'
import { isAuthenticated } from '@/lib/api/auth'

export default function AdminLayoutWrapper({ children }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    // Mark component as mounted (client-side only)
    setMounted(true)
    
    // Check authentication after mount
    const authStatus = isAuthenticated()
    setIsAuth(authStatus)
    
    if (!authStatus) {
      router.push('/pages/login?redirect=/admin/dashboard')
    }
  }, [router])

  // Show consistent loading state during SSR and initial render
  if (!mounted || !isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <AdminLayout>{children}</AdminLayout>
}

