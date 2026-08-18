import { CircleAlert, Info } from 'lucide-react'

export function Alert({ children, variant = 'error' }) {
  return (
    <div className={`alert alert-${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      {variant === 'error' ? <CircleAlert size={20} /> : <Info size={20} />}
      <div>{children}</div>
    </div>
  )
}
