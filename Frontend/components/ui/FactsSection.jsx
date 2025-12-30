export default function FactsSection() {
  const facts = [
    {
      id: 1,
      number: '20k+',
      label: 'Happy customers',
    },
    {
      id: 2,
      number: '540+',
      label: 'Count of cars',
    },
    {
      id: 3,
      number: '25+',
      label: 'Years of experience',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {facts.map((fact) => (
            <div key={fact.id} className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2">
                {fact.number}
              </div>
              <div className="text-lg text-gray-900">{fact.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

