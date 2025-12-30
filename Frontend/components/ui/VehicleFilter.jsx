'use client'

import { Car } from 'lucide-react'
import { vehicleTypes } from '@/lib/data'

// Icon mapping for different vehicle types
const getVehicleIcon = (type) => {
  // For simplicity, we'll use the Car icon for all types
  // In a real app, you'd have specific icons for each type
  return Car
}

export default function VehicleFilter({ selectedType, onTypeChange }) {
  return (
    <div className="flex flex-wrap gap-3 md:gap-4">
      {vehicleTypes.map((type) => {
        const Icon = getVehicleIcon(type.icon)
        const isSelected = selectedType === type.id

        return (
          <button
            key={type.id}
            onClick={() => onTypeChange(type.id)}
            className={`
              flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all
              ${
                isSelected
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-900 border border-gray-200 hover:border-primary hover:text-primary'
              }
            `}
          >
            <Icon
              className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`}
            />
            <span>{type.label}</span>
          </button>
        )
      })}
    </div>
  )
}

