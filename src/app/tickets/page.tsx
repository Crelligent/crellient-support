import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronRight, LogOut, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { productLabel } from '@/lib/products'
import { timeAgo } from '@/lib/format'
import { StatusBadge } from '@/components/StatusBadge'

export const metadata: Metadata = { title: 'My requests', robots: { index: false } }
export const dynamic = 'force-dynamic'

const OPEN = ['open', 'in_progress', 'awaiting_customer']

export default async function TicketsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) redirect('/login?next=/tickets')

  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('id, ref, product, subject, status, updated_at, created_at')
    .order('updated_at', { ascending: false })

  const all = tickets ?? []
  const showClosed = view === 'closed'
  const list = all.filter((t) => (showClosed ? !OPEN.includes(t.status) : OPEN.includes(t.status)))
  const openCount = all.filter((t) => OPEN.includes(t.status)).length
  const waiting = all.filter((t) => t.status === 'awaiting_customer').length

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">My requests</h1>
          <p className="mt-2 text-sm text-muted">Signed in as {auth.user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <form action="/auth/signout" method="post">
            <button type="submit" className="btn btn-secondary">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
          <Link href="/tickets/new" className="btn btn-accent">
            <Plus className="h-4 w-4" /> New request
          </Link>
        </div>
      </div>

      {waiting > 0 && (
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {waiting === 1 ? 'One request is' : `${waiting} requests are`} waiting on a reply from you.
        </p>
      )}

      <div className="mt-8 flex gap-1 border-b border-line text-sm" role="tablist">
        <Link
          href="/tickets"
          role="tab"
          aria-selected={!showClosed}
          className={`-mb-px border-b-2 px-3 py-2.5 ${!showClosed ? 'border-ink font-medium text-ink' : 'border-transparent text-muted hover:text-ink'}`}
        >
          Open <span className="ml-1 text-subtle">{openCount}</span>
        </Link>
        <Link
          href="/tickets?view=closed"
          role="tab"
          aria-selected={showClosed}
          className={`-mb-px border-b-2 px-3 py-2.5 ${showClosed ? 'border-ink font-medium text-ink' : 'border-transparent text-muted hover:text-ink'}`}
        >
          Resolved <span className="ml-1 text-subtle">{all.length - openCount}</span>
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-lg font-medium">{showClosed ? 'No resolved requests yet' : 'No open requests'}</p>
          <p className="mt-2 text-sm text-muted">
            {showClosed ? 'Resolved and closed requests will appear here.' : 'When you contact us, your request and our replies appear here.'}
          </p>
          {!showClosed && <Link href="/tickets/new" className="btn btn-accent mt-6">New request</Link>}
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {list.map((t) => (
            <li key={t.id}>
              <Link href={`/tickets/${t.ref}`} className="focus-ring group flex items-center gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-subtle">{t.ref}</span>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="mt-1.5 truncate font-medium group-hover:underline group-hover:underline-offset-2">{t.subject}</p>
                  <p className="mt-0.5 text-xs text-muted">{productLabel(t.product)} · Updated {timeAgo(t.updated_at)}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-subtle" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
