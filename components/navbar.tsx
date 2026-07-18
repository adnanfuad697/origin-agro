'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

const navLinks = [
  { label: 'Home', labelBn: 'হোম', href: '/' },
  { label: 'Projects', labelBn: 'প্রকল্প', href: '/#projects' },
  { label: 'Invest', labelBn: 'বিনিয়োগ', href: '/#invest' },
  { label: 'Shop', labelBn: 'শপ', href: '/#shop' },
  { label: 'About', labelBn: 'আমাদের', href: '/#team' },
  { label: 'FAQ', labelBn: 'প্রশ্নোত্তর', href: '/#faq' },
  { label: 'Contact', labelBn: 'যোগাযোগ', href: '/#footer' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { lang } = useLanguage()

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-12 h-12">
              <Image src="/images/logo.png" alt="Origin Agro Logo" fill className="object-contain" />
            </div>
            <span className="text-[#0A5C36] font-extrabold text-xl tracking-tight hidden sm:inline">
              Origin <span className="text-[#F26522]">Agro</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-gray-700 hover:text-[#0A5C36] font-semibold text-sm transition-colors relative group py-2">
                <span>{lang === 'EN' ? link.label : link.labelBn}</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#F26522] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center">
            <a href="/#invest" className="bg-[#F26522] hover:bg-[#d4551a] text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-lg">
              {lang === 'EN' ? 'Invest Now' : 'বিনিয়োগ করুন'}
            </a>
          </div>

          <button className="lg:hidden text-gray-700 hover:text-[#0A5C36]" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 pb-5">
          <div className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-gray-700 hover:text-[#0A5C36] font-semibold py-3 border-b border-gray-50 flex items-center justify-between" onClick={() => setMobileOpen(false)}>
                <span>{lang === 'EN' ? link.label : link.labelBn}</span>
              </a>
            ))}
            <a href="/#invest" className="bg-[#F26522] hover:bg-[#d4551a] text-white font-bold px-5 py-3.5 rounded-xl text-center mt-4 transition-colors" onClick={() => setMobileOpen(false)}>
              {lang === 'EN' ? 'Invest Now' : 'বিনিয়োগ করুন'}
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
