'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api/client'
import toast from 'react-hot-toast'
import { Users, ArrowLeft, Edit, AlertCircle, CheckCircle, XCircle, Calendar, Phone, Mail, MapPin, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function ViewDriverPage() {
  const router = useRouter()
  const params = useParams()
  const driverId = params.id
  const [loading, setLoading] = useState(true)
  const [driver, setDriver] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDriver()
  }, [driverId])

  const fetchDriver = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getDriverById(driverId)
      if (response.success && response.data) {
        setDriver(response.data)
      } else {
        setError('Driver not found')
        toast.error('Driver not found')
      }
    } catch (err) {
      console.error('Error fetching driver:', err)
      setError(err.message || 'Failed to load driver')
      toast.error(err.message || 'Failed to load driver')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
      on_leave: { label: 'On Leave', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      terminated: { label: 'Terminated', color: 'bg-red-100 text-red-800', icon: XCircle },
    }
    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        <Icon className="w-4 h-4" />
        <span>{config.label}</span>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading driver details...</p>
        </div>
      </div>
    )
  }

  if (error || !driver) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Details</h1>
            <p className="text-gray-600 mt-1">View driver information</p>
          </div>
          <Link
            href="/admin/drivers"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Drivers</span>
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-800 font-semibold">{error || 'Driver not found'}</p>
          <Link
            href="/admin/drivers"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Return to Drivers List
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
          <h1 className="text-3xl font-bold text-gray-900">Driver Details</h1>
          <p className="text-gray-600 mt-1">View driver information</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/drivers"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <Link
            href={`/admin/drivers/${driverId}/edit`}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Edit className="w-5 h-5" />
            <span>Edit</span>
          </Link>
        </div>
      </div>

      {/* Driver Information Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Personal Information */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Users className="w-6 h-6" />
            <span>Personal Information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Employee ID</label>
              <p className="text-lg font-semibold text-gray-900 font-mono">{driver.employeeId || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <p className="text-lg font-semibold text-gray-900">
                {driver.firstName} {driver.lastName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
              <p className="text-lg font-semibold text-gray-900">{formatDate(driver.dateOfBirth)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <div className="mt-1">{getStatusBadge(driver.status)}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              <p className="text-lg font-semibold text-gray-900">{driver.email || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>Phone</span>
              </label>
              <p className="text-lg font-semibold text-gray-900">{driver.phone || 'N/A'}</p>
            </div>
            {driver.alternatePhone && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Alternate Phone</label>
                <p className="text-lg font-semibold text-gray-900">{driver.alternatePhone}</p>
              </div>
            )}
            {driver.address && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Address</span>
                </label>
                <p className="text-gray-700">
                  {driver.address.street && `${driver.address.street}, `}
                  {driver.address.city && `${driver.address.city}, `}
                  {driver.address.state && `${driver.address.state} `}
                  {driver.address.zipCode && driver.address.zipCode}
                  {driver.address.country && `, ${driver.address.country}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* License Information */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">License Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">License Number</label>
              <p className="text-lg font-semibold text-gray-900 font-mono">{driver.licenseNumber || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">License Class</label>
              <p className="text-lg font-semibold text-gray-900">{driver.licenseClass || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>License Expiry</span>
              </label>
              <p className="text-lg font-semibold text-gray-900">{formatDate(driver.licenseExpiry)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">License Issued By</label>
              <p className="text-lg font-semibold text-gray-900">{driver.licenseIssuedBy || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Total Trips</label>
              <p className="text-2xl font-bold text-gray-900">{driver.totalTrips || 0}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Total KM Driven</label>
              <p className="text-2xl font-bold text-gray-900">
                {driver.totalKmDriven ? driver.totalKmDriven.toLocaleString() : 0} km
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Total Earnings</label>
              <p className="text-2xl font-bold text-primary">
                ${driver.totalEarnings ? driver.totalEarnings.toFixed(2) : '0.00'}
              </p>
            </div>
            {driver.rating > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">Rating</label>
                <p className="text-2xl font-bold text-gray-900">
                  {driver.rating.toFixed(1)} / 5.0
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Allowances Configuration */}
        {driver.allowances && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Allowances Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {driver.allowances.overtime && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Overtime</span>
                    <span className={`px-2 py-1 rounded text-xs ${driver.allowances.overtime.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                      {driver.allowances.overtime.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {driver.allowances.overtime.enabled && (
                    <div className="text-sm text-gray-600">
                      <p>Threshold: {driver.allowances.overtime.hoursThreshold || 12} hours</p>
                      <p>Rate: ${driver.allowances.overtime.ratePerHour || 0}/hour</p>
                    </div>
                  )}
                </div>
              )}
              {driver.allowances.food && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Food Allowance</span>
                    <span className={`px-2 py-1 rounded text-xs ${driver.allowances.food.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                      {driver.allowances.food.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {driver.allowances.food.enabled && (
                    <p className="text-sm text-gray-600">
                      Daily Rate: ${driver.allowances.food.dailyRate || 0}
                    </p>
                  )}
                </div>
              )}
              {driver.allowances.outstation && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Outstation Allowance</span>
                    <span className={`px-2 py-1 rounded text-xs ${driver.allowances.outstation.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                      {driver.allowances.outstation.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {driver.allowances.outstation.enabled && (
                    <p className="text-sm text-gray-600">
                      Daily Rate: ${driver.allowances.outstation.dailyRate || 0}
                    </p>
                  )}
                </div>
              )}
              {driver.allowances.parking && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Parking Allowance</span>
                    <span className={`px-2 py-1 rounded text-xs ${driver.allowances.parking.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                      {driver.allowances.parking.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {driver.allowances.parking.enabled && (
                    <p className="text-sm text-gray-600">
                      Daily Rate: ${driver.allowances.parking.dailyRate || 0}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Information */}
        {(driver.notes || driver.joiningDate) && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              {driver.joiningDate && (
                <div>
                  <span className="font-medium">Joining Date:</span>{' '}
                  <span>{formatDate(driver.joiningDate)}</span>
                </div>
              )}
              {driver.notes && (
                <div className="md:col-span-2">
                  <span className="font-medium">Notes:</span>
                  <p className="mt-1 bg-gray-50 rounded-lg p-3 text-gray-700 whitespace-pre-wrap">
                    {driver.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Record Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            {driver.createdAt && (
              <div>
                <span className="font-medium">Created:</span>{' '}
                <span>{new Date(driver.createdAt).toLocaleString()}</span>
              </div>
            )}
            {driver.updatedAt && (
              <div>
                <span className="font-medium">Last Updated:</span>{' '}
                <span>{new Date(driver.updatedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

