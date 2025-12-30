'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'

export default function DateRangeFilter({ onFilterChange, label = 'Date Range' }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleStartDateChange = (e) => {
    const value = e.target.value
    setStartDate(value)
    if (value && endDate) {
      onFilterChange({ startDate: value, endDate })
    }
  }

  const handleEndDateChange = (e) => {
    const value = e.target.value
    setEndDate(value)
    if (startDate && value) {
      onFilterChange({ startDate, endDate: value })
    }
  }

  const handleClear = () => {
    setStartDate('')
    setEndDate('')
    onFilterChange({ startDate: '', endDate: '' })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Calendar className="w-5 h-5 text-primary" />
        <label className="text-sm font-semibold text-gray-700">{label}</label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleClear}
            className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

