'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api/client'
import toast from 'react-hot-toast'
import { Calendar, ArrowLeft, Edit, Mail, Phone, Car, User, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'

export default function ViewBookingPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = params.id
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState(null)
  const [payments, setPayments] = useState([])
  const [paymentDialog, setPaymentDialog] = useState({ isOpen: false, paymentId: null })

  useEffect(() => {
    fetchBookingData()
    fetchPayments()
  }, [bookingId])

  const fetchBookingData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getBookingById(bookingId)

      if (response.success && response.data) {
        setBooking(response.data)
      } else {
        setError('Booking not found')
        toast.error('Booking not found')
      }
    } catch (err) {
      console.error('Error fetching booking data:', err)
      setError(err.message || 'Failed to load booking data')
      toast.error(err.message || 'Failed to load booking data')
    } finally {
      setLoading(false)
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await api.getPayments({ booking: bookingId })
      if (response.success) {
        setPayments(response.data || [])
      }
    } catch (err) {
      console.error('Error fetching payments:', err)
    }
  }

  const handleMarkPaymentReceived = async (paymentId) => {
    try {
      const response = await api.markPaymentAsReceived(paymentId)
      if (response.success) {
        toast.success('Payment marked as received!')
        fetchBookingData()
        fetchPayments()
      } else {
        toast.error(response.message || 'Failed to mark payment as received')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to mark payment as received')
    } finally {
      setPaymentDialog({ isOpen: false, paymentId: null })
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      in_progress: { label: 'In Progress', color: 'bg-purple-100 text-purple-800', icon: Clock },
      completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
    }
    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: Clock }
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        <Icon className="w-4 h-4" />
        <span>{config.label}</span>
      </span>
    )
  }

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-red-100 text-red-800' },
      partial: { label: 'Partial', color: 'bg-yellow-100 text-yellow-800' },
      paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
      refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
    }
    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking data...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error || 'Booking not found'}</p>
          <Link
            href="/admin/bookings"
            className="mt-4 inline-flex items-center space-x-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Bookings</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/bookings"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking {booking.bookingNumber}</h1>
            <p className="text-gray-600 mt-1">Booking Details</p>
          </div>
        </div>
        <Link
          href={`/admin/bookings/${bookingId}/edit`}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
        >
          <Edit className="w-5 h-5" />
          <span>Edit Booking</span>
        </Link>
      </div>

      {/* Booking Information */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-4">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-gray-900">Booking Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Booking Number</label>
            <p className="mt-1 text-lg font-semibold text-gray-900 font-mono">{booking.bookingNumber}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Booking Date</label>
            <p className="mt-1 text-gray-900">{formatDate(booking.bookingDate)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="mt-1">{getStatusBadge(booking.status)}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Payment Status</label>
            <div className="mt-1">{getPaymentStatusBadge(booking.paymentStatus)}</div>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      {booking.customer && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-4">
            <User className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Customer Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {typeof booking.customer === 'object' 
                  ? (booking.customer.firstName && booking.customer.lastName
                      ? `${booking.customer.firstName} ${booking.customer.lastName}`
                      : booking.customer.companyName || 'N/A')
                  : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              <p className="mt-1 text-gray-900">
                {typeof booking.customer === 'object' ? booking.customer.email : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Phone</span>
              </label>
              <p className="mt-1 text-gray-900">
                {typeof booking.customer === 'object' ? booking.customer.phone : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Information */}
      {booking.vehicle && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-4">
            <Car className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Vehicle Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Vehicle</label>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {typeof booking.vehicle === 'object'
                  ? `${booking.vehicle.make} ${booking.vehicle.model}`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Registration Number</label>
              <p className="mt-1 text-gray-900 font-mono">
                {typeof booking.vehicle === 'object' ? booking.vehicle.registrationNumber : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Driver Information */}
      {booking.driver && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-4">
            <User className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Driver Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Driver Name</label>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {typeof booking.driver === 'object'
                  ? `${booking.driver.firstName} ${booking.driver.lastName}`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Phone</span>
              </label>
              <p className="mt-1 text-gray-900">
                {typeof booking.driver === 'object' ? booking.driver.phone : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rental Period */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-4">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-gray-900">Rental Period</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Pickup Date & Time</label>
            <p className="mt-1 text-gray-900">
              {formatDate(booking.pickupDate)} {booking.pickupTime}
            </p>
            <p className="text-sm text-gray-500 mt-1">{booking.pickupLocation}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Return Date & Time</label>
            <p className="mt-1 text-gray-900">
              {formatDate(booking.returnDate)} {booking.returnTime}
            </p>
            <p className="text-sm text-gray-500 mt-1">{booking.returnLocation || booking.pickupLocation}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Number of Days</label>
            <p className="mt-1 text-gray-900">{booking.numberOfDays || 0} days</p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-4">
          <DollarSign className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-gray-900">Pricing</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Base Amount</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              ${booking.baseAmount?.toLocaleString() || 0}
            </p>
          </div>
          {booking.driverCharges > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500">Driver Charges</label>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                ${booking.driverCharges?.toLocaleString() || 0}
              </p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">Total Amount</label>
            <p className="mt-1 text-2xl font-bold text-primary">
              ${booking.totalAmount?.toLocaleString() || 0}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Advance Paid</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              ${(booking.advancePaid || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Balance Amount</label>
            <p className={`mt-1 text-lg font-semibold ${booking.balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ${(booking.balanceAmount || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Payments */}
      {payments.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-4">
            <DollarSign className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Payments</h2>
          </div>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Payment #{payment.paymentNumber}</p>
                    <p className="text-sm text-gray-600">
                      Amount: ${payment.amount?.toLocaleString()} | 
                      Method: {payment.paymentMethod} | 
                      Status: <span className={`font-semibold ${
                        payment.status === 'completed' ? 'text-green-600' : 
                        payment.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
                      }`}>{payment.status}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Date: {formatDate(payment.paymentDate)}
                    </p>
                  </div>
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => setPaymentDialog({ isOpen: true, paymentId: payment._id })}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                    >
                      Mark as Received
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={paymentDialog.isOpen}
        onClose={() => setPaymentDialog({ isOpen: false, paymentId: null })}
        onConfirm={() => handleMarkPaymentReceived(paymentDialog.paymentId)}
        title="Mark Payment as Received"
        message="Are you sure you want to mark this payment as received? This will update the booking payment status."
      />
    </div>
  )
}

