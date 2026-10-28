'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function ArticleFeedback({ slug, product }: { slug: string; product: string }) {
  const [vote, setVote] = useState<null | boolean>(null)

  // Count one view per browser session (counted in the browser so crawlers and prefetches don't inflate it).
  useEffect(() => {
    try {
      const key = `viewed:${slug}`
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      // storage unavailable: count it anyway
    }
    createClient().rpc('support_article_viewed', { p_slug: slug })
  }, [slug])

  async function send(helpful: boolean) {
    setVote(helpful)
    try {
      const key = `vote:${slug}`
      if (localStorage.getItem(key)) return
      localStorage.setItem(key, helpful ? 'yes' : 'no')
    } catch {
      // storage unavailable: still record the vote once for this view
    }
    await createClient().rpc('support_article_vote', { p_slug: slug, p_helpful: helpful })
  }

  return (
    <div className="mt-12 rounded-xl border border-line px-5 py-4" aria-live="polite">
      {vote === null ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium">Was this article helpful?</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => send(true)} className="btn btn-secondary py-1.5">
              <ThumbsUp className="h-4 w-4" /> Yes
            </button>
            <button type="button" onClick={() => send(false)} className="btn btn-secondary py-1.5">
              <ThumbsDown className="h-4 w-4" /> No
            </button>
          </div>
        </div>
      ) : vote ? (
        <p className="text-sm text-muted">Thanks for letting us know.</p>
      ) : (
        <p className="text-sm text-muted">
          Sorry it didn&apos;t help.{' '}
          <Link href={`/contact?product=${product}`} className="font-medium text-ink underline underline-offset-2">Tell us what you need</Link>{' '}
          and we&apos;ll answer directly.
        </p>
      )}
    </div>
  )
}
