'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { KeyRound, Copy, Check } from 'lucide-react'

export default function AdminCustomersPage() {
  const [loginId, setLoginId] = useState('')
  const [loading, setLoading] = useState(false)
  const [tempPass, setTempPass] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setTempPass(null)
    setCopied(false)

    if (!loginId.trim()) {
      setError('Enter mobile or email')
      return
    }

    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setError('Not logged in')
      setLoading(false)
      return
    }

    const res = await fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + session.access_token,
      },
      body: JSON.stringify({ loginId: loginId.trim() }),
    })

    const json = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(json.error || 'Failed')
      return
    }

    setTempPass(json.temporaryPassword)
  }

  async function copyPass() {
    if (!tempPass) return
    await navigator.clipboard.writeText(tempPass)
    setCopied(true)
  }

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Customers</h2>
      <p className="text-sm text-gray-500 mb-6">
        Reset password by mobile or email. For customers with email, they can also use Forgot password link.
        Use this mainly when they only have mobile.
      </p>

      <form onSubmit={handleReset} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-w-md space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Mobile or Email</label>
          <input
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="01XXXXXXXXX or email@..."
            className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#0A5C36] focus:outline-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A5C36] text-white text-sm font-bold hover:bg-[#084c2c] disabled:opacity-50"
        >
          <KeyRound className="w-4 h-4" />
          {loading ? 'Resetting...' : 'Reset password'}
        </button>
      </form>

      {tempPass && (
        <div className="mt-6 max-w-md bg-green-50 border border-green-200 rounded-2xl p-5">
          <p className="text-sm font-bold text-gray-900 mb-2">Temporary password</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-lg font-mono font-bold text-[#0A5C36] bg-white rounded-xl px-4 py-2 border">
              {tempPass}
            </code>
            <button
              type="button"
              onClick={copyPass}
              className="p-2.5 rounded-xl bg-white border hover:bg-gray-50"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            WhatsApp this to the customer. Ask them to log in, then Change Password from My Account.
          </p>
        </div>
      )}
    </div>
  )
}
