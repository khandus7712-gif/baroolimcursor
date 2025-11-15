# ✅ 바로올림 최종 설정 체크리스트

**완료일**: 2025년 11월 15일  
**도메인**: https://baroolim.com

---

## 🎯 지금 바로 해야 할 작업 (즉시)

### 1. 패키지 설치 ⭐⭐⭐

```bash
# 프로젝트 디렉토리에서 실행
npm install @tosspayments/payment-sdk date-fns
```

### 2. 데이터베이스 마이그레이션 ⭐⭐⭐

```bash
# Prisma 스키마를 데이터베이스에 반영
npx prisma generate
npx prisma db push
```

**확인사항**:
- `Waitlist` 테이블이 생성되었는지 확인
- 기존 데이터에 문제가 없는지 확인

---

## 📅 월요일 (11월 18일) 작업

### 1. 토스페이먼츠 가맹점 신청 ⭐⭐⭐ (최우선!)

#### 준비물:
- [x] 사업자등록번호: 308-32-01281
- [x] 대표자: 이주연
- [x] 이메일: pernar.go@gmail.com
- [x] 전화: 010-5850-1255
- [ ] 정산 계좌 정보 (은행명, 계좌번호, 예금주)
- [ ] 사업자등록증 사본 (PDF)
- [ ] 통장 사본

