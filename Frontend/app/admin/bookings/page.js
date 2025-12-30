'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api/client'
import DataTable from '@/components/admin/ui/DataTable'
import ExportButton from '@/components/admin/ui/ExportButton'
import RecordPaymentModal from '@/components/admin/ui/RecordPaymentModal'
import toast from 'react-hot-toast'
import { Plus, DollarSign, Eye, Edit } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, booking: null })
  const router = useRouter()

  useEffect(() => {
    fetchBookings()
  }, [pagination.page])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await api.getBookings({
        page: pagination.page,
        limit: pagination.limit,
      })
      if (response.success) {
        setBookings(response.data)
        setPagination(response.pagination)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error(error.response?.data?.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page })
  }

  const handleRecordPayment = (booking) => {
    setPaymentModal({ isOpen: true, booking })
  }

  const handlePaymentSuccess = () => {
    toast.success('Payment recorded successfully!')
    fetchBookings() // Refresh bookings list
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          statusColors[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status?.replace('_', ' ').toUpperCase()}
      </span>
    )
  }

  const columns = [
    {
      header: 'Booking #',
      accessor: 'bookingNumber',
      render: (value) => (
        <span className="font-mono font-semibold text-gray-900">{value}</span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer',
      render: (value) => {
        if (typeof value === 'object' && value) {
          return (
            <div>
              <div className="font-semibold text-gray-900">
                {value.firstName && value.lastName
                  ? `${value.firstName} ${value.lastName}`
                  : value.companyName || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">{value.email || ''}</div>
            </div>
          )
        }
        return 'N/A'
      },
    },
    {
      header: 'Vehicle',
      accessor: 'vehicle',
      render: (value) => {
        if (typeof value === 'object' && value) {
          return (
            <span className="text-gray-700">
              {value.make} {value.model}
            </span>
          )
        }
        return 'N/A'
      },
    },
    {
      header: 'Period',
      accessor: 'pickupDate',
      render: (value, row) => {
        const pickup = new Date(value).toLocaleDateString()
        const returnDate = new Date(row.returnDate).toLocaleDateString()
        return (
          <div>
            <div className="text-sm text-gray-900">{pickup} - {returnDate}</div>
            <div className="text-xs text-gray-500">{row.numberOfDays} days</div>
          </div>
        )
      },
    },
    {
      header: 'Amount',
      accessor: 'totalAmount',
      render: (value) => (
        <span className="font-semibold text-gray-900">${value?.toLocaleString()}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => getStatusBadge(value),
    },
    {
      header: 'Payment',
      accessor: 'paymentStatus',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            value === 'paid'
              ? 'bg-green-100 text-green-800'
              : value === 'partial'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value?.toUpperCase()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (value, row) => {
        const remainingBalance = row.balanceAmount || row.totalAmount - (row.advancePaid || 0)
        const isFullyPaid = remainingBalance <= 0
        
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push(`/admin/bookings/${value}`)}
              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push(`/admin/bookings/${value}/edit`)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleRecordPayment(row)}
              disabled={isFullyPaid}
              className={`p-2 rounded-lg transition-colors ${
                isFullyPaid
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-green-600 hover:bg-green-50'
              }`}
              title={isFullyPaid ? 'Booking is fully paid' : 'Record Payment'}
            >
              <DollarSign className="w-4 h-4" />
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600 mt-1">Manage all vehicle rental bookings</p>
        </div>
        <div className="flex items-center space-x-3">
          <ExportButton
            exportUrl={api.exportBookings()}
            filename={`bookings-${new Date().toISOString().split('T')[0]}.xlsx`}
            label="Export"
          />
          <Link
            href="/admin/bookings/new"
            className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>New Booking</span>
          </Link>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={bookings}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, booking: null })}
        booking={paymentModal.booking}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}

