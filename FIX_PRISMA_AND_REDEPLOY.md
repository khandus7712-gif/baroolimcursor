# Prisma 스키마 적용 및 재배포 가이드

## 🔴 발견된 문제

Vercel Runtime Logs에서 확인된 오류:

1. **Prisma 스키마 오류**: `Invalid prisma.account.findUnique()`
   - 프로덕션 데이터베이스에 Prisma 스키마가 적용되지 않음

2. **재배포 필요**: 환경 변수 업데이트 후 재배포가 필요함

---

## ✅ 해결 방법

### 1단계: 프로덕션 데이터베이스에 Prisma 스키마 적용

#### 방법 1: Vercel에서 DATABASE_URL 복사

1. Vercel 대시보드 → 프로젝트
2. **Settings** → **Environment Variables**
3. `DATABASE_URL` 찾기
4. 값 옆 **"Show"** 또는 **"Copy"** 클릭하여 복사

#### 방법 2: 로컬에서 스키마 적용

**옵션 A: 환경 변수로 직접 실행**

```bash
# 프로덕션 DATABASE_URL로 스키마 적용
DATABASE_URL="여기에_복사한_DATABASE_URL_붙여넣기" npx prisma db push
```

**옵션 B: .env 파일에 임시로 추가 (주의!)**

```bash
# .env 파일에 프로덕션 DATABASE_URL 추가 (임시)
DATABASE_URL="여기에_복사한_DATABASE_URL_붙여넣기"

# 스키마 적용
npx prisma db push

# ⚠️ 중요: 작업 완료 후 .env 파일에서 프로덕션 DATABASE_URL 제거!
```

**⚠️ 주의사항:**
- 프로덕션 데이터베이스에 직접 적용하므로 신중하게 진행하세요
- 기존 데이터가 손실될 수 있으므로 백업을 권장합니다
- 작업 완료 후 로컬 `.env` 파일에서 프로덕션 `DATABASE_URL`을 제거하세요

---

### 2단계: Vercel 재배포 (필수!)

**환경 변수를 업데이트했으므로 반드시 재배포해야 합니다:**

1. Vercel 대시보드 → 프로젝트
2. 화면 하단의 **"Redeploy"** 버튼 클릭
   - 또는 **Deployments** 탭 → 최신 배포의 **"..."** → **"Redeploy"**

**⚠️ 중요**: 재배포하지 않으면 환경 변수 변경사항이 적용되지 않습니다!

---

### 3단계: 대기 및 확인

1. **Prisma 스키마 적용**: 즉시 완료
2. **Vercel 재배포**: 약 2-3분 소요
3. **Google 설정 적용**: 5-10분 대기 (Google Cloud Console 메시지 참고)

**총 대기 시간: 약 10-15분**

---

## 🧪 테스트 방법

재배포 완료 후 10-15분 대기:

1. 브라우저 캐시 클리어 (Ctrl+Shift+Delete)
2. `https://www.baroolim.com/login` 접속
3. "Google로 시작하기" 버튼 클릭
4. Google 로그인 진행
5. 성공 여부 확인

---

## 🔍 확인 사항

### Prisma 스키마 적용 확인

스키마 적용 후 다음 메시지가 표시되어야 합니다:

```
✅ Your database is now in sync with your Prisma schema.
```

### Vercel 재배포 확인

1. **Deployments** 탭에서 새 배포가 시작되었는지 확인
2. 배포 상태가 **"Ready"**가 될 때까지 대기 (약 2-3분)

### Vercel Runtime Logs 재확인

재배포 후 다시 로그인 시도:

1. **Deployments** → 최신 배포 → **Runtime Logs**
2. `/api/auth/callback/google` 요청 확인
3. 오류가 사라졌는지 확인

**정상적인 로그:**
```
✅ Google OAuth 환경 변수 로드됨
🔵 OAuth signIn 콜백: { userId: '...', email: '...', provider: 'google' }
✅ 세션 생성: { userId: '...', email: '...' }
```

---

## 📋 체크리스트

- [ ] Vercel에서 `DATABASE_URL` 복사 완료
- [ ] 로컬에서 `npx prisma db push` 실행 완료
- [ ] Prisma 스키마 적용 성공 메시지 확인
- [ ] Vercel에서 "Redeploy" 버튼 클릭 완료
- [ ] 새 배포가 "Ready" 상태가 될 때까지 대기 완료
- [ ] 10-15분 대기 완료
- [ ] 브라우저 캐시 클리어 완료
- [ ] Google 로그인 테스트 완료
- [ ] Vercel Runtime Logs에서 오류 사라진 것 확인

---

## 🆘 여전히 안 되면?

### 1. Vercel Runtime Logs 재확인

새로운 오류 메시지가 있는지 확인:
- 오류 메시지를 복사하여 알려주세요

### 2. Prisma 스키마 재확인

```bash
# 스키마 확인
npx prisma db push --preview-feature

# 또는 스키마 생성 확인
npx prisma generate
```

### 3. 환경 변수 재확인

Vercel에서 다음이 모두 설정되어 있는지 확인:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL`
- `NEXTAUTH_SECRET`

---

## 💡 참고사항

### Prisma 스키마 적용 시 주의사항

- 프로덕션 데이터베이스에 직접 적용하므로 신중하게 진행
- 기존 데이터가 손실될 수 있으므로 백업 권장
- 작업 완료 후 로컬 `.env` 파일에서 프로덕션 `DATABASE_URL` 제거

### Vercel 재배포 시 주의사항

- 환경 변수를 변경한 후 반드시 재배포해야 함
- 재배포하지 않으면 변경사항이 적용되지 않음
- 재배포는 약 2-3분 소요

---

## ✅ 다음 단계

1. **Prisma 스키마 적용** (위 1단계)
2. **Vercel 재배포** (위 2단계)
3. **10-15분 대기**
4. **테스트**

문제가 계속되면 Vercel Runtime Logs의 새로운 오류 메시지를 알려주세요!









