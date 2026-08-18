import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppProviders } from '@/context/AppProviders'
import App from './App'

const authState = vi.hoisted(() => ({
  user: { id: 'user-1', email: 'focus@example.com' },
  loading: false,
  error: '',
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('@/context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => authState,
}))

vi.mock('@/lib/todosApi', () => ({
  todosApi: {
    listTodos: vi.fn(async () => []),
    getTodo: vi.fn(async () => null),
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
    clearTodos: vi.fn(),
  },
}))

function renderRoute(route) {
  return render(<MemoryRouter initialEntries={[route]}><AppProviders><App /></AppProviders></MemoryRouter>)
}

describe('App routes', () => {
  beforeEach(() => {
    authState.user = { id: 'user-1', email: 'focus@example.com' }
    authState.loading = false
    authState.error = ''
  })

  it.each([
    ['/', '복잡한 하루를'],
    ['/todos', '할 일'],
    ['/todos/new', '새 할 일'],
    ['/profile', '프로필'],
    ['/settings', '설정'],
  ])('%s 라우트를 렌더링한다', async (route, name) => {
    renderRoute(route)
    expect(await screen.findByRole('heading', { name: new RegExp(name) })).toBeInTheDocument()
  })

  it('알 수 없는 경로에서 404 페이지를 렌더링한다', async () => {
    renderRoute('/definitely-missing')
    expect(await screen.findByRole('heading', { name: '길을 잃었어요' })).toBeInTheDocument()
  })

  it('로그아웃 사용자를 로그인 화면으로 이동시킨다', async () => {
    authState.user = null
    renderRoute('/todos')
    expect(await screen.findByRole('heading', { name: '다시 만나서 반가워요.' })).toBeInTheDocument()
  })
})
