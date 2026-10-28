import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

// Handles magic-link (token_hash or PKCE code) and Google OAuth returns.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const rawNext = searchParams.get('next') || '/tickets'
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/tickets'

  const supabase = await createClient()
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  let ok = false
  if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error
  } else if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error
  }

  if (!ok) {
    return NextResponse.redirect(`${origin}/login?error=link&next=${encodeURIComponent(next)}`)
  }
  return NextResponse.redirect(`${origin}${next}`)
}
