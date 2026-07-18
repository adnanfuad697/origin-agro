'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import TopBar from '@/components/top-bar'
import Navbar from '@/components/navbar'
import MegaFooter from '@/components/mega-footer'
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
  const [cart, setCart] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  const [showCheckout, setShowCheckout] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderMsg, setOrderMsg] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)

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
    setShowCheckout(true)
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()
    setOrderMsg('')
    if (!deliveryAddress || !mobileNumber) {
      setOrderMsg('Please fill in your delivery address and mobile number.')
      return
    }

    setPlacingOrder(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setPlacingOrder(false)
      router.push('/account')
      return
    }

    // Insert one order row per cart item (keeps the orders table structure simple and consistent)
    const rows = cart.map((item) => ({
      user_id: session.user.id,
      product_id: item.productId,
      product_name: item.name,
      product_image: item.image,
      unit_price: item.price,
      quantity: item.quantity,
      total_price: item.price * item.quantity,
      delivery_address: deliveryAddress,
      mobile_number: mobileNumber,
      payment_method: paymentMethod,
      status: 'pending',
    }))

    const { error } = await supabase.from('orders').insert(rows)
    setPlacingOrder(false)

    if (error) {
      setOrderMsg('Something went wrong placing your order. Please try again.')
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
            Continue Shopping
          </a>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">Your Cart</h1>
          <p className="text-[#0A5C36] text-sm mb-8">আপনার কার্ট</p>

          {orderPlaced ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <div className="w-16 h-16 bg-[#0A5C36] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-extrabold text-gray-900 text-xl mb-1">Order Placed!</h2>
              <p className="text-gray-600 text-sm mb-6">We&apos;ll contact you shortly to confirm delivery details.</p>
              <a href="/account" className="inline-block bg-[#0A5C36] hover:bg-[#063D24] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
                View My Orders
              </a>
            </div>
          ) : !loaded ? (
            <div className="text-center py-16 text-gray-500">Loading cart...</div>
          ) : cart.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Your cart is empty.</p>
              <a href="/#shop" className="inline-block mt-4 bg-[#0A5C36] hover:bg-[#063D24] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
                Browse Shop
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
                <h3 className="font-extrabold text-gray-900 mb-4">Order Summary</h3>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>{formatTaka(total)}</span>
                </div>
                <div className="border-t border-gray-100 my-3" />
                <div className="flex justify-between font-extrabold text-gray-900 mb-5">
                  <span>Total</span>
                  <span>{formatTaka(total)}</span>
                </div>

                {!showCheckout && (
                  <button onClick={handleCheckoutClick} className="w-full py-3.5 rounded-xl font-bold bg-[#F26522] hover:bg-[#d4551a] text-white transition-colors">
                    Proceed to Checkout
                  </button>
                )}

                {showCheckout && (
                  <form onSubmit={handlePlaceOrder} className="space-y-3 mt-2">
                    <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Delivery Address *" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
                    <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="Mobile Number *" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm bg-white">
                      <option value="cash_on_delivery">Cash on Delivery</option>
                      <option value="bkash">bKash (pay on confirmation)</option>
                      <option value="nagad">Nagad (pay on confirmation)</option>
                      <option value="bank">Bank Transfer (pay on confirmation)</option>
                    </select>
                    {orderMsg && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2">{orderMsg}</p>}
                    <button type="submit" disabled={placingOrder} className="w-full py-3.5 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors disabled:opacity-60">
                      {placingOrder ? 'Placing Order...' : 'Confirm Order'}
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
