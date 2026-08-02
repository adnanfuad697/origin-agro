'use client'

import { Wind, Flame, Sun, Droplets } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

const techFeatures = [
  {
    icon: Wind,
    title: 'Zero Emission Waste',
    titleBn: 'শূন্য নির্গমন বর্জ্য',
    desc: 'Our waste management approach is designed around bioconversion and composting processes to minimize harmful emissions.',
    descBn: 'আমাদের বর্জ্য ব্যবস্থাপনা বায়োকনভার্সন ও কম্পোস্টিং প্রক্রিয়ার উপর ভিত্তি করে ডিজাইন করা হয়েছে যাতে ক্ষতিকর নির্গমন কমানো যায়।',
  },
  {
    icon: Flame,
    title: 'Biogas Plant',
    titleBn: 'বায়োগ্যাস প্ল্যান্ট',
    desc: 'Cattle manure and organic waste are planned to be converted into clean biogas energy to help power our farm operations.',
    descBn: 'গবাদি পশুর সার ও জৈব বর্জ্যকে পরিষ্কার বায়োগ্যাস শক্তিতে রূপান্তর করে খামারের বিদ্যুৎ চাহিদা মেটানোর পরিকল্পনা রয়েছে।',
  },
  {
    icon: Sun,
    title: 'Solar Panels',
    titleBn: 'সোলার প্যানেল',
    desc: 'Rooftop solar installations across the farm buildings are planned to generate clean renewable electricity.',
    descBn: 'খামারের ভবনগুলোর ছাদে সোলার প্যানেল স্থাপন করে পরিষ্কার নবায়নযোগ্য বিদ্যুৎ উৎপাদনের পরিকল্পনা রয়েছে।',
  },
  {
    icon: Droplets,
    title: 'Rainwater Harvesting',
    titleBn: 'বৃষ্টির পানি সংগ্রহ',
    desc: 'Collection and filtration systems are planned to capture seasonal rainfall and reduce freshwater dependency.',
    descBn: 'মৌসুমি বৃষ্টির পানি সংগ্রহ ও পরিশোধন ব্যবস্থা স্থাপন করে মিঠা পানির উপর নির্ভরতা কমানোর পরিকল্পনা রয়েছে।',
  },
]

export default function SustainableTech() {
  const { lang } = useLanguage()

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
            {lang === 'EN' ? 'Future Plan' : 'ভবিষ্যৎ পরিকল্পনা'}
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
            {lang === 'EN' ? 'Sustainable Technology Approach' : 'টেকসই প্রযুক্তির পরিকল্পনা'}
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
            {lang === 'EN'
              ? 'Origin Agro is being developed with a commitment to sustainable, environmentally responsible farm technology as the project grows.'
              : 'অরিজিন অ্যাগ্রো টেকসই ও পরিবেশবান্ধব প্রযুক্তির প্রতি প্রতিশ্রুতিবদ্ধ হিসেবে গড়ে তোলা হচ্ছে।'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techFeatures.map((feature) => (
            <div key={feature.title} className="relative bg-[#F7F4EE] rounded-2xl p-6 border border-gray-100 hover:border-[#0A5C36]/30 hover:shadow-lg transition-all duration-300 group overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#0A5C36]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#0A5C36]/10 transition-colors" />

              <div className="w-14 h-14 bg-[#0A5C36] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#F26522] transition-colors duration-300 shadow-md">
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="font-extrabold text-gray-900 text-base mb-2">
                {lang === 'EN' ? feature.title : feature.titleBn}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {lang === 'EN' ? feature.desc : feature.descBn}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-[#F7F4EE] rounded-2xl p-6 md:p-8 border border-[#0A5C36]/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg font-extrabold text-gray-900">
              {lang === 'EN' ? (
                <>Committed to <span className="text-[#0A5C36]">Sustainable Farm Practices</span></>
              ) : (
                <><span className="text-[#0A5C36]">টেকসই খামার অনুশীলনের</span> প্রতি প্রতিশ্রুতিবদ্ধ</>
              )}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {lang === 'EN'
                ? 'Our long-term goal is to meet recognized standards for sustainable, environmentally responsible operations as the farm develops.'
                : 'আমাদের দীর্ঘমেয়াদী লক্ষ্য হলো খামারের বিকাশের সাথে সাথে স্বীকৃত টেকসই ও পরিবেশবান্ধব মানদণ্ড পূরণ করা।'}
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-14 h-14 bg-[#0A5C36] rounded-full flex items-center justify-center">
              <Sun className="w-7 h-7 text-white" />
            </div>
            <div className="w-14 h-14 bg-[#F26522] rounded-full flex items-center justify-center">
              <Droplets className="w-7 h-7 text-white" />
            </div>
            <div className="w-14 h-14 bg-[#0A5C36]/70 rounded-full flex items-center justify-center">
              <Wind className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
