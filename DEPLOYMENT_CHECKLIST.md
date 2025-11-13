# 배포 체크리스트 ✅

## 수정 완료 사항

### 1. 타입스크립트 에러 수정 ✅
- ✅ `app/privacy-policy/page.tsx` - JSX에서 `>` 문자 escape 처리
- ✅ `app/studio/page.tsx` - searchParams null 체크 및 변수명 수정
- ✅ `types/plugin.ts` - PluginContext 인터페이스 추가
- ✅ `pages/api/scheduled-posts/check-notifications.ts` - null/undefined 타입 수정
- ✅ `tsconfig.json` - 사용하지 않는 payment 및 e2e 파일 제외

### 2. 환경 변수 ✅
현재 설정된 환경 변수:
- ✅ `GOOGLE_API_KEY` - Google AI API 키
- ✅ `DATABASE_URL` - PostgreSQL (Supabase) 연결 URL

## Vercel 배포 가이드

### 1. 프로젝트 배포
```bash
# Vercel CLI 설치 (처음만)
npm i -g vercel

# 배포
vercel
```

### 2. 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수를 설정하세요:

**필수 환경 변수:**
- `DATABASE_URL` - PostgreSQL 연결 URL
- `GOOGLE_API_KEY` - Google AI API 키

**선택 환경 변수:**
- `NEXT_PUBLIC_APP_URL` - 배포된 앱의 URL (예: https://baroolim.vercel.app)
- `SENDGRID_API_KEY` - 이메일 알림 기능 사용 시
- `STORAGE_ENDPOINT` - S3 호환 스토리지 사용 시
- `STORAGE_REGION` - 스토리지 리전
- `STORAGE_KEY` - 스토리지 액세스 키
- `STORAGE_SECRET` - 스토리지 시크릿 키
- `STORAGE_BUCKET` - 스토리지 버킷명

### 3. Prisma 설정
Vercel은 빌드 시 자동으로 `prisma generate`를 실행합니다.
`package.json`의 `build` 스크립트에 이미 포함되어 있습니다:
```json
"build": "prisma generate && next build"
```

### 4. Cron Job 설정
`vercel.json`에 이미 설정되어 있습니다:
- 예약 포스트 알림 체크: 매 분마다 실행

## 알려진 이슈

### Windows 로컬 빌드 이슈
Windows 환경에서 `prisma generate` 시 권한 문제가 발생할 수 있습니다.
**이는 로컬 환경 문제이며, Vercel 배포에는 영향이 없습니다.**

해결 방법 (로컬 개발 시):
1. 프로젝트 폴더를 다시 열기
2. VSCode를 관리자 권한으로 실행
3. 또는 `npm run dev`로 개발 서버만 실행 (빌드 없이)

## 배포 후 확인사항

- [ ] 메인 페이지 로딩 확인
- [ ] Studio 페이지에서 콘텐츠 생성 테스트
- [ ] 예약 포스트 생성 테스트
- [ ] 요금제 페이지 확인
- [ ] 개인정보처리방침 등 정책 페이지 확인

## 추가 설정 (선택사항)

### 커스텀 도메인
Vercel 대시보드에서 커스텀 도메인을 추가할 수 있습니다.

### Analytics
Vercel Analytics를 활성화하여 사용자 분석을 확인하세요.

### 성능 모니터링
Vercel Speed Insights로 성능을 모니터링하세요.

---

## 문의
문제가 발생하면 다음을 확인하세요:
1. Vercel 빌드 로그
2. 환경 변수 설정
3. 데이터베이스 연결

**배포 준비 완료! 🚀**

