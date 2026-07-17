import { Wind, Flame, Sun, Droplets } from 'lucide-react'

const techFeatures = [
  {
    icon: Wind,
    title: 'Zero Emission Waste',
    desc: 'Our waste management approach is designed around bioconversion and composting processes to minimize harmful emissions.',
  },
  {
    icon: Flame,
    title: 'Biogas Plant',
    desc: 'Cattle manure and organic waste are planned to be converted into clean biogas energy to help power our farm operations.',
  },
  {
    icon: Sun,
    title: 'Solar Panels',
    desc: 'Rooftop solar installations across the farm buildings are planned to generate clean renewable electricity.',
  },
  {
    icon: Droplets,
    title: 'Rainwater Harvesting',
    desc: 'Collection and filtration systems are planned to capture seasonal rainfall and reduce freshwater dependency.',
  },
]

export default function SustainableTech() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
            Green Innovation / সবুজ উদ্ভাবন
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
            Sustainable Technology Approach
          </h2>
          <p className="text-[#0A5C36] font-semibold text-base mt-1">টেকসই প্রযুক্তির পরিকল্পনা</p>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
            Origin Agro is being developed with a commitment to sustainable, environmentally responsible
            farm technology as the project grows.
          </p>
          <p className="text-gray-400 text-sm mt-1 max-w-xl mx-auto">
            অরিজিন অ্যাগ্রো টেকসই ও পরিবেশবান্ধব প্রযুক্তির প্রতি প্রতিশ্রুতিবদ্ধ।
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techFeatures.map((feature) => (
            <div key={feature.title} className="relative bg-[#F7F4EE] rounded-2xl p-6 border border-gray-100 hover:border-[#0A5C36]/30 hover:shadow-lg transition-all duration-300 group overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#0A5C36]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#0A5C36]/10 transition-colors" />

              {/* Icon */}
              <div className="w-14 h-14 bg-[#0A5C36] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#F26522] transition-colors duration-300 shadow-md">
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="font-extrabold text-gray-900 text-base mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-[#F7F4EE] rounded-2xl p-6 md:p-8 border border-[#0A5C36]/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg font-extrabold text-gray-900">
              Committed to <span className="text-[#0A5C36]">Sustainable Farm Practices</span>
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Our long-term goal is to meet recognized standards for sustainable, environmentally responsible operations as the farm develops.
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
