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
    en: 'Choose Your Plan',
    bn: 'প্ল্যান বেছে নিন',
    desc: 'Select a Musharakah investment plan that matches your budget and goal.',
    descBn: 'আপনার বাজেট ও লক্ষ্য অনুযায়ী একটি মুশারাকা বিনিয়োগ প্ল্যান বেছে নিন।',
  },
  {
    num: '02',
    en: 'Pick Online or Office',
    bn: 'অনলাইন বা অফিস বেছে নিন',
    desc: 'Apply online with the digital form, or book an appointment to visit our office.',
    descBn: 'ডিজিটাল ফর্ম দিয়ে অনলাইনে আবেদন করুন, অথবা অফিসে এসে দেখা করার জন্য অ্যাপয়েন্টমেন্ট বুক করুন।',
  },
  {
    num: '03',
    en: 'Submit Details / Meet Team',
    bn: 'তথ্য জমা দিন / টিমের সাথে দেখা করুন',
    desc: 'Complete the secure investor form (NID & details), or meet our team in person.',
    descBn: 'নিরাপদ বিনিয়োগকারী ফর্ম পূরণ করুন (এনআইডি ও তথ্য), অথবা সরাসরি আমাদের টিমের সাথে দেখা করুন।',
  },
  {
    num: '04',
    en: 'Sign Agreement & Pay',
    bn: 'চুক্তি স্বাক্ষর ও পেমেন্ট',
    desc: 'Sign the Shariah-compliant Musharakah agreement, then pay via bKash, Nagad, or bank.',
    descBn: 'শরিয়াহ-সম্মত মুশারাকা চুক্তি স্বাক্ষর করুন, তারপর বিকাশ, নগদ বা ব্যাংকের মাধ্যমে পেমেন্ট করুন।',
  },
  {
    num: '05',
    en: 'Receive Profit Share',
    bn: 'মুনাফার অংশ পান',
    desc: 'Get your profit share from real business results, as per the agreed Musharakah ratio.',
    descBn: 'চুক্তিকৃত মুশারাকা অনুপাত অনুযায়ী প্রকৃত ব্যবসায়িক মুনাফা থেকে আপনার অংশ পান।',
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
          if (mapped[0].minAmount) setAmount(mapped[0].minAmount)
        }
      }
      setPlansLoading(false)
    }
    fetchPlans()
  }, [])

  const selectedPlan = plans.find((p) => p.planKey === selectedPlanKey) || plans[0]
  const minAmount = selectedPlan?.minAmount || 50000
  const illustrativeRate = selectedPlan?.illustrativeProfitRate ?? 0
  const investorSharePct = selectedPlan?.investorSharePct ?? 0
  const companySharePct = selectedPlan?.companySharePct ?? 0

  const estimatedBusinessProfit = Math.round(amount * (illustrativeRate / 100))
  const estimatedInvestorShare = Math.round(estimatedBusinessProfit * (investorSharePct / 100))
  const estimatedCompanyShare = Math.round(estimatedBusinessProfit * (companySharePct / 100))
  const estimatedTotalPayout = amount + estimatedInvestorShare

  function handleSelectPlan(planKey: string) {
    setSelectedPlanKey(planKey)
    const plan = plans.find((p) => p.planKey === planKey)
    if (plan?.minAmount && amount < plan.minAmount) {
      setAmount(plan.minAmount)
    }
  }

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

        {/* Trust Badges */}
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

        {/* Illustrative Profit Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-20">
          <div className="bg-[#F7F4EE] rounded-2xl p-6 sm:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0A5C36] rounded-xl flex items-center justify-center">
                <CircleDollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">
                  {lang === 'EN' ? 'Illustrative Profit Calculator' : 'উদাহরণমূলক মুনাফা ক্যালকুলেটর'}
                </h3>
                <p className="text-xs text-gray-500">
                  {lang === 'EN' ? 'Based on Musharakah profit-sharing' : 'মুশারাকা মুনাফা ভাগাভাগির ভিত্তিতে'}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {lang === 'EN' ? 'Select Plan' : 'প্ল্যান বেছে নিন'}
                </label>
                <div className="flex flex-col gap-2">
                  {plans.map((plan) => (
                    <button
                      key={plan.planKey}
                      onClick={() => handleSelectPlan(plan.planKey)}
                      className={
                        'py-2.5 px-3 rounded-xl font-bold text-sm text-left transition-all duration-200 ' +
                        (selectedPlanKey === plan.planKey
                          ? 'bg-[#0A5C36] text-white shadow-md'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-[#0A5C36]')
                      }
                    >
                      {(lang === 'EN' ? plan.name : (plan.nameBn || plan.name)) +
                        ' — ' +
                        (lang === 'EN' ? plan.tenure : (plan.tenureBn || plan.tenure)) +
                        ' | ' +
                        plan.companySharePct +
                        ':' +
                        plan.investorSharePct}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {lang === 'EN' ? 'Investment Amount (৳)' : 'বিনিয়োগের পরিমাণ (৳)'}
                </label>
                <input
                  type="range"
                  min={minAmount}
                  max={1000000}
                  step={10000}
                  value={amount < minAmount ? minAmount : amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0A5C36]"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>৳ {minAmount.toLocaleString('en-IN')}</span>
                  <span className="font-extrabold text-[#0A5C36] text-base">
                    ৳ {amount.toLocaleString('en-IN')}
                  </span>
                  <span>৳ 10,00,000</span>
                </div>
              </div>

              {selectedPlan && (
                <div className="bg-white rounded-xl p-3 border border-gray-200 text-xs text-gray-600 space-y-1">
                  <p>
                    <span className="font-bold text-gray-800">
                      {lang === 'EN' ? 'Plan:' : 'প্ল্যান:'}
                    </span>{' '}
                    {lang === 'EN' ? selectedPlan.name : (selectedPlan.nameBn || selectedPlan.name)}
                  </p>
                  <p>
                    <span className="font-bold text-gray-800">
                      {lang === 'EN' ? 'Illustrative profit rate:' : 'উদাহরণমূলক মুনাফার হার:'}
                    </span>{' '}
                    {illustrativeRate}%
                  </p>
                  <p>
                    <span className="font-bold text-gray-800">
                      {lang === 'EN' ? 'Profit split (Company:Investor):' : 'মুনাফা ভাগ (কোম্পানি:বিনিয়োগকারী):'}
                    </span>{' '}
                    {companySharePct}:{investorSharePct}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3 text-center bg-white border border-gray-200">
                <p className="text-lg font-extrabold text-[#0A5C36]">
                  ৳ {estimatedBusinessProfit.toLocaleString('en-IN')}
                </p>
                <p className="text-xs mt-1 text-gray-500 leading-snug">
                  {lang === 'EN' ? 'Est. Business Profit' : 'আনুমানিক ব্যবসায়িক মুনাফা'}
                </p>
              </div>

              <div className="rounded-xl p-3 text-center bg-[#0A5C36] text-white">
                <p className="text-lg font-extrabold text-white">
                  ৳ {estimatedInvestorShare.toLocaleString('en-IN')}
                </p>
                <p className="text-xs mt-1 text-white/70 leading-snug">
                  {lang === 'EN' ? 'Your Profit Share' : 'আপনার মুনাফার অংশ'}
                </p>
              </div>

              <div className="rounded-xl p-3 text-center bg-white border border-gray-200">
                <p className="text-lg font-extrabold text-gray-700">
                  ৳ {estimatedCompanyShare.toLocaleString('en-IN')}
                </p>
                <p className="text-xs mt-1 text-gray-500 leading-snug">
                  {lang === 'EN' ? 'Company Profit Share' : 'কোম্পানির মুনাফার অংশ'}
                </p>
              </div>

              <div className="rounded-xl p-3 text-center bg-white border border-gray-200">
                <p className="text-lg font-extrabold text-[#F26522]">
                  ৳ {estimatedTotalPayout.toLocaleString('en-IN')}
                </p>
                <p className="text-xs mt-1 text-gray-500 leading-snug">
                  {lang === 'EN' ? 'Est. Total Payout' : 'আনুমানিক মোট প্রাপ্তি'}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              {lang === 'EN'
                ? '* Illustrative estimate only — not a guaranteed or fixed return. Under Musharakah, actual profit depends on real business results. In case of genuine loss, capital is reduced proportionally according to investment share.'
                : '* শুধুমাত্র উদাহরণমূলক অনুমান — নিশ্চিত বা নির্দিষ্ট রিটার্ন নয়। মুশারাকা অনুযায়ী প্রকৃত মুনাফা ব্যবসায়িক ফলাফলের উপর নির্ভর করে। প্রকৃত লোকসানে মূলধন বিনিয়োগের অংশ অনুসারে সমানুপাতিকভাবে হ্রাস পায়।'}
            </p>
          </div>

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

        {/* How to Invest - Real Steps (Card Flow) */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
              {lang === 'EN' ? 'How to Invest in 5 Steps' : '৫টি সহজ ধাপে বিনিয়োগ শুরু করুন'}
            </h3>
            <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
              {lang === 'EN'
                ? 'Your real Musharakah journey on Origin Agro — from choosing a plan to receiving profit share.'
                : 'অরিজিন অ্যাগ্রোতে আপনার প্রকৃত মুশারাকা যাত্রা — প্ল্যান বেছে নেওয়া থেকে মুনাফার অংশ পাওয়া পর্যন্ত।'}
            </p>
          </div>

          {/* Mobile vertical flow */}
          <div className="flex flex-col gap-4 lg:hidden">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                <div className="bg-[#F7F4EE] border border-gray-100 rounded-2xl p-5 flex gap-4 items-start">
                  <div
                    className={
                      'w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-base shrink-0 ' +
                      (i === 4 ? 'bg-[#F26522] text-white' : 'bg-[#0A5C36] text-white')
                    }
                  >
                    {step.num}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm">
                      {lang === 'EN' ? step.en : step.bn}
                    </p>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                      {lang === 'EN' ? step.desc : step.descBn}
                    </p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="w-0.5 h-4 bg-[#0A5C36]/30" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop horizontal flow cards */}
          <div className="hidden lg:grid grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                <div className="bg-[#F7F4EE] border border-gray-100 rounded-2xl p-5 h-full flex flex-col hover:shadow-md transition-shadow">
                  <div
                    className={
                      'w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-base mb-4 ' +
                      (i === 4 ? 'bg-[#F26522] text-white' : 'bg-[#0A5C36] text-white')
                    }
                  >
                    {step.num}
                  </div>
                  <p className="font-extrabold text-gray-900 text-sm mb-2">
                    {lang === 'EN' ? step.en : step.bn}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed flex-1">
                    {lang === 'EN' ? step.desc : step.descBn}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-3 z-10 -translate-y-1/2">
                    <div className="w-6 h-6 rounded-full bg-white border border-[#0A5C36]/20 flex items-center justify-center shadow-sm">
                      <ArrowRight className="w-3.5 h-3.5 text-[#0A5C36]" />
                    </div>
                  </div>
                )}
              </div>
            ))}
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
