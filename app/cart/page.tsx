'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/language-context'
import TopBar from '@/components/top-bar'
import Navbar from '@/components/navbar'
import MegaFooter from '@/components/mega-footer'
import AddressFields from '@/components/address-fields'
import { Trash2, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react'

interface CartItem {
  productId: number
  name: string
  image: string | null
  price: number
  quantity: number
}

function formatTaka(amount: number) {
  return `৳ ${amount.toLocaleString('en-IN')}`
}

export default function CartPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  const [showCheckout, setShowCheckout] = useState(false)
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

  useEffect(() => {
    const stored = JSON.parse(window.localStorage.getItem('origin-agro-cart') || '[]')
    setCart(stored)
    setLoaded(true)
  }, [])

  function saveCart(updated: CartItem[]) {
    setCart(updated)
    window.localStorage.setItem('origin-agro-cart', JSON.stringify(updated))
  }

  function updateQuantity(productId: number, delta: number) {
    const updated = cart.map((item) =>
      item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    )
    saveCart(updated)
  }

  function removeItem(productId: number) {
    const updated = cart.filter((item) => item.productId !== productId)
    saveCart(updated)
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function handleCheckoutClick() {
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

    setShowCheckout(true)
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

    setPlacingOrder(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setPlacingOrder(false)
      router.push('/account')
      return
    }

    // ===== FIXED ADDRESS LINE =====
    const addressSummary = hasMapsLink
      ? googleMapsLink
      : `\( {villageOrArea ? villageOrArea + ', ' : ''} \){upazila}, ${district}, ${division}`
    // ==============================

    const rows = cart.map((item) => ({
      user_id: session.user.id,
      product_id: item.productId,
      product_name: item.name,
      product_image: item.image,
      unit_price: item.price,
      quantity: item.quantity,
      total_price: item.price * item.quantity,
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
    }))

    const { error } = await supabase.from('orders').insert(rows)

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
      saveCart([])
      setOrderPlaced(true)
    }
  }

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="bg-[#F7F4EE] py-10 min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="/#shop" className="inline-flex items-center gap-1.5 text-gray-600 hover:text-[#0A5C36] text-sm font-medium mb-6">
            <ArrowLeft className="w-4 h-4" />
            {lang === 'EN' ? 'Continue Shopping' : 'কেনাকাটা চালিয়ে যান'}
          </a>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
            {lang === 'EN' ? 'Your Cart' : 'আপনার কার্ট'}
          </h1>

          {orderPlaced ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <div className="w-16 h-16 bg-[#0A5C36] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-extrabold text-gray-900 text-xl mb-1">
                {lang === 'EN' ? 'Order Received!' : 'অর্ডার গ্রহণ করা হয়েছে!'}
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                {lang === 'EN'
                  ? 'We have received your order. Within a few hours your order history will be updated from Unpaid to Paid after we verify the transaction.'
                  : 'আমরা আপনার অর্ডার পেয়েছি। ট্রানজেকশন যাচাই করার পর কয়েক ঘণ্টার মধ্যে আপনার অর্ডার হিস্টরি Unpaid থেকে Paid-এ আপডেট হবে।'}
              </p>
              <a href="/account" className="inline-block bg-[#0A5C36] hover:bg-[#063D24] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
                {lang === 'EN' ? 'View My Orders' : 'আমার অর্ডার দেখুন'}
              </a>
            </div>
          ) : !loaded ? (
            <div className="text-center py-16 text-gray-500">
              {lang === 'EN' ? 'Loading cart...' : 'কার্ট লোড হচ্ছে...'}
            </div>
          ) : cart.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{lang === 'EN' ? 'Your cart is empty.' : 'আপনার কার্ট খালি।'}</p>
              <a href="/#shop" className="inline-block mt-4 bg-[#0A5C36] hover:bg-[#063D24] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
                {lang === 'EN' ? 'Browse Shop' : 'শপ দেখুন'}
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.productId} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <Image src={item.image || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                      <p className="text-[#0A5C36] font-bold text-sm mt-1">{formatTaka(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.productId, -1)} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">−</button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, 1)} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.productId)} aria-label="Remove item" className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
                <h3 className="font-extrabold text-gray-900 mb-4">
                  {lang === 'EN' ? 'Order Summary' : 'অর্ডার সারাংশ'}
                </h3>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{lang === 'EN' ? 'Subtotal' : 'সাবটোটাল'}</span>
                  <span>{formatTaka(total)}</span>
                </div>
                <div className="border-t border-gray-100 my-3" />
                <div className="flex justify-between font-extrabold text-gray-900 mb-5">
                  <span>{lang === 'EN' ? 'Total' : 'মোট'}</span>
                  <span>{formatTaka(total)}</span>
                </div>

                {!showCheckout && (
                  <button onClick={handleCheckoutClick} className="w-full py-3.5 rounded-xl font-bold bg-[#F26522] hover:bg-[#d4551a] text-white transition-colors">
                    {lang === 'EN' ? 'Proceed to Checkout' : 'চেকআউটে যান'}
                  </button>
                )}

                {showCheckout && (
                  <form onSubmit={handlePlaceOrder} className="space-y-3 mt-2">
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
                      <div className="bg-[#F7F4EE] border border-[#0A5C36]/20 rounded-xl p-4 space-y-3 text-sm">
                        <p className="font-bold text-gray-900">
                          {paymentMethod === 'bkash'
                            ? (lang === 'EN' ? 'Pay with bKash' : 'বিকাশে পেমেন্ট করুন')
                            : (lang === 'EN' ? 'Pay with Nagad' : 'নগদে পেমেন্ট করুন')}
                        </p>
                        <p className="text-gray-700">
                          {lang === 'EN' ? 'Number:' : 'নম্বর:'} <span className="font-extrabold text-[#0A5C36]">01586207756</span>
                        </p>
                        <p className="text-gray-700">
                          {lang === 'EN' ? 'Amount:' : 'পরিমাণ:'} <span className="font-extrabold">{formatTaka(total)}</span>
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

                    {orderMsg && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2">{orderMsg}</p>}
                    <button
                      type="submit"
                      disabled={placingOrder || ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !showPaymentInfo)}
                      className="w-full py-3.5 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors disabled:opacity-60"
                    >
                      {placingOrder
                        ? (lang === 'EN' ? 'Placing Order...' : 'অর্ডার করা হচ্ছে...')
                        : (lang === 'EN' ? 'Confirm Order' : 'অর্ডার নিশ্চিত করুন')}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <MegaFooter />
    </main>
  )
}
