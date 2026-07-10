'use client'

import Image from 'next/image'
import { useState } from 'react'
import {
  TrendingUp,
  ShieldCheck,
  BadgeCheck,
  Users,
  ArrowRight,
  CircleDollarSign,
  BarChart3,
  Calendar,
  FileText,
  CheckCircle2,
} from 'lucide-react'

const plans = [
  {
    id: 'starter',
    name: 'Starter Unit',
    nameBn: 'স্টার্টার ইউনিট',
    units: '1 Unit',
    price: '৳ 50,000',
    annualReturn: '৳ 7,500',
    returnPct: '15%',
    tenure: '3 Years',
    tenureBn: '৩ বছর',
    badge: null,
    features: [
      { en: 'Shariah-Certified Investment', bn: 'শরিয়াহ সনদপ্রাপ্ত বিনিয়োগ' },
      { en: 'Annual Profit Distribution', bn: 'বার্ষিক মুনাফা বিতরণ' },
      { en: 'Farm Visit — 1x/year', bn: 'খামার পরিদর্শন — বছরে ১ বার' },
      { en: 'Digital Investor Dashboard', bn: 'ডিজিটাল বিনিয়োগকারী ড্যাশবোর্ড' },
    ],
    bg: 'bg-white',
    border: 'border-gray-200',
    btnClass: 'bg-[#0A5C36] hover:bg-[#063D24] text-white',
  },
  {
    id: 'growth',
    name: 'Growth Pack',
    nameBn: 'গ্রোথ প্যাক',
    units: '5 Units',
    price: '৳ 2,50,000',
    annualReturn: '৳ 42,500',
    returnPct: '17%',
    tenure: '5 Years',
    tenureBn: '৫ বছর',
    badge: 'Most Popular / সবচেয়ে জনপ্রিয়',
    features: [
      { en: 'All Starter benefits', bn: 'স্টার্টারের সব সুবিধা' },
      { en: 'Priority Eco Resort Booking', bn: 'প্রিয়রিটি ইকো রিসোর্ট বুকিং' },
      { en: 'Farm Visit — 3x/year', bn: 'খামার পরিদর্শন — বছরে ৩ বার' },
      { en: 'Quarterly Profit Reports', bn: 'ত্রৈমাসিক মুনাফা রিপোর্ট' },
      { en: 'Dedicated Relationship Manager', bn: 'ডেডিকেটেড রিলেশনশিপ ম্যানেজার' },
    ],
    bg: 'bg-[#0A5C36]',
    border: 'border-[#0A5C36]',
    btnClass: 'bg-[#F26522] hover:bg-[#d4551a] text-white',
    textInvert: true,
  },
  {
    id: 'premium',
    name: 'Premium Partner',
    nameBn: 'প্রিমিয়াম পার্টনার',
    units: '10+ Units',
    price: '৳ 5,00,000+',
    annualReturn: '৳ 95,000+',
    returnPct: '19%+',
    tenure: '7 Years',
    tenureBn: '৭ বছর',
    badge: null,
    features: [
      { en: 'All Growth Pack benefits', bn: 'গ্রোথ প্যাকের সব সুবিধা' },
      { en: 'Free Qurbani Cattle Booking', bn: 'বিনামূল্যে কোরবানির পশু বুকিং' },
      { en: 'Monthly Profit Reports', bn: 'মাসিক মুনাফা রিপোর্ট' },
      { en: 'Board Meeting Invitation', bn: 'বোর্ড মিটিং আমন্ত্রণ' },
      { en: 'Name on Investor Wall', bn: 'বিনিয়োগকারী দেয়ালে নাম' },
      { en: 'Complimentary Resort Stay', bn: 'বিনামূল্যে রিসোর্ট থাকা' },
    ],
    bg: 'bg-white',
    border: 'border-gray-200',
    btnClass: 'bg-[#0A5C36] hover:bg-[#063D24] text-white',
  },
]

const steps = [
  {
    num: '01',
    en: 'Register Online',
    bn: 'অনলাইনে নিবন্ধন করুন',
    desc: 'Fill out our secure investor registration form with your NID details.',
    descBn: 'আপনার এনআইডি তথ্য দিয়ে নিরাপদ বিনিয়োগকারী নিবন্ধন ফর্ম পূরণ করুন।',
  },
  {
    num: '02',
    en: 'Choose Your Plan',
    bn: 'আপনার প্ল্যান বেছে নিন',
    desc: 'Select the investment tier that matches your goal and budget.',
    descBn: 'আপনার লক্ষ্য ও বাজেট অনুযায়ী বিনিয়োগ স্তর বেছে নিন।',
  },
  {
    num: '03',
    en: 'Sign Agreement',
    bn: 'চুক্তিতে স্বাক্ষর করুন',
    desc: 'Receive and sign the Shariah-compliant Musharakah investor agreement.',
    descBn: 'শরিয়াহ-সম্মত মুশারাকা বিনিয়োগকারী চুক্তি গ্রহণ ও স্বাক্ষর করুন।',
  },
  {
    num: '04',
    en: 'Make Payment',
    bn: 'পেমেন্ট করুন',
    desc: 'Transfer funds via bKash, Nagad, bank transfer, or our payment portal.',
    descBn: 'বিকাশ, নগদ, ব্যাংক ট্রান্সফার বা আমাদের পেমেন্ট পোর্টালে পেমেন্ট করুন।',
  },
  {
    num: '05',
    en: 'Earn Halal Returns',
    bn: 'হালাল মুনাফা অর্জন করুন',
    desc: 'Receive your annual profit share directly to your bank account.',
    descBn: 'আপনার বার্ষিক মুনাফা সরাসরি ব্যাংক অ্যাকাউন্টে পান।',
  },
]

