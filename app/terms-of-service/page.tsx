'use client';

/**
 * 📜 서비스 이용약관
 */

import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfServicePage() {
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
              <FileText className="w-6 h-6 text-brand-neon-cyan" />
              <h1 className="text-2xl font-black">서비스 이용약관</h1>
            </div>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-12 space-y-8">
          <div>
            <p className="text-white/70 mb-4">
              본 약관은 <strong>바로올림(이하 '회사')</strong>이 제공하는 AI 마케팅 콘텐츠 생성 서비스(이하 '서비스')의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
            <p className="text-sm text-white/50">
              시행일자: 2024년 11월 14일
            </p>
          </div>

          <hr className="border-white/10" />

          {/* 제1조 (목적) */}
          <section>
            <h2 className="text-2xl font-bold mb-4">제1조 (목적)</h2>
            <p className="text-white/70">
              본 약관은 바로올림(이하 '회사')이 제공하는 AI 마케팅 콘텐츠 생성 서비스(이하 '서비스')의 이용 조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          {/* 제2조 (정의) */}
          <section>
            <h2 className="text-2xl font-bold mb-4">제2조 (정의)</h2>
            <p className="text-white/70 mb-3">본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <ul className="list-decimal list-inside space-y-2 text-white/70 ml-4">
              <li>'서비스'란 회사가 제공하는 AI 기반 마케팅 콘텐츠 자동 생성 서비스를 의미합니다.</li>
              <li>'회원'이란 본 약관에 동의하고 회사와 이용계약을 체결하여 서비스를 이용하는 고객을 말합니다.</li>
              <li>'아이디(ID)'란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인한 이메일 주소를 말합니다.</li>
              <li>'콘텐츠'란 서비스를 통해 생성된 텍스트, 이미지, 해시태그 등의 디지털 자산을 말합니다.</li>
              <li>'유료서비스'란 회사가 유료로 제공하는 각종 서비스를 의미합니다.</li>
            </ul>
          </section>

          {/* 제3조 (약관의 효력 및 변경) */}
          <section>
            <h2 className="text-2xl font-bold mb-4">제3조 (약관의 효력 및 변경)</h2>
            <p className="text-white/70 mb-3">
              ① 본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
            </p>
            <p className="text-white/70 mb-3">
              ② 회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있습니다.
            </p>
            <p className="text-white/70">
              ③ 회사가 약관을 변경할 경우에는 적용일자 및 변경사유를 명시하여 현행약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
            </p>
          </section>

          {/* 제4조 (회원가입) */}
          <section>
            <h2 className="text-2xl font-bold mb-4">제4조 (회원가입)</h2>
            <p className="text-white/70 mb-3">
              ① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
            </p>
            <p className="text-white/70 mb-3">
              ② 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-8">
              <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
              <li>회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
              <li>이전에 회원자격을 상실한 적이 있는 경우 (재가입 승인을 얻은 경우 제외)</li>
            </ul>
          </section>

          {/* 제5조 (서비스의 제공) */}
          <section>
            <h2 className="text-2xl font-bold mb-4">제5조 (서비스의 제공)</h2>
            <p className="text-white/70 mb-3">
              ① 회사는 회원에게 아래와 같은 서비스를 제공합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-8">
              <li>AI 기반 마케팅 콘텐츠 자동 생성 서비스</li>
              <li>다중 플랫폼 콘텐츠 동시 생성 (Instagram, Blog, Threads, Google My Business)</li>
              <li>콘텐츠 예약 발행 서비스</li>
              <li>알림 서비스 (이메일, 카카오톡 등)</li>
              <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 회원에게 제공하는 서비스</li>
            </ul>
            <p className="text-white/70 mt-3">
              ② 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 다만, 회사는 서비스의 종류나 성질에 따라 제공하는 서비스 중 일부에 대해서는 별도로 이용시간을 정할 수 있으며, 이 경우 그 이용시간을 사전에 공지합니다.
            </p>
          </section>

          {/* 제6조 (서비스의 중단) */}
          <section>
            <h2 className="text-2xl font-bold mb-4">제6조 (서비스의 중단)</h2>
            <p className="text-white/70 mb-3">
              ① 회사는 다음 각 호에 해당하는 경우 서비스 제공을 중단할 수 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-8">
              <li>서비스용 설비의 보수 등 공사로 인한 부득이한 경우</li>
              <li>전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중지했을 경우</li>
              <li>국가비상사태, 서비스 설비의 장애 또는 서비스 이용의 폭주 등으로 서비스 이용에 지장이 있는 때</li>
            </ul>
            <p className="text-white/70 mt-3">
              ② 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상하지 않습니다.
            </p>
          </section>

          {/* 제7조 (유료서비스) */}
          <section>
            <h2 className="text-2xl font-bold mb-4">제7조 (유료서비스)</h2>
            <p className="text-white/70 mb-3">
              ① 회사는 회원에게 유료서비스를 제공할 수 있으며, 유료서비스의 종류 및 요금은 회사가 별도로 정합니다.
            </p>
            <p className="text-white/70 mb-3">
              ② 유료서비스의 이용요금은 다음과 같습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-8">
              <li>Basic 플랜: 월 29,900원 (하루 3개 생성)</li>
              <li>Pro 플랜: 월 49,900원 (하루 10개 생성)</li>
              <li>Enterprise 플랜: 월 79,900원 (하루 30개 생성)</li>
            </ul>
            <p className="text-white/70 mt-3">
              ③ 회원은 유료서비스 이용을 위해 신용카드, 계좌이체, 간편결제 등 회사가 제공하는 결제수단을 통해 요금을 결제할 수 있습니다.
            </p>
            <p className="text-white/70 mt-3">
              ④ 유료서비스는 구매 시점부터 1개월 단위로 자동 갱신되며, 회원이 해지하기 전까지 계속됩니다.
            </p>
          </section>

          {/* 제8조 (환불 정책) */}
          <section>
            <h2 className="text-2xl font-bold mb-4">제8조 (환불 정책)</h2>
            <p className="text-white/70 mb-3">
              ① 유료서비스의 환불 정책은 별도의 <a href="/refund-policy" className="text-brand-neon-purple hover:underline">환불 정책</a>에 따릅니다.
            </p>
            <p className="text-white/70">
              ② 회원은 결제 후 7일 이내에 서비스를 3회 미만 이용한 경우 전액 환불을 요청할 수 있습니다.
            </p>
          </section>

          {/* 제9조 (회원의 의무) */}
          <section>
            <h2 className="text-2xl font-bold mb-4">제9조 (회원의 의무)</h2>
            <p className="text-white/70 mb-3">
              ① 회원은 다음 각 호의 행위를 하여서는 안 됩니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-8">
              <li>신청 또는 변경 시 허위내용의 등록</li>
              <li>타인의 정보도용</li>
              <li>회사가 게시한 정보의 변경</li>
              <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
              <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
              <li>서비스를 영리목적으로 이용하는 행위</li>
            </ul>
            <p className="text-white/70 mt-3">
              ② 회원은 관계법령, 본 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항, 회사가 통지하는 사항 등을 준수하여야 합니다.
            </p>
          </section>

          {/* 제10조 (저작권) */}
          <section>
            <h2 className="text-2xl font-bold mb-4">제10조 (저작권)</h2>
            <p className="text-white/70 mb-3">
              ① 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.
            </p>
            <p className="text-white/70 mb-3">
              ② 서비스를 통해 생성된 콘텐츠의 저작권은 회원에게 귀속됩니다. 다만, 회원은 생성된 콘텐츠에 대한 책임을 지며, 제3자의 권리를 침해하지 않도록 주의할 의무가 있습니다.
            </p>
            <p className="text-white/70">
              ③ 회원은 서비스를 이용하여 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
            </p>
          </section>

          {/* 제11조 (면책조항) */}
          <section>
            <h2 className="text-2xl font-bold mb-4">제11조 (면책조항)</h2>
            <p className="text-white/70 mb-3">
              ① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
            </p>
            <p className="text-white/70 mb-3">
              ② 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
            </p>
            <p className="text-white/70 mb-3">
              ③ 회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
            </p>
            <p className="text-white/70">
              ④ 회사는 AI가 생성한 콘텐츠의 정확성, 적법성, 품질 등에 대해 보증하지 않으며, 회원은 생성된 콘텐츠를 사용하기 전에 반드시 검토하고 수정할 책임이 있습니다.
            </p>
          </section>

          {/* 제12조 (분쟁해결) */}
          <section>
            <h2 className="text-2xl font-bold mb-4">제12조 (분쟁해결)</h2>
            <p className="text-white/70 mb-3">
              ① 회사는 회원으로부터 제출되는 불만사항 및 의견을 우선적으로 그 사항을 처리합니다.
            </p>
            <p className="text-white/70">
              ② 회사와 회원 간 발생한 분쟁에 관한 소송은 서울중앙지방법원을 관할 법원으로 합니다.
            </p>
          </section>

          {/* 부칙 */}
          <section className="bg-brand-neon-cyan/10 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-2">부칙</h2>
            <p className="text-white/70">본 약관은 2024년 11월 14일부터 시행됩니다.</p>
          </section>
        </div>
      </main>
    </div>
  );
}




