'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api/client'
import FormInput from '@/components/admin/ui/FormInput'
import FormSelect from '@/components/admin/ui/FormSelect'
import { validateForm } from '@/lib/utils/validation'
import toast from 'react-hot-toast'
import { User, Save, X, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function EditCustomerPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
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
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchCustomer()
  }, [customerId])

  const fetchCustomer = async () => {
    try {
      setFetching(true)
      const response = await api.getCustomerById(customerId)
      if (response.success && response.data) {
        const customer = response.data
        const formatDateForInput = (date) => {
          if (!date) return ''
          const d = new Date(date)
          return d.toISOString().split('T')[0]
        }
        
        setFormData({
          customerType: customer.customerType || 'individual',
          firstName: customer.firstName || '',
          lastName: customer.lastName || '',
          companyName: customer.companyName || '',
          contactPerson: customer.contactPerson || '',
          taxId: customer.taxId || '',
          email: customer.email || '',
          phone: customer.phone || '',
          alternatePhone: customer.alternatePhone || '',
          address: customer.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
          },
          licenseNumber: customer.licenseNumber || '',
          licenseExpiry: formatDateForInput(customer.licenseExpiry),
        })
      } else {
        toast.error('Customer not found')
        router.push('/admin/customers')
      }
    } catch (error) {
      console.error('Error fetching customer:', error)
      toast.error('Failed to load customer data')
      router.push('/admin/customers')
    } finally {
      setFetching(false)
    }
  }

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
      const response = await api.updateCustomer(customerId, formData)

      if (response.success) {
        toast.success('Customer updated successfully!')
        router.push('/admin/customers')
      } else {
        toast.error(response.message || 'Failed to update customer')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update customer')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customer data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
          <p className="text-gray-600 mt-1">Update customer information</p>
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
                />
                <FormInput
                  label="License Expiry"
                  name="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={handleChange}
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
            <span>{loading ? 'Updating...' : 'Update Customer'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

