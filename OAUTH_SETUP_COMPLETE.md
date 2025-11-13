# 🔐 Google & Kakao OAuth 설정 가이드

## 📋 필요한 환경 변수

설정이 끝나면 `.env` 파일에 다음이 필요합니다:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Kakao OAuth
KAKAO_CLIENT_ID="your-kakao-rest-api-key"
KAKAO_CLIENT_SECRET="your-kakao-client-secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="random-32-character-string"
```

---

## 🔵 Part 1: Google OAuth 설정 (10분)

### 1단계: Google Cloud Console 접속

```
https://console.cloud.google.com/
```

### 2단계: 프로젝트 생성

1. 상단 프로젝트 선택 → **"새 프로젝트"**
2. 프로젝트 이름: **"바로올림"**
3. **만들기** 클릭

### 3단계: OAuth 동의 화면 설정

1. 좌측 메뉴: **"APIs & Services"** → **"OAuth consent screen"**
2. User Type: **"External"** 선택 → **계속**
3. 앱 정보 입력:
   - 앱 이름: `바로올림`
   - 사용자 지원 이메일: `pernar.go@gmail.com`
   - 앱 로고: (선택사항)
   - 앱 도메인: (비워둠)
   - 승인된 도메인: (비워둠)
   - 개발자 연락처: `pernar.go@gmail.com`
4. **저장 후 계속**
5. 범위(Scopes): 건너뛰기
6. 테스트 사용자: 건너뛰기
7. **대시보드로 돌아가기**

### 4단계: OAuth 클라이언트 ID 만들기

1. 좌측 메뉴: **"Credentials"** → **"+ CREATE CREDENTIALS"**
2. **"OAuth client ID"** 선택
3. 애플리케이션 유형: **"웹 애플리케이션"**
4. 이름: `바로올림 웹`
5. **승인된 JavaScript 원본** 추가:
   ```
   http://localhost:3000
   ```
6. **승인된 리디렉션 URI** 추가:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. **만들기** 클릭

### 5단계: 클라이언트 ID & Secret 복사

팝업에 나타나는:
- **클라이언트 ID**: 복사 → 메모장에 저장
- **클라이언트 보안 비밀번호**: 복사 → 메모장에 저장

---

## 🟡 Part 2: Kakao OAuth 설정 (10분)

### 1단계: Kakao Developers 접속

```
https://developers.kakao.com/
```

### 2단계: 로그인 & 애플리케이션 추가

1. 카카오 계정으로 로그인
2. 상단 **"내 애플리케이션"** 클릭
3. **"애플리케이션 추가하기"** 클릭
4. 앱 정보 입력:
   - 앱 이름: `바로올림`
   - 사업자명: `이주연` (또는 본인 이름)
5. **저장** 클릭

### 3단계: 앱 키 확인

생성된 앱을 클릭 → **"앱 키"** 탭:
- **REST API 키**: 복사 → 메모장에 저장

### 4단계: 플랫폼 설정

1. 좌측 메뉴 **"플랫폼"** 클릭
2. **"Web 플랫폼 등록"** 클릭
3. 사이트 도메인:
   ```
   http://localhost:3000
   ```
4. **저장** 클릭

### 5단계: Redirect URI 설정

1. 좌측 메뉴 **"카카오 로그인"** 클릭
2. **활성화 설정** → **ON**
3. 아래로 스크롤 → **"Redirect URI"** 섹션
4. **"Redirect URI 등록"** 클릭
5. URI 입력:
   ```
   http://localhost:3000/api/auth/callback/kakao
   ```
6. **저장** 클릭

### 6단계: 동의 항목 설정

1. 좌측 메뉴 **"카카오 로그인"** → **"동의항목"**
2. 필수 동의 항목 설정:
   - **닉네임**: 필수 동의
   - **프로필 이미지**: 선택 동의
   - **카카오계정(이메일)**: 필수 동의 (사업자 인증 필요할 수 있음)
3. **저장**

### 7단계: Client Secret 생성 (선택)

1. 좌측 메뉴 **"카카오 로그인"** → **"보안"**
2. **"Client Secret"** 섹션
3. **"코드 생성"** 클릭
4. 생성된 코드 복사 → 메모장에 저장
5. **활성화 상태** → **사용함** 선택

---

## 🔐 Part 3: NEXTAUTH_SECRET 생성

PowerShell에서 실행:

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

출력된 문자열 복사 → 메모장에 저장

---

## 📝 Part 4: .env 파일 업데이트

프로젝트의 `.env` 파일을 열고 다음 추가:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="위에서_복사한_Google_클라이언트_ID"
GOOGLE_CLIENT_SECRET="위에서_복사한_Google_클라이언트_Secret"

# Kakao OAuth  
KAKAO_CLIENT_ID="위에서_복사한_Kakao_REST_API_키"
KAKAO_CLIENT_SECRET="위에서_복사한_Kakao_Client_Secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="위에서_생성한_32자_문자열"
```

