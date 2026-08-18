import { useNavigate } from 'react-router-dom'
import { useIsMounted } from '@/hooks/useIsMounted'
import { todosApi } from '@/lib/todosApi'
import { useToast } from '@/context/ToastContext'
import { TodoForm } from '@/components/TodoForm'
import { PageHeader } from '@/components/ui/PageHeader'

export default function NewTodoPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const mounted = useIsMounted()

  const handleSubmit = async (values) => {
    const created = await todosApi.createTodo(values)
    if (!mounted.current) return
    showToast('새 할 일을 저장했습니다.')
    navigate(`/todos/${created.id}`, { replace: true })
  }

  return (
    <div className="page-narrow">
      <PageHeader eyebrow="Create" title="새 할 일" description="지금 기억해야 할 일을 간단히 적어두세요." />
      <TodoForm onSubmit={handleSubmit} submitLabel="할 일 만들기" />
    </div>
  )
}
