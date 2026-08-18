import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Check, Home, ListTodo, LogOut, Moon, Plus, Settings, Sun, UserRound } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'

const links = [
  { to: '/', label: '홈', icon: Home, end: true },
  { to: '/todos', label: '할 일', icon: ListTodo },
  { to: '/todos/new', label: '추가', icon: Plus },
  { to: '/profile', label: '프로필', icon: UserRound },
  { to: '/settings', label: '설정', icon: Settings },
]

function Navigation({ mobile = false }) {
  return (
    <nav className={mobile ? 'mobile-nav' : 'desktop-nav'} aria-label={mobile ? '모바일 주 메뉴' : '주 메뉴'}>
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Icon size={mobile ? 18 : 17} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Layout() {
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  const { showToast } = useToast()
  const location = useLocation()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      showToast(error.message, 'error')
    }
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
      <header className="site-header">
        <div className="header-inner">
          <NavLink to="/" className="brand" aria-label="Focus Todo 홈">
            <span className="brand-mark"><Check size={20} strokeWidth={3} /></span>
            <span className="brand-text">Focus Todo</span>
          </NavLink>
          <Navigation />
          <div className="header-actions">
            <span className="user-email" title={user?.email}>{user?.email}</span>
            <button className="icon-button" type="button" onClick={toggleTheme} aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className="icon-button" type="button" onClick={handleSignOut} aria-label="로그아웃" title="로그아웃">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>
      <main className="page-container" id="main-content">
        <div className="route-view" key={location.pathname}><Outlet /></div>
      </main>
      <Navigation mobile />
    </div>
  )
}
