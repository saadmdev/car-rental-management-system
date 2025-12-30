'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api/client'
import DataTable from '@/components/admin/ui/DataTable'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import toast from 'react-hot-toast'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function VendorsPage() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, vendorId: null, vendorName: '' })
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchVendors()
  }, [pagination.page])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const response = await api.getVendors({
        page: pagination.page,
        limit: pagination.limit,
      })
      if (response.success) {
        setVendors(response.data)
        setPagination(response.pagination)
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page })
  }

  const handleDeleteClick = (vendorId, vendorName) => {
    setDeleteDialog({
      isOpen: true,
      vendorId,
      vendorName: vendorName || 'this vendor',
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.vendorId) return

    try {
      setDeleting(true)
      const response = await api.deactivateVendor(deleteDialog.vendorId)
      
      if (response.success) {
        toast.success('Vendor deactivated successfully')
        setDeleteDialog({ isOpen: false, vendorId: null, vendorName: '' })
        // Refresh the list
        fetchVendors()
      } else {
        toast.error(response.message || 'Failed to deactivate vendor')
      }
    } catch (error) {
      console.error('Error deactivating vendor:', error)
      toast.error(error.message || 'Failed to deactivate vendor')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, vendorId: null, vendorName: '' })
  }

  const columns = [
    {
      header: 'Vendor Name',
      accessor: 'name',
      render: (value, row) => (
        <div>
          <div className="font-semibold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.contactPerson}</div>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: 'email',
      render: (value, row) => (
        <div>
          <div className="text-sm text-gray-700">{value}</div>
          <div className="text-sm text-gray-500">{row.phone}</div>
        </div>
      ),
    },
    {
      header: 'Payment Terms',
      accessor: 'paymentTerms',
      render: (value) => (
        <span className="text-gray-700 capitalize">{value?.replace('_', ' ')}</span>
      ),
    },
    {
      header: 'Commission',
      accessor: 'commissionRate',
      render: (value) => (
        <span className="text-gray-700">{value || 0}%</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            value
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value ? 'ACTIVE' : 'INACTIVE'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push(`/admin/vendors/${value}`)}
            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push(`/admin/vendors/${value}/edit`)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(value, row.name)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Deactivate"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600 mt-1">Manage vendor information</p>
        </div>
        <Link
          href="/admin/vendors/new"
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Add Vendor</span>
        </Link>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={vendors}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Deactivate Vendor"
        message={`Are you sure you want to deactivate "${deleteDialog.vendorName}"? This will mark the vendor as inactive. This action cannot be undone.`}
        confirmText={deleting ? 'Deactivating...' : 'Deactivate'}
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

