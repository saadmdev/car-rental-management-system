'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api/client'
import toast from 'react-hot-toast'
import { Car, ArrowLeft, Edit, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function ViewVehiclePage() {
  const router = useRouter()
  const params = useParams()
  const vehicleId = params.id
  const [loading, setLoading] = useState(true)
  const [vehicle, setVehicle] = useState(null)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')

  useEffect(() => {
    fetchVehicle()
  }, [vehicleId])

  const fetchVehicle = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getVehicleByIdAdmin(vehicleId)
      if (response.success && response.data) {
        setVehicle(response.data)
        // Set first image as selected
        if (response.data.images && response.data.images.length > 0) {
          const firstImage = typeof response.data.images[0] === 'string'
            ? response.data.images[0]
            : response.data.images[0]?.url || ''
          setSelectedImage(firstImage)
        }
      } else {
        setError('Vehicle not found')
        toast.error('Vehicle not found')
      }
    } catch (err) {
      console.error('Error fetching vehicle:', err)
      setError(err.message || 'Failed to load vehicle')
      toast.error(err.message || 'Failed to load vehicle')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { label: 'Available', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      booked: { label: 'Booked', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      maintenance: { label: 'Maintenance', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      out_of_service: { label: 'Out of Service', color: 'bg-red-100 text-red-800', icon: XCircle },
      sold: { label: 'Sold', color: 'bg-gray-100 text-gray-800', icon: XCircle },
    }
    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        <Icon className="w-4 h-4" />
        <span>{config.label}</span>
      </span>
    )
  }

  const getOwnershipBadge = (type) => {
    const types = {
      own: { label: 'Own Fleet', color: 'bg-blue-100 text-blue-800' },
      vendor: { label: 'Vendor', color: 'bg-purple-100 text-purple-800' },
      outsourced: { label: 'Outsourced', color: 'bg-orange-100 text-orange-800' },
    }
    const config = types[type] || { label: type, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        {config.label}
      </span>
    )
  }

  // Extract image URLs (backend stores as array of strings)
  const imageUrls = vehicle?.images && Array.isArray(vehicle.images)
    ? vehicle.images.filter(url => url && typeof url === 'string')
    : []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Details</h1>
            <p className="text-gray-600 mt-1">View vehicle information</p>
          </div>
          <Link
            href="/admin/vehicles"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Vehicles</span>
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-800 font-semibold">{error || 'Vehicle not found'}</p>
          <Link
            href="/admin/vehicles"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Return to Vehicles List
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Details</h1>
          <p className="text-gray-600 mt-1">View vehicle information</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/vehicles"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <Link
            href={`/admin/vehicles/${vehicleId}/edit`}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Edit className="w-5 h-5" />
            <span>Edit</span>
          </Link>
        </div>
      </div>

      {/* Vehicle Information Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Car className="w-6 h-6" />
            <span>Basic Information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Registration Number</label>
              <p className="text-lg font-semibold text-gray-900">{vehicle.registrationNumber || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Make</label>
              <p className="text-lg font-semibold text-gray-900">{vehicle.make || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Model</label>
              <p className="text-lg font-semibold text-gray-900">{vehicle.model || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Year</label>
              <p className="text-lg font-semibold text-gray-900">{vehicle.year || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Vehicle Type</label>
              <p className="text-lg font-semibold text-gray-900 capitalize">{vehicle.vehicleType || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Fuel Type</label>
              <p className="text-lg font-semibold text-gray-900 capitalize">{vehicle.fuelType || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Transmission</label>
              <p className="text-lg font-semibold text-gray-900 capitalize">{vehicle.transmission || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Color</label>
              <p className="text-lg font-semibold text-gray-900">{vehicle.color || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Seating Capacity</label>
              <p className="text-lg font-semibold text-gray-900">{vehicle.seatingCapacity || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Mileage</label>
              <p className="text-lg font-semibold text-gray-900">
                {vehicle.mileage ? vehicle.mileage.toLocaleString() + ' km' : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <div className="mt-1">{getStatusBadge(vehicle.status)}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Ownership Type</label>
              <div className="mt-1">{getOwnershipBadge(vehicle.ownershipType)}</div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Daily Rate</label>
              <p className="text-lg font-semibold text-gray-900">${vehicle.dailyRate?.toFixed(2) || '0.00'}/day</p>
            </div>
            {vehicle.weeklyRate && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Weekly Rate</label>
                <p className="text-lg font-semibold text-gray-900">${vehicle.weeklyRate.toFixed(2)}/week</p>
              </div>
            )}
            {vehicle.monthlyRate && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Monthly Rate</label>
                <p className="text-lg font-semibold text-gray-900">${vehicle.monthlyRate.toFixed(2)}/month</p>
              </div>
            )}
            {vehicle.kmLimit && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">KM Limit per Day</label>
                <p className="text-lg font-semibold text-gray-900">{vehicle.kmLimit} km</p>
              </div>
            )}
            {vehicle.extraKmRate && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Extra KM Rate</label>
                <p className="text-lg font-semibold text-gray-900">${vehicle.extraKmRate.toFixed(2)}/km</p>
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Images */}
        {imageUrls.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Images</h2>
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-200 rounded-lg overflow-hidden">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-car.jpg'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {imageUrls.length > 1 && (
                <div className="flex gap-3">
                  {imageUrls.slice(0, 5).map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(url)}
                      className={`flex-1 h-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === url
                          ? 'border-primary ring-2 ring-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`${vehicle.make} ${vehicle.model} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-car.jpg'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features & Equipment */}
        {vehicle.features && vehicle.features.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Features & Equipment</h2>
            <div className="flex flex-wrap gap-2">
              {vehicle.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information */}
        {(vehicle.notes || vehicle.description) && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{vehicle.notes || vehicle.description || 'N/A'}</p>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Record Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            {vehicle.createdAt && (
              <div>
                <span className="font-medium">Created:</span>{' '}
                <span>{new Date(vehicle.createdAt).toLocaleString()}</span>
              </div>
            )}
            {vehicle.updatedAt && (
              <div>
                <span className="font-medium">Last Updated:</span>{' '}
                <span>{new Date(vehicle.updatedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

