# 로컬 개발 환경 Google OAuth 설정 가이드

## 1. Google Cloud Console에서 OAuth 클라이언트 생성

### 1단계: Google Cloud Console 접속
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택 또는 새 프로젝트 생성

### 2단계: OAuth 동의 화면 설정
1. 좌측 메뉴 → "API 및 서비스" → "OAuth 동의 화면"
2. 사용자 유형 선택: "외부" 선택
3. 앱 정보 입력:
   - 앱 이름: `바로올림` (또는 원하는 이름)
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처 정보: 본인 이메일
4. 범위 추가: 기본 범위만 사용 (이메일, 프로필)
5. 테스트 사용자 추가 (선택사항): 본인 이메일 추가
6. 저장 후 계속

### 3단계: OAuth 클라이언트 ID 생성
1. "API 및 서비스" → "사용자 인증 정보"
2. 상단 "+ 사용자 인증 정보 만들기" → "OAuth 클라이언트 ID"
3. 애플리케이션 유형: "웹 애플리케이션"
4. 이름: `바로올림 로컬 개발`
5. 승인된 리디렉션 URI 추가:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. "만들기" 클릭

### 4단계: 클라이언트 ID와 Secret 복사
- 클라이언트 ID: `123456789-xxxxx.apps.googleusercontent.com` 형식
- 클라이언트 보안 비밀번호: `GOCSPX-xxxxx` 형식
- **중요**: Secret은 한 번만 표시되니 반드시 복사해두세요!

---

## 2. .env.local 파일에 추가

`.env.local` 파일에 다음 내용을 추가하세요:

```env
# NextAuth 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=여기에_랜덤_문자열_생성

# Google OAuth
GOOGLE_CLIENT_ID=여기에_복사한_클라이언트_ID_붙여넣기
GOOGLE_CLIENT_SECRET=여기에_복사한_클라이언트_Secret_붙여넣기

# 토스페이먼츠 테스트 모드 (이미 추가되어 있음)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_PBal2vxj81zb77bko04135RQgOAN
TOSS_SECRET_KEY=test_sk_6bJXmgo28eNYZA6YvpZE3LAnGKWx
```

### NEXTAUTH_SECRET 생성 방법

터미널에서 다음 명령어 실행:

```bash
# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))

# 또는 온라인 도구 사용
# https://generate-secret.vercel.app/32
```

또는 간단하게 랜덤 문자열을 사용해도 됩니다:
```
NEXTAUTH_SECRET=your-super-secret-key-here-at-least-32-characters
```

---

## 3. 개발 서버 재시작

환경 변수를 추가한 후 반드시 개발 서버를 재시작하세요:

```bash
# Ctrl+C로 서버 중지 후
npm run dev
```

---

## 4. 테스트

1. `http://localhost:3000/login` 접속
2. "Google로 시작하기" 버튼 클릭
3. Google 로그인 화면으로 리다이렉트되는지 확인
4. 로그인 후 다시 돌아오는지 확인

---

## 문제 해결

### Q: "리디렉션 URI가 일치하지 않습니다" 에러
A: Google Cloud Console의 리디렉션 URI가 정확히 `http://localhost:3000/api/auth/callback/google`인지 확인

### Q: "OAuth 클라이언트가 승인되지 않았습니다" 에러
A: OAuth 동의 화면에서 테스트 사용자로 본인 이메일을 추가했는지 확인

### Q: 로그인 후 에러가 발생해요
A: 
- `NEXTAUTH_URL`이 `http://localhost:3000`으로 설정되었는지 확인
- `NEXTAUTH_SECRET`이 설정되었는지 확인
- 브라우저 콘솔(F12)에서 에러 메시지 확인

### Q: 개발 중에만 사용하고 싶어요
A: `.env.local` 파일은 Git에 올라가지 않으므로 로컬에서만 사용 가능합니다.

---

## 빠른 설정 체크리스트

- [ ] Google Cloud Console에서 프로젝트 생성
- [ ] OAuth 동의 화면 설정 완료
- [ ] OAuth 클라이언트 ID 생성
- [ ] 리디렉션 URI 추가: `http://localhost:3000/api/auth/callback/google`
- [ ] `.env.local`에 `GOOGLE_CLIENT_ID` 추가
- [ ] `.env.local`에 `GOOGLE_CLIENT_SECRET` 추가
- [ ] `.env.local`에 `NEXTAUTH_URL=http://localhost:3000` 추가
- [ ] `.env.local`에 `NEXTAUTH_SECRET` 추가
- [ ] 개발 서버 재시작
- [ ] 로그인 테스트

