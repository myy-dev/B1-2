import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useTodoForm } from './useTodoForm'

describe('useTodoForm', () => {
  it('빈 제목 제출을 막고 필드 오류를 제공한다', async () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useTodoForm({ onSubmit }))

    await act(() => result.current.handleSubmit({ preventDefault: vi.fn() }))

    expect(result.current.errors.title).toBe('할 일을 입력하세요.')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('입력값을 trim해 제출한다', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useTodoForm({ onSubmit }))

    act(() => {
      result.current.handleChange({ target: { name: 'title', value: '  집중하기  ' } })
      result.current.handleChange({ target: { name: 'description', value: '  25분 동안  ' } })
    })
    await act(() => result.current.handleSubmit({ preventDefault: vi.fn() }))

    expect(onSubmit).toHaveBeenCalledWith({ title: '집중하기', description: '25분 동안', status: 'active' })
    expect(result.current.submitting).toBe(false)
  })

  it('길이 오류를 올바른 값으로 수정하면 즉시 해제한다', async () => {
    const { result } = renderHook(() => useTodoForm({ onSubmit: vi.fn() }))

    act(() => result.current.handleChange({ target: { name: 'description', value: '가'.repeat(501) } }))
    await act(() => result.current.handleSubmit({ preventDefault: vi.fn() }))
    expect(result.current.errors.description).toBe('설명은 500자 이하로 입력하세요.')

    act(() => result.current.handleChange({ target: { name: 'description', value: '가'.repeat(500) } }))
    expect(result.current.errors.description).toBe('')
  })
})
