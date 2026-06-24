# CLAUDE.md — todaytopokki

> 이 파일은 Claude Code가 매 세션 자동으로 읽습니다.
> 프로젝트 맥락 · 기술 결정 · 작업 컨벤션을 담고 있습니다.

## 프로젝트 개요

떡볶이 맛집을 등록 · 검색하고 리뷰 / 즐겨찾기를 남기는 웹 앱.
프론트엔드는 **Next.js (App Router)**, 백엔드는 Next.js Route Handler(`app/api/**`)로 처리하는 모놀리식 구조.

- 식당 위치 기반(latitude/longitude) 검색
- 식당별 리뷰 · 평점 · 즐겨찾기
- 떡볶이 특화 속성(소스 종류, 매운맛, 사리 종류, 사이드 메뉴 등)

## 배경: 백엔드를 다시 만드는 이유

- 이전 백엔드는 **Next.js App Router + Prisma + Supabase(Postgres/Auth)** 구성.
- Supabase **무료 플랜 프로젝트가 미사용으로 일시정지**됨 (2024-06-24).
- 90일 경과로 대시보드 in-place 복원 불가 → 백업 다운로드만 가능.
- 다운로드한 logical backup(`db_cluster-*.backup`)에 **`public` 스키마(=Prisma가 만든 `restaurants` 등 모든 테이블)가 누락**되어 있었음. `auth`/`storage`/`realtime`/`vault` 시스템 스키마만 존재, `_prisma_migrations` 흔적조차 없음.
- 결론: **식당/리뷰/즐겨찾기 데이터는 복구 불가**. 테이블 구조(스키마)는 `schema.prisma`에 그대로 남아있으므로 재생성은 가능.
- 교훈: 데이터 유실은 기술 선택이 아니라 **운영(백업 부재)** 문제였음 → 새 스택에서는 자동 백업을 최우선으로 둔다.

## 기술 스택 (확정)

| 영역 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | Next.js (App Router) | 별도 백엔드 서버 만들지 않음 |
| API | Route Handler (`app/api/**`) | **Server Actions 대신 REST 유지** (추후 RN/모바일 클라이언트 재사용 대비) |
| ORM | Prisma | 기존 `schema.prisma` 자산 그대로 활용 |
| DB 호스트 | **Neon** (Postgres) | Supabase 의존 탈피. 풀링/다이렉트 URL 분리 |
| 인증 | **Better Auth** | TS 네이티브, Prisma 어댑터 |
| 패키지 매니저 | **pnpm** | |

## 환경 변수 (.env)

```
DATABASE_URL="postgresql://...@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"  # 풀링 (앱 런타임)
DIRECT_URL="postgresql://...@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"            # 다이렉트 (마이그레이션)
BETTER_AUTH_SECRET="openssl rand -base64 32 결과 (최소 32자)"
BETTER_AUTH_URL="http://localhost:3000"
```

- `.env`는 반드시 `.gitignore`에 포함. 절대 커밋 금지.
- (과거 `.env`에 DB 비밀번호 평문 노출 이력 있음 → 새 자격증명은 노출 주의)

## 셋업 순서

1. Neon 프로젝트 생성 → 풀링/다이렉트 연결 문자열 확보, `.env` 작성.
2. 패키지 설치:
   ```bash
   pnpm add better-auth @prisma/client
   pnpm add -D prisma
   ```
3. 스키마 통합 (핵심):
    - `npx @better-auth/cli generate` 로 `user` / `session` / `account` / `verification` 모델 생성.
    - 생성된 `User` 모델에 도메인 관계만 직접 추가: `restaurants Restaurant[]`, `reviews Review[]`, `favorites Favorite[]`.
    - `Restaurant` / `Review` / `Favorite`은 기존 정의 유지. `authorId String` + `@relation(references: [id])` 이 Better Auth `user.id`(String)와 호환됨.
4. DB 반영:
   ```bash
   npx prisma generate
   npx prisma db push        # 마이그레이션 폴더 없이 db push 방식 유지
   ```
