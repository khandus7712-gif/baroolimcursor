# 🔧 환경 변수 설정 가이드

## 📋 빠른 시작

1. `.env.example` 파일을 복사해서 `.env` 파일 생성
2. 각 서비스에서 키 발급받아 채우기
3. 서버 재시작

---

## 🔐 필수 환경 변수

### 1. DATABASE_URL
- **설명**: PostgreSQL 데이터베이스 연결 문자열
- **예시**: `postgresql://user:password@localhost:5432/baroolim`
- **발급**: Neon, Supabase, Railway 등에서 무료 PostgreSQL 제공

### 2. GOOGLE_API_KEY
- **설명**: Google Maps & Places API 키
- **사용처**: 지도, 장소 검색
- **발급**: https://console.cloud.google.com/

### 3. NEXTAUTH_URL
- **설명**: NextAuth 기본 URL
- **로컬**: `http://localhost:3000`
- **배포**: `https://your-domain.vercel.app`

### 4. NEXTAUTH_SECRET
- **설명**: JWT 암호화에 사용되는 비밀키
- **생성**: PowerShell에서 실행
  ```powershell
  -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
  ```

### 5. GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
- **설명**: Google OAuth 로그인용 클라이언트 정보
- **발급**: https://console.cloud.google.com/apis/credentials
- **참고**: `OAUTH_SETUP_COMPLETE.md` 파일 참조

### 6. KAKAO_CLIENT_ID & KAKAO_CLIENT_SECRET
- **설명**: 카카오 OAuth 로그인용 클라이언트 정보
- **발급**: https://developers.kakao.com/
- **참고**: `OAUTH_SETUP_COMPLETE.md` 파일 참조

### 7. RESEND_API_KEY
- **설명**: 이메일 알림 발송용 API 키
- **발급**: https://resend.com/
- **무료**: 월 3,000건

### 8. NEXT_PUBLIC_APP_URL
- **설명**: 앱 기본 URL (이메일 링크 등에 사용)
- **로컬**: `http://localhost:3000`
- **배포**: `https://your-domain.vercel.app`

---

## 📝 .env 파일 예시

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/baroolim"

# Google API (for Maps, Places, etc.)
GOOGLE_API_KEY="AIzaSyC..."

# NextAuth (Authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="abc123xyz789..."

# Google OAuth
GOOGLE_CLIENT_ID="YOUR_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_SECRET"


# Kakao OAuth
KAKAO_CLIENT_ID="1234567890abcdef1234567890abcdef"
KAKAO_CLIENT_SECRET="AbCdEfGhIjKlMnOpQrStUvWxYz012345"

# Email (Resend)
RESEND_API_KEY="re_..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🚀 Vercel 배포 시 환경 변수

Vercel Dashboard → 프로젝트 선택 → Settings → Environment Variables

**중요:** `NEXTAUTH_URL`과 `NEXT_PUBLIC_APP_URL`은 배포 도메인으로 변경!

| 변수명 | 로컬 값 | 배포 값 |
|--------|---------|---------|
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://your-domain.vercel.app` |

---

## 🔄 환경 변수 변경 후

```bash
# 개발 서버 재시작
npm run dev
```

---

## 🐛 문제 해결

### "NEXTAUTH_SECRET is not set"
- `.env` 파일에 `NEXTAUTH_SECRET` 추가
- 서버 재시작

### OAuth 로그인 실패
- Google/Kakao에서 Redirect URI 설정 확인
- `.env` 파일에서 CLIENT_ID/SECRET 확인
- 서버 재시작

### 이메일 발송 실패
- `RESEND_API_KEY` 확인
- Resend 대시보드에서 API 키 상태 확인

---

## 📚 추가 참고

- OAuth 설정: `OAUTH_SETUP_COMPLETE.md`
- NextAuth 문서: https://next-auth.js.org/
- Resend 문서: https://resend.com/docs

