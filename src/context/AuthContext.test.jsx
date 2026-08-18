import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'

function createAuthClient(session = null) {
  const unsubscribe = vi.fn()
  return {
    unsubscribe,
    client: {
      auth: {
        getSession: vi.fn(async () => ({ data: { session }, error: null })),
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe } } })),
        signInWithPassword: vi.fn(async () => ({ data: { session }, error: null })),
        signUp: vi.fn(async () => ({ data: { session }, error: null })),
        signOut: vi.fn(async () => ({ error: null })),
      },
    },
  }
}

describe('AuthProvider', () => {
  it('기존 Supabase 세션을 불러오고 정리 시 구독을 해제한다', async () => {
    const session = { user: { id: 'user-1', email: 'focus@example.com' } }
    const { client, unsubscribe } = createAuthClient(session)
    const wrapper = ({ children }) => <AuthProvider client={client}>{children}</AuthProvider>
    const { result, unmount } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toEqual(session.user)
    unmount()
    expect(unsubscribe).toHaveBeenCalled()
  })
})
