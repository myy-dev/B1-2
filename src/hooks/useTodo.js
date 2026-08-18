import { useCallback, useEffect, useRef, useState } from 'react'
import { todosApi as defaultApi } from '@/lib/todosApi'

export function useTodo(id, api = defaultApi) {
  const [todo, setTodo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const requestId = useRef(0)

  const refresh = useCallback(async () => {
    const currentRequest = ++requestId.current
    if (!id) {
      setTodo(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    setTodo(null)
    try {
      const nextTodo = await api.getTodo(id)
      if (currentRequest === requestId.current) setTodo(nextTodo)
    } catch (err) {
      if (currentRequest === requestId.current) setError(err.message || '할 일을 불러오지 못했습니다.')
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  }, [api, id])

  useEffect(() => {
    refresh()
    return () => { requestId.current += 1 }
  }, [refresh])

  return { todo, setTodo, loading, error, refresh }
}
