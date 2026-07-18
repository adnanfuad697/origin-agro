'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, CheckCircle2, MessageSquare } from 'lucide-react'

export default function ContactForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (!fullName || !message || (!email && !mobileNumber)) {
      setErrorMsg('Please enter your name, a message, and at least one way to reach you (email or mobile).')
      return
    }

    setSubmitting(true)

    const { error } = await supabase.from('contact_messages').insert([{
      full_name: fullName,
      email: email || null,
      mobile_number: mobileNumber || null,
      subject: subject || null,
      message: message,
      status: 'unread',
    }])

    setSubmitting(false)

    if (error) {
      console.error('Error submitting contact message:', error)
      setErrorMsg('Something went wrong sending your message. Please try again or contact us directly by phone.')
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-[#F26522] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-white" />
        </div>
        <h4 className="font-extrabold text-white text-lg mb-1">Message Sent</h4>
        <p className="text-white/70 text-sm">
          Thank you, {fullName}. We&apos;ve received your message and will get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#F26522] rounded-xl flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-extrabold text-white">Send Us a Message</h4>
          <p className="text-white/60 text-xs">আমাদের একটি বার্তা পাঠান</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your Name *" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#F26522] text-sm" />
          <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="Mobile Number" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#F26522] text-sm" />
        </div>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#F26522] text-sm" />
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#F26522] text-sm" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your Message *" rows={4} className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#F26522] text-sm resize-none" />

        {errorMsg && (
          <p className="text-red-200 text-sm bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-2.5">{errorMsg}</p>
        )}

        <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl font-bold bg-[#F26522] hover:bg-[#d4551a] text-white transition-colors duration-200 disabled:opacity-60 flex items-center justify-center gap-2">
          <Send className="w-4 h-4" />
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  )
}
