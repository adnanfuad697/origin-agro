'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ShoppingCart, Eye, Star, Tag, Truck, BadgeCheck, ShieldCheck } from 'lucide-react'

type Category = 'all' | 'cattle' | 'produce' | 'dairy' | 'resort' | 'bonds'

interface Product {
  id: number
  category: Category
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

const categories: { id: Category; label: string; labelBn: string; count: number }[] = [
  { id: 'all', label: 'All Products', labelBn: 'সব পণ্য', count: 12 },
  { id: 'cattle', label: 'Qurbani Cattle', labelBn: 'কোরবানির পশু', count: 3 },
  { id: 'produce', label: 'Organic Produce', labelBn: 'জৈব কৃষিপণ্য', count: 3 },
  { id: 'dairy', label: 'Dairy & Honey', labelBn: 'দুগ্ধজাত ও মধু', count: 3 },
  { id: 'resort', label: 'Resort Packages', labelBn: 'রিসোর্ট প্যাকেজ', count: 2 },
  { id: 'bonds', label: 'Invest Bonds', labelBn: 'বিনিয়োগ বন্ড', count: 1 },
]

const products: Product[] = [
  // Cattle
  {
    id: 1, category: 'cattle',
    name: 'Brahman Bull — Alpha', nameBn: 'ব্রাহমান বলদ — আলফা',
    image: '/images/cattle-1.png',
    price: '৳ 1,85,000', unit: 'Per Head', unitBn: 'প্রতি মাথা',
    rating: 4.9, reviews: 34,
    badge: 'Available', badgeBn: 'পাওয়া যাচ্ছে', badgeColor: 'bg-green-100 text-green-700',
    tags: ['480 kg', '3.5 Yrs', 'Brahman Cross'],
    description: 'Naturally grass-fed Brahman cross bull. Full health certificate, Shariah-certified for Qurbani.',
    descriptionBn: 'প্রাকৃতিকভাবে লালিত ব্রাহমান বলদ। স্বাস্থ্য সনদ ও কোরবানির জন্য শরিয়াহ সনদপ্রাপ্ত।',
    delivery: 'Free delivery — Dhaka', deliveryBn: 'ঢাকায় বিনামূল্যে ডেলিভারি',
    inStock: true,
  },
  {
    id: 2, category: 'cattle',
    name: 'Holstein Bull — Premium', nameBn: 'হলস্টেইন বলদ — প্রিমিয়াম',
    image: '/images/cattle-2.png',
    price: '৳ 2,20,000', unit: 'Per Head', unitBn: 'প্রতি মাথা',
    rating: 5.0, reviews: 21,
    badge: 'Premium', badgeBn: 'প্রিমিয়াম', badgeColor: 'bg-[#F26522]/10 text-[#F26522]',
    tags: ['520 kg', '4 Yrs', 'Holstein'],
    description: 'Large-frame premium Holstein bull with verified weight certificate. Best for large families.',
    descriptionBn: 'বড় আকারের প্রিমিয়াম হলস্টেইন বলদ। বড় পরিবারের জন্য আদর্শ।',
    delivery: 'Free delivery — Dhaka', deliveryBn: 'ঢাকায় বিনামূল্যে ডেলিভারি',
    inStock: true,
  },
  {
    id: 3, category: 'cattle',
    name: 'Sahiwal Bull — Gold', nameBn: 'সাহিওয়াল বলদ — গোল্ড',
    image: '/images/cattle-3.png',
    price: '৳ 1,75,000', unit: 'Per Head', unitBn: 'প্রতি মাথা',
    rating: 4.8, reviews: 18,
    badge: 'Available', badgeBn: 'পাওয়া যাচ্ছে', badgeColor: 'bg-green-100 text-green-700',
    tags: ['450 kg', '3 Yrs', 'Sahiwal'],
    description: 'Golden-brown Sahiwal breed — known for excellent temperament and meat quality.',
    descriptionBn: 'সুন্দর স্বভাব ও উন্নত মাংসের জন্য বিখ্যাত সাহিওয়াল জাতের বলদ।',
    delivery: 'Free delivery — Dhaka', deliveryBn: 'ঢাকায় বিনামূল্যে ডেলিভারি',
    inStock: true,
  },
  // Organic Produce
  {
    id: 4, category: 'produce',
    name: 'Seasonal Veggie Box', nameBn: 'মৌসুমি সবজি বাক্স',
    image: '/images/organic-produce.png',
    price: '৳ 450', originalPrice: '৳ 600', unit: '5 kg Box', unitBn: '৫ কেজি বাক্স',
    rating: 4.7, reviews: 89,
    badge: '25% Off', badgeBn: '২৫% ছাড়', badgeColor: 'bg-red-100 text-red-600',
    tags: ['Zero Pesticide', 'Farm Fresh', 'Organic Certified'],
    description: 'Mixed seasonal vegetables: tomato, brinjal, green chilli, spinach, bottle gourd — all pesticide-free.',
    descriptionBn: 'মৌসুমি মিশ্র সবজি: টমেটো, বেগুন, কাঁচামরিচ, পালংশাক, লাউ — কীটনাশকমুক্ত।',
    delivery: 'Home delivery — 2 days', deliveryBn: 'হোম ডেলিভারি — ২ দিনে',
    inStock: true,
  },
  {
    id: 5, category: 'produce',
    name: 'Organic Rice — 10kg', nameBn: 'জৈব চাল — ১০ কেজি',
    image: '/images/organic-produce.png',
    price: '৳ 950', unit: '10 kg Bag', unitBn: '১০ কেজি বস্তা',
    rating: 4.9, reviews: 112,
    badge: 'Best Seller', badgeBn: 'সবচেয়ে বিক্রিত', badgeColor: 'bg-blue-100 text-blue-700',
    tags: ['BARI Certified', 'Chemical-Free', 'Fragrant'],
    description: 'Premium organic aromatic rice grown with zero chemical input. Sun-dried and naturally processed.',
    descriptionBn: 'সুগন্ধি জৈব চাল — রাসায়নিক সার ছাড়া উৎপাদিত। রোদে শুকানো ও প্রাকৃতিকভাবে প্রক্রিয়াজাত।',
    delivery: 'Home delivery — 3 days', deliveryBn: 'হোম ডেলিভারি — ৩ দিনে',
    inStock: true,
  },
  {
    id: 6, category: 'produce',
    name: 'Farm Fresh Fruit Box', nameBn: 'তাজা ফলের বাক্স',
    image: '/images/organic-produce.png',
    price: '৳ 680', unit: '4 kg Box', unitBn: '৪ কেজি বাক্স',
    rating: 4.6, reviews: 54,
    tags: ['Seasonal', 'Picked Fresh', 'No Formalin'],
    description: 'Handpicked seasonal fruits from our organic orchard — mangoes, bananas, papayas, and guavas in season.',
    descriptionBn: 'আমাদের জৈব বাগান থেকে তাজা ফল: আম, কলা, পেঁপে ও পেয়ারা — ফরমালিনমুক্ত।',
    delivery: 'Same-day dispatch', deliveryBn: 'একই দিনে প্রেরণ',
    inStock: true,
  },
  // Dairy & Honey
  {
    id: 7, category: 'dairy',
    name: 'Fresh Farm Milk', nameBn: 'তাজা খামার দুধ',
    image: '/images/dairy-products.png',
    price: '৳ 90', unit: 'Per Litre', unitBn: 'প্রতি লিটার',
    rating: 5.0, reviews: 204,
    badge: 'Daily Fresh', badgeBn: 'প্রতিদিন তাজা', badgeColor: 'bg-green-100 text-green-700',
    tags: ['Raw Unprocessed', 'A2 Milk', 'No Additives'],
    description: 'Pure A2 cow milk collected fresh every morning. Delivered cold to your door within 6 hours.',
    descriptionBn: 'প্রতিদিন সকালে সংগৃহীত খাঁটি A2 গরুর দুধ। ৬ ঘন্টার মধ্যে ঠান্ডায় ডেলিভারি।',
    delivery: 'Morning delivery — 6AM', deliveryBn: 'সকাল ডেলিভারি — ভোর ৬টায়',
    inStock: true,
  },
  {
    id: 8, category: 'dairy',
    name: 'Pure Desi Ghee', nameBn: 'খাঁটি দেশি ঘি',
    image: '/images/dairy-products.png',
    price: '৳ 1,200', unit: '500 gm Jar', unitBn: '৫০০ গ্রাম জার',
    rating: 4.9, reviews: 76,
    badge: 'Bestseller', badgeBn: 'সবচেয়ে বিক্রিত', badgeColor: 'bg-[#F26522]/10 text-[#F26522]',
    tags: ['Bilona Method', 'A2 Cow', 'Preservative-Free'],
    description: 'Traditional bilona-churned clarified butter from A2 cows. Rich aroma, golden colour.',
    descriptionBn: 'A2 গরুর দুধ থেকে ঐতিহ্যবাহী পদ্ধতিতে তৈরি খাঁটি ঘি। সোনালি রঙ ও সুমধুর গন্ধ।',
    delivery: 'Home delivery — 2 days', deliveryBn: 'হোম ডেলিভারি — ২ দিনে',
    inStock: true,
  },
  {
    id: 9, category: 'dairy',
    name: 'Wild Mustard Honey', nameBn: 'বনজ সরিষার মধু',
    image: '/images/dairy-products.png',
    price: '৳ 850', unit: '500 gm Bottle', unitBn: '৫০০ গ্রাম বোতল',
    rating: 4.8, reviews: 48,
    tags: ['100% Natural', 'Unheated', 'BSTI Tested'],
    description: 'Raw, unfiltered mustard flower honey from our Sundarban-origin bee farms. Lab-tested for purity.',
    descriptionBn: 'আমাদের মৌমাছি খামার থেকে কাঁচা, অপরিশোধিত সরিষার মধু। ল্যাব-পরীক্ষিত বিশুদ্ধতা।',
    delivery: 'Home delivery — 3 days', deliveryBn: 'হোম ডেলিভারি — ৩ দিনে',
    inStock: true,
  },
  // Resort Packages
  {
    id: 10, category: 'resort',
    name: 'Weekend Farm Retreat', nameBn: 'উইকএন্ড ফার্ম রিট্রিট',
    image: '/images/eco-resort-package.png',
    price: '৳ 7,500', unit: '2 Nights / 2 Adults', unitBn: '২ রাত / ২ জন',
    rating: 4.9, reviews: 63,
    badge: 'Popular', badgeBn: 'জনপ্রিয়', badgeColor: 'bg-blue-100 text-blue-700',
    tags: ['Farm Breakfast', 'Nature Walk', 'Pond Fishing'],
    description: 'A 2-night eco-cottage stay including organic farm breakfast, guided nature walk, and pond fishing.',
    descriptionBn: '২ রাতের ইকো-কটেজ স্টে — জৈব ফার্ম ব্রেকফাস্ট, প্রকৃতি ভ্রমণ ও পুকুরে মাছ ধরা সহ।',
    delivery: 'Book 3 days advance', deliveryBn: '৩ দিন আগে বুকিং',
    inStock: true,
  },
  {
    id: 11, category: 'resort',
    name: 'Family Agro Holiday', nameBn: 'পারিবারিক কৃষি ছুটি',
    image: '/images/eco-resort-package.png',
    price: '৳ 18,000', unit: '3 Nights / 4 Adults', unitBn: '৩ রাত / ৪ জন',
    rating: 5.0, reviews: 29,
    badge: 'Investor Discount', badgeBn: 'বিনিয়োগকারী ছাড়', badgeColor: 'bg-purple-100 text-purple-700',
    tags: ['Private Cottage', 'Farm Tour', 'Bonfire Night'],
    description: 'Full family package: private cottage, farm-to-table dinners, cattle tour, bonfire, and organic activities.',
    descriptionBn: 'পুরো পরিবারের জন্য প্যাকেজ: প্রাইভেট কটেজ, ডিনার, গরুর খামার সফর, বনফায়ার।',
    delivery: 'Book 7 days advance', deliveryBn: '৭ দিন আগে বুকিং',
    inStock: true,
  },
  // Bonds
  {
    id: 12, category: 'bonds',
    name: 'Musharakah Bond — 1 Unit', nameBn: 'মুশারাকা বন্ড — ১ ইউনিট',
    image: '/images/investor-bg.png',
    price: '৳ 50,000', unit: 'Per Bond Unit', unitBn: 'প্রতি বন্ড ইউনিট',
    rating: 5.0, reviews: 500,
    badge: 'Shariah Certified', badgeBn: 'শরিয়াহ সনদপ্রাপ্ত', badgeColor: 'bg-[#0A5C36]/10 text-[#0A5C36]',
    tags: ['15% Annual Return', '3 Yr Tenure', 'RJSC Registered'],
    description: 'Purchase a Musharakah investment bond and earn 15% annual halal returns. Fully documented and legal.',
    descriptionBn: 'মুশারাকা বিনিয়োগ বন্ড কিনুন এবং ১৫% বার্ষিক হালাল মুনাফা অর্জন করুন। আইনিভাবে নথিভুক্ত।',
    delivery: 'Digital certificate — 24 hrs', deliveryBn: 'ডিজিটাল সনদ — ২৪ ঘন্টায়',
    inStock: true,
  },
]

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
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory)

  return (
    <section id="shop" className="py-20 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">
            Origin Agro Marketplace / মার্কেটপ্লেস
          </p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 text-balance mb-3">
            Shop Directly From the Farm
          </h2>
          <p className="text-[#0A5C36] font-semibold text-base">খামার থেকে সরাসরি কিনুন</p>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed text-sm">
            From Qurbani cattle to organic produce, fresh dairy, eco-resort stays, and Shariah investment bonds —
            everything from Origin Agro, delivered to your door.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-[#0A5C36] text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-[#0A5C36] hover:text-[#0A5C36]'
              }`}
            >
              {cat.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Category Title strip */}
        {activeCategory !== 'all' && (
          <div className="mb-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700 text-sm">
                {categories.find((c) => c.id === activeCategory)?.label}
              </span>
              <span className="text-[#0A5C36] font-medium text-sm">
                / {categories.find((c) => c.id === activeCategory)?.labelBn}
              </span>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden bg-gray-50">
                <Image
                  src={product.image}
                  alt={`${product.name} — Origin Agro`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${product.badgeColor}`}>
                    {product.badge}
                    <span className="hidden"> / {product.badgeBn}</span>
                  </span>
                )}
                <div className="absolute top-3 right-3 bg-[#0A5C36] text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {product.price}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col flex-1">
                <div className="mb-1">
                  <h3 className="font-extrabold text-gray-900 text-sm leading-tight">{product.name}</h3>
                  <p className="text-[#0A5C36] text-xs font-medium">{product.nameBn}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-1.5 mb-2">
                  <StarRating rating={product.rating} />
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-[#F7F4EE] text-gray-600 px-2 py-0.5 rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-gray-500 text-xs leading-relaxed mb-1 line-clamp-2">{product.description}</p>
                <p className="text-[#0A5C36]/70 text-xs leading-relaxed mb-3 line-clamp-2">{product.descriptionBn}</p>

                {/* Delivery */}
                <div className="flex items-center gap-1.5 mb-4 mt-auto">
                  <Truck className="w-3.5 h-3.5 text-[#F26522] shrink-0" />
                  <div>
                    <span className="text-xs text-gray-600 font-medium">{product.delivery}</span>
                    <span className="text-xs text-gray-400"> / {product.deliveryBn}</span>
                  </div>
                </div>

                {/* Price + CTA row */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-[#0A5C36]">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{product.unit} / {product.unitBn}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      className="w-9 h-9 bg-[#F7F4EE] hover:bg-[#F26522]/10 text-gray-600 hover:text-[#F26522] rounded-xl flex items-center justify-center transition-colors"
                      aria-label="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="w-9 h-9 bg-[#0A5C36] hover:bg-[#063D24] text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Strip */}
        <div className="mt-14 bg-[#0A5C36] rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
          {[
            { icon: BadgeCheck, en: 'Certified Organic', bn: 'সনদপ্রাপ্ত জৈব' },
            { icon: Truck, en: 'Dhaka-wide Delivery', bn: 'ঢাকায় ডেলিভারি' },
            { icon: ShieldCheck, en: 'Halal Guaranteed', bn: 'হালাল নিশ্চিত' },
            { icon: Star, en: '4.9★ Avg Rating', bn: '৪.৯★ গড় রেটিং' },
          ].map(({ icon: Icon, en, bn }) => (
            <div key={en} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#F26522]" />
              </div>
              <div>
                <p className="font-bold text-sm">{en}</p>
                <p className="text-white/60 text-xs">{bn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
