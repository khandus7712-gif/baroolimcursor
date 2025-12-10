/**
 * 환경 변수 확인 스크립트
 * Google 로그인 설정 확인용
 */

// dotenv를 사용하여 .env 파일 로드
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = {
  'Google OAuth': ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
  'Kakao OAuth': ['KAKAO_CLIENT_ID', 'KAKAO_CLIENT_SECRET'],
  'NextAuth': ['NEXTAUTH_URL', 'NEXTAUTH_SECRET'],
  'Database': ['DATABASE_URL'],
  'Google AI': ['GOOGLE_API_KEY'],
  'Toss Payments': ['NEXT_PUBLIC_TOSS_CLIENT_KEY', 'TOSS_SECRET_KEY'],
};

console.log('🔍 환경 변수 확인 중...\n');

let allPassed = true;

for (const [service, vars] of Object.entries(requiredEnvVars)) {
  console.log(`📦 ${service}:`);
  let servicePassed = true;
  
  for (const varName of vars) {
    const value = process.env[varName];
    if (value && value.trim() !== '') {
      // 값이 있으면 마스킹해서 표시
      const masked = value.length > 10 
        ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
        : '***';
      console.log(`  ✅ ${varName}: ${masked}`);
    } else {
      console.log(`  ❌ ${varName}: 설정되지 않음`);
      servicePassed = false;
      allPassed = false;
    }
  }
  
  if (!servicePassed) {
    console.log(`  ⚠️  ${service} 설정이 완료되지 않았습니다.\n`);
  } else {
    console.log(`  ✅ ${service} 설정 완료\n`);
  }
}

if (allPassed) {
  console.log('✅ 모든 필수 환경 변수가 설정되었습니다!');
} else {
  console.log('\n❌ 일부 환경 변수가 설정되지 않았습니다.');
  console.log('📝 .env 파일을 확인하고 필요한 환경 변수를 설정하세요.');
  console.log('📚 자세한 내용은 ENV_SETUP.md 또는 OAUTH_SETUP_GUIDE.md를 참조하세요.\n');
  
  // Google OAuth 특별 안내
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log('🔵 Google 로그인 설정 방법:');
    console.log('1. https://console.cloud.google.com/ 접속');
    console.log('2. 프로젝트 선택 → API 및 서비스 → 사용자 인증 정보');
    console.log('3. OAuth 클라이언트 ID 생성');
    console.log('4. 승인된 리디렉션 URI 추가:');
    console.log('   - http://localhost:3000/api/auth/callback/google (개발용)');
    console.log('   - https://your-domain.com/api/auth/callback/google (프로덕션)');
    console.log('5. .env 파일에 GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET 추가\n');
  }
}

// Google OAuth Redirect URI 확인
if (process.env.GOOGLE_CLIENT_ID && process.env.NEXTAUTH_URL) {
  console.log('\n🔗 Google OAuth Redirect URI 확인:');
  const nextAuthUrl = process.env.NEXTAUTH_URL.replace(/\/$/, ''); // 끝의 슬래시 제거
  const expectedCallbackUrl = `${nextAuthUrl}/api/auth/callback/google`;
  console.log(`  예상 콜백 URL: ${expectedCallbackUrl}`);
  console.log(`  ⚠️  Google Cloud Console의 "승인된 리디렉션 URI"에 위 URL이 정확히 등록되어 있어야 합니다.`);
  console.log(`  📝 Google Cloud Console: https://console.cloud.google.com/apis/credentials\n`);
}

process.exit(allPassed ? 0 : 1);

