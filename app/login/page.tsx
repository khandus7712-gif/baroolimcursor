/**
 * 로그인/회원가입 페이지
 */

'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';

// 동적 렌더링 강제 (useSearchParams 사용)
export const dynamic = 'force-dynamic';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const callbackUrl = searchParams?.get('callbackUrl') || '/studio';
  const errorParam = searchParams?.get('error');

  // URL 파라미터에서 에러 확인
  useEffect(() => {
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        'Configuration': '서버 설정 오류가 발생했습니다. 관리자에게 문의하세요.',
        'AccessDenied': '로그인 접근이 거부되었습니다.',
        'Verification': '인증 오류가 발생했습니다. 다시 시도해주세요.',
        'OAuthSignin': 'OAuth 로그인 초기화 오류가 발생했습니다.',
        'OAuthCallback': 'OAuth 콜백 처리 오류가 발생했습니다.',
        'OAuthCreateAccount': '계정 생성 오류가 발생했습니다.',
        'EmailCreateAccount': '이메일 계정 생성 오류가 발생했습니다.',
        'Callback': '콜백 처리 오류가 발생했습니다.',
        'OAuthAccountNotLinked': '이 이메일은 다른 계정과 연결되어 있습니다.',
        'EmailSignin': '이메일 로그인 오류가 발생했습니다.',
        'CredentialsSignin': '로그인 정보가 올바르지 않습니다.',
        'SessionRequired': '로그인이 필요합니다.',
      };
      setError(errorMessages[errorParam] || `로그인 오류: ${errorParam}`);
    }
  }, [errorParam]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔵 이메일 로그인 시작:', { email });
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password: 'temp', // 임시 비밀번호 (나중에 제대로 구현)
        redirect: false,
      });

      console.log('🔵 이메일 로그인 결과:', result);

      if (result?.error) {
        console.error('🔴 이메일 로그인 오류:', result.error);
        setError(`로그인에 실패했습니다: ${result.error}`);
        setIsLoading(false);
      } else if (result?.ok) {
        console.log('✅ 이메일 로그인 성공');
        router.push(callbackUrl);
        router.refresh();
      } else {
        console.log('⚠️ 예상치 못한 결과:', result);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('🔴 이메일 로그인 예외:', err);
      setError(`로그인 중 오류가 발생했습니다: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('🔵 Google 로그인 버튼 클릭됨');
    setIsLoading(true);
    setError('');
    try {
      console.log('🔵 signIn 함수 호출 중...', { callbackUrl });
      // redirect: true로 변경하여 NextAuth가 자동으로 OAuth 플로우 처리
      await signIn('google', { 
        callbackUrl,
        redirect: true, // OAuth 플로우를 위해 true로 변경
      });
      // redirect: true이면 여기까지 오지 않음 (자동으로 Google로 리다이렉트됨)
    } catch (err) {
      console.error('🔴 Google login error:', err);
      setError('Google 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  const handleKakaoSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log('🟡 카카오 로그인 시작...');
      // redirect: true로 변경하여 자동 리다이렉트
      await signIn('kakao', { 
        callbackUrl,
        redirect: true,
      });
      // redirect: true이면 여기까지 오지 않음
    } catch (err) {
      console.error('Kakao login error:', err);
      setError('카카오 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* 로고 */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-brand-neon-purple drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
            <span className="text-4xl font-black text-white">바로올림</span>
          </div>
          <p className="text-white/70 text-lg">
            AI 마케팅 콘텐츠 자동 생성
          </p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
          <h1 className="text-3xl font-bold text-white mb-2">로그인</h1>
          <p className="text-white/70 mb-8">
            30초 만에 시작하세요
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="mb-6 p-4 bg-brand-neon-purple/20 border border-brand-neon-purple/50 rounded-xl text-brand-neon-purple text-sm flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-neon-purple border-t-transparent"></div>
              로그인 중... 잠시만 기다려주세요
            </div>
          )}

          {/* Google 로그인 */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google로 시작하기
          </button>

          {/* Kakao 로그인 */}
          <button
            onClick={handleKakaoSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#FEE500] text-[#000000]/85 px-6 py-4 rounded-xl font-bold hover:bg-[#FDD835] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 3C6.5 3 2 6.58 2 11c0 2.78 1.78 5.22 4.47 6.65-.2.7-.8 2.99-.92 3.46-.13.54.2.53.42.39.17-.11 2.75-1.85 3.18-2.19C10.38 19.63 11.18 19 12 19c5.5 0 10-3.58 10-8s-4.5-8-10-8z"
              />
            </svg>
            카카오톡으로 시작하기
          </button>

          {/* 구분선 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/60">또는 이메일로</span>
            </div>
          </div>

          {/* 이메일 로그인 폼 */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="block text-white/90 font-medium mb-2 text-sm">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-neon-purple focus:ring-2 focus:ring-brand-neon-purple/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-6 py-4 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-brand-neon-purple/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '로그인 중...' : '이메일로 시작하기'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* 안내 텍스트 */}
          <p className="mt-6 text-center text-white/60 text-sm">
            가입하거나 로그인하면{' '}
            <button
              onClick={() => router.push('/terms-of-service')}
              className="text-brand-neon-purple hover:underline"
            >
              서비스 이용약관
            </button>
            과{' '}
            <button
              onClick={() => router.push('/privacy-policy')}
              className="text-brand-neon-purple hover:underline"
            >
              개인정보처리방침
            </button>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>

        {/* 홈으로 돌아가기 */}
        <button
          onClick={() => router.push('/')}
          className="mt-6 w-full text-white/70 hover:text-white transition-colors text-center py-3"
        >
          ← 홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}

