'use client'

import { Calendar, MapPin, Search } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ContactBookingForm() {
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

  return (
    <div className="bg-primary rounded-2xl p-6 md:p-8 text-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Book your car</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Car Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Car type</label>
          <div className="relative">
            <select
              name="carType"
              value={formData.carType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-accent focus:outline-none appearance-none"
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
          <label className="block text-sm font-medium mb-2">Place of rental</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-accent focus:outline-none appearance-none"
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
          <label className="block text-sm font-medium mb-2">Place of return</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              name="returnLocation"
              value={formData.returnLocation}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-accent focus:outline-none appearance-none"
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
            <label className="block text-sm font-medium mb-2">Rental date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-accent focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Return date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent-dark transition-colors font-semibold flex items-center justify-center space-x-2 mt-6"
        >
          <span>Book now</span>
          <Search className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}

