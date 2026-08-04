'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/language-context'
import { Package, CheckCircle2, Truck, Home, XCircle, Package2 } from 'lucide-react'

interface Order {
  id: number
  productName: string
  productImage: string | null
  quantity: number
  totalPrice: number
  paymentMethod: string
  paymentStatus: string
  transactionId: string | null
  deliveryAddress: string | null
  status: string
  createdAt: string
}

const trackerSteps = [
  { key: 'placed', labelEN: 'Placed', labelBN: 'প্লেসড', icon: Package },
  { key: 'confirmed', labelEN: 'Confirmed', labelBN: 'কনফার্মড', icon: CheckCircle2 },
  { key: 'on_the_way', labelEN: 'On the Way', labelBN: 'আসছে', icon: Truck },
  { key: 'delivered', labelEN: 'Delivered', labelBN: 'ডেলিভার্ড', icon: Home },
]

const paymentMethodLabels: Record<string, { en: string; bn: string }> = {
  cash_on_delivery: { en: 'Cash on Delivery', bn: 'ক্যাশ অন ডেলিভারি' },
  bkash: { en: 'bKash', bn: 'বিকাশ' },
  nagad: { en: 'Nagad', bn: 'নগদ' },
  bank: { en: 'Bank Transfer', bn: 'ব্যাংক ট্রান্সফার' },
}

function formatTaka(amount: number) {
  return `৳ ${amount.toLocaleString('en-IN')}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isWithin24Hours(createdAt: string) {
  const created = new Date(createdAt).getTime()
  const now = Date.now()
  const diffHours = (now - created) / (1000 * 60 * 60)
  return diffHours <= 24
}

export default function OrderHistory() {
  const { lang } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const [confirmOrderId, setConfirmOrderId] = useState<number | null>(null)

  // ===== FIX JUMPING: Lock body scroll when modal is open =====
  useEffect(() => {
    if (confirmOrderId !== null) {
      // Save current scroll position
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'

      return () => {
        // Restore scroll position
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [confirmOrderId])
  // ============================================================

  async function fetchOrders() {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setOrders(data.map((o: any) => ({
        id: o.id,
        productName: o.product_name,
        productImage: o.product_image,
        quantity: o.quantity,
        totalPrice: Number(o.total_price),
        paymentMethod: o.payment_method,
        paymentStatus: o.payment_status || 'unpaid',
        transactionId: o.transaction_id || null,
        deliveryAddress: o.delivery_address || null,
        status: o.status === 'pending' ? 'placed' : (o.status || 'placed'),
        createdAt: o.created_at,
      })))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  async function confirmCancel() {
    if (!confirmOrderId) return

    setCancellingId(confirmOrderId)
    setConfirmOrderId(null)

    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', confirmOrderId)

    setCancellingId(null)

    if (error) {
      console.error('Cancel error:', error)
      alert(lang === 'EN' ? 'Failed to cancel order. Please try again.' : 'অর্ডার বাতিল করা যায়নি। আবার চেষ্টা করুন।')
    } else {
      fetchOrders()
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        {lang === 'EN' ? 'Loading your orders...' : 'আপনার অর্ডার লোড হচ্ছে...'}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">
          {lang === 'EN' ? "You haven't placed any orders yet." : 'আপনি এখনো কোনো অর্ডার করেননি।'}
        </p>
        <a href="/#shop" className="inline-block mt-3 text-[#0A5C36] font-bold text-sm hover:underline">
          {lang === 'EN' ? 'Browse Shop' : 'শপ দেখুন'}
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-5 relative">
      {/* Custom Confirmation Modal */}
      {confirmOrderId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">
              {lang === 'EN' ? 'Cancel this order?' : 'এই অর্ডার বাতিল করবেন?'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {lang === 'EN'
                ? 'This action cannot be undone. Are you sure you want to cancel?'
                : 'এই কাজটি আর ফেরানো যাবে না। আপনি কি নিশ্চিত?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOrderId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                {lang === 'EN' ? 'Keep Order' : 'রাখুন'}
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors"
              >
                {lang === 'EN' ? 'Yes, Cancel' : 'হ্যাঁ, বাতিল করুন'}
              </button>
            </div>
          </div>
        </div>
      )}

      {orders.map((order) => {
        const isCancelled = order.status === 'cancelled'
        const currentStepIndex = trackerSteps.findIndex((s) => s.key === order.status)
        const canCancel =
          !isCancelled &&
          order.status !== 'delivered' &&
          order.status !== 'on_the_way' &&
          isWithin24Hours(order.createdAt)

        const paymentLabel = paymentMethodLabels[order.paymentMethod]
          ? (lang === 'EN'
              ? paymentMethodLabels[order.paymentMethod].en
              : paymentMethodLabels[order.paymentMethod].bn)
          : order.paymentMethod

        return (
          <div key={order.id} className="border border-gray-200 rounded-xl p-4 sm:p-5">
            {/* Top row */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={order.productImage || '/placeholder.jpg'}
                  alt={order.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{order.productName}</p>
                <p className="text-gray-500 text-xs">
                  {lang === 'EN' ? 'Qty' : 'পরিমাণ'}: {order.quantity} · {formatDate(order.createdAt)}
                </p>
              </div>
              <p className="font-extrabold text-[#0A5C36] text-sm shrink-0">
                {formatTaka(order.totalPrice)}
              </p>
            </div>

            {/* Payment + Transaction ID */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  order.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {order.paymentStatus === 'paid'
                  ? (lang === 'EN' ? 'Paid' : 'পেইড')
                  : (lang === 'EN' ? 'Unpaid' : 'আনপেইড')}
              </span>
              <span className="text-xs text-gray-500">{paymentLabel}</span>

              {order.transactionId && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  Txn: {order.transactionId}
                </span>
              )}
            </div>

            {/* Delivery Address */}
            {order.deliveryAddress && (
              <p className="text-xs text-gray-500 mb-4">
                <span className="font-semibold text-gray-700">
                  {lang === 'EN' ? 'Address:' : 'ঠিকানা:'}
                </span>{' '}
                {order.deliveryAddress}
              </p>
            )}

            {/* Tracker or Cancelled */}
            {isCancelled ? (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-bold text-red-600">
                  {lang === 'EN' ? 'Order Cancelled' : 'অর্ডার বাতিল হয়েছে'}
                </span>
              </div>
            ) : (
              <div className="flex items-center mb-4">
                {trackerSteps.map((step, i) => {
                  const Icon = step.icon
                  const isDone = i <= currentStepIndex
                  return (
                    <div key={step.key} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isDone ? 'bg-[#0A5C36] text-white' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[10px] font-medium text-center leading-tight ${
                            isDone ? 'text-[#0A5C36]' : 'text-gray-400'
                          }`}
                        >
                          {lang === 'EN' ? step.labelEN : step.labelBN}
                        </span>
                      </div>
                      {i < trackerSteps.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-1 -mt-4 ${
                            i < currentStepIndex ? 'bg-[#0A5C36]' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Cancel Button */}
            {canCancel && (
              <button
                onClick={() => setConfirmOrderId(order.id)}
                disabled={cancellingId === order.id}
                className="w-full mt-1 py-2 rounded-xl border border-red-300 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors disabled:opacity-60"
              >
                {cancellingId === order.id
                  ? (lang === 'EN' ? 'Cancelling...' : 'বাতিল হচ্ছে...')
                  : (lang === 'EN' ? 'Cancel Order (within 24 hrs)' : 'অর্ডার বাতিল করুন (২৪ ঘণ্টার মধ্যে)')}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
