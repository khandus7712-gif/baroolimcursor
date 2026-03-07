/**
 * OAuth 설정 진단 스크립트
 * 환경 변수와 설정을 확인합니다.
 */

console.log('🔍 OAuth 설정 진단 시작...\n');

// 환경 변수 확인
const requiredVars = {
  'Google OAuth': ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
  'Kakao OAuth': ['KAKAO_CLIENT_ID', 'KAKAO_CLIENT_SECRET'],
  'NextAuth': ['NEXTAUTH_URL', 'NEXTAUTH_SECRET'],
  'App URL': ['NEXT_PUBLIC_APP_URL'],
};

let allValid = true;

for (const [service, vars] of Object.entries(requiredVars)) {
  console.log(`\n📋 ${service}:`);
  for (const varName of vars) {
    const value = process.env[varName];
    const exists = !!value;
    const isEmpty = exists && value.trim() === '';
    
    if (!exists || isEmpty) {
      console.log(`  ❌ ${varName}: ${exists ? '비어있음' : '없음'}`);
      allValid = false;
    } else {
      // 값의 일부만 표시 (보안)
      const displayValue = varName.includes('SECRET') || varName.includes('SECRET')
        ? `${value.substring(0, 10)}...${value.substring(value.length - 5)}`
        : value.length > 50
        ? `${value.substring(0, 50)}...`
        : value;
      console.log(`  ✅ ${varName}: ${displayValue}`);
    }
  }
}

// URL 일관성 확인
console.log('\n🔗 URL 일관성 확인:');
const nextAuthUrl = process.env.NEXTAUTH_URL;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

if (nextAuthUrl && appUrl) {
  const nextAuthOrigin = new URL(nextAuthUrl).origin;
  const appUrlOrigin = new URL(appUrl).origin;
  
  if (nextAuthOrigin === appUrlOrigin) {
    console.log(`  ✅ NEXTAUTH_URL과 NEXT_PUBLIC_APP_URL이 일치합니다: ${nextAuthOrigin}`);
  } else {
    console.log(`  ⚠️  URL이 일치하지 않습니다:`);
    console.log(`     NEXTAUTH_URL: ${nextAuthOrigin}`);
    console.log(`     NEXT_PUBLIC_APP_URL: ${appUrlOrigin}`);
    allValid = false;
  }
} else {
  console.log('  ⚠️  URL 환경 변수가 설정되지 않았습니다.');
  allValid = false;
}

// Google OAuth Redirect URI 확인
console.log('\n🔗 Google OAuth Redirect URI 확인:');
if (nextAuthUrl) {
  const baseUrl = new URL(nextAuthUrl).origin;
  const googleCallbackUrl = `${baseUrl}/api/auth/callback/google`;
  const kakaoCallbackUrl = `${baseUrl}/api/auth/callback/kakao`;
  
  console.log(`  Google: ${googleCallbackUrl}`);
  console.log(`  Kakao: ${kakaoCallbackUrl}`);
  console.log(`\n  ⚠️  위 URL들이 Google Cloud Console과 Kakao Developers에 등록되어 있는지 확인하세요!`);
}

// 최종 결과
console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('✅ 모든 환경 변수가 올바르게 설정되었습니다!');
  console.log('\n⚠️  다음을 확인하세요:');
  console.log('  1. Vercel에서 재배포가 완료되었는지');
  console.log('  2. Google Cloud Console에 Redirect URI가 등록되었는지');
  console.log('  3. Kakao Developers에 Redirect URI가 등록되었는지');
  console.log('  4. 프로덕션 데이터베이스에 Prisma 스키마가 적용되었는지');
} else {
  console.log('❌ 일부 환경 변수가 누락되었거나 잘못 설정되었습니다.');
  console.log('   위의 오류를 수정한 후 다시 실행하세요.');
}
console.log('='.repeat(50));

process.exit(allValid ? 0 : 1);
















