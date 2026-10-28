import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ChevronRight, FileText, Lock } from 'lucide-react'
import { getArticle, getArticleGate, relatedArticles } from '@/lib/articles'
import { productByKey } from '@/lib/products'
import { formatDate } from '@/lib/format'
import { getUser } from '@/lib/supabase/server'
import { Markdown } from '@/components/Markdown'
import { ArticleFeedback } from '@/components/ArticleFeedback'
import { VisibilityTag } from '@/components/VisibilityTag'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = await getArticle((await params).slug)
  if (!a) return { robots: { index: false } }
  return { title: a.title, description: a.summary ?? undefined, robots: a.visibility === 'public' ? undefined : { index: false } }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const article = await getArticle(slug)

  if (!article) {
    // Not readable: either it doesn't exist, or it's for customers / a specific client.
    const gate = await getArticleGate(slug)
    if (!gate) notFound()
    const user = await getUser()
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-wash ring-1 ring-line">
          <Lock className="h-5 w-5 text-ink" aria-hidden />
        </span>
        <h1 className="mt-5 font-display text-2xl font-medium">{gate.title}</h1>
        {user ? (
          <>
            <p className="mt-3 text-muted">
              This guide is shared with specific Crelligent clients, and <span className="font-medium text-ink">{user.email}</span> doesn&apos;t have access.
            </p>
            <Link href="/contact" className="btn btn-accent mt-7">Ask for access</Link>
          </>
        ) : (
          <>
            <p className="mt-3 text-muted">
              {gate.visibility === 'customers'
                ? 'This guide is for Crelligent customers. Sign in with your work email to read it.'
                : 'This guide is shared with specific Crelligent clients. Sign in with your work email to read it.'}
            </p>
            <Link href={`/login?next=/articles/${slug}`} className="btn btn-accent mt-7">Sign in to read</Link>
          </>
        )}
      </div>
    )
  }

  const product = productByKey(article.product)
  const related = await relatedArticles(article)
  const ticketProduct = ['velodesk', 'prism', 'crelligent', 'billing'].includes(article.product) ? article.product : 'other'

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link href="/" className="hover:text-ink">Help centre</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        {product && (
          <>
            <Link href={`/${product.key}`} className="hover:text-ink">{product.name}</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </>
        )}
        <span className="text-ink-soft">{article.category}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article>
          {article.visibility !== 'public' && <div className="mb-4"><VisibilityTag visibility={article.visibility} /></div>}
          <h1 className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">{article.title}</h1>
          {article.summary && <p className="mt-4 text-lg leading-relaxed text-muted">{article.summary}</p>}
          <p className="mt-4 text-xs text-subtle">Updated {formatDate(article.updated_at)}</p>
          <div className="mt-8 border-t border-line pt-8">
            <Markdown>{article.body}</Markdown>
          </div>
          <ArticleFeedback slug={article.slug} product={ticketProduct} />
        </article>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          {related.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-subtle">Related</h2>
              <ul className="mt-3 space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/articles/${r.slug}`} className="group flex gap-2.5 text-sm">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-subtle" aria-hidden />
                      <span className="text-ink-soft group-hover:text-ink group-hover:underline group-hover:underline-offset-2">{r.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="rounded-xl border border-line bg-wash p-5">
            <p className="font-display font-medium">Need more help?</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">Our team replies within one business day.</p>
            <Link href={`/contact?product=${ticketProduct}`} className="btn btn-accent mt-4 w-full">Contact support</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
