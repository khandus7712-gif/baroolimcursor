# E2E 테스트 가이드

## 설치

```bash
# Playwright 브라우저 설치 (최초 1회)
npx playwright install
```

## 테스트 실행

```bash
# 모든 테스트 실행
npm run test:e2e

# UI 모드로 실행 (테스트 실행 과정 시각화)
npm run test:e2e:ui

# 헤드 모드로 실행 (브라우저 표시)
npm run test:e2e:headed

# 특정 테스트 파일만 실행
npx playwright test e2e/onboarding-studio.spec.ts

# 특정 테스트만 실행
npx playwright test e2e/onboarding-studio.spec.ts -g "온보딩"
```

## 테스트 시나리오

### 1. 온보딩 → 스튜디오 흐름 테스트

- 온보딩 페이지에서 업종 선택 (beauty)
- KPI 선택 (예약 전환율)
- 저장 버튼 클릭
- 스튜디오 페이지로 이동 확인
- 메모 입력 ("여드름 피부 진정 케어")
- 콘텐츠 생성
- 결과 확인

### 2. 금칙어 필터링 테스트

- 스튜디오에서 치료 관련 메모 입력
- 콘텐츠 생성
- 금칙어 관련 경고 표시 확인
- 금칙어가 자동으로 필터링되었는지 확인

### 3. Instagram 해시태그 테스트

- Instagram 플랫폼 선택
- 해시태그 플러그인 활성화
- 콘텐츠 생성
- 해시태그 개수 확인 (10개 이하)
- 출력 포맷 확인 (hook → body → CTA → hashtags)

## 테스트 전제 조건

1. 개발 서버가 실행 중이어야 함 (`npm run dev`)
2. 데이터베이스가 설정되어 있어야 함
3. Google AI API 키가 설정되어 있어야 함
4. 환경 변수가 올바르게 설정되어 있어야 함

## 문제 해결

### 테스트가 실패하는 경우

1. 개발 서버가 실행 중인지 확인
2. 브라우저가 설치되어 있는지 확인 (`npx playwright install`)
3. 환경 변수가 올바르게 설정되어 있는지 확인
4. 네트워크 연결 상태 확인
5. API 응답 시간이 너무 오래 걸리는 경우 타임아웃 조정

### 타임아웃 오류

테스트에서 타임아웃이 발생하는 경우 `playwright.config.ts`에서 타임아웃 값을 조정할 수 있습니다:

```typescript
timeout: 60 * 1000, // 60초로 증가
```

### 선택자 오류

페이지 구조가 변경된 경우 테스트의 선택자를 업데이트해야 합니다. Playwright의 테스트 레코더를 사용하여 새로운 선택자를 생성할 수 있습니다:

```bash
npx playwright codegen http://localhost:3000
```

