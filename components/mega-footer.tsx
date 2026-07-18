import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import ContactForm from '@/components/contact-form'

// Inline SVG social icon (lucide-react v1+ removed social icons)
function FacebookIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

const quickLinks = [
  { en: 'Home', bn: 'হোম', href: '/' },
  { en: 'About Us', bn: 'আমাদের সম্পর্কে', href: '/#team' },
  { en: 'Our Projects', bn: 'আমাদের প্রকল্প', href: '/#projects' },
  { en: 'Smart Invest', bn: 'বিনিয়োগ', href: '/#invest' },
  { en: 'Shop', bn: 'শপ', href: '/#shop' },
  { en: 'FAQ', bn: 'প্রশ্নোত্তর', href: '/#faq' },
]
const services = [
  { en: 'Agro Investment', bn: 'কৃষি বিনিয়োগ' },
  { en: 'Livestock Purchase', bn: 'পশু ক্রয়' },
  { en: 'Organic Produce', bn: 'জৈব পণ্য' },
  { en: 'Dairy & Honey', bn: 'দুগ্ধ ও মধু' },
  { en: 'CSR Partnership', bn: 'সিএসআর অংশীদারিত্ব' },
]

export default function MegaFooter() {
  return (
    <footer id="footer" className="bg-[#063D24] text-white">
      {/* Map Section */}
      <div className="w-full h-64 md:h-80 bg-[#0A5C36] relative overflow-hidden border-b border-white/10">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.3!2d90.4!3d23.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ4JzAwLjAiTiA5MMKwMjQnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1234567890" width="100%" height="100%" style={{ border: 0, filter: 'grayscale(30%) contrast(1.1) brightness(0.9)' }} allowFullScreen loading="lazy" title="Origin Agro Location Map" referrerPolicy="no-referrer-when-downgrade" />
        <div className="absolute inset-0 pointer-events-none bg-[#0A5C36]/20" />
        {/* Map Pin Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
          <div className="bg-[#F26522] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
            📍 Gazipur, Bangladesh
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-11 h-11 shrink-0">
                <Image src="/images/logo.png" alt="Origin Agro Logo" fill className="object-contain" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Origin <span className="text-[#F26522]">Agro</span>
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Bangladesh&apos;s Shariah-guided integrated agro-investment platform.
              Growing together for a sustainable future.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              <a href="https://www.facebook.com/share/1Eb2Pr1NJh/" target="_blank" rel="noopener noreferrer" aria-label="Origin Agro on Facebook" className="w-9 h-9 bg-white/10 hover:bg-[#F26522] rounded-lg flex items-center justify-center transition-colors duration-200">
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-extrabold text-base mb-1 text-white">Quick Links</h4>
            <p className="text-white/50 text-xs mb-4">দ্রুত লিংক</p>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.en}>
                  <a href={link.href} className="text-white/70 hover:text-[#F26522] text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-[#F26522] rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.en}</span>
                    <span className="text-white/40 text-xs ml-auto">{link.bn}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="font-extrabold text-base mb-1 text-white">Our Services</h4>
            <p className="text-white/50 text-xs mb-4">আমাদের সেবাসমূহ</p>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service.en}>
                  <a href="/#shop" className="text-white/70 hover:text-[#F26522] text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-[#F26522] rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{service.en}</span>
                    <span className="text-white/40 text-xs ml-auto">{service.bn}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-extrabold text-base mb-1 text-white">Contact Us</h4>
            <p className="text-white/50 text-xs mb-4">যোগাযোগ করুন</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F26522] shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm leading-relaxed">
                  Gazipur, Bangladesh
                </span>
              </li>
              <li>
                <a href="tel:+8801586207756" className="flex items-center gap-3 text-white/70 hover:text-[#F26522] transition-colors text-sm">
                  <Phone className="w-4 h-4 text-[#F26522] shrink-0" />
                  +880 1586-207756
                </a>
              </li>
              <li>
                <a href="mailto:originagro0@gmail.com" className="flex items-center gap-3 text-white/70 hover:text-[#F26522] transition-colors text-sm">
                  <Mail className="w-4 h-4 text-[#F26522] shrink-0" />
                  originagro0@gmail.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">Newsletter</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#F26522] transition-colors" />
                <button className="bg-[#F26522] hover:bg-[#d4551a] text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors shrink-0">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <ContactForm />
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/50">
          <p>© 2026 Origin Agro Ltd. All rights reserved. / সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
