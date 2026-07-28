'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import TopBar from '@/components/top-bar'
import Navbar from '@/components/navbar'
import MegaFooter from '@/components/mega-footer'
import { useLanguage } from '@/contexts/language-context'
import { Tag, ArrowRight, Gift } from 'lucide-react'

interface Offer {
  id: number
  title: string
  titleBn: string | null
  description: string | null
  descriptionBn: string | null
  image: string | null
  discountLabel: string | null
  linkedCategory: string | null
  validUntil: string | null
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function OffersPage() {
  const { lang } = useLanguage()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOffers() {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('special_offers')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (!error && data) {
        const active = data.filter((o: any) => !o.valid_until || o.valid_until >= today)
        setOffers(active.map((o: any) => ({
          id: o.id,
          title: o.title,
          titleBn: o.title_bn,
          description: o.description,
          descriptionBn: o.description_bn,
          image: o.image,
          discountLabel: o.discount_label,
          linkedCategory: o.linked_product_category,
          validUntil: o.valid_until,
        })))
      }
      setLoading(false)
    }
    fetchOffers()
  }, [])

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="bg-[#F7F4EE] py-14 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
              {lang === 'EN' ? 'Deals & Promotions' : 'ডিল ও অফার'}
            </p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
              {lang === 'EN' ? 'Special Offers' : 'বিশেষ অফার'}
            </h1>
          </div>

          {loading && <div className="text-center py-16 text-gray-500">{lang === 'EN' ? 'Loading offers...' : 'লোড হচ্ছে...'}</div>}

          {!loading && offers.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto">
              <Gift className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <h2 className="font-extrabold text-gray-900 text-lg mb-2">
                {lang === 'EN' ? 'No Active Offers Right Now' : 'বর্তমানে কোনো অফার নেই'}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {lang === 'EN'
                  ? "We don't run promotions all the time, but great deals come around often — check back soon, or explore our full range in the meantime."
                  : 'আমরা সবসময় অফার দিই না, তবে শীঘ্রই ভালো অফার আসতে পারে — আমাদের সব পণ্য দেখুন।'}
              </p>
              <a href="/#shop" className="inline-flex items-center gap-2 bg-[#0A5C36] hover:bg-[#063D24] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
                {lang === 'EN' ? 'Browse Shop' : 'শপ দেখুন'}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}

          {!loading && offers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 bg-gray-100">
                    <Image src={offer.image || '/placeholder.jpg'} alt={offer.title} fill className="object-cover" />
                    {offer.discountLabel && (
                      <span className="absolute top-3 left-3 bg-[#F26522] text-white text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        {offer.discountLabel}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-extrabold text-gray-900 text-lg mb-1">{lang === 'EN' ? offer.title : (offer.titleBn || offer.title)}</h3>
                    {(offer.description || offer.descriptionBn) && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">{lang === 'EN' ? offer.description : (offer.descriptionBn || offer.description)}</p>
                    )}
                    {offer.validUntil && (
                      <p className="text-xs text-gray-400 mb-3">{lang === 'EN' ? 'Valid until' : 'মেয়াদ'} {formatDate(offer.validUntil)}</p>
                    )}
                    <a href={offer.linkedCategory ? `/?category=${encodeURIComponent(offer.linkedCategory)}#shop` : '/#shop'} className="inline-flex items-center gap-1.5 text-[#0A5C36] font-bold text-sm hover:underline">
                      {lang === 'EN' ? 'Shop This Offer' : 'এখনই কিনুন'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <MegaFooter />
    </main>
  )
}
