# Focus Todo

React의 라우팅, 컴포넌트 설계, 제어 폼, 비동기 CRUD, 상태 관리 흐름을 한 프로젝트에서 확인할 수 있는 Todo List SPA입니다.

현재 버전은 **Supabase Auth + 원격 데이터베이스 모드**입니다. 이메일/비밀번호 인증과 보호 라우트를 사용하며, `public.todos`의 `user_id` 소유권 RLS를 통해 각 사용자는 자기 할 일만 CRUD할 수 있습니다.

## 주요 기능

- 할 일 목록, 상세 조회, 등록, 수정, 삭제
- 진행 중/완료 상태 즉시 전환
- 제목·설명 검색과 상태 필터
- 제어 컴포넌트 기반 폼, 필수 값/글자 수 검증, 실시간 미리보기
- 로딩, 오류, 빈 상태, 제출 중 상태, 삭제 확인 모달
- 저장/수정/삭제 결과 토스트
- 반응형 데스크톱·모바일 내비게이션과 404 페이지
- Context API 기반 전역 테마·토스트 상태
- 라이트/다크 테마와 브라우저 저장
- Supabase Data API 기반 원격 비동기 CRUD
- 이메일/비밀번호 회원가입·로그인·로그아웃과 세션 유지
- 보호 라우트와 `auth.uid() = user_id` 기반 사용자별 RLS

## 기술 스택

- React 18
- React Router 7
- Vite 8
- Supabase JavaScript SDK 2
- 순수 CSS 디자인 시스템
- Lucide React
- Vitest 4, Testing Library
- Vercel SPA rewrite 설정

## 시작하기

요구 환경은 Node.js 22 이상입니다.

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local`에 Supabase Project URL과 publishable key를 입력한 뒤 Vite가 출력한 로컬 주소로 접속합니다. 기존 프로젝트는 legacy anon 키도 사용할 수 있지만 `service_role`/secret 키는 브라우저 환경 변수에 절대 넣으면 안 됩니다.

### 명령어

```bash
npm run dev          # 개발 서버
npm test             # 테스트 1회 실행
npm run test:watch   # 테스트 watch 모드
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
npm run check        # 테스트 후 빌드
```

## 라우트

| 경로 | 화면 | 역할 |
| --- | --- | --- |
| `/login` | 로그인·회원가입 | Supabase Auth 이메일/비밀번호 인증 |
| `/` | 홈 | 소개, CRUD 현황 요약 |
| `/todos` | 할 일 목록 | 목록 조회, 검색, 상태 필터, 완료 전환, 삭제 |
| `/todos/new` | 새 할 일 | 등록 폼, 검증, 실시간 미리보기 |
| `/todos/:id` | 할 일 상세 | 라우트 파라미터 기반 단일 조회, 수정/삭제 진입 |
| `/todos/:id/edit` | 할 일 수정 | 기존 값 로드, 수정 및 상세 화면 리다이렉트 |
| `/profile` | 프로필 | 사용자 기준 완료/전체 통계 |
| `/settings` | 설정 | 전역 테마, 현재 사용자의 Todo 초기화 |
| `*` | Not Found | 잘못된 경로 안내 |

## 프로젝트 구조

```text
.
├── src/
│   ├── components/
│   │   ├── ui/              # Button, Card, Field, Alert 등 재사용 UI
│   │   ├── Layout.jsx       # 공통 헤더·내비게이션·앱 셸
│   │   ├── TodoForm.jsx     # 등록/수정 공용 폼
│   │   ├── TodoList.jsx     # 메모이제이션된 카드 목록
│   │   └── TodoSearch.jsx   # 검색·상태 필터
│   ├── context/             # Auth, Theme, Toast 전역 상태
│   ├── hooks/               # 목록, 상세, 폼 상태와 비동기 흐름
│   ├── lib/                 # Supabase 클라이언트, CRUD API와 포맷터
│   ├── pages/               # 라우트 단위 화면
│   ├── test/                # Vitest 공통 설정
│   ├── App.jsx              # 라우트 정의
│   └── main.jsx             # React 진입점
├── .env.example
├── supabase/migrations/     # 테이블, GRANT, 사용자별 RLS 재현 SQL
├── vercel.json              # SPA fallback rewrite
├── vite.config.js
└── package.json
```

## 데이터 흐름

```text
사용자 이벤트
  → 페이지/재사용 컴포넌트
  → useTodos / useTodo / useTodoForm
  → todosApi → Supabase Auth 세션 → Data API → public.todos
  → RLS에서 auth.uid()와 user_id 소유권 확인
  → loading/error/data 상태 변경
  → 목록·상세·폼·토스트 UI 리렌더링
