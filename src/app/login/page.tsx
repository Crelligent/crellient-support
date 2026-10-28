import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/server'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = { title: 'Sign in', robots: { index: false } }

const safeNext = (n?: string) => (n && n.startsWith('/') && !n.startsWith('//') ? n : '/tickets')

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams
  if (await getUser()) redirect(safeNext(next))

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <h1 className="font-display text-3xl font-medium tracking-tight">Sign in to support</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        Follow your requests and reply to our team. Use the email you contacted us with and your past requests will
        appear automatically. No password needed.
      </p>
      {error && (
        <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          That sign-in link didn&apos;t work. It may have expired, so please request a new one.
        </p>
      )}
      <LoginForm next={safeNext(next)} />
    </div>
  )
}
