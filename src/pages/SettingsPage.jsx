import { useState } from 'react'
import { Database, Moon, RotateCcw, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { todosApi } from '@/lib/todosApi'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PageHeader } from '@/components/ui/PageHeader'

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { showToast } = useToast()
  const { user } = useAuth()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [clearing, setClearing] = useState(false)

  const handleClear = async () => {
    setClearing(true)
    try {
      await todosApi.clearTodos(user.id)
      showToast('내 할 일을 모두 삭제했습니다.')
      setConfirmOpen(false)
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="page-narrow">
      <PageHeader eyebrow="Preferences" title="설정" description="보기 방식과 내 계정에 저장된 데이터를 관리하세요." />
      <div className="settings-grid">
        <Card className="setting-row">
          <div><h3>화면 테마</h3><p>눈에 편한 {theme === 'light' ? '다크' : '라이트'} 모드로 전환합니다.</p></div>
          <Button type="button" variant="secondary" onClick={toggleTheme}>{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />} {theme === 'light' ? '다크 모드' : '라이트 모드'}</Button>
        </Card>
        <Card className="setting-row">
          <div><h3>내 데이터 초기화</h3><p>현재 계정에 저장된 할 일만 영구 삭제합니다.</p></div>
          <Button type="button" variant="danger" onClick={() => setConfirmOpen(true)}><RotateCcw size={17} /> 초기화</Button>
        </Card>
        <Card className="setting-row">
          <div><h3>데이터 저장소</h3><p>Supabase Data API를 통해 원격으로 저장합니다.</p></div>
          <span className="badge badge-completed"><Database size={13} /> Supabase</span>
        </Card>
      </div>
      <ConfirmDialog open={confirmOpen} title="내 할 일을 모두 삭제할까요?" description="현재 계정의 할 일만 삭제되며 다른 사용자의 데이터에는 영향을 주지 않습니다." confirmLabel="모두 삭제" loading={clearing} onConfirm={handleClear} onCancel={() => setConfirmOpen(false)} />
    </div>
  )
}
