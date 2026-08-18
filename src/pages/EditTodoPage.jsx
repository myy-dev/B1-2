import { useNavigate, useParams } from 'react-router-dom'
import { useTodo } from '@/hooks/useTodo'
import { useIsMounted } from '@/hooks/useIsMounted'
import { todosApi } from '@/lib/todosApi'
import { useToast } from '@/context/ToastContext'
import { TodoForm } from '@/components/TodoForm'
import { Alert } from '@/components/ui/Alert'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingState } from '@/components/ui/LoadingState'
import { PageHeader } from '@/components/ui/PageHeader'

export default function EditTodoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { todo, loading, error } = useTodo(id)
  const mounted = useIsMounted()

  const handleSubmit = async (values) => {
    const updated = await todosApi.updateTodo(id, values)
    if (!mounted.current) return
    showToast('변경 내용을 저장했습니다.')
    navigate(`/todos/${updated.id}`, { replace: true })
  }

  if (loading) return <LoadingState count={1} label="수정할 할 일을 불러오는 중" />
  if (error) return <Alert>{error}</Alert>
  if (!todo) return <EmptyState title="수정할 할 일을 찾을 수 없어요" description="목록에서 다른 할 일을 선택해 주세요." />

  return (
    <div className="page-narrow">
      <PageHeader eyebrow="Edit" title="할 일 수정" description="계획이 달라졌다면 제목, 설명, 상태를 업데이트하세요." />
      <TodoForm initialValues={todo} onSubmit={handleSubmit} submitLabel="변경 저장" cancelTo={`/todos/${id}`} />
    </div>
  )
}
