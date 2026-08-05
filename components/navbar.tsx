'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

const navLinks = [
  { label: 'Home', labelBn: 'হোম', href: '/' },
  { label: 'Shop', labelBn: 'শপ', href: '/#shop' },
  { label: 'Invest', labelBn: 'বিনিয়োগ', href: '/#invest' },
  { label: 'Projects', labelBn: 'প্রকল্প', href: '/#projects' },
  { label: 'About', labelBn: 'আমাদের', href: '/#team' },
  { label: 'FAQ', labelBn: 'প্রশ্নোত্তর', href: '/#faq' },
  { label: 'Contact', labelBn: 'যোগাযোগ', href: '/#footer' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { lang } = useLanguage()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    function updateCartCount() {
      const cart = JSON.parse(window.localStorage.getItem('origin-agro-cart') || '[]')
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartCount(count)
    }
    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    const interval = setInterval(updateCartCount, 1000)
    return () => {
      window.removeEventListener('storage', updateCartCount)
      clearInterval(interval)
    }
  }, [])

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
              <Image src="/images/logo.png" alt="Origin Agro Logo" fill className="object-contain" />
            </div>
            <span className="text-[#0A5C36] font-extrabold text-lg sm:text-xl tracking-tight hidden sm:inline">
              Origin <span className="text-[#F26522]">Agro</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-700 hover:text-[#0A5C36] font-semibold text-sm transition-colors relative group py-2"
              >
                <span>{lang === 'EN' ? link.label : link.labelBn}</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#F26522] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/cart"
              className="relative w-11 h-11 flex items-center justify-center rounded-xl border-2 border-gray-200 hover:border-[#0A5C36] transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#F26522] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>
            <a
              href="/#invest"
              className="bg-[#F26522] hover:bg-[#d4551a] text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-lg"
            >
              {lang === 'EN' ? 'Invest Now' : 'বিনিয়োগ করুন'}
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 lg:hidden">
            <a href="/cart" className="relative w-10 h-10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#F26522] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>
            <button
              className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-[#0A5C36]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 pb-5 shadow-lg">
          <div className="flex flex-col pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-700 hover:text-[#0A5C36] font-semibold py-3.5 border-b border-gray-100 text-[15px]"
                onClick={() => setMobileOpen(false)}
              >
                {lang === 'EN' ? link.label : link.labelBn}
              </a>
            ))}
            <a
              href="/#invest"
              className="bg-[#F26522] hover:bg-[#d4551a] text-white font-bold px-5 py-3.5 rounded-xl text-center mt-4 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {lang === 'EN' ? 'Invest Now' : 'বিনিয়োগ করুন'}
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
