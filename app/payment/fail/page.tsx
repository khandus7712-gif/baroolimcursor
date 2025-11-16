/**
 * 결제 실패 페이지
 */

'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

function PaymentFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const errorMessage = searchParams?.get('message') || '결제에 실패했습니다.';
  const errorCode = searchParams?.get('code');

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-12 text-center">
          <div className="flex justify-center mb-6">
            <XCircle className="w-24 h-24 text-red-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            결제 실패
          </h1>
          
          <p className="text-white/70 text-lg mb-4">
            {errorMessage}
          </p>

          {errorCode && (
            <p className="text-white/50 text-sm mb-8">
              오류 코드: {errorCode}
            </p>
          )}

          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-8 text-left">
            <div className="text-yellow-200 text-sm">
              <div className="font-semibold mb-2">일반적인 실패 원인:</div>
              <ul className="space-y-1 text-yellow-200/80">
                <li>• 카드 한도 초과</li>
                <li>• 잘못된 카드 정보</li>
                <li>• 네트워크 오류</li>
                <li>• 결제 취소 (사용자)</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/pricing')}
              className="w-full bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-6 py-4 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-brand-neon-purple/50 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              다시 시도하기
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-white/10 hover:bg-white/20 px-6 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              홈으로 돌아가기
            </button>
          </div>

          <div className="mt-8 text-white/60 text-sm">
            문제가 계속되면{' '}
            <a href="mailto:pernar.go@gmail.com" className="text-brand-neon-purple hover:underline">
              고객센터
            </a>
            로 문의해주세요.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  );
}

