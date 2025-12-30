export default function PricingDetails() {
  const pricingPlans = [
    {
      id: 1,
      name: 'Economy',
      price: '$25',
      period: 'per day',
      features: [
        'Basic insurance coverage',
        'Fuel efficient vehicles',
        'Standard features',
        '24/7 roadside assistance',
      ],
    },
    {
      id: 2,
      name: 'Standard',
      price: '$45',
      period: 'per day',
      features: [
        'Comprehensive insurance',
        'Mid-size vehicles',
        'Premium features',
        'Priority support',
        'Free cancellation',
      ],
      popular: true,
    },
    {
      id: 3,
      name: 'Premium',
      price: '$70',
      period: 'per day',
      features: [
        'Full coverage insurance',
        'Luxury vehicles',
        'All premium features',
        'VIP support',
        'Free cancellation',
        'Airport pickup',
      ],
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pricing Plans
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose the perfect plan that fits your needs and budget
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl p-8 shadow-lg ${
                plan.popular
                  ? 'border-2 border-primary relative'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-4xl font-bold text-primary">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

