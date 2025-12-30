'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import VehicleFilter from '@/components/ui/VehicleFilter'
import VehiclesGrid from '@/components/ui/VehiclesGrid'
import CarBrandsSection from '@/components/ui/CarBrandsSection'
import { api } from '@/lib/api/client'

export default function VehiclesPage() {
  const searchParams = useSearchParams()
  const [selectedType, setSelectedType] = useState('all')
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Read query parameters from URL
    const typeParam = searchParams.get('type')
    if (typeParam) {
      setSelectedType(typeParam)
    }
    fetchVehicles()
  }, [searchParams])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      setError(null)
      // Fetch only available vehicles for public display
      const response = await api.getAvailableVehicles()
      if (response.success) {
        // Transform backend vehicle data to match component expectations
        const transformedVehicles = response.data.map((vehicle) => ({
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
          _id: vehicle._id,
          make: vehicle.make,
          model: vehicle.model,
          registrationNumber: vehicle.registrationNumber,
        }))
        setVehicles(transformedVehicles)
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err)
      setError('Failed to load vehicles. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Filter vehicles based on selected type
  const filteredVehicles = useMemo(() => {
    if (selectedType === 'all') {
      return vehicles
    }
    return vehicles.filter(
      (vehicle) => vehicle.type.toLowerCase() === selectedType.toLowerCase()
    )
  }, [selectedType, vehicles])

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
          Select a vehicle group
        </h1>

        {/* Vehicle Filter Buttons */}
        <div className="mb-12">
          <VehicleFilter
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading vehicles...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        )}

        {/* Vehicles Grid */}
        {!loading && !error && <VehiclesGrid cars={filteredVehicles} />}
      </div>

      <CarBrandsSection />

      <Footer />
    </main>
  )
}

