import { MapPin, Car, Wallet } from 'lucide-react'
import { features } from '@/lib/data'

const iconMap = {
  'map-pin': MapPin,
  car: Car,
  wallet: Wallet,
}

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon]
            return (
              <div
                key={feature.id}
                className="text-center space-y-4 p-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

