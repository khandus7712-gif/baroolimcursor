# Vercel 프로덕션 OAuth 설정 가이드

배포된 도메인: **https://baroolimcursor2025.vercel.app/**

이 가이드는 Vercel에 배포된 프로덕션 환경에서 Google과 Kakao OAuth를 설정하는 방법입니다.

---

## 🚀 빠른 설정 (5분)

### 1단계: Vercel 환경 변수 설정

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. `baroolimcursor2025` 프로젝트 선택
3. **Settings** → **Environment Variables** 클릭
4. 다음 환경 변수들을 **하나씩** 추가:

#### 필수 환경 변수

```plaintext
이름: NEXTAUTH_URL
값: https://baroolimcursor2025.vercel.app
환경: Production, Preview, Development 모두 체크
```

```plaintext
이름: NEXTAUTH_SECRET
값: [openssl rand -base64 32로 생성한 값]
환경: Production, Preview, Development 모두 체크
```

```plaintext
이름: DATABASE_URL
값: [Supabase 또는 기존 PostgreSQL URL]
환경: Production, Preview, Development 모두 체크
```

```plaintext
이름: GOOGLE_API_KEY
값: [Google AI Studio API 키]
환경: Production, Preview, Development 모두 체크
```

#### Google OAuth 환경 변수

```plaintext
이름: GOOGLE_CLIENT_ID
값: [Google Cloud Console에서 발급받은 Client ID]
환경: Production, Preview, Development 모두 체크
```

```plaintext
이름: GOOGLE_CLIENT_SECRET
값: [Google Cloud Console에서 발급받은 Client Secret]
환경: Production, Preview, Development 모두 체크
```

#### Kakao OAuth 환경 변수

```plaintext
이름: KAKAO_CLIENT_ID
값: [Kakao Developers REST API 키]
환경: Production, Preview, Development 모두 체크
```

```plaintext
이름: KAKAO_CLIENT_SECRET
값: [Kakao Developers Client Secret]
환경: Production, Preview, Development 모두 체크
```

---

## 2단계: Google OAuth Redirect URI 추가

### Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택
3. **API 및 서비스** → **사용자 인증 정보**
4. 기존 OAuth 2.0 클라이언트 ID 선택 (또는 새로 생성)
5. **승인된 JavaScript 원본**에 추가:
   ```
   https://baroolimcursor2025.vercel.app
   ```

6. **승인된 리디렉션 URI**에 추가:
   ```
   https://baroolimcursor2025.vercel.app/api/auth/callback/google
   ```

7. **저장** 클릭

⚠️ **중요**: 변경사항이 반영되기까지 5-10분 정도 소요될 수 있습니다.

---

## 3단계: Kakao OAuth Redirect URI 추가

### Kakao Developers 설정

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 애플리케이션 선택
3. **플랫폼** → **Web 플랫폼 등록** (또는 수정)
   - 사이트 도메인:
     ```
     https://baroolimcursor2025.vercel.app
     ```

4. **제품 설정** → **카카오 로그인** → **Redirect URI** 등록
   ```
   https://baroolimcursor2025.vercel.app/api/auth/callback/kakao
   ```

5. **저장** 클릭

---

## 4단계: Vercel 재배포

환경 변수를 추가한 후 반드시 재배포해야 합니다:

### 방법 1: Git Push로 자동 배포
```bash
git add .
git commit -m "Add OAuth environment variables"
git push origin main
```

### 방법 2: Vercel Dashboard에서 수동 배포
1. Vercel Dashboard → 프로젝트 선택
2. **Deployments** 탭
3. 최신 배포의 **...** 메뉴 클릭
4. **Redeploy** 선택

---

## 5단계: 테스트

### ✅ 프로덕션에서 테스트

1. https://baroolimcursor2025.vercel.app/login 접속
2. **Google로 시작하기** 클릭
   - Google 계정 선택
   - 권한 승인
   - `/studio`로 리다이렉트 확인
3. **카카오톡으로 시작하기** 클릭
   - 카카오 로그인
   - 동의 항목 확인
   - `/studio`로 리다이렉트 확인

---

## 📋 전체 설정 요약

### Google OAuth
| 항목 | 값 |
|------|------|
| 승인된 JavaScript 원본 | `https://baroolimcursor2025.vercel.app` |
| 리디렉션 URI | `https://baroolimcursor2025.vercel.app/api/auth/callback/google` |

### Kakao OAuth
| 항목 | 값 |
|------|------|
| 사이트 도메인 | `https://baroolimcursor2025.vercel.app` |
| Redirect URI | `https://baroolimcursor2025.vercel.app/api/auth/callback/kakao` |

### Vercel 환경 변수
```env
NEXTAUTH_URL=https://baroolimcursor2025.vercel.app
NEXTAUTH_SECRET=생성한_랜덤_시크릿
DATABASE_URL=postgresql://...
GOOGLE_API_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...
```

