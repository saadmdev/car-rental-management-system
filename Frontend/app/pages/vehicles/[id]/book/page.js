'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { api } from '@/lib/api/client'
import toast from 'react-hot-toast'
import { ArrowLeft, Calendar, MapPin, User, Phone, Mail, CheckCircle } from 'lucide-react'

export default function BookVehiclePage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.id
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Customer Information
    customerFirstName: '',
    customerLastName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    // Booking Details
    pickupDate: '',
    pickupTime: '',
    pickupLocation: '',
    returnDate: '',
    returnTime: '',
    returnLocation: '',
    driverRequired: false,
    specialInstructions: '',
  })
  const [errors, setErrors] = useState({})
  const [pricing, setPricing] = useState(null)

  useEffect(() => {
    fetchVehicle()
  }, [vehicleId])

  useEffect(() => {
    if (formData.pickupDate && formData.returnDate && vehicle) {
      calculatePricing()
    }
  }, [formData.pickupDate, formData.returnDate, vehicle])

  const fetchVehicle = async () => {
    try {
      setLoading(true)
      const response = await api.getVehicleById(vehicleId)
      if (response.success) {
        const v = response.data
        if (v.status !== 'available') {
          toast.error('This vehicle is not available for booking')
          router.push(`/pages/vehicles/${vehicleId}`)
          return
        }
        setVehicle(v)
      }
    } catch (err) {
      console.error('Error fetching vehicle:', err)
      toast.error('Failed to load vehicle details')
      router.push(`/pages/vehicles/${vehicleId}`)
    } finally {
      setLoading(false)
    }
  }

  const calculatePricing = async () => {
    if (!formData.pickupDate || !formData.returnDate || !vehicle) return

    try {
      const startDate = new Date(formData.pickupDate)
      const endDate = new Date(formData.returnDate)
      
      if (endDate <= startDate) {
        setPricing(null)
        return
      }

      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      const baseAmount = vehicle.dailyRate * days
      const taxRate = 10 // 10% tax (can be configured)
      const taxAmount = baseAmount * (taxRate / 100)
      const totalAmount = baseAmount + taxAmount

      setPricing({
        days,
        baseAmount,
        taxRate,
        taxAmount,
        totalAmount,
      })
    } catch (err) {
      console.error('Error calculating pricing:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      })
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.customerFirstName.trim()) {
      newErrors.customerFirstName = 'First name is required'
    }
    if (!formData.customerLastName.trim()) {
      newErrors.customerLastName = 'Last name is required'
    }
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email'
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required'
    }
    if (!formData.pickupDate) {
      newErrors.pickupDate = 'Pickup date is required'
    }
    if (!formData.returnDate) {
      newErrors.returnDate = 'Return date is required'
    }
    if (formData.pickupDate && formData.returnDate) {
      const pickup = new Date(formData.pickupDate)
      const returnDate = new Date(formData.returnDate)
      if (returnDate <= pickup) {
        newErrors.returnDate = 'Return date must be after pickup date'
      }
    }
    if (!formData.pickupTime.trim()) {
      newErrors.pickupTime = 'Pickup time is required'
    }
    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!vehicle || vehicle.status !== 'available') {
      toast.error('Vehicle is no longer available')
      return
    }

    try {
      setSubmitting(true)
      const response = await api.createPublicBooking({
        vehicle: vehicleId,
        customerFirstName: formData.customerFirstName,
        customerLastName: formData.customerLastName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        pickupLocation: formData.pickupLocation,
        returnDate: formData.returnDate,
        returnTime: formData.returnTime || formData.pickupTime,
        returnLocation: formData.returnLocation || formData.pickupLocation,
        driverRequired: formData.driverRequired,
        specialInstructions: formData.specialInstructions,
      })

      if (response.success) {
        toast.success('Booking request submitted successfully! We will contact you shortly.')
        router.push(`/pages/vehicles/${vehicleId}?booking=success`)
      } else {
        toast.error(response.message || 'Failed to submit booking request')
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      toast.error(error.message || 'Failed to submit booking request')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <p className="text-red-600 text-lg">Vehicle not found</p>
            <Link href="/pages/vehicles" className="text-primary hover:underline mt-4 inline-block">
              Browse Vehicles
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const minDate = new Date().toISOString().split('T')[0]

  return (
    <main className="min-h-screen bg-gray-50">
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
            <Link href={`/pages/vehicles/${vehicleId}`} className="hover:text-primary">
              {vehicle.make} {vehicle.model}
            </Link>
            <span>/</span>
            <span className="text-gray-900">Book Now</span>
          </div>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <Link
            href={`/pages/vehicles/${vehicleId}`}
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Vehicle Details</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Book {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-gray-600 mt-2">Complete the form below to submit your booking request</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              {/* Customer Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <User className="w-6 h-6" />
                  <span>Your Information</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerFirstName"
                      value={formData.customerFirstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.customerFirstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John"
                    />
                    {errors.customerFirstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerFirstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerLastName"
                      value={formData.customerLastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.customerLastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.customerLastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerLastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.customerEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+1 234 567 8900"
                    />
                    {errors.customerPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Dates */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Calendar className="w-6 h-6" />
                  <span>Rental Period</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleChange}
                      min={minDate}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.pickupDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.pickupDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.pickupDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.pickupTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.pickupTime && (
                      <p className="text-red-500 text-xs mt-1">{errors.pickupTime}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Return Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleChange}
                      min={formData.pickupDate || minDate}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.returnDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.returnDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.returnDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Return Time
                    </label>
                    <input
                      type="time"
                      name="returnTime"
                      value={formData.returnTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <MapPin className="w-6 h-6" />
                  <span>Location</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.pickupLocation ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter pickup address"
                    />
                    {errors.pickupLocation && (
                      <p className="text-red-500 text-xs mt-1">{errors.pickupLocation}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Return Location
                    </label>
                    <input
                      type="text"
                      name="returnLocation"
                      value={formData.returnLocation}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Same as pickup (if different)"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Options */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="driverRequired"
                    checked={formData.driverRequired}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-gray-700">I need a driver</span>
                </label>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Any special requests or instructions..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white py-4 rounded-lg hover:bg-primary-dark transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </form>
          </div>

          {/* Pricing Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Vehicle</p>
                  <p className="font-semibold text-gray-900">
                    {vehicle.make} {vehicle.model}
                  </p>
                  <p className="text-sm text-gray-600">{vehicle.year}</p>
                </div>
                
                {formData.pickupDate && formData.returnDate && pricing && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Daily Rate</span>
                      <span className="font-semibold">${vehicle.dailyRate?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Days</span>
                      <span className="font-semibold">{pricing.days}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${pricing.baseAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Tax ({pricing.taxRate}%)</span>
                      <span className="font-semibold">${pricing.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-primary text-lg">
                          ${pricing.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {(!formData.pickupDate || !formData.returnDate) && (
                  <p className="text-sm text-gray-500 italic">
                    Select pickup and return dates to see pricing
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This is a booking request. We will contact you shortly to confirm your booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

