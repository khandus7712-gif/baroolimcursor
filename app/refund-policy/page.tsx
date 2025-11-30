'use client';

/**
 * 💸 환불 정책
 */

import { useRouter } from 'next/navigation';
import { ArrowLeft, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function RefundPolicyPage() {
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
              <DollarSign className="w-6 h-6 text-brand-neon-pink" />
              <h1 className="text-2xl font-black">환불 정책</h1>
            </div>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-12 space-y-8">
          <div>
            <p className="text-white/70 mb-4">
              <strong>바로올림(이하 '회사')</strong>은 고객의 권익을 보호하고 투명한 환불 정책을 운영하기 위해 다음과 같이 환불 정책을 수립합니다.
            </p>
            <p className="text-sm text-white/50">
              시행일자: 2024년 11월 14일
            </p>
          </div>

          <hr className="border-white/10" />

          {/* 1. 환불 가능 조건 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              1. 환불 가능 조건
            </h2>
            <p className="text-white/70 mb-4">
              다음의 조건을 <strong>모두</strong> 충족하는 경우 전액 환불이 가능합니다.
            </p>
            <div className="space-y-3">
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">결제 후 7일 이내</h3>
                    <p className="text-sm text-white/70">
                      결제일로부터 7일(영업일 기준)이 경과하지 않은 경우
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">서비스 이용 3회 미만</h3>
                    <p className="text-sm text-white/70">
                      콘텐츠 생성 횟수가 3회 미만인 경우
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">서비스 하자 또는 오류</h3>
                    <p className="text-sm text-white/70">
                      서비스에 중대한 오류나 하자가 있어 정상적으로 이용할 수 없는 경우
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. 부분 환불 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              2. 부분 환불
            </h2>
            <p className="text-white/70 mb-4">
              다음의 경우 일할 계산하여 부분 환불이 가능합니다.
            </p>
            <div className="space-y-3">
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                <h3 className="font-bold mb-2">중도 해지 시</h3>
                <p className="text-sm text-white/70 mb-2">
                  결제 후 7일이 경과하였으나, 남은 이용 기간이 있는 경우:
                </p>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-sm">
                  환불금액 = (월 이용료 ÷ 30일) × 남은 일수 - 사용한 횟수에 따른 차감
                </div>
                <p className="text-xs text-white/50 mt-2">
                  * 사용 횟수 차감: 1회당 1,500원 (Basic), 2,000원 (Pro), 1,000원 (Enterprise)
                </p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                <h3 className="font-bold mb-2">플랜 다운그레이드 시</h3>
                <p className="text-sm text-white/70">
                  상위 플랜에서 하위 플랜으로 변경하는 경우, 차액을 일할 계산하여 다음 결제 시 차감됩니다.
                </p>
              </div>
            </div>
          </section>

          {/* 3. 환불 불가 조건 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-400" />
              3. 환불 불가 조건
            </h2>
            <p className="text-white/70 mb-4">
              다음의 경우 환불이 불가능합니다.
            </p>
            <div className="space-y-3">
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">단순 변심</h3>
                    <p className="text-sm text-white/70">
                      결제 후 7일이 경과하고, 서비스를 3회 이상 이용한 경우
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">약관 위반</h3>
                    <p className="text-sm text-white/70">
                      이용약관 위반으로 인해 서비스 이용이 정지된 경우
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">프로모션/할인 상품</h3>
                    <p className="text-sm text-white/70">
                      프로모션이나 할인 쿠폰을 적용하여 구매한 상품 (별도 약관이 있는 경우 제외)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. 환불 신청 방법 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. 환불 신청 방법</h2>
            <p className="text-white/70 mb-4">
              환불을 원하시는 경우 다음의 방법으로 신청해주세요.
            </p>
            <div className="bg-white/5 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-neon-purple flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold mb-1">고객센터 문의</h3>
                  <p className="text-sm text-white/70">
                    이메일: <a href="mailto:refund@baroolim.com" className="text-brand-neon-purple hover:underline">refund@baroolim.com</a><br />
                    전화: <a href="tel:010-5850-1255" className="text-brand-neon-purple hover:underline">010-5850-1255</a> (평일 09:00-18:00)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-neon-purple flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold mb-1">환불 신청서 제출</h3>
                  <p className="text-sm text-white/70">
                    회원정보, 결제일, 환불 사유, 환불 계좌 정보 기재
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-neon-purple flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold mb-1">검토 및 승인</h3>
                  <p className="text-sm text-white/70">
                    영업일 기준 3-5일 이내 검토 후 승인 여부 통보
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-neon-purple flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-bold mb-1">환불 처리</h3>
                  <p className="text-sm text-white/70">
                    승인 후 7-10 영업일 이내 지정 계좌로 환불
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. 환불 처리 기간 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. 환불 처리 기간</h2>
            <div className="bg-white/5 rounded-xl p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 font-bold">결제 수단</th>
                    <th className="text-left py-3 font-bold">환불 소요 시간</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/10">
                    <td className="py-3">신용카드</td>
                    <td className="py-3">승인 후 3-5 영업일 (카드사별 상이)</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3">계좌이체</td>
                    <td className="py-3">승인 후 3-5 영업일</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3">간편결제 (토스/카카오페이)</td>
                    <td className="py-3">승인 후 3-5 영업일</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-white/50 mt-4">
                * 환불 처리 기간은 금융기관 및 결제대행사의 사정에 따라 지연될 수 있습니다.
              </p>
            </div>
          </section>

          {/* 6. 자동 해지 및 환불 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. 자동 해지 및 환불</h2>
            <p className="text-white/70 mb-3">
              다음의 경우 회사는 자동으로 서비스를 해지하고 환불 처리합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
              <li>결제 실패가 3회 연속 발생한 경우 (남은 기간 일할 계산 환불)</li>
              <li>서비스 중대한 오류로 30일 이상 이용 불가한 경우 (전액 환불)</li>
              <li>회사의 귀책사유로 서비스 제공이 불가능한 경우 (전액 환불)</li>
            </ul>
          </section>

          {/* 7. 문의 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. 문의</h2>
            <p className="text-white/70 mb-4">
              환불 정책에 대한 문의사항이 있으시면 언제든지 연락주세요.
            </p>
            <div className="bg-gradient-to-br from-brand-neon-purple/20 to-brand-neon-pink/20 border border-brand-neon-purple/30 rounded-xl p-6 space-y-2">
              <p className="text-white/90">
                <strong>이메일:</strong> <a href="mailto:refund@baroolim.com" className="text-brand-neon-purple hover:underline">refund@baroolim.com</a>
              </p>
              <p className="text-white/90">
                <strong>전화:</strong> <a href="tel:010-5850-1255" className="text-brand-neon-purple hover:underline">010-5850-1255</a>
              </p>
              <p className="text-white/90">
                <strong>주소:</strong> 경남 창원시 의창구 도계동 352-12 203호
              </p>
              <p className="text-white/90">
                <strong>운영시간:</strong> 평일 09:00-18:00 (주말 및 공휴일 제외)
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-4">자주 묻는 질문</h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-5">
                <h3 className="font-bold mb-2">Q. 환불 신청 후 얼마나 걸리나요?</h3>
                <p className="text-sm text-white/70">
                  A. 신청 후 검토에 3-5 영업일, 승인 후 환불 처리에 3-5 영업일이 소요됩니다. 총 1-2주 정도 예상하시면 됩니다.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-5">
                <h3 className="font-bold mb-2">Q. 환불 후 재가입이 가능한가요?</h3>
                <p className="text-sm text-white/70">
                  A. 네, 환불 후에도 언제든지 재가입이 가능합니다.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-5">
                <h3 className="font-bold mb-2">Q. 환불 수수료가 있나요?</h3>
                <p className="text-sm text-white/70">
                  A. 회사 귀책사유가 아닌 경우, 결제 수수료(약 3.3%)는 공제하고 환불됩니다.
                </p>
              </div>
            </div>
          </section>

          {/* 부칙 */}
          <section className="bg-brand-neon-pink/10 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-2">부칙</h2>
            <p className="text-white/70">본 환불 정책은 2024년 11월 14일부터 시행됩니다.</p>
          </section>
        </div>
      </main>
    </div>
  );
}

