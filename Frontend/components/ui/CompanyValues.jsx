export default function CompanyValues() {
  const values = [
    {
      id: 1,
      title: 'Variety Brands',
      description:
        'Choose from top automotive brands including Mercedes, BMW, Porsche, Toyota, and more. Our diverse fleet ensures you find the perfect vehicle for every occasion.',
    },
    {
      id: 2,
      title: 'Maximum Freedom',
      description:
        'Enjoy the freedom to travel wherever you want, whenever you want. No restrictions on mileage for most vehicles, giving you complete control over your journey.',
    },
    {
      id: 3,
      title: 'Awesome Support',
      description:
        'Our dedicated customer service team is here to help you every step of the way. From booking assistance to roadside support, we ensure a smooth rental experience.',
    },
    {
      id: 4,
      title: 'Flexibility On The Go',
      description:
        'Need to extend your rental? Change your pickup location? No problem. We offer flexible options to accommodate your changing travel plans and requirements.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column - Main Heading */}
          <div className="flex items-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              Where every drive feels extraordinary
            </h2>
          </div>

          {/* Right Column - Values in 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {values.map((value) => (
              <div key={value.id} className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

