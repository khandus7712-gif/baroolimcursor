# OAuth 로그인 오류 완전 해결 가이드

## 🔴 현재 문제

1. **브라우저 콘솔**: `error=Callback` 오류
2. **Vercel 로그**: `client_secret is missing` 오류
3. **Google 로그인**: 본인 확인까지 완료했지만 로그인 실패

## ✅ 해결 단계

### 1단계: Vercel 재배포 (필수!)

**환경 변수를 업데이트한 후 반드시 재배포해야 합니다!**

1. Vercel 대시보드 접속
2. 프로젝트 선택
3. **Deployments** 탭으로 이동
4. 최신 배포의 **"..."** 메뉴 클릭
5. **"Redeploy"** 선택
6. 또는 화면 하단 알림의 **"Redeploy"** 버튼 클릭

⚠️ **중요**: 환경 변수를 변경한 후 재배포하지 않으면 변경사항이 적용되지 않습니다!

---

### 2단계: Google Cloud Console Redirect URI 확인

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택
3. **APIs & Services** → **Credentials** 이동
4. OAuth 2.0 Client ID 클릭
5. **Authorized redirect URIs** 섹션 확인

**다음 URL이 반드시 포함되어 있어야 합니다:**
```
https://www.baroolim.com/api/auth/callback/google
```

**없으면 추가:**
- **"+ ADD URI"** 클릭
- 위 URL 입력
- **SAVE** 클릭

---

### 3단계: Kakao Developers Redirect URI 확인

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 내 애플리케이션 선택
3. **제품 설정** → **카카오 로그인** → **Redirect URI** 확인

**다음 URL이 반드시 포함되어 있어야 합니다:**
```
https://www.baroolim.com/api/auth/callback/kakao
```

**없으면 추가:**
- **"+ URI 추가"** 클릭
- 위 URL 입력
- **저장** 클릭

---

### 4단계: Vercel 환경 변수 최종 확인

Vercel 대시보드 → **Settings** → **Environment Variables**에서 다음이 모두 설정되어 있는지 확인:

#### 필수 환경 변수 체크리스트:

- [ ] `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret (8분 전 업데이트됨)
- [ ] `KAKAO_CLIENT_ID` - Kakao OAuth Client ID
- [ ] `KAKAO_CLIENT_SECRET` - Kakao OAuth Client Secret
- [ ] `NEXTAUTH_URL` - `https://www.baroolim.com` (슬래시 없이!)
- [ ] `NEXT_PUBLIC_APP_URL` - `https://www.baroolim.com` (슬래시 없이!)
- [ ] `NEXTAUTH_SECRET` - NextAuth Secret Key
- [ ] `DATABASE_URL` - 프로덕션 데이터베이스 URL

**⚠️ 중요 확인사항:**
- `NEXTAUTH_URL`과 `NEXT_PUBLIC_APP_URL`이 **정확히** `https://www.baroolim.com`인지 확인 (슬래시 없이!)
- 모든 환경 변수가 **Production** 환경에 설정되어 있는지 확인

---

### 5단계: 프로덕션 데이터베이스 스키마 적용

**Prisma 스키마가 프로덕션 데이터베이스에 적용되지 않았을 수 있습니다.**

1. Vercel에서 `DATABASE_URL` 복사
2. 로컬 터미널에서 실행:

```bash
# 프로덕션 DATABASE_URL로 스키마 적용
DATABASE_URL="프로덕션_DATABASE_URL_여기에_붙여넣기" npx prisma db push
```

**또는 `.env` 파일에 임시로 추가 후:**

```bash
# .env 파일에 DATABASE_URL 추가 (임시)
DATABASE_URL="프로덕션_DATABASE_URL"

# 스키마 적용
npx prisma db push
```

⚠️ **주의**: 프로덕션 데이터베이스에 직접 적용하므로 신중하게 진행하세요!

---

### 6단계: 재배포 후 테스트

1. **재배포 완료 대기** (약 2-3분)
2. 브라우저 캐시 클리어 (Ctrl+Shift+Delete)
3. `https://www.baroolim.com/login` 접속
4. Google 로그인 시도
5. Vercel Runtime Logs 확인

---

## 🔍 문제 진단

### Vercel Runtime Logs 확인 방법:

1. Vercel 대시보드 → 프로젝트
2. **Deployments** → 최신 배포 클릭
3. **Runtime Logs** 탭 확인

**정상적인 로그:**
```
✅ Google OAuth 환경 변수 로드됨
🔵 OAuth signIn 콜백: { userId: '...', email: '...', provider: 'google' }
✅ 세션 생성: { userId: '...', email: '...' }
```

**오류 로그:**
```
❌ client_secret is missing
❌ [OAUTH_CALLBACK_ERROR]
❌ Invalid prisma.account.findUnique()
```

---

## 📝 체크리스트

배포 전 최종 확인:

- [ ] Vercel 환경 변수 모두 설정됨
- [ ] `NEXTAUTH_URL` = `https://www.baroolim.com` (슬래시 없이)
- [ ] `NEXT_PUBLIC_APP_URL` = `https://www.baroolim.com` (슬래시 없이)
- [ ] Google Cloud Console에 Redirect URI 등록됨
- [ ] Kakao Developers에 Redirect URI 등록됨
- [ ] 프로덕션 데이터베이스에 Prisma 스키마 적용됨
- [ ] Vercel에서 재배포 완료됨
- [ ] 브라우저 캐시 클리어 완료

---

## 🆘 여전히 안 되면?

1. **Vercel Runtime Logs**의 최신 오류 메시지 확인
2. **브라우저 개발자 도구** → **Console** 탭에서 오류 확인
3. **Network** 탭에서 `/api/auth/callback/google` 요청 확인

오류 메시지를 알려주시면 추가로 도와드리겠습니다!