---

## 🚀 Part 5: Vercel 배포 시 환경 변수

Vercel Dashboard → 프로젝트 → Settings → Environment Variables

**추가할 변수들:**

| Name | Value | 비고 |
|------|-------|------|
| `GOOGLE_CLIENT_ID` | Google 클라이언트 ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google 클라이언트 Secret | ✅ |
| `KAKAO_CLIENT_ID` | Kakao REST API 키 | ✅ |
| `KAKAO_CLIENT_SECRET` | Kakao Client Secret | ✅ |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | 배포 URL로 변경 |
| `NEXTAUTH_SECRET` | 32자 랜덤 문자열 | ✅ |
| `DATABASE_URL` | (기존 값) | ✅ |
| `GOOGLE_API_KEY` | (기존 값) | ✅ |
| `RESEND_API_KEY` | (기존 값) | ✅ |

**⚠️ 중요:** Vercel에 배포한 후, Google & Kakao에서 **배포 도메인도 추가**해야 합니다!

---

## 🔄 배포 후 추가 설정

### Google Cloud Console

**승인된 JavaScript 원본에 추가:**
```
https://your-domain.vercel.app
```

**승인된 리디렉션 URI에 추가:**
```
https://your-domain.vercel.app/api/auth/callback/google
```

### Kakao Developers

**플랫폼에 추가:**
```
https://your-domain.vercel.app
```

**Redirect URI에 추가:**
```
https://your-domain.vercel.app/api/auth/callback/kakao
```

---

## ✅ 테스트 체크리스트

### 로컬 테스트

- [ ] `.env` 파일에 모든 변수 추가
- [ ] 서버 재시작 (`npm run dev`)
- [ ] http://localhost:3000/login 접속
- [ ] Google 로그인 버튼 클릭 → 작동 확인
- [ ] 카카오 로그인 버튼 클릭 → 작동 확인
- [ ] 이메일 로그인도 작동 확인

### 배포 후 테스트

- [ ] Vercel 환경 변수 모두 추가
- [ ] Google에 배포 도메인 추가
- [ ] Kakao에 배포 도메인 추가
- [ ] 배포 URL에서 Google 로그인 테스트
- [ ] 배포 URL에서 카카오 로그인 테스트

---

## 🐛 문제 해결

### Google 로그인 에러

**에러:** "redirect_uri_mismatch"
**해결:** Google Cloud Console에서 Redirect URI 확인
```
http://localhost:3000/api/auth/callback/google
```

### Kakao 로그인 에러

**에러:** "invalid_request"
**해결:** Kakao Developers에서 Redirect URI 확인
```
http://localhost:3000/api/auth/callback/kakao
```

### NextAuth 에러

**에러:** "NEXTAUTH_SECRET is not set"
**해결:** `.env`에 NEXTAUTH_SECRET 추가

---

## 📚 참고 링크

- Google OAuth: https://console.cloud.google.com/
- Kakao Developers: https://developers.kakao.com/
- NextAuth.js Docs: https://next-auth.js.org/

---

**설정 완료 후 이 문서를 참고하여 단계별로 진행하세요!** 📖

