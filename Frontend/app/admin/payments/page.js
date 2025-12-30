'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api/client'
import DataTable from '@/components/admin/ui/DataTable'
import ExportButton from '@/components/admin/ui/ExportButton'

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })

  useEffect(() => {
    fetchPayments()
  }, [pagination.page])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await api.getPayments({
        page: pagination.page,
        limit: pagination.limit,
      })
      if (response.success) {
        setPayments(response.data)
        setPagination(response.pagination)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page })
  }

  const columns = [
    {
      header: 'Payment #',
      accessor: 'paymentNumber',
      render: (value) => (
        <span className="font-mono font-semibold text-gray-900">{value}</span>
      ),
    },
    {
      header: 'Booking #',
      accessor: 'booking',
      render: (value) => {
        if (typeof value === 'object' && value) {
          return (
            <span className="font-mono text-gray-900">{value.bookingNumber || 'N/A'}</span>
          )
        }
        return <span className="text-gray-500">N/A</span>
      },
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
        return <span className="text-gray-500">N/A</span>
      },
    },
    {
      header: 'Date',
      accessor: 'paymentDate',
      render: (value) => (
        <span className="text-gray-700">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (value) => (
        <span className="font-semibold text-gray-900">
          ${value?.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Method',
      accessor: 'paymentMethod',
      render: (value) => (
        <span className="capitalize text-gray-700">{value?.replace(/_/g, ' ')}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            value === 'completed'
              ? 'bg-green-100 text-green-800'
              : value === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value?.toUpperCase()}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Track all receivables and payables</p>
        </div>
        <ExportButton
          exportUrl={api.exportPayments()}
          filename={`payments-${new Date().toISOString().split('T')[0]}.xlsx`}
          label="Export"
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={payments}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

