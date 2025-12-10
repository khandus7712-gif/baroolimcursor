# 모든 로그인 문제 해결 가이드 (태블릿/모바일)

## 🔴 현재 문제들
1. ❌ 데이터베이스 오류: `monthlyGenerationCount` 컬럼 없음
2. ❌ 카카오 로그인 오류: KOE101 (앱 관리자 설정 오류)
3. ❌ 구글 로그인 오류: 태블릿에서 작동 안 함

---

## ✅ 해결 방법 (순서대로 진행)

### 1단계: 데이터베이스 오류 해결 (가장 먼저!)

#### Vercel에서 DATABASE_URL 복사
1. Vercel 대시보드 접속: https://vercel.com/
2. 프로젝트 선택
3. **Settings** → **Environment Variables**
4. `DATABASE_URL` 찾기
5. 값 옆 **"Show"** 또는 **"Copy"** 클릭하여 복사

#### 로컬에서 스키마 적용
PowerShell에서 실행:
```powershell
# 프로덕션 DATABASE_URL로 스키마 적용
$env:DATABASE_URL="여기에_복사한_DATABASE_URL_붙여넣기"; npx prisma db push
```

성공 메시지 확인:
```
✅ Your database is now in sync with your Prisma schema.
```

**⚠️ 중요**: 작업 완료 후 PowerShell을 닫아서 환경 변수가 남지 않도록 하세요!

---

### 2단계: 구글 로그인 해결

#### Google Cloud Console 설정
1. **Google Cloud Console 접속**
   - https://console.cloud.google.com/
   - 로그인 후 프로젝트 선택

2. **Redirect URI 추가**
   - 왼쪽 메뉴: **API 및 서비스** → **사용자 인증 정보**
   - OAuth 2.0 클라이언트 ID (웹 애플리케이션) 클릭
   - **승인된 리디렉션 URI** 섹션 찾기
   - 다음 URL 추가:
     ```
     https://baroolim.com/api/auth/callback/google
     https://www.baroolim.com/api/auth/callback/google
     ```
   - **저장** 버튼 클릭

3. **OAuth 동의 화면 확인**
   - 왼쪽 메뉴: **API 및 서비스** → **OAuth 동의 화면**
   - 다음 항목이 모두 설정되어 있는지 확인:
     - ✅ 사용자 유형 선택됨 (외부 또는 내부)
     - ✅ 앱 이름 입력됨
     - ✅ 사용자 지원 이메일 입력됨
     - ✅ 개발자 연락처 정보 입력됨
   - 완료되지 않았다면 모든 단계를 완료하세요

---

### 3단계: 카카오 로그인 해결

#### Kakao Developers 설정
1. **카카오 개발자 콘솔 접속**
   - https://developers.kakao.com/
   - 로그인 후 내 애플리케이션 선택

2. **Redirect URI 추가**
   - 왼쪽 메뉴: **제품 설정** → **카카오 로그인**
   - **Redirect URI** 섹션 찾기
   - 다음 URL 추가:
     ```
     https://baroolim.com/api/auth/callback/kakao
     https://www.baroolim.com/api/auth/callback/kakao
     ```
   - **저장** 버튼 클릭

3. **플랫폼 등록 확인**
   - 왼쪽 메뉴: **앱 설정** → **플랫폼**
   - **Web 플랫폼**이 등록되어 있는지 확인
   - 없으면 **플랫폼 추가** → **Web** 선택
   - 사이트 도메인 입력: `baroolim.com`
   - **저장** 버튼 클릭

4. **동의 항목 설정 확인**
   - 왼쪽 메뉴: **제품 설정** → **카카오 로그인** → **동의항목**
   - 다음 항목이 **필수 동의**로 설정되어 있는지 확인:
     - ✅ 닉네임 (필수)
     - ✅ 카카오계정(이메일) (필수)
   - **저장** 버튼 클릭

---

### 4단계: Vercel 환경 변수 확인

#### Vercel에서 환경 변수 확인
1. Vercel 대시보드 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables**
4. 다음 변수들이 모두 설정되어 있는지 확인:

