# 구글 로그인 오류 해결 가이드 (간단 버전)

## 🔴 문제
태블릿/모바일에서 구글 로그인 버튼을 누르면 오류가 발생합니다.

## ✅ 해결 방법 (3단계)

### 1단계: Google Cloud Console 접속
1. https://console.cloud.google.com/ 접속
2. 로그인 후 프로젝트 선택 (구글 로그인을 설정한 프로젝트)

### 2단계: Redirect URI 추가
1. 왼쪽 메뉴: **API 및 서비스** → **사용자 인증 정보** 클릭
2. OAuth 2.0 클라이언트 ID 찾기 (웹 애플리케이션)
3. 클릭하여 상세 정보 열기
4. **승인된 리디렉션 URI** 섹션 찾기
5. 다음 URL 추가:
   ```
   https://baroolim.com/api/auth/callback/google
   ```
   또는
   ```
   https://www.baroolim.com/api/auth/callback/google
   ```
6. **저장** 버튼 클릭

### 3단계: Vercel 재배포
1. Vercel 대시보드 접속
2. 프로젝트 선택
3. **Deployments** 탭 → 최신 배포의 **"..."** → **Redeploy** 클릭

---

## 📋 체크리스트

Google Cloud Console:
- [ ] Redirect URI에 `https://baroolim.com/api/auth/callback/google` 추가됨
- [ ] OAuth 동의 화면이 완료됨 (API 및 서비스 → OAuth 동의 화면)

Vercel:
- [ ] `GOOGLE_CLIENT_ID` 환경 변수 설정됨
- [ ] `GOOGLE_CLIENT_SECRET` 환경 변수 설정됨
- [ ] 재배포 완료됨

---

## 🧪 테스트 방법

1. **브라우저 캐시 클리어**
   - 모바일/태블릿 브라우저에서 캐시 삭제
   - 또는 시크릿 모드로 테스트

2. **로그인 테스트**
   - https://baroolim.com/login 접속
   - "Google로 시작하기" 버튼 클릭
   - 구글 로그인 진행

3. **성공 확인**
   - 로그인 후 `/studio` 페이지로 이동하면 성공

---

## 🆘 여전히 안 되면?

### 1. OAuth 동의 화면 확인
- Google Cloud Console → **API 및 서비스** → **OAuth 동의 화면**
- 모든 필수 항목이 입력되어 있는지 확인
- **앱 이름**, **사용자 지원 이메일**, **개발자 연락처 정보** 필수

### 2. 정확한 도메인 확인
현재 사용 중인 도메인이 무엇인지 확인:
- `baroolim.com`?
- `www.baroolim.com`?
- 다른 도메인?

### 3. Vercel 로그 확인
- Vercel 대시보드 → **Deployments** → 최신 배포 → **Runtime Logs**
- 구글 로그인 시도 시 오류 메시지 확인

---

## 💡 참고사항

- Redirect URI는 **정확히 일치**해야 합니다 (대소문자, 슬래시 포함)
- 환경 변수 변경 후 **반드시 재배포**해야 합니다
- Google Cloud Console 설정 변경은 **즉시 적용**됩니다











