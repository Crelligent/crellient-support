import { Search } from 'lucide-react'

/**
 * Search field with the button attached on the right.
 * `hero` = large frosted-glass version for the photo banner; `lg` / `md` = solid versions for plain pages.
 */
export function SearchBox({ defaultValue = '', size = 'lg', product }: { defaultValue?: string; size?: 'hero' | 'lg' | 'md'; product?: string }) {
  if (size === 'hero') {
    return (
      <form
        action="/search"
        method="get"
        role="search"
        className="glass-search group flex w-full items-center gap-2 rounded-2xl p-1.5 sm:p-2"
      >
        <label htmlFor="q" className="sr-only">Search help articles</label>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/75" aria-hidden />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={defaultValue}
            placeholder="Have a question? Ask or enter a search term"
            className="h-12 w-full rounded-xl bg-transparent pl-11 pr-3 text-base text-white placeholder:text-white/65 focus:outline-none sm:h-13"
          />
        </div>
        <button
          type="submit"
          className="h-12 shrink-0 rounded-xl bg-accent px-5 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-black/20 transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-13 sm:px-7"
        >
          Search
        </button>
      </form>
    )
  }

  const h = size === 'lg' ? 'h-14' : 'h-11'
  return (
    <form action="/search" method="get" role="search" className="flex w-full overflow-hidden rounded-lg border border-line-strong bg-white shadow-sm focus-within:border-ink">
      <label htmlFor="q" className="sr-only">Search help articles</label>
      <div className="relative min-w-0 flex-1">
        <Search className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle ${size === 'md' ? 'h-4 w-4' : 'h-5 w-5'}`} aria-hidden />
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder={product ? 'Search this section…' : 'Have a question? Ask or enter a search term'}
          className={`w-full bg-transparent text-ink placeholder:text-subtle focus:outline-none ${h} ${size === 'md' ? 'pl-10 pr-3 text-sm' : 'pl-12 pr-4 text-base'}`}
        />
      </div>
      {product && <input type="hidden" name="product" value={product} />}
      <button
        type="submit"
        className={`shrink-0 bg-accent font-semibold uppercase tracking-wider text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white ${
          size === 'md' ? 'px-4 text-xs' : 'px-6 text-sm sm:px-8'
        }`}
      >
        Search
      </button>
    </form>
  )
}
