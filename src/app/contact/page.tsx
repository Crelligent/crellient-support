import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Mail, MessageSquare } from 'lucide-react'
import { getUser } from '@/lib/supabase/server'
import { TicketForm } from '@/components/TicketForm'

export const metadata: Metadata = {
  title: 'Contact support',
  description: 'Send a request to the Crelligent support team.',
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product } = await searchParams
  const user = await getUser()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">Contact support</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
            Tell us what you need and we&apos;ll reply by email. The more detail you include, the faster we can help.
          </p>
          <div className="mt-10">
            <TicketForm
              signedInEmail={user?.email}
              defaultName={(user?.user_metadata?.full_name as string | undefined) ?? null}
              defaultProduct={product}
            />
          </div>
        </div>

        <aside className="space-y-6 text-sm lg:pt-24">
          <div className="flex gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-subtle" aria-hidden />
            <div>
              <p className="font-medium">When we reply</p>
              <p className="mt-1 leading-relaxed text-muted">Usually within one business day. Monday to Friday, 9:00–18:00 Lagos time (WAT).</p>
            </div>
          </div>
          <div className="flex gap-3">
            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-subtle" aria-hidden />
            <div>
              <p className="font-medium">Track your requests</p>
              <p className="mt-1 leading-relaxed text-muted">
                {user ? (
                  <>See every reply in <Link href="/tickets" className="text-ink underline underline-offset-2">My requests</Link>.</>
                ) : (
                  <><Link href="/login?next=/tickets" className="text-ink underline underline-offset-2">Sign in</Link> with your email to follow replies in one place.</>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-subtle" aria-hidden />
            <div>
              <p className="font-medium">Email</p>
              <p className="mt-1 text-muted">
                <a href="mailto:support@crelligent.com" className="text-ink underline underline-offset-2">support@crelligent.com</a>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
