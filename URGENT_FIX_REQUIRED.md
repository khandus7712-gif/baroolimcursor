# 🚨 긴급 수정 필요: 로그인 버튼 작동 안 함

## 문제 원인

서버는 **3002 포트**에서 실행 중이지만, `.env` 파일의 `NEXTAUTH_URL`은 여전히 **3000 포트**로 설정되어 있습니다.

```
서버: http://localhost:3002 ✅
NEXTAUTH_URL: http://localhost:3000 ❌ (불일치!)
```

## 즉시 해결 방법

### 1. .env 파일 수정

`.env` 파일을 열어서 다음 값을 찾아 수정하세요:

**변경 전:**
```env
NEXTAUTH_URL="http://localhost:3000"
```

**변경 후:**
```env
NEXTAUTH_URL="http://localhost:3002"
```

### 2. 서버 재시작

**중요!** 환경 변수를 변경한 후에는 반드시 서버를 재시작해야 합니다:

```bash
# 1. 서버 중지: Ctrl+C
# 2. 서버 재시작
npm run dev
```

### 3. 다시 테스트

1. 브라우저에서 `http://localhost:3002/login` 접속
2. "Google로 시작하기" 버튼 클릭
3. 브라우저 콘솔(F12)에서 다음 로그 확인:
   ```
   🔵 Google 로그인 버튼 클릭됨
   🔵 signIn 함수 호출 중...
   ```

## 추가 확인 사항

### Google Cloud Console

Redirect URI가 3002 포트로 설정되어 있는지 확인하세요:

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. **API 및 서비스** → **사용자 인증 정보**
3. OAuth 클라이언트 ID 선택
4. **승인된 리디렉션 URI**에 다음이 있는지 확인:
   ```
   http://localhost:3002/api/auth/callback/google
   ```
5. 없으면 추가하고 저장

### Kakao Developers

Redirect URI가 3002 포트로 설정되어 있는지 확인하세요:

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. **내 애플리케이션** → 애플리케이션 선택
3. **제품 설정** → **카카오 로그인**
4. **Redirect URI**에 다음이 있는지 확인:
   ```
   http://localhost:3002/api/auth/callback/kakao
   ```
5. 없으면 추가하고 저장

## 체크리스트

- [ ] `.env` 파일에서 `NEXTAUTH_URL`을 3002로 변경
- [ ] 서버 재시작 (Ctrl+C 후 `npm run dev`)
- [ ] Google Cloud Console에서 Redirect URI 확인/추가
- [ ] Kakao Developers에서 Redirect URI 확인/추가
- [ ] `http://localhost:3002/login` 접속
- [ ] Google 로그인 버튼 클릭
- [ ] 브라우저 콘솔에서 로그 확인

## 완료 후

모든 단계를 완료한 후:

```bash
# 환경 변수 재확인
npm run check:env
```

NEXTAUTH_URL이 3002로 표시되어야 합니다:
```
✅ NEXTAUTH_URL: http...3002
```

## 문제가 계속되면

브라우저 콘솔(F12)에서:
- Console 탭: JavaScript 오류 확인
- Network 탭: 실패한 요청 확인

서버 콘솔에서:
- 환경 변수 로드 메시지 확인
- 오류 메시지 확인


















