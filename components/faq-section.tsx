'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What is Origin Agro and how does it work?',
    a: 'Origin Agro is an integrated agro-tourism and livestock platform based in Bangladesh. Investors can purchase shares in our agro-village project, which combines organic farming, an eco-resort, and a Shariah-certified cattle farm. You earn annual profit distributions based on the Musharakah model.',
  },
  {
    q: 'Is the investment Shariah-compliant and halal?',
    a: 'Yes, absolutely. Our entire investment and profit model is structured under Islamic Musharakah principles, verified and certified by a registered Shariah Advisory Board. All cattle rearing, slaughter, and product delivery processes are fully halal-certified.',
  },
  {
    q: 'What is the minimum investment amount?',
    a: 'The minimum investment starts at ৳50,000 (BDT) for a single unit. Multiple units can be purchased for higher returns. All investment details and profit projections are available in our official prospectus.',
  },
  {
    q: 'How do I buy cattle for Qurbani (কোরবানি)?',
    a: 'You can browse and select your preferred cattle directly from our online livestock shop on this website. Choose the animal, make payment online, and select your delivery preference. We offer free delivery within Dhaka during the Eid-ul-Adha season.',
  },
  {
    q: 'How is the profit distributed to investors?',
    a: '60% of net annual profits are distributed among investors proportional to their shareholding. Distributions occur once per year after the annual audit. Investors receive a detailed profit statement and bank transfer within 30 days of audit completion.',
  },
  {
    q: 'Can I visit the Origin Agro farm and eco-resort?',
    a: 'Yes! Investors receive priority booking access to our eco-resort. The property is open to the public for day-visits, resort stays, and farm experiences. You can book your visit through our "Book Now" button above or call our hotline.',
  },
  {
    q: 'Is my investment capital secured?',
    a: 'Origin Agro is a registered company under Bangladesh law. The project land is held under clear title, and all investor agreements are legally documented. While returns are performance-based (not guaranteed), principal security measures include land collateral provisions in the investor agreement.',
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: heading */}
          <div className="lg:col-span-1">
            <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">FAQs</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 mt-4 leading-relaxed text-sm">
              Have more questions? Reach out to our team directly and we&apos;ll get back to you within 24 hours.
            </p>
            <a
              href="#footer"
              className="inline-block mt-6 bg-[#0A5C36] hover:bg-[#063D24] text-white font-bold px-6 py-3 rounded-xl transition-colors duration-200 text-sm"
            >
              Contact Us
            </a>
          </div>

          {/* Right: Accordion */}
          <div className="lg:col-span-2 space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                  openIndex === i ? 'border-[#0A5C36]' : 'border-gray-200'
                }`}
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                >
                  <span className="font-semibold text-gray-900 text-sm leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#0A5C36] shrink-0 transition-transform duration-300 ${
                      openIndex === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
