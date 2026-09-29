'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/language-context'
import { loginIdToAuthEmail, mobileToAuthEmail, normalizeMobile } from '@/lib/auth-helpers'
import { User, Mail, Lock, Phone, CheckCircle2, MessageCircle } from 'lucide-react'

interface AuthFormProps {
  onSuccess?: () => void
}

const SUPPORT_MOBILE = '01586207756'
const SUPPORT_WHATSAPP = '8801586207756'

function looksLikeMobile(value: string) {
  const digits = normalizeMobile(value)
  return !value.includes('@') && digits.length >= 10
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const { lang } = useLanguage()
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')

  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [email, setEmail] = useState('')
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [infoMsg, setInfoMsg] = useState('')
  const [showSupportBox, setShowSupportBox] = useState(false)

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setInfoMsg('')
    setShowSupportBox(false)

    const id = loginId.trim()
    if (!id) {
      setErrorMsg(lang === 'EN' ? 'Please enter your email or mobile number.' : 'অনুগ্রহ করে ইমেইল বা মোবাইল নম্বর দিন।')
      return
    }

    // Mobile-only account → contact support
    if (looksLikeMobile(id)) {
      setShowSupportBox(true)
      return
    }

    setSubmitting(true)
    const { error } = await supabase.auth.resetPasswordForEmail(id.toLowerCase(), {
      redirectTo: 'https://originagrobd.com/account/reset-password',
    })
    setSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    setInfoMsg(
      lang === 'EN'
        ? 'If an account exists with that email, a password reset link has been sent. Please check your inbox.'
        : 'এই ইমেইলে অ্যাকাউন্ট থাকলে পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। ইনবক্স চেক করুন।'
    )
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setInfoMsg('')
    setShowSupportBox(false)

    if (!fullName.trim()) {
      setErrorMsg(lang === 'EN' ? 'Please enter your full name.' : 'অনুগ্রহ করে আপনার নাম লিখুন।')
      return
    }
    if (!mobileNumber.trim()) {
      setErrorMsg(lang === 'EN' ? 'Please enter your mobile number.' : 'অনুগ্রহ করে মোবাইল নম্বর দিন।')
      return
    }
    if (!password) {
      setErrorMsg(lang === 'EN' ? 'Please enter a password.' : 'অনুগ্রহ করে পাসওয়ার্ড দিন।')
      return
    }
    if (password.length < 6) {
      setErrorMsg(lang === 'EN' ? 'Password must be at least 6 characters.' : 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।')
      return
    }

    const authEmail = email.trim()
      ? email.trim().toLowerCase()
      : mobileToAuthEmail(mobileNumber)

    setSubmitting(true)

    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          mobile_number: mobileNumber.trim(),
        },
      },
    })

    setSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }

    // Create / update profile
    if (data.user) {
      const { data: existing } = await supabase
        .from('customer_profiles')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle()

      const payload = {
        full_name: fullName.trim(),
        mobile_number: mobileNumber.trim(),
        role: 'customer' as const,
      }

      if (existing) {
        await supabase.from('customer_profiles').update(payload).eq('id', data.user.id)
      } else {
        await supabase.from('customer_profiles').insert([{ id: data.user.id, ...payload }])
      }
    }

    if (data.session) {
      onSuccess?.()
    } else {
      // Try auto login (confirm email is off)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password,
      })
      if (signInError) {
        setInfoMsg(
          lang === 'EN'
            ? 'Account created! You can now log in with your mobile or email and password.'
            : 'অ্যাকাউন্ট তৈরি হয়েছে! এখন মোবাইল বা ইমেইল এবং পাসওয়ার্ড দিয়ে লগ ইন করুন।'
        )
      } else {
        onSuccess?.()
      }
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setInfoMsg('')
    setShowSupportBox(false)

    if (!loginId.trim() || !password) {
      setErrorMsg(
        lang === 'EN'
          ? 'Please enter your email or mobile number and password.'
          : 'অনুগ্রহ করে ইমেইল বা মোবাইল নম্বর এবং পাসওয়ার্ড দিন।'
      )
      return
    }

    const authEmail = loginIdToAuthEmail(loginId)

    setSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password,
    })

    setSubmitting(false)

    if (error) {
      setErrorMsg(
        lang === 'EN'
          ? 'Invalid login or password. Try again.'
          : 'লগ ইন বা পাসওয়ার্ড ভুল। আবার চেষ্টা করুন।'
      )
      return
    }

    onSuccess?.()
  }

  function t(en: string, bn: string) {
    return lang === 'EN' ? en : bn
  }

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
      <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1">
        <button
          type="button"
          onClick={() => { setMode('login'); setErrorMsg(''); setInfoMsg(''); setShowSupportBox(false) }}
          className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === 'login' ? 'bg-white text-[#0A5C36] shadow-sm' : 'text-gray-500'}`}
        >
          {t('Log In', 'লগ ইন')}
        </button>
        <button
          type="button"
          onClick={() => { setMode('signup'); setErrorMsg(''); setInfoMsg(''); setShowSupportBox(false) }}
          className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === 'signup' ? 'bg-white text-[#0A5C36] shadow-sm' : 'text-gray-500'}`}
        >
          {t('Sign Up', 'সাইন আপ')}
        </button>
      </div>

      <div className="text-center mb-6">
        <h4 className="font-extrabold text-gray-900 text-lg">
          {mode === 'login'
            ? t('Welcome Back', 'স্বাগতম')
            : mode === 'signup'
              ? t('Create Your Account', 'অ্যাকাউন্ট তৈরি করুন')
              : t('Reset Your Password', 'পাসওয়ার্ড রিসেট')}
        </h4>
        <p className="text-gray-500 text-xs mt-1">
          {mode === 'login'
            ? t('Log in with email or mobile', 'ইমেইল বা মোবাইল দিয়ে লগ ইন করুন')
            : mode === 'signup'
              ? t('Sign up in a minute', 'এক মিনিটে সাইন আপ করুন')
              : t('Recover your account', 'অ্যাকাউন্ট পুনরুদ্ধার করুন')}
        </p>
      </div>

      {mode === 'forgot' ? (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <p className="text-gray-500 text-sm text-center -mt-2 mb-2">
            {t(
              'Enter your email for a reset link, or mobile to contact support.',
              'রিসেট লিংকের জন্য ইমেইল দিন, অথবা সাপোর্টের জন্য মোবাইল দিন।'
            )}
          </p>

          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder={t('Email or Mobile number', 'ইমেইল অথবা মোবাইল নম্বর')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm"
            />
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

          {showSupportBox && (
            <div className="rounded-2xl border border-[#0A5C36]/25 bg-[#F7F4EE] p-5 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0A5C36]/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-[#0A5C36]" />
              </div>
              <p className="font-extrabold text-gray-900 text-sm">
                {t('Please contact support', 'অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন')}
              </p>
              <p className="text-gray-600 text-xs leading-relaxed">
                {t(
                  'This account was created with a mobile number only. Our team can set a temporary password for you.',
                  'এই অ্যাকাউন্ট শুধু মোবাইল নম্বর দিয়ে তৈরি। আমাদের টিম আপনার জন্য অস্থায়ী পাসওয়ার্ড সেট করে দিতে পারবে।'
                )}
              </p>
              <p className="text-sm font-bold text-[#0A5C36]">
                {t('WhatsApp / Call', 'হোয়াটসঅ্যাপ / কল')}: {SUPPORT_MOBILE}
              </p>
              <a
                href={`https://wa.me/\( {SUPPORT_WHATSAPP}?text= \){encodeURIComponent(
                  lang === 'EN'
                    ? `Hello Origin Agro, I forgot my password. My mobile: ${loginId.trim()}`
                    : `হ্যালো Origin Agro, আমি পাসওয়ার্ড ভুলে গেছি। আমার মোবাইল: ${loginId.trim()}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold bg-[#25D366] hover:bg-[#1ebe57] text-white text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {t('Chat on WhatsApp', 'হোয়াটসঅ্যাপে মেসেজ করুন')}
              </a>
            </div>
          )}

          {!showSupportBox && (
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors duration-200 disabled:opacity-60"
            >
              {submitting
                ? t('Please wait...', 'অপেক্ষা করুন...')
                : t('Continue', 'এগিয়ে যান')}
            </button>
          )}

          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setInfoMsg(''); setShowSupportBox(false) }}
            className="w-full text-center text-sm text-gray-500 hover:text-[#0A5C36] font-medium"
          >
            {t('Back to Log In', 'লগ ইনে ফিরে যান')}
          </button>
        </form>
      ) : (
        <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('Full Name *', 'পুরো নাম *')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm"
                />
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder={t('Mobile Number *', 'মোবাইল নম্বর *')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm"
                />
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('Email (optional)', 'ইমেইল (ঐচ্ছিক)')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm"
                />
              </div>
            </>
          )}

          {mode === 'login' && (
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder={t('Email or Mobile number', 'ইমেইল অথবা মোবাইল নম্বর')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm"
                autoComplete="username"
              />
            </div>
          )}

          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('Password', 'পাসওয়ার্ড')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {mode === 'login' && (
            <button
              type="button"
              onClick={() => {
                setMode('forgot')
                setErrorMsg('')
                setInfoMsg('')
                setShowSupportBox(false)
                // keep loginId so forgot form is prefilled
              }}
              className="text-sm text-[#0A5C36] hover:underline font-medium -mt-2"
            >
              {t('Forgot password?', 'পাসওয়ার্ড ভুলে গেছেন?')}
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl font-bold bg-[#0A5C36] hover:bg-[#063D24] text-white transition-colors duration-200 disabled:opacity-60"
          >
            {submitting
              ? t('Please wait...', 'অপেক্ষা করুন...')
              : mode === 'login'
                ? t('Log In', 'লগ ইন')
                : t('Sign Up', 'সাইন আপ')}
          </button>
        </form>
      )}
    </div>
  )
}
