import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendCustomerReplied } from '@/lib/email'
import { friendlyError } from '@/lib/format'

export async function POST(request: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  const ref = (await params).ref.toUpperCase()
  const { body } = (await request.json().catch(() => ({}))) as { body?: unknown }
  const text = typeof body === 'string' ? body.trim().slice(0, 10000) : ''
  if (!text) return NextResponse.json({ error: 'Please write a reply first.' }, { status: 400 })

  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return NextResponse.json({ error: friendlyError('not_signed_in') }, { status: 401 })

  const { data: ticket } = await supabase.from('support_tickets').select('id, subject').eq('ref', ref).maybeSingle()
  if (!ticket) return NextResponse.json({ error: friendlyError('not_found') }, { status: 404 })

  const { error } = await supabase.rpc('support_customer_reply', { p_ticket_id: ticket.id, p_body: text })
  if (error) return NextResponse.json({ error: friendlyError(error.message) }, { status: 400 })

  await sendCustomerReplied({ ref, email: auth.user.email || '', subject: ticket.subject, body: text })
  return NextResponse.json({ ok: true })
}
