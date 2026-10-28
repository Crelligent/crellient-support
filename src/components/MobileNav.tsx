'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export function MobileNav({ signedIn, light = false }: { signedIn: boolean; light?: boolean }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => setOpen(false), [pathname])

  const links = [
    { href: '/velodesk', label: 'Velodesk' },
    { href: '/prism', label: 'PRISM & Edge' },
    { href: '/crelligent', label: 'Crelligent engagements' },
    { href: '/billing', label: 'Billing & payments' },
    { href: '/account', label: 'Account & security' },
    signedIn ? { href: '/tickets', label: 'My requests' } : { href: '/login', label: 'Sign in' },
  ]

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className={`focus-ring -mr-2 rounded-md p-2 ${light && !open ? 'text-white' : 'text-ink'}`}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Menu</span>
      </button>
      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full border-b border-line bg-white px-4 pb-5 pt-2 shadow-sm">
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block rounded-md px-3 py-2.5 text-[15px] text-ink-soft hover:bg-wash hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={signedIn ? '/tickets/new' : '/contact'} className="btn btn-accent mt-3 w-full">
            Contact support
          </Link>
        </div>
      )}
    </div>
  )
}
