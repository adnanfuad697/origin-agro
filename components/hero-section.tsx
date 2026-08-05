'use client'

import Image from 'next/image'
import { ShieldCheck, Leaf, Star, Handshake, ShoppingBag, TrendingUp, BookOpen, Tag } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

const badges = [
  { icon: Handshake, en: 'Musharakah Partnership', bn: 'মুশারাকা পার্টনারশিপ' },
  { icon: Leaf, en: 'Organic Farming', bn: 'জৈব কৃষি' },
  { icon: Star, en: 'Shariah-Guided', bn: 'শরিয়াহ-নির্দেশিত' },
  { icon: ShieldCheck, en: 'Transparent Terms', bn: 'স্বচ্ছ শর্তাবলী' },
]

export default function HeroSection() {
  const { lang } = useLanguage()

  return (
    <section className="bg-[#F7F4EE] py-10 sm:py-14 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-5 sm:gap-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-[#0A5C36]/10 text-[#0A5C36] font-semibold text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 bg-[#F26522] rounded-full animate-pulse" />
              {lang === 'EN' ? 'Shariah-Guided Agro Investment' : 'শরিয়াহ-নির্দেশিত কৃষি বিনিয়োগ'}
            </div>

            {lang === 'EN' ? (
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight text-balance">
                Be a Proud Owner of an{' '}
                <span className="text-[#0A5C36]">Integrated Agro Farm</span>
              </h1>
            ) : (
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 leading-tight text-balance">
                সমন্বিত কৃষি খামারের একজন{' '}
                <span className="text-[#0A5C36]">গর্বিত মালিক</span> হোন
              </h1>
            )}

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {lang === 'EN'
                ? 'Organic farming, halah livestock, and Shariah-guided investment — all in one place.'
                : 'জৈব কৃষি, হালাল পশুপালন এবং শরিয়াহ-নির্দেশিত বিনিয়োগ — সব এক জায়গায়।'}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {badges.map((badge) => (
                <div key={badge.en} className="flex items-center gap-1.5">
                  <badge.icon className="w-4 h-4 text-[#0A5C36] shrink-0" />
                  <span className="text-gray-700 text-xs sm:text-sm font-medium">
                    {lang === 'EN' ? badge.en : badge.bn}
                  </span>
                </div>
              ))}
            </div>

            {/* 4 CTAs */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-1">
              <a
                href="/#shop"
                className="bg-[#0A5C36] hover:bg-[#063D24] text-white font-bold px-3 sm:px-5 py-3 sm:py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                {lang === 'EN' ? 'Shop Products' : 'পণ্য কিনুন'}
              </a>
              <a
                href="/#invest"
                className="bg-[#F26522] hover:bg-[#d4551a] text-white font-bold px-3 sm:px-5 py-3 sm:py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                {lang === 'EN' ? 'Invest Now' : 'বিনিয়োগ করুন'}
              </a>
              <a
                href="/offers"
                className="border-2 border-[#F26522] text-[#F26522] hover:bg-[#F26522] hover:text-white font-bold px-3 sm:px-5 py-3 sm:py-3.5 rounded-xl transition-all duration-200 text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <Tag className="w-4 h-4 shrink-0" />
                {lang === 'EN' ? 'Special Offers' : 'বিশেষ অফার'}
              </a>
              <a
                href="/journal"
                className="border-2 border-[#0A5C36] text-[#0A5C36] hover:bg-[#0A5C36] hover:text-white font-bold px-3 sm:px-5 py-3 sm:py-3.5 rounded-xl transition-all duration-200 text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                {lang === 'EN' ? 'Journal' : 'জার্নাল'}
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 sm:gap-8 pt-1">
              {[
                { value: '3', en: 'Core Ventures', bn: 'মূল উদ্যোগ' },
                { value: '100%', en: 'Halal Structure', bn: 'হালাল কাঠামো' },
              ].map((stat) => (
                <div key={stat.en}>
                  <p className="text-xl sm:text-2xl font-extrabold text-[#0A5C36]">{stat.value}</p>
                  <p className="text-gray-600 text-[11px] sm:text-xs font-medium mt-0.5">
                    {lang === 'EN' ? stat.en : stat.bn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Master Plan Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src="/images/hero-masterplan.png"
                alt="Origin Agro 3D agro-village master plan aerial view"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-[#F26522]/10 rounded-full -z-10" />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 sm:w-36 sm:h-36 bg-[#0A5C36]/10 rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
