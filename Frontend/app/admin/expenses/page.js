'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api/client'
import DataTable from '@/components/admin/ui/DataTable'
import ExportButton from '@/components/admin/ui/ExportButton'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })

  useEffect(() => {
    fetchExpenses()
  }, [pagination.page])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const response = await api.getExpenses({
        page: pagination.page,
        limit: pagination.limit,
      })
      if (response.success) {
        setExpenses(response.data)
        setPagination(response.pagination)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page })
  }

  const columns = [
    {
      header: 'Expense #',
      accessor: 'expenseNumber',
      render: (value) => (
        <span className="font-mono font-semibold text-gray-900">{value}</span>
      ),
    },
    {
      header: 'Date',
      accessor: 'expenseDate',
      render: (value) => (
        <span className="text-gray-700">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (value) => (
        <span className="capitalize text-gray-700">{value?.replace('_', ' ')}</span>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (value) => (
        <span className="text-gray-700">{value}</span>
      ),
    },
    {
      header: 'Amount',
      accessor: 'totalAmount',
      render: (value) => (
        <span className="font-semibold text-gray-900">
          ${value?.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'paymentStatus',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            value === 'paid'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
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
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">Track operational expenses</p>
        </div>
        <div className="flex items-center space-x-3">
          <ExportButton
            exportUrl={api.exportExpenses()}
            filename={`expenses-${new Date().toISOString().split('T')[0]}.xlsx`}
            label="Export"
          />
          <Link
            href="/admin/expenses/new"
            className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </Link>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={expenses}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

