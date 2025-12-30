'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api/client'
import FormInput from '@/components/admin/ui/FormInput'
import FormSelect from '@/components/admin/ui/FormSelect'
import { validateForm } from '@/lib/utils/validation'
import toast from 'react-hot-toast'
import { Building2, Save, X } from 'lucide-react'
import Link from 'next/link'

export default function NewVendorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    paymentTerms: 'net_30',
    commissionRate: '',
    isActive: true,
  })
  const [errors, setErrors] = useState({})

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
      const response = await api.createVendor({
        ...formData,
        commissionRate: parseFloat(formData.commissionRate) || 0,
      })

      if (response.success) {
        toast.success('Vendor created successfully!')
        router.push('/admin/vendors')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create vendor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Vendor</h1>
          <p className="text-gray-600 mt-1">Enter vendor information</p>
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
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="md:col-span-2"
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
                { value: 'due_on_receipt', label: 'Due on Receipt' },
              ]}
            />
            <FormInput
              label="Commission Rate (%)"
              name="commissionRate"
              type="number"
              step="0.01"
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
            <span>{loading ? 'Creating...' : 'Create Vendor'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

