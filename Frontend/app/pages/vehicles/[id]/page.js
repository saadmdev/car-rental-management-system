'use client'

import { useParams, notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ImageGallery from '@/components/ui/ImageGallery'
import TechnicalSpecs from '@/components/ui/TechnicalSpecs'
import CarEquipment from '@/components/ui/CarEquipment'
import OtherCars from '@/components/ui/OtherCars'
import { api } from '@/lib/api/client'

export default function VehicleDetailsPage() {
  const params = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchVehicle()
  }, [params.id])

  const fetchVehicle = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getVehicleById(params.id)
      if (response.success) {
        const v = response.data
        // Transform backend vehicle data to match component expectations
        const transformedVehicle = {
          id: v._id,
          brand: `${v.make} ${v.model}`,
          type: v.vehicleType || 'sedan',
          price: v.dailyRate || 0,
          image: v.images && v.images.length > 0 ? v.images[0] : '/placeholder-car.jpg',
          images: v.images && v.images.length > 0 
            ? v.images 
            : ['/placeholder-car.jpg'],
          features: {
            transmission: v.transmission || 'Automatic',
            fuel: v.fuelType || 'Petrol',
            airConditioner: v.features?.includes('Air Conditioner') || false,
          },
          specifications: {
            gearBox: v.transmission || 'Automatic',
            fuel: v.fuelType || 'Petrol',
            doors: 4,
            airConditioner: v.features?.includes('Air Conditioner') ? 'Yes' : 'No',
            seats: v.seatingCapacity || 5,
            distance: v.mileage ? v.mileage.toString() : '0',
          },
          equipment: v.features && v.features.length > 0 
            ? v.features 
            : ['Standard Features'],
          _id: v._id,
          make: v.make,
          model: v.model,
          registrationNumber: v.registrationNumber,
          status: v.status, // Include status for availability check
        }
        setVehicle(transformedVehicle)
      }
    } catch (err) {
      console.error('Error fetching vehicle:', err)
      setError('Vehicle not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading vehicle details...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !vehicle) {
    notFound()
  }

  const carData = vehicle

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/pages/home" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link href="/pages/vehicles" className="hover:text-primary">
              Vehicles
            </Link>
            <span>/</span>
            <span className="text-gray-900">{carData.brand}</span>
          </div>
        </nav>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-20">
          {/* Left Column - Images and Rent Button */}
          <div className="space-y-6">
            {/* Car Name and Price */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                {carData.brand}
              </h1>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl md:text-4xl font-bold text-primary">
                  ${carData.price}
                </span>
                <span className="text-gray-600">/ day</span>
              </div>
            </div>

            {/* Image Gallery */}
            <ImageGallery images={carData.images} carName={carData.brand} />

            {/* Rent Button */}
            {carData.status === 'available' ? (
              <Link
                href={`/pages/vehicles/${carData._id}/book`}
                className="block w-full bg-primary text-white py-4 rounded-lg hover:bg-primary-dark transition-colors font-semibold text-lg text-center"
              >
                Rent a car
              </Link>
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-600 py-4 rounded-lg cursor-not-allowed font-semibold text-lg"
              >
                Not Available
              </button>
            )}
          </div>

          {/* Right Column - Specifications and Equipment */}
          <div className="space-y-8">
            <TechnicalSpecs specifications={carData.specifications} />
            <CarEquipment equipment={carData.equipment} />
          </div>
        </div>
      </div>

      {/* Other Cars Section */}
      <OtherCars currentCarId={carData._id} />

      <Footer />
    </main>
  )
}

