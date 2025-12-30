import { Gauge, Fuel, DoorOpen, Snowflake, Users, GaugeCircle } from 'lucide-react'

const iconMap = {
  gearBox: Gauge,
  fuel: Fuel,
  doors: DoorOpen,
  airConditioner: Snowflake,
  seats: Users,
  distance: GaugeCircle,
}

export default function TechnicalSpecs({ specifications }) {
  const specs = [
    {
      key: 'gearBox',
      label: 'Gear Box',
      value: specifications.gearBox,
      icon: 'gearBox',
    },
    {
      key: 'fuel',
      label: 'Fuel',
      value: specifications.fuel,
      icon: 'fuel',
    },
    {
      key: 'doors',
      label: 'Doors',
      value: specifications.doors,
      icon: 'doors',
    },
    {
      key: 'airConditioner',
      label: 'Air Conditioner',
      value: specifications.airConditioner,
      icon: 'airConditioner',
    },
    {
      key: 'seats',
      label: 'Seats',
      value: specifications.seats,
      icon: 'seats',
    },
    {
      key: 'distance',
      label: 'Distance',
      value: specifications.distance,
      icon: 'distance',
    },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Technical Specification</h3>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {specs.map((spec) => {
          const Icon = iconMap[spec.icon]
          return (
            <div
              key={spec.key}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{spec.label}</p>
                  <p className="text-base font-semibold text-gray-900">
                    {spec.value}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

