'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/language-context'
import { Star, Truck } from 'lucide-react'

interface Product {
  id: number
  category: string
  name: string
  nameBn: string | null
  image: string | null
  price: number
  originalPrice: number | null
  unit: string | null
  unitBn: string | null
  rating: number
  reviews: number
  badge: string | null
  badgeBn: string | null
  tags: string[]
  description: string | null
  descriptionBn: string | null
  delivery: string | null
  deliveryBn: string | null
  inStock: boolean
}

function formatTaka(amount: number) {
  return `৳ ${amount.toLocaleString('en-IN')}`
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  )
}

export default function ProductMarketplace() {
  const { lang } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cat = params.get('category')
    if (cat) setActiveCategory(cat)
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true })

      if (error) {
        console.error('Error fetching products:', error)
        setErrorMsg(lang === 'EN' ? 'Could not load products right now. Please try again shortly.' : 'পণ্য লোড করা যাচ্ছে না। একটু পর আবার চেষ্টা করুন।')
      } else if (data) {
        const mapped: Product[] = data.map((row: any) => ({
          id: row.id,
          category: row.category,
          name: row.name,
          nameBn: row.name_bn,
          image: row.image,
          price: Number(row.price),
          originalPrice: row.original_price ? Number(row.original_price) : null,
          unit: row.unit,
          unitBn: row.unit_bn,
          rating: Number(row.rating ?? 5),
          reviews: Number(row.reviews ?? 0),
          badge: row.badge,
          badgeBn: row.badge_bn,
          tags: row.tags ?? [],
          description: row.description,
          descriptionBn: row.description_bn,
          delivery: row.delivery,
          deliveryBn: row.delivery_bn,
          inStock: row.in_stock ?? true,
        }))
        setProducts(mapped)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [lang])

  const uniqueCategories = ['all', ...Array.from(new Set(products.map((p) => p.category)))]

  const filtered = activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory)

  return (
    <section id="shop" className="py-20 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
            {lang === 'EN' ? 'Origin Agro Marketplace' : 'অরিজিন অ্যাগ্রো মার্কেটপ্লেস'}
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            {lang === 'EN' ? 'Shop Directly From the Farm' : 'সরাসরি খামার থেকে কিনুন'}
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {uniqueCategories.map((cat) => {
            const count = cat === 'all' ? products.length : products.filter((p) => p.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  activeCategory === cat
                    ? 'bg-[#0A5C36] text-white shadow-md'
                    : 'bg-white border text-gray-700 hover:border-[#0A5C36]'
                }`}>
                {cat === 'all' ? (lang === 'EN' ? 'All Products' : 'সকল পণ্য') : cat} {count}
              </button>
            )
          })}
        </div>

        {loading && <div className="text-center py-20 text-gray-500">{lang === 'EN' ? 'Loading products...' : 'লোড হচ্ছে...'}</div>}

        {!loading && errorMsg && <div className="text-center py-20 text-red-500">{errorMsg}</div>}

        {!loading && !errorMsg && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">{lang === 'EN' ? 'No products in this category yet.' : 'এই ক্যাটাগরিতে এখনো কোনো পণ্য নেই।'}</div>
        )}

        {!loading && !errorMsg && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <div
                key={product.id}
                onClick={() => window.location.href = `/product/${product.id}`}
                className="bg-white rounded-2xl p-4 shadow-sm border flex flex-col hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative h-40 mb-3 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={product.image || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover" />
                  {product.badge && (
                    <span className="absolute top-2 left-2 bg-[#0A5C36] text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                      {lang === 'EN' ? product.badge : (product.badgeBn || product.badge)}
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="absolute top-2 right-2 bg-gray-800 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                      {lang === 'EN' ? 'Out of Stock' : 'স্টকে নেই'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 mb-1">
                  <StarRating rating={product.rating} />
                  <span className="text-[11px] text-gray-400">({product.reviews})</span>
                </div>

                <h3 className="font-bold text-sm text-gray-900">
                  {lang === 'EN' ? product.name : (product.nameBn || product.name)}
                </h3>

                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 my-2">
                    {product.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {(product.description || product.descriptionBn) && (
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {lang === 'EN' ? product.description : (product.descriptionBn || product.description)}
                  </p>
                )}

                {(product.delivery || product.deliveryBn) && (
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-2">
                    <Truck className="w-3 h-3" />
                    {lang === 'EN' ? product.delivery : (product.deliveryBn || product.delivery)}
                  </div>
                )}

                <div className="mt-auto pt-2 border-t">
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-extrabold text-[#0A5C36]">{formatTaka(product.price)}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">{formatTaka(product.originalPrice)}</p>
                    )}
                  </div>
                  {(product.unit || product.unitBn) && (
                    <p className="text-[11px] text-gray-400">{lang === 'EN' ? product.unit : (product.unitBn || product.unit)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
