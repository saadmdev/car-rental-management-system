import { Shield, Clock, MapPin, Car } from 'lucide-react'

export default function ServiceDetails() {
  const services = [
    {
      id: 1,
      icon: Shield,
      title: 'Insurance Coverage',
      description:
        'Comprehensive insurance coverage included with every rental. Drive with peace of mind knowing you are fully protected.',
    },
    {
      id: 2,
      icon: Clock,
      title: '24/7 Support',
      description:
        'Round-the-clock customer support available. Our team is always ready to assist you with any questions or concerns.',
    },
    {
      id: 3,
      icon: MapPin,
      title: 'Multiple Locations',
      description:
        'Convenient pickup and drop-off locations across the city. Choose the location that works best for you.',
    },
    {
      id: 4,
      icon: Car,
      title: 'Wide Vehicle Selection',
      description:
        'Choose from our extensive fleet of well-maintained vehicles. From economy to luxury, we have the perfect car for you.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Service Details
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover everything you need to know about our car rental services
            and what makes us the best choice for your transportation needs.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
