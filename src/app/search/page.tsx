import Link from 'next/link'
import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { searchArticles } from '@/lib/articles'
import { productByKey } from '@/lib/products'
import { SearchBox } from '@/components/SearchBox'

export const metadata: Metadata = { title: 'Search', robots: { index: false } }

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; product?: string }> }) {
  const { q = '', product } = await searchParams
  const scope = product ? productByKey(product) : undefined
  const results = q.trim() ? await searchArticles(q, scope?.key) : []

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <SearchBox defaultValue={q} size="md" product={scope?.key} />
      {q.trim() && (
        <p className="mt-6 text-sm text-muted">
          {results.length} result{results.length === 1 ? '' : 's'} for <span className="font-medium text-ink">“{q}”</span>
          {scope && (
            <>
              {' '}in {scope.name} · <Link href={`/search?q=${encodeURIComponent(q)}`} className="text-ink underline underline-offset-2">search everywhere</Link>
            </>
          )}
        </p>
      )}

      {results.length > 0 && (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {results.map((a) => (
            <li key={a.slug}>
              <Link href={`/articles/${a.slug}`} className="focus-ring group flex gap-3 py-4">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-subtle" aria-hidden />
                <span>
                  <span className="font-medium group-hover:underline group-hover:underline-offset-2">{a.title}</span>
                  {a.summary && <span className="mt-1 block text-sm leading-snug text-muted">{a.summary}</span>}
                  <span className="mt-1.5 block text-xs text-subtle">{productByKey(a.product)?.name} · {a.category}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {q.trim() && results.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-line-strong p-8 text-center">
          <p className="font-display text-lg font-medium">No articles matched</p>
          <p className="mt-2 text-sm text-muted">Try fewer or different words, or ask our team directly.</p>
          <Link href={`/contact${scope ? `?product=${scope.key}` : ''}`} className="btn btn-accent mt-5">Contact support</Link>
        </div>
      )}
    </div>
  )
}
