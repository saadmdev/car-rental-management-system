'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api/client'
import FormInput from '@/components/admin/ui/FormInput'
import FormSelect from '@/components/admin/ui/FormSelect'
import { validateForm } from '@/lib/utils/validation'
import toast from 'react-hot-toast'
import { User, Save, X } from 'lucide-react'
import Link from 'next/link'

export default function NewCustomerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerType: 'individual',
    firstName: '',
    lastName: '',
    companyName: '',
    contactPerson: '',
    taxId: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    licenseNumber: '',
    licenseExpiry: '',
    licenseIssuedBy: '',
    dateOfBirth: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [field]: value,
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
      email: { required: true, email: true },
      phone: { required: true, phone: true },
    }
    
    if (formData.customerType === 'individual') {
      validationRules.firstName = { required: true }
      validationRules.lastName = { required: true }
      validationRules.licenseNumber = { required: true }
    } else {
      validationRules.companyName = { required: true }
    }
    
    const validationErrors = validateForm(formData, validationRules)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors in the form')
      return
    }

    try {
      setLoading(true)
      const response = await api.createCustomer(formData)

      if (response.success) {
        toast.success('Customer created successfully!')
        router.push('/admin/customers')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create customer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Customer</h1>
          <p className="text-gray-600 mt-1">Enter customer information</p>
        </div>
        <Link
          href="/admin/customers"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
          <span>Cancel</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <User className="w-6 h-6" />
            <span>Customer Information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Customer Type"
              name="customerType"
              value={formData.customerType}
              onChange={handleChange}
              options={[
                { value: 'individual', label: 'Individual' },
                { value: 'company', label: 'Company' },
              ]}
            />
            {formData.customerType === 'individual' ? (
              <>
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
                  label="License Number"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  error={errors.licenseNumber}
                />
                <FormInput
                  label="License Expiry"
                  name="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                />
                <FormInput
                  label="License Issued By"
                  name="licenseIssuedBy"
                  value={formData.licenseIssuedBy}
                  onChange={handleChange}
                />
                <FormInput
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                />
              </>
            ) : (
              <>
                <FormInput
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  error={errors.companyName}
                  required
                  className="md:col-span-2"
                />
                <FormInput
                  label="Contact Person"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                />
                <FormInput
                  label="Tax ID"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                />
              </>
            )}
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
              label="Alternate Phone"
              name="alternatePhone"
              type="tel"
              value={formData.alternatePhone}
              onChange={handleChange}
            />
            <FormInput
              label="Street Address"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className="md:col-span-2"
            />
            <FormInput
              label="City"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
            />
            <FormInput
              label="State"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
            />
            <FormInput
              label="Zip Code"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
            />
            <FormInput
              label="Country"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
            />
            <FormInput
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              type="textarea"
              className="md:col-span-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          <Link
            href="/admin/customers"
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
            <span>{loading ? 'Creating...' : 'Create Customer'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

