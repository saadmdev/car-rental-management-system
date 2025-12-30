'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Gauge, Fuel, Snowflake } from 'lucide-react'

export default function CarCard({ car }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Car Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {car.image ? (
          <img
            src={car.image}
            alt={`${car.brand} ${car.type}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-car.jpg'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span>No Image</span>
          </div>
        )}
      </div>

      {/* Car Details */}
      <div className="p-6 space-y-4">
        {/* Brand, Type, and Price Row */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{car.brand}</h3>
            <p className="text-sm text-gray-600">{car.type}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">${car.price}</div>
            <p className="text-xs text-gray-500">per day</p>
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1.5">
            <Gauge className="w-4 h-4" />
            <span>{car.features?.transmission || 'Automatic'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Fuel className="w-4 h-4" />
            <span>{car.features?.fuel || 'Petrol'}</span>
          </div>
          {(car.features?.airConditioner || car.equipment?.includes('Air Conditioner')) && (
            <div className="flex items-center space-x-1.5">
              <Snowflake className="w-4 h-4" />
              <span>Air Conditioner</span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <Link
          href={`/pages/vehicles/${car._id || car.id}`}
          className="block w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold mt-4 text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

