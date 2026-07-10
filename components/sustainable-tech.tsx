import { Wind, Flame, Sun, Droplets } from 'lucide-react'

const techFeatures = [
  {
    icon: Wind,
    title: 'Zero Emission Waste',
    desc: 'Our integrated waste management system ensures zero harmful emissions through bioconversion and composting processes.',
    stat: '0 kg',
    statLabel: 'Carbon Waste',
  },
  {
    icon: Flame,
    title: 'Biogas Plant',
    desc: 'Cattle manure and organic waste are converted into clean biogas energy, powering 60% of our farm operations.',
    stat: '60%',
    statLabel: 'Self-Powered',
  },
  {
    icon: Sun,
    title: 'Solar Panels',
    desc: '500kW rooftop solar installations across the resort and farm buildings generate clean renewable electricity.',
    stat: '500kW',
    statLabel: 'Solar Capacity',
  },
  {
    icon: Droplets,
    title: 'Rainwater Harvesting',
    desc: 'Advanced collection and filtration systems capture seasonal rainfall, reducing freshwater dependency by 70%.',
    stat: '70%',
    statLabel: 'Water Saved',
  },
]

export default function SustainableTech() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">Green Innovation</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
            Sustainable Technology Showcase
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
            Origin Agro is powered by cutting-edge green technology that minimizes environmental impact
            while maximizing operational efficiency.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techFeatures.map((feature) => (
            <div
              key={feature.title}
              className="relative bg-[#F7F4EE] rounded-2xl p-6 border border-gray-100 hover:border-[#0A5C36]/30 hover:shadow-lg transition-all duration-300 group overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#0A5C36]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#0A5C36]/10 transition-colors" />

              {/* Icon */}
              <div className="w-14 h-14 bg-[#0A5C36] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#F26522] transition-colors duration-300 shadow-md">
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="font-extrabold text-gray-900 text-base mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{feature.desc}</p>

              {/* Stat */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-2xl font-extrabold text-[#0A5C36]">{feature.stat}</p>
                <p className="text-xs text-gray-500 font-medium">{feature.statLabel}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-[#F7F4EE] rounded-2xl p-6 md:p-8 border border-[#0A5C36]/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg font-extrabold text-gray-900">
              Certified by{' '}
              <span className="text-[#0A5C36]">Bangladesh Green Building Council</span>
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Our eco-resort meets the highest international standards for sustainable construction and operations.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-14 h-14 bg-[#0A5C36] rounded-full flex items-center justify-center">
              <Sun className="w-7 h-7 text-white" />
            </div>
            <div className="w-14 h-14 bg-[#F26522] rounded-full flex items-center justify-center">
              <Droplets className="w-7 h-7 text-white" />
            </div>
            <div className="w-14 h-14 bg-[#0A5C36]/70 rounded-full flex items-center justify-center">
              <Wind className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
