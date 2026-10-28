import { createClient } from './supabase/server'

export interface Article {
  id: string
  slug: string
  product: string
  category: string
  title: string
  summary: string | null
  body: string
  featured: boolean
  sort: number
  visibility: 'public' | 'customers' | 'client'
  updated_at: string
}

// Reads run as the visitor, so Row Level Security decides what they see:
// public articles for everyone, plus customer and client articles once signed in.
// Internal (staff) articles are never readable here.
const LIST_COLS = 'id, slug, product, category, title, summary, featured, sort, visibility, updated_at'

export async function listArticles(product?: string) {
  const db = await createClient()
  let q = db.from('support_articles').select(LIST_COLS).eq('published', true)
  if (product) q = q.eq('product', product)
  const { data, error } = await q.order('sort').order('title')
  if (error) console.error('[articles] list', error.message)
  return (data ?? []) as Omit<Article, 'body'>[]
}

export async function featuredArticles(limit = 6) {
  const db = await createClient()
  const { data } = await db
    .from('support_articles')
    .select(LIST_COLS)
    .eq('published', true)
    .eq('featured', true)
    .eq('visibility', 'public')
    .order('sort')
    .limit(limit)
  return (data ?? []) as Omit<Article, 'body'>[]
}

export async function getArticle(slug: string) {
  const db = await createClient()
  const { data } = await db.from('support_articles').select('*').eq('slug', slug).eq('published', true).maybeSingle()
  return data as Article | null
}

/** For an article the visitor can't read: is it gated (sign in / client-only) rather than missing? */
export async function getArticleGate(slug: string) {
  const db = await createClient()
  const { data } = await db.rpc('support_article_gate', { p_slug: slug }).maybeSingle<{ title: string; visibility: string }>()
  return data ?? null
}

export async function relatedArticles(a: Article, limit = 4) {
  const db = await createClient()
  const { data } = await db
    .from('support_articles')
    .select(LIST_COLS)
    .eq('published', true)
    .eq('product', a.product)
    .neq('slug', a.slug)
    .order('sort')
    .limit(limit)
  return (data ?? []) as Omit<Article, 'body'>[]
}

/** Keyword search across title, summary and body (all terms must match). Logs searches with no results. */
export async function searchArticles(query: string, product?: string) {
  const terms = query
    .toLowerCase()
    .replace(/[%_,()'"\\]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1)
    .slice(0, 6)
  if (terms.length === 0) return []

  const db = await createClient()
  let q = db.from('support_articles').select(LIST_COLS + ', body').eq('published', true)
  if (product) q = q.eq('product', product)
  for (const t of terms) {
    q = q.or(`title.ilike.%${t}%,summary.ilike.%${t}%,body.ilike.%${t}%`)
  }
  const { data } = await q.limit(40)
  const rows = (data ?? []) as unknown as Article[]

  if (rows.length === 0) {
    await db.rpc('support_log_search_gap', { p_query: query, p_product: product ?? '' })
  }

  const score = (a: Article) =>
    terms.reduce((s, t) => s + (a.title.toLowerCase().includes(t) ? 5 : 0) + ((a.summary || '').toLowerCase().includes(t) ? 2 : 0) + (a.body.toLowerCase().includes(t) ? 1 : 0), 0)
  return rows.sort((a, b) => score(b) - score(a)).map(({ body, ...rest }) => {
    void body
    return rest
  })
}
