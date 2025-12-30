'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import CarCard from '../ui/CarCard'
import { api } from '@/lib/api/client'

export default function FeaturedCars() {
  const [featuredVehicles, setFeaturedVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedVehicles()
  }, [])

  const fetchFeaturedVehicles = async () => {
    try {
      setLoading(true)
      const response = await api.getAvailableVehicles()
      if (response.success) {
        // Transform and get first 6 vehicles
        const transformed = response.data.slice(0, 6).map((vehicle) => ({
          id: vehicle._id,
          brand: `${vehicle.make} ${vehicle.model}`,
          type: vehicle.vehicleType || 'sedan',
          price: vehicle.dailyRate || 0,
          image: vehicle.images && vehicle.images.length > 0 
            ? vehicle.images[0] 
            : '/placeholder-car.jpg',
          images: vehicle.images || [],
          features: {
            transmission: vehicle.transmission || 'Automatic',
            fuel: vehicle.fuelType || 'Petrol',
            airConditioner: vehicle.features?.includes('Air Conditioner') || false,
          },
          equipment: vehicle.features || [],
        }))
        setFeaturedVehicles(transformed)
      }
    } catch (error) {
      console.error('Error fetching featured vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || featuredVehicles.length === 0) {
    return null // Don't show section if loading or no vehicles
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Choose the car that suits you
          </h2>
          <Link
            href="/pages/vehicles"
            className="flex items-center space-x-2 text-primary hover:text-primary-dark font-semibold"
          >
            <span>View All</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Cars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredVehicles.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  )
}
