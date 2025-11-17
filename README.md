# 바로올림 (Baroolim)

업종 무관 AI 마케팅 콘텐츠 생성기 MVP

이미지와 간단한 메모만으로 Instagram, Blog, Threads, Google My Business 등 여러 플랫폼에 최적화된 마케팅 콘텐츠를 AI가 자동으로 생성합니다.

## ✨ 주요 기능

- 🤖 **AI 기반 콘텐츠 생성**: Google Gemini를 활용한 고품질 콘텐츠 자동 생성
- 🔍 **웹 검색 기반 조사**: 관련 블로그 포스트를 자동으로 검색하여 더 풍부하고 트렌드에 맞는 콘텐츠 생성 (NEW ✨)
- 🎯 **다양한 업종 지원**: 음식, 뷰티, 소매 등 업종별 맞춤 콘텐츠
- 📱 **멀티 플랫폼**: Instagram, Blog, Threads, GMB 등 플랫폼별 최적화
- 🖼️ **이미지 분석**: Vision API로 이미지 내용을 분석하여 콘텐츠에 반영
- #️⃣ **해시태그 자동 생성**: 관련 해시태그 자동 추천
- 🔌 **플러그인 시스템**: 리뷰 답변, 광고 카피, 예약 CTA 등

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone https://github.com/your-username/baroolim.git
cd baroolim
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일 생성:

```bash
cp .env.example .env
```

