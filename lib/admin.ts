import { supabase } from '@/lib/supabase'

export async function getAdminSession() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const { data: profile } = await supabase
    .from('customer_profiles')
    .select('role, full_name')
    .eq('id', session.user.id)
    .maybeSingle()

  if (!profile || profile.role !== 'admin') return null

  return {
    session,
    user: session.user,
    profile,
  }
}
