'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

export default function Newsletter() {
  const [city, setCity] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Search city:', city)
  }

  return (
    <section className="py-20 bg-primary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
        }}></div>
      </div>

      {/* Car Silhouette */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Find your perfect rental car in any city
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Search for available vehicles in your city. Enter your location below to discover 
            our wide selection of cars ready for your next adventure.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:ring-2 focus:ring-accent focus:outline-none"
            />
            <button
              type="submit"
              className="bg-accent text-white px-8 py-4 rounded-lg hover:bg-accent-dark transition-colors font-semibold flex items-center space-x-2"
            >
              <span>Search</span>
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

