# 포트 변경 가이드 (3000 → 3002)

## ✅ 완료된 작업

1. **package.json 수정 완료**
   - `npm run dev` 명령이 3002 포트로 실행되도록 변경됨

## 🔧 추가로 해야 할 작업

### 1. .env 파일 수정

`.env` 파일을 열어서 다음 값을 수정하세요:

```env
# 변경 전
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# 변경 후
NEXTAUTH_URL="http://localhost:3002"
NEXT_PUBLIC_APP_URL="http://localhost:3002"
```

### 2. Google Cloud Console 설정 변경

**중요**: Google OAuth가 작동하려면 Redirect URI를 업데이트해야 합니다!

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. **API 및 서비스** → **사용자 인증 정보**
3. OAuth 클라이언트 ID 선택
4. **승인된 리디렉션 URI**에 다음 추가:
   ```
   http://localhost:3002/api/auth/callback/google
   ```
5. 기존 3000 포트 URI 삭제 (선택사항)
6. **저장**

### 3. Kakao Developers 설정 변경

**중요**: Kakao 로그인이 작동하려면 Redirect URI를 업데이트해야 합니다!

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. **내 애플리케이션** → 애플리케이션 선택
3. **제품 설정** → **카카오 로그인**
4. **Redirect URI**에 다음 추가:
   ```
   http://localhost:3002/api/auth/callback/kakao
   ```
5. 기존 3000 포트 URI 삭제 (선택사항)
6. **저장**

### 4. 서버 재시작

```bash
# 1. 현재 실행 중인 서버 중지 (Ctrl+C)
# 2. 서버 재시작
npm run dev
```

서버가 3002 포트에서 실행됩니다:
```
✓ Ready on http://localhost:3002
```

### 5. 브라우저 접속

이제 다음 주소로 접속하세요:
- 메인 페이지: `http://localhost:3002`
- 로그인 페이지: `http://localhost:3002/login`
- 스튜디오: `http://localhost:3002/studio`

## 📋 체크리스트

완료한 항목을 체크하세요:

- [x] package.json 수정 (완료됨)
- [ ] `.env` 파일의 `NEXTAUTH_URL` 수정
- [ ] `.env` 파일의 `NEXT_PUBLIC_APP_URL` 수정
- [ ] Google Cloud Console Redirect URI 추가
- [ ] Kakao Developers Redirect URI 추가
- [ ] 서버 재시작
- [ ] 브라우저에서 `http://localhost:3002` 접속 테스트
- [ ] Google 로그인 테스트
- [ ] Kakao 로그인 테스트

## 🚨 주의사항

### Google/Kakao OAuth가 작동하지 않는 경우

1. **"redirect_uri_mismatch" 오류**
   - Google/Kakao에서 Redirect URI를 추가했는지 확인
   - 저장 후 5-10분 정도 기다려보기 (캐시 갱신)

2. **"Configuration" 오류**
   - `.env` 파일 수정 확인
   - 서버 재시작 확인

3. **여전히 3000 포트로 연결되는 경우**
   - 브라우저 캐시 클리어
   - 시크릿 모드에서 테스트

## 💡 빠른 확인

환경 변수가 제대로 설정되었는지 확인:
```bash
npm run check:env
```

서버 콘솔에서 다음 메시지 확인:
```
✅ Google OAuth 환경 변수 로드됨: ...
✅ Kakao OAuth 환경 변수 로드됨
```

## 🔄 다시 3000 포트로 되돌리려면

1. `package.json`에서 `"dev": "next dev -p 3002"`를 `"dev": "next dev"`로 변경
2. `.env` 파일의 URL들을 다시 3000으로 변경
3. Google/Kakao Redirect URI를 다시 3000으로 변경
4. 서버 재시작

