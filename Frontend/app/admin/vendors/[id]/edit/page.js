'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api/client'
import FormInput from '@/components/admin/ui/FormInput'
import FormSelect from '@/components/admin/ui/FormSelect'
import { validateForm } from '@/lib/utils/validation'
import toast from 'react-hot-toast'
import { Building2, Save, X } from 'lucide-react'
import Link from 'next/link'

export default function EditVendorPage() {
  const router = useRouter()
  const params = useParams()
  const vendorId = params.id
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    taxId: '',
    paymentTerms: 'net_30',
    commissionRate: '',
    isActive: true,
    notes: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchVendor()
  }, [vendorId])

  const fetchVendor = async () => {
    try {
      setFetching(true)
      const response = await api.getVendorById(vendorId)
      if (response.success && response.data) {
        const vendor = response.data
        setFormData({
          name: vendor.name || '',
          contactPerson: vendor.contactPerson || '',
          email: vendor.email || '',
          phone: vendor.phone || '',
          address: vendor.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
          },
          taxId: vendor.taxId || '',
          paymentTerms: vendor.paymentTerms || 'net_30',
          commissionRate: vendor.commissionRate?.toString() || '',
          isActive: vendor.isActive !== undefined ? vendor.isActive : true,
          notes: vendor.notes || '',
        })
      } else {
        toast.error('Vendor not found')
        router.push('/admin/vendors')
      }
    } catch (error) {
      console.error('Error fetching vendor:', error)
      toast.error('Failed to load vendor data')
      router.push('/admin/vendors')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
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
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      })
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationRules = {
      name: { required: true },
      email: { required: true, email: true },
      phone: { required: true, phone: true },
    }
    
    const validationErrors = validateForm(formData, validationRules)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors in the form')
      return
    }

    try {
      setLoading(true)
      const response = await api.updateVendor(vendorId, {
        ...formData,
        commissionRate: parseFloat(formData.commissionRate) || 0,
      })

      if (response.success) {
        toast.success('Vendor updated successfully!')
        router.push('/admin/vendors')
      } else {
        toast.error(response.message || 'Failed to update vendor')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update vendor')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vendor data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Vendor</h1>
          <p className="text-gray-600 mt-1">Update vendor information</p>
        </div>
        <Link
          href="/admin/vendors"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
          <span>Cancel</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Building2 className="w-6 h-6" />
            <span>Vendor Information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Vendor Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            <FormInput
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
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
              label="Tax ID"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
            />
            <FormSelect
              label="Payment Terms"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              options={[
                { value: 'net_15', label: 'Net 15' },
                { value: 'net_30', label: 'Net 30' },
                { value: 'net_45', label: 'Net 45' },
                { value: 'net_60', label: 'Net 60' },
                { value: 'cash', label: 'Cash' },
              ]}
            />
            <FormInput
              label="Commission Rate (%)"
              name="commissionRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.commissionRate}
              onChange={handleChange}
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
            <FormInput
              label="Notes"
              name="notes"
              type="textarea"
              value={formData.notes}
              onChange={handleChange}
              className="md:col-span-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          <Link
            href="/admin/vendors"
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
            <span>{loading ? 'Updating...' : 'Update Vendor'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

