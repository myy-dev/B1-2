import { memo, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, Eye, Pencil, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/formatters'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { ConfirmDialog } from './ui/ConfirmDialog'

const TodoCard = memo(function TodoCard({ todo, onDeleteRequest, onToggle }) {
  return (
    <Card className="todo-card" as="article">
      <div className="todo-card-top">
        <Badge status={todo.status} />
        <Button type="button" variant="ghost" size="sm" onClick={() => onToggle(todo)} aria-label={`${todo.title}을(를) ${todo.status === 'completed' ? '진행 중으로' : '완료로'} 변경`}>
          {todo.status === 'completed' ? <CheckCircle2 size={19} /> : <Circle size={19} />}
        </Button>
      </div>
      <h2 className="todo-title"><Link to={`/todos/${todo.id}`}>{todo.title}</Link></h2>
      <p className="todo-description">{todo.description || '설명이 없는 할 일이에요.'}</p>
      <div className="todo-meta">등록 {formatDate(todo.createdAt)}</div>
      <div className="todo-actions">
        <Button type="button" variant="ghost" size="sm" onClick={() => onDeleteRequest(todo)}><Trash2 size={15} /> 삭제</Button>
        <Link className="button button-ghost button-sm" to={`/todos/${todo.id}`}><Eye size={15} /> 보기</Link>
        <Link className="button button-secondary button-sm" to={`/todos/${todo.id}/edit`}><Pencil size={15} /> 수정</Link>
      </div>
    </Card>
  )
})

export function TodoList({ todos, onDelete, onToggle }) {
  const [selectedTodo, setSelectedTodo] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const closeDialog = useCallback(() => setSelectedTodo(null), [])

  const handleConfirm = async () => {
    if (!selectedTodo) return
    setDeleting(true)
    try {
      await onDelete(selectedTodo.id)
      closeDialog()
    } catch {
      // 상위 화면의 공통 에러/토스트 UI가 실패를 안내합니다.
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="todo-grid">
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onDeleteRequest={setSelectedTodo} onToggle={onToggle} />
        ))}
      </div>
      <ConfirmDialog
        open={Boolean(selectedTodo)}
        title="할 일을 삭제할까요?"
        description={selectedTodo ? `“${selectedTodo.title}”은 삭제 후 되돌릴 수 없습니다.` : ''}
        confirmLabel="삭제하기"
        loading={deleting}
        onConfirm={handleConfirm}
        onCancel={closeDialog}
      />
    </>
  )
}
