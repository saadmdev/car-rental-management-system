import { Search, FileText, CreditCard, Car } from 'lucide-react'

export default function RentalProcess() {
  const steps = [
    {
      id: 1,
      icon: Search,
      title: 'Choose Your Vehicle',
      description:
        'Browse our extensive fleet and select the perfect vehicle for your needs. Filter by type, price, or features.',
    },
    {
      id: 2,
      icon: FileText,
      title: 'Complete Booking',
      description:
        'Fill out the booking form with your details, rental dates, and preferred pickup location.',
    },
    {
      id: 3,
      icon: CreditCard,
      title: 'Secure Payment',
      description:
        'Make a secure payment online. We accept all major credit cards and offer flexible payment options.',
    },
    {
      id: 4,
      icon: Car,
      title: 'Pick Up & Drive',
      description:
        'Collect your vehicle at the chosen location and hit the road. Our team will ensure everything is ready.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Renting a car with us is simple and straightforward. Follow these
            easy steps to get started.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.id} className="relative">
                {/* Connection Line (except last) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-1/2 w-full h-0.5 bg-primary/30 z-0">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary/50 rounded-full"></div>
                  </div>
                )}
                <div className="relative bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  {/* Large Icon Circle */}
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 relative z-10">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  {/* Number Circle Below Icon */}
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-primary font-bold text-sm">{step.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

