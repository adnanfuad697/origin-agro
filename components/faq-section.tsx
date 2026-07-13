'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Faq {
  id: number
  question: string
  answer: string
}

export default function FaqSection() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    async function fetchFaqs() {
      setLoading(true)
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Error fetching FAQs:', error)
      } else if (data) {
        const mapped: Faq[] = data.map((row: any) => ({
          id: row.id,
          question: row.question,
          answer: row.answer,
        }))
        setFaqs(mapped)
      }
      setLoading(false)
    }
    fetchFaqs()
  }, [])

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
              FAQs / সাধারণ জিজ্ঞাসা
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-[#0A5C36] font-semibold text-base mt-1">প্রায়শই জিজ্ঞাসিত প্রশ্নসমূহ</p>
            <p className="text-gray-500 mt-4 leading-relaxed text-sm">
              Have more questions? Reach out to our team directly and we&apos;ll get back to you within 24 hours.
            </p>
            <p className="text-gray-400 text-xs mt-1">আরও প্রশ্ন আছে? সরাসরি আমাদের দলের সাথে যোগাযোগ করুন।</p>
            
              href="#footer"
              className="inline-block mt-6 bg-[#0A5C36] hover:bg-[#063D24] text-white font-bold px-6 py-3 rounded-xl transition-colors duration-200 text-sm"
            >
              Contact Us
            </a>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {loading && <div className="text-gray-500 text-sm">Loading questions...</div>}

            {!loading && faqs.length === 0 && (
              <div className="text-gray-500 text-sm">No FAQs added yet.</div>
            )}

            {!loading &&
              faqs.map((faq, i) => (
                <div
                  key={faq.id}
                  className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                    openIndex === i ? 'border-[#0A5C36]' : 'border-gray-200'
                  }`}
                >
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    aria-expanded={openIndex === i}
                  >
                    <span className="font-semibold text-gray-900 text-sm leading-snug">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#0A5C36] shrink-0 transition-transform duration-300 ${
                        openIndex === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openIndex === i && (
                    <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
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
