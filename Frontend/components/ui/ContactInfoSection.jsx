import { MapPin, Mail, Phone, Clock } from 'lucide-react'

export default function ContactInfoSection() {
  const contactInfo = [
    {
      id: 1,
      icon: MapPin,
      label: 'Address',
      value: 'Gt Road, Rawalpindi, Pakistan',
    },
    {
      id: 2,
      icon: Mail,
      label: 'Email',
      value: 'saadmdev@gmail.com',
    },
    {
      id: 3,
      icon: Phone,
      label: 'Phone',
      value: '+92 300 1234567',
    },
    {
      id: 4,
      icon: Clock,
      label: 'Opening hours',
      value: 'Sun-Mon: 10am - 10pm',
    },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {contactInfo.map((info) => {
            const Icon = info.icon
            return (
              <div key={info.id} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    {info.label}
                  </p>
                  <p className="text-sm text-gray-600">{info.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

