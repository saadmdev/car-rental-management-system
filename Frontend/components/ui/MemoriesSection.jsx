import { Check } from 'lucide-react'

export default function MemoriesSection() {
  const points = [
    'Explore new destinations with confidence in a reliable, well-maintained vehicle from our premium fleet.',
    'Create lasting memories on road trips, family vacations, or business travels with our comfortable cars.',
    'Experience the convenience of multiple pickup and drop-off locations throughout the city.',
    'Enjoy peace of mind with comprehensive insurance coverage and 24/7 roadside assistance included.',
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Unlock unforgettable memories on the road
            </h2>
            <p className="text-gray-600 text-lg">
              Every journey deserves the perfect vehicle. Whether you're planning a weekend getaway, 
              a family vacation, or a business trip, we have the right car to make your travel experience unforgettable.
            </p>
            <div className="space-y-4">
              {points.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden">
            <img
              src="https://img.freepik.com/premium-photo/happy-family-enjoying-drive-their-new-electric-car_1221914-8297.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Happy family on a road trip"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

