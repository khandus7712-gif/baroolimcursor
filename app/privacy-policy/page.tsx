'use client';

/**
 * 🔒 개인정보처리방침
 */

import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-brand-neon-purple" />
              <h1 className="text-2xl font-black">개인정보처리방침</h1>
            </div>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-12 space-y-8">
          <div>
            <p className="text-white/70 mb-4">
              <strong>바로올림(이하 '회사')</strong>은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </p>
            <p className="text-sm text-white/50">
              시행일자: 2024년 11월 14일
            </p>
          </div>

          <hr className="border-white/10" />

          {/* 1. 개인정보의 처리 목적 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">1. 개인정보의 처리 목적</h2>
            <p className="text-white/70 mb-3">
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
              <li>서비스 제공: AI 콘텐츠 생성, 예약 발행, 알림 서비스 제공</li>
              <li>결제 및 정산: 유료 서비스 이용에 따른 요금 결제 및 정산</li>
              <li>고객 지원: 문의사항 처리, 고객 불만 처리</li>
              <li>서비스 개선: 서비스 이용 통계, 품질 개선</li>
            </ul>
          </section>

          {/* 2. 개인정보의 처리 및 보유기간 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">2. 개인정보의 처리 및 보유기간</h2>
            <p className="text-white/70 mb-3">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <div className="space-y-3">
              <div className="bg-white/5 p-4 rounded-xl">
                <h3 className="font-bold mb-2">회원 정보</h3>
                <p className="text-sm text-white/70">
                  회원 탈퇴 시까지 보유하며, 탈퇴 후 즉시 파기합니다. 
                  단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <h3 className="font-bold mb-2">결제 정보</h3>
                <p className="text-sm text-white/70">
                  전자상거래 등에서의 소비자 보호에 관한 법률에 따라 5년간 보관합니다.
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <h3 className="font-bold mb-2">생성된 콘텐츠</h3>
                <p className="text-sm text-white/70">
                  회원 탈퇴 시까지 보유하며, 탈퇴 후 즉시 파기합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 3. 처리하는 개인정보의 항목 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">3. 처리하는 개인정보의 항목</h2>
            <p className="text-white/70 mb-3">
              회사는 다음의 개인정보 항목을 처리하고 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li><strong>필수항목:</strong> 이메일, 이름(또는 닉네임)</li>
              <li><strong>선택항목:</strong> 전화번호 (알림 수신 동의 시), 업종 정보</li>
              <li><strong>자동수집항목:</strong> IP주소, 쿠키, 서비스 이용 기록, 방문 기록</li>
            </ul>
          </section>

          {/* 4. 개인정보의 제3자 제공 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. 개인정보의 제3자 제공</h2>
            <p className="text-white/70 mb-3">
              회사는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다. 
              다만, 다음의 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>정보주체가 사전에 동의한 경우</li>
              <li>법령의 규정에 의하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          {/* 5. 개인정보처리의 위탁 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. 개인정보처리의 위탁</h2>
            <p className="text-white/70 mb-3">
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
            </p>
            <div className="bg-white/5 p-4 rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2">수탁업체</th>
                    <th className="text-left py-2">위탁업무 내용</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/10">
                    <td className="py-2">Supabase, Inc.</td>
                    <td className="py-2">데이터베이스 및 스토리지 관리</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2">Google LLC</td>
                    <td className="py-2">AI 콘텐츠 생성 (Gemini API)</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2">토스페이먼츠(주)</td>
                    <td className="py-2">결제 처리</td>
                  </tr>
                  <tr>
                    <td className="py-2">Vercel Inc.</td>
                    <td className="py-2">웹 호스팅 및 배포</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 6. 정보주체의 권리·의무 및 행사방법 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. 정보주체의 권리·의무 및 행사방법</h2>
            <p className="text-white/70 mb-3">
              정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ul>
            <p className="text-white/70 mt-3">
              권리 행사는 회사에 대해 서면, 전화, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.
            </p>
          </section>

          {/* 7. 개인정보의 파기 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. 개인정보의 파기</h2>
            <p className="text-white/70 mb-3">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </p>
            <div className="space-y-2 text-white/70">
              <p><strong>파기절차:</strong> 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</p>
              <p><strong>파기방법:</strong> 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.</p>
            </div>
          </section>

          {/* 8. 개인정보 보호책임자 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. 개인정보 보호책임자</h2>
            <p className="text-white/70 mb-3">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-white/5 p-6 rounded-xl space-y-2 text-white/70">
              <p><strong>개인정보 보호책임자:</strong> 이주연</p>
              <p><strong>이메일:</strong> privacy@baroolim.com</p>
              <p><strong>전화:</strong> 010-5850-1255</p>
              <p><strong>주소:</strong> 경남 창원시 의창구 도계동 352-12 203호</p>
            </div>
          </section>

          {/* 9. 개인정보의 안전성 확보조치 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. 개인정보의 안전성 확보조치</h2>
            <p className="text-white/70 mb-3">
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>개인정보 암호화: 비밀번호는 암호화되어 저장 및 관리되고 있습니다.</li>
              <li>해킹 등에 대비한 기술적 대책: 회사는 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하고 있습니다.</li>
              <li>개인정보에 대한 접근 제한: 개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여, 변경, 말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있습니다.</li>
            </ul>
          </section>

          {/* 10. 개인정보 자동 수집 장치의 설치·운영 및 거부 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">10. 개인정보 자동 수집 장치의 설치·운영 및 거부</h2>
            <p className="text-white/70 mb-3">
              회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
            </p>
            <p className="text-white/70">
              쿠키의 설치·운영 및 거부는 웹브라우저 상단의 도구 {'>'} 인터넷 옵션 {'>'} 개인정보 메뉴의 옵션 설정을 통해 가능합니다.
            </p>
          </section>

          {/* 11. 개인정보 처리방침 변경 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">11. 개인정보 처리방침 변경</h2>
            <p className="text-white/70">
              이 개인정보 처리방침은 2024년 11월 14일부터 적용됩니다. 
              법령·정책 또는 보안기술의 변경에 따라 내용의 추가·삭제 및 수정이 있을 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>

          {/* 부칙 */}
          <section className="bg-brand-neon-purple/10 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-2">부칙</h2>
            <p className="text-white/70">이 방침은 2024년 11월 14일부터 시행됩니다.</p>
          </section>
        </div>
      </main>
    </div>
  );
}

