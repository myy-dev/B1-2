import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div>
        <div className="not-found-code" aria-hidden="true">404</div>
        <h1>길을 잃었어요</h1>
        <p className="page-description">요청한 페이지가 없거나 주소가 변경되었습니다.</p>
        <Link className="button button-primary" to="/" style={{ marginTop: '1.5rem' }}><ArrowLeft size={17} /> 홈으로 돌아가기</Link>
      </div>
    </div>
  )
}
