import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ChevronRight, ExternalLink, FileText } from 'lucide-react'
import { productByKey } from '@/lib/products'
import { listArticles } from '@/lib/articles'
import { ProductMark } from '@/components/ProductMark'
import { SearchBox } from '@/components/SearchBox'
import { VisibilityTag } from '@/components/VisibilityTag'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ product: string }> }): Promise<Metadata> {
  const p = productByKey((await params).product)
  return p ? { title: p.name, description: `Help articles for ${p.name}: ${p.tagline}.` } : {}
}

export default async function ProductPage({ params }: { params: Promise<{ product: string }> }) {
  const product = productByKey((await params).product)
  if (!product) notFound()

  const articles = await listArticles(product.key)
  const categories = [
    ...product.categories,
    ...Array.from(new Set(articles.map((a) => a.category))).filter((c) => !product.categories.includes(c)),
  ]
  const grouped = categories
    .map((c) => ({ category: c, items: articles.filter((a) => a.category === c) }))
    .filter((g) => g.items.length > 0)

  return (
    <>
      <section className="border-b border-line bg-wash">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted">
            <Link href="/" className="hover:text-ink">Help centre</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="text-ink">{product.name}</span>
          </nav>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-4">
              <ProductMark product={product} size={56} />
              <div>
                <h1 className="font-display text-3xl font-medium tracking-tight">{product.name}</h1>
                <p className="mt-1 text-[15px] text-muted">{product.tagline}</p>
              </div>
            </div>
            {product.site && (
              <a href={product.site} className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
                Go to {product.name.split(' ')[0]} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <div className="mt-8 max-w-xl">
            <SearchBox size="md" product={product.key} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {grouped.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong p-10 text-center">
            <p className="font-display text-lg font-medium">Articles for {product.name} are on the way</p>
            <p className="mt-2 text-sm text-muted">In the meantime, our team is happy to help directly.</p>
            <Link href="/contact" className="btn btn-accent mt-5">Contact support</Link>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2">
            {grouped.map((g) => (
              <section key={g.category} aria-labelledby={`c-${g.category}`}>
                <h2 id={`c-${g.category}`} className="font-display text-lg font-medium">{g.category}</h2>
                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {g.items.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/articles/${a.slug}`} className="focus-ring group flex items-start gap-3 py-3.5">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                        <span>
                          <span className="flex flex-wrap items-center gap-2"><span className="text-[15px] font-medium group-hover:underline group-hover:underline-offset-2">{a.title}</span><VisibilityTag visibility={a.visibility} /></span>
                          {a.summary && <span className="mt-0.5 block text-sm leading-snug text-muted">{a.summary}</span>}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
