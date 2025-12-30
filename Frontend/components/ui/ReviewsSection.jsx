export default function ReviewsSection() {
  const reviews = [
    {
      id: 1,
      text: 'Excellent service from start to finish! The car was clean, well-maintained, and exactly as described. The booking process was smooth, and the staff was very helpful. Highly recommend for anyone looking for reliable car rental.',
      company: 'Tech Solutions Inc.',
      name: 'Michael Johnson',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    },
    {
      id: 2,
      text: 'I have rented from this company multiple times and they never disappoint. Great selection of vehicles, competitive prices, and outstanding customer support. The online booking system is user-friendly and convenient.',
      company: 'Travel Agency Pro',
      name: 'Sarah Williams',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
    },
    {
      id: 3,
      text: 'Perfect experience for our family vacation! The SUV we rented was spacious, comfortable, and perfect for our road trip. The pickup and drop-off process was quick and hassle-free. Will definitely use their services again.',
      company: 'Family Adventures Co.',
      name: 'David Martinez',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Reviews from our customers
        </h2>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
            >
              {/* Quote Icon */}
              <div className="p-6 pb-4 flex-grow">
                <div className="text-6xl font-bold text-primary leading-none">
                  &quot;
                </div>
                <p className="text-gray-700 mt-2 leading-relaxed">{review.text}</p>
              </div>

              {/* Reviewer Info */}
              <div className="bg-primary p-6 relative mt-auto">
                <div className="flex flex-col items-center text-center">
                  {/* Profile Picture */}
                  <div className="w-16 h-16 bg-white rounded-full mb-3 -mt-10 border-4 border-white shadow-lg overflow-hidden">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-white">
                    <p className="text-sm opacity-90">{review.company}</p>
                    <p className="text-lg font-bold mt-1">{review.name}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

