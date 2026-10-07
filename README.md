# 오떠끼 (oh-topokki) 🌶️

> 떡볶이 맛집을 지도에서 찾고, 등록하고, 리뷰를 남기는 떡볶이 특화 맛집 서비스

**배포**: https://tteokbokki.cc (iOS는 Capacitor 래핑, 심사 준비 중)

일반 맛집 앱은 "떡볶이집"이라는 것까지만 알려줍니다. 오떠끼는 떡볶이를 좋아하는 사람이 실제로 궁금해하는 것 — **밀떡/쌀떡, 소스 종류, 매운맛 단계와 조절 가능 여부, 사리·사이드 구성, 순대 내장 종류** — 를 구조화된 데이터로 쌓는 것을 목표로 합니다.

## 기술 스택

| 영역 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | Next.js (App Router) + React 19 | 프론트와 API를 하나의 모놀리스로 운영 |
| API | Route Handler (`app/api/**`) REST | Server Actions 대신 REST 유지 — 모바일 클라이언트가 같은 API를 재사용 |
| DB / ORM | Neon (Postgres) + Prisma | 풀링/다이렉트 URL 분리, 스키마 자산 재활용 |
| 인증 | Better Auth | TS 네이티브, Prisma 어댑터로 세션·계정 테이블을 같은 DB에서 관리 |
| 상태 관리 | TanStack Query + Jotai | 서버 상태와 클라이언트 상태(지도 위치 등) 분리 |
| UI | Tailwind CSS 4, Base UI, overlay-kit, sonner | |
| 지도 | Naver Maps SDK + 네이버 지역검색 API | |
| 모바일 | Capacitor (iOS) | 웹뷰 원격 URL 모드로 웹 배포 = 앱 업데이트 |

## 프로젝트 구조

Feature-Sliced Design을 참고한 레이어 구조입니다.

```
app/          # 라우팅 + API Route Handler
widgets/      # 지도, 플로팅 메뉴 등 조합 단위
features/     # auth · restaurant · review · favorite · search
shared/       # api, hooks, store, ui, types 등 공용 계층
lib/          # Better Auth 서버/클라이언트 인스턴스
prisma/       # 스키마 (User + 도메인 모델 통합)
```

## 고민했던 점들

### 1. 데이터 유실 사고에서 시작한 백엔드 재구축
초기 버전은 Supabase 무료 플랜이었는데, 미사용으로 일시정지된 뒤 복원 기한(90일)이 지나 **서비스 데이터를 전부 잃었습니다.** 백업 파일을 받아봤지만 `public` 스키마 자체가 누락돼 복구 불가였습니다.

- 원인을 "Supabase의 문제"가 아니라 **백업 없이 운영한 문제**로 정리하고, 새 스택(Neon)에서는 GitHub Actions로 매주 `pg_dump` 자동 백업(`.github/workflows/backup.yml`)을 가장 먼저 세팅했습니다.
- 남아있던 `schema.prisma`로 테이블은 재생성하고, 데이터 0건인 시점을 기회 삼아 미뤄뒀던 스키마 정리(enum 도입, 필드명 일관화, FK 인덱스 추가)를 일괄 진행했습니다.

### 2. 인증: Supabase Auth → Better Auth
- 관리형 Neon Auth(beta)도 검토했지만, 안정성 문제로 순정 Better Auth(stable)를 선택했습니다.
- Better Auth의 내부 필드 `name`을 DB 컬럼 `nickname`에 매핑하고, 앱 전역에서는 `AuthContext`가 `nickname`으로 정규화해 도메인 용어를 통일했습니다.

### 3. 유저 탈퇴 시 데이터 정책
데이터 성격에 따라 삭제 정책을 다르게 가져갔습니다.

- **맛집 정보는 커뮤니티 자산** → `authorId`를 nullable로 두고 `onDelete: SetNull`로 보존
- **리뷰도 커뮤니티 자산** → `onDelete: SetNull`로 내용·별점은 보존하고 "탈퇴한 사용자"로 표시 (별점 집계도 그대로 유지)
- **즐겨찾기는 개인 데이터** → `onDelete: Cascade`로 함께 삭제

### 4. 스키마 설계
- 단일 선택 값(`topokkiType`, `sundaeType`)은 enum으로 강제하고, 다중 선택(소스·사리 등)은 확장이 쉬운 `String[]`로 유지했습니다.
- Postgres는 FK에 인덱스를 자동 생성하지 않으므로 조회 패턴에 맞춰 FK 인덱스를 직접 추가했습니다.

## UX에서 신경 쓴 점

- **비로그인 익명 리뷰**: 가입 장벽 때문에 리뷰가 안 쌓이는 걸 막기 위해, 비로그인도 별점 없이 의견을 남길 수 있습니다. 서버가 "익명의○○" 랜덤 닉네임을 생성하고 IP 앞 2옥텟만 저장해 최소한의 식별성을 줍니다.
- **인기 랭킹의 빈 화면 방지**: 조회수 → 찜 → 리뷰 순으로 정렬하되, 활동이 없는 초기에는 최근 등록 식당으로 채우고 `unrank` 플래그로 구분해 서비스 초기에도 랭킹이 비어 보이지 않게 했습니다.
- **모바일 제스처 중심 UI**: 지도 위 정보는 bottom sheet로 제공하고, sticky 헤더·가로 스크롤 등 터치 인터랙션을 다듬었습니다.
- **한국어 디테일**: `es-hangul`로 조사(을/를 등)를 자동 처리해 동적 문구가 자연스럽게 읽히도록 했습니다.
- **장소 검색**: 네이버 지역검색 API를 서버 라우트로 프록시해 키를 노출하지 않고, 검색어 하이라이트를 제공합니다.

## 배포 · 운영

- **웹**: Vercel — push 시 자동 배포, `build` 단계에서 `prisma generate` 포함
- **iOS**: Capacitor 원격 URL 모드 — 웹뷰가 프로덕션 웹을 직접 로드하므로 웹 배포만으로 앱도 최신 상태 유지
- **DB 백업**: GitHub Actions에서 매주 `pg_dump` → artifact 90일 보관
- **데이터 시딩**: `scripts/import-restaurants.mjs`로 JSON 일괄 등록 (재실행 시 `skipDuplicates`로 멱등)

## 로컬 실행

```bash
pnpm install
# .env: DATABASE_URL, DIRECT_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL,
#       NAVER_CLIENT_ID, NAVER_CLIENT_SECRET
pnpm db:push
pnpm dev
```