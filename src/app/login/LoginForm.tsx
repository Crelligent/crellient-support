'use client'

import { useState } from 'react'
import { Loader2, Mail, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'google'>('idle')
  const [error, setError] = useState<string | null>(null)

  const callback = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

  async function sendLink(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setState('sending')
    const { error } = await createClient().auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: callback(), shouldCreateUser: true },
    })
    if (error) {
      setError(error.status === 429 ? 'Too many attempts. Please wait a minute and try again.' : error.message)
      setState('idle')
    } else {
      setState('sent')
    }
  }

  async function google() {
    setError(null)
    setState('google')
    const { error } = await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callback() },
    })
    if (error) {
      setError('Google sign-in is not available right now. Please use the email link instead.')
      setState('idle')
    }
  }

  if (state === 'sent') {
    return (
      <div className="mt-8 rounded-xl border border-line bg-wash p-6" role="status">
        <CheckCircle2 className="h-6 w-6 text-green-600" aria-hidden />
        <p className="mt-3 font-medium">Check your inbox</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          We sent a sign-in link to <span className="font-medium text-ink">{email}</span>. Open it on this device to
          continue. It can take a minute to arrive, so check spam too.
        </p>
        <button type="button" onClick={() => setState('idle')} className="mt-4 text-sm font-medium underline underline-offset-2">
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <button type="button" onClick={google} disabled={state !== 'idle'} className="btn btn-secondary w-full py-3">
        {state === 'google' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
            <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1z" />
            <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
          </svg>
        )}
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3 text-xs text-subtle">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={sendLink} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">Email address</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="field"
          />
        </div>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={state !== 'idle' || !email} className="btn btn-accent w-full py-3">
          {state === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Email me a sign-in link
        </button>
      </form>
    </div>
  )
}
