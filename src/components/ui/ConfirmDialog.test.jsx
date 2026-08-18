import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './ConfirmDialog'

function DialogHarness({ loading = false, onConfirm = vi.fn() }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>삭제 열기</button>
      <ConfirmDialog open={open} title="삭제 확인" description="되돌릴 수 없습니다." loading={loading} onConfirm={onConfirm} onCancel={() => setOpen(false)} />
    </>
  )
}

describe('ConfirmDialog', () => {
  it('Escape로 닫고 원래 버튼으로 포커스를 복원한다', async () => {
    const user = userEvent.setup()
    render(<DialogHarness />)
    const trigger = screen.getByRole('button', { name: '삭제 열기' })
    await user.click(trigger)
    expect(screen.getByRole('button', { name: '취소' })).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('처리 중에는 Escape로 닫히지 않는다', async () => {
    const user = userEvent.setup()
    render(<DialogHarness loading />)
    await user.click(screen.getByRole('button', { name: '삭제 열기' }))
    await user.keyboard('{Escape}')
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })
})
