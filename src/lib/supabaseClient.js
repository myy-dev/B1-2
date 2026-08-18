import { createClient } from '@supabase/supabase-js'

let client

export function getSupabaseClient() {
  if (client) return client

  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    || import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase 환경 변수가 설정되지 않았습니다.')
  }

  client = createClient(url, key)
  return client
}
