import Link from 'next/link'
import { Car, MapPin, Mail, Phone, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section - Contact Info */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/pages/home" className="flex items-center space-x-2">
              <Car className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900">Car Rental</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Your trusted partner for premium car rental services. We offer a wide selection 
              of well-maintained vehicles, competitive prices, and exceptional customer service 
              to make your journey unforgettable.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Useful links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pages/about" className="text-gray-600 hover:text-primary transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/pages/contact" className="text-gray-600 hover:text-primary transition-colors">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-600 hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-primary transition-colors">
                  F.A.Q
                </Link>
              </li>
            </ul>
          </div>

          {/* Vehicles */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Vehicles</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/vehicles/sedan" className="text-gray-600 hover:text-primary transition-colors">
                  Sedan
                </Link>
              </li>
              <li>
                <Link href="/vehicles/cabriolet" className="text-gray-600 hover:text-primary transition-colors">
                  Cabriolet
                </Link>
              </li>
              <li>
                <Link href="/vehicles/pickup" className="text-gray-600 hover:text-primary transition-colors">
                  Pickup
                </Link>
              </li>
              <li>
                <Link href="/vehicles/minivan" className="text-gray-600 hover:text-primary transition-colors">
                  Minivan
                </Link>
              </li>
              <li>
                <Link href="/vehicles/suv" className="text-gray-600 hover:text-primary transition-colors">
                  SUV
                </Link>
              </li>
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Download App</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="text-left flex-1">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              <button className="w-full flex items-center space-x-3 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left flex-1">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Address</div>
                <div className="text-sm text-gray-600">GT Road, Rawalpindi, Pakistan</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Email</div>
                <div className="text-sm text-gray-600">saadmdev@gmail.com</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Phone</div>
                <div className="text-sm text-gray-600">+92 300 1234567</div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © Copyright Car Rental 2025
          </p>
        </div>
      </div>
    </footer>
  )
}

