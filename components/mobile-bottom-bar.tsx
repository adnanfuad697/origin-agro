'use client'

import { ShoppingBag, TrendingUp, Package } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export default function MobileBottomBar() {
  const { lang } = useLanguage()

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-3 max-w-lg mx-auto">
        <a
          href="/#shop"
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-gray-600 hover:text-[#0A5C36] transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-semibold">
            {lang === 'EN' ? 'Shop' : 'শপ'}
          </span>
        </a>

        <a
          href="/#invest"
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-gray-600 hover:text-[#F26522] transition-colors"
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-semibold">
            {lang === 'EN' ? 'Invest' : 'বিনিয়োগ'}
          </span>
        </a>

        <a
          href="/account"
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-gray-600 hover:text-[#0A5C36] transition-colors"
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-semibold">
            {lang === 'EN' ? 'My Orders' : 'অর্ডার'}
          </span>
        </a>
      </div>
    </div>
  )
}
