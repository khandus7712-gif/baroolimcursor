# Vercel 환경 변수 설정 가이드

## 🚨 긴급: 로그인이 안 되는 경우

`/api/auth/session`이 500 에러를 반환하면 `NEXTAUTH_SECRET`이 설정되지 않은 것입니다.

## 📝 설정 방법

### 1단계: NEXTAUTH_SECRET 생성

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**또는 온라인 생성기:**
https://generate-secret.vercel.app/32

**또는 간단한 방법:**
- 아무 긴 문자열 사용 (최소 32자)
- 예: `my-super-secret-key-for-baroolim-2024-very-long-string`

### 2단계: Vercel에 환경 변수 추가

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택

2. **Settings → Environment Variables**

3. **다음 변수들 추가:**

#### NEXTAUTH_SECRET
- **Name**: `NEXTAUTH_SECRET`
- **Value**: (1단계에서 생성한 값)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development 모두 체크

#### NEXTAUTH_URL
- **Name**: `NEXTAUTH_URL`
- **Value**: `https://www.baroolim.com` (또는 실제 도메인)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development 모두 체크

### 3단계: 재배포

환경 변수를 추가한 후:

1. **자동 재배포** (권장):
   - 빈 커밋 푸시:
   ```bash
   git commit --allow-empty -m "Redeploy after env var update"
   git push
   ```

2. **또는 수동 재배포**:
   - Vercel 대시보드 → Deployments → 최신 배포 옆 점 3개 → Redeploy

### 4단계: 확인

재배포 후:
1. 브라우저에서 `https://www.baroolim.com/login` 접속
2. F12 → Console 탭
3. `/api/auth/session` 에러가 사라졌는지 확인

## ✅ 확인 방법

Vercel Functions 로그에서 다음이 보여야 합니다:
```
🔍 [auth.ts] ENV CHECK {
  has_NEXTAUTH_SECRET: true  ← 이것이 true여야 함!
  NEXTAUTH_URL: 'https://www.baroolim.com'
}
```

## ⚠️ 주의사항

- `NEXTAUTH_SECRET`은 절대 공개하지 마세요
- 프로덕션과 개발 환경 모두에 설정해야 합니다
- 환경 변수를 추가한 후 반드시 재배포해야 합니다
