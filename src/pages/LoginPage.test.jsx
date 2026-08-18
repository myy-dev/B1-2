import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import LoginPage from './LoginPage'

const authState = vi.hoisted(() => ({
  user: null,
  signIn: vi.fn(async () => ({ session: { user: { id: 'user-1' } } })),
  signUp: vi.fn(async () => ({ session: null })),
}))

vi.mock('@/context/AuthContext', () => ({ useAuth: () => authState }))

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/todos" element={<h1>내 할 일</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  it('입력을 검증하고 이메일·비밀번호 로그인을 처리한다', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: '로그인' }))
    expect(screen.getByText('올바른 이메일 주소를 입력해 주세요.')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/이메일/), 'focus@example.com')
    await user.type(screen.getByLabelText(/비밀번호/), 'secret12')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(authState.signIn).toHaveBeenCalledWith({ email: 'focus@example.com', password: 'secret12' })
    expect(await screen.findByRole('heading', { name: '내 할 일' })).toBeInTheDocument()
  })

  it('이메일 확인이 필요한 회원가입 상태를 안내한다', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('tab', { name: '회원가입' }))
    await user.type(screen.getByLabelText(/이메일/), 'new@example.com')
    await user.type(screen.getByLabelText(/비밀번호/), 'secret12')
    await user.click(screen.getByRole('button', { name: '회원가입' }))

    expect(await screen.findByRole('status')).toHaveTextContent('가입 확인 메일을 보냈습니다.')
  })
})
