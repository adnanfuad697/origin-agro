import Image from 'next/image'
import { Eye, Tag } from 'lucide-react'

const cattle = [
  {
    id: 1,
    name: 'Brahman Bull — Alpha',
    image: '/images/cattle-1.png',
    status: 'Available',
    statusColor: 'bg-green-100 text-green-700',
    weight: '480 kg',
    age: '3.5 Years',
    breed: 'Brahman Cross',
    price: '৳ 1,85,000',
  },
  {
    id: 2,
    name: 'Holstein Cattle — Premium',
    image: '/images/cattle-2.png',
    status: 'Premium',
    statusColor: 'bg-[#F26522]/10 text-[#F26522]',
    weight: '520 kg',
    age: '4 Years',
    breed: 'Holstein Friesian',
    price: '৳ 2,20,000',
  },
  {
    id: 3,
    name: 'Sahiwal Bull — Gold',
    image: '/images/cattle-3.png',
    status: 'Available',
    statusColor: 'bg-green-100 text-green-700',
    weight: '450 kg',
    age: '3 Years',
    breed: 'Sahiwal',
    price: '৳ 1,75,000',
  },
]

export default function LivestockShop() {
  return (
    <section id="livestock" className="py-20 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
            Eid Cattle Shop / কোরবানির পশুর দোকান
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 text-balance">
            Choose Your Livestock From the Best Collection
          </h2>
          <p className="text-[#0A5C36] font-semibold text-base mt-1">সেরা সংগ্রহ থেকে আপনার পশু বেছে নিন</p>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
            All our cattle are naturally raised, Shariah-certified, and ready for Qurbani. Browse our premium
            selection and book online with free delivery within Dhaka.
          </p>
          <p className="text-gray-400 text-sm mt-1 max-w-xl mx-auto">
            আমাদের সব পশু প্রাকৃতিকভাবে লালিত, শরিয়াহ-সনদপ্রাপ্ত এবং কোরবানির জন্য প্রস্তুত।
          </p>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {['All Cattle', 'Available Now', 'Premium', 'Under ৳2,00,000', 'Brahman', 'Sahiwal'].map((tag) => (
            <button
              key={tag}
              className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:border-[#0A5C36] hover:text-[#0A5C36] transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {cattle.map((cow) => (
            <div
              key={cow.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col group"
            >
              {/* Image */}
              <div className="relative h-56 bg-gray-50 overflow-hidden">
                <Image
                  src={cow.image}
                  alt={`${cow.name} - livestock for sale`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Status Badge */}
                <span
                  className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${cow.statusColor}`}
                >
                  {cow.status}
                </span>
                {/* Price Tag */}
                <div className="absolute top-3 right-3 bg-[#0A5C36] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {cow.price}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-extrabold text-gray-900 text-lg mb-3">{cow.name}</h3>

                {/* Details Table */}
                <div className="bg-[#F7F4EE] rounded-xl p-4 mb-4 flex-1">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { label: 'Weight', value: cow.weight },
                        { label: 'Age', value: cow.age },
                        { label: 'Breed', value: cow.breed },
                        { label: 'Price (BDT)', value: cow.price },
                      ].map((row) => (
                        <tr key={row.label}>
                          <td className="py-2 text-gray-500 font-medium pr-4">{row.label}</td>
                          <td className="py-2 text-gray-900 font-bold text-right">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-[#0A5C36] hover:bg-[#063D24] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 mt-auto">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <button className="border-2 border-[#0A5C36] text-[#0A5C36] hover:bg-[#0A5C36] hover:text-white font-bold px-8 py-3 rounded-xl transition-all duration-200">
            View All Livestock →
          </button>
        </div>
      </div>
    </section>
  )
}
