/**
 * 프롬프트 생성 테스트 스크립트
 */

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

// TypeScript 파일을 직접 실행할 수 없으므로, 프롬프트 컴포저의 로직을 간단히 테스트
const fs = require('fs');
const path = require('path');

async function testPrompts() {
  console.log('🧪 프롬프트 생성 테스트 시작...\n');

  // 테스트용 도메인 프로필 로드
  const domains = ['food', 'beauty', 'retail', 'cafe', 'fitness', 'pet', 'education'];
  const platforms = ['blog', 'threads', 'instagram', 'gmb'];

  console.log('✅ 테스트할 업종:', domains.join(', '));
  console.log('✅ 테스트할 플랫폼:', platforms.join(', '));
  console.log('\n📝 각 플랫폼별 프롬프트 함수 확인:\n');

  // 프롬프트 컴포저 파일 확인
  const promptComposerPath = path.join(__dirname, '..', 'lib', 'promptComposer.ts');
  
  if (fs.existsSync(promptComposerPath)) {
    const content = fs.readFileSync(promptComposerPath, 'utf-8');
    
    // 각 플랫폼별 프롬프트 함수 존재 확인
    const checks = {
      'createBlogPrompt': content.includes('function createBlogPrompt'),
      'createThreadsPrompt': content.includes('function createThreadsPrompt'),
      'createInstagramPrompt': content.includes('function createInstagramPrompt'),
      'createGMBPrompt': content.includes('function createGMBPrompt'),
    };

    console.log('프롬프트 함수 존재 여부:');
    Object.entries(checks).forEach(([name, exists]) => {
      console.log(`  ${exists ? '✅' : '❌'} ${name}`);
    });

    // 플랫폼별 분기 확인
    console.log('\n플랫폼별 분기 로직 확인:');
    const platformChecks = {
      'blog': content.includes("if (platform.id === 'blog')"),
      'threads': content.includes("if (platform.id === 'threads')"),
      'instagram': content.includes("if (platform.id === 'instagram')"),
      'gmb': content.includes("if (platform.id === 'gmb')"),
    };

    Object.entries(platformChecks).forEach(([platform, exists]) => {
      console.log(`  ${exists ? '✅' : '❌'} ${platform} 플랫폼 분기`);
    });

    // 주요 키워드 확인
    console.log('\n주요 프롬프트 키워드 확인:');
    const keywordChecks = {
      '1,500자 이상': content.includes('1,500자 이상'),
      '메인 글 + 댓글 3개': content.includes('메인 글 + 댓글 3개'),
      '본문 내 해시태그 금지': content.includes('본문 내 해시태그 금지') || content.includes('해시태그는 절대 사용하지 않는다'),
      '200~350자': content.includes('200~350자'),
      'GMB 게시글': content.includes('GMB 게시글'),
    };

    Object.entries(keywordChecks).forEach(([keyword, exists]) => {
      console.log(`  ${exists ? '✅' : '❌'} "${keyword}"`);
    });

  } else {
    console.log('❌ promptComposer.ts 파일을 찾을 수 없습니다.');
  }

  console.log('\n✅ 프롬프트 테스트 완료!');
  console.log('\n💡 실제 테스트는 브라우저에서 http://localhost:3000/studio 에서 진행하세요.');
  console.log('   - 관리자 계정: admin@baroolim.com / admin1234');
  console.log('   - 각 플랫폼(블로그, Threads, Instagram, GMB)을 선택하여 콘텐츠 생성 테스트');
}

testPrompts().catch(console.error);







