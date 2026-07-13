'use client'

import { Phone, Mail, Globe, User } from 'lucide-react'
import { useState } from 'react'

export default function TopBar() {
  const [lang, setLang] = useState<'EN' | 'BN'>('EN')

  return (
    <div className="bg-[#063D24] text-white text-sm py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: contact */}
        <div className="flex items-center gap-5">
          <a
            href="tel:+8801700000000"
            className="flex items-center gap-1.5 hover:text-[#F26522] transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>+880 170 000 0000</span>
          </a>
          <a
            href="mailto:info@originagro.com"
            className="flex items-center gap-1.5 hover:text-[#F26522] transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>info@originagro.com</span>
          </a>
        </div>

        {/* Right: language, profile, CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'EN' ? 'BN' : 'EN')}
            className="flex items-center gap-1 hover:text-[#F26522] transition-colors border border-white/30 rounded px-2 py-0.5"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang}</span>
          </button>
          <a
            href="#"
            className="flex items-center gap-1 hover:text-[#F26522] transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span>My Account</span>
          </a>
          <a
            href="/?category=Qurbani+Cattle#shop"
            className="bg-[#F26522] hover:bg-[#d4551a] text-white font-semibold px-3 py-1 rounded transition-colors text-xs whitespace-nowrap"
          >
            🐄 Buy Cattle / কোরবানির পশু
          </a>
        </div>
      </div>
    </div>
  )
}
