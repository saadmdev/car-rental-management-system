'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api/client'
import { FileText, TrendingUp, TrendingDown, Download } from 'lucide-react'
import DateRangeFilter from '@/components/admin/ui/DateRangeFilter'
import ExportButton from '@/components/admin/ui/ExportButton'
import DataTable from '@/components/admin/ui/DataTable'

export default function ReportsPage() {
  const [incomeExpense, setIncomeExpense] = useState(null)
  const [vehiclesPerformance, setVehiclesPerformance] = useState([])
  const [driversPerformance, setDriversPerformance] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchReports()
  }, [filters])

  const fetchReports = async () => {
    try {
      setLoading(true)
      
      // Fetch income/expense report
      if (filters.startDate && filters.endDate) {
        const incomeExpenseResponse = await api.getIncomeExpenseReportByDateRange(filters)
        if (incomeExpenseResponse.success) {
          setIncomeExpense(incomeExpenseResponse.data)
        }
      } else {
        const today = new Date()
        const incomeExpenseResponse = await api.getMonthlyIncomeExpenseReport({
          year: today.getFullYear(),
          month: today.getMonth() + 1,
        })
        if (incomeExpenseResponse.success) {
          setIncomeExpense(incomeExpenseResponse.data)
        }
      }

      // Fetch vehicles performance
      const vehiclesResponse = await api.getAllVehiclesPerformanceReport(filters)
      if (vehiclesResponse.success) {
        setVehiclesPerformance(vehiclesResponse.data)
      }

      // Fetch drivers performance
      const driversResponse = await api.getAllDriversPerformanceReport(filters)
      if (driversResponse.success) {
        setDriversPerformance(driversResponse.data)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const vehiclesColumns = [
    {
      header: 'Vehicle',
      accessor: 'vehicle',
      render: (value) => (
        <div>
          <div className="font-semibold text-gray-900">
            {value.make} {value.model} ({value.year})
          </div>
          <div className="text-sm text-gray-500">{value.registrationNumber}</div>
        </div>
      ),
    },
    {
      header: 'Total Bookings',
      accessor: 'performance',
      render: (value) => (
        <span className="text-gray-700">{value.totalBookings}</span>
      ),
    },
    {
      header: 'Total Revenue',
      accessor: 'performance',
      render: (value) => (
        <span className="font-semibold text-gray-900">
          ${value.totalRevenue.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Total KM',
      accessor: 'performance',
      render: (value) => (
        <span className="text-gray-700">{value.totalKm.toLocaleString()} km</span>
      ),
    },
    {
      header: 'Utilization Days',
      accessor: 'performance',
      render: (value) => (
        <span className="text-gray-700">{value.utilizationDays} days</span>
      ),
    },
    {
      header: 'Revenue/KM',
      accessor: 'performance',
      render: (value) => (
        <span className="text-gray-700">
          ${value.revenuePerKm.toFixed(2)}
        </span>
      ),
    },
  ]

  const driversColumns = [
    {
      header: 'Driver',
      accessor: 'driver',
      render: (value) => (
        <div>
          <div className="font-semibold text-gray-900">{value.fullName}</div>
          <div className="text-sm text-gray-500">{value.employeeId}</div>
        </div>
      ),
    },
    {
      header: 'Total Trips',
      accessor: 'performance',
      render: (value) => (
        <span className="text-gray-700">{value.totalTrips}</span>
      ),
    },
    {
      header: 'Total KM',
      accessor: 'performance',
      render: (value) => (
        <span className="text-gray-700">{value.totalKm.toLocaleString()} km</span>
      ),
    },
    {
      header: 'Total Earnings',
      accessor: 'performance',
      render: (value) => (
        <span className="font-semibold text-gray-900">
          ${value.totalEarnings.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Total Allowances',
      accessor: 'performance',
      render: (value) => (
        <span className="text-gray-700">
          ${value.totalAllowances.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Total Income',
      accessor: 'performance',
      render: (value) => (
        <span className="font-semibold text-green-600">
          ${value.totalIncome.toLocaleString()}
        </span>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">View business analytics and reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <ExportButton
            exportUrl={api.exportIncomeExpense(filters)}
            filename={`income-expense-${new Date().toISOString().split('T')[0]}.xlsx`}
            label="Export Report"
          />
        </div>
      </div>

      {/* Date Range Filter */}
      <DateRangeFilter onFilterChange={handleFilterChange} />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'vehicles'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Vehicles Performance
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'drivers'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Drivers Performance
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && incomeExpense && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold text-gray-900">Total Income</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${incomeExpense.income.total.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {incomeExpense.income.bookingCount} bookings
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Avg: ${incomeExpense.income.averageBookingValue.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingDown className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900">Total Expenses</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${incomeExpense.expenses.total.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {incomeExpense.expenses.count} expenses
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">Net Profit</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${incomeExpense.profit.net.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {incomeExpense.profit.margin}% margin
            </p>
          </div>
        </div>
      )}

      {/* Vehicles Performance Tab */}
      {activeTab === 'vehicles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Vehicles Performance</h2>
            <ExportButton
              exportUrl={api.exportBookings(filters)}
              filename={`vehicles-performance-${new Date().toISOString().split('T')[0]}.xlsx`}
              label="Export"
            />
          </div>
          <DataTable
            columns={vehiclesColumns}
            data={vehiclesPerformance}
            loading={false}
          />
        </div>
      )}

      {/* Drivers Performance Tab */}
      {activeTab === 'drivers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Drivers Performance</h2>
            <ExportButton
              exportUrl={api.exportPayments(filters)}
              filename={`drivers-performance-${new Date().toISOString().split('T')[0]}.xlsx`}
              label="Export"
            />
          </div>
          <DataTable
            columns={driversColumns}
            data={driversPerformance}
            loading={false}
          />
        </div>
      )}
    </div>
  )
}
