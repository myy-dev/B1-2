import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useTodo } from '@/hooks/useTodo'
import { todosApi } from '@/lib/todosApi'
import { formatDate } from '@/lib/formatters'
import { useToast } from '@/context/ToastContext'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingState } from '@/components/ui/LoadingState'

export default function TodoDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { todo, loading, error } = useTodo(id)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await todosApi.deleteTodo(id)
      showToast('할 일을 삭제했습니다.')
      navigate('/todos', { replace: true })
    } catch (err) {
      showToast(err.message, 'error')
      setConfirmOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <LoadingState count={1} label="할 일 상세를 불러오는 중" />
  if (error) return <Alert>{error}</Alert>
  if (!todo) return <EmptyState title="할 일을 찾을 수 없어요" description="삭제되었거나 잘못된 주소일 수 있습니다." action={<Link className="button button-primary" to="/todos">목록으로 돌아가기</Link>} />

  return (
    <div className="page-narrow">
      <Link className="button button-ghost button-sm" to="/todos"><ArrowLeft size={16} /> 목록으로</Link>
      <Card className="detail-card" style={{ marginTop: '1rem' }}>
        <div className="detail-header">
          <div><Badge status={todo.status} /><h1 style={{ marginTop: '.8rem' }}>{todo.title}</h1></div>
        </div>
        <div className="detail-body">{todo.description || '등록된 설명이 없습니다.'}</div>
        <div className="detail-footer">
          <span>등록 {formatDate(todo.createdAt)} · 수정 {formatDate(todo.updatedAt)}</span>
          <div className="detail-actions">
            <Button type="button" variant="danger" size="sm" onClick={() => setConfirmOpen(true)}><Trash2 size={15} /> 삭제</Button>
            <Link className="button button-primary button-sm" to={`/todos/${todo.id}/edit`}><Pencil size={15} /> 수정</Link>
          </div>
        </div>
      </Card>
      <ConfirmDialog open={confirmOpen} title="할 일을 삭제할까요?" description="삭제한 내용은 되돌릴 수 없습니다." confirmLabel="삭제하기" loading={deleting} onConfirm={handleDelete} onCancel={() => setConfirmOpen(false)} />
    </div>
  )
}
