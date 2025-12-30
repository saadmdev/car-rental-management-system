'use client'

import Link from 'next/link'
import { Info, CheckCircle } from 'lucide-react'

export default function SignupForm() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-primary p-6 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Create Account</h2>
        <p className="text-white/90">Sign up to get started with car rentals</p>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Information Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Guest Booking Supported</h3>
              <p className="text-blue-800 mb-4">
                Account system coming soon. You can book vehicles as a guest without creating an account.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-blue-800">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">No account required for bookings</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-800">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Customer information collected during booking</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-800">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Quick and easy booking process</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA to Book Vehicle */}
        <Link
          href="/pages/vehicles"
          className="block w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold text-center"
        >
          Browse Available Vehicles
        </Link>

        {/* Login Link */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Admin access?{' '}
            <Link
              href="/pages/login"
              className="text-primary hover:text-primary-dark font-semibold"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

