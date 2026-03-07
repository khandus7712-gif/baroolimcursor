/**
 * Google OAuth 설정 테스트 스크립트
 * 클라이언트 ID가 실제로 존재하는지 확인
 */

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

console.log('🔍 Google OAuth 설정 확인\n');

if (!clientId || !clientSecret) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.');
  console.log('GOOGLE_CLIENT_ID:', clientId ? '✅ 설정됨' : '❌ 없음');
  console.log('GOOGLE_CLIENT_SECRET:', clientSecret ? '✅ 설정됨' : '❌ 없음');
  process.exit(1);
}

console.log('✅ 환경 변수 로드됨:');
console.log('   Client ID:', clientId.substring(0, 20) + '...');
console.log('   Client Secret:', clientSecret.substring(0, 10) + '...\n');

console.log('📋 확인 사항:');
console.log('1. Google Cloud Console에서 다음 클라이언트 ID가 존재하는지 확인:');
console.log(`   ${clientId}\n`);
console.log('2. 클라이언트 ID 상세 페이지에서:');
console.log('   - 클라이언트 Secret이 일치하는지 확인');
console.log('   - 승인된 리디렉션 URI에 다음이 포함되어 있는지 확인:');
console.log('     http://localhost:3000/api/auth/callback/google\n');
console.log('3. OAuth 동의 화면이 완료되었는지 확인:');
console.log('   - API 및 서비스 → OAuth 동의 화면\n');
console.log('4. 올바른 프로젝트를 사용하고 있는지 확인\n');

console.log('💡 "The OAuth client was not found" 오류가 발생하면:');
console.log('   - 클라이언트 ID가 다른 프로젝트에 속해 있을 수 있습니다');
console.log('   - 클라이언트가 삭제되었을 수 있습니다');
console.log('   - Google Cloud Console에서 새 클라이언트를 생성하세요\n');


















