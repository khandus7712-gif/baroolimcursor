/**
 * 결제 성공 페이지
 */

'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderInfo, setOrderInfo] = useState<any>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams?.get('paymentKey');
      const orderId = searchParams?.get('orderId');
      const amount = searchParams?.get('amount');

      if (!paymentKey || !orderId || !amount) {
        setError('결제 정보가 올바르지 않습니다.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount),
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || '결제 승인에 실패했습니다.');
        }

        const data = await response.json();
        setOrderInfo(data);
      } catch (err) {
        console.error('Payment confirmation error:', err);
        setError(err instanceof Error ? err.message : '결제 처리 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-neon-purple border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-xl">결제를 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="bg-red-500/20 backdrop-blur-xl rounded-3xl border border-red-500/50 p-12 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-white mb-4">결제 실패</h1>
            <p className="text-red-200 mb-8">{error}</p>
            <button
              onClick={() => router.push('/pricing')}
              className="w-full bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-6 py-4 rounded-xl font-bold text-white hover:shadow-lg transition-all"
            >
              다시 시도하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-12 text-center shadow-[0_0_40px_rgba(168,85,247,0.3)]">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-24 h-24 text-green-400 animate-bounce" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            결제 완료! 🎉
          </h1>
          
          <p className="text-white/70 text-lg mb-8">
            구독이 성공적으로 시작되었습니다.<br />
            이제 모든 기능을 사용하실 수 있습니다!
          </p>

          {orderInfo && (
            <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
              <div className="space-y-3">
                <div className="flex justify-between text-white/70">
                  <span>플랜</span>
                  <span className="text-white font-semibold">{orderInfo.planName}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>금액</span>
                  <span className="text-white font-semibold">₩{orderInfo.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>주문번호</span>
                  <span className="text-white font-mono text-sm">{orderInfo.orderId}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => router.push('/studio')}
              className="w-full bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-6 py-4 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-brand-neon-purple/50 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              콘텐츠 생성하러 가기
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => router.push('/mypage')}
              className="w-full bg-white/10 hover:bg-white/20 px-6 py-4 rounded-xl font-bold text-white transition-all"
            >
              마이페이지에서 확인하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-neon-purple border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-xl">로딩 중...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

