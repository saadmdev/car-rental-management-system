'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api/client'
import FormInput from '@/components/admin/ui/FormInput'
import FormSelect from '@/components/admin/ui/FormSelect'
import FormTextarea from '@/components/admin/ui/FormTextarea'
import { validateForm } from '@/lib/utils/validation'
import toast from 'react-hot-toast'
import { Receipt, Save, X } from 'lucide-react'
import Link from 'next/link'

export default function NewExpensePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [vehicles, setVehicles] = useState([])
  const [formData, setFormData] = useState({
    expenseDate: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    amount: '',
    taxRate: '',
    vehicle: '',
    paymentStatus: 'pending',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await api.getVehicles({ limit: 100 })
      if (response.success) {
        setVehicles(response.data)
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationRules = {
      expenseDate: { required: true },
      category: { required: true },
      description: { required: true },
      amount: { required: true, number: true, min: 0 },
    }
    
    const validationErrors = validateForm(formData, validationRules)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors in the form')
      return
    }

    try {
      setLoading(true)
      const amount = parseFloat(formData.amount)
      const taxRate = parseFloat(formData.taxRate) || 0
      const taxAmount = (amount * taxRate) / 100
      const totalAmount = amount + taxAmount

      const response = await api.createExpense({
        ...formData,
        amount,
        taxRate,
        taxAmount,
        totalAmount,
        vehicle: formData.vehicle || undefined,
      })

      if (response.success) {
        toast.success('Expense created successfully!')
        router.push('/admin/expenses')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Expense</h1>
          <p className="text-gray-600 mt-1">Record operational expense</p>
        </div>
        <Link
          href="/admin/expenses"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
          <span>Cancel</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Receipt className="w-6 h-6" />
            <span>Expense Details</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Expense Date"
              name="expenseDate"
              type="date"
              value={formData.expenseDate}
              onChange={handleChange}
              error={errors.expenseDate}
              required
            />
            <FormSelect
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
              required
              options={[
                { value: 'fuel', label: 'Fuel' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'repair', label: 'Repair' },
                { value: 'insurance', label: 'Insurance' },
                { value: 'parking', label: 'Parking' },
                { value: 'toll', label: 'Toll' },
                { value: 'driver_allowance', label: 'Driver Allowance' },
                { value: 'office_expense', label: 'Office Expense' },
                { value: 'other', label: 'Other' },
              ]}
            />
            <FormTextarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              required
              rows={3}
            />
            <FormInput
              label="Amount ($)"
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              error={errors.amount}
              required
            />
            <FormInput
              label="Tax Rate (%)"
              name="taxRate"
              type="number"
              step="0.01"
              value={formData.taxRate}
              onChange={handleChange}
            />
            <FormSelect
              label="Vehicle (Optional)"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              options={[
                { value: '', label: 'None' },
                ...vehicles.map((v) => ({
                  value: v._id,
                  label: `${v.make} ${v.model} (${v.registrationNumber})`,
                })),
              ]}
            />
            <FormSelect
              label="Payment Status"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'paid', label: 'Paid' },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          <Link
            href="/admin/expenses"
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
            <span>{loading ? 'Creating...' : 'Create Expense'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

