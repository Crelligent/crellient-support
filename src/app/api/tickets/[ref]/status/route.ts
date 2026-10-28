import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { friendlyError } from '@/lib/format'

export async function POST(request: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  const ref = (await params).ref.toUpperCase()
  const { status } = (await request.json().catch(() => ({}))) as { status?: unknown }
  if (status !== 'resolved' && status !== 'open') {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return NextResponse.json({ error: friendlyError('not_signed_in') }, { status: 401 })

  const { data: ticket } = await supabase.from('support_tickets').select('id').eq('ref', ref).maybeSingle()
  if (!ticket) return NextResponse.json({ error: friendlyError('not_found') }, { status: 404 })

  const { error } = await supabase.rpc('support_customer_set_status', { p_ticket_id: ticket.id, p_status: status })
  if (error) return NextResponse.json({ error: friendlyError(error.message) }, { status: 400 })
  return NextResponse.json({ ok: true })
}
