# 로컬 개발 환경 데이터베이스 설정 가이드

## 문제: 이메일 로그인이 안 되는 경우

이메일 로그인이 안 되는 가장 흔한 원인은 **데이터베이스 연결이 안 되는 것**입니다.

## 해결 방법

### 1. DATABASE_URL 확인

`.env.local` 파일에 `DATABASE_URL`이 있어야 합니다:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

### 2. Supabase 사용하는 경우

1. [Supabase](https://supabase.com/) 접속
2. 프로젝트 선택
3. 좌측 메뉴 → "Settings" → "Database"
4. "Connection string" 섹션에서 "URI" 복사
5. 형식: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

`.env.local`에 추가:
```env
DATABASE_URL=postgresql://postgres:비밀번호@db.xxxxx.supabase.co:5432/postgres
```

### 3. 로컬 PostgreSQL 사용하는 경우

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/baroolim
```

### 4. 데이터베이스 스키마 적용

DATABASE_URL을 설정한 후:

```bash
npx prisma db push
```

이 명령어는 데이터베이스에 테이블을 생성합니다.

### 5. 서버 재시작

```bash
npm run dev
```

---

## 빠른 체크리스트

- [ ] `.env.local`에 `DATABASE_URL`이 있음
- [ ] `DATABASE_URL` 형식이 올바름 (`postgresql://...`)
- [ ] `npx prisma db push` 실행 완료
- [ ] 서버를 재시작함
- [ ] 이메일 로그인 다시 시도

---

## 에러 메시지 확인

서버를 실행한 터미널에서 에러 메시지를 확인하세요:

### "Can't reach database server"
- DATABASE_URL이 잘못되었거나 데이터베이스 서버에 접근할 수 없음
- Supabase의 경우 방화벽 설정 확인

### "P1001: Can't reach database server"
- 네트워크 연결 문제
- DATABASE_URL 확인

### "P1003: Database does not exist"
- 데이터베이스 이름이 잘못됨
- DATABASE_URL의 데이터베이스 이름 확인

---

## 테스트 방법

1. `npx prisma db push` 실행
2. 성공하면 "Your database is now in sync" 메시지 확인
3. `http://localhost:3000/login` 접속
4. 이메일 입력 후 "이메일로 시작하기" 클릭
5. 정상 작동 확인

