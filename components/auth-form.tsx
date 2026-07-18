'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Mail, Lock, Phone, CheckCircle2 } from 'lucide-react'

interface AuthFormProps {
  onSuccess?: () => void
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')

  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [infoMsg, setInfoMsg] = useState('')

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setInfoMsg('')

    if (!email) {
      setErrorMsg('Please enter your email address.')
      return
    }

    setSubmitting(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    })

    setSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    setInfoMsg('If an account exists with that email, a password reset link has been sent. Please check your inbox.')
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setInfoMsg('')

    if (!fullName || !email || !password) {
      setErrorMsg('Please fill in your name, email, and password.')
      return
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setSubmitting(false)
      setErrorMsg(error.message)
      return
    }

    // Create the matching profile row, if the user session is available immediately
    if (data.user) {
      await supabase.from('customer_profiles').insert([{
        id: data.user.id,
        full_name: fullName,
        mobile_number: mobileNumber || null,
      }])
    }

    setSubmitting(false)

    if (data.session) {
      // Signed in immediately (email confirmation disabled)
      onSuccess?.()
    } else {
      // Email confirmation required
      setInfoMsg('Account created! Please check your email to confirm your account before logging in.')
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setInfoMsg('')

    if (!email || !password) {
      setErrorMsg('Please enter your email and password.')
      return
    }

    setSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    onSuccess?.()
  }

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
      {/* Mode Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1">
        <button type="button" onClick={() => { setMode('login'); setErrorMsg(''); setInfoMsg('') }} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === 'login' ? 'bg-white text-[#0A5C36] shadow-sm' : 'text-gray-500'}`}>
          Log In
        </button>
        <button type="button" onClick={() => { setMode('signup'); setErrorMsg(''); setInfoMsg('') }} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === 'signup' ? 'bg-white text-[#0A5C36] shadow-sm' : 'text-gray-500'}`}>
          Sign Up
        </button>
      </div>

      <div className="text-center mb-6">
        <h4 className="font-extrabold text-gray-900 text-lg">
          {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Your Account' : 'Reset Your Password'}
        </h4>
        <p className="text-gray-500 text-xs">
          {mode === 'login' ? 'লগ ইন করুন' : mode === 'signup' ? 'একাউন্ট তৈরি করুন' : 'পাসওয়ার্ড রিসেট করুন'}
        </p>
      </div>

      {mode === 'forgot' ? (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <p className="text-gray-500 text-sm text-center -mt-2 mb-2">Enter your email and we&apos;ll send you a link to reset your password.</p>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
          </div>

          {errorMsg && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{errorMsg}</p>
          )}
          {infoMsg && (
            <p className="text-[#0A5C36] text-sm bg-[#F7F4EE] border border-[#0A5C36]/20 rounded-xl px-4 py-2.5 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{infoMsg}</span>
            </p>
          )}

          <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors duration-200 disabled:opacity-60">
            {submitting ? 'Sending...' : 'Send Reset Link'}
          </button>

          <button type="button" onClick={() => { setMode('login'); setErrorMsg(''); setInfoMsg('') }} className="w-full text-center text-sm text-gray-500 hover:text-[#0A5C36] font-medium">
            Back to Log In
          </button>
        </form>
      ) : (
      <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
        {mode === 'signup' && (
          <>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
            </div>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="Mobile Number (Optional)" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
            </div>
          </>
        )}

        <div className="relative">
          <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
        </div>

        <div className="relative">
          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
        </div>

        {mode === 'login' && (
          <button type="button" onClick={() => { setMode('forgot'); setErrorMsg(''); setInfoMsg('') }} className="text-sm text-[#0A5C36] hover:underline font-medium -mt-2">
            Forgot password?
          </button>
        )}

        {errorMsg && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{errorMsg}</p>
        )}
        {infoMsg && (
          <p className="text-[#0A5C36] text-sm bg-[#F7F4EE] border border-[#0A5C36]/20 rounded-xl px-4 py-2.5 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{infoMsg}</span>
          </p>
        )}

        <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors duration-200 disabled:opacity-60">
          {submitting ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Sign Up'}
        </button>
      </form>
      )}
    </div>
  )
}
