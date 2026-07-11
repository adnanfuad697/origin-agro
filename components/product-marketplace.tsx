'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase' // নিশ্চিত করো যে এই পাথটি সঠিক
import { ShoppingCart, Eye, Star, Tag, Truck, BadgeCheck, ShieldCheck } from 'lucide-react'

// প্রোডাক্ট ইন্টারফেস
interface Product {
  id: number
  category: string
  name: string
  nameBn: string
  image: string
  price: string
  originalPrice?: string
  unit: string
  unitBn: string
  rating: number
  reviews: number
  badge?: string
  badgeBn?: string
  badgeColor?: string
  tags: string[]
  description: string
  descriptionBn: string
  delivery: string
  deliveryBn: string
  inStock: boolean
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )
}

export default function ProductMarketplace() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // ডাটা ফেচিং
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data, error } = await supabase.from('products').select('*')
      if (error) {
        console.error("Error fetching products:", error)
      } else {
        setProducts(data as Product[])
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  // ডাইনামিক ক্যাটাগরি এবং কাউন্ট তৈরি
  const uniqueCategories = ['all', ...Array.from(new Set(products.map(p => p.category)))]
  
  const getCount = (cat: string) => cat === 'all' ? products.length : products.filter(p => p.category === cat).length

  // ফিল্টারিং
  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory)

  return (
    <section id="shop" className="py-20 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">Origin Agro Marketplace</p>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Shop Directly From the Farm</h2>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                activeCategory === cat
                  ? 'bg-[#0A5C36] text-white shadow-md'
                  : 'bg-white border text-gray-700 hover:border-[#0A5C36]'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {getCount(cat)}
              </span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading products from database...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border flex flex-col">
                <div className="relative h-40 mb-3 overflow-hidden rounded-lg">
                  <Image src={product.image || '/placeholder.png'} alt={product.name} fill className="object-cover" />
                </div>
                <h3 className="font-bold text-sm">{product.name}</h3>
                <p className="text-xs text-[#0A5C36] mb-2">{product.nameBn}</p>
                <p className="text-lg font-extrabold text-[#0A5C36] mt-auto">{product.price}</p>
                
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 bg-[#0A5C36] text-white rounded-lg text-xs">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
