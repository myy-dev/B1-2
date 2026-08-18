export function Field({ label, name, error, hint, required = false, children }) {
  return (
    <div className="field">
      <label className="label" htmlFor={name}>
        {label} {required && <span className="required" aria-hidden="true">*</span>}
      </label>
      {children}
      {error ? <p className="field-error" id={`${name}-error`}>{error}</p> : hint ? <p className="field-hint" id={`${name}-hint`}>{hint}</p> : null}
    </div>
  )
}

export function Input({ error, ...props }) {
  return <input className={`input ${error ? 'input-error' : ''}`} aria-invalid={Boolean(error)} {...props} />
}

export function Textarea({ error, ...props }) {
  return <textarea className={`textarea ${error ? 'input-error' : ''}`} aria-invalid={Boolean(error)} {...props} />
}

export function Select(props) {
  return <select className="select" {...props} />
}
