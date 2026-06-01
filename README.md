# React 핵심 개념 마스터: SPA 서비스 구현

React와 원격 데이터베이스(Supabase/Firebase)를 연동해 SPA(Single Page Application) 서비스를 구현하는 프로젝트입니다.

---

## 기술 스택 (Tech Stack)

- **Frontend Core:** React 18+
- **Routing:** React Router (또는 기타 라우팅 라이브러리)
- **Database / BaaS:** Supabase / Firebase (택 1)
- **Styling:** 순수 CSS / CSS Modules / Tailwind CSS / Styled-components / Emotion / UI 라이브러리 (MUI, Chakra 등) 중 택 1
- **Deployment:** Vercel / Netlify (택 1)

---

## 시작 가이드 (Getting Started)

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 API Key 및 필수 설정을 입력합니다.

> **주의:** `.env` 파일에는 민감 정보가 포함되므로 절대 GitHub에 푸시하지 마세요. (`.gitignore` 등록 필수)

```env
# 예시 (사용 중인 BaaS 설정에 맞게 입력)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# 또는 Firebase 설정
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

### 3. 로컬 실행

```bash
npm run dev
```

### 4. 프로덕션 빌드

```bash
npm run build
```

### 5. 배포 환경 설정

- Vercel/Netlify 등 대시보드의 **Environment Variables** 설정에 `.env` 파일의 변수들을 동일하게 등록해야 배포 환경에서 정상 작동합니다.

---

## 프로젝트 구조

```text
.
├── public/                 # 정적 자원 (이미지, 아이콘 등)
├── src/
│   ├── assets/             # 스타일 및 미디어 자원
│   ├── components/         # 재사용 UI 컴포넌트 (공통 Button, Input, Card 등)
│   ├── hooks/              # 커스텀 훅 (비동기 데이터 fetch, 상태 로직 분리 등)
│   ├── lib/                # 외부 라이브러리 설정 (Supabase/Firebase 초기화 등)
│   └── pages/              # 라우트 단위 화면 컴포넌트 (목록, 상세, 폼 등)
├── .env                    # API Key 및 환경 변수 (Git 제외 대상)
├── .gitignore              # 버전 관리 제외 설정
├── package.json            # 의존성 및 스크립트 관리 정의
└── README.md               # 프로젝트 가이드 및 설명서
```

---

## 수행 항목 체크리스트

### 프로젝트 기본 구성

- [ ] React 18 이상 버전 초기 세팅 완료
- [ ] 역할별 폴더 구조 분리 (`pages`, `components`, `hooks`, `lib`)
- [ ] 주요 페이지에 공통 레이아웃(헤더/네비게이션 등) 적용
- [ ] 단일 핵심 데이터 CRUD 모델 및 서비스 주제 선정

### 라우팅 (Routing)

- [ ] 최소 5개 이상의 주요 페이지 라우트 구현 (예: `/`, `/items`, `/items/:id`, `/items/new`, `/profile` 등)
- [ ] 목록 및 상세 화면 라우트 구분 설계 (`/items`, `/items/:id`)
- [ ] 잘못된 경로 접근 시 노출될 `Not Found` 페이지 구현
- [ ] 네비게이션 바를 통한 원활한 라우트 간 이동 경로 제공

### 컴포넌트 설계

- [ ] 최소 8개 이상의 재사용 UI 컴포넌트 구현 (예: `Button`, `Input`, `Card` 등)
- [ ] 재사용 컴포넌트가 최소 1개 이상의 `prop`을 받아 동적으로 렌더링되도록 설계
- [ ] 페이지 컴포넌트와 UI 컴포넌트의 명확한 역할 분리
- [ ] 공통 UI 패턴(로딩, 에러, 빈 상태)을 재사용 컴포넌트로 일관되게 처리

### 상태 관리

- [ ] 제어 컴포넌트(Controlled Input) 기반의 폼 입력 상태 관리
- [ ] 목록 및 상세 조회를 위한 데이터 상태 관리
- [ ] 비동기 처리를 위한 로딩 및 에러 상태 관리
- [ ] 데이터 조회/갱신 흐름 중 최소 1개 이상을 커스텀 훅(`useItems` 등)으로 분리

### 원격 CRUD 연동

- [ ] Supabase 또는 Firebase 원격 데이터베이스 연동 환경 세팅
- [ ] **목록 조회:** 리스트 형태의 데이터 렌더링
- [ ] **상세 조회:** 라우트 파라미터(`:id`) 기반 단일 데이터 로드 및 렌더링
- [ ] **등록 및 수정:** 폼 제출 성공 시 목록/상세 페이지 리다이렉트 및 데이터 갱신
- [ ] **삭제:** 데이터 삭제 후 목록 갱신 및 리다이렉트 처리

### 폼 UX 개선

- [ ] 등록 및 수정 폼 내 필수 값 유효성 검증 (빈 값 제출 불가 처리)
- [ ] 입력 필드 근처 또는 화면 상단에 에러 메시지 표시
- [ ] 제출 중 상태 반영 (제출 중 버튼 비활성화 또는 스피너 표시)
- [ ] 네트워크 에러 등 실패 상황 발생 시 안내 UI 제공

### 이벤트 & 렌더링 검증

- [ ] 사용자 이벤트 -> 상태 변경 -> UI 리렌더링 흐름 구축
- [ ] 상태 변경이 리렌더링으로 이어지는 지점 최소 3군데 이상 명확히 구현
  - _예시: 필터/검색 변경에 따른 목록 갱신, 실시간 입력 미리보기 반영, 저장 성공 알림 등_

### 배포 및 환경 검증

- [ ] Vercel 또는 Netlify 등을 통한 외부 배포 완료
- [ ] 배포 URL에서 CRUD 기능 전체 정상 동작 확인
- [ ] 배포 플랫폼 대시보드 내 환경 변수(Environment Variables) 등록 및 검증
- [ ] GitHub 레포지토리 제출 준비 및 README에 빌드/실행 명령어 정리

### 보너스 과제

- [ ] **전역 상태:** 로그인 사용자(Auth), 테마, 토스트 알림 중 1개 이상을 Context API 등으로 관리
- [ ] **성능 최적화:** 불필요한 렌더링 방지를 위해 `useMemo`, `useCallback`, `React.memo` 중 1개 이상 적용
- [ ] **인증 및 보호 라우트:** Supabase/Firebase Auth 로그인 흐름 및 비로그인 접근 차단 보호 라우트 구현

---

## 제약 사항

- **프레임워크:** 표준 React 18+ 기반 구현 (타 SPA 프레임워크 배제)
- **데이터베이스:** 원격 관리를 위해 Supabase 또는 Firebase 필수 연동
- **폴더 아키텍처:** `pages`, `components`, `hooks`(또는 `lib`) 디렉토리 규칙 준수
- **환경 변수 보안:** API Key 등 민감 정보는 `.env`로 관리하고, `.gitignore`에 등록하여 노출 방지
- **아키텍처 중심 개발:** 화려한 UI보다 React 컴포넌트 구조와 비동기 데이터 흐름(로딩/에러/빈 상태) 완성이 최우선
- **단일 책임 컴포넌트:** 재사용 UI 컴포넌트 설계 시 최소 1개 이상의 props 수신 구조 반영
- **상태 위치 최적화:** Props(하향) 및 이벤트 콜백(상향) 흐름을 고려한 상태의 위치(부모/로컬) 최적 설계
- **비동기 예외 처리:** API 호출 실패 또는 로딩 상황 발생 시 사용자 친화적인 UI/UX 제공
- **커스텀 훅 분리:** 비동기 비즈니스 로직은 최소 1개 이상의 커스텀 훅으로 캡슐화하여 관리
