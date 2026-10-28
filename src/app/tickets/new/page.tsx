import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getUser } from '@/lib/supabase/server'
import { TicketForm } from '@/components/TicketForm'

export const metadata: Metadata = { title: 'New request', robots: { index: false } }

export default async function NewTicketPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product } = await searchParams
  const user = await getUser()
  if (!user) redirect('/login?next=/tickets/new')

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/tickets" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> My requests
      </Link>
      <h1 className="mt-4 font-display text-3xl font-medium tracking-tight">New request</h1>
      <p className="mt-2 text-[15px] text-muted">We usually reply within one business day.</p>
      <div className="mt-10">
        <TicketForm
          signedInEmail={user.email}
          defaultName={(user.user_metadata?.full_name as string | undefined) ?? null}
          defaultProduct={product}
        />
      </div>
    </div>
  )
}
