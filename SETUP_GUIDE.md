# 바로올림 프로젝트 초보자 가이드 🚀

안녕하세요! 코딩 초보자를 위한 설정 가이드입니다. 차근차근 따라해보세요!

---

## 📋 1단계: 프로젝트 기본 설정 확인

### ✅ 이미 완료된 것들
- ✅ Next.js 프로젝트 생성됨
- ✅ TypeScript 설정 완료
- ✅ Prisma 스키마를 PostgreSQL로 변경 완료

### 🔧 이제 해야 할 것들

---

## 📝 2단계: 환경 변수 파일(.env) 만들기

프로젝트 루트 폴더(`baroolim_cursor`)에 `.env` 파일을 만들어주세요.

**방법:**
1. 프로젝트 폴더를 열어주세요
2. 새 파일을 만들고 이름을 `.env`로 저장하세요 (앞에 점(.)이 중요합니다!)
3. 아래 내용을 복사해서 붙여넣으세요:

```env
# Database
DATABASE_URL="postgresql://postgres:비밀번호여기@db.pzxmcnnhkjotnejcckqa.supabase.co:5432/postgres"

# Google AI API (필수 - 나중에 설정)
# GOOGLE_API_KEY=your-google-ai-api-key-here

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ 중요:** 
- `비밀번호여기` 부분을 실제 비밀번호로 바꿔주세요!
- `.env` 파일은 절대 GitHub에 올리지 마세요! (이미 .gitignore에 포함되어 있습니다)

---

## 📦 3단계: 패키지 설치

터미널(명령 프롬프트)을 열고 프로젝트 폴더로 이동한 후:

```bash
npm install
```

이 명령어는 `package.json`에 있는 모든 필요한 라이브러리들을 다운로드합니다.
- Next.js (웹 프레임워크)
- React (UI 라이브러리)
- Prisma (데이터베이스 도구)
- TypeScript (타입 안전성)
- 등등...

**설명:**
- `npm` = Node Package Manager (Node.js 패키지 관리자)
- `install` = 설치 명령어
- 처음 실행하면 `node_modules` 폴더가 생성되고 필요한 파일들이 다운로드됩니다

---

## 🗄️ 4단계: 데이터베이스 연결 및 스키마 적용

데이터베이스에 테이블을 만들어야 합니다. Prisma가 자동으로 만들어줍니다!

```bash
npm run db:push
```

**설명:**
- `npm run` = package.json에 정의된 스크립트 실행
- `db:push` = Prisma 스키마를 데이터베이스에 적용
- 이 명령어를 실행하면 `prisma/schema.prisma` 파일을 읽어서 PostgreSQL에 테이블들을 자동으로 만듭니다!

**예상 결과:**
- User 테이블 생성
- Brand 테이블 생성
- DomainConfig 테이블 생성
- PlatformConfig 테이블 생성
- CatalogItem 테이블 생성
- Generation 테이블 생성

---

## 🎨 5단계: 개발 서버 실행

이제 웹사이트를 실행해볼 수 있습니다!

```bash
npm run dev
```

**설명:**
- `dev` = 개발 모드로 서버 실행
- 서버가 시작되면 터미널에 주소가 표시됩니다 (보통 http://localhost:3000)

**브라우저에서 확인:**
1. 브라우저를 열고 `http://localhost:3000` 접속
2. 바로올림 프로젝트가 실행되는 것을 확인할 수 있습니다!

**서버 중지:**
- 터미널에서 `Ctrl + C` (Windows) 또는 `Cmd + C` (Mac)를 누르면 서버가 중지됩니다

---

## 📚 주요 명령어 정리

### 개발 관련
```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드 (배포용)
npm run start        # 프로덕션 서버 실행
```

### 코드 품질
```bash
npm run lint         # 코드 오류 검사
npm run typecheck    # TypeScript 타입 체크
npm run format       # 코드 자동 포맷팅
```

### 데이터베이스
```bash
npm run db:push      # 스키마를 DB에 적용
npm run db:studio    # 데이터베이스 GUI 열기 (http://localhost:5555)
```

---

## 🏗️ 프로젝트 구조 간단 설명

```
baroolim_cursor/
├── app/              # Next.js 페이지들 (웹사이트 화면)
│   ├── page.tsx      # 메인 페이지
│   └── studio/       # 스튜디오 페이지
├── pages/            # API 라우트 (서버 기능)
│   └── api/          # API 엔드포인트
├── prisma/           # 데이터베이스 관련
│   └── schema.prisma # 데이터베이스 구조 정의
├── lib/              # 공통 함수들
├── types/            # TypeScript 타입 정의
└── package.json      # 프로젝트 설정 및 의존성
```

---

## ❓ 자주 묻는 질문 (FAQ)

### Q: "npm: command not found" 오류가 나요
**A:** Node.js가 설치되지 않았습니다. https://nodejs.org 에서 설치하세요!

### Q: 데이터베이스 연결 오류가 나요
**A:** 
1. `.env` 파일의 `DATABASE_URL`이 올바른지 확인
2. Supabase 데이터베이스가 실행 중인지 확인
3. 비밀번호가 정확한지 확인

### Q: "Module not found" 오류가 나요
**A:** `npm install`을 실행했는지 확인하세요!

### Q: Prisma Client 오류가 나요
**A:** 다음 명령어를 실행하세요:
```bash
npx prisma generate
```

---

## 🎯 다음 단계

기본 설정이 완료되었습니다! 이제:
1. ✅ 개발 서버가 실행되는지 확인
2. ✅ 데이터베이스 연결이 되는지 확인
3. ✅ AI 기능 추가 준비 완료!

문제가 있으면 언제든지 물어보세요! 😊

