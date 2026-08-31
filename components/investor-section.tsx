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
  AlertTriangle,
  Clock,
  Scale,
  HandCoins,
} from 'lucide-react'

const steps = [
  {
    num: '01',
    en: 'Choose to Invest',
    bn: 'বিনিয়োগে সম্মত হন',
    desc: 'Review the Musharaka terms, minimum 2-year tenure, and project details.',
    descBn: 'মুশারাকা শর্ত, ন্যূনতম ২ বছরের মেয়াদ ও প্রকল্পের বিবরণ দেখে নিন।',
  },
  {
    num: '02',
    en: 'Apply Online or Visit Office',
    bn: 'অনলাইন বা অফিসে আবেদন',
    desc: 'Submit the secure form online, or book an appointment to meet our team.',
    descBn: 'নিরাপদ ফর্ম অনলাইনে জমা দিন, অথবা টিমের সাথে দেখা করতে অ্যাপয়েন্টমেন্ট বুক করুন।',
  },
  {
    num: '03',
    en: 'Sign Musharaka Agreement',
    bn: 'মুশারাকা চুক্তি স্বাক্ষর',
    desc: 'Sign the Shariah-based Musharaka agreement with agreed capital and profit ratio.',
    descBn: 'সম্মত মূলধন ও মুনাফা অনুপাতসহ শরিয়াহভিত্তিক মুশারাকা চুক্তি স্বাক্ষর করুন।',
  },
  {
    num: '04',
    en: 'Deploy Capital & Get Reports',
    bn: 'মূলধন ব্যবহার ও প্রতিবেদন',
    desc: 'Funds go only to approved farm & food operations. You receive reports every 6 months.',
    descBn: 'অর্থ শুধু অনুমোদিত খামার ও খাদ্য কার্যক্রমে ব্যবহৃত হয়। প্রতি ৬ মাসে প্রতিবেদন পাবেন।',
  },
  {
    num: '05',
    en: 'Profit Share / Settlement',
    bn: 'মুনাফা ভাগ / নিষ্পত্তি',
    desc: 'Profit (if any) is shared per ratio up to 4 times in 2 years. At maturity, settlement by actual results.',
    descBn: 'মুনাফা থাকলে অনুপাত অনুযায়ী ২ বছরে সর্বোচ্চ ৪ বার ভাগ। মেয়াদ শেষে প্রকৃত ফলাফল অনুযায়ী নিষ্পত্তি।',
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
  const [amount, setAmount] = useState(20000)
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
          illustrativeProfitRate: row.illustrative_profit_rate
            ? Number(row.illustrative_profit_rate)
            : null,
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
  const minAmount = selectedPlan?.minAmount || 20000
  const illustrativeRate = selectedPlan?.illustrativeProfitRate ?? 0
  const investorSharePct = selectedPlan?.investorSharePct ?? 40
  const companySharePct = selectedPlan?.companySharePct ?? 60

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
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
            {lang === 'EN' ? 'Shariah-Aligned Investment' : 'শরিয়াহসম্মত বিনিয়োগ'}
          </p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 text-balance mb-4">
            {lang === 'EN' ? (
              <>
                Project <span className="text-[#0A5C36]">Musharaka</span>
              </>
            ) : (
              <>
                প্রজেক্ট <span className="text-[#0A5C36]">মুশারাকা</span>
              </>
            )}
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
            {lang === 'EN'
              ? 'A transparent profit-and-loss sharing partnership in Origin Agro’s farm-to-food business — not a fixed deposit, not a guaranteed return.'
              : 'অরিজিন অ্যাগ্রোর ফার্ম-টু-ফুড ব্যবসায় স্বচ্ছ মুনাফা-লোকসান ভাগাভাগির অংশীদারিত্ব — নির্দিষ্ট আমানত নয়, গ্যারান্টিযুক্ত রিটার্ন নয়।'}
          </p>
        </div>

        {/* Investment Snapshot */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-12 sm:mb-16">
          {[
            {
              en: 'Structure',
              bn: 'কাঠামো',
              val: lang === 'EN' ? 'Musharaka' : 'মুশারাকা',
            },
            {
              en: 'Min. Ticket',
              bn: 'ন্যূনতম',
              val: '৳ 20,000',
            },
            {
              en: 'Capital Target',
              bn: 'লক্ষ্য মূলধন',
              val: '৳ 3,50,000',
            },
            {
              en: 'Min. Tenure',
              bn: 'ন্যূনতম মেয়াদ',
              val: lang === 'EN' ? '2 Years' : '২ বছর',
            },
            {
              en: 'Profit Cycle',
              bn: 'মুনাফা চক্র',
              val: lang === 'EN' ? 'Every 6 Months' : 'প্রতি ৬ মাস',
            },
            {
              en: 'Location',
              bn: 'অবস্থান',
              val: 'Gazipur',
            },
          ].map((item) => (
            <div
              key={item.en}
              className="bg-[#F7F4EE] rounded-2xl p-4 text-center border border-gray-100"
            >
              <p className="text-sm sm:text-base font-extrabold text-[#0A5C36] leading-tight">
                {item.val}
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1 font-medium">
                {lang === 'EN' ? item.en : item.bn}
              </p>
            </div>
          ))}
        </div>

        {/* What is Musharaka + Key Terms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          <div className="bg-[#F7F4EE] rounded-2xl p-6 sm:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#0A5C36] rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-lg">
                {lang === 'EN' ? 'What is Musharaka?' : 'মুশারাকা কী?'}
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {lang === 'EN'
                ? 'Musharaka is a partnership where both parties contribute capital (and Origin Agro also contributes management, assets and operations). Profit is shared by a pre-agreed ratio. Genuine business loss is shared by capital contribution ratio.'
                : 'মুশারাকা হলো অংশীদারিত্ব যেখানে উভয় পক্ষ মূলধন দেয় (অরিজিন অ্যাগ্রো ব্যবস্থাপনা, সম্পদ ও পরিচালনাও দেয়)। মুনাফা পূর্বনির্ধারিত অনুপাতে ভাগ হয়। প্রকৃত ব্যবসায়িক ক্ষতি মূলধন অবদানের অনুপাতে বহন হয়।'}
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              {(lang === 'EN'
                ? [
                    'Profit is not fixed or guaranteed',
                    'Loss follows capital ratio (except fraud / negligence)',
                    'No automatic permanent company share ownership',
                    'Funds used only in approved Origin Agro operations',
                  ]
                : [
                    'মুনাফা নির্দিষ্ট বা গ্যারান্টিযুক্ত নয়',
                    'ক্ষতি মূলধন অনুপাতে (প্রতারণা/অবহেলা ছাড়া)',
                    'স্বয়ংক্রিয় স্থায়ী কোম্পানি শেয়ার মালিকানা নয়',
                    'অর্থ শুধু অনুমোদিত Origin Agro কার্যক্রমে',
                  ]
              ).map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0A5C36] shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#0A5C36]/15">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#F26522] rounded-xl flex items-center justify-center">
                <HandCoins className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-lg">
                {lang === 'EN' ? 'Profit, Tenure & Exit' : 'মুনাফা, মেয়াদ ও প্রস্থান'}
              </h3>
            </div>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex gap-3">
                <Clock className="w-4 h-4 text-[#0A5C36] shrink-0 mt-0.5" />
                <p>
                  {lang === 'EN'
                    ? 'Minimum tenure: 2 years. Profit account & distribution every 6 months (up to 4 cycles).'
                    : 'ন্যূনতম মেয়াদ: ২ বছর। মুনাফা হিসাব ও বিতরণ প্রতি ৬ মাস অন্তর (সর্বোচ্চ ৪ পর্ব)।'}
                </p>
              </div>
              <div className="flex gap-3">
                <TrendingUp className="w-4 h-4 text-[#0A5C36] shrink-0 mt-0.5" />
                <p>
                  {lang === 'EN'
                    ? 'Proposed starting profit split (subject to final agreement): Investor pool 40% · Origin Agro 60% of distributable net profit.'
                    : 'প্রস্তাবিত মুনাফা ভাগ (চূড়ান্ত চুক্তি সাপেক্ষ): বিনিয়োগকারী পুল ৪০% · অরিজিন অ্যাগ্রো ৬০% বণ্টনযোগ্য নিট মুনাফার।'}
                </p>
              </div>
              <div className="flex gap-3">
                <FileText className="w-4 h-4 text-[#0A5C36] shrink-0 mt-0.5" />
                <p>
                  {lang === 'EN'
                    ? 'Early exit: minimum 3 months written notice. Settlement by actual project position — not a guaranteed capital return promise.'
                    : 'আগাম প্রস্থান: কমপক্ষে ৩ মাস আগে লিখিত নোটিশ। নিষ্পত্তি প্রকৃত প্রকল্প অবস্থান অনুযায়ী — গ্যারান্টিযুক্ত মূলধন ফেরতের প্রতিশ্রুতি নয়।'}
                </p>
              </div>
              <div className="flex gap-3">
                <BarChart3 className="w-4 h-4 text-[#0A5C36] shrink-0 mt-0.5" />
                <p>
                  {lang === 'EN'
                    ? 'Every 6 months you receive a project report: income/expense summary, production & sales, profit/loss, fund use, and next plan.'
                    : 'প্রতি ৬ মাসে প্রকল্প প্রতিবেদন: আয়-ব্যয় সারসংক্ষেপ, উৎপাদন ও বিক্রয়, মুনাফা/ক্ষতি, অর্থের ব্যবহার ও পরবর্তী পরিকল্পনা।'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk notice */}
        <div className="mb-16 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 leading-relaxed">
            {lang === 'EN'
              ? 'Agriculture and livestock projects carry market, disease, weather and operational risks. Origin Agro does not guarantee any fixed profit or capital preservation. You participate in the actual economic outcome of the project under a signed Musharaka agreement. Final terms are subject to Shariah, legal and accounting review.'
              : 'কৃষি ও প্রাণিসম্পদ প্রকল্পে বাজার, রোগ, আবহাওয়া ও পরিচালনাগত ঝুঁকি থাকে। অরিজিন অ্যাগ্রো কোনো নির্দিষ্ট মুনাফা বা মূলধন সংরক্ষণের গ্যারান্টি দেয় না। আপনি স্বাক্ষরিত মুশারাকা চুক্তির অধীনে প্রকল্পের প্রকৃত অর্থনৈতিক ফলাফলে অংশ নেন। চূড়ান্ত শর্ত শরিয়াহ, আইন ও হিসাব পর্যালোচনা সাপেক্ষ।'}
          </p>
        </div>

        {/* Plans from database */}
        {plansLoading && (
          <div className="text-center py-14 text-gray-500 mb-16">
            {lang === 'EN' ? 'Loading investment plans...' : 'বিনিয়োগ প্ল্যান লোড হচ্ছে...'}
          </div>
        )}

        {!plansLoading && plans.length === 0 && (
          <div className="rounded-2xl border-2 border-[#0A5C36]/20 bg-white p-7 mb-16 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest mb-1 text-[#F26522]">
              {lang === 'EN' ? 'Seed / Pilot Musharaka' : 'সিড / পাইলট মুশারাকা'}
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
              {lang === 'EN' ? 'Project Musharaka Round' : 'প্রজেক্ট মুশারাকা রাউন্ড'}
            </h3>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              {lang === 'EN'
                ? 'External capital target ৳3,50,000 · Minimum participation ৳20,000 · Minimum tenure 2 years · Profit share every 6 months if distributable profit exists.'
                : 'বাহ্যিক মূলধন লক্ষ্য ৳৩,৫০,০০০ · ন্যূনতম অংশগ্রহণ ৳২০,০০০ · ন্যূনতম মেয়াদ ২ বছর · বণ্টনযোগ্য মুনাফা থাকলে প্রতি ৬ মাসে মুনাফা ভাগ।'}
            </p>
            <a
              href="#invest-method"
              onClick={() => setChosenPlanKey('pilot')}
              className="inline-flex items-center gap-2 py-3.5 px-6 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors"
            >
              {lang === 'EN' ? 'Start Application' : 'আবেদন শুরু করুন'}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}

        {!plansLoading && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="relative rounded-2xl border-2 border-[#0A5C36]/20 bg-white overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="p-7 flex flex-col flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest mb-1 text-[#F26522]">
                    {lang === 'EN' ? 'Musharaka Plan' : 'মুশারাকা প্ল্যান'}
                  </p>
                  <h3 className="text-2xl font-extrabold mb-2 text-gray-900">
                    {lang === 'EN' ? plan.name : plan.nameBn || plan.name}
                  </h3>

                  {(plan.description || plan.descriptionBn) && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-5">
                      {lang === 'EN' ? plan.description : plan.descriptionBn || plan.description}
                    </p>
                  )}

                  <div className="rounded-xl p-4 mb-6 bg-[#F7F4EE]">
                    {plan.minAmount && (
                      <>
                        <p className="text-3xl font-extrabold text-[#0A5C36]">
                          ৳ {plan.minAmount.toLocaleString('en-IN')}+
                        </p>
                        <p className="text-xs mt-1 text-gray-500">
                          {lang === 'EN' ? 'Minimum Investment' : 'ন্যূনতম বিনিয়োগ'}
                        </p>
                      </>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <div>
                        <p className="text-lg font-extrabold text-[#F26522]">
                          {lang === 'EN'
                            ? plan.tenure || '2 Years'
                            : plan.tenureBn || plan.tenure || '২ বছর'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {lang === 'EN' ? 'Min. tenure' : 'ন্যূনতম মেয়াদ'}
                        </p>
                      </div>
                      <div className="w-px h-10 bg-gray-300" />
                      <div>
                        <p className="text-lg font-extrabold text-gray-800">
                          {plan.companySharePct}:{plan.investorSharePct}
                        </p>
                        <p className="text-xs text-gray-500">
                          {lang === 'EN'
                            ? 'Company : Investor (proposed)'
                            : 'কোম্পানি : বিনিয়োগকারী (প্রস্তাবিত)'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      {lang === 'EN'
                        ? 'Profit-and-loss sharing Musharaka. Not a fixed deposit. Genuine loss reduces capital by contribution ratio. Profit cycles every 6 months if distributable profit exists.'
                        : 'মুনাফা-লোকসান ভাগাভাগি মুশারাকা। নির্দিষ্ট আমানত নয়। প্রকৃত ক্ষতিতে মূলধন অবদান অনুপাতে হ্রাস পায়। বণ্টনযোগ্য মুনাফা থাকলে প্রতি ৬ মাসে চক্র।'}
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

        {/* Method */}
        <div id="invest-method" className="mb-16 scroll-mt-24">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
              {lang === 'EN' ? 'Choose Your Investment Method' : 'বিনিয়োগ পদ্ধতি বেছে নিন'}
            </h3>
            <p className="text-gray-500 text-sm mt-3">
              {lang === 'EN' ? 'Selected:' : 'নির্বাচিত:'}{' '}
              <span className="font-bold text-gray-800">
                {lang === 'EN'
                  ? plans.find((p) => p.planKey === chosenPlanKey)?.name ||
                    'Project Musharaka'
                  : plans.find((p) => p.planKey === chosenPlanKey)?.nameBn ||
                    plans.find((p) => p.planKey === chosenPlanKey)?.name ||
                    'প্রজেক্ট মুশারাকা'}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <button
              onClick={() => setInvestMethod('online')}
              className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
                investMethod === 'online'
                  ? 'border-[#0A5C36] bg-[#F7F4EE] shadow-md'
                  : 'border-gray-200 bg-white hover:border-[#0A5C36]/40'
              }`}
            >
              <div className="w-12 h-12 bg-[#0A5C36] rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-extrabold text-gray-900 text-lg mb-1">
                {lang === 'EN' ? 'Online Application' : 'অনলাইন আবেদন'}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {lang === 'EN'
                  ? 'Fill the secure investor form (NID & details). Team will contact you for agreement & next steps.'
                  : 'নিরাপদ বিনিয়োগকারী ফর্ম পূরণ করুন (এনআইডি ও তথ্য)। চুক্তি ও পরবর্তী ধাপের জন্য টিম যোগাযোগ করবে।'}
              </p>
            </button>

            <button
              onClick={() => setInvestMethod('physical')}
              className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
                investMethod === 'physical'
                  ? 'border-[#0A5C36] bg-[#F7F4EE] shadow-md'
                  : 'border-gray-200 bg-white hover:border-[#0A5C36]/40'
              }`}
            >
              <div className="w-12 h-12 bg-[#F26522] rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-extrabold text-gray-900 text-lg mb-1">
                {lang === 'EN' ? 'Office Visit' : 'অফিসে আসুন'}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {lang === 'EN'
                  ? 'Book an appointment, meet the team, and sign the Musharaka agreement in person.'
                  : 'অ্যাপয়েন্টমেন্ট বুক করুন, টিমের সাথে দেখা করুন এবং সরাসরি মুশারাকা চুক্তি স্বাক্ষর করুন।'}
              </p>
            </button>
          </div>

          {investMethod === 'online' && (
            <KycForm planKey={chosenPlanKey || plans[0]?.planKey || 'pilot'} />
          )}
          {investMethod === 'physical' && (
            <AppointmentForm planInterest={chosenPlanKey || plans[0]?.planKey || 'pilot'} />
          )}
        </div>

        {/* Calculator — illustrative only */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-16">
          <div className="bg-[#F7F4EE] rounded-2xl p-6 sm:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0A5C36] rounded-xl flex items-center justify-center">
                <CircleDollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">
                  {lang === 'EN' ? 'Illustrative Calculator' : 'উদাহরণমূলক ক্যালকুলেটর'}
                </h3>
                <p className="text-xs text-gray-500">
                  {lang === 'EN'
                    ? 'Not a promise — for understanding only'
                    : 'প্রতিশ্রুতি নয় — শুধু বোঝার জন্য'}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {plans.length > 0 && (
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
                        {(lang === 'EN' ? plan.name : plan.nameBn || plan.name) +
                          ' | ' +
                          plan.companySharePct +
                          ':' +
                          plan.investorSharePct}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {lang === 'EN' ? 'Investment Amount (৳)' : 'বিনিয়োগের পরিমাণ (৳)'}
                </label>
                <input
                  type="range"
                  min={minAmount}
                  max={1000000}
                  step={5000}
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

              <div className="bg-white rounded-xl p-3 border border-gray-200 text-xs text-gray-600 space-y-1">
                <p>
                  <span className="font-bold text-gray-800">
                    {lang === 'EN' ? 'Illustrative rate:' : 'উদাহরণ হার:'}
                  </span>{' '}
                  {illustrativeRate}%
                </p>
                <p>
                  <span className="font-bold text-gray-800">
                    {lang === 'EN' ? 'Split (Company:Investor):' : 'ভাগ (কোম্পানি:বিনিয়োগকারী):'}
                  </span>{' '}
                  {companySharePct}:{investorSharePct}
                </p>
                <p>
                  <span className="font-bold text-gray-800">
                    {lang === 'EN' ? 'Cycles:' : 'পর্ব:'}
                  </span>{' '}
                  {lang === 'EN' ? 'Every 6 months · max 4 in 2 years' : 'প্রতি ৬ মাস · ২ বছরে সর্বোচ্চ ৪'}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3 text-center bg-white border border-gray-200">
                <p className="text-lg font-extrabold text-[#0A5C36]">
                  ৳ {estimatedBusinessProfit.toLocaleString('en-IN')}
                </p>
                <p className="text-xs mt-1 text-gray-500">
                  {lang === 'EN' ? 'Est. Business Profit' : 'আনুমানিক ব্যবসায়িক মুনাফা'}
                </p>
              </div>
              <div className="rounded-xl p-3 text-center bg-[#0A5C36] text-white">
                <p className="text-lg font-extrabold">
                  ৳ {estimatedInvestorShare.toLocaleString('en-IN')}
                </p>
                <p className="text-xs mt-1 text-white/70">
                  {lang === 'EN' ? 'Your Profit Share' : 'আপনার মুনাফার অংশ'}
                </p>
              </div>
              <div className="rounded-xl p-3 text-center bg-white border border-gray-200">
                <p className="text-lg font-extrabold text-gray-700">
                  ৳ {estimatedCompanyShare.toLocaleString('en-IN')}
                </p>
                <p className="text-xs mt-1 text-gray-500">
                  {lang === 'EN' ? 'Company Share' : 'কোম্পানির অংশ'}
                </p>
              </div>
              <div className="rounded-xl p-3 text-center bg-white border border-gray-200">
                <p className="text-lg font-extrabold text-[#F26522]">
                  ৳ {estimatedTotalPayout.toLocaleString('en-IN')}
                </p>
                <p className="text-xs mt-1 text-gray-500">
                  {lang === 'EN' ? 'Capital + Est. Profit' : 'মূলধন + আনুমানিক মুনাফা'}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              {lang === 'EN'
                ? '* Illustrative only. Not guaranteed. Under Musharaka, actual profit depends on real results. If a period has no profit, no profit is paid for that period. Genuine loss is shared by capital ratio.'
                : '* শুধু উদাহরণ। গ্যারান্টি নয়। মুশারাকায় প্রকৃত মুনাফা ফলাফলের উপর নির্ভর করে। কোনো পর্বে মুনাফা না থাকলে সে পর্বে মুনাফা দেওয়া হয় না। প্রকৃত ক্ষতি মূলধন অনুপাতে বহন হয়।'}
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden min-h-[420px]">
            <Image
              src="/images/investor-bg.png"
              alt="Origin Agro farm for investors"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#063D24]/75" />
            <div className="relative z-10 p-8 flex flex-col justify-end h-full">
              <div className="flex items-center gap-2 mb-3">
                <BadgeCheck className="w-5 h-5 text-[#F26522]" />
                <p className="text-[#F26522] font-bold text-xs uppercase tracking-widest">
                  {lang === 'EN' ? 'Why This Structure' : 'কেন এই কাঠামো'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(lang === 'EN'
                  ? [
                      'Shariah-aligned Musharaka',
                      'Shared risk & reward',
                      '6-month transparent reports',
                      'Farm-to-food real business',
                    ]
                  : [
                      'শরিয়াহসম্মত মুশারাকা',
                      'ঝুঁকি ও পুরস্কার ভাগাভাগি',
                      '৬ মাসের স্বচ্ছ প্রতিবেদন',
                      'ফার্ম-টু-ফুড প্রকৃত ব্যবসা',
                    ]
                ).map((item) => (
                  <div
                    key={item}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#F26522] shrink-0 mt-0.5" />
                    <p className="text-white text-sm font-semibold">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5 Steps */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
              {lang === 'EN' ? 'How Musharaka Investment Works' : 'মুশারাকা বিনিয়োগ কীভাবে কাজ করে'}
            </h3>
            <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
              {lang === 'EN'
                ? 'From application to profit cycles and settlement — aligned with Origin Agro’s Musharaka agreement.'
                : 'আবেদন থেকে মুনাফা চক্র ও নিষ্পত্তি — অরিজিন অ্যাগ্রোর মুশারাকা চুক্তির সাথে সামঞ্জস্যপূর্ণ।'}
            </p>
          </div>

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
              href="#invest-method"
              className="bg-[#F26522] hover:bg-[#d4551a] text-white font-bold px-10 py-4 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl text-base"
            >
              <FileText className="w-5 h-5" />
              {lang === 'EN' ? 'Apply to Invest' : 'বিনিয়োগে আবেদন করুন'}
            </a>
            <a
              href="#footer"
              className="border-2 border-[#0A5C36] text-[#0A5C36] hover:bg-[#0A5C36] hover:text-white font-bold px-10 py-4 rounded-xl flex items-center gap-2 transition-all duration-200 text-base"
            >
              <Calendar className="w-5 h-5" />
              {lang === 'EN' ? 'Contact Team' : 'টিমের সাথে যোগাযোগ'}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
