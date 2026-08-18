import { Link } from 'react-router-dom'
import { Save } from 'lucide-react'
import { useTodoForm } from '@/hooks/useTodoForm'
import { Alert } from './ui/Alert'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Field, Input, Select, Textarea } from './ui/FormFields'

export function TodoForm({ initialValues, onSubmit, submitLabel = '저장하기', cancelTo = '/todos' }) {
  const form = useTodoForm({ initialValues, onSubmit })
  const { values, errors, submitError, submitting, handleChange, handleSubmit } = form

  return (
    <Card className="form-card">
      <form className="todo-form" onSubmit={handleSubmit} noValidate>
        {submitError && <Alert>{submitError}</Alert>}
        <Field label="할 일" name="title" error={errors.title} required hint="80자 이내로 입력해 주세요.">
          <Input
            id="title"
            name="title"
            placeholder="예: 프로젝트 발표 자료 완성하기"
            value={values.title}
            onChange={handleChange}
            error={errors.title}
            aria-describedby={errors.title ? 'title-error' : 'title-hint'}
            maxLength={81}
            autoFocus
          />
        </Field>
        <Field label="설명" name="description" error={errors.description} hint={`${values.description.length}/500자`}>
          <Textarea
            id="description"
            name="description"
            placeholder="필요한 맥락이나 다음 행동을 적어두세요."
            value={values.description}
            onChange={handleChange}
            error={errors.description}
            aria-describedby={errors.description ? 'description-error' : 'description-hint'}
            maxLength={501}
          />
        </Field>
        <Field label="상태" name="status">
          <Select id="status" name="status" value={values.status} onChange={handleChange}>
            <option value="active">진행 중</option>
            <option value="completed">완료</option>
          </Select>
        </Field>
        <div className="preview" aria-live="polite">
          <div className="preview-label">실시간 미리보기</div>
          <h3>{values.title.trim() || '할 일 제목이 여기에 보여요'}</h3>
          <p>{values.description.trim() || '설명을 입력하면 저장 전에 모습을 확인할 수 있어요.'}</p>
        </div>
        <div className="form-actions">
          {submitting
            ? <span className="button button-secondary button-disabled" aria-disabled="true">취소</span>
            : <Link className="button button-secondary" to={cancelTo}>취소</Link>}
          <Button type="submit" loading={submitting}>
            <Save size={17} /> {submitting ? '저장 중…' : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  )
}
