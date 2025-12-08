# Google 로그인 에러 해결 가이드

## 🔴 발생한 문제

1. **404 에러**: `/api/auth/error` 페이지를 찾을 수 없음
2. **정적 파일 404**: CSS, JS 파일들이 로드되지 않음
3. **로그인 실패**: Google 로그인 후 다시 로그인 화면으로 돌아감

## ✅ 해결 방법

### 1. 에러 페이지 생성 완료

`app/api/auth/error/route.ts` 파일을 생성하여 NextAuth 에러를 처리하도록 했습니다.

### 2. 서버 재시작 필요

정적 파일 404 오류를 해결하려면 서버를 재시작해야 합니다:

```bash
# 1. 현재 실행 중인 서버 중지 (Ctrl+C)
# 2. 서버 재시작
npm run dev
```

### 3. 확인 사항

#### 환경 변수 확인
```bash
npm run check:env
```

다음 변수들이 설정되어 있어야 합니다:
- `NEXTAUTH_URL=http://localhost:3000`
- `NEXTAUTH_SECRET=...`
- `GOOGLE_CLIENT_ID=...`
- `GOOGLE_CLIENT_SECRET=...`

#### Google Cloud Console 확인
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. **API 및 서비스** → **OAuth 동의 화면** → 완료되어 있는지 확인
3. **사용자 인증 정보** → OAuth 클라이언트 ID 확인
4. **승인된 리디렉션 URI**에 다음이 추가되어 있는지 확인:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

### 4. 다시 테스트

1. 서버 재시작 후 `http://localhost:3000/login` 접속
2. "Google로 시작하기" 버튼 클릭
3. Google 인증 완료
4. 서버 콘솔에서 다음 로그 확인:
   ```
   🔵 OAuth signIn 콜백: ...
   🔵 JWT 토큰 생성: ...
   🔵 리다이렉트 콜백: ...
   🔵 세션 생성: ...
   ```

### 5. 여전히 문제가 있다면

#### 서버 콘솔 확인
- `🔴`로 시작하는 오류 메시지 확인
- `🔵`로 시작하는 로그가 어디까지 나타나는지 확인

#### 브라우저 콘솔 확인
- F12 → Console 탭
- Network 탭에서 실패한 요청 확인

#### 데이터베이스 확인
```bash
npm run db:studio
```

브라우저에서 `http://localhost:5555` 접속하여:
- `User` 테이블에 사용자가 생성되었는지 확인
- `Account` 테이블에 OAuth 계정이 연결되었는지 확인

## 📝 추가 디버깅

### NextAuth 디버그 모드
`.env` 파일에 다음 추가:
```env
NEXTAUTH_DEBUG=true
```

### 서버 로그 확인
서버 콘솔에서 다음을 확인:
- 환경 변수 로드 메시지
- OAuth 콜백 로그
- 세션 생성 로그
- 에러 메시지

## 🚨 일반적인 오류

### "Configuration" 오류
- 환경 변수가 로드되지 않음
- 서버 재시작 필요

### "invalid_client" 오류
- OAuth 동의 화면이 완료되지 않음
- Google Cloud Console에서 OAuth 동의 화면 완료

### "redirect_uri_mismatch" 오류
- Redirect URI가 Google Cloud Console에 등록되지 않음
- `http://localhost:3000/api/auth/callback/google` 추가

### 세션이 생성되지 않음
- 데이터베이스 연결 확인
- Prisma 스키마 확인
- `npm run db:push` 실행







