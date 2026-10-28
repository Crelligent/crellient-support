import { STATUS_LABEL } from '@/lib/products'

const STYLES: Record<string, string> = {
  open: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  in_progress: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  awaiting_customer: 'bg-amber-50 text-amber-800 ring-amber-600/25',
  resolved: 'bg-green-50 text-green-700 ring-green-600/20',
  closed: 'bg-gray-100 text-gray-600 ring-gray-500/20',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[status] ?? STYLES.closed}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}
