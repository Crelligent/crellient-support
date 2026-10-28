import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-medium text-muted">404</p>
      <h1 className="mt-2 font-display text-3xl font-medium">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-muted">It may have moved. Try searching the help centre instead.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn btn-primary">Help centre</Link>
        <Link href="/contact" className="btn btn-secondary">Contact support</Link>
      </div>
    </div>
  )
}
