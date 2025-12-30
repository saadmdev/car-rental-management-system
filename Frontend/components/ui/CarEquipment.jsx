import { Check } from 'lucide-react'

export default function CarEquipment({ equipment = [] }) {
  if (!equipment || equipment.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Car Equipment</h3>
        <p className="text-gray-500">No equipment information available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Car Equipment</h3>
      <div className="space-y-3">
        {equipment.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-primary rounded flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

