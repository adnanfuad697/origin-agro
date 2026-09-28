export function normalizeMobile(mobile: string) {
  return mobile.replace(/\D/g, '')
}

export function mobileToAuthEmail(mobile: string) {
  const digits = normalizeMobile(mobile)
  return digits + '@phone.originagro.local'
}

export function loginIdToAuthEmail(loginId: string) {
  const trimmed = loginId.trim()
  if (trimmed.includes('@')) return trimmed.toLowerCase()
  return mobileToAuthEmail(trimmed)
}
