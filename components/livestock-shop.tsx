import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Eye, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase' // আপনার supabase পাথ ঠিক আছে কি না নিশ্চিত করুন

export default function LivestockShop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('livestock').select('*')
      if (data) {
        setProducts(data)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  return (
    <section id="livestock" className="py-20 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
            Eid Cattle Shop / কোরবানির পশুর দোকান
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 text-balance">
            Choose Your Livestock From the Best Collection
          </h2>
          <p className="text-[#0A5C36] font-semibold text-base mt-1">সেরা সংগ্রহ থেকে আপনার পশু বেছে নিন</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {loading ? (
            <p className="text-center w-full">Loading cattle...</p>
          ) : (
            products.map((cow) => (
              <div
                key={cow.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col group"
              >
                <div className="relative h-56 bg-gray-50 overflow-hidden">
                  <Image
                    src={cow.image_url || '/placeholder.png'} // ডাটাবেসের image_url এখানে কাজ করবে
                    alt={cow.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                    {cow.status}
                  </span>
                  <div className="absolute top-3 right-3 bg-[#0A5C36] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    ৳ {cow.price}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-extrabold text-gray-900 text-lg mb-3">{cow.title}</h3>
                  <div className="bg-[#F7F4EE] rounded-xl p-4 mb-4 flex-1">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gray-200">
                        <tr><td className="py-2 text-gray-500">Weight</td><td className="py-2 text-right font-bold">{cow.weight}</td></tr>
                        <tr><td className="py-2 text-gray-500">Age</td><td className="py-2 text-right font-bold">{cow.age}</td></tr>
                        <tr><td className="py-2 text-gray-500">Breed</td><td className="py-2 text-right font-bold">{cow.breed}</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <button className="w-full bg-[#0A5C36] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
