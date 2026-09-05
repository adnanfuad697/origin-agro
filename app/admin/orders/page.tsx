'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface OrderRow {
  id: number
  product_name: string
  quantity: number
  total_price: number
  payment_method: string
  payment_status: string
  transaction_id: string | null
  delivery_address: string | null
  status: string
  created_at: string
}

const STATUSES = ['placed', 'confirmed', 'on_the_way', 'delivered', 'cancelled']

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
      <p className="text-sm text-gray-500 mb-6">Update payment and delivery status</p>

      <div className="space-y-4">
        {orders.length === 0 && (
          <p className="text-sm text-gray-500">No orders yet.</p>
        )}

        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-extrabold text-gray-900">
                  #{o.id} · {o.product_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Qty {o.quantity} · ৳ {Number(o.total_price).toLocaleString('en-IN')} ·{' '}
                  {new Date(o.created_at).toLocaleString('en-GB')}
                </p>
                {o.delivery_address && (
                  <p className="text-xs text-gray-500 mt-1">Address: {o.delivery_address}</p>
                )}
                {o.transaction_id && (
                  <p className="text-xs text-gray-500 mt-1">Txn: {o.transaction_id}</p>
                )}
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  o.payment_status === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {o.payment_status || 'unpaid'}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">
                  Order status
                </label>
                <select
                  value={o.status === 'pending' ? 'placed' : o.status}
                  disabled={savingId === o.id}
                  onChange={(e) => updateOrder(o.id, { status: e.target.value })}
                  className="text-sm border border-gray-300 rounded-xl px-3 py-2 focus:border-[#0A5C36] focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">
                  Payment
                </label>
                <select
                  value={o.payment_status || 'unpaid'}
                  disabled={savingId === o.id}
                  onChange={(e) =>
                    updateOrder(o.id, { payment_status: e.target.value })
                  }
                  className="text-sm border border-gray-300 rounded-xl px-3 py-2 focus:border-[#0A5C36] focus:outline-none"
                >
                  <option value="unpaid">unpaid</option>
                  <option value="paid">paid</option>
                </select>
              </div>

              <p className="text-xs text-gray-400 self-end pb-2">
                Method: {o.payment_method}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
