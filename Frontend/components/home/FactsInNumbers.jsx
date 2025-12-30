import { Car, Users, Calendar, MapPin } from 'lucide-react'
import { facts } from '@/lib/data'

const iconMap = {
  car: Car,
  users: Users,
  calendar: Calendar,
  'map-pin': MapPin,
}

export default function FactsInNumbers() {
  return (
    <section className="py-20 bg-primary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Facts In Numbers
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto">
            Our commitment to excellence is reflected in our numbers. With years of experience 
            and thousands of satisfied customers, we continue to set the standard in car rental services.
          </p>
        </div>

        {/* Facts Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {facts.map((fact) => {
            const Icon = iconMap[fact.icon]
            return (
              <div
                key={fact.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold mb-2">{fact.number}</div>
                <div className="text-white/90">{fact.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

