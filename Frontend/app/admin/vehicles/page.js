'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api/client'
import DataTable from '@/components/admin/ui/DataTable'
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog'
import toast from 'react-hot-toast'
import { Plus, Edit, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, vehicleId: null, vehicleName: '' })
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchVehicles()
  }, [pagination.page])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await api.getVehicles({
        page: pagination.page,
        limit: pagination.limit,
      })
      if (response.success) {
        setVehicles(response.data)
        setPagination(response.pagination)
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      toast.error(error.response?.data?.message || 'Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page })
  }

  const handleDeleteClick = (vehicleId, vehicleName) => {
    setDeleteDialog({
      isOpen: true,
      vehicleId,
      vehicleName: `${vehicleName || 'this vehicle'}`,
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.vehicleId) return

    try {
      setDeleting(true)
      const response = await api.deleteVehicle(deleteDialog.vehicleId)
      
      if (response.success) {
        toast.success('Vehicle deleted successfully')
        setDeleteDialog({ isOpen: false, vehicleId: null, vehicleName: '' })
        // Refresh the list
        fetchVehicles()
      } else {
        toast.error(response.message || 'Failed to delete vehicle')
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      toast.error(error.message || 'Failed to delete vehicle')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, vehicleId: null, vehicleName: '' })
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      available: 'bg-green-100 text-green-800',
      booked: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      out_of_service: 'bg-red-100 text-red-800',
      sold: 'bg-gray-100 text-gray-800',
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
      header: 'Registration',
      accessor: 'registrationNumber',
    },
    {
      header: 'Make & Model',
      accessor: 'make',
      render: (value, row) => (
        <div>
          <div className="font-semibold text-gray-900">
            {row.make} {row.model}
          </div>
          <div className="text-sm text-gray-500">{row.year}</div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'vehicleType',
      render: (value) => (
        <span className="capitalize text-gray-700">{value}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => getStatusBadge(value),
    },
    {
      header: 'Daily Rate',
      accessor: 'dailyRate',
      render: (value) => (
        <span className="font-semibold text-gray-900">${value}/day</span>
      ),
    },
    {
      header: 'Mileage',
      accessor: 'mileage',
      render: (value) => (
        <span className="text-gray-700">{value?.toLocaleString()} km</span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/vehicles/${value}`}
            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => router.push(`/admin/vehicles/${value}/edit`)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(value, `${row.make} ${row.model}`)}
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
          <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-600 mt-1">Manage your vehicle fleet</p>
        </div>
        <Link
          href="/admin/vehicles/new"
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Add Vehicle</span>
        </Link>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={vehicles}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Vehicle"
        message={`Are you sure you want to delete "${deleteDialog.vehicleName}"? This action cannot be undone.`}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

