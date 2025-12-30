export default function InfoSection() {
  const items = [
    {
      id: 1,
      title: 'Easy Online Booking',
      description:
        'Book your perfect car in just a few clicks. Our user-friendly online platform makes it simple to compare vehicles, check availability, and complete your reservation in minutes.',
    },
    {
      id: 2,
      title: 'Flexible Rental Options',
      description:
        'Choose from daily, weekly, or monthly rental plans. We offer flexible pickup and drop-off times to fit your schedule, with locations throughout the city.',
    },
    {
      id: 3,
      title: '24/7 Roadside Assistance',
      description:
        'Travel with confidence knowing our dedicated support team is available around the clock. We provide immediate assistance for any issues during your rental period.',
    },
    {
      id: 4,
      title: 'Best Price Guarantee',
      description:
        'We guarantee the best rates in the market. If you find a lower price elsewhere, we will match it. Plus, enjoy special discounts for long-term rentals and loyal customers.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
            <img
              src="https://media.istockphoto.com/id/1419724017/photo/car-rental-agency-employee-giving-car-keys-to-beautiful-young-woman.jpg?s=612x612&w=0&k=20&c=fmJXUDhx3AGaQoa_pr3bLqliyhX6yKD3WFXPkLbSDyw="
              alt="Happy customer with rental car"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right - Numbered List */}
          <div className="space-y-8">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6">
                {/* Number Circle */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {item.id}
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

