'use client'

import { Phone, Mail, Globe, CircleUserRound } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export default function TopBar() {
  const { lang, toggleLang } = useLanguage()

  return (
    <div className="bg-[#063D24] text-white text-xs sm:text-sm py-2 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Contact */}
        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href="tel:+8801586207756"
            className="flex items-center gap-1.5 hover:text-[#F26522] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>+880 1586-207756</span>
          </a>
          <a
            href="mailto:originagro0@gmail.com"
            className="hidden sm:flex items-center gap-1.5 hover:text-[#F26522] transition-colors"
          >
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span>originagro0@gmail.com</span>
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 hover:text-[#F26522] transition-colors border border-white/30 rounded px-2 py-1"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-semibold">{lang}</span>
          </button>

          <a
            href="/account"
            className="flex items-center gap-1 hover:text-[#F26522] transition-colors py-1"
          >
            <CircleUserRound className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">
              {lang === 'EN' ? 'Login/Account' : 'লগইন/অ্যাকাউন্ট'}
            </span>
          </a>

          <a
            href="/?category=Qurbani+Cattle#shop"
            className="bg-[#F26522] hover:bg-[#d4551a] text-white font-semibold px-2.5 sm:px-3 py-1 rounded transition-colors text-[11px] sm:text-xs whitespace-nowrap"
          >
            {lang === 'EN' ? '🐄 Buy Cattle' : '🐄 কোরবানির পশু'}
          </a>
        </div>
      </div>
    </div>
  )
}
