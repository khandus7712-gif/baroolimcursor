# 로그인 버튼 디버깅 가이드

## 🔍 브라우저에서 직접 확인해야 할 것들

### 1. 브라우저 콘솔 (F12) 확인

**중요!** 다음 단계를 정확히 따라주세요:

1. 브라우저를 **완전히 닫고** 다시 열기
2. **시크릿 모드** 열기 (`Ctrl + Shift + N`)
3. `http://localhost:3000/login` 접속
4. **F12** 누르기 (개발자 도구)
5. **Console** 탭 선택
6. **Network** 탭도 열어두기

### 2. Console 탭에서 확인할 것

다음 메시지들을 찾아보세요:

#### ✅ 정상적인 경우:
- JavaScript 파일들이 로드됨
- 에러 메시지 없음

#### ❌ 문제가 있는 경우:
- 빨간색 에러 메시지
- `Failed to load resource` 메시지
- `SyntaxError` 메시지
- `Uncaught` 에러

### 3. "Google로 시작하기" 버튼 클릭

버튼을 클릭했을 때 Console에 다음이 나타나야 합니다:
```
🔵 Google 로그인 버튼 클릭됨
🔵 signIn 함수 호출 중... {callbackUrl: '/studio'}
```

### 4. Network 탭에서 확인

버튼 클릭 시 다음 요청이 보여야 합니다:
- `/api/auth/signin/google` (또는 유사한 경로)

---

## 🚨 문제 해결

### 케이스 1: Console에 아무것도 안 나타남
**원인**: JavaScript가 로드되지 않음

**해결**:
1. 브라우저 **Hard Refresh**: `Ctrl + Shift + R`
2. 여전히 안 되면: 브라우저 캐시 완전 삭제
3. 그래도 안 되면: 다른 브라우저로 테스트 (Edge, Firefox 등)

### 케이스 2: Console에 빨간색 에러
**원인**: JavaScript 실행 오류

**해결**:
1. 에러 메시지 전체를 복사해서 알려주세요
2. 특히 `SyntaxError`, `TypeError`, `ReferenceError` 확인

### 케이스 3: 버튼은 반응하지만 로그 없음
**원인**: 핸들러가 연결되지 않음

**해결**:
1. 서버 재시작 후 다시 테스트
2. 브라우저 캐시 삭제

---

## 📸 스크린샷이 필요합니다

다음을 캡처해서 보여주세요:

1. **Console 탭** 전체 (빨간색 에러 포함)
2. **Network 탭** (버튼 클릭 후)
3. 로그인 페이지 화면

---

## 🎯 빠른 테스트

브라우저 Console에서 다음을 입력해보세요:

```javascript
console.log('Test:', window.location.href)
```

Enter를 누르고 `Test: http://localhost:3000/login`이 나타나면 JavaScript는 작동하는 것입니다.

---

## 💡 임시 해결책

만약 Google 로그인이 계속 안 되면, **이메일 로그인**을 먼저 테스트해보세요:
1. 로그인 페이지에서 이메일 입력란에 아무 이메일 입력
2. "이메일로 시작하기" 버튼 클릭
3. 작동하는지 확인

이메일 로그인이 작동한다면 문제는 OAuth 설정에 있는 것입니다.







