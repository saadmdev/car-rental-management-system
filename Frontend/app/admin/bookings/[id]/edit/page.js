'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api/client'
import FormInput from '@/components/admin/ui/FormInput'
import FormSelect from '@/components/admin/ui/FormSelect'
import toast from 'react-hot-toast'
import { Calendar, Save, X } from 'lucide-react'
import Link from 'next/link'

export default function EditBookingPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = params.id
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [drivers, setDrivers] = useState([])
  const [formData, setFormData] = useState({
    status: 'pending',
    driver: '',
    driverRequired: false,
    pickupDate: '',
    pickupTime: '',
    pickupLocation: '',
    returnDate: '',
    returnTime: '',
    returnLocation: '',
    startMileage: '',
    endMileage: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchBooking()
    fetchActiveDrivers()
  }, [bookingId])

  const fetchActiveDrivers = async () => {
    try {
      const response = await api.getActiveDrivers()
      if (response.success) {
        setDrivers(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching drivers:', error)
    }
  }

  const fetchBooking = async () => {
    try {
      setFetching(true)
      const response = await api.getBookingById(bookingId)
      if (response.success && response.data) {
        const booking = response.data
        const formatDateForInput = (date) => {
          if (!date) return ''
          const d = new Date(date)
          return d.toISOString().split('T')[0]
        }
        
        setFormData({
          status: booking.status || 'pending',
          driver: booking.driver?._id || booking.driver || '',
          driverRequired: booking.driverRequired || false,
          pickupDate: formatDateForInput(booking.pickupDate),
          pickupTime: booking.pickupTime || '',
          pickupLocation: booking.pickupLocation || '',
          returnDate: formatDateForInput(booking.returnDate),
          returnTime: booking.returnTime || '',
          returnLocation: booking.returnLocation || '',
          startMileage: booking.startMileage?.toString() || '',
          endMileage: booking.endMileage?.toString() || '',
        })
      } else {
        toast.error('Booking not found')
        router.push('/admin/bookings')
      }
    } catch (error) {
      console.error('Error fetching booking:', error)
      toast.error('Failed to load booking data')
      router.push('/admin/bookings')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const updateData = {
        ...formData,
        driver: formData.driver || null,
        startMileage: formData.startMileage ? parseFloat(formData.startMileage) : undefined,
        endMileage: formData.endMileage ? parseFloat(formData.endMileage) : undefined,
      }

      const response = await api.updateBooking(bookingId, updateData)

      if (response.success) {
        toast.success('Booking updated successfully!')
        router.push('/admin/bookings')
      } else {
        toast.error(response.message || 'Failed to update booking')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update booking')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true)
      const response = await api.updateBookingStatus(bookingId, newStatus)
      if (response.success) {
        toast.success(`Booking status updated to ${newStatus}`)
        fetchBooking() // Refresh booking data
      } else {
        toast.error(response.message || 'Failed to update status')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Booking</h1>
          <p className="text-gray-600 mt-1">Update booking information</p>
        </div>
        <Link
          href="/admin/bookings"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
          <span>Cancel</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Status Management */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Calendar className="w-6 h-6" />
            <span>Booking Status</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => handleStatusChange('completed')}
                disabled={loading || formData.status === 'completed'}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Completed
              </button>
            </div>
          </div>
        </div>

        {/* Driver Assignment */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Driver Assignment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="driverRequired"
                name="driverRequired"
                checked={formData.driverRequired}
                onChange={handleChange}
                className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label htmlFor="driverRequired" className="ml-2 text-sm text-gray-700">
                Driver Required
              </label>
            </div>
            {formData.driverRequired && (
              <FormSelect
                label="Select Driver"
                name="driver"
                value={formData.driver}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select a driver...' },
                  ...drivers.map(driver => ({
                    value: driver._id,
                    label: `${driver.firstName} ${driver.lastName}${driver.employeeId ? ` (${driver.employeeId})` : ''}`
                  }))
                ]}
              />
            )}
          </div>
        </div>

        {/* Rental Period */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Rental Period</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Pickup Date"
              name="pickupDate"
              type="date"
              value={formData.pickupDate}
              onChange={handleChange}
              error={errors.pickupDate}
            />
            <FormInput
              label="Pickup Time"
              name="pickupTime"
              type="time"
              value={formData.pickupTime}
              onChange={handleChange}
              error={errors.pickupTime}
            />
            <FormInput
              label="Pickup Location"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              error={errors.pickupLocation}
              className="md:col-span-2"
            />
            <FormInput
              label="Return Date"
              name="returnDate"
              type="date"
              value={formData.returnDate}
              onChange={handleChange}
              error={errors.returnDate}
            />
            <FormInput
              label="Return Time"
              name="returnTime"
              type="time"
              value={formData.returnTime}
              onChange={handleChange}
              error={errors.returnTime}
            />
            <FormInput
              label="Return Location"
              name="returnLocation"
              value={formData.returnLocation}
              onChange={handleChange}
              error={errors.returnLocation}
              className="md:col-span-2"
            />
          </div>
        </div>

        {/* Mileage Tracking */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mileage Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Start Mileage"
              name="startMileage"
              type="number"
              min="0"
              value={formData.startMileage}
              onChange={handleChange}
            />
            <FormInput
              label="End Mileage"
              name="endMileage"
              type="number"
              min="0"
              value={formData.endMileage}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          <Link
            href="/admin/bookings"
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
            <span>{loading ? 'Updating...' : 'Update Booking'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

