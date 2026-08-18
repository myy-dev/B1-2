import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TodoForm } from './TodoForm'

describe('TodoForm', () => {
  it('제어 입력, 실시간 미리보기, 유효성 검사, 제출을 처리한다', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<MemoryRouter><TodoForm onSubmit={onSubmit} /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: /저장하기/ }))
    expect(screen.getByText('할 일을 입력하세요.')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/할 일/), '발표 연습')
    expect(screen.getByRole('heading', { name: '발표 연습' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /저장하기/ }))

    expect(onSubmit).toHaveBeenCalledWith({ title: '발표 연습', description: '', status: 'active' })
  })

  it('저장 실패 메시지를 화면 상단에 표시한다', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><TodoForm initialValues={{ title: '오류 테스트' }} onSubmit={() => Promise.reject(new Error('저장소 오류'))} /></MemoryRouter>)
    await user.click(screen.getByRole('button', { name: /저장하기/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent('저장소 오류')
  })
})
