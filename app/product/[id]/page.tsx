'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import TopBar from '@/components/top-bar'
import Navbar from '@/components/navbar'
import MegaFooter from '@/components/mega-footer'
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
  tags: string[]
  description: string | null
  delivery: string | null
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
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderMsg, setOrderMsg] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)

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
        tags: productData.tags ?? [],
        description: productData.description,
        delivery: productData.delivery,
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
      setReviewMsg('Please enter your name and a comment.')
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
      setReviewMsg('Something went wrong submitting your review.')
    } else {
      setReviewerName('')
      setReviewComment('')
      setReviewRating(5)
      setReviewMsg('Thank you for your review!')
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
    setCartMsg('Added to cart!')
    setTimeout(() => setCartMsg(''), 2500)
  }

  async function handleBuyNowClick() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/account')
      return
    }
    setShowBuyForm(true)
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()
    setOrderMsg('')
    if (!deliveryAddress || !mobileNumber) {
      setOrderMsg('Please fill in your delivery address and mobile number.')
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

    const { error } = await supabase.from('orders').insert([{
      user_id: session.user.id,
      product_id: product.id,
      product_name: product.name,
      product_image: product.image,
      unit_price: product.price,
      quantity,
      total_price: product.price * quantity,
      delivery_address: deliveryAddress,
      mobile_number: mobileNumber,
      payment_method: paymentMethod,
      status: 'pending',
    }])
    setPlacingOrder(false)

    if (error) {
      setOrderMsg('Something went wrong placing your order. Please try again.')
    } else {
      setOrderPlaced(true)
    }
  }

  if (loading) {
    return (
      <main>
        <TopBar />
        <Navbar />
        <div className="text-center py-24 text-gray-500">Loading product...</div>
        <MegaFooter />
      </main>
    )
  }

  if (!product) {
    return (
      <main>
        <TopBar />
        <Navbar />
        <div className="text-center py-24 text-gray-500">Product not found.</div>
        <MegaFooter />
      </main>
    )
  }

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="bg-[#F7F4EE] py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="/#shop" className="inline-flex items-center gap-1.5 text-gray-600 hover:text-[#0A5C36] text-sm font-medium mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </a>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* Image / Video */}
            <div>
              <div className="relative h-80 sm:h-96 rounded-xl overflow-hidden bg-gray-100">
                <Image src={product.image || '/placeholder.jpg'} alt={product.name} fill className="object-cover" />
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">{product.name}</h1>
              {product.nameBn && <p className="text-[#0A5C36] text-sm mb-3">{product.nameBn}</p>}

              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={avgRating || 0} />
                <span className="text-sm text-gray-500">
                  {reviews.length > 0 ? `${avgRating.toFixed(1)} (${reviews.length} review${reviews.length > 1 ? 's' : ''})` : 'No reviews yet'}
                </span>
              </div>

              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              )}

              {product.description && <p className="text-gray-600 text-sm leading-relaxed mb-4">{product.description}</p>}

              {product.delivery && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                  <Truck className="w-4 h-4" />
                  {product.delivery}
                </div>
              )}

              <div className="flex items-baseline gap-3 mb-6">
                <p className="text-3xl font-extrabold text-[#0A5C36]">{formatTaka(product.price)}</p>
                {product.originalPrice && <p className="text-gray-400 line-through">{formatTaka(product.originalPrice)}</p>}
                {product.unit && <p className="text-gray-400 text-sm">/ {product.unit}</p>}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-bold text-gray-700">Quantity</span>
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
                  Add to Cart
                </button>
                <button onClick={handleBuyNowClick} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold bg-[#F26522] hover:bg-[#d4551a] text-white transition-colors">
                  <Zap className="w-4 h-4" />
                  Buy Now
                </button>
              </div>
              {cartMsg && <p className="text-[#0A5C36] text-sm font-medium mt-3">{cartMsg}</p>}

              {/* Buy Now Form */}
              {showBuyForm && !orderPlaced && (
                <form onSubmit={handlePlaceOrder} className="mt-6 bg-[#F7F4EE] rounded-xl p-5 space-y-3">
                  <p className="font-bold text-gray-900 text-sm">Complete Your Order</p>
                  <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Delivery Address *" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
                  <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="Mobile Number *" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm bg-white">
                    <option value="cash_on_delivery">Cash on Delivery</option>
                    <option value="bkash">bKash (pay on confirmation)</option>
                    <option value="nagad">Nagad (pay on confirmation)</option>
                    <option value="bank">Bank Transfer (pay on confirmation)</option>
                  </select>
                  <p className="text-sm font-bold text-gray-800">Total: {formatTaka(product.price * quantity)}</p>
                  {orderMsg && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2">{orderMsg}</p>}
                  <button type="submit" disabled={placingOrder} className="w-full py-3 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors disabled:opacity-60">
                    {placingOrder ? 'Placing Order...' : 'Confirm Order'}
                  </button>
                </form>
              )}

              {orderPlaced && (
                <div className="mt-6 bg-[#F7F4EE] border border-[#0A5C36]/20 rounded-xl p-5 text-center">
                  <p className="font-bold text-gray-900">Order Placed!</p>
                  <p className="text-gray-600 text-sm mt-1">We&apos;ll contact you shortly to confirm delivery details.</p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8 bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Customer Reviews</h2>

            {reviews.length === 0 && <p className="text-gray-500 text-sm mb-6">No reviews yet. Be the first to review this product!</p>}

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
              <p className="font-bold text-gray-900 text-sm">Write a Review</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button key={i} type="button" onClick={() => setReviewRating(i)}>
                    <Star className={`w-6 h-6 ${i <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <input type="text" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} placeholder="Your Name *" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
              <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Share your experience with this product *" rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm resize-none" />
              {reviewMsg && <p className="text-sm text-[#0A5C36] font-medium">{reviewMsg}</p>}
              <button type="submit" disabled={submittingReview} className="py-2.5 px-6 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors disabled:opacity-60 text-sm">
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <MegaFooter />
    </main>
  )
}
