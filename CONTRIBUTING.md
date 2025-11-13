# 기여 가이드 🤝

바로올림 프로젝트에 기여해 주셔서 감사합니다!

---

## 기여 방법

### 1. 이슈 제기

버그 발견이나 기능 제안:
- GitHub Issues에 새 이슈 생성
- 명확한 제목과 설명
- 재현 단계 (버그인 경우)
- 스크린샷 (있으면 좋음)

### 2. Pull Request

1. **Fork** 저장소
2. **Branch** 생성
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **변경사항** 커밋
   ```bash
   git commit -m 'Add: 멋진 기능 추가'
   ```
4. **Push** to Branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Pull Request** 생성

---

## 커밋 메시지 규칙

### 형식
```
타입: 간단한 설명

자세한 설명 (선택사항)
```

### 타입
- `Add`: 새 기능 추가
- `Fix`: 버그 수정
- `Update`: 기존 기능 수정
- `Remove`: 기능 제거
- `Refactor`: 코드 리팩토링
- `Style`: 코드 스타일 변경
- `Docs`: 문서 수정
- `Test`: 테스트 추가/수정

### 예시
```
Add: Instagram 스토리 포맷 지원

- 세로 형식 콘텐츠 생성
- 15초 제한 텍스트 최적화
```

---

## 코드 스타일

### TypeScript
- 명확한 타입 정의
- `any` 사용 최소화
- Interface 사용 권장

### React
- 함수형 컴포넌트 사용
- Hooks 활용
- Props 타입 정의

### 네이밍
- 변수/함수: camelCase
- 컴포넌트: PascalCase
- 상수: UPPER_SNAKE_CASE
- 파일: kebab-case 또는 PascalCase (컴포넌트)

---

## 테스트

변경사항에 대한 테스트:
```bash
npm run typecheck  # TypeScript 체크
npm run lint       # ESLint 검사
npm run test:e2e   # E2E 테스트 (선택)
```

---

## 개발 환경

### 필수 도구
- Node.js 18+
- npm 9+
- Git

### 권장 도구
- VS Code
- Prettier
- ESLint extension

---

## 프로젝트 구조

```
baroolim_cursor/
├── app/              # Next.js 페이지
├── pages/api/        # API 라우트
├── lib/              # 유틸리티 함수
├── types/            # TypeScript 타입
├── plugins/          # 플러그인 시스템
├── profiles/         # 도메인/플랫폼 프로필
└── prisma/           # 데이터베이스 스키마
```

---

## 기여 아이디어

### 쉬운 작업
- 오타 수정
- 문서 개선
- 번역 추가
- 예제 추가

### 중간 난이도
- 새로운 플랫폼 추가
- 플러그인 개발
- UI 개선
- 성능 최적화

### 어려운 작업
- 새로운 AI 모델 통합
- 실시간 협업 기능
- 분석 대시보드
- 다국어 지원

---

## 질문이 있으면

- GitHub Discussions
- Issues에 질문 태그
- 이메일 (있는 경우)

---

## 행동 강령

- 존중하는 태도
- 건설적인 피드백
- 포용적인 환경
- 협력적인 자세

---

**모든 기여에 감사드립니다!** 🙏

