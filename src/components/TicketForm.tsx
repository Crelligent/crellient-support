'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { TICKET_CATEGORIES, TICKET_PRODUCTS, type TicketProduct } from '@/lib/products'

interface Props {
  signedInEmail?: string | null
  defaultName?: string | null
  defaultProduct?: string
}

export function TicketForm({ signedInEmail, defaultName, defaultProduct }: Props) {
  const router = useRouter()
  const initialProduct = (TICKET_PRODUCTS.some((p) => p.value === defaultProduct) ? defaultProduct : '') as TicketProduct | ''
  const [product, setProduct] = useState<TicketProduct | ''>(initialProduct)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<{ ref: string; email: string } | null>(null)
  const categories = useMemo(() => (product ? TICKET_CATEGORIES[product] : []), [product])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setBusy(false)
        return
      }
      if (signedInEmail) {
        router.push(`/tickets/${data.ref}?new=1`)
        router.refresh()
      } else {
        setDone({ ref: data.ref, email: data.email })
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch {
      setError('We could not reach the server. Check your connection and try again.')
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-wash p-8" role="status">
        <CheckCircle2 className="h-7 w-7 text-green-600" aria-hidden />
        <h2 className="mt-4 font-display text-2xl font-medium">Request received</h2>
        <p className="mt-2 leading-relaxed text-muted">
          Your reference is <span className="font-mono font-medium text-ink">{done.ref}</span>. We&apos;ve sent a
          confirmation to <span className="font-medium text-ink">{done.email}</span> and will reply there, usually
          within one business day.
        </p>
        <p className="mt-4 text-sm text-muted">
          Want to follow the conversation here?{' '}
          <Link href={`/login?next=/tickets/${done.ref}`} className="font-medium text-ink underline underline-offset-2">
            Sign in with {done.email}
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      {/* Honeypot: hidden from people, tempting to bots */}
      <div className="hidden" aria-hidden>
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="product" className="label">What is this about?</label>
          <select id="product" name="product" required value={product} onChange={(e) => setProduct(e.target.value as TicketProduct)} className="field">
            <option value="" disabled>Choose one</option>
            {TICKET_PRODUCTS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category" className="label">Type of request</label>
          <select id="category" name="category" className="field" disabled={!product} defaultValue="">
            <option value="">{product ? 'Choose one (optional)' : 'Choose a topic first'}</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="label">Subject</label>
        <input id="subject" name="subject" required minLength={3} maxLength={200} className="field" placeholder="A short summary" />
      </div>

      <div>
        <label htmlFor="body" className="label">How can we help?</label>
        <textarea
          id="body"
          name="body"
          required
          minLength={10}
          maxLength={10000}
          rows={7}
          className="field resize-y leading-relaxed"
          placeholder="Tell us what happened, what you expected, and any steps to reproduce it. Include invoice or device numbers if relevant."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Your name</label>
          <input id="name" name="name" autoComplete="name" maxLength={120} defaultValue={defaultName ?? ''} className="field" />
        </div>
        <div>
          <label htmlFor="company" className="label">Company <span className="font-normal text-subtle">(optional)</span></label>
          <input id="company" name="company" autoComplete="organization" maxLength={160} className="field" />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="label">Email</label>
        {signedInEmail ? (
          <>
            <input id="email" value={signedInEmail} disabled className="field" />
            <p className="mt-1.5 text-xs text-subtle">We&apos;ll reply to the email you&apos;re signed in with.</p>
          </>
        ) : (
          <input id="email" name="email" type="email" required autoComplete="email" maxLength={254} className="field" placeholder="you@company.com" />
        )}
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button type="submit" disabled={busy} className="btn btn-accent px-5 py-3">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send request
        </button>
        <p className="text-xs text-subtle">
          By sending, you agree we may use these details to respond. See our{' '}
          <a href="https://www.crelligent.com/privacy" className="underline underline-offset-2">privacy notice</a>.
        </p>
      </div>
    </form>
  )
}
