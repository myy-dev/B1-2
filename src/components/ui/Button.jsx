import { forwardRef } from 'react'
import { LoaderCircle } from 'lucide-react'

export const Button = forwardRef(function Button({ children, variant = 'primary', size = 'md', loading = false, className = '', disabled, ...props }, ref) {
  return (
    <button
      ref={ref}
      className={`button button-${variant} ${size !== 'md' ? `button-${size}` : ''} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoaderCircle className="spin" size={17} aria-hidden="true" />}
      {children}
    </button>
  )
})
