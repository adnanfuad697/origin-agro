'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Package, CheckCircle2, Truck, Home, XCircle, Phone, Hash } from 'lucide-react'

interface OrderRow {
  id: number
  product_name: string
  quantity: number
  total_price: number
  payment_method: string
  payment_status: string
  transaction_id: string | null
  delivery_address: string | null
  mobile_number: string | null
  status: string
  created_at: string
}

const TRACK_STEPS = [
  { key: 'placed', label: 'Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'on_the_way', label: 'On the Way', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
]

const ONLINE_METHODS = ['bkash', 'nagad', 'bank']

function methodLabel(method: string) {
  const map: Record<string, string> = {
    cash_on_delivery: 'Cash on Delivery',
    bkash: 'bKash',
    nagad: 'Nagad',
    bank: 'Bank Transfer',
  }
  return map[method] || method
}

function normalizeStatus(status: string) {
  if (status === 'pending') return 'placed'
  return status
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<number | null>(null)

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setOrders(data as OrderRow[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function updateOrder(
    id: number,
    patch: Partial<Pick<OrderRow, 'status' | 'payment_status'>>
  ) {
    setSavingId(id)
    const { error } = await supabase.from('orders').update(patch).eq('id', id)
    setSavingId(null)
    if (error) alert(error.message)
    else load()
  }

  if (loading) return <p className="text-sm text-gray-500">Loading orders...</p>

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Orders</h2>
      <p className="text-sm text-gray-500 mb-6">Track delivery and confirm payments</p>

      <div className="space-y-5">
        {orders.length === 0 && (
          <p className="text-sm text-gray-500">No orders yet.</p>
        )}

        {orders.map((o) => {
          const status = normalizeStatus(o.status)
          const isCancelled = status === 'cancelled'
          const currentIndex = TRACK_STEPS.findIndex((s) => s.key === status)
          const isOnline = ONLINE_METHODS.includes(o.payment_method)
          const paid = o.payment_status === 'paid'

          return (
            <div
              key={o.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <p className="font-extrabold text-gray-900 text-base sm:text-lg">
                    #{o.id} · {o.product_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Qty {o.quantity} · ৳ {Number(o.total_price).toLocaleString('en-IN')} ·{' '}
                    {new Date(o.created_at).toLocaleString('en-GB')}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      paid
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {paid ? 'Paid' : 'Unpaid'}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {methodLabel(o.payment_method)}
                  </span>
                  {isCancelled && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-600">
                      Cancelled
                    </span>
                  )}
                </div>
              </div>

              {/* Contact + address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                {o.mobile_number && (
                  <div className="flex items-center gap-2 text-sm text-gray-700 bg-[#F7F4EE] rounded-xl px-3 py-2">
                    <Phone className="w-4 h-4 text-[#0A5C36] shrink-0" />
                    <span className="font-bold">{o.mobile_number}</span>
                  </div>
                )}
                {o.delivery_address && (
                  <div className="text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2">
                    <span className="font-semibold text-gray-800">Address: </span>
                    {o.delivery_address}
                  </div>
                )}
              </div>

              {/* Transaction ID for online payments */}
              {(isOnline || o.transaction_id) && (
                <div
                  className={`mb-5 rounded-xl px-3 py-2.5 border ${
                    o.transaction_id
                      ? 'bg-green-50 border-green-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Hash className="w-4 h-4 shrink-0 text-gray-600" />
                    <span className="font-bold text-gray-800">Transaction ID:</span>
                    {o.transaction_id ? (
                      <span className="font-mono font-bold text-[#0A5C36] break-all">
                        {o.transaction_id}
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium">
                        Not provided yet
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Premium order track */}
              <div className="mb-5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
                  Order track
                </p>

                {isCancelled ? (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-bold text-red-600">Order Cancelled</span>
                    <button
                      disabled={savingId === o.id}
                      onClick={() => updateOrder(o.id, { status: 'placed' })}
                      className="ml-auto text-xs font-bold text-[#0A5C36] hover:underline"
                    >
                      Restore to Placed
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 sm:gap-2">
                    {TRACK_STEPS.map((step, i) => {
                      const Icon = step.icon
                      const active = i <= currentIndex
                      const isCurrent = i === currentIndex
                      return (
                        <div key={step.key} className="flex items-center flex-1 last:flex-none">
                          <button
                            type="button"
                            disabled={savingId === o.id}
                            onClick={() => updateOrder(o.id, { status: step.key })}
                            className={`flex flex-col items-center gap-1 min-w-[56px] sm:min-w-[72px] px-1 py-2 rounded-xl transition-all ${
                              isCurrent
                                ? 'bg-[#0A5C36] text-white shadow-md scale-[1.02]'
                                : active
                                  ? 'bg-[#0A5C36]/10 text-[#0A5C36]'
                                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-[10px] sm:text-[11px] font-bold leading-tight text-center">
                              {step.label}
                            </span>
                          </button>
                          {i < TRACK_STEPS.length - 1 && (
                            <div
                              className={`flex-1 h-0.5 mx-1 ${
                                i < currentIndex ? 'bg-[#0A5C36]' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {!isCancelled && (
                  <button
                    type="button"
                    disabled={savingId === o.id}
                    onClick={() => updateOrder(o.id, { status: 'cancelled' })}
                    className="mt-3 text-xs font-bold text-red-500 hover:text-red-600"
                  >
                    Mark as Cancelled
                  </button>
                )}
              </div>

              {/* Premium payment toggle */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-2">
                  Payment status
                </p>
                <div className="inline-flex rounded-2xl bg-gray-100 p-1 gap-1">
                  <button
                    type="button"
                    disabled={savingId === o.id}
                    onClick={() => updateOrder(o.id, { payment_status: 'unpaid' })}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      !paid
                        ? 'bg-amber-500 text-white shadow'
                        : 'text-gray-600 hover:bg-white'
                    }`}
                  >
                    Unpaid
                  </button>
                  <button
                    type="button"
                    disabled={savingId === o.id}
                    onClick={() => updateOrder(o.id, { payment_status: 'paid' })}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      paid
                        ? 'bg-[#0A5C36] text-white shadow'
                        : 'text-gray-600 hover:bg-white'
                    }`}
                  >
                    Paid
                  </button>
                </div>
              </div>

              {savingId === o.id && (
                <p className="text-xs text-gray-400 mt-3">Saving...</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
