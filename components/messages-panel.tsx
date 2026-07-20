'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, MessageSquare } from 'lucide-react'

interface Message {
  id: number
  sender: 'customer' | 'admin'
  message: string
  createdAt: string
}

export default function MessagesPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function fetchMessages() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('customer_messages')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setMessages(data.map((m: any) => ({
        id: m.id,
        sender: m.sender,
        message: m.message,
        createdAt: m.created_at,
      })))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
    // Light polling so replies show up without needing a manual refresh
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setSending(false)
      return
    }

    const { error } = await supabase.from('customer_messages').insert([{
      user_id: session.user.id,
      customer_name: session.user.user_metadata?.full_name || null,
      customer_email: session.user.email || null,
      sender: 'customer',
      message: newMessage.trim(),
    }])

    setSending(false)

    if (!error) {
      setNewMessage('')
      fetchMessages()
    }
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500 text-sm">Loading messages...</div>
  }

  return (
    <div className="flex flex-col h-[420px]">
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No messages yet. Send us a message below!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.sender === 'customer' ? 'bg-[#0A5C36] text-white' : 'bg-gray-100 text-gray-800'}`}>
              <p className="text-sm leading-relaxed">{msg.message}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === 'customer' ? 'text-white/60' : 'text-gray-400'}`}>{formatTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
        <button type="submit" disabled={sending || !newMessage.trim()} className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors disabled:opacity-50 shrink-0">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
