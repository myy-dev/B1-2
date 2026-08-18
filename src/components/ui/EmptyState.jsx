import { Inbox } from 'lucide-react'
import { Card } from './Card'

export function EmptyState({ title, description, action, icon: Icon = Inbox }) {
  return (
    <Card className="empty-state">
      <div className="empty-icon"><Icon size={28} /></div>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </Card>
  )
}