```

`src/lib/todosApi.js`는 아래 메서드를 제공합니다.

- `listTodos()`
- `getTodo(id)`
- `createTodo(values)`
- `updateTodo(id, values)`
- `deleteTodo(id)`
- `clearTodos(userId)` — 현재 로그인 사용자의 행만 초기화

`todosApi`가 Supabase의 snake_case 컬럼을 화면의 camelCase 데이터로 변환하므로 UI와 폼 로직은 데이터베이스 SDK에 직접 의존하지 않습니다.

## 체크리스트 충족 현황

### 프로젝트 기본 구성

- [x] React 18 이상 Vite 프로젝트
- [x] `pages`, `components`, `hooks`, `lib` 역할별 구조
- [x] 공통 헤더·내비게이션 레이아웃
- [x] 단일 Todo CRUD 모델과 서비스 주제

### 라우팅

- [x] 5개 이상 주요 페이지 라우트(실제 8개 + 404)
- [x] `/todos` 목록과 `/todos/:id` 상세 분리
- [x] Not Found 페이지
- [x] 데스크톱·모바일 내비게이션
- [x] `/login` 공개 라우트와 나머지 보호 라우트

### 컴포넌트 설계

- [x] 8개 이상 재사용 UI(Button, Card, Badge, Alert, Field, Input, Textarea, Select, LoadingState, EmptyState, ConfirmDialog, PageHeader)
- [x] props 기반 동적 렌더링
- [x] 페이지와 UI 컴포넌트 역할 분리
- [x] 로딩·오류·빈 상태 공통 컴포넌트

### 상태 관리

- [x] 제어 입력 기반 폼
- [x] 목록·상세 데이터 상태
- [x] 비동기 loading/error/submitting 상태
- [x] `useTodos`, `useTodo`, `useTodoForm` 커스텀 훅

### CRUD

- [x] 목록 조회
- [x] `:id` 기반 상세 조회
- [x] 등록 후 상세 리다이렉트
- [x] 수정 후 상세 리다이렉트 및 갱신
- [x] 삭제 후 목록 갱신 또는 목록 리다이렉트
- [x] Supabase 원격 연결과 authenticated 역할의 명시적 Data API 권한
- [x] `user_id = auth.uid()` 소유권 기반 SELECT/INSERT/UPDATE/DELETE RLS

### 폼 UX와 렌더링

- [x] 빈 제목·최대 글자 수 유효성 검증
- [x] 필드 주변과 폼 상단 오류 메시지
- [x] 제출 중 버튼 비활성화·스피너
- [x] 조회/저장 실패 안내 UI
- [x] 검색 변경 → 필터 목록 리렌더링
- [x] 폼 입력 → 실시간 미리보기 리렌더링
- [x] 상태 전환/저장/삭제 → 카드·통계·토스트 리렌더링

### 보너스

- [x] Context API 전역 테마와 토스트
- [x] `useMemo`, `useCallback`, `React.memo` 적용
- [x] Supabase Auth 회원가입·로그인·로그아웃과 보호 라우트
- [x] 사용자별 데이터 격리와 비로그인 Data API 차단

### 배포 준비

- [x] `npm run build` 스크립트와 Vercel SPA rewrite 설정
- [x] 환경 변수 예시와 `.gitignore` 보안 설정
- [x] GitHub 제출용 실행·테스트·빌드 문서
- [ ] Vercel 실제 배포 URL과 대시보드 환경 변수 — 외부 계정 작업 필요
- [ ] 배포 URL에서 CRUD 최종 확인 — 실제 배포 후 진행

## 테스트 범위

- Supabase API 계층의 목록 정렬, 데이터 변환, 사용자 범위 초기화 및 전체 CRUD
- 존재하지 않는 데이터 수정/삭제 오류
- 폼 필수 값 검증, trim, 저장 실패 상태
- Auth 세션 로드·구독 해제와 로그인/회원가입 화면
- 입력에 따른 실시간 미리보기
- 목록 검색·상태 필터·완료 상태 변경·조회 실패 단일 상태 UI
- 오래된 요청이 최신 상태를 덮지 못하도록 하는 요청 순서 보호
- 확인 모달의 처리 중 닫기 방지·포커스 복원
- 보호 라우트, 주요 라우트와 404 렌더링

```bash
npm run check
```

## Supabase 설정

`.env.example`을 복사해 값을 설정합니다.

```bash
cp .env.example .env.local
```

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

기존 프로젝트에서 legacy key를 사용한다면 `VITE_SUPABASE_ANON_KEY`도 지원합니다. 키가 담긴 `.env.local`은 `.gitignore`에 포함되어 있습니다.

### 데이터베이스 migration

`supabase/migrations`의 SQL을 파일명 순서로 적용합니다.

1. `20260815153506_create_public_todos_demo.sql`: Todo 테이블과 기본 제약조건 생성
2. `20260818071346_secure_todos_with_auth_ownership.sql`: `user_id` 외래키, 인덱스, authenticated 전용 GRANT, 사용자 소유권 RLS 적용

최종 정책은 비로그인 `anon` 역할의 테이블 권한을 제거하고 로그인 사용자에게만 CRUD를 허용합니다. 모든 정책은 `(select auth.uid()) = user_id`를 검사하며 UPDATE에는 `USING`과 `WITH CHECK`가 모두 적용됩니다.

Supabase Dashboard의 **Authentication → URL Configuration**에서 로컬 개발 URL과 실제 배포 URL을 Redirect URLs에 등록해야 합니다. 이메일 확인이 활성화된 프로젝트에서는 회원가입 후 받은 확인 메일을 열어야 로그인할 수 있습니다.

## Vercel 배포

1. 저장소를 Vercel에 연결합니다.
2. Framework Preset은 Vite를 선택합니다.
3. Build Command는 `npm run build`, Output Directory는 `dist`를 사용합니다.
4. `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`를 Vercel 환경 변수에 등록합니다.
5. Supabase Auth의 Site URL 및 Redirect URLs에 Vercel 주소를 등록합니다.
6. 배포 후 회원가입·로그인·로그아웃, 보호 라우트, 목록·상세·등록·수정·삭제와 새로고침 시 SPA fallback을 확인합니다.
