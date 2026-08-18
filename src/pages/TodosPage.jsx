import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ListFilter, Plus, RefreshCw, SearchX } from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'
import { useToast } from '@/context/ToastContext'
import { TodoList } from '@/components/TodoList'
import { TodoSearch } from '@/components/TodoSearch'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingState } from '@/components/ui/LoadingState'
import { PageHeader } from '@/components/ui/PageHeader'

export default function TodosPage({ api }) {
  const state = useTodos(api)
  const { showToast } = useToast()

  const handleDelete = useCallback(async (id) => {
    try {
      await state.deleteTodo(id)
      showToast('할 일을 삭제했습니다.')
    } catch (error) {
      showToast(error.message, 'error')
      throw error
    }
  }, [showToast, state.deleteTodo])

  const handleToggle = useCallback(async (todo) => {
    try {
      const updated = await state.toggleTodo(todo)
      showToast(updated.status === 'completed' ? '멋져요! 할 일을 완료했습니다.' : '할 일을 다시 진행 중으로 바꿨습니다.')
    } catch (error) {
      showToast(error.message, 'error')
    }
  }, [showToast, state.toggleTodo])

  return (
    <>
      <PageHeader
        eyebrow="My tasks"
        title="할 일"
        description="검색하고, 상태를 바꾸고, 완료한 일을 차곡차곡 쌓아보세요."
        action={<Link className="button button-primary" to="/todos/new"><Plus size={18} /> 새 할 일</Link>}
      />
      {state.loading ? <LoadingState /> : state.error ? (
        <div style={{ marginBottom: '1rem' }}><Alert>{state.error} <Button type="button" variant="ghost" size="sm" onClick={state.refresh}><RefreshCw size={14} /> 다시 시도</Button></Alert></div>
      ) : state.todos.length === 0 ? (
        <EmptyState title="아직 할 일이 없어요" description="첫 할 일을 만들고 오늘의 초점을 정해보세요." action={<Link className="button button-primary" to="/todos/new"><Plus size={17} /> 할 일 만들기</Link>} />
      ) : (
        <>
          <TodoSearch query={state.query} onQueryChange={state.setQuery} filter={state.filter} onFilterChange={state.setFilter} />
          <p className="result-count"><ListFilter size={14} style={{ verticalAlign: '-2px' }} /> 전체 {state.todos.length}개 중 {state.filteredTodos.length}개 표시</p>
          {state.filteredTodos.length === 0 ? (
            <EmptyState icon={SearchX} title="조건에 맞는 할 일이 없어요" description="검색어나 상태 필터를 바꿔보세요." action={<Button type="button" variant="secondary" onClick={() => { state.setQuery(''); state.setFilter('all') }}>필터 초기화</Button>} />
          ) : <TodoList todos={state.filteredTodos} onDelete={handleDelete} onToggle={handleToggle} />}
        </>
      )}
    </>
  )
}
