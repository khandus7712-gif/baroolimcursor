/**
 * 결제 페이지
 * 토스페이먼츠 연동
 */

'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Sparkles, Check, CreditCard, Shield, Zap, Star } from 'lucide-react';
import { loadTossPayments } from '@tosspayments/payment-sdk';

interface Plan {
  id: string;
  name: string;
  price: number;
  billingType: 'monthly' | 'single';
  dailyLimit: number | null;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'SINGLE_CONTENT',
    name: '단건 콘텐츠',
    price: 990,
    billingType: 'single',
    dailyLimit: null,
    features: ['원하는 콘텐츠 한 건만 즉시 구매', '결제 후 바로 콘텐츠 생성 가능', '필요할 때마다 유연하게 이용'],
  },
  {
    id: 'LITE',
    name: 'Lite',
    price: 9900,
    billingType: 'monthly',
    dailyLimit: null,
    features: ['월 30개 생성', '모든 플랫폼 지원', '모든 기능 사용', '예약 발행', '기능 제한 없음'],
  },
  {
    id: 'BASIC',
    name: '베이직',
    price: 29900,
    billingType: 'monthly',
    dailyLimit: 3,
    features: ['하루 3개 생성', '모든 플랫폼 지원', '고급 AI 기능', '이메일 지원', '예약 발행'],
  },
  {
    id: 'PRO',
    name: '프로',
    price: 49900,
    billingType: 'monthly',
    dailyLimit: 10,
    features: ['하루 10개 생성', '모든 플랫폼 지원', '프리미엄 AI', '우선 지원', '예약 발행', '분석 리포트'],
    popular: true,
  },
  {
    id: 'ENTERPRISE',
    name: '엔터프라이즈',
    price: 79900,
    billingType: 'monthly',
    dailyLimit: 30,
    features: ['하루 30개 생성', '무제한 플랫폼', '커스텀 AI', '전담 매니저', '예약 발행', '고급 분석', 'API 제공'],
  },
];

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/payment');
    }
  }, [status, router]);

  useEffect(() => {
    const planId = searchParams?.get('plan');
    if (planId) {
      const plan = PLANS.find(p => p.id === planId);
      if (plan) {
        setSelectedPlan(plan);
      }
    }
  }, [searchParams]);

  const handlePayment = async () => {
    if (!selectedPlan || !session) return;

    setLoading(true);
    setError('');

    try {
      // 1. 결제 준비 API 호출
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          amount: selectedPlan.price,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '결제 준비에 실패했습니다.');
      }

      const { orderId, orderName, amount } = await response.json();

      // 2. 토스페이먼츠 SDK 로드
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      
      if (!clientKey) {
        throw new Error('결제 시스템 설정이 완료되지 않았습니다. 관리자에게 문의하세요.');
      }

      const tossPayments = await loadTossPayments(clientKey);

      // 3. 결제창 열기
      await tossPayments.requestPayment('카드', {
        amount,
        orderId,
        orderName,
        customerName: session.user.name || session.user.email || '고객',
        customerEmail: session.user.email ?? undefined,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : '결제 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const priceLabel =
    selectedPlan?.billingType === 'monthly' ? '월 결제 금액' : '단건 결제 금액';
  const priceValue = selectedPlan
    ? `₩${selectedPlan.price.toLocaleString()}`
    : '';

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-brand-neon-purple" />
            <h1 className="text-4xl font-black text-white">결제하기</h1>
          </div>
          <p className="text-white/70 text-lg">
            안전하고 간편한 토스페이먼츠로 결제하세요
          </p>
        </div>

        {error && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 text-red-200">
              <div className="font-semibold mb-2">결제 오류</div>
              <div>{error}</div>
              <button
                onClick={() => setError('')}
                className="mt-4 text-red-300 hover:text-red-100 underline"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}

        {!selectedPlan ? (
          /* 플랜 선택 */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white/10 backdrop-blur-xl rounded-3xl border-2 p-8 relative ${
                  plan.popular 
                    ? 'border-brand-neon-purple bg-brand-neon-purple/5 scale-105'
                    : 'border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-6 py-2 rounded-full text-white font-bold text-sm">
                    인기
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-black text-brand-neon-purple mb-2">
                    {plan.billingType === 'monthly'
                      ? `₩${(plan.price / 1000).toFixed(0)}K`
                      : `₩${plan.price.toLocaleString()}`}
                  </div>
                  <div className="text-white/60 text-sm">
                    {plan.billingType === 'monthly' ? '/월' : '한 건당'}
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-white/80">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink text-white hover:shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  선택하기
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* 결제 확인 */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">주문 확인</h2>
              
              <div className="bg-white/5 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="text-white/60 text-sm mb-1">선택한 플랜</div>
                    <div className="text-2xl font-bold text-white">{selectedPlan.name}</div>
                  </div>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="text-white/60 hover:text-white text-sm underline"
                  >
                    변경
                  </button>
                </div>
                
                <div className="space-y-3 mb-6">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/70 text-sm">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-white text-lg font-semibold">{priceLabel}</span>
                  <span className="text-3xl font-black text-brand-neon-purple">
                    {priceValue}
                  </span>
                </div>
              </div>

              {/* 안내사항 */}
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                  <div className="text-blue-200 text-sm">
                    <div className="font-semibold mb-1">안전한 결제</div>
                    <div className="text-blue-200/80">
                      토스페이먼츠를 통해 안전하게 결제됩니다. 
                      결제 정보는 암호화되어 전송되며 저희는 카드 정보를 저장하지 않습니다.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-6 text-white/70 text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>매월 자동 결제됩니다</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>언제든지 마이페이지에서 해지 가능합니다</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>첫 달은 사전예약 할인이 적용됩니다</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-8 py-5 rounded-xl font-bold text-white text-lg hover:shadow-lg hover:shadow-brand-neon-purple/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <CreditCard className="w-6 h-6" />
                {loading ? '결제 준비 중...' : '결제하기'}
                {!loading && <span>₩{selectedPlan.price.toLocaleString()}</span>}
              </button>
            </div>

            <div className="text-center text-white/60 text-sm">
              결제하면{' '}
              <button
                onClick={() => router.push('/terms-of-service')}
                className="text-brand-neon-purple hover:underline"
              >
                서비스 이용약관
              </button>
              과{' '}
              <button
                onClick={() => router.push('/refund-policy')}
                className="text-brand-neon-purple hover:underline"
              >
                환불 정책
              </button>
              에 동의하는 것으로 간주됩니다.
            </div>
          </div>
        )}

        {/* 결제 수단 안내 */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">지원하는 결제 수단</h3>
            <p className="text-white/60">토스페이먼츠로 다양한 방법으로 결제하세요</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <CreditCard className="w-8 h-8 text-brand-neon-purple mx-auto mb-2" />
              <div className="text-white text-sm font-semibold">신용/체크카드</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-white text-sm font-semibold">간편결제</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Star className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-white text-sm font-semibold">계좌이체</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-white text-sm font-semibold">안전결제</div>
            </div>
          </div>
        </div>

        {/* 홈으로 */}
        <button
          onClick={() => router.push('/')}
          className="mt-12 w-full text-white/70 hover:text-white transition-colors text-center py-3"
        >
          ← 홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

