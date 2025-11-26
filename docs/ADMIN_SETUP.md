# 관리자 계정 설정 가이드

## 관리자 계정 설정 방법

관리자 대시보드에 접근하려면 먼저 관리자 권한을 설정해야 합니다.

### 방법 1: 스크립트 사용 (권장)

1. 먼저 해당 이메일로 회원가입을 완료하세요.

2. 터미널에서 다음 명령어 실행:

```bash
npx tsx scripts/set-admin.ts your-email@example.com
```

예시:
```bash
npx tsx scripts/set-admin.ts pernar.go@gmail.com
```

### 방법 2: API 사용

1. 환경 변수에 `ADMIN_SECRET` 설정 (`.env` 파일):

```env
ADMIN_SECRET=your-secret-key-here
```

2. API 호출:

```bash
curl -X POST https://baroolim.com/api/admin/set-admin \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: your-secret-key-here" \
  -d '{"email": "your-email@example.com"}'
```

### 방법 3: 데이터베이스 직접 수정

Prisma Studio 사용:

```bash
npx prisma studio
```

1. `User` 테이블에서 해당 사용자 찾기
2. `role` 필드를 `USER`에서 `ADMIN`으로 변경
3. 저장

또는 SQL 직접 실행:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## 관리자 대시보드 접속

설정 완료 후:

1. 로그인: https://baroolim.com/login
2. 관리자 대시보드: https://baroolim.com/admin/dashboard

## 확인 가능한 정보

- **회원 관리**: 전체 회원 목록, 플랜, 생성 횟수
- **결제 내역**: 모든 결제 내역, 주문번호, 금액, 상태
- **사전예약**: 사전예약 신청자 목록
- **통계**: 총 회원 수, 오늘 가입자, 이번 달 매출

## 주의사항

- 관리자 권한은 민감한 정보에 접근할 수 있으므로 신중하게 설정하세요.
- `ADMIN_SECRET`은 절대 공개 저장소에 커밋하지 마세요.
- 프로덕션 환경에서는 반드시 `ADMIN_SECRET`을 설정하세요.


