# 🚨 지금 해야 할 일 정리

## 📋 현재 문제 상황

1. ❌ **Supabase 데이터베이스 연결 오류** (가장 중요!)
2. ❌ 데이터베이스 컬럼 없음 (`monthlyGenerationCount`)
3. ❌ 카카오 로그인 오류 (KOE101)
4. ❌ 구글 로그인 오류 (태블릿)

---

## ✅ 해결 순서 (우선순위별)

### 🔴 1단계: Supabase 데이터베이스 연결 해결 (가장 먼저!)

**이게 해결되지 않으면 다른 것들을 할 수 없습니다!**

#### A. Supabase 프로젝트 확인
1. https://supabase.com/ 접속
2. 로그인 후 프로젝트 선택
3. **프로젝트가 일시 중지되었는지 확인**
   - 일시 중지되었다면 → **"Resume"** 버튼 클릭
   - 프로젝트가 삭제되었다면 → 새 프로젝트 생성 필요

#### B. DATABASE_URL 복사
1. Supabase → **Settings** (왼쪽 하단 톱니바퀴) → **Database**
2. **Connection string** 섹션 찾기
3. **URI** 탭 선택
4. **Mode: Transaction** 선택
5. ✅ **"Use connection pooling"** 체크
6. 표시된 연결 문자열 **전체 복사**

#### C. 비밀번호 확인/재설정
- 비밀번호를 모르면:
  1. **Database Password** 섹션
  2. **Reset database password** 클릭
  3. 새 비밀번호 생성 (복사해두기!)
  4. 복사한 DATABASE_URL의 `[YOUR-PASSWORD]` 부분을 새 비밀번호로 교체

#### D. Vercel에 DATABASE_URL 업데이트
1. https://vercel.com/ 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables**
4. `DATABASE_URL` 찾기 → **Edit** 클릭
5. 새로 복사한 DATABASE_URL 붙여넣기
6. **Save** 클릭
7. **Apply to all environments** 선택 (또는 Production, Preview, Development 각각 업데이트)

#### E. Vercel 재배포
1. **Deployments** 탭 클릭
2. 최신 배포의 **"..."** → **Redeploy** 클릭
3. 배포 완료까지 대기 (2-3분)

**⏱️ 예상 시간: 10-15분**

---

### 🟡 2단계: 데이터베이스 스키마 적용 (1단계 완료 후)

**Supabase 연결이 정상화된 후 진행**

#### A. 로컬에서 스키마 적용
PowerShell에서 실행:
```powershell
# Vercel에서 복사한 DATABASE_URL 사용
$env:DATABASE_URL="여기에_Vercel에서_복사한_DATABASE_URL_붙여넣기"; npx prisma db push
```

성공 메시지 확인:
```
✅ Your database is now in sync with your Prisma schema.
```

**⚠️ 중요**: 작업 완료 후 PowerShell 창을 닫아서 환경 변수가 남지 않도록 하세요!

**⏱️ 예상 시간: 2분**

---

### 🟢 3단계: 구글 로그인 설정 (2단계 완료 후)

#### A. Google Cloud Console 설정
1. https://console.cloud.google.com/ 접속
2. 프로젝트 선택
3. **API 및 서비스** → **사용자 인증 정보**
4. OAuth 2.0 클라이언트 ID (웹 애플리케이션) 클릭
5. **승인된 리디렉션 URI** 섹션에 추가:
   ```
   https://baroolim.com/api/auth/callback/google
   https://www.baroolim.com/api/auth/callback/google
   ```
6. **저장** 클릭

#### B. OAuth 동의 화면 확인
1. **API 및 서비스** → **OAuth 동의 화면**
2. 다음 항목 확인:
   - ✅ 사용자 유형 선택됨
   - ✅ 앱 이름 입력됨
   - ✅ 사용자 지원 이메일 입력됨
   - ✅ 개발자 연락처 정보 입력됨
3. 완료되지 않았다면 모든 단계 완료

#### C. Vercel 환경 변수 확인
1. Vercel → **Settings** → **Environment Variables**
2. 다음 변수 확인:
   - `GOOGLE_CLIENT_ID` ✅
   - `GOOGLE_CLIENT_SECRET` ✅
3. 없으면 Google Cloud Console에서 복사하여 추가

#### D. Vercel 재배포
- 환경 변수 변경 후 재배포

**⏱️ 예상 시간: 5분**

---

### 🟢 4단계: 카카오 로그인 설정 (3단계 완료 후)

#### A. Kakao Developers 설정
1. https://developers.kakao.com/ 접속
2. 내 애플리케이션 선택
3. **제품 설정** → **카카오 로그인**
4. **Redirect URI** 섹션에 추가:
   ```
   https://baroolim.com/api/auth/callback/kakao
   https://www.baroolim.com/api/auth/callback/kakao
   ```
5. **저장** 클릭

