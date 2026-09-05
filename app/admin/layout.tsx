'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getAdminSession } from '@/lib/admin'
import { supabase } from '@/lib/supabase'
import { MessageSquare, Package, LogOut, LayoutDashboard } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [name, setName] = useState('')

  useEffect(() => {
    async function guard() {
      const admin = await getAdminSession()
      if (!admin) {
        router.replace('/account')
        return
      }
      setName(admin.profile.full_name || admin.user.email || 'Admin')
      setChecking(false)
    }
    guard()
  }, [router, pathname])

  async function logout() {
    await supabase.auth.signOut()
    router.replace('/account')
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center text-gray-500 text-sm">
        Checking admin access...
      </div>
    )
  }

  const nav = [
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { href: '/admin/orders', label: 'Orders', icon: Package },
  ]

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <p className="text-xs font-bold uppercase tracking-widest text-[#F26522]">Origin Agro</p>
          <h1 className="font-extrabold text-gray-900 text-lg">Admin Panel</h1>
          <p className="text-xs text-gray-500 mt-1 truncate">{name}</p>
        </div>

        <nav className="p-3 flex-1 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  active ? 'bg-[#0A5C36] text-white' : 'text-gray-700 hover:bg-[#F7F4EE]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1">
          <Link
            href="/account"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-[#F7F4EE]"
          >
            My Account
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-[#0A5C36]" />
            <span className="font-extrabold text-gray-900">Admin</span>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg ${
                  pathname.startsWith(item.href)
                    ? 'bg-[#0A5C36] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={logout}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600"
            >
              Out
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
