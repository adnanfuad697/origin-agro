import { Sprout, Hotel, Beef, HeartHandshake, BarChart3 } from 'lucide-react'

const segments = [
  {
    icon: Sprout,
    title: 'Organic Smart Agriculture',
    desc: 'AI-powered crop monitoring, precision irrigation, and certified organic produce. Our smart farm delivers zero-pesticide vegetables and fruits year-round.',
    tag: 'Agro-Tech',
  },
  {
    icon: Hotel,
    title: 'Eco Resort & Tourism',
    desc: 'A boutique eco-resort surrounded by green farmland. Guests enjoy nature walks, farm-to-table dining, cottage stays, and wellness retreats.',
    tag: 'Tourism',
  },
  {
    icon: Beef,
    title: 'Shariah-Based Cattle Farm',
    desc: 'Premium livestock rearing under certified Shariah-compliance. Our cattle are naturally fed and raised with ethical, halal-certified processes.',
    tag: 'Livestock',
  },
  {
    icon: HeartHandshake,
    title: 'Social Foundation',
    desc: 'A dedicated 5% of profits fund rural education, women\'s empowerment, and community development programs across the surrounding villages.',
    tag: 'CSR',
  },
]

export default function ProjectOverview() {
  return (
    <section id="projects" className="py-20 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">What We Offer</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 text-balance">
            Project Overview & Core Segments
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto leading-relaxed">
            Origin Agro is built on four integrated pillars, each designed to be profitable, sustainable,
            and socially responsible.
          </p>
        </div>

        {/* Segments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {segments.map((seg) => (
            <div
              key={seg.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-[#0A5C36]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#0A5C36] transition-colors duration-300">
                  <seg.icon className="w-6 h-6 text-[#0A5C36] group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-xs font-bold text-[#F26522] bg-[#F26522]/10 px-2 py-1 rounded-md mt-1">
                  {seg.tag}
                </span>
              </div>
              <h3 className="font-extrabold text-gray-900 text-base mb-2">{seg.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{seg.desc}</p>
            </div>
          ))}
        </div>

        {/* Profit Distribution Banner */}
        <div className="bg-[#0A5C36] rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#F26522]/20 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-6 h-6 text-[#F26522]" />
                <p className="text-[#F26522] font-bold uppercase text-sm tracking-wider">Profit Model</p>
              </div>
              <h3 className="text-2xl lg:text-3xl font-extrabold mb-3 text-balance">
                Shariah-Based Profit Distribution Model
              </h3>
              <p className="text-white/80 leading-relaxed text-sm">
                Our transparent profit-sharing model is structured under Islamic finance principles (Musharakah).
                Every investor receives fair, halal returns verified by a certified Shariah board.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { pct: '60%', label: 'Investor Returns', color: 'bg-[#F26522]' },
                { pct: '25%', label: 'Re-investment Fund', color: 'bg-white/30' },
                { pct: '10%', label: 'Operational Costs', color: 'bg-white/20' },
                { pct: '5%', label: 'Social Foundation', color: 'bg-green-400/40' },
              ].map((item) => (
                <div key={item.label} className={`${item.color} rounded-xl p-4 text-center`}>
                  <p className="text-3xl font-extrabold">{item.pct}</p>
                  <p className="text-xs font-medium mt-1 text-white/90">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
