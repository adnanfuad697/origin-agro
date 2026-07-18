'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import TopBar from '@/components/top-bar'
import Navbar from '@/components/navbar'
import MegaFooter from '@/components/mega-footer'
import { Lock, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setSubmitting(true)

    const { error } = await supabase.auth.updateUser({ password })

    setSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    setDone(true)
  }

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="min-h-[60vh] bg-[#F7F4EE] py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          {done ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 bg-[#0A5C36] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-extrabold text-gray-900 text-lg mb-1">Password Updated</h2>
              <p className="text-gray-600 text-sm mb-6">You can now log in with your new password.</p>
              <a href="/account" className="inline-block bg-[#0A5C36] hover:bg-[#063D24] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
                Go to Log In
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
              <div className="text-center mb-6">
                <h1 className="font-extrabold text-gray-900 text-xl">Set New Password</h1>
                <p className="text-gray-500 text-xs mt-1">নতুন পাসওয়ার্ড সেট করুন</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
                </div>

                {errorMsg && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{errorMsg}</p>
                )}

                <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors duration-200 disabled:opacity-60">
                  {submitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <MegaFooter />
    </main>
  )
}
