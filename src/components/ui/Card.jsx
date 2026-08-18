import { forwardRef } from 'react'

export const Card = forwardRef(function Card({ children, padded = false, className = '', as: Component = 'section', ...props }, ref) {
  return <Component ref={ref} className={`card ${padded ? 'card-padded' : ''} ${className}`.trim()} {...props}>{children}</Component>
})
