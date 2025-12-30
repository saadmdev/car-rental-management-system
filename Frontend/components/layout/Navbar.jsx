'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, Phone } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path) => {
    if (path === '/pages/home' || path === '/') {
      return pathname === '/pages/home' || pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/pages/home" className="flex items-center space-x-2">
            <Car className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">Car Rental</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/pages/home"
              className={`transition-colors ${
                isActive('/pages/home')
                  ? 'text-primary font-semibold'
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              href="/pages/vehicles"
              className={`transition-colors ${
                isActive('/pages/vehicles')
                  ? 'text-primary font-semibold'
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              Vehicles
            </Link>
            <Link
              href="/pages/details"
              className={`transition-colors ${
                isActive('/pages/details')
                  ? 'text-primary font-semibold'
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              Details
            </Link>
            <Link
              href="/pages/about"
              className={`transition-colors ${
                isActive('/pages/about')
                  ? 'text-primary font-semibold'
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              About Us
            </Link>
            <Link
              href="/pages/contact"
              className={`transition-colors ${
                isActive('/pages/contact')
                  ? 'text-primary font-semibold'
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Call to Action */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2 text-gray-700">
              <Phone className="w-5 h-5" />
              <span className="text-sm">Need help?</span>
              <span className="text-sm font-semibold">+92 300 1234567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="/pages/login"
                className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                  isActive('/pages/login')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

