'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0) // First FAQ open by default

  const faqs = [
    {
      id: 1,
      question: 'How does it work?',
      answer:
        'Renting a car with us is simple! Browse our fleet online, select your preferred vehicle, choose your rental dates and pickup location, complete the booking form, and make your payment. On the rental day, visit the selected location with your driver\'s license and credit card to pick up your vehicle. Return the car at the agreed location and time.',
    },
    {
      id: 2,
      question: 'Can I rent a car without a credit card?',
      answer:
        'Yes, you can rent a car without a credit card. We accept various payment methods including debit cards and cash deposits. Please contact our customer service for more details.',
    },
    {
      id: 3,
      question: 'What are the requirements for renting a car?',
      answer:
        'To rent a car, you need a valid driver\'s license, proof of insurance, and a credit or debit card. The minimum age requirement is 21 years old, and drivers under 25 may be subject to additional fees.',
    },
    {
      id: 4,
      question: 'Does Car Rental allow me to tow with or attach a hitch to the rental vehicle?',
      answer:
        'Towing and hitch attachments are generally not allowed on rental vehicles. Please contact us in advance if you have specific requirements, and we can discuss available options.',
    },
    {
      id: 5,
      question: 'Does Car Rental offer coverage products for purchase with my rental?',
      answer:
        'Yes, we offer various coverage options including collision damage waiver, liability insurance, and personal accident insurance. These can be purchased at the time of rental.',
    },
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Top Car Rental Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

