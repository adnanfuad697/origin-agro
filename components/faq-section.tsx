'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/language-context'

interface Faq {
  id: number
  question: string
  questionBn: string | null
  answer: string
  answerBn: string | null
}

export default function FaqSection() {
  const { lang } = useLanguage()
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [showAllFaqs, setShowAllFaqs] = useState(false)

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
          questionBn: row.question_bn || null,
          answer: row.answer,
          answerBn: row.answer_bn || null,
        }))
        setFaqs(mapped)
      }
      setLoading(false)
    }
    fetchFaqs()
  }, [])

  const visibleFaqs = showAllFaqs ? faqs : faqs.slice(0, 3)

  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
              {lang === 'EN' ? 'FAQs' : 'সাধারণ জিজ্ঞাসা'}
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 text-balance">
              {lang === 'EN' ? 'Frequently Asked Questions' : 'প্রায়শই জিজ্ঞাসিত প্রশ্নসমূহ'}
            </h2>
            <p className="text-gray-500 mt-4 leading-relaxed text-sm">
              {lang === 'EN'
                ? "Have more questions? Reach out to our team directly and we'll get back to you within 24 hours."
                : 'আরও প্রশ্ন আছে? সরাসরি আমাদের দলের সাথে যোগাযোগ করুন, আমরা ২৪ ঘণ্টার মধ্যে উত্তর দেব।'}
            </p>
            <a
              href="#footer"
              className="inline-block mt-6 bg-[#0A5C36] hover:bg-[#063D24] text-white font-bold px-6 py-3 rounded-xl transition-colors duration-200 text-sm"
            >
              {lang === 'EN' ? 'Contact Us' : 'যোগাযোগ করুন'}
            </a>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {loading && (
              <div className="text-gray-500 text-sm">
                {lang === 'EN' ? 'Loading questions...' : 'প্রশ্ন লোড হচ্ছে...'}
              </div>
            )}

            {!loading && faqs.length === 0 && (
              <div className="text-gray-500 text-sm">
                {lang === 'EN' ? 'No FAQs added yet.' : 'এখনো কোনো FAQ যোগ করা হয়নি।'}
              </div>
            )}

            {!loading &&
              visibleFaqs.map((faq, i) => (
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
                    <span className="font-semibold text-gray-900 text-sm leading-snug">
                      {lang === 'EN' ? faq.question : (faq.questionBn || faq.question)}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#0A5C36] shrink-0 transition-transform duration-300 ${
                        openIndex === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openIndex === i && (
                    <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                      {lang === 'EN' ? faq.answer : (faq.answerBn || faq.answer)}
                    </div>
                  )}
                </div>
              ))}

            {!loading && faqs.length > 3 && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setShowAllFaqs(!showAllFaqs)}
                  className="px-6 py-3 rounded-xl font-bold text-sm border-2 border-[#0A5C36] text-[#0A5C36] hover:bg-[#0A5C36] hover:text-white transition-colors"
                >
                  {showAllFaqs
                    ? (lang === 'EN' ? 'Show Less' : 'কম দেখুন')
                    : (lang === 'EN' ? `See More (\( {faqs.length - 3} more)` : `আরও দেখুন ( \){faqs.length - 3}টি আরও)`)}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
