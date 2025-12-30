'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function DetailsFAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      id: 1,
      question: 'What documents do I need to rent a car?',
      answer:
        'You need a valid driver\'s license, a credit or debit card, and proof of insurance. International drivers may need an International Driving Permit.',
    },
    {
      id: 2,
      question: 'What is included in the rental price?',
      answer:
        'The rental price includes the vehicle, basic insurance coverage, and 24/7 roadside assistance. Additional services like GPS or child seats may incur extra charges.',
    },
    {
      id: 3,
      question: 'Can I modify or cancel my reservation?',
      answer:
        'Yes, you can modify or cancel your reservation up to 24 hours before your pickup time. Some plans offer free cancellation.',
    },
    {
      id: 4,
      question: 'What happens if I return the car late?',
      answer:
        'Late returns may incur additional charges. We recommend contacting us if you need to extend your rental period to avoid penalties.',
    },
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Frequently Asked Questions
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

