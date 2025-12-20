# 🚨 Supabase 데이터베이스 연결 오류 해결 가이드

## 🔴 현재 오류
```
Can't reach database server at `aws-1-ap-northeast-2.pooler.supabase.com:6543`
```

Supabase 데이터베이스 서버에 연결할 수 없습니다.

---

## ✅ 해결 방법 (순서대로 진행)

### 1단계: Supabase 프로젝트 상태 확인

1. **Supabase 대시보드 접속**
   - https://supabase.com/ 접속
   - 로그인 후 프로젝트 선택

2. **프로젝트 상태 확인**
   - 프로젝트가 **일시 중지**되었는지 확인
   - 프로젝트가 **삭제**되었는지 확인
   - 프로젝트가 **비활성화**되었는지 확인

3. **프로젝트가 일시 중지된 경우**
   - 프로젝트를 **재개(Resume)** 해야 합니다
   - 무료 플랜의 경우 일정 기간 비활성 시 자동으로 일시 중지됩니다

---

### 2단계: DATABASE_URL 확인 및 업데이트

#### Supabase에서 DATABASE_URL 복사

1. **Supabase 대시보드** → 프로젝트 선택
2. 왼쪽 메뉴: **Settings** (톱니바퀴 아이콘) → **Database**
3. **Connection string** 섹션 찾기
4. **URI** 탭 선택
5. **Mode: Transaction** 선택
6. ✅ **"Use connection pooling"** 체크
7. 표시된 연결 문자열 복사

**예시:**
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**⚠️ 중요:**
- `[YOUR-PASSWORD]` 부분을 실제 데이터베이스 비밀번호로 교체해야 합니다
- 비밀번호를 모르면 다음 단계로 진행

---

### 3단계: 데이터베이스 비밀번호 확인/재설정

#### 비밀번호를 모르는 경우

1. **Supabase 대시보드** → **Settings** → **Database**
2. **Database Password** 섹션 찾기
3. **Reset database password** 버튼 클릭
4. 새 비밀번호 생성 (복사해두세요!)
5. 새 비밀번호로 DATABASE_URL 업데이트

**비밀번호를 URL에 인코딩해야 할 수도 있습니다:**
- 특수문자가 있으면 URL 인코딩 필요
- 예: `@` → `%40`, `#` → `%23`, `&` → `%26`

---

### 4단계: Vercel 환경 변수 업데이트

1. **Vercel 대시보드** 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables**
4. `DATABASE_URL` 찾기
5. **Edit** 클릭
6. 새로 복사한 DATABASE_URL 붙여넣기
7. **Save** 클릭

**⚠️ 중요:**
- Production, Preview, Development 모두에 업데이트
- 또는 **Apply to all environments** 선택

---

### 5단계: Vercel 재배포 (필수!)

**⚠️ 중요**: 환경 변수를 변경한 후 **반드시 재배포**해야 합니다!

1. Vercel 대시보드 → 프로젝트
2. **Deployments** 탭 클릭
3. 최신 배포의 **"..."** 메뉴 클릭
4. **Redeploy** 클릭
5. 배포가 완료될 때까지 대기 (약 2-3분)

---

### 6단계: 테스트

1. 브라우저에서 https://baroolim.com 접속
2. 로그인 시도
3. 오류가 사라졌는지 확인

---

## 🔍 추가 확인 사항

### Supabase 프로젝트가 삭제된 경우

1. **새 프로젝트 생성**
   - Supabase 대시보드 → **New Project**
   - 프로젝트 이름, 데이터베이스 비밀번호 설정
   - 리전 선택 (ap-northeast-2 권장)

2. **DATABASE_URL 복사**
   - 새 프로젝트의 Settings → Database
   - Connection string 복사

3. **스키마 적용**
   - Vercel에 새 DATABASE_URL 설정
   - 재배포 후 로컬에서 스키마 적용:
     ```powershell
     $env:DATABASE_URL="새로운_DATABASE_URL"; npx prisma db push
     ```

---

### 네트워크 문제인 경우

1. **다른 네트워크에서 테스트**
   - 모바일 데이터로 테스트
   - 다른 Wi-Fi 네트워크로 테스트

2. **Supabase 상태 확인**
   - https://status.supabase.com/ 접속
   - 서비스 상태 확인

---

## 📋 체크리스트

- [ ] Supabase 프로젝트가 활성화되어 있나요?
- [ ] Supabase에서 DATABASE_URL을 복사했나요?
- [ ] 데이터베이스 비밀번호를 확인/재설정했나요?
- [ ] DATABASE_URL에 비밀번호가 올바르게 포함되어 있나요?
- [ ] Vercel에 DATABASE_URL을 업데이트했나요?
- [ ] Vercel 재배포를 완료했나요?
- [ ] 테스트 후 오류가 해결되었나요?

---

## 🆘 여전히 안 되면?

### 1. Supabase 지원팀에 문의
- Supabase 대시보드 → **Support** 또는 **Help**
- 프로젝트 ID와 오류 메시지 함께 전달

### 2. Vercel 로그 확인
- Vercel 대시보드 → **Deployments** → 최신 배포 → **Runtime Logs**
- 데이터베이스 연결 관련 오류 메시지 확인

### 3. Supabase SQL Editor 테스트
- Supabase 대시보드 → **SQL Editor**
- 간단한 쿼리 실행:
  ```sql
  SELECT 1;
  ```
- 작동하면 데이터베이스는 정상, 연결 문자열 문제일 가능성

---

## 💡 참고사항

- Supabase 무료 플랜은 일정 기간 비활성 시 자동으로 일시 중지됩니다
- 프로젝트를 재개하면 몇 분 후에 다시 사용 가능합니다
- DATABASE_URL은 프로젝트마다 고유합니다
- 비밀번호는 URL 인코딩이 필요할 수 있습니다

---

## ⏱️ 예상 소요 시간

- Supabase 프로젝트 확인: 2분
- DATABASE_URL 복사: 2분
- 비밀번호 재설정 (필요시): 2분
- Vercel 환경 변수 업데이트: 2분
- Vercel 재배포: 3분
- 테스트: 2분

**총 예상 시간: 약 15분**











