import Image from 'next/image'
import { CreditCard, ShieldCheck } from 'lucide-react'
import type { Product } from '@/lib/products'

/** Square tile with the product's own logo, or an icon for non-product areas. */
export function ProductMark({ product, size = 44 }: { product: Product; size?: number }) {
  const inner = Math.round(size * 0.62)
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-xl border border-line"
      style={{ width: size, height: size, background: product.tile }}
      aria-hidden
    >
      {product.logo ? (
        <Image src={product.logo} alt="" width={inner} height={inner} className="object-contain" />
      ) : product.key === 'billing' ? (
        <CreditCard style={{ width: inner * 0.75, height: inner * 0.75, color: product.accent }} strokeWidth={1.6} />
      ) : (
        <ShieldCheck style={{ width: inner * 0.75, height: inner * 0.75, color: product.accent }} strokeWidth={1.6} />
      )}
    </span>
  )
}
