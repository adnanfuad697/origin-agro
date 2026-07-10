'use client'

import { useState } from 'react'
import { Menu, X, Leaf } from 'lucide-react'

const navLinks = [
  { label: 'Home', labelBn: 'হোম', href: '#' },
  { label: 'Projects', labelBn: 'প্রকল্প', href: '#projects' },
  { label: 'Invest', labelBn: 'বিনিয়োগ', href: '#invest' },
  { label: 'Shop', labelBn: 'শপ', href: '#shop' },
  { label: 'About', labelBn: 'আমাদের', href: '#team' },
  { label: 'FAQ', labelBn: 'প্রশ্নোত্তর', href: '#faq' },
  { label: 'Contact', labelBn: 'যোগাযোগ', href: '#footer' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-[#0A5C36] rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#0A5C36] font-extrabold text-xl tracking-tight">
              Origin <span className="text-[#F26522]">Agro</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-700 hover:text-[#0A5C36] font-medium text-sm transition-colors relative group flex flex-col items-center leading-tight"
              >
                <span>{link.label}</span>
                <span className="text-[10px] text-gray-400 group-hover:text-[#0A5C36] transition-colors">{link.labelBn}</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#F26522] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#invest"
              className="bg-[#F26522] hover:bg-[#d4551a] text-white font-bold px-5 py-2.5 rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg flex flex-col items-center leading-tight"
            >
              <span>Invest Now</span>
              <span className="text-[10px] font-normal opacity-80">বিনিয়োগ করুন</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700 hover:text-[#0A5C36]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          <div className="flex flex-col gap-3 pt-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-700 hover:text-[#0A5C36] font-medium py-1.5 border-b border-gray-50 flex items-center justify-between"
                onClick={() => setMobileOpen(false)}
              >
                <span>{link.label}</span>
                <span className="text-xs text-gray-400">{link.labelBn}</span>
              </a>
            ))}
            <a
              href="#projects"
              className="bg-[#F26522] hover:bg-[#d4551a] text-white font-bold px-5 py-2.5 rounded-lg text-center mt-2 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
