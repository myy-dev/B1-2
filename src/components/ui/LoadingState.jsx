export function LoadingState({ count = 4, label = '콘텐츠를 불러오는 중' }) {
  return (
    <div aria-label={label} aria-busy="true">
      <span className="sr-only">{label}</span>
      <div className="todo-grid">
        {Array.from({ length: count }, (_, index) => <div className="skeleton skeleton-card" key={index} />)}
      </div>
    </div>
  )
}
