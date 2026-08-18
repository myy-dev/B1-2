import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, CircleAlert, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  useEffect(() => () => {
    timers.current.forEach((timer) => clearTimeout(timer))
    timers.current.clear()
  }, [])

  const dismiss = useCallback((id) => {
    const timer = timers.current.get(id)
    if (timer) clearTimeout(timer)
    timers.current.delete(id)
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    const id = globalThis.crypto?.randomUUID?.() ?? String(Date.now())
    setToasts((current) => [...current, { id, message, type }])
    timers.current.set(id, setTimeout(() => dismiss(id), 3200))
    return id
  }, [dismiss])

  const value = useMemo(() => ({ showToast, dismiss }), [dismiss, showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite" aria-label="알림">
        {toasts.map((toast) => (
          <div className={`toast toast-${toast.type}`} role="status" key={toast.id}>
            {toast.type === 'error' ? <CircleAlert size={20} /> : <CheckCircle2 size={20} />}
            <p>{toast.message}</p>
            <button className="button button-ghost button-sm" type="button" onClick={() => dismiss(toast.id)} aria-label="알림 닫기">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast는 ToastProvider 안에서 사용해야 합니다.')
  return value
}
