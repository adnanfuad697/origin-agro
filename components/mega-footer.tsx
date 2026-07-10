import { Phone, Mail, MapPin, Leaf } from 'lucide-react'

// Inline SVG social icons (lucide-react v1+ removed social icons)
function FacebookIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}
function YoutubeIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  )
}
function InstagramIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function XIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const quickLinks = ['Home', 'About Us', 'Our Projects', 'Gallery', 'FAQ', 'Contact']
const services = [
  'Agro Investment',
  'Eco Resort Booking',
  'Livestock Purchase',
  'CSR Partnership',
  'Farm Tours',
  'Organic Produce',
]

export default function MegaFooter() {
  return (
    <footer id="footer" className="bg-[#063D24] text-white">
      {/* Map Section */}
      <div className="w-full h-64 md:h-80 bg-[#0A5C36] relative overflow-hidden border-b border-white/10">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.3!2d90.4!3d23.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ4JzAwLjAiTiA5MMKwMjQnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(30%) contrast(1.1) brightness(0.9)' }}
          allowFullScreen
          loading="lazy"
          title="Origin Agro Location Map"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute inset-0 pointer-events-none bg-[#0A5C36]/20" />
        {/* Map Pin Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
          <div className="bg-[#F26522] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
            📍 Origin Agro Village, Gazipur
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-[#F26522]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Origin <span className="text-[#F26522]">Agro</span>
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Bangladesh&apos;s premier Shariah-compliant integrated agro-tourism and livestock platform.
              Growing together for a sustainable future.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {[
                { Icon: FacebookIcon, label: 'Facebook' },
                { Icon: YoutubeIcon, label: 'YouTube' },
                { Icon: InstagramIcon, label: 'Instagram' },
                { Icon: XIcon, label: 'X (Twitter)' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={`Origin Agro on ${label}`}
                  className="w-9 h-9 bg-white/10 hover:bg-[#F26522] rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-extrabold text-base mb-5 text-white">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/70 hover:text-[#F26522] text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#F26522] rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="font-extrabold text-base mb-5 text-white">Our Services</h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#"
                    className="text-white/70 hover:text-[#F26522] text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#F26522] rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-extrabold text-base mb-5 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F26522] shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm leading-relaxed">
                  Origin Agro Village, Bhawal Mirzapur, Gazipur-1740, Dhaka, Bangladesh
                </span>
              </li>
              <li>
                <a
                  href="tel:+8801700000000"
                  className="flex items-center gap-3 text-white/70 hover:text-[#F26522] transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 text-[#F26522] shrink-0" />
                  +880 170 000 0000
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@originagro.com"
                  className="flex items-center gap-3 text-white/70 hover:text-[#F26522] transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 text-[#F26522] shrink-0" />
                  info@originagro.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">Newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#F26522] transition-colors"
                />
                <button className="bg-[#F26522] hover:bg-[#d4551a] text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors shrink-0">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/50">
          <p>© 2025 Origin Agro Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Shariah Certificate</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