---

## 🔧 문제 해결

### 문제: "redirect_uri_mismatch" 오류

**원인**: Google Cloud Console에 정확한 redirect URI가 등록되지 않음

**해결**:
1. Google Cloud Console 재확인
2. 정확히 입력했는지 확인:
   ```
   https://baroolimcursor2025.vercel.app/api/auth/callback/google
   ```
3. `http://` (X) → `https://` (O) 확인
4. 끝에 슬래시 없음 확인
5. 저장 후 5-10분 대기

### 문제: Kakao "KOE006" 오류

**원인**: Kakao Developers에 redirect URI가 등록되지 않음

**해결**:
1. Kakao Developers 재확인
2. 정확히 입력:
   ```
   https://baroolimcursor2025.vercel.app/api/auth/callback/kakao
   ```
3. 카카오 로그인이 **활성화** 되어있는지 확인

### 문제: 환경 변수가 적용되지 않음

**원인**: Vercel 재배포가 필요함

**해결**:
```bash
# Git push로 재배포
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

또는 Vercel Dashboard에서 **Redeploy** 클릭

### 문제: Database 연결 오류

**원인**: `DATABASE_URL`이 설정되지 않았거나 잘못됨

**해결**:
1. Supabase 사용 권장 (무료):
   - [Supabase](https://supabase.com/) 가입
   - 새 프로젝트 생성
   - **Settings** → **Database** → **Connection string** → **URI** 복사
   - Vercel 환경 변수에 추가

2. 또는 기존 PostgreSQL 사용:
   - 공개 IP 허용 설정
   - SSL 인증서 설정

---

## 🎯 프로덕션 배포 체크리스트

### OAuth 설정
- [ ] Google Cloud Console에 프로덕션 도메인 추가
- [ ] Google Redirect URI 등록
- [ ] Kakao 플랫폼에 프로덕션 도메인 추가
- [ ] Kakao Redirect URI 등록

### Vercel 환경 변수
- [ ] `NEXTAUTH_URL` 설정
- [ ] `NEXTAUTH_SECRET` 생성 및 설정
- [ ] `DATABASE_URL` 설정
- [ ] `GOOGLE_API_KEY` 설정
- [ ] `GOOGLE_CLIENT_ID` 설정
- [ ] `GOOGLE_CLIENT_SECRET` 설정
- [ ] `KAKAO_CLIENT_ID` 설정
- [ ] `KAKAO_CLIENT_SECRET` 설정

### 배포 및 테스트
- [ ] Vercel 재배포
- [ ] 배포 성공 확인
- [ ] `/login` 페이지 접속 확인
- [ ] Google 로그인 테스트
- [ ] Kakao 로그인 테스트
- [ ] 로그인 후 `/studio` 리다이렉트 확인

---

## 📸 스크린샷 가이드

### Google Cloud Console - Redirect URI 설정

승인된 리디렉션 URI 섹션에 다음과 같이 표시되어야 합니다:

```
✓ https://baroolimcursor2025.vercel.app/api/auth/callback/google
✓ http://localhost:3000/api/auth/callback/google (개발용)
```

### Kakao Developers - Redirect URI 설정

Redirect URI 섹션에 다음과 같이 표시되어야 합니다:

```
✓ https://baroolimcursor2025.vercel.app/api/auth/callback/kakao
✓ http://localhost:3000/api/auth/callback/kakao (개발용)
```

---

## 🔐 보안 팁

### NEXTAUTH_SECRET 생성

터미널에서 안전한 시크릿 생성:

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### 환경 변수 관리

- ✅ **절대로** `.env` 파일을 Git에 커밋하지 마세요
- ✅ 프로덕션과 개발 환경의 시크릿을 다르게 사용하세요
- ✅ 정기적으로 시크릿을 갱신하세요

---

## 📞 지원

문제가 해결되지 않으면:

1. **Vercel 로그 확인**:
   - Vercel Dashboard → Deployments → 최신 배포 → **View Function Logs**

2. **브라우저 콘솔 확인**:
   - F12 → Console 탭에서 오류 메시지 확인

3. **NextAuth 디버그 모드**:
   - Vercel 환경 변수에 추가:
     ```
     NEXTAUTH_DEBUG=true
     ```

---

## ✅ 완료!

모든 설정이 완료되면:

1. https://baroolimcursor2025.vercel.app/login 접속
2. Google 또는 Kakao로 로그인
3. 마케팅 콘텐츠 생성 시작! 🎉

---

**참고**: 이 가이드는 https://baroolimcursor2025.vercel.app/ 도메인 기준으로 작성되었습니다. 커스텀 도메인을 사용하는 경우 해당 도메인으로 변경해주세요.

