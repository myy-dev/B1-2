import { Route, Routes } from 'react-router-dom'
import Layout from '@/components/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import HomePage from '@/pages/HomePage'
import TodosPage from '@/pages/TodosPage'
import TodoDetailPage from '@/pages/TodoDetailPage'
import NewTodoPage from '@/pages/NewTodoPage'
import EditTodoPage from '@/pages/EditTodoPage'
import ProfilePage from '@/pages/ProfilePage'
import SettingsPage from '@/pages/SettingsPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="todos" element={<TodosPage />} />
          <Route path="todos/new" element={<NewTodoPage />} />
          <Route path="todos/:id" element={<TodoDetailPage />} />
          <Route path="todos/:id/edit" element={<EditTodoPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
