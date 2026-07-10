import Image from 'next/image'
import { ShieldCheck, TreePine, Star, TrendingUp } from 'lucide-react'

const badges = [
  { icon: TrendingUp, label: 'Safe Investment', labelBn: 'নিরাপদ বিনিয়োগ', desc: 'Halal returns guaranteed', descBn: 'হালাল রিটার্ন নিশ্চিত' },
  { icon: TreePine, label: 'Eco Resort', labelBn: 'ইকো রিসোর্ট', desc: 'Sustainable & green', descBn: 'টেকসই ও সবুজ' },
  { icon: Star, label: 'Shariah Compliant', labelBn: 'শরিয়াহ সম্মত', desc: 'Fully halal model', descBn: 'সম্পূর্ণ হালাল মডেল' },
  { icon: ShieldCheck, label: 'Govt. Registered', labelBn: 'সরকার নিবন্ধিত', desc: 'Certified & trusted', descBn: 'সনদপ্রাপ্ত ও বিশ্বাসযোগ্য' },
]

export default function HeroSection() {
  return (
    <section className="bg-[#F7F4EE] py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-7">
            <div className="inline-flex items-center gap-2 bg-[#0A5C36]/10 text-[#0A5C36] font-semibold text-sm px-4 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 bg-[#F26522] rounded-full animate-pulse" />
              Premium Agro-Tourism Investment / প্রিমিয়াম কৃষি-পর্যটন বিনিয়োগ
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight text-balance">
              Be a Proud Owner of an{' '}
              <span className="text-[#0A5C36]">Integrated Agro Farm</span>{' '}
              &{' '}
              <span className="text-[#F26522]">Eco Resort</span>
            </h1>
            <p className="text-2xl font-bold text-[#0A5C36]/80 leading-snug">
              সমন্বিত কৃষি খামার ও{' '}
              <span className="text-[#F26522]">ইকো রিসোর্টের</span>{' '}
              একজন গর্বিত মালিক হোন
            </p>

            <p className="text-gray-600 leading-relaxed text-lg">
              Origin Agro offers a unique Shariah-compliant investment opportunity — combining organic farming,
              eco-tourism, and a certified cattle farm into one world-class agro-village resort in Bangladesh.
            </p>

            {/* Feature Badges Grid */}
            <div className="grid grid-cols-2 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.label}
                  className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#0A5C36]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0A5C36] transition-colors">
                    <badge.icon className="w-5 h-5 text-[#0A5C36] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{badge.label}</p>
                    <p className="text-[#0A5C36] text-xs font-medium">{badge.labelBn}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href="#invest"
                className="bg-[#F26522] hover:bg-[#d4551a] text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-base flex flex-col items-center"
              >
                <span>Invest Now</span>
                <span className="text-xs font-normal opacity-80">এখনই বিনিয়োগ করুন</span>
              </a>
              <a
                href="#shop"
                className="border-2 border-[#0A5C36] text-[#0A5C36] hover:bg-[#0A5C36] hover:text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 text-base flex flex-col items-center"
              >
                <span>Shop Products</span>
                <span className="text-xs font-normal opacity-70">পণ্য কিনুন</span>
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-2">
              {[
                { value: '500+', label: 'Investors', labelBn: 'বিনিয়োগকারী' },
                { value: '50 Acres', label: 'Land Area', labelBn: 'জমির পরিমাণ' },
                { value: '100%', label: 'Halal Returns', labelBn: 'হালাল রিটার্ন' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-[#0A5C36]">{stat.value}</p>
                  <p className="text-gray-600 text-xs font-medium mt-0.5">{stat.label}</p>
                  <p className="text-gray-400 text-xs">{stat.labelBn}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Master Plan Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src="/images/hero-masterplan.png"
                alt="Origin Agro 3D agro-village master plan aerial view"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl px-4 py-2.5 shadow-lg">
                <p className="text-xs text-gray-500">Master Plan Visualization</p>
                <p className="text-sm font-bold text-[#0A5C36]">Origin Agro Village — Phase 1</p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#F26522]/10 rounded-full -z-10" />
            <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-[#0A5C36]/10 rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
