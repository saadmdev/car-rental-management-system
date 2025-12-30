import Link from 'next/link'

export default function CTABanner() {
  return (
    <section className="py-20 bg-primary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
        }}></div>
      </div>

      {/* Car Silhouette */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Looking for a car?
          </h2>
          <p className="text-xl md:text-2xl font-semibold mb-2">+537 547-6401</p>
          <p className="text-white/90 mb-8 text-lg">
            Ready to hit the road? Browse our extensive fleet of premium vehicles and find the perfect 
            car for your needs. Book online or call us for personalized assistance.
          </p>
          <Link
            href="/pages/vehicles"
            className="inline-block bg-accent text-white px-8 py-4 rounded-lg hover:bg-accent-dark transition-colors font-semibold text-lg"
          >
            Book now
          </Link>
        </div>
      </div>
    </section>
  )
}