export default function InvestorSection() {
  const [amount, setAmount] = useState(50000)
  const [tenure, setTenure] = useState(3)

  const rate = amount >= 500000 ? 0.19 : amount >= 250000 ? 0.17 : 0.15
  const annual = Math.round(amount * rate)
  const total = Math.round(amount * rate * tenure)
  const totalWithPrincipal = amount + total

  return (
    <section id="invest" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
            Smart Investment / স্মার্ট বিনিয়োগ
          </p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 text-balance mb-4">
            Invest Smart.{' '}
            <span className="text-[#0A5C36]">Earn Halal.</span>
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
            Join 500+ investors in Bangladesh&apos;s most transparent Shariah-compliant agro-investment platform.
          </p>
          <p className="text-[#0A5C36] text-sm mt-1 font-medium">
            বাংলাদেশের সবচেয়ে স্বচ্ছ শরিয়াহ-সম্মত কৃষি বিনিয়োগ প্ল্যাটফর্মে ৫০০+ বিনিয়োগকারীর সাথে যোগ দিন।
          </p>
        </div>

        {/* Trust Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: ShieldCheck, en: 'Shariah Certified', bn: 'শরিয়াহ সনদপ্রাপ্ত', val: '100%' },
            { icon: Users, en: 'Active Investors', bn: 'সক্রিয় বিনিয়োগকারী', val: '500+' },
            { icon: TrendingUp, en: 'Annual Returns', bn: 'বার্ষিক রিটার্ন', val: '15–19%' },
            { icon: BadgeCheck, en: 'Govt. Registered', bn: 'সরকারি নিবন্ধিত', val: 'RJSC' },
          ].map(({ icon: Icon, en, bn, val }) => (
            <div
              key={en}
              className="bg-[#F7F4EE] rounded-2xl p-5 flex flex-col items-center text-center gap-2 border border-gray-100 hover:border-[#0A5C36]/30 hover:shadow-md transition-all duration-200"
            >
              <div className="w-11 h-11 bg-[#0A5C36] rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-extrabold text-[#0A5C36]">{val}</p>
              <p className="font-bold text-gray-800 text-sm">{en}</p>
              <p className="text-gray-500 text-xs">{bn}</p>
            </div>
          ))}
        </div>

        {/* Investment Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 ${plan.border} ${plan.bg} overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-xl`}
            >
              {plan.badge && (
                <div className="absolute top-4 right-4 bg-[#F26522] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}
              <div className={`p-7 flex flex-col flex-1 ${plan.textInvert ? 'text-white' : ''}`}>
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${plan.textInvert ? 'text-white/60' : 'text-[#F26522]'}`}>
                  {plan.units}
                </p>
                <h3 className={`text-2xl font-extrabold mb-0.5 ${plan.textInvert ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.textInvert ? 'text-white/70' : 'text-gray-500'}`}>{plan.nameBn}</p>

                <div className={`rounded-xl p-4 mb-6 ${plan.textInvert ? 'bg-white/10' : 'bg-[#F7F4EE]'}`}>
                  <p className={`text-3xl font-extrabold ${plan.textInvert ? 'text-white' : 'text-[#0A5C36]'}`}>
                    {plan.price}
                  </p>
                  <p className={`text-xs mt-1 ${plan.textInvert ? 'text-white/60' : 'text-gray-500'}`}>
                    Minimum Investment / ন্যূনতম বিনিয়োগ
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div>
                      <p className={`text-lg font-extrabold ${plan.textInvert ? 'text-[#F26522]' : 'text-[#F26522]'}`}>
                        {plan.returnPct} / yr
                      </p>
                      <p className={`text-xs ${plan.textInvert ? 'text-white/60' : 'text-gray-500'}`}>Annual Return</p>
                    </div>
                    <div className={`w-px h-10 ${plan.textInvert ? 'bg-white/20' : 'bg-gray-300'}`} />
                    <div>
                      <p className={`text-lg font-extrabold ${plan.textInvert ? 'text-white' : 'text-gray-800'}`}>
                        {plan.tenure}
                      </p>
                      <p className={`text-xs ${plan.textInvert ? 'text-white/60' : 'text-gray-500'}`}>{plan.tenureBn}</p>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.en} className="flex items-start gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.textInvert ? 'text-[#F26522]' : 'text-[#0A5C36]'}`} />
                      <div>
                        <span className={`text-sm font-medium ${plan.textInvert ? 'text-white' : 'text-gray-800'}`}>
                          {f.en}
                        </span>
                        <span className={`text-xs block ${plan.textInvert ? 'text-white/60' : 'text-gray-500'}`}>
                          {f.bn}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <a
                  href="#footer"
                  className={`w-full py-3.5 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-colors duration-200 ${plan.btnClass}`}
                >
                  Invest Now / বিনিয়োগ করুন
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ROI Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-20">
          {/* Left: calculator */}
          <div className="bg-[#F7F4EE] rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0A5C36] rounded-xl flex items-center justify-center">
                <CircleDollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">ROI Calculator</h3>
                <p className="text-gray-500 text-sm">বিনিয়োগ রিটার্ন ক্যালকুলেটর</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Investment Amount (৳) / বিনিয়োগের পরিমাণ
                </label>
                <input
                  type="range"
                  min={50000}
                  max={1000000}
                  step={50000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0A5C36]"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>৳ 50,000</span>
                  <span className="font-extrabold text-[#0A5C36] text-base">
                    ৳ {amount.toLocaleString('en-IN')}
                  </span>
                  <span>৳ 10,00,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tenure (Years) / মেয়াদ (বছর)
                </label>
                <div className="flex gap-2">
                  {[3, 5, 7].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setTenure(yr)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                        tenure === yr
                          ? 'bg-[#0A5C36] text-white shadow-md'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-[#0A5C36]'
                      }`}
                    >
                      {yr} Yrs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: 'Annual Profit / বার্ষিক মুনাফা', value: `৳ ${annual.toLocaleString('en-IN')}`, highlight: false },
                { label: 'Total Profit / মোট মুনাফা', value: `৳ ${total.toLocaleString('en-IN')}`, highlight: true },
                { label: 'Total Payout / মোট প্রাপ্তি', value: `৳ ${totalWithPrincipal.toLocaleString('en-IN')}`, highlight: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl p-3 text-center ${item.highlight ? 'bg-[#0A5C36] text-white' : 'bg-white border border-gray-200'}`}
                >
                  <p className={`text-lg font-extrabold ${item.highlight ? 'text-white' : 'text-[#0A5C36]'}`}>
                    {item.value}
                  </p>
                  <p className={`text-xs mt-1 leading-snug ${item.highlight ? 'text-white/70' : 'text-gray-500'}`}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-4">
              * Returns are projected estimates based on historical performance. Past returns do not guarantee future results. Shariah board-verified.
            </p>
          </div>

          {/* Right: background image + steps */}
          <div className="relative rounded-2xl overflow-hidden min-h-[420px]">
            <Image
              src="/images/investor-bg.png"
              alt="Origin Agro aerial farm view for investors"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#063D24]/75" />
            <div className="relative z-10 p-8 flex flex-col justify-end h-full">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-[#F26522]" />
                <p className="text-[#F26522] font-bold text-xs uppercase tracking-widest">
                  Why Invest / কেন বিনিয়োগ করবেন
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { en: 'Land-backed security', bn: 'জমি দ্বারা সুরক্ষিত' },
                  { en: 'Islamic profit model', bn: 'ইসলামিক মুনাফা মডেল' },
                  { en: 'Transparent reporting', bn: 'স্বচ্ছ প্রতিবেদন' },
                  { en: 'Multiple income streams', bn: 'একাধিক আয়ের উৎস' },
                ].map((item) => (
                  <div key={item.en} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F26522] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-semibold">{item.en}</p>
                      <p className="text-white/60 text-xs">{item.bn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* How to Invest Steps */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
              How to Invest in 5 Steps
            </h3>
            <p className="text-[#0A5C36] font-medium text-sm mt-1">
              ৫টি সহজ ধাপে বিনিয়োগ শুরু করুন
            </p>
          </div>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gray-200 z-0" />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
              {steps.map((step, i) => (
                <div key={step.num} className="flex flex-col items-center text-center gap-3">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-lg shadow-lg shrink-0 ${
                      i === 4 ? 'bg-[#F26522] text-white' : 'bg-[#0A5C36] text-white'
                    }`}
                  >
                    {step.num}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm">{step.en}</p>
                    <p className="text-[#0A5C36] text-xs font-medium">{step.bn}</p>
                    <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <a
              href="#footer"
              className="bg-[#F26522] hover:bg-[#d4551a] text-white font-bold px-10 py-4 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl text-base"
            >
              <FileText className="w-5 h-5" />
              Download Prospectus / প্রসপেক্টাস ডাউনলোড করুন
            </a>
            <a
              href="#footer"
              className="border-2 border-[#0A5C36] text-[#0A5C36] hover:bg-[#0A5C36] hover:text-white font-bold px-10 py-4 rounded-xl flex items-center gap-2 transition-all duration-200 text-base"
            >
              <Calendar className="w-5 h-5" />
              Book a Consultation / পরামর্শ বুক করুন
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
