# OAuth 로그인 설정 가이드

이 가이드는 Google과 Kakao OAuth 로그인을 설정하는 방법을 안내합니다.

## 📋 목차
1. [NextAuth 기본 설정](#1-nextauth-기본-설정)
2. [Google OAuth 설정](#2-google-oauth-설정)
3. [Kakao OAuth 설정](#3-kakao-oauth-설정)
4. [데이터베이스 설정](#4-데이터베이스-설정)
5. [테스트](#5-테스트)

---

## 1. NextAuth 기본 설정

### 1.1 NEXTAUTH_SECRET 생성

터미널에서 다음 명령어를 실행하여 랜덤 시크릿을 생성하세요:

```bash
openssl rand -base64 32
```

또는 PowerShell에서:

```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

생성된 값을 `.env.local` 파일의 `NEXTAUTH_SECRET`에 입력하세요.

### 1.2 NEXTAUTH_URL 설정

- **개발 환경**: `http://localhost:3000`
- **프로덕션**: `https://yourdomain.com`

`.env.local` 파일:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=생성한_시크릿_값
```

---

## 2. Google OAuth 설정

### 2.1 Google Cloud Console 접속

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 프로젝트 생성 (없는 경우)
   - 프로젝트 이름: `baroolim` 또는 원하는 이름

### 2.2 OAuth 동의 화면 설정

1. 왼쪽 메뉴 → **API 및 서비스** → **OAuth 동의 화면**
2. **외부** 선택 → **만들기**
3. 필수 정보 입력:
   - **앱 이름**: 바로올림
   - **사용자 지원 이메일**: 본인 이메일
   - **앱 도메인** (선택사항)
   - **개발자 연락처 이메일**: 본인 이메일
4. **저장 후 계속**

### 2.3 OAuth 클라이언트 ID 생성

1. 왼쪽 메뉴 → **사용자 인증 정보**
2. **+ 사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**
3. 애플리케이션 유형: **웹 애플리케이션**
4. 이름: `baroolim-web`
5. **승인된 JavaScript 원본** 추가:
   ```
   http://localhost:3000
   https://yourdomain.com (프로덕션용)
   ```
6. **승인된 리디렉션 URI** 추가:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google (프로덕션용)
   ```
7. **만들기** 클릭

### 2.4 환경 변수 설정

생성된 **클라이언트 ID**와 **클라이언트 보안 비밀**을 복사하여 `.env.local`에 입력:

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 3. Kakao OAuth 설정

### 3.1 Kakao Developers 접속

1. [Kakao Developers](https://developers.kakao.com/)에 접속
2. 로그인 (카카오 계정 필요)

### 3.2 애플리케이션 추가

1. **내 애플리케이션** → **애플리케이션 추가하기**
2. 필수 정보 입력:
   - **앱 이름**: 바로올림
   - **사업자명**: 본인 이름 또는 회사명
3. **저장**

### 3.3 플랫폼 설정

1. 생성한 애플리케이션 선택
2. **플랫폼** → **Web 플랫폼 등록**
3. **사이트 도메인** 입력:
   ```
   http://localhost:3000
   ```
   프로덕션:
   ```
   https://yourdomain.com
   ```

### 3.4 카카오 로그인 활성화

1. **제품 설정** → **카카오 로그인**
2. **활성화 설정** → **ON**
3. **Redirect URI** 등록:
   ```
   http://localhost:3000/api/auth/callback/kakao
   ```
   프로덕션:
   ```
   https://yourdomain.com/api/auth/callback/kakao
   ```

### 3.5 동의 항목 설정

1. **제품 설정** → **카카오 로그인** → **동의항목**
2. 다음 항목 설정:
   - **닉네임**: 필수 동의
   - **프로필 사진**: 선택 동의
   - **카카오계정(이메일)**: 필수 동의

### 3.6 환경 변수 설정

1. **앱 설정** → **앱 키**에서 **REST API 키** 복사
2. **제품 설정** → **카카오 로그인** → **보안**에서 **Client Secret** 발급 후 복사
3. `.env.local`에 입력:

```env
KAKAO_CLIENT_ID=your-kakao-rest-api-key
KAKAO_CLIENT_SECRET=your-kakao-client-secret
```

---

## 4. 데이터베이스 설정

### 4.1 PostgreSQL 설치 (로컬 개발용)

**Windows:**
1. [PostgreSQL 다운로드](https://www.postgresql.org/download/windows/)
2. 설치 중 비밀번호 설정
3. 기본 포트: 5432

**Mac (Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

### 4.2 데이터베이스 생성

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE baroolim;

# 사용자 생성 (선택사항)
CREATE USER baroolim_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE baroolim TO baroolim_user;

# 종료
\q
```

### 4.3 환경 변수 설정

`.env.local`에 데이터베이스 URL 입력:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/baroolim"
```

또는 생성한 사용자로:

```env
DATABASE_URL="postgresql://baroolim_user:your_password@localhost:5432/baroolim"
```

### 4.4 Prisma 마이그레이션 실행

```bash
npx prisma generate
npx prisma db push
```

---

## 5. 테스트

### 5.1 개발 서버 실행

```bash
npm run dev
```

### 5.2 로그인 페이지 접속

브라우저에서 [http://localhost:3000/login](http://localhost:3000/login) 접속

### 5.3 OAuth 로그인 테스트

1. **Google로 시작하기** 버튼 클릭
   - Google 계정 선택
   - 권한 승인
   - 로그인 완료 후 `/studio`로 리다이렉트

2. **카카오톡으로 시작하기** 버튼 클릭
   - 카카오 계정 로그인
   - 동의 항목 확인
   - 로그인 완료 후 `/studio`로 리다이렉트

### 5.4 데이터베이스 확인

```bash
# Prisma Studio로 데이터 확인
npx prisma studio
```

브라우저에서 [http://localhost:5555](http://localhost:5555)에서:
- `User` 테이블에 사용자 생성 확인
- `Account` 테이블에 OAuth 연결 정보 확인
- `Session` 테이블에 세션 정보 확인

---

## 🔧 문제 해결

### Google OAuth 오류

#### 오류: `redirect_uri_mismatch`

**원인**: Redirect URI가 Google Cloud Console에 등록되지 않음

**해결**:
1. Google Cloud Console → **사용자 인증 정보**
2. OAuth 클라이언트 ID 선택
3. **승인된 리디렉션 URI**에 정확히 추가:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. 저장 후 5-10분 대기 (Google 캐시 갱신)

#### 오류: `invalid_client`

**원인**: 환경 변수가 잘못 설정됨

**해결**:
1. `.env.local` 파일 확인
2. `GOOGLE_CLIENT_ID`와 `GOOGLE_CLIENT_SECRET` 재확인
3. 앞뒤 공백 제거
4. 서버 재시작: `npm run dev`

### Kakao OAuth 오류

#### 오류: `KOE006` (invalid_request)

**원인**: Redirect URI가 Kakao Developers에 등록되지 않음

**해결**:
1. Kakao Developers → 애플리케이션 선택
2. **카카오 로그인** → **Redirect URI** 확인
3. 정확히 추가:
   ```
   http://localhost:3000/api/auth/callback/kakao
   ```
4. 저장 후 테스트

#### 오류: `KOE009` (consent_required)

**원인**: 동의 항목이 설정되지 않음

**해결**:
1. **카카오 로그인** → **동의항목**
2. 닉네임, 이메일 필수 동의로 설정
3. 저장 후 테스트

### 데이터베이스 오류

#### 오류: `P1001` (Can't reach database)

**원인**: PostgreSQL이 실행되지 않음

**해결**:
```bash
# Windows
services.msc에서 postgresql 서비스 시작

# Mac
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

#### 오류: `P1017` (Server has closed the connection)

**원인**: DATABASE_URL이 잘못됨

**해결**:
1. `.env.local`의 `DATABASE_URL` 확인
2. 포트, 사용자명, 비밀번호 재확인
3. 데이터베이스가 생성되었는지 확인:
   ```bash
   psql -U postgres -l
   ```

---

## 📚 참고 자료

- [NextAuth.js 문서](https://next-auth.js.org/)
- [Google OAuth 문서](https://developers.google.com/identity/protocols/oauth2)
- [Kakao 로그인 문서](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [Prisma 문서](https://www.prisma.io/docs)

---

## ✅ 체크리스트

설정이 완료되었는지 확인하세요:

- [ ] PostgreSQL 설치 및 실행
- [ ] `baroolim` 데이터베이스 생성
- [ ] `.env.local` 파일 생성
- [ ] `DATABASE_URL` 설정
- [ ] `NEXTAUTH_URL` 설정
- [ ] `NEXTAUTH_SECRET` 생성 및 설정
- [ ] Google OAuth 클라이언트 생성
- [ ] `GOOGLE_CLIENT_ID` 설정
- [ ] `GOOGLE_CLIENT_SECRET` 설정
- [ ] Google Redirect URI 등록
- [ ] Kakao 애플리케이션 생성
- [ ] `KAKAO_CLIENT_ID` 설정
- [ ] `KAKAO_CLIENT_SECRET` 설정
- [ ] Kakao Redirect URI 등록
- [ ] `npx prisma db push` 실행
- [ ] `npm run dev` 실행
- [ ] Google 로그인 테스트
- [ ] Kakao 로그인 테스트

모든 항목이 체크되면 OAuth 로그인이 정상적으로 작동합니다! 🎉

