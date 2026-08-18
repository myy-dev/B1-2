import { AuthProvider } from './AuthContext'
import { ThemeProvider } from './ThemeContext'
import { ToastProvider } from './ToastContext'

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