5. `lib/auth.ts` — 서버 인증 인스턴스:
   ```ts
   import { betterAuth } from "better-auth";
   import { prismaAdapter } from "better-auth/adapters/prisma";
   import { nextCookies } from "better-auth/next-js";
   import { PrismaClient } from "@prisma/client";

   const prisma = new PrismaClient();

   export const auth = betterAuth({
     database: prismaAdapter(prisma, { provider: "postgresql" }),
     emailAndPassword: { enabled: true },
     plugins: [nextCookies()], // 항상 마지막 플러그인
   });
   ```
6. `app/api/auth/[...all]/route.ts` — 인증 엔드포인트:
   ```ts
   import { auth } from "@/lib/auth";
   import { toNextJsHandler } from "better-auth/next-js";
   export const { POST, GET } = toNextJsHandler(auth);
   ```
7. `lib/auth-client.ts` — 클라이언트:
   ```ts
   import { createAuthClient } from "better-auth/react";
   export const authClient = createAuthClient();
   ```
8. 기존 도메인 API(`app/api/restaurants/**`)에서 인증 유저 가져오기:
   ```ts
   import { auth } from "@/lib/auth";
   import { headers } from "next/headers";

   const session = await auth.api.getSession({ headers: await headers() });
   if (!session) return new Response("Unauthorized", { status: 401 });
   const userId = session.user.id; // authorId 로 사용
   ```
   → 기존 `prisma.restaurant.create({ data: { authorId: userId, ... } })` 로직은 그대로 동작.

## 자동 백업 (최우선 — 이번 사태 재발 방지)

`.github/workflows/backup.yml` 로 주기적 `pg_dump`:

```yaml
name: DB Backup
on:
  schedule:
    - cron: "0 18 * * 0"   # 매주 일요일 18:00 UTC (KST 월 03:00)
  workflow_dispatch:
jobs:
  dump:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pg_dump "${{ secrets.DIRECT_URL }}" -Fc -f backup-$(date +%F).dump
      - uses: actions/upload-artifact@v4
        with:
          name: db-backup
          path: backup-*.dump
          retention-days: 90
```

- GitHub repo Secrets에 `DIRECT_URL` 등록 필요.

## 기존 도메인 모델 (참고)

`Restaurant` 모델은 `@@map("restaurants")` 로 실제 테이블명이 소문자 복수형. 다른 모델도 동일 컨벤션 가능성 있으니 `@@map` 유지.

주요 필드(요약): `Restaurant { id(uuid), name, address, latitude, longitude, phoneNumber?, authorId, topokkiType?, price?, riceKinds[], sauceKinds[], spiciness?, canChangeSpicy, sideMenus[], noodleKinds[], sundaeType?, others[], recommend(Json), averageRating, reviewCount, reviews[], favorites[] }`

> 실제 최종 통합 스키마는 `schema.prisma` 원본을 기준으로 작성할 것.

## 작업 컨벤션

- **요청한 것만 수정.** 불필요한 구조 변경 / 리팩터링을 임의로 하지 않는다.
- 패키지 매니저는 **pnpm** 고정.
- API는 **REST Route Handler** 유지 (Server Actions로 갈아타지 않음).
- 개발자 용어(`invalidate`, `queryKey`, `mutation` 등)는 영어 그대로.
- 커밋 / 푸시 / 배포 등 부수효과 있는 작업은 실행 전 확인.

## 결정 로그 (2026-06-24)

