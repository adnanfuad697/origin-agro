'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Package, CheckCircle2, Truck, Home, XCircle, Package2 } from 'lucide-react'

interface Order {
  id: number
  productName: string
  productImage: string | null
  quantity: number
  totalPrice: number
  paymentMethod: string
  paymentStatus: string
  status: string
  createdAt: string
}

const trackerSteps = [
  { key: 'placed', label: 'Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'on_the_way', label: 'On the Way', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
]

const paymentMethodLabels: Record<string, string> = {
  cash_on_delivery: 'Cash on Delivery',
  bkash: 'bKash',
  nagad: 'Nagad',
  bank: 'Bank Transfer',
}

function formatTaka(amount: number) {
  return `৳ ${amount.toLocaleString('en-IN')}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
          status: o.status || 'placed',
          createdAt: o.created_at,
        })))
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  if (loading) {
    return <div className="text-center py-8 text-gray-500 text-sm">Loading your orders...</div>
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">You haven&apos;t placed any orders yet.</p>
        <a href="/#shop" className="inline-block mt-3 text-[#0A5C36] font-bold text-sm hover:underline">Browse Shop</a>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => {
        const isCancelled = order.status === 'cancelled'
        const currentStepIndex = trackerSteps.findIndex((s) => s.key === order.status)

        return (
          <div key={order.id} className="border border-gray-200 rounded-xl p-4 sm:p-5">
            {/* Top row: product info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <Image src={order.productImage || '/placeholder.jpg'} alt={order.productName} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{order.productName}</p>
                <p className="text-gray-500 text-xs">Qty: {order.quantity} · {formatDate(order.createdAt)}</p>
              </div>
              <p className="font-extrabold text-[#0A5C36] text-sm shrink-0">{formatTaka(order.totalPrice)}</p>
            </div>

            {/* Payment badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
              </span>
              <span className="text-xs text-gray-500">{paymentMethodLabels[order.paymentMethod] || order.paymentMethod}</span>
            </div>

            {/* Tracker */}
            {isCancelled ? (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-bold text-red-600">Order Cancelled</span>
              </div>
            ) : (
              <div className="flex items-center">
                {trackerSteps.map((step, i) => {
                  const Icon = step.icon
                  const isDone = i <= currentStepIndex
                  return (
                    <div key={step.key} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDone ? 'bg-[#0A5C36] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-medium text-center leading-tight ${isDone ? 'text-[#0A5C36]' : 'text-gray-400'}`}>{step.label}</span>
                      </div>
                      {i < trackerSteps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 -mt-4 ${i < currentStepIndex ? 'bg-[#0A5C36]' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
