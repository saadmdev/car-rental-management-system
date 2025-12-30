'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api/client'
import DataTable from '@/components/admin/ui/DataTable'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import toast from 'react-hot-toast'
import { Plus, Edit, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DriversPage() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, driverId: null, driverName: '' })
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchDrivers()
  }, [pagination.page])

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      const response = await api.getDrivers({
        page: pagination.page,
        limit: pagination.limit,
      })
      if (response.success) {
        setDrivers(response.data)
        setPagination(response.pagination)
      }
    } catch (error) {
      console.error('Error fetching drivers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page })
  }

  const handleDeleteClick = (driverId, driverName) => {
    setDeleteDialog({
      isOpen: true,
      driverId,
      driverName: driverName || 'this driver',
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.driverId) return

    try {
      setDeleting(true)
      const response = await api.deleteDriver(deleteDialog.driverId)
      
      if (response.success) {
        toast.success('Driver deleted successfully')
        setDeleteDialog({ isOpen: false, driverId: null, driverName: '' })
        // Refresh the list
        fetchDrivers()
      } else {
        toast.error(response.message || 'Failed to delete driver')
      }
    } catch (error) {
      console.error('Error deleting driver:', error)
      toast.error(error.message || 'Failed to delete driver')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, driverId: null, driverName: '' })
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      on_leave: 'bg-yellow-100 text-yellow-800',
      terminated: 'bg-red-100 text-red-800',
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
      header: 'Employee ID',
      accessor: 'employeeId',
      render: (value) => (
        <span className="font-mono font-semibold text-gray-900">{value}</span>
      ),
    },
    {
      header: 'Name',
      accessor: 'firstName',
      render: (value, row) => (
        <div>
          <div className="font-semibold text-gray-900">
            {row.firstName} {row.lastName}
          </div>
          <div className="text-sm text-gray-500">{row.phone}</div>
        </div>
      ),
    },
    {
      header: 'License',
      accessor: 'licenseNumber',
      render: (value) => (
        <span className="font-mono text-sm text-gray-700">{value}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => getStatusBadge(value),
    },
    {
      header: 'Trips',
      accessor: 'totalTrips',
      render: (value) => (
        <span className="text-gray-700">{value || 0}</span>
      ),
    },
    {
      header: 'Total KM',
      accessor: 'totalKmDriven',
      render: (value) => (
        <span className="text-gray-700">{value?.toLocaleString() || 0} km</span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/drivers/${value}`}
            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => router.push(`/admin/drivers/${value}/edit`)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(value, `${row.firstName} ${row.lastName}`)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
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
          <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
          <p className="text-gray-600 mt-1">Manage driver information and allowances</p>
        </div>
        <Link
          href="/admin/drivers/new"
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Add Driver</span>
        </Link>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={drivers}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Driver"
        message={`Are you sure you want to delete "${deleteDialog.driverName}"? This action cannot be undone.`}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

