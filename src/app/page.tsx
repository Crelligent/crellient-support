import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Briefcase, Clock, CreditCard, FileText, Gauge, Mail, MessagesSquare, Radio, ShieldCheck, type LucideIcon } from 'lucide-react'
import { SearchBox } from '@/components/SearchBox'
import { PRODUCTS, productByKey } from '@/lib/products'
import { featuredArticles, listArticles } from '@/lib/articles'
import { getUser } from '@/lib/supabase/server'

const ICONS: Record<string, LucideIcon> = {
  velodesk: Gauge,
  prism: Radio,
  crelligent: Briefcase,
  billing: CreditCard,
  account: ShieldCheck,
}

const POPULAR = [
  { label: 'PMF Score', q: 'PMF Score' },
  { label: 'Free trial', q: 'trial' },
  { label: 'Payment failed', q: 'payment failed' },
  { label: 'Device offline', q: 'offline' },
  { label: 'Invoices', q: 'invoice' },
]

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [featured, all, user] = await Promise.all([featuredArticles(6), listArticles(), getUser()])
  const counts = all.reduce<Record<string, number>>((acc, a) => ({ ...acc, [a.product]: (acc[a.product] || 0) + 1 }), {})

  return (
    <>
      {/* Photo hero, header floats over it */}
      <section className="relative isolate overflow-hidden">
        <Image src="/hero.webp" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-[50%_35%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/75 via-ink/55 to-ink/80" aria-hidden />
        <div className="mx-auto flex min-h-[460px] max-w-3xl flex-col items-center justify-center px-4 pb-16 pt-32 text-center sm:min-h-[520px] sm:px-6 sm:pt-36">
          <h1 className="font-display text-4xl font-medium tracking-tight text-white drop-shadow-sm sm:text-5xl">How can we help?</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Guides and answers for Velodesk, PRISM &amp; Edge and Crelligent engagements, and a direct line to our team.
          </p>
          <div className="mt-9 w-full max-w-2xl">
            <SearchBox size="hero" />
          </div>
          <p className="mt-4 flex w-full max-w-2xl flex-wrap items-center gap-x-1 gap-y-1 text-left text-sm text-white/70">
            <span className="mr-1 font-semibold text-white/90">Popular:</span>
            {POPULAR.map((p, i) => (
              <span key={p.q}>
                <Link href={`/search?q=${encodeURIComponent(p.q)}`} className="rounded underline-offset-2 hover:text-white hover:underline">
                  {p.label}
                </Link>
                {i < POPULAR.length - 1 && <span className="mx-1 text-white/40">·</span>}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* Help desk cards */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="help-desk">
        <div className="text-center">
          <h2 id="help-desk" className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-ink">Help centre</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            Browse guides by product, or sign in to follow your support requests.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => {
            const Icon = ICONS[p.key] ?? FileText
            return (
              <Link
                key={p.key}
                href={`/${p.key}`}
                className="focus-ring group flex flex-col items-center rounded-lg border border-line bg-wash px-6 py-9 text-center transition-all hover:-translate-y-0.5 hover:border-line-strong hover:bg-white hover:shadow-md"
              >
                <Icon className="h-10 w-10 text-ink" strokeWidth={1.1} aria-hidden />
                <span className="mt-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink">{p.name}</span>
                <span className="mt-3 max-w-[16rem] text-sm leading-relaxed text-muted">{p.tagline}.</span>
                <span className="mt-1 text-xs text-subtle">
                  {counts[p.key] ? `${counts[p.key]} article${counts[p.key] === 1 ? '' : 's'}` : 'Articles coming soon'}
                </span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Browse {p.name.split(' ')[0]} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            )
          })}
          <Link
            href={user ? '/tickets' : '/login?next=/tickets'}
            className="focus-ring group flex flex-col items-center rounded-lg border border-line bg-wash px-6 py-9 text-center transition-all hover:-translate-y-0.5 hover:border-line-strong hover:bg-white hover:shadow-md"
          >
            <MessagesSquare className="h-10 w-10 text-ink" strokeWidth={1.1} aria-hidden />
            <span className="mt-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink">Your requests</span>
            <span className="mt-3 max-w-[16rem] text-sm leading-relaxed text-muted">
              {user ? 'See replies from our team and update your open requests.' : 'Sign in with your email to follow every reply in one place.'}
            </span>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              {user ? 'Open my requests' : 'Sign in'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="border-y border-line bg-wash" aria-labelledby="popular">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2 id="popular" className="text-center font-display text-sm font-semibold uppercase tracking-[0.2em]">Popular articles</h2>
            <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
              {featured.map((a) => (
                <li key={a.slug} className="border-b border-line">
                  <Link href={`/articles/${a.slug}`} className="focus-ring group flex items-start gap-3 py-4">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                    <span>
                      <span className="text-[15px] font-medium text-ink group-hover:underline group-hover:underline-offset-2">{a.title}</span>
                      <span className="mt-0.5 block text-xs text-subtle">{productByKey(a.product)?.name}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6" aria-labelledby="contact">
        <div className="relative isolate overflow-hidden rounded-xl px-6 py-12 text-white sm:px-12">
          <div className="absolute inset-0 -z-10 bg-ink" aria-hidden />
          <div className="bands absolute inset-x-0 top-0" aria-hidden />
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <h2 id="contact" className="font-display text-2xl font-medium">Can&apos;t find what you need?</h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/70">
                Send us a request and we&apos;ll reply by email. Sign in with the same email to follow every reply in one place.
              </p>
              <Link href={user ? '/tickets/new' : '/contact'} className="btn btn-accent mt-6">
                Contact support <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <dl className="space-y-4 text-sm">
              <div className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/60" aria-hidden />
                <div>
                  <dt className="font-medium">Response times</dt>
                  <dd className="text-white/65">Usually within one business day. Mon–Fri, 9:00–18:00 WAT.</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white/60" aria-hidden />
                <div>
                  <dt className="font-medium">Prefer email?</dt>
                  <dd className="text-white/65">
                    Write to <a href="mailto:support@crelligent.com" className="text-white underline underline-offset-2">support@crelligent.com</a>
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
