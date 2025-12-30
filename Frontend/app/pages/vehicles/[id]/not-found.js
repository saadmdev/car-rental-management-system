import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Vehicle Not Found</h1>
        <p className="text-gray-600">The vehicle you're looking for doesn't exist.</p>
        <Link
          href="/pages/vehicles"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
        >
          View All Vehicles
        </Link>
      </div>
    </div>
  )
}

