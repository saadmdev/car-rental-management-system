'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api/client'
import FormInput from '@/components/admin/ui/FormInput'
import FormSelect from '@/components/admin/ui/FormSelect'
import { validateForm } from '@/lib/utils/validation'
import toast from 'react-hot-toast'
import { Users, Save, X } from 'lucide-react'
import Link from 'next/link'

export default function NewDriverPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
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

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('allowances.')) {
      const [allowance, field] = name.split('.').slice(1)
      setFormData({
        ...formData,
        allowances: {
          ...formData.allowances,
          [allowance]: {
            ...formData.allowances[allowance],
            [field]: field === 'enabled' ? value === 'true' : parseFloat(value) || 0,
          },
        },
      })
    } else {
      setFormData({ ...formData, [name]: value })
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
      const response = await api.createDriver(formData)

      if (response.success) {
        toast.success('Driver created successfully!')
        router.push('/admin/drivers')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create driver')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Driver</h1>
          <p className="text-gray-600 mt-1">Enter driver information</p>
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
              ]}
            />
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
            <span>{loading ? 'Creating...' : 'Create Driver'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

