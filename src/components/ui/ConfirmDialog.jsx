import { useEffect, useRef } from 'react'
import { Button } from './Button'
import { Card } from './Card'

export function ConfirmDialog({ open, title, description, confirmLabel = '확인', loading = false, onConfirm, onCancel }) {
  const cancelRef = useRef(null)
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)
  const loadingRef = useRef(loading)
  const onCancelRef = useRef(onCancel)
  loadingRef.current = loading
  onCancelRef.current = onCancel

  useEffect(() => {
    if (!open) return undefined
    previousFocusRef.current = document.activeElement
    cancelRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (!loadingRef.current) onCancelRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      previousFocusRef.current?.focus?.()
    }
  }, [open])

  if (!open) return null
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !loading && onCancel()}>
      <Card ref={dialogRef} className="modal" role="alertdialog" aria-modal="true" aria-busy={loading} aria-labelledby="confirm-title" aria-describedby="confirm-description">
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-description">{description}</p>
        <div className="modal-actions">
          <Button ref={cancelRef} type="button" variant="secondary" onClick={onCancel} disabled={loading}>취소</Button>
          <Button type="button" variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </div>
      </Card>
    </div>
  )
}
