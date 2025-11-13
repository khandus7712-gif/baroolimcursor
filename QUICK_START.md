# 바로올림 빠른 시작 가이드 ⚡

코딩 초보자도 5분 안에 시작할 수 있습니다!

---

## 📋 준비물

1. **Node.js** 설치 (https://nodejs.org)
2. **Supabase 계정** (무료) - https://supabase.com
3. **Google AI API 키** (무료) - https://aistudio.google.com

---

## 🚀 5단계로 시작하기

### 1단계: 프로젝트 다운로드

```bash
# 이미 다운로드되어 있음
cd C:\Users\khan2\Desktop\baroolim_cursor
```

### 2단계: 패키지 설치

터미널에서 실행:
```bash
npm install
```

⏱️ 약 2-3분 소요

---

### 3단계: 환경 변수 설정

프로젝트 폴더에 `.env` 파일을 만들고 아래 내용 입력:

```env
DATABASE_URL="postgresql://postgres.xxx:password@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
GOOGLE_API_KEY=your-google-ai-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**중요:**
- `DATABASE_URL`: Supabase에서 복사
- `GOOGLE_API_KEY`: Google AI Studio에서 복사

---

### 4단계: 데이터베이스 설정

```bash
npm run db:push
```

성공 메시지:
```
✔ Your database is now in sync with your Prisma schema.
```

---

### 5단계: 실행!

```bash
npm run dev
```

브라우저에서 접속:
```
http://localhost:3000
```

---

## ✅ 작동 확인

1. **메인 페이지** 보이는지 확인
2. **업종 선택** (음식/뷰티/소매)
3. **시작하기** 클릭
4. **스튜디오 페이지** 로드 확인
5. **콘텐츠 생성** 테스트

---

## 🎯 첫 콘텐츠 만들기

### 예제: 레스토랑 Instagram 포스트

1. 업종: **음식/식당** 선택
2. 플랫폼: **Instagram** 선택
3. 메모 입력:
   ```
   오늘의 신메뉴 시그니처 파스타
   신선한 바질과 토마토 크림 소스
   런치 세트 12,000원
   ```
4. 플러그인: **해시태그** 체크
5. **생성하기** 클릭
6. 결과 복사하여 사용!

---

## ❓ 자주 묻는 질문

### Q: "npm: command not found" 오류
A: Node.js를 설치하세요 → https://nodejs.org

### Q: 데이터베이스 연결 오류
A: 
1. Supabase 대시보드에서 연결 문자열 재확인
2. `.env` 파일의 `DATABASE_URL` 확인
3. 포트가 `5432`인지 확인

### Q: API 키 오류
A: Google AI Studio에서 키를 재발급받으세요

### Q: 서버가 시작되지 않음
A: 
1. `Ctrl + C`로 중지
2. `npm install` 다시 실행
3. `npm run dev` 다시 시작

---

## 🆘 도움이 필요하면

1. [STEP_BY_STEP.md](./STEP_BY_STEP.md) - 자세한 설정 가이드
2. [USER_GUIDE.md](./USER_GUIDE.md) - 사용 방법
3. [GOOGLE_AI_SETUP.md](./GOOGLE_AI_SETUP.md) - API 키 발급

---

## 🎉 다음 단계

- [ ] 다양한 업종/플랫폼 시도
- [ ] 이미지 업로드해서 사용
- [ ] 브랜드 정보 추가
- [ ] Vercel에 배포 (무료)

**즐거운 콘텐츠 생성 되세요!** 🚀