**필수 환경 변수:**
- ✅ `DATABASE_URL` - 데이터베이스 연결 문자열
- ✅ `NEXTAUTH_URL` - `https://baroolim.com` 또는 `https://www.baroolim.com`
- ✅ `NEXTAUTH_SECRET` - 랜덤 문자열 (암호화용)
- ✅ `GOOGLE_CLIENT_ID` - Google OAuth 클라이언트 ID
- ✅ `GOOGLE_CLIENT_SECRET` - Google OAuth 클라이언트 Secret
- ✅ `KAKAO_CLIENT_ID` - Kakao REST API 키
- ✅ `KAKAO_CLIENT_SECRET` - Kakao Client Secret

**없는 변수가 있다면:**
- Google Cloud Console에서 복사하여 추가
- Kakao Developers에서 복사하여 추가

---

### 5단계: Vercel 재배포 (필수!)

**⚠️ 중요**: 환경 변수를 변경하거나 데이터베이스 스키마를 적용한 후 **반드시 재배포**해야 합니다!

1. Vercel 대시보드 → 프로젝트
2. **Deployments** 탭 클릭
3. 최신 배포의 **"..."** 메뉴 클릭
4. **Redeploy** 클릭
5. 배포가 완료될 때까지 대기 (약 2-3분)

---

### 6단계: 테스트

#### 브라우저 캐시 클리어
- 태블릿/모바일 브라우저에서 캐시 삭제
- 또는 시크릿 모드로 테스트

#### 로그인 테스트
1. https://baroolim.com/login 접속
2. **구글 로그인** 테스트
   - "Google로 시작하기" 버튼 클릭
   - 구글 로그인 진행
   - 성공하면 `/studio` 페이지로 이동
3. **카카오 로그인** 테스트
   - "카카오톡으로 시작하기" 버튼 클릭
   - 카카오 로그인 진행
   - 성공하면 `/studio` 페이지로 이동

---

## 📋 전체 체크리스트

### 데이터베이스
- [ ] Vercel에서 `DATABASE_URL` 복사 완료
- [ ] 로컬에서 `npx prisma db push` 실행 완료
- [ ] 성공 메시지 확인됨

### 구글 로그인
- [ ] Google Cloud Console에 Redirect URI 추가됨
- [ ] OAuth 동의 화면 완료됨
- [ ] Vercel에 `GOOGLE_CLIENT_ID` 설정됨
- [ ] Vercel에 `GOOGLE_CLIENT_SECRET` 설정됨

### 카카오 로그인
- [ ] Kakao Developers에 Redirect URI 추가됨
- [ ] Web 플랫폼 등록됨
- [ ] 동의 항목 설정됨
- [ ] Vercel에 `KAKAO_CLIENT_ID` 설정됨
- [ ] Vercel에 `KAKAO_CLIENT_SECRET` 설정됨

### Vercel
- [ ] 모든 환경 변수 설정 완료
- [ ] 재배포 완료됨

### 테스트
- [ ] 브라우저 캐시 클리어 완료
- [ ] 구글 로그인 테스트 성공
- [ ] 카카오 로그인 테스트 성공

---

## 🆘 여전히 안 되면?

### 1. 정확한 도메인 확인
현재 사용 중인 도메인이 무엇인지 확인:
- `baroolim.com`?
- `www.baroolim.com`?
- 다른 도메인?

**확인 방법:**
- 브라우저 주소창에 표시된 도메인 확인
- Vercel 대시보드 → 프로젝트 → **Settings** → **Domains** 확인

### 2. Vercel 로그 확인
- Vercel 대시보드 → **Deployments** → 최신 배포 → **Runtime Logs**
- 로그인 시도 시 오류 메시지 확인
- 오류 메시지를 복사하여 알려주세요

### 3. Google/Kakao 콘솔 재확인
- Redirect URI가 정확히 일치하는지 확인 (대소문자, 슬래시 포함)
- OAuth 동의 화면이 완료되었는지 확인

---

## 💡 참고사항

- Redirect URI는 **정확히 일치**해야 합니다
- 환경 변수 변경 후 **반드시 재배포**해야 합니다
- Google/Kakao 콘솔 설정 변경은 **즉시 적용**됩니다
- 데이터베이스 스키마 적용은 **즉시 적용**됩니다

---

## ⏱️ 예상 소요 시간

- 데이터베이스 스키마 적용: 1분
- Google Cloud Console 설정: 5분
- Kakao Developers 설정: 5분
- Vercel 환경 변수 확인: 2분
- Vercel 재배포: 3분
- 테스트: 5분

**총 예상 시간: 약 20분**

