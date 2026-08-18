import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Check, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Input } from '@/components/ui/FormFields'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const { user, signIn, signUp } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const destination = location.state?.from?.pathname || '/todos'

  if (user) return <Navigate to={destination} replace />

  const validate = () => {
    const next = {}
    if (!emailPattern.test(email.trim())) next.email = '올바른 이메일 주소를 입력해 주세요.'
    if (password.length < 6) next.password = '비밀번호는 6자 이상이어야 합니다.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setSubmitError('')
    setNotice('')
    try {
      if (mode === 'login') {
        await signIn({ email: email.trim(), password })
        navigate(destination, { replace: true })
      } else {
        const data = await signUp({ email: email.trim(), password })
        if (data.session) navigate(destination, { replace: true })
        else setNotice('가입 확인 메일을 보냈습니다. 이메일 인증 후 로그인해 주세요.')
      }
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const changeMode = (nextMode) => {
    if (submitting) return
    setMode(nextMode)
    setErrors({})
    setSubmitError('')
    setNotice('')
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-brand"><span className="brand-mark"><Check size={20} strokeWidth={3} /></span><strong>Focus Todo</strong></div>
        <Card className="auth-card">
          <p className="eyebrow">Supabase Auth</p>
          <h1 id="auth-title">{mode === 'login' ? '다시 만나서 반가워요.' : '나만의 할 일을 시작하세요.'}</h1>
          <p className="page-description">로그인하면 내 할 일만 안전하게 저장되고 다른 사용자의 데이터와 분리됩니다.</p>
          <div className="auth-tabs" role="tablist" aria-label="인증 방식">
            <button type="button" role="tab" aria-selected={mode === 'login'} className={`segment ${mode === 'login' ? 'active' : ''}`} onClick={() => changeMode('login')}>로그인</button>
            <button type="button" role="tab" aria-selected={mode === 'signup'} className={`segment ${mode === 'signup' ? 'active' : ''}`} onClick={() => changeMode('signup')}>회원가입</button>
          </div>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {submitError && <Alert>{submitError}</Alert>}
            {notice && <Alert variant="info">{notice}</Alert>}
            <Field label="이메일" name="email" error={errors.email} required>
              <Input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: '' })) }} error={errors.email} />
            </Field>
            <Field label="비밀번호" name="password" error={errors.password} hint="6자 이상 입력해 주세요." required>
              <Input id="password" name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: '' })) }} error={errors.password} />
            </Field>
            <Button type="submit" loading={submitting} className="auth-submit">
              {mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
              {submitting ? '처리 중…' : mode === 'login' ? '로그인' : '회원가입'}
            </Button>
          </form>
        </Card>
      </section>
    </main>
  )
}
