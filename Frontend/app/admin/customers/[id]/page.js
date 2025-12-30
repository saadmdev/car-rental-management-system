'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api/client'
import toast from 'react-hot-toast'
import { User, ArrowLeft, Edit, AlertCircle, Mail, Phone, MapPin, Calendar, DollarSign, FileText, Building2 } from 'lucide-react'
import Link from 'next/link'
import DataTable from '@/components/admin/ui/DataTable'

export default function ViewCustomerPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState(null)
  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCustomer()
    fetchBookings()
  }, [customerId])

  const fetchCustomer = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getCustomerById(customerId)
      if (response.success && response.data) {
        setCustomer(response.data)
      } else {
        setError('Customer not found')
        toast.error('Customer not found')
      }
    } catch (err) {
      console.error('Error fetching customer:', err)
      setError(err.message || 'Failed to load customer')
      toast.error(err.message || 'Failed to load customer')
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      setBookingsLoading(true)
      const response = await api.getCustomerBookings(customerId)
      if (response.success) {
        setBookings(response.data || [])
      }
    } catch (err) {
      console.error('Error fetching bookings:', err)
    } finally {
      setBookingsLoading(false)
    }
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
      in_progress: { label: 'In Progress', color: 'bg-green-100 text-green-800' },
      completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    }
    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const bookingColumns = [
    {
      header: 'Booking Number',
      accessor: 'bookingNumber',
      render: (value) => <span className="font-mono font-semibold text-gray-900">{value}</span>,
    },
    {
      header: 'Vehicle',
      accessor: 'vehicle',
      render: (value) => {
        if (!value) return 'N/A'
        return (
          <div>
            <div className="font-semibold text-gray-900">
              {value.make} {value.model}
            </div>
            <div className="text-sm text-gray-500">{value.registrationNumber}</div>
          </div>
        )
      },
    },
    {
      header: 'Pickup Date',
      accessor: 'pickupDate',
      render: (value) => formatDateTime(value),
    },
    {
      header: 'Return Date',
      accessor: 'returnDate',
      render: (value) => formatDateTime(value),
    },
    {
      header: 'Total Amount',
      accessor: 'totalAmount',
      render: (value) => (
        <span className="font-semibold text-gray-900">${value?.toFixed(2) || '0.00'}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => getStatusBadge(value),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customer details...</p>
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Details</h1>
            <p className="text-gray-600 mt-1">View customer information</p>
          </div>
          <Link
            href="/admin/customers"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Customers</span>
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-800 font-semibold">{error || 'Customer not found'}</p>
          <Link
            href="/admin/customers"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Return to Customers List
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Details</h1>
          <p className="text-gray-600 mt-1">View customer information</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/customers"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <Link
            href={`/admin/customers/${customerId}/edit`}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Edit className="w-5 h-5" />
            <span>Edit</span>
          </Link>
        </div>
      </div>

      {/* Customer Information Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Customer Information */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <User className="w-6 h-6" />
            <span>Customer Information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Customer Type</label>
              <p className="text-lg font-semibold text-gray-900 capitalize">{customer.customerType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
              <p className="text-lg font-semibold text-gray-900">
                {customer.customerType === 'individual'
                  ? `${customer.firstName} ${customer.lastName}`
                  : customer.companyName}
              </p>
            </div>
            {customer.customerType === 'company' && customer.contactPerson && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Contact Person</label>
                <p className="text-lg font-semibold text-gray-900">{customer.contactPerson}</p>
              </div>
            )}
            {customer.customerType === 'company' && customer.taxId && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Tax ID</label>
                <p className="text-lg font-semibold text-gray-900">{customer.taxId}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              <p className="text-lg font-semibold text-gray-900">{customer.email || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>Phone</span>
              </label>
              <p className="text-lg font-semibold text-gray-900">{customer.phone || 'N/A'}</p>
            </div>
            {customer.alternatePhone && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Alternate Phone</label>
                <p className="text-lg font-semibold text-gray-900">{customer.alternatePhone}</p>
              </div>
            )}
            {customer.address && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Address</span>
                </label>
                <p className="text-gray-700">
                  {customer.address.street && `${customer.address.street}, `}
                  {customer.address.city && `${customer.address.city}, `}
                  {customer.address.state && `${customer.address.state} `}
                  {customer.address.zipCode && customer.address.zipCode}
                  {customer.address.country && `, ${customer.address.country}`}
                </p>
              </div>
            )}
            {customer.customerType === 'individual' && customer.licenseNumber && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">License Number</label>
                <p className="text-lg font-semibold text-gray-900 font-mono">{customer.licenseNumber}</p>
              </div>
            )}
            {customer.customerType === 'individual' && customer.licenseExpiry && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>License Expiry</span>
                </label>
                <p className="text-lg font-semibold text-gray-900">{formatDate(customer.licenseExpiry)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <DollarSign className="w-6 h-6" />
            <span>Financial Summary</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Total Bookings</label>
              <p className="text-2xl font-bold text-gray-900">{customer.totalBookings || 0}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Total Spent</label>
              <p className="text-2xl font-bold text-primary">
                ${customer.totalSpent ? customer.totalSpent.toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Outstanding Balance</label>
              <p className={`text-2xl font-bold ${customer.outstandingBalance > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                ${customer.outstandingBalance ? customer.outstandingBalance.toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Booking History */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <FileText className="w-6 h-6" />
            <span>Booking History</span>
          </h2>
          {bookingsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading bookings...</p>
            </div>
          ) : bookings.length > 0 ? (
            <DataTable
              columns={bookingColumns}
              data={bookings}
              loading={false}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No bookings found for this customer.</p>
            </div>
          )}
        </div>

        {/* Additional Information */}
        {customer.notes && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{customer.notes}</p>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Record Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            {customer.createdAt && (
              <div>
                <span className="font-medium">Created:</span>{' '}
                <span>{new Date(customer.createdAt).toLocaleString()}</span>
              </div>
            )}
            {customer.updatedAt && (
              <div>
                <span className="font-medium">Last Updated:</span>{' '}
                <span>{new Date(customer.updatedAt).toLocaleString()}</span>
              </div>
            )}
            {customer.lastBookingDate && (
              <div>
                <span className="font-medium">Last Booking:</span>{' '}
                <span>{formatDate(customer.lastBookingDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

