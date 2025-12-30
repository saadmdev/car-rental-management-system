'use client'

import { useState, useEffect } from 'react'
import Modal from './Modal'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import { api } from '@/lib/api/client'
import toast from 'react-hot-toast'
import { DollarSign, Save, X } from 'lucide-react'

export default function RecordPaymentModal({ isOpen, onClose, booking, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    description: '',
    transactionId: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (booking && isOpen) {
      // Set max amount to remaining balance
      const remainingBalance = booking.balanceAmount || booking.totalAmount - (booking.advancePaid || 0)
      setFormData({
        amount: remainingBalance > 0 ? remainingBalance.toString() : '',
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        description: '',
        transactionId: '',
      })
      setErrors({})
    }
  }, [booking, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const amount = parseFloat(formData.amount)
    const remainingBalance = booking.balanceAmount || booking.totalAmount - (booking.advancePaid || 0)

    if (!formData.amount || amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    } else if (amount > remainingBalance) {
      newErrors.amount = `Amount cannot exceed remaining balance of $${remainingBalance.toLocaleString()}`
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required'
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Payment date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      const response = await api.createPayment({
        booking: booking._id,
        customer: booking.customer?._id || booking.customer,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        paymentDate: formData.paymentDate,
        description: formData.description || `Payment for booking ${booking.bookingNumber}`,
        transactionId: formData.transactionId || undefined,
        paymentType: 'receivable',
      })

      if (response.success) {
        toast.success('Payment recorded successfully!')
        onSuccess && onSuccess()
        onClose()
      } else {
        throw new Error(response.message || 'Failed to record payment')
      }
    } catch (error) {
      console.error('Error recording payment:', error)
      const errorMessage = error.message || 'Failed to record payment'
      toast.error(errorMessage)
      setErrors({ submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  if (!booking) return null

  const remainingBalance = booking.balanceAmount || booking.totalAmount - (booking.advancePaid || 0)
  const isFullyPaid = remainingBalance <= 0

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Booking Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Booking #</span>
            <span className="font-semibold text-gray-900">{booking.bookingNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="font-semibold text-gray-900">${booking.totalAmount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Already Paid</span>
            <span className="font-semibold text-gray-900">${(booking.advancePaid || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2">
            <span className="text-sm font-semibold text-gray-900">Remaining Balance</span>
            <span className={`font-bold ${remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ${remainingBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {isFullyPaid ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm font-semibold">
              This booking is already fully paid.
            </p>
          </div>
        ) : (
          <>
            <FormInput
              label="Amount Received"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={remainingBalance}
              value={formData.amount}
              onChange={handleChange}
              error={errors.amount}
              required
              icon={DollarSign}
            />

            <FormSelect
              label="Payment Method"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              error={errors.paymentMethod}
              required
              options={[
                { value: 'cash', label: 'Cash' },
                { value: 'credit_card', label: 'Credit Card' },
                { value: 'debit_card', label: 'Debit Card' },
                { value: 'bank_transfer', label: 'Bank Transfer' },
                { value: 'check', label: 'Check' },
                { value: 'upi', label: 'UPI' },
                { value: 'other', label: 'Other' },
              ]}
            />

            <FormInput
              label="Payment Date"
              name="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={handleChange}
              error={errors.paymentDate}
              required
            />

            <FormInput
              label="Transaction ID (Optional)"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              placeholder="Enter transaction reference number"
            />

            <FormInput
              label="Description (Optional)"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional notes about this payment"
            />

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Recording...' : 'Record Payment'}</span>
              </button>
            </div>
          </>
        )}
      </form>
    </Modal>
  )
}

