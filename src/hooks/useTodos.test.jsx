import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useTodos } from './useTodos'

describe('useTodos', () => {
  it('늦게 끝난 이전 요청이 최신 목록을 덮어쓰지 못하게 한다', async () => {
    const pending = []
    const api = {
      listTodos: vi.fn(() => new Promise((resolve) => pending.push(resolve))),
      deleteTodo: vi.fn(),
      updateTodo: vi.fn(),
    }
    const { result } = renderHook(() => useTodos(api))
    await waitFor(() => expect(pending).toHaveLength(1))

    act(() => { result.current.refresh() })
    await waitFor(() => expect(pending).toHaveLength(2))

    await act(async () => pending[1]([{ id: 'new', title: '최신 요청', description: '', status: 'active' }]))
    expect(result.current.todos[0].title).toBe('최신 요청')

    await act(async () => pending[0]([{ id: 'old', title: '이전 요청', description: '', status: 'active' }]))
    expect(result.current.todos[0].title).toBe('최신 요청')
    expect(result.current.loading).toBe(false)
  })
})
