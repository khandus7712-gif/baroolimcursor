# 바로올림 배포 가이드

## Vercel 배포 (권장)

Vercel은 Next.js를 만든 회사의 호스팅 서비스로, Next.js 프로젝트를 가장 쉽게 배포할 수 있습니다.

### 1단계: Vercel 계정 생성

1. https://vercel.com 접속
2. GitHub 계정으로 로그인
3. 무료 플랜 선택

### 2단계: 프로젝트 연결

1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 선택
3. 프로젝트 설정:
   - Framework Preset: Next.js (자동 감지됨)
   - Root Directory: `./` (기본값)
   - Build Command: `npm run build` (기본값)
   - Output Directory: `.next` (기본값)

### 3단계: 환경 변수 설정

Vercel 프로젝트 설정 > Environment Variables에서 다음 변수들을 추가:

```
DATABASE_URL=postgresql://username:password@host:port/database
GOOGLE_API_KEY=your-google-ai-api-key
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**중요:**
- `DATABASE_URL`: Supabase 데이터베이스 연결 문자열
- `GOOGLE_API_KEY`: Google AI Studio에서 발급받은 API 키
- `NEXT_PUBLIC_APP_URL`: Vercel에서 제공하는 프로젝트 URL

### 4단계: 배포

1. "Deploy" 버튼 클릭
2. 빌드 및 배포 완료 대기 (2-3분)
3. 배포 완료 후 제공되는 URL로 접속

---

## Supabase 데이터베이스 설정

### PostgreSQL 연결 문자열

Supabase에서 제공하는 연결 문자열을 사용하세요:

**Session Pooler (권장):**
```
postgresql://postgres.xxx:password@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres
```

**Direct Connection (IPv6 환경):**
```
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### Prisma 마이그레이션

배포 후 데이터베이스 스키마 적용:

```bash
npx prisma db push
```

---

## Google AI API 설정

### API 키 발급

1. https://aistudio.google.com/app/apikey 접속
2. "Create API Key" 클릭
3. 발급된 키를 복사
4. Vercel 환경 변수에 추가

### API 할당량

- 무료 플랜: 매일 60회 요청
- 유료 플랜: 더 많은 할당량

---

## 환경별 설정

### 개발 환경 (로컬)

```bash
# .env 파일
DATABASE_URL="postgresql://..."
GOOGLE_API_KEY="your-key"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 프로덕션 환경 (Vercel)

Vercel 대시보드에서 환경 변수 설정:
- Production
- Preview
- Development

---

## 배포 체크리스트

- [ ] GitHub 저장소 생성 및 코드 푸시
- [ ] Supabase 데이터베이스 생성
- [ ] Google AI API 키 발급
- [ ] Vercel 프로젝트 생성
- [ ] 환경 변수 설정 (DATABASE_URL, GOOGLE_API_KEY)
- [ ] 배포 완료 확인
- [ ] 데이터베이스 스키마 적용 (prisma db push)
- [ ] 웹사이트 접속 테스트
- [ ] 콘텐츠 생성 기능 테스트

---

## 도메인 연결 (선택사항)

### 커스텀 도메인 설정

1. Vercel 프로젝트 설정 > Domains
2. 원하는 도메인 입력
3. DNS 레코드 설정:
   ```
   Type: CNAME
   Name: www (또는 @)
   Value: cname.vercel-dns.com
   ```
4. DNS 전파 대기 (최대 48시간)

---

## 문제 해결

### 빌드 오류

```
Error: Prisma Client has not been generated
```

해결: `package.json`의 `build` 스크립트에 prisma generate 추가
```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

### 데이터베이스 연결 오류

```
Error: Can't reach database server
```

해결:
- `DATABASE_URL` 환경 변수 확인
- Supabase 데이터베이스 실행 상태 확인
- IP 허용 목록 확인 (Supabase Settings > Network)

### API 키 오류

```
Error: Invalid API key
```

해결:
- Google AI Studio에서 API 키 재확인
- Vercel 환경 변수에 올바르게 설정되었는지 확인

---

## 모니터링

### Vercel Analytics

Vercel에서 제공하는 무료 분석 도구:
- 페이지 뷰
- 방문자 수
- 성능 지표

### 로그 확인

Vercel 대시보드 > 프로젝트 > Logs에서 실시간 로그 확인 가능

---

## 비용

### 무료 플랜으로 가능한 것

- Vercel: 무료 (Hobby 플랜)
- Supabase: 무료 (500MB 데이터베이스)
- Google AI: 무료 (하루 60회 요청)

### 유료 전환 시점

- 사용자가 많아질 때
- 더 많은 AI 요청이 필요할 때
- 더 큰 데이터베이스가 필요할 때

---

## 다음 단계

배포 완료 후:
1. 사용자 피드백 수집
2. 기능 개선
3. SEO 최적화
4. 분석 도구 추가

