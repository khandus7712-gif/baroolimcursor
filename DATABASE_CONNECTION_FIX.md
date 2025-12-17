# 🚨 데이터베이스 연결 오류 해결 가이드

## 현재 문제
```
FATAL: Tenant or user not found
```

Supabase 데이터베이스에 연결할 수 없습니다.

## ✅ 해결 방법

### 1단계: Supabase에서 DATABASE_URL 확인

1. https://supabase.com/ 접속
2. 프로젝트 선택
3. **Settings** (왼쪽 하단 톱니바퀴) → **Database**
4. **Connection string** 섹션
5. **URI** 탭 선택
6. **Mode: Transaction** 선택
7. ✅ **"Use connection pooling"** 체크
8. 표시된 문자열 복사:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres
   ```
9. `[YOUR-PASSWORD]` 부분을 실제 데이터베이스 비밀번호로 교체

### 2단계: .env 파일 수정

프로젝트 루트의 `.env` 파일을 열어서:

```env
DATABASE_URL="복사한_연결_문자열"
```

**중요**: 따옴표로 감싸야 합니다! (특수문자 때문)

### 3단계: 데이터베이스 스키마 적용

```bash
npx prisma generate
npx prisma db push
```

### 4단계: 서버 재시작

```bash
Ctrl + C
npm run dev
```

### 5단계: 다시 테스트

`http://localhost:3000/login` → 이메일 로그인 시도

---

## 🔍 비밀번호를 모르는 경우

Supabase에서 데이터베이스 비밀번호를 재설정:

1. Supabase → **Settings** → **Database**
2. **Database Password** 섹션
3. **Reset database password** 클릭
4. 새 비밀번호 생성
5. 새 비밀번호로 DATABASE_URL 업데이트

---

## 💡 또는 로컬 PostgreSQL 사용

Supabase 대신 로컬 PostgreSQL을 사용하려면:

1. PostgreSQL 설치
2. 데이터베이스 생성:
   ```sql
   CREATE DATABASE baroolim;
   ```
3. `.env` 파일:
   ```env
   DATABASE_URL="postgresql://postgres:비밀번호@localhost:5432/baroolim"
   ```
4. `npx prisma db push`

---

## 🚨 임시 해결책

OAuth 로그인은 데이터베이스가 필수입니다.
Credentials 로그인도 데이터베이스가 필요합니다.

**데이터베이스를 먼저 해결해야 앱을 사용할 수 있습니다!**














