'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, RotateCcw, Send } from 'lucide-react'

export function ReplyBox({ ticketRef, status }: { ticketRef: string; status: string }) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState<null | 'reply' | 'status'>(null)
  const [error, setError] = useState<string | null>(null)
  const resolved = status === 'resolved'

  async function call(path: string, payload: object, kind: 'reply' | 'status') {
    setError(null)
    setBusy(kind)
    try {
      const res = await fetch(`/api/tickets/${ticketRef}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return false
      }
      router.refresh()
      return true
    } catch {
      setError('We could not reach the server. Check your connection and try again.')
      return false
    } finally {
      setBusy(null)
    }
  }

  async function reply(e: React.FormEvent) {
    e.preventDefault()
    if (await call('reply', { body }, 'reply')) setBody('')
  }

  return (
    <div>
      <form onSubmit={reply} className="rounded-2xl border border-line-strong p-1.5 focus-within:border-ink focus-within:ring-1 focus-within:ring-ink">
        <label htmlFor="reply" className="sr-only">Your reply</label>
        <textarea
          id="reply"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={10000}
          placeholder={resolved ? 'Replying will reopen this request…' : 'Write a reply…'}
          className="w-full resize-y rounded-xl border-0 px-3 py-2.5 text-[15px] leading-relaxed focus:outline-none"
        />
        <div className="flex items-center justify-between gap-3 px-1.5 pb-1">
          <span className="text-xs text-subtle">We&apos;ll email you when the team replies.</span>
          <button type="submit" disabled={!body.trim() || busy !== null} className="btn btn-accent">
            {busy === 'reply' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send reply
          </button>
        </div>
      </form>

      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex justify-end">
        {resolved ? (
          <button type="button" disabled={busy !== null} onClick={() => call('status', { status: 'open' }, 'status')} className="btn btn-secondary">
            {busy === 'status' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
            Reopen request
          </button>
        ) : (
          <button type="button" disabled={busy !== null} onClick={() => call('status', { status: 'resolved' }, 'status')} className="btn btn-secondary">
            {busy === 'status' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Mark as resolved
          </button>
        )}
      </div>
    </div>
  )
}
