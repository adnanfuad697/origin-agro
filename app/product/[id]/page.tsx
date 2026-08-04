'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/language-context'
import TopBar from '@/components/top-bar'
import Navbar from '@/components/navbar'
import MegaFooter from '@/components/mega-footer'
import AddressFields from '@/components/address-fields'
import { Star, Truck, ShoppingCart, Zap, ArrowLeft, User } from 'lucide-react'

interface Product {
  id: number
  category: string
  name: string
  nameBn: string | null
  image: string | null
  videoUrl: string | null
  price: number
  originalPrice: number | null
  unit: string | null
  unitBn: string | null
  tags: string[]
  description: string | null
  descriptionBn: string | null
  delivery: string | null
  deliveryBn: string | null
  inStock: boolean
}

interface Review {
  id: number
  reviewerName: string
  rating: number
  comment: string | null
  createdAt: string
}

function StarRating({ rating, size = 'w-4 h-4' }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${size} ${i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  )
}

function formatTaka(amount: number) {
  return `৳ ${amount.toLocaleString('en-IN')}`
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const { lang } = useLanguage()

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  // Review form
  const [reviewerName, setReviewerName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewMsg, setReviewMsg] = useState('')

  // Buy Now form
  const [showBuyForm, setShowBuyForm] = useState(false)
  const [mobileNumber, setMobileNumber] = useState('')
  const [division, setDivision] = useState('')
  const [district, setDistrict] = useState('')
  const [upazila, setUpazila] = useState('')
  const [villageOrArea, setVillageOrArea] = useState('')
  const [googleMapsLink, setGoogleMapsLink] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderMsg, setOrderMsg] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [showPaymentInfo, setShowPaymentInfo] = useState(false)
  const [transactionId, setTransactionId] = useState('')

  const [cartMsg, setCartMsg] = useState('')

  async function fetchData() {
    setLoading(true)
    const { data: productData } = await supabase.from('products').select('*').eq('id', productId).single()
    if (productData) {
      setProduct({
        id: productData.id,
        category: productData.category,
        name: productData.name,
        nameBn: productData.name_bn,
        image: productData.image,
        videoUrl: productData.video_url,
        price: Number(productData.price),
        originalPrice: productData.original_price ? Number(productData.original_price) : null,
        unit: productData.unit,
        unitBn: productData.unit_bn,
        tags: productData.tags ?? [],
        description: productData.description,
        descriptionBn: productData.description_bn,
        delivery: productData.delivery,
        deliveryBn: productData.delivery_bn,
        inStock: productData.in_stock ?? true,
      })
    }

    const { data: reviewData } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    if (reviewData) {
      setReviews(reviewData.map((r: any) => ({
        id: r.id,
        reviewerName: r.reviewer_name,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at,
      })))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [productId])

  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault()
    setReviewMsg('')
    if (!reviewerName || !reviewComment) {
      setReviewMsg(lang === 'EN' ? 'Please enter your name and a comment.' : 'অনুগ্রহ করে আপনার নাম ও মন্তব্য লিখুন।')
      return
    }
    setSubmittingReview(true)
    const { error } = await supabase.from('product_reviews').insert([{
      product_id: Number(productId),
      reviewer_name: reviewerName,
      rating: reviewRating,
      comment: reviewComment,
    }])
    setSubmittingReview(false)
    if (error) {
      setReviewMsg(lang === 'EN' ? 'Something went wrong submitting your review.' : 'রিভিউ জমা দিতে সমস্যা হয়েছে।')
    } else {
      setReviewerName('')
      setReviewComment('')
      setReviewRating(5)
      setReviewMsg(lang === 'EN' ? 'Thank you for your review!' : 'আপনার রিভিউর জন্য ধন্যবাদ!')
      fetchData()
    }
  }

  async function handleAddToCart() {
    if (!product) return
    const existingCart = JSON.parse(window.localStorage.getItem('origin-agro-cart') || '[]')
    const existingIndex = existingCart.findIndex((item: any) => item.productId === product.id)
    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity += quantity
    } else {
      existingCart.push({
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      })
    }
    window.localStorage.setItem('origin-agro-cart', JSON.stringify(existingCart))
    setCartMsg(lang === 'EN' ? 'Added to cart!' : 'কার্টে যোগ হয়েছে!')
    setTimeout(() => setCartMsg(''), 2500)
  }

  async function handleBuyNowClick() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/account')
      return
    }

    const { data: profile } = await supabase
      .from('customer_profiles')
      .select('mobile_number, division, district, upazila, village_or_area, google_maps_link')
      .eq('id', session.user.id)
      .single()

    if (profile) {
      if (profile.mobile_number) setMobileNumber(profile.mobile_number)
      if (profile.division) setDivision(profile.division)
      if (profile.district) setDistrict(profile.district)
      if (profile.upazila) setUpazila(profile.upazila)
      if (profile.village_or_area) setVillageOrArea(profile.village_or_area)
      if (profile.google_maps_link) setGoogleMapsLink(profile.google_maps_link)
    }

    setShowBuyForm(true)
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()
    setOrderMsg('')

    const hasMapsLink = googleMapsLink.trim().length > 0

    if (!mobileNumber) {
      setOrderMsg(lang === 'EN' ? 'Please enter your mobile number.' : 'অনুগ্রহ করে মোবাইল নম্বর দিন।')
      return
    }
    if (!hasMapsLink && (!division || !district || !upazila)) {
      setOrderMsg(lang === 'EN'
        ? 'Please provide a Google Maps link, or fill in Division, District, and Upazila.'
        : 'অনুগ্রহ করে গুগল ম্যাপস লিংক দিন, অথবা বিভাগ, জেলা ও উপজেলা পূরণ করুন।')
      return
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !transactionId.trim()) {
      setOrderMsg(lang === 'EN' ? 'Please enter the Transaction ID.' : 'অনুগ্রহ করে ট্রানজেকশন আইডি লিখুন।')
      return
    }

    if (!product) return

    setPlacingOrder(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setPlacingOrder(false)
      router.push('/account')
      return
    }

    const addressSummary = hasMapsLink
      ? googleMapsLink
      : `\( {villageOrArea ? villageOrArea + ', ' : ''} \){upazila}, ${district}, ${division}`

    const { error } = await supabase.from('orders').insert([{
      user_id: session.user.id,
      product_id: product.id,
      product_name: product.name,
      product_image: product.image,
      unit_price: product.price,
      quantity,
      total_price: product.price * quantity,
      delivery_address: addressSummary,
      mobile_number: mobileNumber,
      payment_method: paymentMethod,
      payment_status: 'unpaid',
      transaction_id: transactionId.trim() || null,
      status: 'pending',
      division: division || null,
      district: district || null,
      upazila: upazila || null,
      village_or_area: villageOrArea || null,
      google_maps_link: googleMapsLink || null,
    }])

    if (!error) {
      await supabase.from('customer_profiles').update({
        mobile_number: mobileNumber,
        division: division || null,
        district: district || null,
        upazila: upazila || null,
        village_or_area: villageOrArea || null,
        google_maps_link: googleMapsLink || null,
      }).eq('id', session.user.id)
    }

    setPlacingOrder(false)

    if (error) {
      setOrderMsg(lang === 'EN' ? 'Something went wrong placing your order. Please try again.' : 'অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।')
    } else {
      setOrderPlaced(true)
    }
  }

  if (loading) {
    return (
      <main>
        <TopBar />
        <Navbar />
        <div className="text-center py-24 text-gray-500">
          {lang === 'EN' ? 'Loading product...' : 'পণ্য লোড হচ্ছে...'}
        </div>
        <MegaFooter />
      </main>
    )
  }

  if (!product) {
    return (
      <main>
        <TopBar />
        <Navbar />
        <div className="text-center py-24 text-gray-500">
          {lang === 'EN' ? 'Product not found.' : 'পণ্য পাওয়া যায়নি।'}
        </div>
        <MegaFooter />
      </main>
    )
  }

  const displayName = lang === 'EN' ? product.name : (product.nameBn || product.name)
  const displayDescription = lang === 'EN' ? product.description : (product.descriptionBn || product.description)
  const displayDelivery = lang === 'EN' ? product.delivery : (product.deliveryBn || product.delivery)
  const displayUnit = lang === 'EN' ? product.unit : (product.unitBn || product.unit)

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="bg-[#F7F4EE] py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="/#shop" className="inline-flex items-center gap-1.5 text-gray-600 hover:text-[#0A5C36] text-sm font-medium mb-6">
            <ArrowLeft className="w-4 h-4" />
            {lang === 'EN' ? 'Back to Shop' : 'শপে ফিরে যান'}
          </a>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* Image / Video */}
            <div>
              <div className="relative h-80 sm:h-96 rounded-xl overflow-hidden bg-gray-100">
                <Image src={product.image || '/placeholder.jpg'} alt={displayName} fill className="object-cover" />
              </div>
              {product.videoUrl && (
                <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe src={product.videoUrl} className="w-full h-full" allowFullScreen title="Product video" />
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#F26522] mb-2">{product.category}</p>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">{displayName}</h1>

              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={avgRating || 0} />
                <span className="text-sm text-gray-500">
                  {reviews.length > 0 ? (
                    <>
                      {avgRating.toFixed(1)} ({reviews.length}{' '}
                      {lang === 'EN' ? (reviews.length > 1 ? 'reviews' : 'review') : 'রিভিউ'})
                    </>
                  ) : (
                    lang === 'EN' ? 'No reviews yet' : 'এখনো কোনো রিভিউ নেই'
                  )}
                </span>
              </div>

              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              )}

              {displayDescription && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{displayDescription}</p>
              )}

              {displayDelivery && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                  <Truck className="w-4 h-4" />
                  {displayDelivery}
                </div>
              )}

              <div className="flex items-baseline gap-3 mb-6">
                <p className="text-3xl font-extrabold text-[#0A5C36]">{formatTaka(product.price)}</p>
                {product.originalPrice && <p className="text-gray-400 line-through">{formatTaka(product.originalPrice)}</p>}
                {displayUnit && <p className="text-gray-400 text-sm">/ {displayUnit}</p>}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-bold text-gray-700">
                  {lang === 'EN' ? 'Quantity' : 'পরিমাণ'}
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1.5 text-gray-600 hover:bg-gray-50">−</button>
                  <span className="px-4 py-1.5 text-sm font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-50">+</button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold border-2 border-[#0A5C36] text-[#0A5C36] hover:bg-[#0A5C36] hover:text-white transition-colors">
                  <ShoppingCart className="w-4 h-4" />
                  {lang === 'EN' ? 'Add to Cart' : 'কার্টে যোগ করুন'}
                </button>
                <button onClick={handleBuyNowClick} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold bg-[#F26522] hover:bg-[#d4551a] text-white transition-colors">
                  <Zap className="w-4 h-4" />
                  {lang === 'EN' ? 'Buy Now' : 'এখনই কিনুন'}
                </button>
              </div>
              {cartMsg && <p className="text-[#0A5C36] text-sm font-medium mt-3">{cartMsg}</p>}

              {/* Buy Now Form */}
              {showBuyForm && !orderPlaced && (
                <form onSubmit={handlePlaceOrder} className="mt-6 bg-[#F7F4EE] rounded-xl p-5 space-y-3">
                  <p className="font-bold text-gray-900 text-sm">
                    {lang === 'EN' ? 'Complete Your Order' : 'আপনার অর্ডার সম্পন্ন করুন'}
                  </p>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder={lang === 'EN' ? 'Mobile Number *' : 'মোবাইল নম্বর *'}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm"
                  />

                  <AddressFields
                    division={division} setDivision={setDivision}
                    district={district} setDistrict={setDistrict}
                    upazila={upazila} setUpazila={setUpazila}
                    villageOrArea={villageOrArea} setVillageOrArea={setVillageOrArea}
                    googleMapsLink={googleMapsLink} setGoogleMapsLink={setGoogleMapsLink}
                  />

                  <select
                    value={paymentMethod}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value)
                      setShowPaymentInfo(false)
                      setTransactionId('')
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm bg-white"
                  >
                    <option value="cash_on_delivery">{lang === 'EN' ? 'Cash on Delivery' : 'ক্যাশ অন ডেলিভারি'}</option>
                    <option value="bkash">{lang === 'EN' ? 'bKash' : 'বিকাশ'}</option>
                    <option value="nagad">{lang === 'EN' ? 'Nagad' : 'নগদ'}</option>
                    <option value="bank">{lang === 'EN' ? 'Bank Transfer' : 'ব্যাংক ট্রান্সফার'}</option>
                  </select>

                  {/* bKash / Nagad Payment Box */}
                  {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                    <div className="bg-white border border-[#0A5C36]/20 rounded-xl p-4 space-y-3 text-sm">
                      <p className="font-bold text-gray-900">
                        {paymentMethod === 'bkash'
                          ? (lang === 'EN' ? 'Pay with bKash' : 'বিকাশে পেমেন্ট করুন')
                          : (lang === 'EN' ? 'Pay with Nagad' : 'নগদে পেমেন্ট করুন')}
                      </p>
                      <p className="text-gray-700">
                        {lang === 'EN' ? 'Number:' : 'নম্বর:'} <span className="font-extrabold text-[#0A5C36]">01586207756</span>
                      </p>
                      <p className="text-gray-700">
                        {lang === 'EN' ? 'Amount:' : 'পরিমাণ:'} <span className="font-extrabold">{formatTaka(product.price * quantity)}</span>
                      </p>
                      <ol className="list-decimal list-inside text-gray-600 space-y-1">
                        <li>{lang === 'EN' ? 'Open bKash / Nagad app' : 'বিকাশ / নগদ অ্যাপ খুলুন'}</li>
                        <li>{lang === 'EN' ? 'Select Send Money' : 'সেন্ড মানি সিলেক্ট করুন'}</li>
                        <li>{lang === 'EN' ? 'Enter the number above' : 'উপরের নম্বরটি দিন'}</li>
                        <li>{lang === 'EN' ? 'Enter the exact amount' : 'সঠিক পরিমাণ দিন'}</li>
                        <li>{lang === 'EN' ? 'Complete the payment' : 'পেমেন্ট সম্পন্ন করুন'}</li>
                      </ol>
                      <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs">
                        {lang === 'EN'
                          ? '⚠️ Important: After payment, collect the Transaction ID from the confirmation SMS or app history.'
                          : '⚠️ গুরুত্বপূর্ণ: পেমেন্টের পর কনফার্মেশন SMS বা অ্যাপ হিস্টরি থেকে ট্রানজেকশন আইডি সংগ্রহ করুন।'}
                      </p>

                      {!showPaymentInfo ? (
                        <button
                          type="button"
                          onClick={() => setShowPaymentInfo(true)}
                          className="w-full py-2.5 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors"
                        >
                          {lang === 'EN' ? 'I have paid' : 'আমি পেমেন্ট করেছি'}
                        </button>
                      ) : (
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder={lang === 'EN' ? 'Enter Transaction ID *' : 'ট্রানজেকশন আইডি লিখুন *'}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm"
                        />
                      )}
                    </div>
                  )}

                  <p className="text-sm font-bold text-gray-800">
                    {lang === 'EN' ? 'Total' : 'মোট'}: {formatTaka(product.price * quantity)}
                  </p>
                  {orderMsg && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2">{orderMsg}</p>}
                  <button
                    type="submit"
                    disabled={placingOrder || ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !showPaymentInfo)}
                    className="w-full py-3 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors disabled:opacity-60"
                  >
                    {placingOrder
                      ? (lang === 'EN' ? 'Placing Order...' : 'অর্ডার করা হচ্ছে...')
                      : (lang === 'EN' ? 'Confirm Order' : 'অর্ডার নিশ্চিত করুন')}
                  </button>
                </form>
              )}

              {orderPlaced && (
                <div className="mt-6 bg-[#F7F4EE] border border-[#0A5C36]/20 rounded-xl p-5 text-center">
                  <p className="font-bold text-gray-900">
                    {lang === 'EN' ? 'Order Received!' : 'অর্ডার গ্রহণ করা হয়েছে!'}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {lang === 'EN'
                      ? 'We have received your order. Within a few hours your order history will be updated from Unpaid to Paid after we verify the transaction.'
                      : 'আমরা আপনার অর্ডার পেয়েছি। ট্রানজেকশন যাচাই করার পর কয়েক ঘণ্টার মধ্যে আপনার অর্ডার হিস্টরি Unpaid থেকে Paid-এ আপডেট হবে।'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8 bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">
              {lang === 'EN' ? 'Customer Reviews' : 'কাস্টমার রিভিউ'}
            </h2>

            {reviews.length === 0 && (
              <p className="text-gray-500 text-sm mb-6">
                {lang === 'EN' ? 'No reviews yet. Be the first to review this product!' : 'এখনো কোনো রিভিউ নেই। প্রথম রিভিউ দিন!'}
              </p>
            )}

            <div className="space-y-5 mb-8">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-9 h-9 bg-[#0A5C36]/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-[#0A5C36]" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{review.reviewerName}</p>
                      <StarRating rating={review.rating} size="w-3 h-3" />
                    </div>
                  </div>
                  {review.comment && <p className="text-gray-600 text-sm leading-relaxed ml-12">{review.comment}</p>}
                </div>
              ))}
            </div>

            {/* Review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-[#F7F4EE] rounded-xl p-5 space-y-3">
              <p className="font-bold text-gray-900 text-sm">
                {lang === 'EN' ? 'Write a Review' : 'রিভিউ লিখুন'}
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button key={i} type="button" onClick={() => setReviewRating(i)}>
                    <Star className={`w-6 h-6 ${i <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder={lang === 'EN' ? 'Your Name *' : 'আপনার নাম *'}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm"
              />
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder={lang === 'EN' ? 'Share your experience with this product *' : 'এই পণ্য নিয়ে আপনার অভিজ্ঞতা শেয়ার করুন *'}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm resize-none"
              />
              {reviewMsg && <p className="text-sm text-[#0A5C36] font-medium">{reviewMsg}</p>}
              <button type="submit" disabled={submittingReview} className="py-2.5 px-6 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors disabled:opacity-60 text-sm">
                {submittingReview
                  ? (lang === 'EN' ? 'Submitting...' : 'জমা হচ্ছে...')
                  : (lang === 'EN' ? 'Submit Review' : 'রিভিউ জমা দিন')}
              </button>
            </form>
          </div>
        </div>
      </section>

      <MegaFooter />
    </main>
  )
}
