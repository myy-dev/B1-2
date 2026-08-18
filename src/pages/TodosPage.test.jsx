import { MemoryRouter } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ToastProvider } from '@/context/ToastContext'
import TodosPage from './TodosPage'

function createFakeApi(initialTodos) {
  let todos = initialTodos
  return {
    listTodos: async () => todos,
    deleteTodo: async (id) => {
      todos = todos.filter((todo) => todo.id !== id)
      return id
    },
    updateTodo: async (id, values) => {
      const updated = { ...todos.find((todo) => todo.id === id), ...values, updatedAt: new Date().toISOString() }
      todos = todos.map((todo) => todo.id === id ? updated : todo)
      return updated
    },
  }
}

function renderPage(api) {
  return render(<MemoryRouter><ToastProvider><TodosPage api={api} /></ToastProvider></MemoryRouter>)
}

describe('TodosPage', () => {
  it('검색어와 상태 필터에 따라 목록을 다시 렌더링한다', async () => {
    const user = userEvent.setup()
    const api = createFakeApi([
      { id: '1', title: 'React 공부', description: '컴포넌트', status: 'active', createdAt: '2026-01-01' },
      { id: '2', title: 'Supabase 설계', description: '스키마 작성', status: 'completed', createdAt: '2026-01-02' },
    ])
    renderPage(api)

    expect(await screen.findByText('React 공부')).toBeInTheDocument()
    expect(screen.getByText('Supabase 설계')).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox', { name: '할 일 검색' }), 'supabase')
    expect(screen.queryByText('React 공부')).not.toBeInTheDocument()
    expect(screen.getByText('Supabase 설계')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '진행 중' }))
    expect(await screen.findByText('조건에 맞는 할 일이 없어요')).toBeInTheDocument()
  })

  it('상태 변경 이벤트 후 완료 상태로 다시 렌더링한다', async () => {
    const user = userEvent.setup()
    const api = createFakeApi([
      { id: '1', title: '상태 변경', description: '', status: 'active', createdAt: '2026-01-01' },
    ])
    renderPage(api)
    await screen.findByText('상태 변경')

    await user.click(screen.getByRole('button', { name: /상태 변경.*완료로 변경/ }))
    await waitFor(() => expect(screen.getByText('완료', { selector: '.badge' })).toBeInTheDocument())
  })

  it('목록 조회 실패 시 빈 상태를 함께 표시하지 않는다', async () => {
    renderPage({
      listTodos: async () => { throw new Error('목록을 불러오지 못했습니다.') },
      deleteTodo: async () => {},
      updateTodo: async () => {},
    })

    expect(await screen.findByRole('alert')).toHaveTextContent('목록을 불러오지 못했습니다.')
    expect(screen.queryByText('아직 할 일이 없어요')).not.toBeInTheDocument()
  })
})
