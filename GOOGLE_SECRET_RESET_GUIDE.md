# Google Client Secret 재발급 가이드

## 🔴 현재 문제
`invalid_client (Unauthorized)` - Google이 Client Secret을 인식하지 못함

## ✅ 해결 방법

### 1단계: Google Cloud Console 접속
https://console.cloud.google.com/

### 2단계: OAuth 클라이언트 ID로 이동
1. 왼쪽 메뉴 → **API 및 서비스** → **사용자 인증 정보**
2. OAuth 2.0 클라이언트 ID 목록에서 사용 중인 클라이언트 ID 클릭

### 3단계: 새 Client Secret 만들기
1. **"추가 보안 비밀"** 버튼 클릭 (또는 "새 보안 비밀 만들기")
2. 생성된 새로운 Secret을 **즉시 복사** (다시 볼 수 없음!)

### 4단계: .env 파일 업데이트

프로젝트 루트의 `.env` 파일을 열어서:

```env
GOOGLE_CLIENT_SECRET=새로_복사한_시크릿
```

### 5단계: .env.local 파일도 업데이트

`.env.local` 파일도 열어서 동일하게:

```env
GOOGLE_CLIENT_SECRET=새로_복사한_시크릿
```

### 6단계: 서버 재시작

터미널에서:
```bash
Ctrl + C  # 서버 중지
npm run dev  # 서버 재시작
```

### 7단계: 다시 테스트

`http://localhost:3000/login` → "Google로 시작하기" 클릭

---

## 💡 중요 팁

- Client Secret은 생성 직후에만 볼 수 있습니다!
- 복사하는 순간 메모장에 붙여넣기 해두세요
- 앞뒤 공백이 없는지 확인하세요
- 따옴표는 포함하지 마세요

---

## 🚀 또는 간단한 방법

OAuth는 나중에 고치고, 먼저 **이메일 로그인**으로 테스트:
1. 로그인 페이지에서 이메일 입력
2. "이메일로 시작하기" 클릭
3. 작동하는지 확인

이메일 로그인이 작동하면 앱 자체는 정상입니다!

