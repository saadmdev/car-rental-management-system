'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api/client'
import toast from 'react-hot-toast'
import { Building2, ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, DollarSign, FileText, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function ViewVendorPage() {
  const router = useRouter()
  const params = useParams()
  const vendorId = params.id
  const [loading, setLoading] = useState(true)
  const [vendor, setVendor] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchVendorData()
  }, [vendorId])

  const fetchVendorData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getVendorById(vendorId)

      if (response.success && response.data) {
        setVendor(response.data)
      } else {
        setError('Vendor not found')
        toast.error('Vendor not found')
      }
    } catch (err) {
      console.error('Error fetching vendor data:', err)
      setError(err.message || 'Failed to load vendor data')
      toast.error(err.message || 'Failed to load vendor data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vendor data...</p>
        </div>
      </div>
    )
  }

  if (error || !vendor) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error || 'Vendor not found'}</p>
          <Link
            href="/admin/vendors"
            className="mt-4 inline-flex items-center space-x-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Vendors</span>
          </Link>
        </div>
      </div>
    )
  }

  const formatAddress = () => {
    if (!vendor.address) return 'Not provided'
    const addr = vendor.address
    const parts = [addr.street, addr.city, addr.state, addr.zipCode, addr.country].filter(Boolean)
    return parts.length > 0 ? parts.join(', ') : 'Not provided'
  }

  const formatPaymentTerms = (terms) => {
    if (!terms) return 'Not set'
    return terms.replace('_', ' ').toUpperCase().replace('NET', 'Net')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/vendors"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
            <p className="text-gray-600 mt-1">Vendor Details</p>
          </div>
        </div>
        <Link
          href={`/admin/vendors/${vendorId}/edit`}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
        >
          <Edit className="w-5 h-5" />
          <span>Edit Vendor</span>
        </Link>
      </div>

      {/* Vendor Information */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-4">
          <Building2 className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-gray-900">Vendor Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Vendor Name</label>
              <p className="mt-1 text-lg font-semibold text-gray-900">{vendor.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Contact Person</label>
              <p className="mt-1 text-gray-900">{vendor.contactPerson || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              <p className="mt-1 text-gray-900">{vendor.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Phone</span>
              </label>
              <p className="mt-1 text-gray-900">{vendor.phone}</p>
            </div>
          </div>

          {/* Business Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Address</span>
              </label>
              <p className="mt-1 text-gray-900">{formatAddress()}</p>
            </div>
            {vendor.taxId && (
              <div>
                <label className="text-sm font-medium text-gray-500">Tax ID</label>
                <p className="mt-1 text-gray-900">{vendor.taxId}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Payment Terms</span>
              </label>
              <p className="mt-1 text-gray-900">{formatPaymentTerms(vendor.paymentTerms)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Commission Rate</label>
              <p className="mt-1 text-gray-900">{vendor.commissionRate || 0}%</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-2">
            {vendor.isActive ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-semibold">Active</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 font-semibold">Inactive</span>
              </>
            )}
          </div>
        </div>

        {/* Notes */}
        {vendor.notes && (
          <div className="border-t border-gray-200 pt-4">
            <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Notes</span>
            </label>
            <p className="mt-1 text-gray-900 whitespace-pre-wrap">{vendor.notes}</p>
          </div>
        )}

        {/* Record Info */}
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-gray-500">Created</label>
              <p className="mt-1 text-gray-900">
                {vendor.createdAt ? new Date(vendor.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-gray-500">Last Updated</label>
              <p className="mt-1 text-gray-900">
                {vendor.updatedAt ? new Date(vendor.updatedAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

