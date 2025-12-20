# 카카오 로그인 오류 해결 가이드 (KOE101)

## 🔴 문제 상황
태블릿/모바일에서 카카오 로그인 시 다음 오류 발생:
- "앱 관리자 설정 오류 (KOE101)"
- "콜백 처리 오류가 발생했습니다"

## ✅ 해결 방법 (3단계)

### 1단계: 카카오 개발자 콘솔에서 Redirect URI 추가

1. **카카오 개발자 콘솔 접속**
   - https://developers.kakao.com/ 접속
   - 로그인 후 내 애플리케이션 선택

2. **카카오 로그인 설정**
   - 왼쪽 메뉴: **제품 설정** → **카카오 로그인** 클릭
   - **Redirect URI** 섹션 찾기

3. **Redirect URI 추가**
   다음 URL을 추가하세요:
   ```
   https://baroolim.com/api/auth/callback/kakao
   ```
   
   또는 현재 사용 중인 도메인이 다르다면:
   ```
   https://www.baroolim.com/api/auth/callback/kakao
   ```

4. **저장** 버튼 클릭

### 2단계: 플랫폼 등록 확인

1. **플랫폼 설정** 확인
   - 왼쪽 메뉴: **앱 설정** → **플랫폼** 클릭
   - **Web 플랫폼**이 등록되어 있는지 확인
   - 없으면 **플랫폼 추가** → **Web** 선택
   - 사이트 도메인 입력: `baroolim.com` (또는 `www.baroolim.com`)

2. **저장** 버튼 클릭

### 3단계: 동의 항목 설정 확인

1. **동의 항목 설정**
   - 왼쪽 메뉴: **제품 설정** → **카카오 로그인** → **동의항목** 클릭
   - 다음 항목이 **필수 동의**로 설정되어 있는지 확인:
     - ✅ 닉네임 (필수)
     - ✅ 카카오계정(이메일) (필수)
   - 프로필 사진은 선택 동의로 설정 가능

2. **저장** 버튼 클릭

---

## 🔍 확인 사항

### Vercel 환경 변수 확인

Vercel 대시보드에서 다음 환경 변수가 설정되어 있는지 확인:

1. **Vercel 접속**
   - https://vercel.com/ 접속
   - 프로젝트 선택

2. **환경 변수 확인**
   - **Settings** → **Environment Variables** 클릭
   - 다음 변수 확인:
     - `KAKAO_CLIENT_ID` (카카오 REST API 키)
     - `KAKAO_CLIENT_SECRET` (카카오 Client Secret)

3. **없으면 추가**
   - 카카오 개발자 콘솔에서 복사하여 추가
   - **Production**, **Preview**, **Development** 모두에 추가

4. **재배포**
   - 환경 변수 추가/수정 후 **반드시 재배포** 필요
   - **Deployments** 탭 → 최신 배포의 **"..."** → **Redeploy**

---

## 📋 체크리스트

카카오 개발자 콘솔:
- [ ] Redirect URI에 `https://baroolim.com/api/auth/callback/kakao` 추가됨
- [ ] Web 플랫폼 등록됨 (도메인: `baroolim.com`)
- [ ] 동의 항목 설정됨 (닉네임, 이메일 필수)

Vercel:
- [ ] `KAKAO_CLIENT_ID` 환경 변수 설정됨
- [ ] `KAKAO_CLIENT_SECRET` 환경 변수 설정됨
- [ ] 재배포 완료됨

---

## 🧪 테스트 방법

1. **브라우저 캐시 클리어**
   - 모바일/태블릿 브라우저에서 캐시 삭제
   - 또는 시크릿 모드로 테스트

2. **로그인 테스트**
   - https://baroolim.com/login 접속
   - "카카오톡으로 시작하기" 버튼 클릭
   - 카카오 로그인 진행

3. **성공 확인**
   - 로그인 후 `/studio` 페이지로 이동하면 성공

---

## 🆘 여전히 안 되면?

### 1. 정확한 도메인 확인
현재 사용 중인 도메인이 무엇인지 확인:
- `baroolim.com`?
- `www.baroolim.com`?
- 다른 도메인?

### 2. 카카오 개발자 콘솔에서 확인
- **앱 설정** → **앱 키** → **REST API 키** 확인
- Vercel의 `KAKAO_CLIENT_ID`와 일치하는지 확인

### 3. Vercel 로그 확인
- Vercel 대시보드 → **Deployments** → 최신 배포 → **Runtime Logs**
- 카카오 로그인 시도 시 오류 메시지 확인

---

## 💡 참고사항

- Redirect URI는 **정확히 일치**해야 합니다 (대소문자, 슬래시 포함)
- 환경 변수 변경 후 **반드시 재배포**해야 합니다
- 카카오 개발자 콘솔 설정 변경은 **즉시 적용**됩니다











