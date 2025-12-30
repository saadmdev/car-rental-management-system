'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api/client'
import FormInput from '@/components/admin/ui/FormInput'
import FormSelect from '@/components/admin/ui/FormSelect'
import { validateForm } from '@/lib/utils/validation'
import toast from 'react-hot-toast'
import { Users, Save, X, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function EditDriverPage() {
  const router = useRouter()
  const params = useParams()
  const driverId = params.id
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  
  // Calculate max date for date of birth (must be at least 18 years old)
  const maxDateOfBirth = (() => {
    const today = new Date()
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    return maxDate.toISOString().split('T')[0]
  })()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    licenseExpiry: '',
    licenseIssuedBy: '',
    status: 'active',
    allowances: {
      overtime: { enabled: true, hoursThreshold: 12, ratePerHour: 0 },
      food: { enabled: true, dailyRate: 0 },
      outstation: { enabled: true, dailyRate: 0 },
      parking: { enabled: true, dailyRate: 0 },
    },
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchDriver()
  }, [driverId])

  const fetchDriver = async () => {
    try {
      setFetching(true)
      const response = await api.getDriverById(driverId)
      if (response.success && response.data) {
        const driver = response.data
        // Format dates for input fields
        const formatDateForInput = (date) => {
          if (!date) return ''
          const d = new Date(date)
          return d.toISOString().split('T')[0]
        }
        
        setFormData({
          firstName: driver.firstName || '',
          lastName: driver.lastName || '',
          dateOfBirth: formatDateForInput(driver.dateOfBirth),
          email: driver.email || '',
          phone: driver.phone || '',
          address: driver.address?.street || '',
          licenseNumber: driver.licenseNumber || '',
          licenseExpiry: formatDateForInput(driver.licenseExpiry),
          licenseIssuedBy: driver.licenseIssuedBy || '',
          status: driver.status || 'active',
          allowances: driver.allowances || {
            overtime: { enabled: true, hoursThreshold: 12, ratePerHour: 0 },
            food: { enabled: true, dailyRate: 0 },
            outstation: { enabled: true, dailyRate: 0 },
            parking: { enabled: true, dailyRate: 0 },
          },
        })
      } else {
        toast.error('Driver not found')
        router.push('/admin/drivers')
      }
    } catch (error) {
      console.error('Error fetching driver:', error)
      toast.error('Failed to load driver data')
      router.push('/admin/drivers')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('allowances.')) {
      const parts = name.split('.')
      const [_, allowance, field] = parts
      setFormData({
        ...formData,
        allowances: {
          ...formData.allowances,
          [allowance]: {
            ...formData.allowances[allowance],
            [field]: field === 'enabled' ? checked : (type === 'number' ? parseFloat(value) || 0 : value),
          },
        },
      })
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationRules = {
      firstName: { required: true },
      lastName: { required: true },
      dateOfBirth: { required: true },
      email: { required: true, email: true },
      phone: { required: true, phone: true },
      licenseNumber: { required: true },
      licenseExpiry: { required: true },
      licenseIssuedBy: { required: true },
    }
    
    const validationErrors = validateForm(formData, validationRules)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors in the form')
      return
    }

    try {
      setLoading(true)
      const response = await api.updateDriver(driverId, formData)

      if (response.success) {
        toast.success('Driver updated successfully!')
        router.push('/admin/drivers')
      } else {
        toast.error(response.message || 'Failed to update driver')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update driver')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading driver data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Driver</h1>
          <p className="text-gray-600 mt-1">Update driver information</p>
        </div>
        <Link
          href="/admin/drivers"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
          <span>Cancel</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Users className="w-6 h-6" />
            <span>Personal Information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
            />
            <FormInput
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
            />
            <FormInput
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
              required
              max={maxDateOfBirth}
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <FormInput
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
            />
            <FormInput
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">License Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="License Number"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              error={errors.licenseNumber}
              required
            />
            <FormInput
              label="License Expiry"
              name="licenseExpiry"
              type="date"
              value={formData.licenseExpiry}
              onChange={handleChange}
              error={errors.licenseExpiry}
              required
            />
            <FormInput
              label="License Issued By"
              name="licenseIssuedBy"
              value={formData.licenseIssuedBy}
              onChange={handleChange}
              error={errors.licenseIssuedBy}
              required
              placeholder="e.g., Traffic Police, DMV, RTO"
            />
            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'on_leave', label: 'On Leave' },
                { value: 'terminated', label: 'Terminated' },
              ]}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Driver Allowances Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overtime Allowance */}
            <div className="md:col-span-2 border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Overtime Allowance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowances.overtime.enabled"
                    name="allowances.overtime.enabled"
                    checked={formData.allowances?.overtime?.enabled || false}
                    onChange={(e) => handleChange({ target: { name: 'allowances.overtime.enabled', value: e.target.checked ? 'true' : 'false' } })}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <label htmlFor="allowances.overtime.enabled" className="ml-2 text-sm text-gray-700">
                    Overtime Enabled
                  </label>
                </div>
                <FormInput
                  label="Threshold Hours"
                  name="allowances.overtime.hoursThreshold"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.allowances?.overtime?.hoursThreshold || 12}
                  onChange={handleChange}
                />
                <FormInput
                  label="Rate Per Hour"
                  name="allowances.overtime.ratePerHour"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.allowances?.overtime?.ratePerHour || 0}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Food Allowance */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Food Allowance</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowances.food.enabled"
                    name="allowances.food.enabled"
                    checked={formData.allowances?.food?.enabled || false}
                    onChange={(e) => handleChange({ target: { name: 'allowances.food.enabled', value: e.target.checked ? 'true' : 'false' } })}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <label htmlFor="allowances.food.enabled" className="ml-2 text-sm text-gray-700">
                    Food Allowance Enabled
                  </label>
                </div>
                <FormInput
                  label="Daily Rate"
                  name="allowances.food.dailyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.allowances?.food?.dailyRate || 0}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Outstation Allowance */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Outstation Allowance</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowances.outstation.enabled"
                    name="allowances.outstation.enabled"
                    checked={formData.allowances?.outstation?.enabled || false}
                    onChange={(e) => handleChange({ target: { name: 'allowances.outstation.enabled', value: e.target.checked ? 'true' : 'false' } })}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <label htmlFor="allowances.outstation.enabled" className="ml-2 text-sm text-gray-700">
                    Outstation Allowance Enabled
                  </label>
                </div>
                <FormInput
                  label="Daily Rate"
                  name="allowances.outstation.dailyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.allowances?.outstation?.dailyRate || 0}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Parking Allowance */}
            <div className="md:col-span-2 border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Parking Allowance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowances.parking.enabled"
                    name="allowances.parking.enabled"
                    checked={formData.allowances?.parking?.enabled || false}
                    onChange={(e) => handleChange({ target: { name: 'allowances.parking.enabled', value: e.target.checked ? 'true' : 'false' } })}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <label htmlFor="allowances.parking.enabled" className="ml-2 text-sm text-gray-700">
                    Parking Allowance Enabled
                  </label>
                </div>
                <FormInput
                  label="Daily Rate"
                  name="allowances.parking.dailyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.allowances?.parking?.dailyRate || 0}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          <Link
            href="/admin/drivers"
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
            <span>{loading ? 'Updating...' : 'Update Driver'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

