import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-wash">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-[17px] font-medium">Crelligent Support</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Help for Velodesk, PRISM &amp; Edge, and Crelligent engagements. Our team replies Monday to Friday,
            9:00–18:00 Lagos time (WAT).
          </p>
          <p className="mt-4 text-sm">
            <a className="text-ink underline underline-offset-2" href="mailto:support@crelligent.com">support@crelligent.com</a>
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Help centre</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><Link href="/velodesk" className="hover:text-ink">Velodesk</Link></li>
            <li><Link href="/prism" className="hover:text-ink">PRISM &amp; Edge</Link></li>
            <li><Link href="/crelligent" className="hover:text-ink">Engagements</Link></li>
            <li><Link href="/billing" className="hover:text-ink">Billing &amp; payments</Link></li>
            <li><Link href="/account" className="hover:text-ink">Account &amp; security</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Crelligent</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><a href="https://www.crelligent.com" className="hover:text-ink">crelligent.com</a></li>
            <li><a href="https://velodesk.crelligent.com" className="hover:text-ink">velodesk.crelligent.com</a></li>
            <li><a href="https://www.crelligent.com/privacy" className="hover:text-ink">Privacy</a></li>
            <li><a href="https://www.crelligent.com/terms" className="hover:text-ink">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-subtle sm:px-6">
          © {new Date().getFullYear()} Crelligent &amp; Company Limited. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
