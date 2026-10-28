import { getUser } from '@/lib/supabase/server'
import { HeaderFrame } from './HeaderFrame'

export async function Header() {
  const user = await getUser()
  return <HeaderFrame signedIn={Boolean(user)} />
}
