'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AuthForm from '@/components/auth-form'
import OrderHistory from '@/components/order-history'
import MessagesPanel from '@/components/messages-panel'
import TopBar from '@/components/top-bar'
import Navbar from '@/components/navbar'
import MegaFooter from '@/components/mega-footer'
import { User, LogOut, Package, MessageSquare } from 'lucide-react'

interface Profile {
  full_name: string | null
  mobile_number: string | null
}

export default function AccountPage() {
  const [loadingSession, setLoadingSession] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  async function loadSession() {
    setLoadingSession(true)
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      setUserEmail(session.user.email ?? null)

      let { data: profileData } = await supabase
        .from('customer_profiles')
        .select('full_name, mobile_number')
        .eq('id', session.user.id)
        .single()

      // If no profile row exists yet, create it now (this is guaranteed to work
      // since we have a valid authenticated session at this point).
      if (!profileData) {
        const metaName = (session.user.user_metadata?.full_name as string) || null
        const metaMobile = (session.user.user_metadata?.mobile_number as string) || null

        await supabase.from('customer_profiles').insert([{
          id: session.user.id,
          full_name: metaName,
          mobile_number: metaMobile,
        }])

        profileData = { full_name: metaName, mobile_number: metaMobile }
      }

      setProfile(profileData)
    } else {
      setUserEmail(null)
      setProfile(null)
    }
    setLoadingSession(false)
  }

  useEffect(() => {
    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadSession()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <main>
      <TopBar />
      <Navbar />

      <section className="min-h-[60vh] bg-[#F7F4EE] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loadingSession && (
            <div className="text-center text-gray-500 py-20">Loading...</div>
          )}

          {!loadingSession && !userEmail && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">My Account</h1>
                <p className="text-[#0A5C36] font-medium text-sm mt-1">আমার একাউন্ট</p>
              </div>
              <AuthForm onSuccess={loadSession} />
            </>
          )}

          {!loadingSession && userEmail && (
            <div className="max-w-3xl mx-auto">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-6 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#0A5C36] rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-gray-900 text-lg">{profile?.full_name || 'Welcome'}</h2>
                    <p className="text-gray-500 text-sm">{userEmail}</p>
                    {profile?.mobile_number && <p className="text-gray-400 text-xs">{profile.mobile_number}</p>}
                  </div>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors font-bold text-sm">
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>

              {/* Order History */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[#0A5C36]/10 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#0A5C36]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">My Orders</h3>
                    <p className="text-gray-500 text-xs">আমার অর্ডারসমূহ</p>
                  </div>
                </div>
                <OrderHistory />
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[#F26522]/10 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-[#F26522]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Messages</h3>
                    <p className="text-gray-500 text-xs">বার্তা</p>
                  </div>
                </div>
                <MessagesPanel />
              </div>
            </div>
          )}
        </div>
      </section>

      <MegaFooter />
    </main>
  )
}
