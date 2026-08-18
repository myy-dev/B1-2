import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { todosApi as defaultApi } from '@/lib/todosApi'

export function useTodos(api = defaultApi) {
  const [todos, setTodos] = useState([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const requestId = useRef(0)

  const refresh = useCallback(async () => {
    const currentRequest = ++requestId.current
    setLoading(true)
    setError('')
    try {
      const nextTodos = await api.listTodos()
      if (currentRequest === requestId.current) setTodos(nextTodos)
    } catch (err) {
      if (currentRequest === requestId.current) setError(err.message || '할 일을 불러오지 못했습니다.')
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  }, [api])

  useEffect(() => {
    refresh()
    return () => { requestId.current += 1 }
  }, [refresh])

  const filteredTodos = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase('ko-KR')
    return todos.filter((todo) => {
      const matchesStatus = filter === 'all' || todo.status === filter
      const searchable = `${todo.title} ${todo.description}`.toLocaleLowerCase('ko-KR')
      return matchesStatus && (!keyword || searchable.includes(keyword))
    })
  }, [filter, query, todos])

  const stats = useMemo(() => ({
    total: todos.length,
    active: todos.filter((todo) => todo.status === 'active').length,
    completed: todos.filter((todo) => todo.status === 'completed').length,
  }), [todos])

  const deleteTodo = useCallback(async (id) => {
    setError('')
    try {
      await api.deleteTodo(id)
      setTodos((current) => current.filter((todo) => todo.id !== id))
    } catch (err) {
      setError(err.message || '할 일을 삭제하지 못했습니다.')
      throw err
    }
  }, [api])

  const toggleTodo = useCallback(async (todo) => {
    setError('')
    const nextStatus = todo.status === 'completed' ? 'active' : 'completed'
    try {
      const updated = await api.updateTodo(todo.id, { status: nextStatus })
      setTodos((current) => current.map((item) => item.id === todo.id ? updated : item))
      return updated
    } catch (err) {
      setError(err.message || '상태를 변경하지 못했습니다.')
      throw err
    }
  }, [api])

  return {
    todos,
    filteredTodos,
    query,
    setQuery,
    filter,
    setFilter,
    stats,
    loading,
    error,
    refresh,
    deleteTodo,
    toggleTodo,
  }
}
