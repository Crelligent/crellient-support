'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { MobileNav } from './MobileNav'

const NAV = [
  { href: '/velodesk', label: 'Velodesk' },
  { href: '/prism', label: 'PRISM & Edge' },
  { href: '/crelligent', label: 'Engagements' },
  { href: '/billing', label: 'Billing' },
]

/**
 * On the home page the header sits transparently over the photo hero and turns solid once you scroll.
 * Everywhere else it is a solid white bar.
 */
export function HeaderFrame({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname()
  const overlay = pathname === '/'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlay])

  const clear = overlay && !scrolled
  const link = clear
    ? 'text-white/85 hover:text-white'
    : 'text-ink-soft hover:bg-wash hover:text-ink'

  return (
    <header
      className={`${overlay ? 'fixed' : 'sticky'} inset-x-0 top-0 z-40 transition-colors duration-200 ${
        clear ? 'bg-transparent' : 'border-b border-line bg-white/95 backdrop-blur'
      }`}
    >
      <div className="bands" aria-hidden />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="focus-ring flex items-center gap-2.5 rounded">
          <Image src="/logo.png" alt="" width={28} height={28} priority />
          <span className={`font-display text-[17px] font-medium tracking-tight ${clear ? 'text-white' : 'text-ink'}`}>
            Crelligent <span className={clear ? 'text-white/70' : 'text-muted'}>Support</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-[13px] font-medium uppercase tracking-wider md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`focus-ring rounded-md px-3 py-2 transition-colors ${link}`}>
              {n.label}
            </Link>
          ))}
          <span className={`mx-2 h-5 w-px ${clear ? 'bg-white/30' : 'bg-line'}`} aria-hidden />
          <Link href={signedIn ? '/tickets' : '/login'} className={`focus-ring rounded-md px-3 py-2 transition-colors ${link}`}>
            {signedIn ? 'My requests' : 'Sign in'}
          </Link>
          <Link
            href={signedIn ? '/tickets/new' : '/contact'}
            className={`btn ml-1 normal-case tracking-normal ${clear ? 'bg-white text-ink hover:bg-white/90' : 'btn-accent'}`}
          >
            Contact support
          </Link>
        </nav>

        <MobileNav signedIn={signedIn} light={clear} />
      </div>
    </header>
  )
}
