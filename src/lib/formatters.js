const koreanDate = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : koreanDate.format(date)
}

export const statusLabel = {
  active: '진행 중',
  completed: '완료',
}
