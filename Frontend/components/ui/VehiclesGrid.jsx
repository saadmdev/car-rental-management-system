import CarCard from './CarCard'

export default function VehiclesGrid({ cars = [] }) {
  if (cars.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg mb-4">No vehicles available at this time.</p>
        <p className="text-gray-500 text-sm">Please check back later or contact us for availability.</p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  )
}

