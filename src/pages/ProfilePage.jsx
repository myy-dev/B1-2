import { CalendarDays, Database, UserRound } from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'
import { useAuth } from '@/context/AuthContext'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingState } from '@/components/ui/LoadingState'
import { PageHeader } from '@/components/ui/PageHeader'

export default function ProfilePage() {
  const { user } = useAuth()
  const { stats, loading, error, refresh } = useTodos()
  return (
    <div className="page-narrow">
      <PageHeader eyebrow="Profile" title="프로필" description="Supabase Auth로 로그인한 계정의 작업 현황입니다." />
      <Card className="profile-card">
        <div className="avatar"><UserRound size={30} /></div>
        <div><h2>Focus 사용자</h2><p>{user?.email}</p></div>
      </Card>
      <section className="dashboard-section" aria-labelledby="profile-stats">
        <h2 id="profile-stats">나의 기록</h2>
        {loading ? <LoadingState count={2} /> : error ? (
          <Alert>{error} <Button type="button" variant="ghost" size="sm" onClick={refresh}>다시 시도</Button></Alert>
        ) : (
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <Card className="stat-card"><CalendarDays size={20} /><p className="stat-value">{stats.completed}</p><strong>완료한 할 일</strong></Card>
            <Card className="stat-card"><Database size={20} /><p className="stat-value">{stats.total}</p><strong>저장된 전체 기록</strong></Card>
          </div>
        )}
      </section>
      <div className="alert alert-info" style={{ marginTop: '1rem' }}>
        <Database size={20} />
        <div><strong>사용자별 데이터 보호</strong><br />현재 계정이 소유한 할 일만 RLS 정책을 통해 조회합니다.</div>
      </div>
    </div>
  )
}