#### B. 플랫폼 등록 확인
1. **앱 설정** → **플랫폼**
2. **Web 플랫폼** 등록 확인
3. 없으면 **플랫폼 추가** → **Web** 선택
4. 사이트 도메인: `baroolim.com`
5. **저장** 클릭

#### C. 동의 항목 설정 확인
1. **제품 설정** → **카카오 로그인** → **동의항목**
2. 다음 항목이 **필수 동의**로 설정되어 있는지 확인:
   - ✅ 닉네임 (필수)
   - ✅ 카카오계정(이메일) (필수)
3. **저장** 클릭

#### D. Vercel 환경 변수 확인
1. Vercel → **Settings** → **Environment Variables**
2. 다음 변수 확인:
   - `KAKAO_CLIENT_ID` ✅
   - `KAKAO_CLIENT_SECRET` ✅
3. 없으면 Kakao Developers에서 복사하여 추가

#### E. Vercel 재배포
- 환경 변수 변경 후 재배포

**⏱️ 예상 시간: 5분**

---

### 🧪 5단계: 테스트 (모든 단계 완료 후)

#### A. 브라우저 캐시 클리어
- 태블릿/모바일 브라우저에서 캐시 삭제
- 또는 시크릿 모드로 테스트

#### B. 로그인 테스트
1. https://baroolim.com/login 접속
2. **구글 로그인** 테스트
   - "Google로 시작하기" 버튼 클릭
   - 구글 로그인 진행
   - 성공하면 `/studio` 페이지로 이동
3. **카카오 로그인** 테스트
   - "카카오톡으로 시작하기" 버튼 클릭
   - 카카오 로그인 진행
   - 성공하면 `/studio` 페이지로 이동

**⏱️ 예상 시간: 5분**

---

## 📋 전체 체크리스트

### 1단계: Supabase 연결
- [ ] Supabase 프로젝트가 활성화되어 있나요?
- [ ] DATABASE_URL을 복사했나요?
- [ ] 데이터베이스 비밀번호를 확인/재설정했나요?
- [ ] Vercel에 DATABASE_URL을 업데이트했나요?
- [ ] Vercel 재배포를 완료했나요?

### 2단계: 데이터베이스 스키마
- [ ] 로컬에서 `npx prisma db push` 실행했나요?
- [ ] 성공 메시지를 확인했나요?

### 3단계: 구글 로그인
- [ ] Google Cloud Console에 Redirect URI를 추가했나요?
- [ ] OAuth 동의 화면이 완료되었나요?
- [ ] Vercel에 환경 변수가 설정되어 있나요?
- [ ] Vercel 재배포를 완료했나요?

### 4단계: 카카오 로그인
- [ ] Kakao Developers에 Redirect URI를 추가했나요?
- [ ] Web 플랫폼이 등록되어 있나요?
- [ ] 동의 항목이 설정되어 있나요?
- [ ] Vercel에 환경 변수가 설정되어 있나요?
- [ ] Vercel 재배포를 완료했나요?

### 5단계: 테스트
- [ ] 브라우저 캐시를 클리어했나요?
- [ ] 구글 로그인 테스트 성공했나요?
- [ ] 카카오 로그인 테스트 성공했나요?

---

## ⏱️ 총 예상 시간

- 1단계: Supabase 연결 해결 - **10-15분**
- 2단계: 데이터베이스 스키마 적용 - **2분**
- 3단계: 구글 로그인 설정 - **5분**
- 4단계: 카카오 로그인 설정 - **5분**
- 5단계: 테스트 - **5분**

**총 예상 시간: 약 30-35분**

---

## 🚨 중요 사항

1. **순서를 지켜주세요!**
   - 1단계가 완료되지 않으면 2단계를 할 수 없습니다
   - 데이터베이스 연결이 정상화되어야 앱이 작동합니다

2. **환경 변수 변경 후 반드시 재배포!**
   - Vercel에서 환경 변수를 변경한 후
   - 반드시 **Redeploy**를 해야 적용됩니다

3. **정확한 도메인 사용**
   - 현재 사용 중인 도메인이 무엇인지 확인:
     - `baroolim.com`?
     - `www.baroolim.com`?
   - Redirect URI에 정확히 일치하는 도메인 사용

---

## 🆘 막히는 부분이 있으면?

각 단계별로 상세한 가이드가 있습니다:
- 1단계: `SUPABASE_CONNECTION_ERROR_FIX.md`
- 2단계: `FIX_ALL_LOGIN_ISSUES.md` (데이터베이스 부분)
- 3단계: `GOOGLE_LOGIN_FIX_SIMPLE.md`
- 4단계: `KAKAO_FIX_GUIDE.md`

---

## 💡 팁

- 한 번에 하나씩 차근차근 진행하세요
- 각 단계 완료 후 테스트해보세요
- 오류가 발생하면 해당 단계의 가이드를 다시 확인하세요