필수 환경 변수 설정:
- `DATABASE_URL`: Supabase PostgreSQL 연결 문자열
- `GOOGLE_API_KEY`: [Google AI Studio](https://aistudio.google.com/app/apikey)에서 발급

### 4. 데이터베이스 설정

```bash
npm run db:push
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📋 기술 스택

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **AI**: Google Gemini 1.5
- **Storage**: S3 호환 스토리지 (선택사항)
- **Deployment**: Vercel

## 📦 설치

```bash
npm install
```

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Google AI API (필수)
GOOGLE_API_KEY=your-google-ai-api-key-here

# Tavily API (선택사항 - 웹 검색 기능용)
# https://tavily.com 에서 무료 API 키 발급 가능
TAVILY_API_KEY=your-tavily-api-key-here

# Database (필수)
DATABASE_URL=postgresql://user:password@localhost:5432/baroolim

# Storage (S3-compatible) - 이미지 업로드용
STORAGE_ENDPOINT=https://s3.example.com
STORAGE_KEY=your-access-key-id
STORAGE_SECRET=your-secret-access-key
STORAGE_BUCKET=baroolim

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 환경 변수 설명

- `GOOGLE_API_KEY`: Google AI Studio에서 발급받은 API 키 (필수)
- `TAVILY_API_KEY`: Tavily API 키 (선택사항) - 웹 검색 기능 사용 시 필요. [Tavily](https://tavily.com)에서 무료로 발급 가능
- `DATABASE_URL`: PostgreSQL 연결 문자열 (필수)
- `STORAGE_*`: S3 호환 스토리지 설정 (이미지 업로드용, 선택사항)
- `ALLOWED_ORIGINS`: CORS 허용 오리진 목록 (쉼표로 구분)

## 로컬 실행 방법

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 위의 환경 변수들을 설정합니다.

**최소 필수 설정:**
- `GOOGLE_API_KEY`: Google AI API 키
- `DATABASE_URL`: PostgreSQL 데이터베이스 연결 문자열

### 2. 데이터베이스 설정

PostgreSQL 데이터베이스를 준비하고 `DATABASE_URL`을 설정합니다.

```bash
# Prisma 스키마를 데이터베이스에 적용
npx prisma db push

# Prisma Client 생성 (자동으로 실행됨)
npx prisma generate
```

### 3. 개발 서버 실행

```bash
# 개발 서버 실행
npm run dev
```

서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 접속할 수 있습니다.

### 4. 데이터베이스 스튜디오 (선택사항)

```bash
# Prisma Studio 실행 (데이터베이스 GUI)
npm run db:studio
```

## 사용 흐름

### 1. 온보딩 (`/onboarding`)

1. 업종 선택 (음식/식당, 뷰티/미용, 소매/유통)
2. 마케팅 목표(KPI) 선택 (복수 선택 가능)
3. 브랜드 이름, 톤앤매너, 금칙어, CTA 입력 (선택사항)
4. 저장 버튼 클릭

### 2. 스튜디오 (`/studio`)

1. **입력 영역 (좌측)**:
   - 이미지 업로드 (선택사항)
   - 메모 입력
   - 키워드 입력 (쉼표로 구분)

2. **설정 영역 (우측)**:
   - 업종 선택
   - 플랫폼 선택 (Instagram, Blog, Threads, GMB)
   - 플러그인 선택 (리뷰 답변, 광고 카피, 예약 CTA, 해시태그)
   - 추가 설정 (브랜드 이름, 지역, 링크, 톤 힌트)

3. **생성 버튼 클릭**

4. **결과 영역 (하단)**:
   - 생성된 콘텐츠 미리보기
   - 해시태그 표시
   - 경고 메시지 (금칙어 대체, mustInclude 삽입 등)
   - 복사 버튼

## 샘플 데이터

### 지원 업종 (도메인)

- **food** (음식/식당): 레스토랑, 카페, 배달 등
- **beauty** (뷰티/미용): 미용실, 네일샵, 피부관리 등
- **retail** (소매/유통): 의류, 액세서리, 생활용품 등

### 지원 플랫폼

- **instagram**: Instagram 포스트 및 스토리
- **blog**: 블로그 포스트
- **threads**: Threads (Meta) 포스트
- **gmb**: Google My Business 리뷰 답변 및 포스트

## 기능 테스트

### 1. 텍스트만 콘텐츠 생성

1. `/studio` 페이지 접속
2. 업종 선택 (예: food)
3. 플랫폼 선택 (예: instagram)
4. 메모 입력 (예: "오늘의 특별 메뉴를 소개해주세요")
5. 생성 버튼 클릭
6. 결과 확인

### 2. 이미지 포함 콘텐츠 생성 (Vision)

1. `/studio` 페이지 접속
2. 이미지 업로드 (JPG, PNG 등)
3. 업종 및 플랫폼 선택
4. 메모 입력 (선택사항)
5. 생성 버튼 클릭
6. 이미지 분석 결과와 함께 콘텐츠 생성 확인

**참고**: 이미지가 없어도 텍스트만으로 콘텐츠 생성이 가능합니다.

## 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 실행
- `npm run typecheck` - TypeScript 타입 체크
- `npm run db:push` - Prisma 스키마를 데이터베이스에 적용
- `npm run db:studio` - Prisma Studio 실행
- `npm run test:e2e` - E2E 테스트 실행 (Playwright)
- `npm run test:e2e:ui` - E2E 테스트 UI 모드 실행
- `npm run test:e2e:headed` - E2E 테스트 헤드 모드 실행

## 프로젝트 구조

```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 랜딩 페이지 (업종 선택)
│   ├── (onboarding)/       # 온보딩 페이지 그룹
│   │   └── onboarding/     # 온보딩 페이지
│   └── studio/             # 스튜디오 페이지
├── pages/                  # API Routes
│   └── api/                # API 엔드포인트
│       ├── generate.ts     # 콘텐츠 생성 API
│       └── onboarding.ts   # 온보딩 데이터 저장 API
├── types/                  # TypeScript 타입 정의
│   ├── domain.ts           # 도메인 프로필 타입
│   ├── platform.ts         # 플랫폼 템플릿 타입
│   └── plugin.ts           # 플러그인 타입
├── lib/                    # 유틸리티 및 핵심 로직
│   ├── promptComposer.ts   # 프롬프트 컴포저
│   ├── postProcess.ts      # 후처리 로직
│   ├── ai.ts               # Google AI SDK 래퍼
│   ├── storage.ts          # S3 스토리지 유틸리티
│   └── profileLoader.ts    # 프로필 로더
├── plugins/                # Skill Plugins
│   ├── reviewReply.ts      # 리뷰 답변 플러그인
│   ├── adCopy.ts           # 광고 카피 플러그인
│   ├── bookingCta.ts       # 예약 CTA 플러그인
│   └── hashtag.ts          # 해시태그 플러그인
├── profiles/               # 도메인 및 플랫폼 프로필
│   ├── domains/            # 도메인 프로필 JSON
│   │   ├── food.json
│   │   ├── beauty.json
│   │   └── retail.json
│   └── platforms/          # 플랫폼 템플릿 JSON
│       ├── instagram.json
│       ├── blog.json
│       ├── threads.json
│       └── gmb.json
├── prisma/                 # Prisma 스키마
│   └── schema.prisma       # 데이터베이스 스키마
└── middleware.ts           # Next.js 미들웨어 (CORS)
```

## 주요 기능

- **업종별 도메인 프로필**: 음식, 뷰티, 소매 등 업종별 특성 반영
- **플랫폼별 템플릿**: Instagram, Blog, Threads, GMB 등 플랫폼 최적화
- **AI 기반 콘텐츠 생성**: Google Gemini 2.5를 활용한 고품질 콘텐츠 생성
- **이미지 분석 (Vision)**: 이미지를 분석하여 콘텐츠에 반영
- **플러그인 시스템**: 리뷰 답변, 광고 카피, 예약 CTA, 해시태그 등
- **후처리**: 금칙어 필터링, mustInclude 체크, 해시태그 생성
- **에러/경고 처리**: 금칙어 대체, mustInclude 삽입 등 경고 표시

## 개발 가이드

### 새로운 업종 추가

1. `profiles/domains/{domain-id}.json` 파일 생성
2. `lib/profileLoader.ts`에 도메인 프로필 등록

### 새로운 플랫폼 추가

1. `profiles/platforms/{platform-id}.json` 파일 생성
2. `lib/profileLoader.ts`에 플랫폼 템플릿 등록

### 새로운 플러그인 추가

1. `plugins/{plugin-id}.ts` 파일 생성
2. `Plugin` 인터페이스 구현
3. `plugins/hashtag.ts`의 플러그인 레지스트리에 등록

## 테스트

### E2E 테스트 (Playwright)

Playwright를 사용한 E2E 테스트가 포함되어 있습니다.

```bash
# Playwright 브라우저 설치 (최초 1회)
npx playwright install

# E2E 테스트 실행
npm run test:e2e

# E2E 테스트 UI 모드 실행
npm run test:e2e:ui

# E2E 테스트 헤드 모드 실행 (브라우저 표시)
npm run test:e2e:headed
```

### 테스트 시나리오

1. **온보딩 테스트**: 업종 선택, KPI 선택, 저장
2. **스튜디오 테스트**: 콘텐츠 생성, 결과 확인
3. **금칙어 필터링 테스트**: 금칙어 자동 치환 및 경고 표시
4. **해시태그 테스트**: 해시태그 개수 및 포맷 확인

테스트 파일: `e2e/onboarding-studio.spec.ts`

## 문제 해결

### 데이터베이스 연결 오류

- `DATABASE_URL`이 올바른지 확인
- PostgreSQL 서버가 실행 중인지 확인
- `npx prisma db push`로 스키마가 적용되었는지 확인

### Google AI API 오류

- `GOOGLE_API_KEY`가 올바른지 확인
- API 키에 충분한 할당량이 있는지 확인
- API 키가 활성화되어 있는지 확인

### 이미지 업로드 오류

- `STORAGE_*` 환경 변수가 올바르게 설정되었는지 확인
- S3 호환 스토리지 서버가 접근 가능한지 확인
- 이미지 업로드 없이도 텍스트만으로 콘텐츠 생성 가능

### 테스트 오류

- 개발 서버가 실행 중인지 확인 (`npm run dev`)
- Playwright 브라우저가 설치되어 있는지 확인 (`npx playwright install`)
- 환경 변수가 올바르게 설정되어 있는지 확인

## 🚢 배포

### Vercel 배포 (권장)

자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

1. Vercel 계정 생성 및 GitHub 연동
2. 프로젝트 임포트
3. 환경 변수 설정 (`DATABASE_URL`, `GOOGLE_API_KEY`)
4. 배포

### 환경 변수 (프로덕션)

- `DATABASE_URL`: Supabase PostgreSQL 연결 문자열
- `GOOGLE_API_KEY`: Google AI API 키
- `NEXT_PUBLIC_APP_URL`: 배포된 URL

## 📚 문서

- [사용자 가이드](./USER_GUIDE.md) - 서비스 사용 방법
- [배포 가이드](./DEPLOYMENT.md) - Vercel 배포 방법
- [Google AI 설정](./GOOGLE_AI_SETUP.md) - API 키 발급 방법
- [설정 가이드](./STEP_BY_STEP.md) - 초보자용 설정 가이드

## 🎓 튜토리얼

### 첫 콘텐츠 생성하기

1. 메인 페이지에서 업종 선택 (예: 음식/식당)
2. 스튜디오 페이지로 이동
3. 이미지 업로드 (선택사항)
4. 메모 입력 (예: "오늘의 신메뉴 소개")
5. 플랫폼 선택 (예: Instagram)
6. "생성하기" 클릭
7. 생성된 콘텐츠 복사하여 사용

## 🤝 기여

프로젝트 개선을 위한 기여를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 로드맵

- [ ] 여러 플랫폼 동시 생성
- [ ] 생성 이력 저장 및 관리
- [ ] 브랜드 프로필 관리
- [ ] 예약 발행 기능
- [ ] 성과 분석 대시보드
- [ ] 다국어 지원
- [ ] 더 많은 플랫폼 지원

## ⚖️ 라이선스

MIT

## 📧 문의

문제가 있거나 궁금한 점이 있으면 [GitHub Issues](https://github.com/your-username/baroolim/issues)에 남겨주세요.

---

**Made with ❤️ by Baroolim Team**
