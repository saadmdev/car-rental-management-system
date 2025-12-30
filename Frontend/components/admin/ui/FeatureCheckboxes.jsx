'use client'

export default function FeatureCheckboxes({ label, value = [], onChange, error, required = false }) {
  const availableFeatures = [
    'ABS',
    'Air Bags',
    'Air Conditioner',
    'Bluetooth',
    'GPS Navigation',
    'Cruise Control',
    'Leather Seats',
    'Premium Sound System',
    'Sunroof',
    'Parking Sensors',
    'Reverse Camera',
    'Keyless Entry',
    'Push Start',
    'Heated Seats',
    'Cooled Seats',
    'Third Row Seating',
    'Towing Package',
    '4WD',
    'All-Wheel Drive',
    'Sport Mode',
    'Convertible Top',
    'Roof Rack',
    'Bed Liner',
    'Sliding Doors',
  ]

  const handleFeatureToggle = (feature) => {
    const updated = value.includes(feature)
      ? value.filter((f) => f !== feature)
      : [...value, feature]
    onChange({ target: { name: 'features', value: updated } })
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50 max-h-64 overflow-y-auto">
        {availableFeatures.map((feature) => (
          <label
            key={feature}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            <input
              type="checkbox"
              checked={value.includes(feature)}
              onChange={() => handleFeatureToggle(feature)}
              className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <span className="text-sm text-gray-700">{feature}</span>
          </label>
        ))}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {value.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {value.length} feature{value.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  )
}

