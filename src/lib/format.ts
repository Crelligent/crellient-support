const TZ = 'Africa/Lagos'

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: TZ }).format(new Date(iso))
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: TZ,
  }).format(new Date(iso))
}

export function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = s / 60
  if (m < 60) return `${Math.floor(m)} min ago`
  const h = m / 60
  if (h < 24) return `${Math.floor(h)} h ago`
  const d = h / 24
  if (d < 7) return `${Math.floor(d)} d ago`
  return formatDate(iso)
}

/** Maps database exception codes to messages people can act on. */
export function friendlyError(message: string | undefined) {
  const m = message || ''
  if (m.includes('rate_limited')) return 'You have sent several requests in the last hour. Please wait a little, or reply on an existing request.'
  if (m.includes('invalid_email')) return 'Please enter a valid email address.'
  if (m.includes('invalid_subject')) return 'Please add a subject of at least 3 characters.'
  if (m.includes('invalid_body')) return 'Please describe the issue in a little more detail (at least 10 characters).'
  if (m.includes('invalid_product')) return 'Please choose what your request is about.'
  if (m.includes('ticket_closed')) return 'This request is closed. Please open a new request and mention the reference.'
  if (m.includes('not_signed_in')) return 'Your session has expired. Please sign in again.'
  if (m.includes('not_found')) return 'We could not find that request on your account.'
  return 'Something went wrong. Please try again, or email support@crelligent.com.'
}
