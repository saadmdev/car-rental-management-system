'use client'

import { Calendar, MapPin, Search } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    carType: '',
    pickupLocation: '',
    returnLocation: '',
    pickupDate: '',
    returnDate: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.carType || !formData.pickupDate || !formData.returnDate) {
      alert('Please fill in all required fields: Car type, Rental date, and Return date')
      return
    }

    // Build query parameters
    const params = new URLSearchParams()
    if (formData.carType) params.set('type', formData.carType)
    if (formData.pickupLocation) params.set('pickup', formData.pickupLocation)
    if (formData.returnLocation) params.set('return', formData.returnLocation)
    if (formData.pickupDate) params.set('pickupDate', formData.pickupDate)
    if (formData.returnDate) params.set('returnDate', formData.returnDate)

    // Navigate to vehicles page with filters
    const queryString = params.toString()
    router.push(`/pages/vehicles${queryString ? `?${queryString}` : ''}`)
  }

  const handleViewAllCars = () => {
    router.push('/pages/vehicles')
  }

  return (
    <section className="relative bg-primary text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
        }}></div>
      </div>

      {/* Blurred Car Image */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-l from-primary to-transparent"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Experience the road like never before
            </h1>
            <p className="text-lg text-white/90 max-w-xl">
              Find the perfect car for your journey. With our wide selection of premium vehicles, 
              competitive prices, and exceptional customer service, your next adventure starts here.
            </p>
            <button 
              onClick={handleViewAllCars}
              className="bg-accent text-white px-8 py-3 rounded-lg hover:bg-accent-dark transition-colors font-semibold text-lg"
            >
              View all cars
            </button>
          </div>

          {/* Right Booking Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-gray-900">
            <h2 className="text-2xl font-bold mb-6">Book your car</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Car Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car type
                </label>
                <div className="relative">
                  <select
                    name="carType"
                    value={formData.carType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select car type</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="sport">Sport</option>
                    <option value="cabriolet">Cabriolet</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Pickup Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Place of rental
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select location</option>
                    <option value="airport">Airport</option>
                    <option value="downtown">Downtown</option>
                    <option value="suburb">Suburb</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Return Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Place of return
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="returnLocation"
                    value={formData.returnLocation}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select location</option>
                    <option value="airport">Airport</option>
                    <option value="downtown">Downtown</option>
                    <option value="suburb">Suburb</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rental date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent-dark transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <span>Book now</span>
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

