# 바로올림 서비스 런칭 체크리스트 ✅

## 개발 환경 설정

- [x] Next.js + TypeScript 프로젝트 설정
- [x] Prisma + PostgreSQL 설정
- [x] 환경 변수 설정 (.env)
- [x] 개발 서버 실행 (`npm run dev`)
- [x] 데이터베이스 연결 및 스키마 적용
- [x] 필요한 패키지 설치

## 필수 환경 변수

- [ ] `DATABASE_URL` - Supabase PostgreSQL 연결 문자열
- [ ] `GOOGLE_API_KEY` - Google AI API 키 발급
- [ ] `NEXT_PUBLIC_APP_URL` - 앱 URL 설정

## Google AI API 설정

- [ ] Google AI Studio 접속 (https://aistudio.google.com)
- [ ] API 키 발급
- [ ] `.env` 파일에 `GOOGLE_API_KEY` 추가
- [ ] 할당량 확인 (무료: 하루 1,500회)
- [ ] 콘텐츠 생성 테스트

## 데이터베이스 설정

- [ ] Supabase 계정 생성
- [ ] 프로젝트 생성
- [ ] 데이터베이스 연결 문자열 복사
- [ ] `.env` 파일에 `DATABASE_URL` 추가
- [ ] `npm run db:push` 실행하여 테이블 생성
- [ ] 데이터베이스 연결 테스트

## 기능 테스트

### 메인 페이지
- [ ] 업종 선택 (음식/뷰티/소매)
- [ ] "시작하기" 버튼 동작 확인
- [ ] 스튜디오 페이지로 이동

### 스튜디오 페이지
- [ ] 이미지 업로드 (선택사항)
- [ ] 메모 입력
- [ ] 키워드 입력
- [ ] 업종 선택
- [ ] 플랫폼 선택 (Instagram/Blog/Threads/GMB)
- [ ] 플러그인 선택
- [ ] "생성하기" 클릭
- [ ] 콘텐츠 생성 확인
- [ ] 해시태그 생성 확인
- [ ] 복사 버튼 동작 확인

### 오류 처리
- [ ] API 키 없을 때 오류 메시지 확인
- [ ] 데이터베이스 연결 실패 시 오류 메시지
- [ ] 이미지 업로드 실패 시 오류 처리
- [ ] 네트워크 오류 처리

## 코드 품질

- [ ] TypeScript 타입 체크 (`npm run typecheck`)
- [ ] ESLint 검사 (`npm run lint`)
- [ ] 코드 포맷팅 (`npm run format`)
- [ ] 사용하지 않는 코드 제거
- [ ] 콘솔 로그 제거 (프로덕션)

## 문서화

- [x] README.md 작성
- [x] USER_GUIDE.md 작성
- [x] DEPLOYMENT.md 작성
- [x] GOOGLE_AI_SETUP.md 작성
- [x] STEP_BY_STEP.md 작성
- [x] .env.example 생성
- [x] .gitignore 설정

## Git 저장소

- [ ] GitHub 저장소 생성
- [ ] 초기 커밋
- [ ] `.env` 파일이 `.gitignore`에 포함되었는지 확인
- [ ] 민감한 정보가 코드에 없는지 확인
- [ ] README.md에 프로젝트 설명 추가

## Vercel 배포 준비

- [x] `vercel.json` 설정
- [x] `package.json` build 스크립트에 `prisma generate` 포함
- [x] `postinstall` 스크립트 추가
- [ ] Vercel 계정 생성
- [ ] GitHub 저장소 연동
- [ ] 환경 변수 설정 (Vercel)
  - [ ] `DATABASE_URL`
  - [ ] `GOOGLE_API_KEY`
  - [ ] `NEXT_PUBLIC_APP_URL`

## 배포 후 확인

- [ ] 배포 성공 확인
- [ ] 웹사이트 접속 확인
- [ ] 메인 페이지 로드
- [ ] 스튜디오 페이지 접속
- [ ] 콘텐츠 생성 테스트 (프로덕션)
- [ ] 모든 플랫폼 테스트
- [ ] 모바일 화면 확인
- [ ] 다양한 브라우저 테스트

## 성능 최적화

- [ ] 이미지 최적화
- [ ] 번들 크기 확인
- [ ] Lighthouse 점수 확인
- [ ] 로딩 속도 확인
- [ ] SEO 메타 태그 추가

## 보안

- [ ] API 키 보안 확인
- [ ] CORS 설정 확인
- [ ] 환경 변수 노출 확인
- [ ] SQL Injection 방어 (Prisma 자동 처리)
- [ ] XSS 방어 확인

## 모니터링

- [ ] Vercel Analytics 활성화
- [ ] 오류 추적 설정 (선택사항: Sentry)
- [ ] 로그 확인 방법 숙지
- [ ] 성능 모니터링 설정

## 비용 관리

- [ ] Vercel 무료 플랜 한도 확인
- [ ] Supabase 무료 플랜 한도 확인
- [ ] Google AI 무료 할당량 확인
- [ ] 사용량 모니터링 설정

## 사용자 경험

- [ ] 에러 메시지가 명확한지 확인
- [ ] 로딩 상태 표시
- [ ] 성공 피드백 제공
- [ ] 모바일 반응형 디자인
- [ ] 접근성 확인

## 마케팅 준비

- [ ] 서비스 설명 작성
- [ ] 스크린샷 촬영
- [ ] 데모 영상 제작 (선택사항)
- [ ] 랜딩 페이지 최적화
- [ ] 소셜 미디어 공유 이미지

## 런칭 후

- [ ] 사용자 피드백 수집
- [ ] 버그 수정
- [ ] 기능 개선
- [ ] 성능 모니터링
- [ ] 정기적인 업데이트

---

## 긴급 문제 해결

### 데이터베이스 연결 실패
1. Supabase 대시보드 확인
2. `DATABASE_URL` 재확인
3. Prisma Client 재생성 (`npx prisma generate`)

### API 키 오류
1. Google AI Studio에서 키 상태 확인
2. 할당량 초과 여부 확인
3. 새 키 발급 고려

### 배포 실패
1. Vercel 로그 확인
2. 환경 변수 확인
3. Build 명령어 확인 (`prisma generate && next build`)

---

## 연락처

문제 발생 시:
- GitHub Issues
- 개발자 이메일
- 문서 참조

**모든 항목을 완료하면 서비스 준비 완료입니다!** 🎉

