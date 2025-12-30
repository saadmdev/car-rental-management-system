'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api/client'
import DataTable from '@/components/admin/ui/DataTable'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import toast from 'react-hot-toast'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, customerId: null, customerName: '' })
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchCustomers()
  }, [pagination.page])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await api.getCustomers({
        page: pagination.page,
        limit: pagination.limit,
      })
      if (response.success) {
        setCustomers(response.data)
        setPagination(response.pagination)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page })
  }

  const handleDeleteClick = (customerId, customerName) => {
    setDeleteDialog({
      isOpen: true,
      customerId,
      customerName: customerName || 'this customer',
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.customerId) return

    try {
      setDeleting(true)
      const response = await api.deactivateCustomer(deleteDialog.customerId)
      
      if (response.success) {
        toast.success('Customer deactivated successfully')
        setDeleteDialog({ isOpen: false, customerId: null, customerName: '' })
        // Refresh the list
        fetchCustomers()
      } else {
        toast.error(response.message || 'Failed to deactivate customer')
      }
    } catch (error) {
      console.error('Error deactivating customer:', error)
      toast.error(error.message || 'Failed to deactivate customer')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, customerId: null, customerName: '' })
  }

  const columns = [
    {
      header: 'Name / Company',
      accessor: 'customerType',
      render: (value, row) => (
        <div>
          <div className="font-semibold text-gray-900">
            {row.customerType === 'individual'
              ? `${row.firstName} ${row.lastName}`
              : row.companyName}
          </div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'customerType',
      render: (value) => (
        <span className="capitalize text-gray-700">{value}</span>
      ),
    },
    {
      header: 'Phone',
      accessor: 'phone',
      render: (value) => <span className="text-gray-700">{value}</span>,
    },
    {
      header: 'Bookings',
      accessor: 'totalBookings',
      render: (value) => (
        <span className="text-gray-700">{value || 0}</span>
      ),
    },
    {
      header: 'Total Spent',
      accessor: 'totalSpent',
      render: (value) => (
        <span className="font-semibold text-gray-900">
          ${value?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: 'Outstanding',
      accessor: 'outstandingBalance',
      render: (value) => (
        <span
          className={`font-semibold ${
            value > 0 ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          ${value?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (value, row) => {
        const customerName = row.customerType === 'individual'
          ? `${row.firstName} ${row.lastName}`
          : row.companyName
        return (
          <div className="flex items-center space-x-2">
            <Link
              href={`/admin/customers/${value}`}
              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={() => router.push(`/admin/customers/${value}/edit`)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteClick(value, customerName)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Deactivate"
            >
              <Trash2 className="w-4 h-4" />
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
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage customer information</p>
        </div>
        <Link
          href="/admin/customers/new"
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Add Customer</span>
        </Link>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={customers}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Deactivate Customer"
        message={`Are you sure you want to deactivate "${deleteDialog.customerName}"? This will mark the customer as inactive. This action cannot be undone.`}
        confirmText={deleting ? 'Deactivating...' : 'Deactivate'}
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

