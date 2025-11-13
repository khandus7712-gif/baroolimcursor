# 🎯 바로올림 프로젝트 설정 - 단계별 가이드

## 현재 상태 확인 ✅

- ✅ Next.js 프로젝트 준비됨
- ✅ TypeScript 설정 완료
- ✅ Prisma가 PostgreSQL로 설정됨
- ❌ **.env 파일이 없음** ← 이게 문제입니다!

---

## 📝 1단계: .env 파일 만들기 (가장 중요!)

### 방법 1: VS Code나 에디터에서 만들기

1. **프로젝트 폴더 열기**
   - `C:\Users\khan2\Desktop\baroolim_cursor` 폴더를 VS Code나 메모장으로 엽니다

2. **새 파일 만들기**
   - VS Code: 왼쪽 상단 "새 파일" 버튼 클릭
   - 메모장: 새 파일 만들기

3. **파일 이름 저장**
   - 파일 이름: `.env` (정확히 이렇게!)
   - 확장자 없이 `.env`만 입력
   - 저장 위치: 프로젝트 루트 폴더 (`baroolim_cursor` 폴더 바로 안)

4. **내용 입력**
   아래 내용을 복사해서 붙여넣으세요:

```env
DATABASE_URL="postgresql://postgres:비밀번호여기@db.pzxmcnnhkjotnejcckqa.supabase.co:5432/postgres"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ 중요:**
- `비밀번호여기` 부분을 **실제 Supabase 비밀번호**로 바꿔주세요!
- 따옴표(`"`)는 그대로 유지하세요
- 파일 이름 앞에 점(.)이 있어야 합니다: `.env` (숨김 파일)

### 방법 2: 터미널에서 만들기

PowerShell이나 명령 프롬프트를 열고:

```powershell
cd C:\Users\khan2\Desktop\baroolim_cursor
```

그 다음 아래 명령어를 실행하세요:

```powershell
@"
DATABASE_URL="postgresql://postgres:비밀번호여기@db.pzxmcnnhkjotnejcckqa.supabase.co:5432/postgres"
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@ | Out-File -FilePath .env -Encoding utf8
```

**⚠️ 여기서도 `비밀번호여기`를 실제 비밀번호로 바꿔주세요!**

---

## 📦 2단계: 패키지 설치 확인

터미널(PowerShell)을 열고 프로젝트 폴더로 이동:

```powershell
cd C:\Users\khan2\Desktop\baroolim_cursor
```

패키지가 설치되어 있는지 확인:

```powershell
npm install
```

**설명:**
- 이미 `node_modules` 폴더가 있으면 빠르게 완료됩니다
- 없으면 다운로드가 시작됩니다 (시간이 좀 걸릴 수 있어요)

**예상 결과:**
```
added 500 packages, and audited 501 packages in 2m
```

---

## 🗄️ 3단계: Prisma Client 생성

Prisma가 데이터베이스와 대화할 수 있도록 코드를 생성합니다:

```powershell
npx prisma generate
```

**설명:**
- `npx` = Node.js 패키지 실행 도구
- `prisma generate` = Prisma Client 코드 생성
- 이 명령어는 데이터베이스 구조에 맞는 TypeScript 코드를 자동으로 만들어줍니다

**예상 결과:**
```
✔ Generated Prisma Client (5.19.1) to .\node_modules\@prisma\client in 2.5s
```

---

## 🔌 4단계: 데이터베이스 연결 테스트

이제 실제로 데이터베이스에 연결해서 테이블을 만들어봅시다:

```powershell
npm run db:push
```

**설명:**
- `db:push` = 데이터베이스에 스키마(테이블 구조)를 적용
- `prisma/schema.prisma` 파일을 읽어서 PostgreSQL에 테이블들을 만듭니다

**성공하면:**
```
✔ Your database is now in sync with your Prisma schema.
```

**실패하면 (오류 예시):**
```
Error: Can't reach database server
```
→ `.env` 파일의 `DATABASE_URL`이 잘못되었거나 데이터베이스 서버가 꺼져있을 수 있습니다

---

## 🚀 5단계: 개발 서버 실행

모든 설정이 완료되었으면 웹사이트를 실행해봅시다:

```powershell
npm run dev
```

**설명:**
- `dev` = 개발 모드로 서버 실행
- 서버가 시작되면 터미널에 주소가 표시됩니다

**예상 결과:**
```
  ▲ Next.js 14.2.5
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

**브라우저에서 확인:**
1. 브라우저 열기 (Chrome, Edge 등)
2. 주소창에 `http://localhost:3000` 입력
3. 바로올림 프로젝트가 보이면 성공! 🎉

**서버 중지:**
- 터미널에서 `Ctrl + C` 누르기

---

## ❌ 문제 해결 (Troubleshooting)

### 문제 1: "DATABASE_URL is not set" 오류

**원인:** `.env` 파일이 없거나 잘못된 위치에 있음

**해결:**
1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. 파일 이름이 정확히 `.env`인지 확인 (`.env.txt` 아님!)
3. 파일 내용에 `DATABASE_URL=`이 있는지 확인

### 문제 2: "Can't reach database server" 오류

**원인:** 데이터베이스 연결 정보가 잘못됨

**해결:**
1. `.env` 파일의 `DATABASE_URL` 확인
2. 비밀번호가 정확한지 확인
3. Supabase 데이터베이스가 실행 중인지 확인

### 문제 3: "Module not found" 오류

**원인:** 패키지가 설치되지 않음

**해결:**
```powershell
npm install
```

### 문제 4: "Prisma Client has not been generated" 오류

**원인:** Prisma Client가 생성되지 않음

**해결:**
```powershell
npx prisma generate
```

### 문제 5: 포트 3000이 이미 사용 중

**원인:** 다른 프로그램이 3000번 포트를 사용 중

**해결:**
- 다른 터미널에서 실행 중인 `npm run dev`를 중지하거나
- 다른 포트 사용: `npm run dev -- -p 3001`

---

## ✅ 체크리스트

설정이 완료되었는지 확인해보세요:

- [ ] `.env` 파일이 프로젝트 루트에 있음
- [ ] `.env` 파일에 `DATABASE_URL`이 올바르게 설정됨
- [ ] `npm install` 실행 완료
- [ ] `npx prisma generate` 실행 완료
- [ ] `npm run db:push` 실행 성공
- [ ] `npm run dev` 실행 후 브라우저에서 접속 가능

---

## 🎯 다음 단계

모든 설정이 완료되면:
1. ✅ 개발 서버가 정상적으로 실행됨
2. ✅ 데이터베이스 연결 확인됨
3. ✅ AI 기능 추가 준비 완료!

문제가 있으면 터미널의 오류 메시지를 복사해서 알려주세요! 😊

