# 토스페이먼츠 테스트 키 발급 가이드

## 단계별 가이드

### 1단계: 토스페이먼츠 개발자센터 접속

1. 브라우저에서 [https://developers.tosspayments.com/](https://developers.tosspayments.com/) 접속
2. 우측 상단 "로그인" 클릭

### 2단계: 로그인

- 토스페이먼츠 계정이 있으면 로그인
- 없으면 "회원가입" → 이메일 인증 후 가입

### 3단계: 내 상점 메뉴 접속

1. 로그인 후 상단 메뉴에서 **"내 상점"** 클릭
2. 또는 [https://dashboard.tosspayments.com/](https://dashboard.tosspayments.com/) 직접 접속

### 4단계: 개발용 API 키 확인

1. 좌측 메뉴에서 **"개발"** 또는 **"개발용 API 키"** 클릭
2. 또는 상점 설정 → API 키 메뉴

### 5단계: 테스트 키 복사

다음 두 가지 키를 복사하세요:

1. **클라이언트 키 (Client Key)**
   - 형식: `test_ck_XXXXXXXXXX`
   - 예시: `test_ck_DocsXaE2N8Q5L1gO1J0lw47qy7o`

2. **시크릿 키 (Secret Key)**
   - 형식: `test_sk_XXXXXXXXXX`
   - 예시: `test_sk_DocsXaE2N8Q5L1gO1J0lw47qy7o`

⚠️ **주의**: 시크릿 키는 한 번만 표시될 수 있으니 반드시 복사해두세요!

---

## 환경 변수 설정

### 로컬 개발 환경 (`.env.local`)

프로젝트 루트에 `.env.local` 파일을 만들고 다음 내용 추가:

```env
# 토스페이먼츠 테스트 모드
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_여기에_복사한_클라이언트_키_붙여넣기
TOSS_SECRET_KEY=test_sk_여기에_복사한_시크릿_키_붙여넣기
```

### Vercel 배포 환경

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. 프로젝트 선택 → Settings → Environment Variables
3. 다음 변수 추가:
   - `NEXT_PUBLIC_TOSS_CLIENT_KEY` = `test_ck_...`
   - `TOSS_SECRET_KEY` = `test_sk_...`
4. Environment: Development 선택 (테스트용이므로)
5. Save 클릭

---

## 테스트 카드 번호

테스트 모드에서는 다음 카드 번호를 사용하세요:

### 성공 테스트 카드
- **카드번호**: `4111 1111 1111 1111`
- **유효기간**: `12/34` (미래 날짜면 됨)
- **CVC**: `123`
- **비밀번호**: `123456` (간편결제 시)

### 실패 테스트 카드 (테스트용)
- **카드번호**: `4000 0000 0000 0002`
- 유효기간, CVC는 위와 동일

---

## 테스트 결제 진행 방법

### 1. 로컬에서 테스트

```bash
# .env.local 파일에 테스트 키 추가 후
npm run dev
```

브라우저에서:
1. `http://localhost:3000/payment?plan=BASIC` 접속
2. 플랜 선택 → "결제하기" 클릭
3. 토스페이먼츠 결제창에서 테스트 카드 입력
4. 결제 완료까지 진행
5. 각 단계 스크린샷

### 2. 배포 환경에서 테스트

1. Vercel에 테스트 키 배포
2. `https://baroolim.com/payment?plan=BASIC` 접속
3. 위와 동일하게 테스트 결제 진행

---

## 문제 해결

### Q: "개발용 API 키" 메뉴가 안 보여요
A: 
- 상점이 아직 승인되지 않았을 수 있습니다
- 토스페이먼츠 고객센터에 문의하세요

### Q: 테스트 키가 없어요
A:
- 토스페이먼츠 계정을 만들면 자동으로 테스트 키가 제공됩니다
- 실제 결제 승인 전까지는 테스트 키만 사용 가능합니다

### Q: 결제창이 안 열려요
A:
- `NEXT_PUBLIC_TOSS_CLIENT_KEY`가 올바르게 설정되었는지 확인
- 브라우저 콘솔(F12)에서 에러 메시지 확인
- 키가 `test_ck_`로 시작하는지 확인

### Q: 결제가 실패해요
A:
- 테스트 카드 번호가 올바른지 확인 (`4111 1111 1111 1111`)
- 유효기간을 미래 날짜로 설정
- `TOSS_SECRET_KEY`도 올바르게 설정되었는지 확인

---

## 다음 단계

테스트 키를 발급받고 환경 변수를 설정한 후:

1. ✅ 로컬에서 테스트 결제 진행
2. ✅ 각 단계 스크린샷
3. ✅ PPT 파일 제작
4. ✅ 토스페이먼츠에 제출

---

## 참고 링크

- [토스페이먼츠 개발자센터](https://developers.tosspayments.com/)
- [토스페이먼츠 대시보드](https://dashboard.tosspayments.com/)
- [토스페이먼츠 테스트 모드 문서](https://docs.tosspayments.com/guides/test-mode)

