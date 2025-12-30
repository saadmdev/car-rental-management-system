'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api/client'
import FormInput from '@/components/admin/ui/FormInput'
import FormSelect from '@/components/admin/ui/FormSelect'
import FormTextarea from '@/components/admin/ui/FormTextarea'
import ImageUrlInput from '@/components/admin/ui/ImageUrlInput'
import FeatureCheckboxes from '@/components/admin/ui/FeatureCheckboxes'
import { validateForm } from '@/lib/utils/validation'
import toast from 'react-hot-toast'
import { Car, Save, X, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function EditVehiclePage() {
  const router = useRouter()
  const params = useParams()
  const vehicleId = params.id
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    registrationNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vehicleType: '',
    fuelType: '',
    transmission: '',
    color: '',
    seatingCapacity: '',
    dailyRate: '',
    weeklyRate: '',
    monthlyRate: '',
    kmLimit: '',
    extraKmRate: '',
    status: 'available',
    ownershipType: 'own',
    description: '',
    images: [],
    features: [],
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchVehicle()
  }, [vehicleId])

  const fetchVehicle = async () => {
    try {
      setFetching(true)
      // Use admin endpoint for editing (not public endpoint)
      const response = await api.getVehicleByIdAdmin(vehicleId)
      if (response.success && response.data) {
        const vehicle = response.data
        setFormData({
          registrationNumber: vehicle.registrationNumber || '',
          make: vehicle.make || '',
          model: vehicle.model || '',
          year: vehicle.year || new Date().getFullYear(),
          vehicleType: vehicle.vehicleType || '',
          fuelType: vehicle.fuelType || '',
          transmission: vehicle.transmission || '',
          color: vehicle.color || '',
          seatingCapacity: vehicle.seatingCapacity || '',
          dailyRate: vehicle.dailyRate || '',
          weeklyRate: vehicle.weeklyRate || '',
          monthlyRate: vehicle.monthlyRate || '',
          kmLimit: vehicle.kmLimit || '',
          extraKmRate: vehicle.extraKmRate || '',
          status: vehicle.status || 'available',
          ownershipType: vehicle.ownershipType || 'own',
          description: vehicle.notes || '',
          images: vehicle.images || [],
          features: vehicle.features || [],
        })
      } else {
        toast.error('Vehicle not found')
        router.push('/admin/vehicles')
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error)
      toast.error('Failed to load vehicle data')
      router.push('/admin/vehicles')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleArrayChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationRules = {
      registrationNumber: { required: true, minLength: 3 },
      make: { required: true },
      model: { required: true },
      year: { required: true, number: true, min: 1900, max: new Date().getFullYear() + 1 },
      vehicleType: { required: true },
      fuelType: { required: true },
      transmission: { required: true },
      dailyRate: { required: true, number: true, min: 0 },
    }
    
    const validationErrors = validateForm(formData, validationRules)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors in the form')
      return
    }

    try {
      setLoading(true)
      const response = await api.updateVehicle(vehicleId, {
        ...formData,
        year: parseInt(formData.year),
        seatingCapacity: parseInt(formData.seatingCapacity) || 0,
        dailyRate: parseFloat(formData.dailyRate),
        weeklyRate: parseFloat(formData.weeklyRate) || 0,
        monthlyRate: parseFloat(formData.monthlyRate) || 0,
        kmLimit: parseFloat(formData.kmLimit) || 0,
        extraKmRate: parseFloat(formData.extraKmRate) || 0,
        images: formData.images || [],
        features: formData.features || [],
        notes: formData.description || '',
      })

      if (response.success) {
        toast.success('Vehicle updated successfully!')
        router.push('/admin/vehicles')
      } else {
        toast.error(response.message || 'Failed to update vehicle')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update vehicle')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicle data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Vehicle</h1>
          <p className="text-gray-600 mt-1">Update vehicle details</p>
        </div>
        <Link
          href="/admin/vehicles"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
          <span>Cancel</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Car className="w-6 h-6" />
            <span>Basic Information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Registration Number"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              error={errors.registrationNumber}
              required
              placeholder="ABC-1234"
            />
            <FormInput
              label="Make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              error={errors.make}
              required
              placeholder="Toyota"
            />
            <FormInput
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              error={errors.model}
              required
              placeholder="Camry"
            />
            <FormInput
              label="Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              error={errors.year}
              required
            />
            <FormSelect
              label="Vehicle Type"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              error={errors.vehicleType}
              required
              options={[
                { value: 'sedan', label: 'Sedan' },
                { value: 'suv', label: 'SUV' },
                { value: 'hatchback', label: 'Hatchback' },
                { value: 'coupe', label: 'Coupe' },
                { value: 'convertible', label: 'Convertible' },
                { value: 'van', label: 'Van' },
                { value: 'truck', label: 'Truck' },
              ]}
            />
            <FormSelect
              label="Fuel Type"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              error={errors.fuelType}
              required
              options={[
                { value: 'petrol', label: 'Petrol' },
                { value: 'diesel', label: 'Diesel' },
                { value: 'electric', label: 'Electric' },
                { value: 'hybrid', label: 'Hybrid' },
              ]}
            />
            <FormSelect
              label="Transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              error={errors.transmission}
              required
              options={[
                { value: 'manual', label: 'Manual' },
                { value: 'automatic', label: 'Automatic' },
              ]}
            />
            <FormInput
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="White"
            />
            <FormInput
              label="Seating Capacity"
              name="seatingCapacity"
              type="number"
              value={formData.seatingCapacity}
              onChange={handleChange}
              placeholder="5"
            />
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Daily Rate ($)"
              name="dailyRate"
              type="number"
              step="0.01"
              value={formData.dailyRate}
              onChange={handleChange}
              error={errors.dailyRate}
              required
            />
            <FormInput
              label="Weekly Rate ($)"
              name="weeklyRate"
              type="number"
              step="0.01"
              value={formData.weeklyRate}
              onChange={handleChange}
            />
            <FormInput
              label="Monthly Rate ($)"
              name="monthlyRate"
              type="number"
              step="0.01"
              value={formData.monthlyRate}
              onChange={handleChange}
            />
            <FormInput
              label="KM Limit per Day"
              name="kmLimit"
              type="number"
              value={formData.kmLimit}
              onChange={handleChange}
            />
            <FormInput
              label="Extra KM Rate ($)"
              name="extraKmRate"
              type="number"
              step="0.01"
              value={formData.extraKmRate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Images</h2>
          <div className="grid grid-cols-1 gap-6">
            <ImageUrlInput
              label="Image URLs"
              value={formData.images}
              onChange={handleArrayChange}
              error={errors.images}
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Features & Equipment</h2>
          <div className="grid grid-cols-1 gap-6">
            <FeatureCheckboxes
              label="Select Features"
              value={formData.features}
              onChange={handleArrayChange}
              error={errors.features}
            />
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'available', label: 'Available' },
                { value: 'booked', label: 'Booked' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'out_of_service', label: 'Out of Service' },
              ]}
            />
            <FormSelect
              label="Ownership Type"
              name="ownershipType"
              value={formData.ownershipType}
              onChange={handleChange}
              options={[
                { value: 'own', label: 'Own' },
                { value: 'vendor', label: 'Vendor' },
                { value: 'outsourced', label: 'Outsourced' },
              ]}
            />
            <FormTextarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Additional details about the vehicle..."
              className="md:col-span-2"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          <Link
            href="/admin/vehicles"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Updating...' : 'Update Vehicle'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

