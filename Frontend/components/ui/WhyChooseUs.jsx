import { Award, Users, Clock, Shield } from 'lucide-react'

export default function WhyChooseUs() {
  const reasons = [
    {
      id: 1,
      icon: Award,
      title: 'Award Winning Service',
      description:
        'Recognized for excellence in customer service and vehicle quality. We strive to exceed your expectations.',
    },
    {
      id: 2,
      icon: Users,
      title: 'Trusted by Thousands',
      description:
        'Join thousands of satisfied customers who trust us for their transportation needs. Your satisfaction is our priority.',
    },
    {
      id: 3,
      icon: Clock,
      title: 'Quick & Easy Process',
      description:
        'Streamlined booking process that takes just minutes. Get on the road faster with our efficient service.',
    },
    {
      id: 4,
      icon: Shield,
      title: 'Fully Insured',
      description:
        'Comprehensive insurance coverage for complete peace of mind. Drive confidently knowing you are protected.',
    },
  ]

  return (
    <section className="py-20 bg-primary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Us
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Experience the difference with our exceptional service and
            commitment to excellence
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {reasons.map((reason) => {
            const Icon = reason.icon
            return (
              <div
                key={reason.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors"
              >
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
                <p className="text-white/90">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

