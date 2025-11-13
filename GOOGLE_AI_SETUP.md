# Google AI API 설정 가이드

바로올림은 Google Gemini AI를 사용하여 콘텐츠를 생성합니다. AI 기능을 사용하려면 Google AI API 키가 필요합니다.

---

## 1단계: Google AI Studio 접속

https://aistudio.google.com/app/apikey

구글 계정으로 로그인하세요.

---

## 2단계: API 키 생성

1. **"Create API Key" 버튼 클릭**
2. **Google Cloud 프로젝트 선택 또는 생성**
   - 기존 프로젝트가 있으면 선택
   - 없으면 "Create API key in new project" 선택
3. **API 키 복사**
   - 생성된 API 키를 안전한 곳에 저장

---

## 3단계: 환경 변수 설정

### 로컬 개발 환경

프로젝트 루트의 `.env` 파일에 추가:

```env
GOOGLE_API_KEY=your-actual-api-key-here
```

**주의:** 실제 API 키로 교체하세요!

### Vercel 배포 환경

1. Vercel 대시보드 접속
2. 프로젝트 선택
3. Settings > Environment Variables
4. 새 변수 추가:
   - Name: `GOOGLE_API_KEY`
   - Value: (복사한 API 키)
   - Environment: Production, Preview, Development 모두 선택
5. Save

---

## 4단계: 개발 서버 재시작

환경 변수를 추가한 후 개발 서버를 재시작하세요:

```bash
# 터미널에서 Ctrl + C로 중지
npm run dev
```

---

## API 키 테스트

### 웹사이트에서 테스트

1. `http://localhost:3000` 접속
2. 업종 선택
3. 스튜디오 페이지에서 콘텐츠 생성 시도
4. 성공하면 API 키가 올바르게 설정된 것입니다

### 오류 발생 시

**오류:** "API 키가 설정되지 않았습니다"
- `.env` 파일에 `GOOGLE_API_KEY`가 있는지 확인
- 개발 서버를 재시작했는지 확인

**오류:** "Invalid API key"
- API 키가 올바른지 확인
- Google AI Studio에서 키를 재생성

**오류:** "Quota exceeded"
- 무료 할당량을 초과했습니다
- 잠시 후 다시 시도하거나 유료 플랜으로 업그레이드

---

## 할당량 및 요금

### 무료 플랜

- **Gemini 1.5 Flash**: 하루 1,500회 요청 무료
- **Gemini 1.5 Pro**: 하루 50회 요청 무료

일반적인 사용에는 무료 플랜으로 충분합니다.

### 할당량 확인

Google Cloud Console에서 확인:
1. https://console.cloud.google.com
2. API & Services > Dashboard
3. Generative Language API 선택

### 유료 플랜

더 많은 할당량이 필요하면:
1. Google Cloud Console에서 결제 설정
2. API별 요금 확인: https://ai.google.dev/pricing

---

## 보안

### API 키 보호

- `.env` 파일을 절대 GitHub에 커밋하지 마세요
- `.gitignore`에 `.env`가 포함되어 있는지 확인
- API 키를 공개 저장소에 노출하지 마세요

### API 키 제한 설정 (권장)

Google Cloud Console에서 API 키 제한 설정:

1. APIs & Services > Credentials
2. API 키 선택
3. "API restrictions" 설정:
   - "Restrict key" 선택
   - "Generative Language API" 선택
4. "HTTP referrers" 설정 (선택사항):
   - 자신의 도메인만 허용

---

## 문제 해결

### API 키가 작동하지 않음

1. **API 활성화 확인**
   - Google Cloud Console > APIs & Services
   - "Generative Language API"가 활성화되어 있는지 확인

2. **API 키 재생성**
   - Google AI Studio에서 새 API 키 생성
   - `.env` 파일 업데이트

3. **권한 확인**
   - Google Cloud 프로젝트에 결제 정보가 등록되어 있는지 확인
   - (무료 플랜도 결제 정보 등록 필요할 수 있음)

### 할당량 초과

```
Error: 429 Resource exhausted
```

해결:
- 무료 할당량을 초과했습니다
- 내일 다시 시도하거나
- 유료 플랜으로 업그레이드

---

## 대안

### Google AI 대신 다른 AI 사용

프로젝트를 수정하여 다른 AI 서비스 사용 가능:
- OpenAI GPT (유료)
- Anthropic Claude (유료)
- Cohere (무료/유료)

`lib/ai.ts` 파일을 수정하면 됩니다.

---

## 참고 자료

- Google AI for Developers: https://ai.google.dev
- API 문서: https://ai.google.dev/docs
- Pricing: https://ai.google.dev/pricing
- Community: https://discuss.ai.google.dev

---

## 다음 단계

API 키 설정 완료 후:
1. ✅ 콘텐츠 생성 기능 테스트
2. ✅ 다양한 업종/플랫폼 시도
3. ✅ 실제 마케팅 콘텐츠 생성

문제가 있으면 GitHub Issues에 문의하세요!

