'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function LoginForm({ redirect = null }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { login } = await import('@/lib/api/auth')
      const result = await login(formData.email, formData.password)
      
      // Redirect to admin dashboard or specified redirect URL
      if (result) {
        const redirectUrl = redirect || '/admin/dashboard'
        window.location.href = redirectUrl
      }
    } catch (error) {
      alert(error.message || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-primary p-6 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-white/90">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <Link
            href="/pages/forgot-password"
            className="text-sm text-primary hover:text-primary-dark font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center space-x-2"
        >
          <span>Sign In</span>
          <LogIn className="w-5 h-5" />
        </button>

        {/* Guest Booking Info */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            Guest booking available - no account required
          </p>
          <Link
            href="/pages/vehicles"
            className="text-sm text-primary hover:text-primary-dark font-semibold"
          >
            Browse vehicles and book as guest →
          </Link>
        </div>
      </form>
    </div>
  )
}

