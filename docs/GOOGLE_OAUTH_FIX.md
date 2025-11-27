# 구글 로그인 "OAuth client was not found" 에러 해결

## 에러 원인
- `GOOGLE_CLIENT_ID`가 잘못 입력됨
- Google Cloud Console에서 클라이언트가 생성되지 않음
- 클라이언트 ID 형식이 잘못됨

## 해결 방법

### 1단계: Google Cloud Console에서 클라이언트 확인

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택
3. 좌측 메뉴 → "API 및 서비스" → "사용자 인증 정보"
4. "OAuth 2.0 클라이언트 ID" 섹션 확인
5. 클라이언트가 있는지 확인

**클라이언트가 없다면:**
- "+ 사용자 인증 정보 만들기" → "OAuth 클라이언트 ID"
- 애플리케이션 유형: "웹 애플리케이션"
- 이름: `바로올림 로컬 개발`
- 승인된 리디렉션 URI: `http://localhost:3000/api/auth/callback/google`
- "만들기" 클릭

### 2단계: 클라이언트 ID 복사

클라이언트 ID 형식:
```
123456789-abcdefghijklmnop.apps.googleusercontent.com
```

**중요**: 
- `.apps.googleusercontent.com`으로 끝나야 함
- 공백이나 줄바꿈 없이 복사

### 3단계: .env.local 파일 수정

`.env.local` 파일을 열고:

```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

**확인사항:**
- ✅ `=` 뒤에 공백 없음
- ✅ 전체 클라이언트 ID가 한 줄에 있음
- ✅ `.apps.googleusercontent.com`으로 끝남
- ✅ 따옴표 없음

### 4단계: 서버 재시작

```bash
# Ctrl+C로 서버 중지
npm run dev
```

### 5단계: 다시 시도

1. `http://localhost:3000/login` 접속
2. "Google로 시작하기" 클릭
3. 정상 작동 확인

---

## 빠른 체크리스트

- [ ] Google Cloud Console에 OAuth 클라이언트가 있음
- [ ] 리디렉션 URI: `http://localhost:3000/api/auth/callback/google`
- [ ] `.env.local`에 `GOOGLE_CLIENT_ID`가 정확히 입력됨
- [ ] 클라이언트 ID 형식이 올바름 (`.apps.googleusercontent.com`)
- [ ] `.env.local`에 공백이나 따옴표 없음
- [ ] 서버를 재시작함

---

## 여전히 안 되면

1. **클라이언트 ID 전체를 다시 복사**해서 `.env.local`에 붙여넣기
2. **Google Cloud Console에서 클라이언트를 삭제하고 새로 만들기**
3. **브라우저 캐시 삭제** 후 다시 시도