- **인증 SDK: 순정 `better-auth`(stable) 확정.** Neon 프로젝트 생성 시 콘솔에서 Neon Auth를 켰으나, 관리형 `@neondatabase/auth`는 아직 beta(0.4.2)라 채택하지 않음. Neon Auth 내부도 Better Auth 기반이라 방향은 동일. 켜둔 Neon Auth 리소스(`neon_auth` 스키마)는 미사용으로 방치 — 무해하며 콘솔에서 disable 가능.
- **인증 방식: 이메일+비밀번호 우선.** 기존 Supabase 소셜(카카오/네이버) UI는 이메일/비번 폼으로 교체. 소셜은 추후 TODO.
- `getAuthenticatedUser`는 Better Auth 세션 유저를 반환 (`session.user`). Better Auth가 `users` row를 보장하므로 라우트의 email 조회/findOrCreate 제거, `user.id` 직접 사용.
- `users` 테이블에서 Supabase 잔재(`avatar`/`provider`/`providerId`) 제거, Better Auth 표준 필드(`image`/`emailVerified`)로 정리. 도메인 코드의 `avatar` → `image`.
- **유저 닉네임**: DB 컬럼 `users.nickname`. Better Auth 내부 필드는 `name`이라 `user.fields.name = "nickname"`로 매핑. 앱 전역은 `AuthContext`에서 `nickname`으로 정규화해 통일.

## 스키마 정리 (2026-06-24, 데이터 0건일 때 일괄)

- **단일 선택지 → enum**: `topokkiType`(TopokkiType: ontable/soup/pan), `sundaeType`(SundaeType: single/basic/various). 다중 선택은 String[] 유지(확장 용이). 빈 문자열은 유효 enum이 아니므로 생성/수정 시 `|| null` 정규화.
- **유저 삭제 시 맛집 보존**: `Restaurant.authorId` nullable + `onDelete: SetNull`(커뮤니티 자산). 리뷰·즐겨찾기는 개인 데이터라 `Cascade` 유지.
- **필드명 일관화**: `riceKinds→riceTypes`, `sauceKinds→sauceTypes`, `noodleKinds→noodleTypes`. `sideMenus`·`others`는 유지(요청대로 `sideMenus`는 "menu" 명칭 보존). 상수 `TOPOKKI_RICE_KINDS→RICE_TYPE`. 즐겨찾기 응답 alias `riceType→riceTypes`.
- **FK 인덱스 추가**(Postgres는 FK 자동 인덱스 X): `Restaurant.authorId`, `Review.restaurantId`, `Review.authorId`, `Favorite.restaurantId`.
- **버그 수정**: GET `sundaeType` 필터가 스칼라에 `{ has }`를 쓰던 것 → 동등 비교로. `recommend` 응답 타입 `string[]` → `{ type; url }[]`(실제 형태).
- **남은 필터 버그(별도 작업, task_b4d5497f)**: `MapHeader` 빠른필터 칩들이 잘못된 키/오타 값으로 매핑돼 대부분 미동작. 필터 param명↔필드명 정렬, 누락된 소스 필터, 중복 로컬 상수(TOPOKKI_TYPE/RICE_KINDS) 통일은 스키마 정리와 분리해 따로 진행.

## TODO (다음 작업)

- [x] `schema.prisma`에 Better Auth 모델(`User`/`Session`/`Account`/`Verification`) 통합 + 도메인 관계 유지
- [x] Better Auth 셋업 (`lib/auth.ts`, `app/api/auth/[...all]/route.ts`, `lib/auth-client.ts`)
- [x] `app/api/**` 인증 연동부 교체 (Supabase Auth → Better Auth), supabase 클라이언트/패키지 제거
- [x] 프론트 로그인/회원가입 UI를 Better Auth로 연결 (`EmailAuthForm`, `AuthContext` 래핑)
- [x] 자동 백업 워크플로 추가 (`.github/workflows/backup.yml`)
- [x] Neon 연결 문자열 입력 + `npx prisma db push` 완료 (public 테이블 7개 생성, 회원가입/세션/보호 라우트 E2E 검증 통과)
- [ ] GitHub repo Secret에 `DIRECT_URL` 등록 (백업 워크플로용, 배포 시)
- [ ] (선택) 소셜 로그인(구글/카카오/네이버) 추가
- [ ] (선택) 미사용 Neon Auth 콘솔에서 disable