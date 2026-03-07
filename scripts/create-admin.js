/**
 * 관리자 계정 생성 스크립트
 * 사용법: node scripts/create-admin.js
 */

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const adminEmail = 'admin@baroolim.com';
    
    console.log('🔍 관리자 계정 생성 중...\n');
    
    // 기존 사용자 확인
    let user = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (user) {
      // 이미 존재하면 플랜만 업데이트
      user = await prisma.user.update({
        where: { email: adminEmail },
        data: {
          plan: 'ENTERPRISE',
          planExpiry: null, // 영구
        },
      });
      console.log('✅ 관리자 계정 플랜이 ENTERPRISE로 업데이트되었습니다.');
    } else {
      // 새로 생성
      user = await prisma.user.create({
        data: {
          email: adminEmail,
          name: '관리자',
          plan: 'ENTERPRISE',
          planExpiry: null, // 영구
        },
      });
      console.log('✅ 관리자 계정이 생성되었습니다.');
    }

    console.log('\n📋 관리자 정보:');
    console.log(`  이메일: ${user.email}`);
    console.log(`  이름: ${user.name}`);
    console.log(`  플랜: ${user.plan}`);
    console.log(`  ID: ${user.id}`);
    
    console.log('\n🔑 로그인 방법:');
    console.log('1. 테스트 계정으로 로그인:');
    console.log('   - 이메일: admin@baroolim.com');
    console.log('   - 비밀번호: admin1234');
    console.log('\n2. 사용 가능한 업종 (7개 전체):');
    console.log('   - food (음식/식당)');
    console.log('   - beauty (뷰티/미용)');
    console.log('   - retail (소매/유통)');
    console.log('   - cafe (카페/베이커리)');
    console.log('   - fitness (운동/헬스)');
    console.log('   - pet (반려동물)');
    console.log('   - education (교육/학원)');
    console.log('\n✅ 관리자 계정 설정 완료!');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();










