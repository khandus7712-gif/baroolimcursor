# 🔐 로그인 시스템 설정 가이드

## ✅ 완료된 작업

1. **NextAuth.js 설치** ✅
2. **Prisma Schema 업데이트** ✅
   - User, Account, Session, VerificationToken 테이블 추가
3. **로그인 페이지 생성** ✅
   - `/login` - 모던한 로그인 UI
4. **세션 관리** ✅
   - 전체 앱에 SessionProvider 적용
5. **인증 체크** ✅
   - `/studio`, `/scheduled` 페이지 보호
   - 로그인하지 않으면 자동 리다이렉트

---

## 🔑 Google OAuth 설정 (5분)

### 1단계: Google Cloud Console 설정

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com/

2. **새 프로젝트 생성**
   - 프로젝트 이름: "바로올림"

3. **OAuth 동의 화면 설정**
   - 좌측 메뉴: APIs & Services → OAuth consent screen
   - User Type: External 선택
   - 앱 이름: "바로올림"
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처: 본인 이메일
   - Save and Continue

4. **OAuth 클라이언트 ID 만들기**
   - 좌측 메뉴: APIs & Services → Credentials
   - "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: "Web application"
   - 이름: "바로올림 웹"
   
   **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   https://your-domain.vercel.app
   ```
   
   **Authorized redirect URIs:**
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-domain.vercel.app/api/auth/callback/google
   ```

5. **Client ID와 Client Secret 복사**
   - 창에 표시되는 값들을 복사해서 보관

### 2단계: 환경 변수 설정

`.env` 파일에 다음 추가:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="random-secret-string-here"
```

**NEXTAUTH_SECRET 생성:**
```bash
# PowerShell에서
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 3단계: Vercel 배포 시 환경 변수

Vercel 대시보드에서 다음 환경 변수 추가:

| 변수명 | 값 | 필수 |
|--------|-----|-----|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ✅ |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | ✅ |
| `NEXTAUTH_SECRET` | 랜덤 문자열 (32자 이상) | ✅ |
| `DATABASE_URL` | PostgreSQL 연결 URL | ✅ |
| `GOOGLE_API_KEY` | Google AI API 키 | ✅ |

---

## 📱 현재 로그인 방식

### 1. Google 로그인 (추천) ⭐
- 버튼 클릭 한 번으로 완료
- Google 계정 정보 자동 입력
- 빠르고 안전

### 2. 이메일 간편 로그인
- 이메일만 입력
- 자동 계정 생성
- **현재 비밀번호 체크 없음** (빠른 온보딩)

---

## 🔒 보안 강화 (나중에)

### Phase 2: 비밀번호 추가
```bash
npm install bcrypt @types/bcrypt
```

### Phase 3: 카카오 로그인
```bash
npm install next-auth-kakao
```

### Phase 4: 이메일 인증
- SendGrid로 인증 이메일 발송
- 이메일 확인 후 활성화

---

## 🎯 사용자 플로우

### 신규 사용자
1. 메인 페이지 "시작하기" 클릭
2. `/login` 페이지로 이동
3. Google 또는 이메일로 로그인
4. 자동으로 계정 생성 (FREE 플랜)
5. `/studio`로 리다이렉트
6. 바로 콘텐츠 생성 시작!

### 기존 사용자
1. "로그인" 버튼 클릭
2. Google 또는 이메일로 로그인
3. 기존 데이터 그대로 유지

---

## 🧪 테스트하기

### 로컬 개발
1. 서버 재시작:
```bash
npm run dev
```

2. http://localhost:3000 접속

3. "시작하기" → 로그인 페이지

4. 테스트:
   - ✅ Google 로그인 버튼 작동
   - ✅ 이메일 로그인 작동
   - ✅ 로그인 후 Studio 접근
   - ✅ 로그아웃 후 Studio 접근 차단

### 확인 사항
- [ ] Google OAuth 설정 완료
- [ ] 환경 변수 추가 완료
- [ ] 로그인 페이지 정상 작동
- [ ] Studio 페이지 인증 체크
- [ ] 세션 유지 확인

---

## 📊 사용자 데이터

### User 테이블 필드
- `id`: 고유 ID
- `email`: 이메일
- `name`: 이름
- `image`: 프로필 이미지 (Google 로그인 시)
- `plan`: 구독 플랜 (FREE/BASIC/PRO/ENTERPRISE)
- `totalGenerations`: 총 생성 횟수
- `dailyGenerationCount`: 일일 생성 횟수

### 세션 정보 접근
```typescript
import { useSession } from 'next-auth/react';

function Component() {
  const { data: session } = useSession();
  
  // 사용자 ID
  const userId = session?.user?.id;
  
  // 플랜 정보
  const plan = session?.user?.plan;
  
  // 생성 횟수
  const generations = session?.user?.totalGenerations;
}
```

---

## 🚀 다음 단계

### 즉시 가능
1. ✅ 로그인 시스템 완료
2. ✅ 사용자별 데이터 분리
3. ✅ 무료 5회 제한 체크 가능

### 곧 구현
1. 요금제별 기능 제한
2. 결제 시스템 통합
3. 카카오 로그인 추가
4. 이메일 인증

**로그인 시스템 구축 완료! 🎉**

