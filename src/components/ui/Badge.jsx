import { Circle, CircleCheck } from 'lucide-react'
import { statusLabel } from '@/lib/formatters'

export function Badge({ status }) {
  return (
    <span className={`badge badge-${status}`}>
      {status === 'completed' ? <CircleCheck size={13} /> : <Circle size={12} />}
      {statusLabel[status] ?? status}
    </span>
  )
}
