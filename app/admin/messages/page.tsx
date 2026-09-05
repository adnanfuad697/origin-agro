'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { MessageSquare, Send } from 'lucide-react'

interface Msg {
  id: number
  user_id: string
  customer_name: string | null
  customer_email: string | null
  sender: 'customer' | 'admin'
  message: string
  created_at: string
}

export default function AdminMessagesPage() {
  const [rows, setRows] = useState<Msg[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)

  async function load() {
    const { data, error } = await supabase
      .from('customer_messages')
      .select('*')
      .order('created_at', { ascending: true })

    if (!error && data) setRows(data as Msg[])
    setLoading(false)
  }

  useEffect(() => {
    load()
    const t = setInterval(load, 5000)
    return () => clearInterval(t)
  }, [])

  const conversations = useMemo(() => {
    const map = new Map<string, { userId: string; name: string; email: string; last: string }>()
    for (const m of rows) {
      const prev = map.get(m.user_id)
      map.set(m.user_id, {
        userId: m.user_id,
        name: m.customer_name || prev?.name || 'Customer',
        email: m.customer_email || prev?.email || '',
        last: m.message,
      })
    }
    return Array.from(map.values()).reverse()
  }, [rows])

  const thread = useMemo(
    () => (selectedUserId ? rows.filter((r) => r.user_id === selectedUserId) : []),
    [rows, selectedUserId]
  )

  const selectedMeta = conversations.find((c) => c.userId === selectedUserId)

  async function sendReply(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedUserId || !reply.trim()) return
    setSending(true)

    const { error } = await supabase.from('customer_messages').insert([
      {
        user_id: selectedUserId,
        customer_name: selectedMeta?.name || null,
        customer_email: selectedMeta?.email || null,
        sender: 'admin',
        message: reply.trim(),
      },
    ])

    setSending(false)
    if (!error) {
      setReply('')
      load()
    } else {
      alert(error.message)
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading messages...</p>

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Messages</h2>
      <p className="text-sm text-gray-500 mb-6">Reply to customer chats (auto refresh 5s)</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[520px]">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 font-bold text-sm">
            Conversations ({conversations.length})
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {conversations.length === 0 && (
              <p className="p-4 text-sm text-gray-500">No messages yet.</p>
            )}
            {conversations.map((c) => (
              <button
                key={c.userId}
                onClick={() => setSelectedUserId(c.userId)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-[#F7F4EE] ${
                  selectedUserId === c.userId ? 'bg-[#F7F4EE]' : ''
                }`}
              >
                <p className="font-bold text-sm text-gray-900 truncate">{c.name}</p>
                <p className="text-xs text-gray-500 truncate">{c.email}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{c.last}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 flex flex-col min-h-[520px]">
          {!selectedUserId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare className="w-10 h-10 mb-2" />
              <p className="text-sm">Select a conversation</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-bold text-gray-900">{selectedMeta?.name}</p>
                <p className="text-xs text-gray-500">{selectedMeta?.email}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[380px]">
                {thread.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.sender === 'admin'
                          ? 'bg-[#0A5C36] text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p>{m.message}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          m.sender === 'admin' ? 'text-white/60' : 'text-gray-400'
                        }`}
                      >
                        {new Date(m.created_at).toLocaleString('en-GB')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendReply} className="p-4 border-t border-gray-100 flex gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type admin reply..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  disabled={sending || !reply.trim()}
                  className="w-11 h-11 rounded-xl bg-[#0A5C36] text-white flex items-center justify-center disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
