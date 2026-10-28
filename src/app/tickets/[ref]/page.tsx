import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { CheckCircle2, ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { productLabel } from '@/lib/products'
import { formatDate, formatDateTime } from '@/lib/format'
import { StatusBadge } from '@/components/StatusBadge'
import { ReplyBox } from './ReplyBox'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ ref: string }> }): Promise<Metadata> {
  return { title: (await params).ref.toUpperCase(), robots: { index: false } }
}

export default async function TicketPage({
  params,
  searchParams,
}: {
  params: Promise<{ ref: string }>
  searchParams: Promise<{ new?: string }>
}) {
  const ref = (await params).ref.toUpperCase()
  const isNew = (await searchParams).new === '1'
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) redirect(`/login?next=/tickets/${ref}`)

  // RLS limits this to the signed-in customer's own tickets.
  const { data: ticket } = await supabase
    .from('support_tickets')
    .select('id, ref, product, category, subject, status, created_at, updated_at')
    .eq('ref', ref)
    .maybeSingle()
  if (!ticket) notFound()

  const { data: messages } = await supabase
    .from('support_messages')
    .select('id, author_type, author_name, author_email, body, created_at')
    .eq('ticket_id', ticket.id)
    .order('created_at')

  const closed = ticket.status === 'closed'

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/tickets" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> My requests
      </Link>

      {isNew && (
        <div className="mt-6 flex gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900" role="status">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>Request received. We&apos;ve emailed you a copy and will reply here and by email.</p>
        </div>
      )}

      <header className="mt-6 border-b border-line pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-subtle">{ticket.ref}</span>
          <StatusBadge status={ticket.status} />
        </div>
        <h1 className="mt-2 font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">{ticket.subject}</h1>
        <p className="mt-2 text-sm text-muted">
          {productLabel(ticket.product)}
          {ticket.category ? ` · ${ticket.category}` : ''} · Opened {formatDate(ticket.created_at)}
        </p>
      </header>

      <ol className="mt-8 space-y-6">
        {(messages ?? []).map((m) =>
          m.author_type === 'system' ? (
            <li key={m.id} className="flex items-center gap-3 text-xs text-subtle">
              <span className="h-px flex-1 bg-line" />
              {m.body} · {formatDateTime(m.created_at)}
              <span className="h-px flex-1 bg-line" />
            </li>
          ) : (
            <li key={m.id} className={m.author_type === 'staff' ? 'pr-0 sm:pr-10' : 'pl-0 sm:pl-10'}>
              <div className={`rounded-2xl border p-5 ${m.author_type === 'staff' ? 'border-line bg-wash' : 'border-line bg-white'}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium">
                    {m.author_type === 'staff' ? (
                      <>
                        {m.author_name || 'Crelligent Support'}{' '}
                        <span className="ml-1 rounded bg-ink px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Team</span>
                      </>
                    ) : (
                      'You'
                    )}
                  </p>
                  <time className="text-xs text-subtle" dateTime={m.created_at}>{formatDateTime(m.created_at)}</time>
                </div>
                <div className="mt-3 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-ink-soft">{m.body}</div>
              </div>
            </li>
          )
        )}
      </ol>

      <div className="mt-10">
        {closed ? (
          <div className="rounded-xl border border-line bg-wash p-5 text-sm text-muted">
            This request is closed.{' '}
            <Link href={`/tickets/new?product=${ticket.product}`} className="font-medium text-ink underline underline-offset-2">Open a new request</Link>{' '}
            and mention {ticket.ref} if it&apos;s related.
          </div>
        ) : (
          <ReplyBox ticketRef={ticket.ref} status={ticket.status} />
        )}
      </div>
    </div>
  )
}
