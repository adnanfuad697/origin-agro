'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Calendar, CheckCircle2 } from 'lucide-react'

interface AppointmentFormProps {
  planInterest: string
}

const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']
const amountRanges = ['৳50,000 - ৳1,00,000', '৳1,00,000 - ৳3,00,000', '৳3,00,000 - ৳5,00,000', '৳5,00,000+']

export default function AppointmentForm({ planInterest }: AppointmentFormProps) {
  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [email, setEmail] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [amountRange, setAmountRange] = useState('')
  const [notes, setNotes] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (!fullName || !mobileNumber || !preferredDate || !preferredTime) {
      setErrorMsg('Please fill in your name, mobile number, preferred date, and preferred time.')
      return
    }

    setSubmitting(true)

    const { error } = await supabase.from('appointment_bookings').insert([{
      full_name: fullName,
      mobile_number: mobileNumber,
      email: email || null,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      plan_interest: planInterest,
      investment_amount_range: amountRange || null,
      notes: notes || null,
      status: 'pending',
    }])

    setSubmitting(false)

    if (error) {
      console.error('Error submitting appointment:', error)
      setErrorMsg('Something went wrong submitting your request. Please try again or contact us directly.')
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-6 bg-[#F7F4EE] border border-[#0A5C36]/20 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-[#0A5C36] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-white" />
        </div>
        <h4 className="font-extrabold text-gray-900 text-lg mb-1">Appointment Request Received</h4>
        <p className="text-gray-600 text-sm">
          Thank you, {fullName}. Our team will contact you at {mobileNumber} to confirm your visit on {preferredDate} at {preferredTime}.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-6 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#F26522] rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-extrabold text-gray-900">Book an Office Visit</h4>
          <p className="text-gray-500 text-xs">অফিস ভিজিটের জন্য অ্যাপয়েন্টমেন্ট বুক করুন</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name / পূর্ণ নাম *</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Mobile Number / মোবাইল নম্বর *</label>
            <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="01XXXXXXXXX" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email (Optional)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Preferred Date / পছন্দের তারিখ *</label>
            <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Preferred Time / পছন্দের সময় *</label>
            <select value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm bg-white">
              <option value="">Select a time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Approximate Investment Amount (Optional)</label>
          <select value={amountRange} onChange={(e) => setAmountRange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm bg-white">
            <option value="">Select a range</option>
            {amountRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Notes (Optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything you'd like us to know before your visit" rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm resize-none" />
        </div>

        {errorMsg && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{errorMsg}</p>
        )}

        <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors duration-200 disabled:opacity-60">
          {submitting ? 'Submitting...' : 'Request Appointment / অ্যাপয়েন্টমেন্ট অনুরোধ করুন'}
        </button>
      </div>
    </form>
  )
}
