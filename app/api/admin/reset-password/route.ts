import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServiceClient } from '@/lib/supabase-admin'
import { loginIdToAuthEmail, normalizeMobile } from '@/lib/auth-helpers'

function randomPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  let s = ''
  for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const loginId = (body.loginId || '').trim()
    if (!loginId) {
      return NextResponse.json({ error: 'Mobile or email required' }, { status: 400 })
    }

    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: 'Bearer ' + token } } }
    )

    const { data: { user } } = await userClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await userClient
      .from('customer_profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    const service = createServiceClient()
    const authEmail = loginIdToAuthEmail(loginId)
    const mobileDigits = normalizeMobile(loginId)

    let foundId: string | null = null
    let page = 1
    while (page <= 10 && !foundId) {
      const { data, error } = await service.auth.admin.listUsers({ page, perPage: 100 })
      if (error) throw error
      for (const u of data.users) {
        if (u.email && u.email.toLowerCase() === authEmail.toLowerCase()) {
          foundId = u.id
          break
        }
        const metaMobile = normalizeMobile(String(u.user_metadata?.mobile_number || ''))
        if (mobileDigits.length >= 10 && metaMobile && metaMobile.endsWith(mobileDigits.slice(-10))) {
          foundId = u.id
          break
        }
      }
      if (data.users.length < 100) break
      page++
    }

    if (!foundId && mobileDigits.length >= 10) {
      const last10 = mobileDigits.slice(-10)
      const { data: profiles } = await service
        .from('customer_profiles')
        .select('id, mobile_number')
        .not('mobile_number', 'is', null)
        .limit(500)

      if (profiles) {
        for (const p of profiles) {
          const m = normalizeMobile(String(p.mobile_number || ''))
          if (m.endsWith(last10)) {
            foundId = p.id
            break
          }
        }
      }
    }

    if (!foundId) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const tempPassword = randomPassword()
    const { error: updErr } = await service.auth.admin.updateUserById(foundId, {
      password: tempPassword,
      email_confirm: true,
    })

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      temporaryPassword: tempPassword,
      message: 'Share this password via WhatsApp. Customer should change it after login.',
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
  }
}
