import { useEffect, useState } from 'react'

const emptyValues = { title: '', description: '', status: 'active' }

function validateField(name, value) {
  if (name === 'title') {
    if (!value.trim()) return '할 일을 입력하세요.'
    if (value.trim().length > 80) return '제목은 80자 이하로 입력하세요.'
  }
  if (name === 'description' && value.length > 500) return '설명은 500자 이하로 입력하세요.'
  return ''
}

export function useTodoForm({ initialValues = emptyValues, onSubmit }) {
  const [values, setValues] = useState(() => ({ ...emptyValues, ...initialValues }))
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setValues({ ...emptyValues, ...initialValues })
  }, [initialValues?.id])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setSubmitError('')
    setErrors((current) => current[name] === undefined
      ? current
      : { ...current, [name]: validateField(name, value) })
  }

  const validate = () => {
    const nextErrors = {}
    const titleError = validateField('title', values.title)
    const descriptionError = validateField('description', values.description)
    if (titleError) nextErrors.title = titleError
    if (descriptionError) nextErrors.description = descriptionError
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event?.preventDefault()
    if (!validate()) return false
    setSubmitting(true)
    setSubmitError('')
    try {
      await onSubmit({
        title: values.title.trim(),
        description: values.description.trim(),
        status: values.status,
      })
      return true
    } catch (err) {
      setSubmitError(err.message || '저장하지 못했습니다. 잠시 후 다시 시도해 주세요.')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return { values, errors, submitError, submitting, handleChange, handleSubmit }
}
