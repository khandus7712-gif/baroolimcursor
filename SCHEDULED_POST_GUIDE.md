# 📅 예약 발행 기능 가이드

## 🎯 기능 개요

바로올림의 예약 발행 기능을 사용하면:
- ✅ 콘텐츠를 미리 생성하고 발행 시간 예약
- ✅ 예약 시간에 알림 수신
- ✅ 원클릭으로 각 플랫폼에 복사/붙여넣기
- ✅ 주말에 한 번에 한 주 콘텐츠 준비 가능

---

## 🚀 사용 방법

### 1단계: 콘텐츠 생성
1. `/studio` 페이지에서 평소처럼 콘텐츠 생성
2. 생성 완료 후 "예약 발행하기" 버튼 클릭

### 2단계: 예약 설정
1. 발행 날짜와 시간 선택
2. 알림 받을 시간 설정 (기본 10분 전)
3. 메모 작성 (선택사항)
4. "예약하기" 버튼 클릭

### 3단계: 예약 관리
1. `/scheduled` 페이지에서 예약 목록 확인
2. 날짜별로 정리된 예약들 확인
3. 필요시 수정/삭제 가능

### 4단계: 발행 시간
1. 예약 시간에 알림 수신 (이메일)
2. 알림의 링크 클릭하여 발행 페이지로 이동
3. 각 플랫폼별로 "복사하기" 버튼 클릭
4. 해당 플랫폼 앱에서 붙여넣기
5. 모든 플랫폼 발행 후 "발행 완료" 버튼 클릭

---

## 🔔 알림 시스템

### 현재 지원 (v1.0)
- ✅ **이메일 알림**: 예약 시간 X분 전에 이메일 발송

### 준비 중
- ⚠️ **카카오톡 알림**: 카카오톡 알림톡으로 발송
- ⚠️ **브라우저 푸시**: 웹 푸시 알림

---

## ⚙️ 기술 구현

### Cron Job (Vercel)
```json
{
  "crons": [
    {
      "path": "/api/scheduled-posts/check-notifications",
      "schedule": "* * * * *"
    }
  ]
}
```

- **주기**: 1분마다 실행
- **역할**: 알림을 보내야 하는 예약 확인 및 알림 발송

### API 엔드포인트
1. `POST /api/scheduled-posts/create` - 예약 생성
2. `GET /api/scheduled-posts/list` - 예약 목록 조회
3. `PUT /api/scheduled-posts/[id]/update` - 예약 수정
4. `DELETE /api/scheduled-posts/[id]/delete` - 예약 취소
5. `POST /api/scheduled-posts/[id]/publish` - 즉시 발행
6. `GET /api/scheduled-posts/check-notifications` - Cron Job용 알림 체크

### 데이터베이스 스키마
```prisma
model ScheduledPost {
  id           String   @id @default(cuid())
  userId       String
  domainId     String
  platformIds  String[]
  content      Json
  imageUrl     String?
  scheduledFor DateTime
  status       ScheduledPostStatus @default(PENDING)
  memo         String?
  notifyBefore Int @default(10)
  notifiedAt   DateTime?
  publishedAt  DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum ScheduledPostStatus {
  PENDING    // 대기 중
  NOTIFIED   // 알림 발송됨
  PUBLISHED  // 발행 완료
  CANCELLED  // 취소됨
}
```

---

## 🧪 로컬 테스트

### 1. Cron Job 테스트 (수동)
```bash
# 브라우저나 curl로 직접 호출
curl http://localhost:3000/api/scheduled-posts/check-notifications
```

### 2. 예약 생성 테스트
1. 개발 서버 실행: `npm run dev`
2. `/studio`로 이동
3. 콘텐츠 생성 후 "예약 발행하기" 클릭
4. 1-2분 후로 예약 설정
5. `/scheduled`에서 확인

### 3. 알림 테스트
1. 예약 시간 1-2분 전으로 설정
2. 매 분마다 check-notifications API 수동 호출
3. 상태가 PENDING → NOTIFIED로 변경되는지 확인

---

## 📱 모바일 최적화

- 알림 링크를 모바일에서 클릭하면 모바일 최적화 페이지로 이동
- 큰 터치 버튼 (최소 56px)
- 원터치 복사 기능
- 각 플랫폼 앱으로 바로 전환 가능

---

## 🎯 다음 단계 (v2.0)

1. **카카오톡 알림 연동**
   - 카카오톡 비즈니스 API 연동
   - 알림톡 템플릿 승인
   - 발송 로직 구현

2. **자동 발행 (완전 자동화)**
   - Instagram Graph API 연동
   - Google My Business API 연동
   - 자동 포스팅 기능

3. **예약 캘린더 뷰**
   - 월간 캘린더 UI
   - 드래그앤드롭으로 일정 변경
   - 반복 예약 기능

4. **팀 협업 기능**
   - 여러 사용자가 함께 관리
   - 승인 워크플로우
   - 권한 관리

---

## ❓ FAQ

### Q1: 예약 시간을 놓치면?
A: 알림은 놓쳤지만 `/scheduled` 페이지에서 언제든지 발행 가능합니다.

### Q2: 예약을 취소하려면?
A: `/scheduled` 페이지에서 해당 예약의 "취소" 버튼을 클릭하세요.

### Q3: 예약 시간을 수정하려면?
A: 현재는 취소 후 재생성 필요 (v2.0에서 수정 기능 추가 예정)

### Q4: 여러 플랫폼을 한 번에 예약?
A: 네! 생성 시 선택한 모든 플랫폼이 한 번에 예약됩니다.

### Q5: 이메일이 안 와요
A: 현재 알림 시스템은 준비 중입니다. `/scheduled` 페이지를 직접 확인해주세요.

---

## 📞 지원

문의사항이 있으시면:
- 이메일: support@baroolim.com
- 카카오톡: @바로올림

---

**© 2024 바로올림 | Made with ❤️ by 퍼나르**




