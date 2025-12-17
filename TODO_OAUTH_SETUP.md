# OAuth 로그인 설정 작업 체크리스트

## 📋 현재 상황
Google OAuth와 Kakao 로그인 설정 중 오류가 발생했습니다. 다음 작업들을 완료해야 합니다.

---

## ✅ 1. Google OAuth 동의 화면 완료 (가장 중요!)

### 현재 문제
- `invalid_client` 오류 발생
- OAuth 동의 화면이 완료되지 않아서 발생하는 문제

### 해결 방법

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com/ 접속
   - **올바른 프로젝트 선택** (클라이언트 ID를 생성한 프로젝트)

2. **OAuth 동의 화면으로 이동**
   - 왼쪽 메뉴 → **API 및 서비스** → **OAuth 동의 화면**

3. **필수 항목 입력**
   - [ ] **사용자 유형**: 외부 또는 내부 선택
   - [ ] **앱 이름**: "바로올림" 입력
   - [ ] **사용자 지원 이메일**: 본인 이메일 입력
   - [ ] **개발자 연락처 정보**: 본인 이메일 입력

4. **모든 단계 완료**
   - **저장 후 계속** 버튼 클릭
   - **범위** 단계 → **저장 후 계속**
   - **테스트 사용자** 단계 (필요시) → **저장 후 계속**
   - **요약** 단계 → **대시보드로 돌아가기**

5. **테스트 모드 확인**
   - 외부 사용자 유형 선택 시 **테스트 모드**로 유지 (개발 중)
   - 테스트 사용자 목록에 본인 이메일 추가

### 참고 문서
- `GOOGLE_OAUTH_FIX.md` - 상세한 해결 가이드
- `GOOGLE_OAUTH_CONSENT_SCREEN_CHECK.md` - 동의 화면 확인 가이드

---

## ✅ 2. Kakao 로그인 설정 확인

### 현재 문제
- Redirect URI 미스매치 오류 (KOE006)
- 동의 항목 미설정 오류 (KOE009)

### 해결 방법

1. **Kakao Developers 접속**
   - https://developers.kakao.com/ 접속
   - 내 애플리케이션 → 애플리케이션 선택

2. **Redirect URI 추가**
   - 제품 설정 → 카카오 로그인
   - Redirect URI에 다음 추가:
     ```
     http://localhost:3000/api/auth/callback/kakao
     ```
   - 저장

3. **동의 항목 설정**
   - 카카오 로그인 → 동의항목
   - 다음 항목 설정:
     - [ ] **닉네임**: 필수 동의
     - [ ] **카카오계정(이메일)**: 필수 동의
     - [ ] **프로필 사진**: 선택 동의 (권장)
   - 저장

### 참고 문서
- `KAKAO_LOGIN_TROUBLESHOOTING.md` - 상세한 해결 가이드

---

## ✅ 3. 환경 변수 확인

### 확인 방법
```bash
npm run check:env
```

### 필수 환경 변수
`.env` 파일에 다음 변수들이 설정되어 있어야 합니다:

- [ ] `GOOGLE_CLIENT_ID` - Google OAuth 클라이언트 ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth 클라이언트 Secret
- [ ] `KAKAO_CLIENT_ID` - Kakao OAuth 클라이언트 ID
- [ ] `KAKAO_CLIENT_SECRET` - Kakao OAuth 클라이언트 Secret
- [ ] `NEXTAUTH_URL` - NextAuth URL (예: `http://localhost:3000`)
- [ ] `NEXTAUTH_SECRET` - NextAuth Secret (랜덤 문자열)

### 환경 변수 생성 방법
```bash
# NEXTAUTH_SECRET 생성 (터미널에서 실행)
openssl rand -base64 32
```

---

## ✅ 4. 서버 재시작

모든 설정을 완료한 후:

1. **서버 중지**
   - 터미널에서 `Ctrl+C`

2. **서버 재시작**
   ```bash
   npm run dev
   ```

3. **환경 변수 로드 확인**
   - 서버 콘솔에서 다음 메시지 확인:
     ```
     ✅ Google OAuth 환경 변수 로드됨: ...
     ✅ Kakao OAuth 환경 변수 로드됨
     ```

---

## ✅ 5. 로그인 테스트

### Google 로그인 테스트
1. 브라우저에서 `http://localhost:3000/login` 접속
2. "Google로 시작하기" 버튼 클릭
3. Google 계정 선택 및 로그인
4. 성공적으로 로그인되는지 확인

### Kakao 로그인 테스트
1. 브라우저에서 `http://localhost:3000/login` 접속
2. "Kakao로 시작하기" 버튼 클릭
3. Kakao 계정으로 로그인
4. 성공적으로 로그인되는지 확인

---

## 🚨 여전히 오류가 발생하는 경우

### 확인 사항
1. **올바른 프로젝트 사용 확인**
   - Google Cloud Console에서 클라이언트 ID가 생성된 프로젝트를 사용하고 있는지 확인

2. **브라우저 캐시 클리어**
   - 개발자 도구 (F12) → 네트워크 탭 → "Disable cache" 체크
   - 또는 시크릿 모드에서 테스트

3. **서버 콘솔 오류 확인**
   - 서버 콘솔에 표시되는 오류 메시지 확인
   - 브라우저 콘솔 (F12)의 오류 메시지 확인

4. **네트워크 탭 확인**
   - F12 → Network 탭
   - `/api/auth/callback/google` 또는 `/api/auth/callback/kakao` 요청 확인
   - 오류 응답 코드 확인

---

## 📝 작업 우선순위

1. **가장 중요**: Google OAuth 동의 화면 완료
2. **두 번째**: Kakao Redirect URI 및 동의 항목 설정
3. **세 번째**: 환경 변수 확인
4. **네 번째**: 서버 재시작 및 테스트

---

## ✅ 완료 체크리스트

- [ ] Google OAuth 동의 화면 완료
- [ ] Kakao Redirect URI 추가
- [ ] Kakao 동의 항목 설정
- [ ] 환경 변수 확인 (`npm run check:env`)
- [ ] 서버 재시작
- [ ] Google 로그인 테스트 성공
- [ ] Kakao 로그인 테스트 성공

---

## 📚 참고 문서

- `GOOGLE_OAUTH_FIX.md` - Google OAuth 상세 해결 가이드
- `GOOGLE_OAUTH_CONSENT_SCREEN_CHECK.md` - Google 동의 화면 확인 가이드
- `KAKAO_LOGIN_TROUBLESHOOTING.md` - Kakao 로그인 문제 해결 가이드
- `ENV_SETUP.md` - 환경 변수 설정 가이드
- `OAUTH_SETUP_GUIDE.md` - OAuth 전체 설정 가이드














