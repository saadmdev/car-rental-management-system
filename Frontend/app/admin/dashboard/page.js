'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api/client'
import {
  Car,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getDashboardSummary()
      if (response.success) {
        setSummary(response.data)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load dashboard data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    )
  }

  const stats = [
    {
      icon: Car,
      label: 'Total Vehicles',
      value: summary?.vehicles?.total || 0,
      subValue: `${summary?.vehicles?.available || 0} available`,
      color: 'bg-blue-500',
    },
    {
      icon: Calendar,
      label: 'Monthly Bookings',
      value: summary?.bookings?.monthly || 0,
      subValue: `${summary?.bookings?.pending || 0} pending`,
      color: 'bg-purple-500',
    },
    {
      icon: DollarSign,
      label: 'Monthly Revenue',
      value: `$${summary?.revenue?.monthly?.toLocaleString() || 0}`,
      subValue: `$${summary?.profit?.monthly?.toLocaleString() || 0} profit`,
      color: 'bg-green-500',
    },
    {
      icon: Users,
      label: 'Active Drivers',
      value: summary?.drivers?.active || 0,
      subValue: `${summary?.vehicles?.booked || 0} vehicles booked`,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subValue}</p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outstanding Receivables */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900">Outstanding Receivables</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${summary?.receivables?.outstanding?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Total amount pending from customers
          </p>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Monthly Expenses</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${summary?.expenses?.monthly?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Total expenses for this month
          </p>
        </div>
      </div>
    </div>
  )
}

