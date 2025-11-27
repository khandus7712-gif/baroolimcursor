# 구글 로그인 문제 해결 가이드

## 빠른 체크리스트

### 1. 환경 변수 확인

`.env.local` 파일에 다음이 모두 있는지 확인:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=최소_32자_랜덤_문자열
GOOGLE_CLIENT_ID=123456789-xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
```

### 2. 개발 서버 재시작

환경 변수를 추가/수정한 후 **반드시** 서버를 재시작하세요:

```bash
# Ctrl+C로 서버 중지
npm run dev
```

### 3. 브라우저 콘솔 확인

1. 브라우저에서 F12 눌러서 개발자 도구 열기
2. "Console" 탭 확인
3. 에러 메시지 확인

### 4. 네트워크 탭 확인

1. 개발자 도구 → "Network" 탭
2. "Google로 시작하기" 버튼 클릭
3. 실패한 요청 확인 (빨간색으로 표시)
4. 클릭해서 에러 메시지 확인

---

## 자주 발생하는 에러

### 에러 1: "리디렉션 URI가 일치하지 않습니다"

**원인**: Google Cloud Console의 리디렉션 URI가 잘못 설정됨

**해결**:
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. "API 및 서비스" → "사용자 인증 정보"
3. OAuth 클라이언트 ID 클릭
4. "승인된 리디렉션 URI"에 다음 추가:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. 저장 후 다시 시도

---

### 에러 2: "OAuth 클라이언트가 승인되지 않았습니다"

**원인**: OAuth 동의 화면이 설정되지 않았거나 테스트 사용자가 없음

**해결**:
1. "API 및 서비스" → "OAuth 동의 화면"
2. "테스트 사용자" 섹션에서 본인 이메일 추가
3. 저장 후 다시 시도

---

### 에러 3: "NEXTAUTH_URL이 설정되지 않았습니다"

**원인**: `.env.local`에 `NEXTAUTH_URL`이 없음

**해결**:
`.env.local`에 추가:
```env
NEXTAUTH_URL=http://localhost:3000
```

---

### 에러 4: "NEXTAUTH_SECRET이 설정되지 않았습니다"

**원인**: `.env.local`에 `NEXTAUTH_SECRET`이 없음

**해결**:
`.env.local`에 추가:
```env
NEXTAUTH_SECRET=랜덤_문자열_최소_32자
```

랜덤 문자열 생성:
- 온라인: https://generate-secret.vercel.app/32
- 또는 임의의 긴 문자열 사용

---

### 에러 5: "GOOGLE_CLIENT_ID가 비어있습니다"

**원인**: `.env.local`에 `GOOGLE_CLIENT_ID`가 없거나 잘못됨

**해결**:
1. Google Cloud Console에서 클라이언트 ID 확인
2. `.env.local`에 정확히 입력 (공백 없이)
3. 서버 재시작

---

## 단계별 디버깅

### Step 1: 환경 변수 확인

터미널에서 확인:
```bash
# Windows PowerShell
Get-Content .env.local
```

다음이 모두 있는지 확인:
- ✅ `NEXTAUTH_URL=http://localhost:3000`
- ✅ `NEXTAUTH_SECRET=...` (최소 32자)
- ✅ `GOOGLE_CLIENT_ID=...` (`.apps.googleusercontent.com`으로 끝남)
- ✅ `GOOGLE_CLIENT_SECRET=...` (`GOCSPX-`로 시작)

### Step 2: 서버 로그 확인

개발 서버를 실행한 터미널에서 에러 메시지 확인

### Step 3: 브라우저 콘솔 확인

1. `http://localhost:3000/login` 접속
2. F12 → Console 탭
3. "Google로 시작하기" 클릭
4. 에러 메시지 확인

### Step 4: Google Cloud Console 확인

1. [Google Cloud Console](https://console.cloud.google.com/)
2. "API 및 서비스" → "사용자 인증 정보"
3. OAuth 클라이언트 ID 확인:
   - ✅ 클라이언트 ID가 있음
   - ✅ 리디렉션 URI: `http://localhost:3000/api/auth/callback/google`
   - ✅ OAuth 동의 화면 설정 완료
   - ✅ 테스트 사용자에 본인 이메일 추가됨

---

## 간단한 테스트 방법

### 이메일 로그인으로 우회

구글 로그인이 안 되면 일단 이메일 로그인으로 테스트:

1. `http://localhost:3000/login` 접속
2. 이메일 입력 (예: `test@test.com`)
3. "이메일로 시작하기" 클릭
4. 자동으로 계정 생성되고 로그인됨

이메일 로그인은 Google OAuth 없이도 작동합니다!

---

## 여전히 안 되면

1. **에러 메시지 전체 복사**해서 알려주세요
2. **브라우저 콘솔 스크린샷** 보내주세요
3. **서버 로그** 확인해서 에러 메시지 알려주세요

그러면 정확한 해결 방법을 알려드릴 수 있습니다!

