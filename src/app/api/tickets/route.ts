import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendTicketCreated } from '@/lib/email'
import { friendlyError } from '@/lib/format'

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot filled in: pretend success, store nothing.
  if (str(body.website, 200)) {
    return NextResponse.json({ ref: 'CRL-0000', email: str(body.email, 254) })
  }

  const input = {
    p_email: str(body.email, 254).toLowerCase(),
    p_name: str(body.name, 120),
    p_company: str(body.company, 160),
    p_product: str(body.product, 20),
    p_category: str(body.category, 80),
    p_subject: str(body.subject, 200),
    p_body: str(body.body, 10000),
  }

  // Runs as the visitor: signed-in users are tied to their account, everyone else is a contact-form request.
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('support_create_ticket', input).single<{
    ticket_id: string
    ticket_ref: string
    ticket_email: string
  }>()

  if (error || !data) {
    const status = error?.message.includes('rate_limited') ? 429 : 400
    if (status === 400 && !/invalid_|field_too_long/.test(error?.message || '')) console.error('[tickets] create', error)
    return NextResponse.json({ error: friendlyError(error?.message) }, { status })
  }

  await sendTicketCreated({
    ref: data.ticket_ref,
    email: data.ticket_email,
    name: input.p_name,
    company: input.p_company,
    product: input.p_product,
    category: input.p_category,
    subject: input.p_subject,
    body: input.p_body,
  })

  return NextResponse.json({ ref: data.ticket_ref, email: data.ticket_email })
}
