import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabaseClient'

const AuthContext = createContext(null)

function authErrorMessage(error, fallback) {
  const code = error?.code
  if (code === 'invalid_credentials') return '이메일 또는 비밀번호가 올바르지 않습니다.'
  if (code === 'user_already_exists' || code === 'email_exists') return '이미 가입된 이메일입니다.'
  if (code === 'weak_password') return '비밀번호는 6자 이상으로 입력해 주세요.'
  if (code === 'email_not_confirmed') return '이메일 인증을 완료한 뒤 로그인해 주세요.'
  if (code === 'over_request_rate_limit') return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.'
  return fallback
}

export function AuthProvider({ children, client = getSupabaseClient() }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    client.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return
      setSession(data?.session ?? null)
      setError(sessionError ? authErrorMessage(sessionError, '로그인 상태를 확인하지 못했습니다.') : '')
      setLoading(false)
    })

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      setError('')
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [client])

  const signIn = useCallback(async ({ email, password }) => {
    setError('')
    const { data, error: signInError } = await client.auth.signInWithPassword({ email, password })
    if (signInError) throw new Error(authErrorMessage(signInError, '로그인하지 못했습니다. 잠시 후 다시 시도해 주세요.'), { cause: signInError })
    return data
  }, [client])

  const signUp = useCallback(async ({ email, password }) => {
    setError('')
    const { data, error: signUpError } = await client.auth.signUp({ email, password })
    if (signUpError) throw new Error(authErrorMessage(signUpError, '회원가입하지 못했습니다. 잠시 후 다시 시도해 주세요.'), { cause: signUpError })
    return data
  }, [client])

  const signOut = useCallback(async () => {
    const { error: signOutError } = await client.auth.signOut()
    if (signOutError) throw new Error(authErrorMessage(signOutError, '로그아웃하지 못했습니다.'), { cause: signOutError })
  }, [client])

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  }), [error, loading, session, signIn, signOut, signUp])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.')
  return value
}
