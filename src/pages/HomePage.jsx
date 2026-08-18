import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Feather, ShieldCheck, Sparkles } from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'
import { Card } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { LoadingState } from '@/components/ui/LoadingState'

export default function HomePage() {
  const { stats, loading, error, refresh } = useTodos()
  const completionRate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Simple focus, meaningful progress</p>
          <h1>복잡한 하루를<br /><span>가볍게 정리하세요.</span></h1>
          <p className="page-description">해야 할 일을 한곳에 모으고, 지금 중요한 일에 집중하세요. Focus Todo는 계획부터 완료까지 흐름을 단순하게 만듭니다.</p>
          <div className="hero-actions">
            <Link className="button button-primary button-lg" to="/todos/new">첫 할 일 만들기 <ArrowRight size={18} /></Link>
            <Link className="button button-secondary button-lg" to="/todos">목록 둘러보기</Link>
          </div>
        </div>
        <Card className="hero-board" aria-label="할 일 목록 미리보기">
          <div className="hero-board-inner">
            <div className="todo-card-top"><strong>오늘의 포커스</strong><span className="badge badge-completed">{completionRate}% 완료</span></div>
            <div className="demo-list">
              {[
                ['주간 목표 세 가지 정하기', true],
                ['가장 어려운 작업 먼저 시작하기', false],
                ['하루 마무리 기록 남기기', false],
              ].map(([label, done]) => (
                <div className="demo-item" key={label}>
                  <span className="demo-check">{done ? '✓' : ''}</span>
                  <span style={{ textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--muted)' : 'inherit' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="dashboard-section" aria-labelledby="summary-title">
        <p className="eyebrow">Your progress</p>
        <h2 id="summary-title">지금까지의 흐름</h2>
        {loading ? <LoadingState count={3} label="진행 현황을 불러오는 중" /> : error ? (
          <Alert>{error} <Button type="button" variant="ghost" size="sm" onClick={refresh}>다시 시도</Button></Alert>
        ) : <div className="stats-grid">
          <Card className="stat-card"><p className="stat-value">{stats.total}</p><strong>전체 할 일</strong><p>머릿속의 일을 밖으로 꺼냈어요.</p></Card>
          <Card className="stat-card"><p className="stat-value">{stats.active}</p><strong>진행 중</strong><p>지금 집중할 일이 남아 있어요.</p></Card>
          <Card className="stat-card"><p className="stat-value">{completionRate}%</p><strong>완료율</strong><p>작은 완료가 큰 변화를 만들어요.</p></Card>
        </div>}
      </section>

      <section className="dashboard-section" aria-labelledby="features-title">
        <p className="eyebrow">Why Focus Todo</p>
        <h2 id="features-title">할 일 관리에 꼭 필요한 것만</h2>
        <div className="feature-grid">
          {[
            [Feather, '가벼운 기록', '복잡한 설정 없이 제목과 설명만으로 빠르게 시작해요.'],
            [BarChart3, '명확한 진행', '진행 중과 완료 상태를 나눠 오늘의 흐름을 한눈에 봐요.'],
            [ShieldCheck, '어디서나 이어서', 'Supabase에 저장되어 다른 브라우저에서도 같은 할 일을 확인할 수 있어요.'],
          ].map(([Icon, title, description]) => (
            <Card className="feature-card" key={title}><div className="feature-icon"><Icon size={21} /></div><h3>{title}</h3><p>{description}</p></Card>
          ))}
        </div>
      </section>
      <div style={{ display: 'none' }}><Sparkles /></div>
    </>
  )
}
