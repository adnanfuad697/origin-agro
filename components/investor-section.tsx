'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/language-context'
import AppointmentForm from '@/components/appointment-form'
import KycForm from '@/components/kyc-form'
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

interface InvestmentPlan {
  id: number
  planKey: string
  name: string
  nameBn: string | null
  description: string | null
  descriptionBn: string | null
  tenure: string | null
  tenureBn: string | null
  minAmount: number | null
  companySharePct: number | null
  investorSharePct: number | null
  illustrativeProfitRate: number | null
}

export default function InvestorSection() {
  const { lang } = useLanguage()
  const [amount, setAmount] = useState(50000)
  const [selectedPlanKey, setSelectedPlanKey] = useState('')
  const [chosenPlanKey, setChosenPlanKey] = useState('')
  const [investMethod, setInvestMethod] = useState<'online' | 'physical' | null>(null)
  const [plans, setPlans] = useState<InvestmentPlan[]>([])
  const [plansLoading, setPlansLoading] = useState(true)

  useEffect(() => {
    async function fetchPlans() {
      setPlansLoading(true)
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Error fetching investment plans:', error)
      } else if (data) {
        const mapped: InvestmentPlan[] = data.map((row: any) => ({
          id: row.id,
          planKey: row.plan_key,
          name: row.name,
          nameBn: row.name_bn,
          description: row.description,
          descriptionBn: row.description_bn,
          tenure: row.tenure,
          tenureBn: row.tenure_bn,
          minAmount: row.min_amount ? Number(row.min_amount) : null,
          companySharePct: row.company_share_pct ? Number(row.company_share_pct) : null,
          investorSharePct: row.investor_share_pct ? Number(row.investor_share_pct) : null,
          illustrativeProfitRate: row.illustrative_profit_rate ? Number(row.illustrative_profit_rate) : null,
        }))
        setPlans(mapped)
        if (mapped.length > 0) {
          setSelectedPlanKey(mapped[0].planKey)
          setChosenPlanKey(mapped[0].planKey)
        }
      }
      setPlansLoading(false)
    }
    fetchPlans()
  }, [])

  const selectedPlan = plans.find((p) => p.planKey === selectedPlanKey) || plans[0]
  const illustrativeRate = selectedPlan?.illustrativeProfitRate ?? 0
  const investorSharePct = selectedPlan?.investorSharePct ?? 0
  const estimatedBusinessProfit = Math.round(amount * (illustrativeRate / 100))
  const estimatedInvestorShare = Math.round(estimatedBusinessProfit * (investorSharePct / 100))
  const estimatedTotalPayout = amount + estimatedInvestorShare

  return (
    <section id="invest" className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
            {lang === 'EN' ? 'Smart Investment' : 'স্মার্ট বিনিয়োগ'}
          </p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 text-balance mb-4">
            {lang === 'EN' ? (
              <>Invest Smart. <span className="text-[#0A5C36]">Earn Halal.</span></>
            ) : (
              <>স্মার্ট বিনিয়োগ করুন। <span className="text-[#0A5C36]">হালাল মুনাফা অর্জন করুন।</span></>
            )}
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
            {lang === 'EN'
              ? "Join Bangladesh's transparent, Shariah-guided agro-investment partnership model."
              : 'বাংলাদেশের একটি স্বচ্ছ, শরিয়াহ-নির্দেশিত কৃষি বিনিয়োগ পার্টনারশিপ মডেলে যোগ দিন।'}
          </p>
        </div>

        {/* Trust Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: ShieldCheck, en: 'Shariah-Guided Model', bn: 'শরিয়াহ-নির্দেশিত মডেল', val: 'Musharakah' },
            { icon: Users, en: 'Investment Model', bn: 'বিনিয়োগ মডেল', val: 'Partnership' },
            { icon: TrendingUp, en: 'Profit Structure', bn: 'মুনাফা কাঠামো', val: 'Profit & Loss Share' },
            { icon: BadgeCheck, en: 'Transparent Terms', bn: 'স্বচ্ছ শর্তাবলী', val: '100%' },
          ].map(({ icon: Icon, en, bn, val }) => (
            <div key={en} className="bg-[#F7F4EE] rounded-2xl p-5 flex flex-col items-center text-center gap-2 border border-gray-100 hover:border-[#0A5C36]/30 hover:shadow-md transition-all duration-200">
              <div className="w-11 h-11 bg-[#0A5C36] rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-extrabold text-[#0A5C36]">{val}</p>
              <p className="font-bold text-gray-800 text-sm">{lang === 'EN' ? en : bn}</p>
            </div>
          ))}
        </div>

        {/* Investment Plans */}
        {plansLoading && (
          <div className="text-center py-14 text-gray-500 mb-20">
            {lang === 'EN' ? 'Loading investment plans...' : 'বিনিয়োগ প্ল্যান লোড হচ্ছে...'}
          </div>
        )}

        {!plansLoading && plans.length === 0 && (
          <div className="text-center py-14 text-gray-500 mb-20">
            {lang === 'EN' ? 'Investment plans coming soon.' : 'বিনিয়োগ প্ল্যান শীঘ্রই আসছে।'}
          </div>
        )}

        {!plansLoading && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {plans.map((plan) => (
              <div key={plan.id} className="relative rounded-2xl border-2 border-[#0A5C36]/20 bg-white overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-xl">
                <div className="p-7 flex flex-col flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest mb-1 text-[#F26522]">
                    {lang === 'EN' ? 'Musharakah Plan' : 'মুশারাকা প্ল্যান'}
                  </p>
                  <h3 className="text-2xl font-extrabold mb-2 text-gray-900">
                    {lang === 'EN' ? plan.name : (plan.nameBn || plan.name)}
                  </h3>

                  {(plan.description || plan.descriptionBn) && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-5">
                      {lang === 'EN' ? plan.description : (plan.descriptionBn || plan.description)}
                    </p>
                  )}

                  <div className="rounded-xl p-4 mb-6 bg-[#F7F4EE]">
                    {plan.minAmount && (
                      <>
                        <p className="text-3xl font-extrabold text-[#0A5C36]">৳ {plan.minAmount.toLocaleString('en-IN')}+</p>
                        <p className="text-xs mt-1 text-gray-500">
                          {lang === 'EN' ? 'Minimum Investment' : 'ন্যূনতম বিনিয়োগ'}
                        </p>
                      </>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <div>
                        <p className="text-lg font-extrabold text-[#F26522]">
                          {lang === 'EN' ? plan.tenure : (plan.tenureBn || plan.tenure)}
                        </p>
                      </div>
                      <div className="w-px h-10 bg-gray-300" />
                      <div>
                        <p className="text-lg font-extrabold text-gray-800">{plan.companySharePct}:{plan.investorSharePct}</p>
                        <p className="text-xs text-gray-500">
                          {lang === 'EN' ? 'Company : Investor Profit Split' : 'কোম্পানি : বিনিয়োগকারী মুনাফা ভাগ'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      {lang === 'EN'
                        ? 'This is a profit-and-loss sharing Musharakah partnership, not a fixed deposit. Both Origin Agro and the investor contribute capital, and in the event of a genuine business loss, capital is reduced proportionally between both parties based on their share of investment.'
                        : 'এটি একটি মুনাফা-লোকসান ভাগাভাগি মুশারাকা অংশীদারিত্ব, নির্দিষ্ট আমানত নয়। অরিজিন অ্যাগ্রো এবং বিনিয়োগকারী উভয়েই মূলধন অবদান রাখে, এবং প্রকৃত ব্যবসায়িক লোকসানের ক্ষেত্রে উভয় পক্ষের বিনিয়োগের অংশ অনুসারে মূলধন সমানুপাতিকভাবে হ্রাস পায়।'}
                    </p>
                  </div>

                  <a
                    href="#invest-method"
                    onClick={() => setChosenPlanKey(plan.planKey)}
                    className="w-full py-3.5 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-colors duration-200 bg-[#0A5C36] hover:bg-[#063D24] text-white mt-auto"
                  >
                    {lang === 'EN' ? 'Choose This Plan' : 'এই প্ল্যান বেছে নিন'}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Choose Investment Method */}
        {!plansLoading && plans.length > 0 && (
          <div id="invest-method" className="mb-20 scroll-mt-24">
            <div className="text-center mb-8">
              <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                {lang === 'EN' ? 'Choose Your Investment Method' : 'আপনার বিনিয়োগ পদ্ধতি বেছে নিন'}
              </h3>
              <p className="text-gray-500 text-sm mt-3">
                {lang === 'EN' ? 'Selected Plan:' : 'নির্বাচিত প্ল্যান:'}{' '}
                <span className="font-bold text-gray-800">
                  {lang === 'EN'
                    ? (plans.find((p) => p.planKey === chosenPlanKey)?.name || plans[0]?.name)
                    : (plans.find((p) => p.planKey === chosenPlanKey)?.nameBn || plans.find((p) => p.planKey === chosenPlanKey)?.name || plans[0]?.name)}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <button
                onClick={() => setInvestMethod('online')}
                className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 ${investMethod === 'online' ? 'border-[#0A5C36] bg-[#F7F4EE] shadow-md' : 'border-gray-200 bg-white hover:border-[#0A5C36]/40'}`}
              >
                <div className="w-12 h-12 bg-[#0A5C36] rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-extrabold text-gray-900 text-lg mb-1">
                  {lang === 'EN' ? 'Online' : 'অনলাইন'}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {lang === 'EN'
                    ? 'Fill out a secure digital application form now. Best for smaller amounts and quick processing.'
                    : 'এখনই একটি নিরাপদ ডিজিটাল আবেদন ফর্ম পূরণ করুন। ছোট অঙ্কের এবং দ্রুত প্রক্রিয়াকরণের জন্য সেরা।'}
                </p>
              </button>

              <button
                onClick={() => setInvestMethod('physical')}
                className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 ${investMethod === 'physical' ? 'border-[#0A5C36] bg-[#F7F4EE] shadow-md' : 'border-gray-200 bg-white hover:border-[#0A5C36]/40'}`}
              >
                <div className="w-12 h-12 bg-[#F26522] rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-extrabold text-gray-900 text-lg mb-1">
                  {lang === 'EN' ? 'Physical / Office Visit' : 'সরাসরি অফিসে আসুন'}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {lang === 'EN'
                    ? 'Book an appointment to visit our office, meet our team, and sign your agreement in person.'
                    : 'আমাদের অফিসে এসে আমাদের টিমের সাথে দেখা করুন এবং ব্যক্তিগতভাবে চুক্তি স্বাক্ষর করুন।'}
                </p>
              </button>
            </div>

            {investMethod === 'online' && (
              <KycForm planKey={chosenPlanKey || plans[0]?.planKey || ''} />
            )}

            {investMethod === 'physical' && (
              <AppointmentForm planInterest={chosenPlanKey || plans[0]?.planKey || ''} />
            )}
          </div>
        )}

        {/* ROI Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-20">
          {/* Left: calculator */}
          <div className="bg-[#F7F4EE] rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0A5C36] rounded-xl flex items-center justify-center">
                <CircleDollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">
                  {lang === 'EN' ? 'ROI Calculator' : 'বিনিয়োগ রিটার্ন ক্যালকুলেটর'}
                </h3>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {lang === 'EN' ? 'Investment Amount (৳)' : 'বিনিয়োগের পরিমাণ (৳)'}
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
                  {lang === 'EN' ? 'Choose Plan' : 'প্ল্যান বেছে নিন'}
                </label>
                <div className="flex flex-col gap-2">
                  {plans.map((plan) => (
                    <button
                      key={plan.planKey}
                      onClick={() => setSelectedPlanKey(plan.planKey)}
                      className={`py-2.5 px-3 rounded-xl font-bold text-sm text-left transition-all duration-200 ${
                        selectedPlanKey === plan.planKey
                          ? 'bg-[#0A5C36] text-white shadow-md'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-[#0A5C36]'
                      }`}
                    >
                      {lang === 'EN' ? plan.name : (plan.nameBn || plan.name)} — {lang === 'EN' ? plan.tenure : (plan.tenureBn || plan.tenure)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                {
                  label: lang === 'EN' ? 'Est. Business Profit' : 'আনুমানিক ব্যবসায়িক মুনাফা',
                  value: `৳ ${estimatedBusinessProfit.toLocaleString('en-IN')}`,
                  highlight: false,
                },
                {
                  label: lang === 'EN' ? 'Your Est. Share' : 'আপনার আনুমানিক অংশ',
                  value: `৳ ${estimatedInvestorShare.toLocaleString('en-IN')}`,
                  highlight: true,
                },
                {
                  label: lang === 'EN' ? 'Est. Total Payout' : 'আনুমানিক মোট প্রাপ্তি',
                  value: `৳ ${estimatedTotalPayout.toLocaleString('en-IN')}`,
                  highlight: false,
                },
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
              {lang === 'EN'
                ? '* This is an illustrative estimate only, based on an assumed business profit scenario — it is NOT a guaranteed or fixed return. Under the Musharakah agreement, your actual profit share depends entirely on the real business outcome of that cycle, and your capital may reduce proportionally in the event of a genuine loss.'
                : '* এটি শুধুমাত্র একটি উদাহরণমূলক অনুমান, অনুমানিত ব্যবসায়িক মুনাফার উপর ভিত্তি করে — এটি কোনো নিশ্চিত বা নির্দিষ্ট রিটার্ন নয়। মুশারাকা চুক্তি অনুযায়ী, আপনার প্রকৃত মুনাফার অংশ সেই চক্রের প্রকৃত ব্যবসায়িক ফলাফলের উপর নির্ভর করে, এবং প্রকৃত লোকসানের ক্ষেত্রে আপনার মূলধন সমানুপাতিকভাবে হ্রাস পেতে পারে।'}
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
                  {lang === 'EN' ? 'Why Invest' : 'কেন বিনিয়োগ করবেন'}
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
                    <p className="text-white text-sm font-semibold">{lang === 'EN' ? item.en : item.bn}</p>
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
              {lang === 'EN' ? 'How to Invest in 5 Steps' : '৫টি সহজ ধাপে বিনিয়োগ শুরু করুন'}
            </h3>
          </div>
          <div className="relative">
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
                    <p className="font-extrabold text-gray-900 text-sm">
                      {lang === 'EN' ? step.en : step.bn}
                    </p>
                    <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                      {lang === 'EN' ? step.desc : step.descBn}
                    </p>
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
              {lang === 'EN' ? 'Download Prospectus' : 'প্রসপেক্টাস ডাউনলোড করুন'}
            </a>
            <a
              href="#footer"
              className="border-2 border-[#0A5C36] text-[#0A5C36] hover:bg-[#0A5C36] hover:text-white font-bold px-10 py-4 rounded-xl flex items-center gap-2 transition-all duration-200 text-base"
            >
              <Calendar className="w-5 h-5" />
              {lang === 'EN' ? 'Book a Consultation' : 'পরামর্শ বুক করুন'}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
