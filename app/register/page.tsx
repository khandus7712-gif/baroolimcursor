/**
 * 회원가입 페이지
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

function RegisterPageContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // 이벤트 전파 중단
    
    console.log('🔵 회원가입 시작:', { email, name, passwordLength: password.length });

    setIsLoading(true);
    setError('');
    setSuccess(false);

    // 입력 검증
    if (!email || !password || !confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = '/api/register';
      console.log('🔵 [REGISTER] 요청 URL:', apiUrl);
      console.log('🔵 [REGISTER] 요청 데이터:', { email, name, passwordLength: password.length });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name: name || undefined,
        }),
      });
      
      console.log('🔵 [REGISTER] 전체 Response URL:', response.url);

      // 응답 텍스트 먼저 확인
      const responseText = await response.text();
      console.log('🔵 [REGISTER] 응답 상태:', response.status, '응답 본문:', responseText);

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('🔴 [REGISTER] JSON 파싱 오류:', parseError, '원본 응답:', responseText);
        throw new Error('서버 응답을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.');
      }

      if (!response.ok) {
        throw new Error(data.error || `회원가입에 실패했습니다. (${response.status})`);
      }

      console.log('✅ 회원가입 성공:', data);
      setSuccess(true);
      
      // 로그인 페이지로 즉시 리다이렉트 (replace 사용)
      router.replace('/login?registered=true');
      return;
    } catch (err) {
      console.error('🔴 회원가입 오류:', err);
      setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* 로고 */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/logo.svg" 
              alt="바로올림" 
              className="w-12 h-12 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]"
            />
            <span className="text-4xl font-black text-white">바로올림</span>
          </div>
          <p className="text-white/70 text-lg">
            AI 마케팅 콘텐츠 자동 생성
          </p>
        </div>

        {/* 회원가입 카드 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
          <h1 className="text-3xl font-bold text-white mb-2">회원가입</h1>
          <p className="text-white/70 mb-8">
            30초 만에 시작하세요
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-sm">
              회원가입이 완료되었습니다! 로그인 페이지로 이동합니다...
            </div>
          )}

          {isLoading && (
            <div className="mb-6 p-4 bg-brand-neon-purple/20 border border-brand-neon-purple/50 rounded-xl text-brand-neon-purple text-sm flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-neon-purple border-t-transparent"></div>
              회원가입 중... 잠시만 기다려주세요
            </div>
          )}

          {/* 회원가입 폼 */}
          <form 
            onSubmit={handleRegister} 
            noValidate 
            className="space-y-4"
            onInvalid={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div>
              <label className="block text-white/90 font-medium mb-2 text-sm">
                이름 (선택사항)
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-neon-purple focus:ring-2 focus:ring-brand-neon-purple/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/90 font-medium mb-2 text-sm">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-neon-purple focus:ring-2 focus:ring-brand-neon-purple/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/90 font-medium mb-2 text-sm">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="최소 6자 이상"
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-neon-purple focus:ring-2 focus:ring-brand-neon-purple/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/90 font-medium mb-2 text-sm">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-neon-purple focus:ring-2 focus:ring-brand-neon-purple/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-6 py-4 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-brand-neon-purple/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '회원가입 중...' : success ? '완료!' : '회원가입'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* 로그인 링크 */}
          <p className="mt-6 text-center text-white/60 text-sm">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-brand-neon-purple hover:underline font-medium"
            >
              로그인
            </button>
          </p>

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

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  );
}


