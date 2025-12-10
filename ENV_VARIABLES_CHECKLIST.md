# .env 파일 필수 환경 변수 체크리스트

## 📋 필수 환경 변수 목록

`.env` 파일에 다음 변수들을 **실제 값**으로 입력해야 합니다.

---

## 1. 데이터베이스 (필수)

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

**발급 방법:**
- Supabase: https://supabase.com → 프로젝트 → Settings → Database → Connection string
- Neon: https://neon.tech → 프로젝트 → Connection string
- 로컬 PostgreSQL: `postgresql://postgres:비밀번호@localhost:5432/baroolim`

---

## 2. NextAuth (필수)

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="랜덤_문자열_32자_이상"
```

**NEXTAUTH_SECRET 생성 방법:**

PowerShell에서:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

또는 온라인: https://generate-secret.vercel.app/32

---

## 3. Google OAuth (Google 로그인용)

```env
GOOGLE_CLIENT_ID="123456789-abcdefg.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-..."
```

**발급 방법:**
1. https://console.cloud.google.com/ 접속
2. 프로젝트 선택 (또는 새로 생성)
3. **API 및 서비스** → **OAuth 동의 화면** → 완료
4. **사용자 인증 정보** → **+ 사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**
5. **승인된 리디렉션 URI**에 추가:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. 생성된 **클라이언트 ID**와 **클라이언트 보안 비밀** 복사

**중요:** OAuth 동의 화면이 완료되지 않으면 `invalid_client` 오류 발생!

---

## 4. Kakao OAuth (카카오 로그인용)

```env
KAKAO_CLIENT_ID="1234567890abcdef1234567890abcdef"
KAKAO_CLIENT_SECRET="AbCdEfGhIjKlMnOpQrStUvWxYz012345"
```

**발급 방법:**
1. https://developers.kakao.com/ 접속
2. **내 애플리케이션** → 애플리케이션 선택 (또는 새로 생성)
3. **앱 설정** → **앱 키** → **REST API 키** 복사 → `KAKAO_CLIENT_ID`에 입력
4. **제품 설정** → **카카오 로그인** → **보안** → **Client Secret** 발급 → 복사 → `KAKAO_CLIENT_SECRET`에 입력
5. **Redirect URI** 등록:
   ```
   http://localhost:3000/api/auth/callback/kakao
   ```
6. **동의항목** 설정:
   - 닉네임: 필수 동의
   - 카카오계정(이메일): 필수 동의

---

## 5. Google AI API (AI 콘텐츠 생성용)

```env
GOOGLE_API_KEY="AIzaSyC..."
```

**발급 방법:**
1. https://aistudio.google.com/app/apikey 접속
2. **API 키 만들기** 클릭
3. 생성된 키 복사

---

## 6. 선택적 환경 변수

### 이메일 알림 (Resend)

```env
RESEND_API_KEY="re_..."
```

**발급:** https://resend.com → API Keys → Create API Key

### 앱 URL

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 스토리지 (S3 호환, 선택사항)

```env
STORAGE_ENDPOINT="https://..."
STORAGE_REGION="us-east-1"
STORAGE_KEY="..."
STORAGE_SECRET="..."
STORAGE_BUCKET="baroolim"
```

### 웹 검색 (Tavily, 선택사항)

```env
TAVILY_API_KEY="tvly-..."
```

---

## ✅ .env 파일 예시 (템플릿)

```env
# ============================================
# 필수 환경 변수
# ============================================

# 데이터베이스
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="여기에_생성한_시크릿_입력"

# Google OAuth
GOOGLE_CLIENT_ID="여기에_Google_클라이언트_ID_입력"
GOOGLE_CLIENT_SECRET="여기에_Google_클라이언트_Secret_입력"

# Kakao OAuth
KAKAO_CLIENT_ID="여기에_Kakao_REST_API_키_입력"
KAKAO_CLIENT_SECRET="여기에_Kakao_Client_Secret_입력"

# Google AI API
GOOGLE_API_KEY="여기에_Google_AI_API_키_입력"

# ============================================
# 선택적 환경 변수
# ============================================

# 앱 URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# 이메일 (선택사항)
# RESEND_API_KEY="re_..."

# 웹 검색 (선택사항)
# TAVILY_API_KEY="tvly-..."
```

---

## 🔍 환경 변수 확인 방법

설정 후 다음 명령어로 확인:

```bash
npm run check:env
```

또는 서버 실행 시 콘솔에서 확인:
```bash
npm run dev
```

서버 콘솔에 다음 메시지가 보여야 합니다:
```
✅ Google OAuth 환경 변수 로드됨: ...
✅ Kakao OAuth 환경 변수 로드됨
```

---

## ⚠️ 주의사항

1. **모든 placeholder 값 제거**: `your-...-here` 같은 값은 실제 값으로 교체
2. **따옴표 사용**: 값에 특수문자가 있으면 따옴표로 감싸기
3. **공백 제거**: `=` 앞뒤 공백 없이 작성
4. **서버 재시작**: 환경 변수 변경 후 반드시 서버 재시작

---

## 📚 상세 가이드

- OAuth 설정: `OAUTH_SETUP_GUIDE.md`
- 환경 변수 설정: `ENV_SETUP.md`
- Google OAuth 문제 해결: `GOOGLE_OAUTH_FIX.md`
- Kakao 로그인 문제 해결: `KAKAO_LOGIN_TROUBLESHOOTING.md`










