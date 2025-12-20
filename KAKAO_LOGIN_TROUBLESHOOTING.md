# 카카오 로그인 문제 해결 가이드

## 🔴 일반적인 오류

### 1. "Configuration" 오류
**원인**: 환경 변수가 로드되지 않음

**해결**:
1. 서버 재시작 (Ctrl+C 후 npm run dev)
2. 서버 콘솔에서 환경 변수 로드 확인
3. `.env` 파일에 KAKAO_CLIENT_ID와 KAKAO_CLIENT_SECRET 확인

### 2. "KOE006" 또는 "redirect_uri_mismatch" 오류
**원인**: Kakao Developers에 Redirect URI가 등록되지 않음

**해결**:
1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 내 애플리케이션 → 애플리케이션 선택
3. 제품 설정 → 카카오 로그인
4. Redirect URI에 다음 추가:
   ```
   http://localhost:3000/api/auth/callback/kakao
   ```
5. 저장 후 테스트

### 3. "KOE009" (consent_required) 오류
**원인**: 동의 항목이 설정되지 않음

**해결**:
1. 카카오 로그인 → 동의항목
2. 다음 항목 설정:
   - 닉네임: 필수 동의
   - 프로필 사진: 선택 동의
   - 카카오계정(이메일): 필수 동의
3. 저장 후 테스트

## 📋 체크리스트

- [ ] 서버가 실행 중인가요?
- [ ] 서버 콘솔에 환경 변수 로드 메시지가 있나요?
- [ ] `.env` 파일에 KAKAO_CLIENT_ID와 KAKAO_CLIENT_SECRET이 있나요?
- [ ] Kakao Developers에 Redirect URI가 등록되어 있나요?
- [ ] 동의 항목이 설정되어 있나요?

## 🔍 디버깅 방법

### 1. 서버 콘솔 확인
서버를 시작할 때 다음 메시지 확인:
```
✅ Google OAuth 환경 변수 로드됨: ...
```

카카오는 별도 메시지가 없을 수 있지만, 오류가 없어야 합니다.

### 2. 브라우저 콘솔 확인
F12 → Console 탭에서 오류 메시지 확인

### 3. 네트워크 탭 확인
F12 → Network 탭에서 `/api/auth/callback/kakao` 요청 확인

## 💡 빠른 해결

1. **서버 재시작** (가장 중요!)
   ```bash
   # 서버 중지 (Ctrl+C)
   npm run dev
   ```

2. **Kakao Developers 설정 확인**
   - Redirect URI: `http://localhost:3000/api/auth/callback/kakao`
   - 동의 항목: 닉네임, 이메일 필수

3. **브라우저 캐시 클리어**
   - 시크릿 모드에서 테스트
   - 또는 개발자 도구 → Network → "Disable cache"

## 🚨 여전히 안 되면

실제 오류 메시지를 알려주세요:
- 서버 콘솔의 오류
- 브라우저 콘솔의 오류
- 화면에 표시되는 오류 메시지



















