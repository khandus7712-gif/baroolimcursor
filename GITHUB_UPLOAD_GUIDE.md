# GitHub 업로드 가이드 🚀

## 단계별 진행

### 1. GitHub에서 리포지토리 삭제 완료
- ✅ 삭제 확인 텍스트 입력: `khandus7712-gif/baroolimcursor`
- ✅ "Delete this repository" 버튼 클릭

### 2. 새 리포지토리 생성
1. https://github.com/new 접속
2. 설정:
   - Repository name: `baroolimcursor`
   - Description: (선택) "바로올림 - AI 마케팅 콘텐츠 자동 생성"
   - Public 선택
   - **⚠️ "Add a README file" 체크 해제 (중요!)**
   - "Create repository" 클릭

### 3. 로컬에서 원격 저장소 재설정
```bash
# 기존 원격 저장소 제거
git remote remove origin

# 새 원격 저장소 추가
git remote add origin https://github.com/khandus7712-gif/baroolimcursor.git

# 코드 업로드
git push -u origin main
```

### 4. 완료!
GitHub에서 코드 확인:
https://github.com/khandus7712-gif/baroolimcursor

---

## 다음 단계: Vercel 배포

GitHub 업로드 완료 후:

### Option 1: Vercel CLI로 배포
```bash
npm i -g vercel
vercel
```

### Option 2: Vercel 웹사이트에서 배포
1. https://vercel.com 접속
2. "Add New" → "Project"
3. GitHub 리포지토리 선택: `baroolimcursor`
4. 환경 변수 추가:
   - `DATABASE_URL`
   - `GOOGLE_API_KEY`
5. "Deploy" 클릭

**배포 완료! 🎉**

