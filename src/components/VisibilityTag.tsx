import { Lock, Users } from 'lucide-react'

/** Small label shown on articles that aren't public. */
export function VisibilityTag({ visibility }: { visibility: string }) {
  if (visibility === 'customers') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-800 ring-1 ring-inset ring-sky-600/20">
        <Users className="h-3 w-3" aria-hidden /> Customers
      </span>
    )
  }
  if (visibility === 'client') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-800 ring-1 ring-inset ring-violet-600/20">
        <Lock className="h-3 w-3" aria-hidden /> Your organisation
      </span>
    )
  }
  return null
}