#### 신청 절차:
1. [토스페이먼츠](https://www.tosspayments.com/) 접속
2. 우측 상단 "가맹점 신청" 클릭
3. 회원가입 후 정보 입력
4. 서류 업로드
5. 승인 대기 (1-2 영업일)

자세한 내용은 `TOSS_PAYMENTS_SETUP.md` 참조

### 2. Google OAuth 설정 완료 ⭐⭐

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. **사용자 인증 정보** → OAuth 클라이언트 ID 선택
3. **승인된 리디렉션 URI**에 추가:
   ```
   https://baroolim.com/api/auth/callback/google
   ```
4. **저장**

### 3. Kakao OAuth 설정 완료 ⭐⭐

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 애플리케이션 선택
3. **카카오 로그인** → **Redirect URI**에 추가:
   ```
   https://baroolim.com/api/auth/callback/kakao
   ```
4. **저장**

### 4. Vercel 환경 변수 설정 ⭐⭐

[Vercel Dashboard](https://vercel.com/dashboard) → 프로젝트 → Settings → Environment Variables

#### 추가할 환경 변수:

```
NEXTAUTH_URL=https://baroolim.com (Production)
GOOGLE_CLIENT_ID=[Google에서 발급받은 ID] (Production)
GOOGLE_CLIENT_SECRET=[Google에서 발급받은 Secret] (Production)
KAKAO_CLIENT_ID=[Kakao REST API 키] (Production)
KAKAO_CLIENT_SECRET=[Kakao Secret] (Production)
```

---

## 📅 토스페이먼츠 승인 후 (화/수요일)

### 5. 토스페이먼츠 API 키 설정 ⭐⭐⭐

승인 완료 후 [토스페이먼츠 대시보드](https://developers.tosspayments.com/)에서 API 키 확인

#### Vercel 환경 변수에 추가:

```
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_XXXXXXXXXX (Production)
TOSS_SECRET_KEY=live_sk_XXXXXXXXXX (Production)
```

⚠️ **주의**: `NEXT_PUBLIC_` 접두사는 클라이언트에서 사용하는 키입니다. 시크릿 키는 절대 `NEXT_PUBLIC_`을 붙이면 안 됩니다!

### 6. 결제 기능 테스트 ⭐⭐

1. https://baroolim.com/pricing 접속
2. PRO 플랜 선택
3. 테스트 카드로 결제 (소액 1,000원 테스트)
   ```
   카드번호: 4571-1111-1111-1111
   유효기간: 12/28
   CVC: 123
   비밀번호: 12
   ```
4. 결제 성공 확인
5. 마이페이지에서 플랜 업데이트 확인
6. 테스트 결제 환불

---

## 🧪 전체 기능 테스트

### 사전예약 시스템
- [ ] https://baroolim.com/waitlist 접속
- [ ] 이메일 입력 및 제출
- [ ] 성공 페이지 확인
- [ ] 관리자 대시보드에서 대기자 명단 확인

### OAuth 로그인
- [ ] https://baroolim.com/login 접속
- [ ] Google 로그인 테스트
- [ ] Kakao 로그인 테스트
- [ ] 로그인 후 `/studio`로 리다이렉트 확인

### 관리자 대시보드
- [ ] `/admin/dashboard` 접속
- [ ] 통계 확인
- [ ] 회원 목록 확인
- [ ] 사전예약 명단 확인
- [ ] 검색 기능 테스트

### 사용자 마이페이지
- [ ] `/mypage` 접속
- [ ] 프로필 정보 확인
- [ ] 플랜 및 사용량 확인
- [ ] 플랜 업그레이드 버튼 클릭 테스트

### 결제 시스템
- [ ] `/pricing` 접속
- [ ] BASIC 플랜 선택
- [ ] 결제 페이지로 이동
- [ ] 결제 정보 확인
- [ ] 테스트 결제 진행
- [ ] 성공 페이지 확인
- [ ] 마이페이지에서 플랜 확인

### 콘텐츠 생성 (기존 기능)
- [ ] `/studio` 접속
- [ ] 이미지 업로드
- [ ] 메모 입력
- [ ] 플랫폼 선택
- [ ] 콘텐츠 생성
- [ ] 결과 확인

---

## 📧 출시 준비

### 사전예약자 이메일 발송

**제목**: 🎉 바로올림 출시! 특별 혜택을 받으세요

**내용**:
```
안녕하세요, 바로올림입니다!

사전예약해주신 [고객명]님께 특별한 소식을 전합니다.

바로올림이 드디어 정식 출시되었습니다! 🎉

🎁 사전예약자 특별 혜택:
✅ 무료 생성권 10회 추가 (기본 5회 → 총 15회)
✅ 첫 달 30% 할인
✅ 1:1 온보딩 무료 지원

지금 바로 시작하기: https://baroolim.com/login

혜택은 11월 30일까지 유효합니다.

감사합니다.
바로올림 팀 드림

---
문의: pernar.go@gmail.com
전화: 010-5850-1255
```

---

## 📝 필요한 문서 업데이트

### 1. 개인정보처리방침 업데이트
- 결제 정보 수집 관련 내용 추가
- 토스페이먼츠 개인정보 처리 위탁 명시

### 2. 서비스 이용약관 업데이트
- 유료 구독 관련 조항 추가
- 환불 정책 참조 추가

### 3. 환불 정책 확인
- `/refund-policy` 페이지 확인 및 업데이트

---

## 🔐 보안 체크리스트

- [x] `.env.local` 파일이 `.gitignore`에 포함됨
- [x] API 시크릿 키는 환경 변수로만 관리
- [x] Vercel 환경 변수 설정됨
- [x] 결제 금액 검증 로직 포함됨
- [x] 토스페이먼츠 API 호출 시 인증 포함됨
- [ ] HTTPS 사용 (Vercel 자동 제공)

---

## 📊 모니터링

### 확인할 지표
1. **가입 전환율**: 사전예약 → 실제 가입
2. **결제 전환율**: 무료 → 유료 전환
3. **일일 콘텐츠 생성 수**
4. **플랜별 사용자 분포**
5. **이탈 지점 분석**

### 도구
- Vercel Analytics (기본 제공)
- Google Analytics (추가 설치 권장)
- 토스페이먼츠 대시보드 (결제 통계)
- 관리자 대시보드 (내부 통계)

---

## 🚨 문제 발생 시 대응

### OAuth 로그인 실패
1. Vercel 로그 확인: Deployments → Function Logs
2. 브라우저 콘솔 확인 (F12)
3. Redirect URI 재확인
4. 환경 변수 재확인

### 결제 실패
1. 토스페이먼츠 대시보드 확인
2. Vercel Function Logs 확인
3. 사용자에게 고객센터 안내
4. 수동 처리 후 환불 진행

### 데이터베이스 오류
1. Vercel 로그 확인
2. DATABASE_URL 환경 변수 확인
3. Prisma 스키마 재확인
4. 마이그레이션 재실행

---

## 📞 지원 연락처

### 토스페이먼츠
- 이메일: support@tosspayments.com
- 전화: 1544-7772
- 운영시간: 평일 10:00-18:00

### Google Cloud
- [지원 센터](https://support.google.com/cloud)

### Kakao Developers
- [개발자 포럼](https://devtalk.kakao.com/)

### Vercel
- [헬프 센터](https://vercel.com/help)

---

## 🎉 완료 후 확인사항

모든 체크리스트 항목이 완료되면:

1. ✅ OAuth 로그인 정상 작동
2. ✅ 사전예약 시스템 작동
3. ✅ 결제 시스템 작동
4. ✅ 관리자 대시보드 접근 가능
5. ✅ 콘텐츠 생성 기능 정상 작동

**축하합니다! 바로올림이 정식 오픈되었습니다! 🎊**

---

## 📈 다음 단계 (출시 후)

1. 사용자 피드백 수집
2. 버그 모니터링 및 수정
3. 성능 최적화
4. 추가 기능 개발
   - 분석 리포트
   - 이메일 알림
   - 모바일 앱
5. 마케팅 시작

**화이팅! 💪**

