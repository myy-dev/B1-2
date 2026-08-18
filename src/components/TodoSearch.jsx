import { Search } from 'lucide-react'
import { Input } from './ui/FormFields'

export function TodoSearch({ query, onQueryChange, filter, onFilterChange }) {
  return (
    <div className="toolbar">
      <div className="search-wrap">
        <Search size={18} />
        <Input
          type="search"
          aria-label="할 일 검색"
          placeholder="제목이나 설명으로 검색"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <div className="segmented" aria-label="상태 필터">
        {[
          ['all', '전체'],
          ['active', '진행 중'],
          ['completed', '완료'],
        ].map(([value, label]) => (
          <button key={value} className={`segment ${filter === value ? 'active' : ''}`} type="button" onClick={() => onFilterChange(value)} aria-pressed={filter === value}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
