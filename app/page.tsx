/**
 * 랜딩 페이지 - 다크 프리미엄 버전
 * 네온 글로우 + 3D 플로팅 효과
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  Smartphone, MessageCircle, Camera, Sparkles, ArrowRight, 
  Zap, Clock, TrendingUp, Users, Check, PlayCircle,
  Instagram, Globe, Hash, Star, X, LogOut, User
} from 'lucide-react';

interface UserProfile {
  plan: string;
  totalGenerations: number;
  monthlyGenerationCount: number;
  lastGenerationMonth: string | null;
}

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 사용자 프로필 정보 가져오기
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetch('/api/user/plan')
        .then(res => res.json())
        .then(data => {
          if (data.plan !== undefined) {
            setUserProfile({
              plan: data.plan,
              totalGenerations: data.totalGenerations || 0,
              monthlyGenerationCount: data.monthlyGenerationCount || 0,
              lastGenerationMonth: data.lastGenerationMonth,
            });
          }
        })
        .catch(err => console.error('Failed to fetch user plan:', err));
    } else {
      setUserProfile(null);
    }
  }, [status, session]);

  // 잔여 횟수 계산
  const getRemainingCount = (): number | null => {
    if (!userProfile) return null;

    if (userProfile.plan === 'FREE') {
      return 5 - userProfile.totalGenerations;
    } else {
      const limits: Record<string, number> = {
        BASIC: 150, // Starter: 월 150개
        PRO: 400, // Growth: 월 400개
      };
      const limit = limits[userProfile.plan] || 0;
      
      // 월 체크
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      currentMonth.setHours(0, 0, 0, 0);
      let monthlyCount = userProfile.monthlyGenerationCount;
      
      if (userProfile.lastGenerationMonth) {
        const lastMonth = new Date(userProfile.lastGenerationMonth);
        lastMonth.setHours(0, 0, 0, 0);
        if (lastMonth.getTime() !== currentMonth.getTime()) {
          monthlyCount = 0; // 월이 바뀌었으면 0
        }
      }
      
      return limit - monthlyCount;
    }
  };

  const remainingCount = getRemainingCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white overflow-hidden">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.svg" 
              alt="바로올림" 
              className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
            />
            <span className="text-xl sm:text-2xl font-black text-white">바로올림</span>
          </div>
          
          {/* 데스크톱 메뉴 */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => router.push('/waitlist')}
              className="text-white/80 hover:text-white transition-colors px-4 py-2 font-medium relative group"
            >
              <span className="relative">
                🎉 사전예약
                <span className="absolute -top-1 -right-6 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">NEW</span>
              </span>
            </button>
            <button
              onClick={() => router.push('/pricing')}
              className="text-white/80 hover:text-white transition-colors px-4 py-2 font-medium"
            >
              💰 요금제
            </button>
            <button
              onClick={() => router.push('/scheduled')}
              className="text-white/80 hover:text-white transition-colors px-4 py-2 font-medium"
            >
              📅 예약 관리
            </button>
            
            {/* 로그인 상태에 따른 조건부 렌더링 */}
            {!mounted || status === 'loading' ? (
              // 로딩 중이거나 마운트 전에는 로그인 버튼을 즉시 보여줌
              <button
                onClick={() => router.push('/login')}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-4 py-2 font-medium"
              >
                <User className="w-4 h-4" />
                로그인
              </button>
            ) : session ? (
              <>
                {/* 로그인된 경우 */}
                <button
                  onClick={() => router.push('/mypage')}
                  className="flex items-center gap-2 text-white/90 hover:text-white px-4 py-2 font-medium rounded-lg hover:bg-white/10 transition-all group"
                >
                  <User className="w-4 h-4" />
                  <span>{session.user?.name || session.user?.email?.split('@')[0]}</span>
                  {remainingCount !== null && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      remainingCount <= 1 ? 'bg-red-500/20 text-red-300' :
                      remainingCount <= 3 ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {remainingCount}회 남음
                    </span>
                  )}
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-4 py-2 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </>
            ) : (
              <>
                {/* 로그인 안 된 경우 */}
                <button
                  onClick={() => router.push('/login')}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-4 py-2 font-medium"
                >
                  <User className="w-4 h-4" />
                  로그인
                </button>
              </>
            )}
            
            <button 
              onClick={() => router.push('/studio')}
              className="bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-6 py-2 rounded-full font-bold text-white hover:shadow-lg hover:shadow-brand-neon-purple/50 transition-all hover:scale-105"
            >
              시작하기
            </button>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="lg:hidden flex items-center gap-2">
            <button 
              onClick={() => router.push('/studio')}
              className="bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-4 py-2 rounded-full font-bold text-white text-sm"
            >
              시작
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="메뉴"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 드롭다운 메뉴 */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              <button
                onClick={() => { router.push('/waitlist'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-white font-medium flex items-center justify-between"
              >
                <span>🎉 사전예약</span>
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
              </button>
              <button
                onClick={() => { router.push('/pricing'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-white font-medium"
              >
                💰 요금제
              </button>
              <button
                onClick={() => { router.push('/scheduled'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-white font-medium"
              >
                📅 예약 관리
              </button>
              {status === 'loading' ? (
                <div className="px-4 py-3 text-white/60">로딩 중...</div>
              ) : session ? (
                <>
                  <button
                    onClick={() => { router.push('/mypage'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-white font-medium border-t border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{session.user?.name || session.user?.email?.split('@')[0]}</span>
                    </div>
                    {remainingCount !== null && (
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        remainingCount <= 1 ? 'bg-red-500/20 text-red-300' :
                        remainingCount <= 3 ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {remainingCount}회
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-red-400 font-medium flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { router.push('/login'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-white font-medium flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  로그인
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 히어로 섹션 */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* 배경 글로우 효과 */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-neon-purple/20 rounded-full blur-[120px] animate-pulse-slow"></div>
          
          {/* 초대형 타이포그래피 */}
          <div className="relative z-10 mb-8 animate-fade-in">
            {/* 메인 타이틀 - 감성 메시지 */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black mb-6 sm:mb-8 leading-tight">
              <div className="text-white/90 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] mb-2 sm:mb-4">
                사장님,
              </div>
              <div className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] mb-2 sm:mb-4">
                콘텐츠는 제가 만들게요.
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]">
                <span>사장님은 장사만 하세요</span>
                <span className="text-5xl sm:text-6xl lg:text-8xl">😊</span>
              </div>
            </h1>
            
            {/* 서브 타이틀 */}
            <p className="text-xl sm:text-2xl lg:text-4xl text-white/80 mb-8 sm:mb-12 font-medium drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              30초면 충분합니다.
            </p>

            {/* Before/After 비교 카드 */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Before */}
                <div className="bg-red-900/30 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-red-500/30 hover:border-red-500/50 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <X className="w-5 h-5 text-red-400" />
                    <span className="font-bold text-red-300 text-base sm:text-lg">직접 작성 시</span>
                  </div>
                  <div className="text-xs sm:text-sm text-white/70 space-y-2 text-left">
                    <div>✏️ 뭐라고 써야 할지 고민... (10분)</div>
                    <div>📸 사진 편집... (5분)</div>
                    <div>🔤 해시태그 검색... (5분)</div>
                    <div>📱 각 플랫폼마다 다시 수정... (10분)</div>
                  </div>
                  <div className="mt-4 text-red-400 font-black text-lg sm:text-xl">
                    총 30분 소요 😰
                  </div>
                </div>
                
                {/* After */}
                <div className="bg-green-900/30 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-green-500/30 hover:border-green-500/50 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                    바로올림
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="font-bold text-green-300 text-base sm:text-lg">AI 자동 생성</span>
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 space-y-2 text-left">
                    <div>📸 사진 1장 업로드 (10초)</div>
                    <div>✍️ 간단 메모 입력 (10초)</div>
                    <div>🤖 AI가 4개 플랫폼 콘텐츠 생성 (3초)</div>
                    <div>✨ 해시태그 자동 포함!</div>
                  </div>
                  <div className="mt-4 text-green-400 font-black text-lg sm:text-xl">
                    총 30초 완성! 🎉
                  </div>
                </div>
              </div>
            </div>

            {/* 메인 CTA */}
            <button
              onClick={() => router.push('/studio')}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-10 py-6 rounded-2xl text-xl font-black text-white shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:shadow-[0_0_60px_rgba(168,85,247,0.8)] transition-all duration-300 hover:scale-105 mb-4"
            >
              <PlayCircle className="w-8 h-8" />
              <span>30초 만에 시작하기</span>
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>
            
            <p className="text-white/70 text-lg font-medium">
              무료 체험 • 카드 등록 불필요
            </p>
          </div>

          {/* 떠다니는 3D 콘텐츠 카드들 */}
          <div className="relative z-10 mt-20 h-[400px]">
            {/* 카드 1 - Instagram */}
            <div 
              className="absolute top-0 left-1/4 w-64 h-80 bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-xl rounded-3xl border border-white/30 shadow-[0_0_40px_rgba(168,85,247,0.6)] animate-float p-6"
              style={{ animationDelay: '0s' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Instagram className="w-8 h-8 text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                <span className="font-bold text-lg text-white">Instagram</span>
              </div>
              <div className="space-y-3 text-sm text-white/90">
                <div className="bg-white/20 rounded-lg p-3 border border-white/20">
                  🍜 겨울 보양식의 정석!
                </div>
                <div className="bg-white/20 rounded-lg p-3 border border-white/20">
                  부드러운 아롱사태와...
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-brand-neon-cyan text-xs font-bold">#맛집</span>
                  <span className="text-brand-neon-cyan text-xs font-bold">#강남</span>
                  <span className="text-brand-neon-cyan text-xs font-bold">#점심</span>
                </div>
              </div>
            </div>

            {/* 카드 2 - Blog */}
            <div 
              className="absolute top-10 right-1/4 w-64 h-80 bg-gradient-to-br from-blue-900/90 to-cyan-900/90 backdrop-blur-xl rounded-3xl border border-white/30 shadow-[0_0_40px_rgba(59,130,246,0.6)] animate-float p-6"
              style={{ animationDelay: '2s' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-8 h-8 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                <span className="font-bold text-lg text-white">Blog</span>
              </div>
              <div className="space-y-3 text-sm text-white/90">
                <div className="bg-white/20 rounded-lg p-3 border border-white/20">
                  안녕하세요 사장님들!
                </div>
                <div className="bg-white/20 rounded-lg p-3 border border-white/20">
                  오늘은 특별한 메뉴를...
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-xs border border-white/20">
                  자세한 내용 보기 →
                </div>
              </div>
            </div>

            {/* 카드 3 - Threads */}
            <div 
              className="absolute top-32 left-1/3 w-64 h-80 bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-xl rounded-3xl border border-white/30 shadow-[0_0_40px_rgba(168,85,247,0.6)] animate-float p-6"
              style={{ animationDelay: '4s' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Hash className="w-8 h-8 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                <span className="font-bold text-lg text-white">Threads</span>
              </div>
              <div className="space-y-3 text-sm text-white/90">
                <div className="bg-white/20 rounded-lg p-3 border border-white/20">
                  💬 오늘 점심 추천!
                </div>
                <div className="bg-white/20 rounded-lg p-3 border border-white/20">
                  짧고 임팩트 있게...
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs border border-white/20 bg-white/20 rounded-lg p-2">
                  <Users className="w-4 h-4" />
                  <span>432명이 봤어요</span>
                </div>
              </div>
            </div>

            {/* 중앙 빛나는 아이콘들 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-neon-purple/30 rounded-full blur-3xl w-40 h-40 animate-pulse"></div>
                <div className="relative flex items-center justify-center gap-6">
                  <Smartphone className="w-16 h-16 text-brand-neon-purple animate-float" style={{ animationDelay: '0s' }} />
                  <MessageCircle className="w-16 h-16 text-brand-neon-pink animate-float" style={{ animationDelay: '1s' }} />
                  <Camera className="w-16 h-16 text-brand-neon-cyan animate-float" style={{ animationDelay: '2s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-20 px-6 bg-black/30 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-105 transition-transform">
              <div className="text-6xl font-black mb-3 text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
                3초
              </div>
              <div className="text-white/80 text-lg font-medium">콘텐츠 생성 시간</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="text-6xl font-black mb-3 text-white drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
                4개
              </div>
              <div className="text-white/80 text-lg font-medium">플랫폼 동시 지원</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="text-6xl font-black mb-3 text-white drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
                100%
              </div>
              <div className="text-white/80 text-lg font-medium">무료로 시작</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="text-6xl font-black mb-3 text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                24/7
              </div>
              <div className="text-white/80 text-lg font-medium">연중무휴 생성</div>
            </div>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-16 text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]">
            왜 바로올림인가요?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 특징 1 */}
            <div className="group relative bg-gradient-to-br from-purple-900/50 to-purple-900/20 backdrop-blur-xl rounded-3xl border border-white/20 p-8 hover:border-brand-neon-purple/70 transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-neon-purple/0 to-brand-neon-purple/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <Zap className="w-16 h-16 text-brand-neon-purple mb-6 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                <h3 className="text-2xl font-bold mb-4 text-white">3초 생성</h3>
                <p className="text-white/80 text-base leading-relaxed">
                  사진 한 장과 간단한 메모만 있으면 AI가 즉시 프로급 콘텐츠를 생성합니다
                </p>
              </div>
            </div>

            {/* 특징 2 */}
            <div className="group relative bg-gradient-to-br from-pink-900/50 to-pink-900/20 backdrop-blur-xl rounded-3xl border border-white/20 p-8 hover:border-brand-neon-pink/70 transition-all hover:shadow-[0_0_40px_rgba(236,72,153,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-neon-pink/0 to-brand-neon-pink/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <Users className="w-16 h-16 text-brand-neon-pink mb-6 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                <h3 className="text-2xl font-bold mb-4 text-white">멀티 플랫폼</h3>
                <p className="text-white/80 text-base leading-relaxed">
                  Instagram, Blog, Threads, Google 등 4개 플랫폼에 동시 배포 가능
                </p>
              </div>
            </div>

            {/* 특징 3 */}
            <div className="group relative bg-gradient-to-br from-cyan-900/50 to-cyan-900/20 backdrop-blur-xl rounded-3xl border border-white/20 p-8 hover:border-brand-neon-cyan/70 transition-all hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-neon-cyan/0 to-brand-neon-cyan/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <img 
                  src="/logo.svg" 
                  alt="바로올림" 
                  className="w-16 h-16 mb-6 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                />
                <h3 className="text-2xl font-bold mb-4 text-white">AI 최적화</h3>
                <p className="text-white/80 text-base leading-relaxed">
                  업종별 특화된 AI가 해시태그, 이모지, 톤앤매너까지 자동 최적화
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 최종 CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-purple-900/70 to-pink-900/70 backdrop-blur-xl rounded-3xl border border-white/30 p-12 shadow-[0_0_60px_rgba(168,85,247,0.6)]">
            {/* 반짝이는 별들 */}
            <Sparkles className="absolute top-8 left-8 w-6 h-6 text-brand-neon-purple animate-pulse drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            <Sparkles className="absolute top-8 right-8 w-6 h-6 text-brand-neon-pink animate-pulse drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="absolute bottom-8 left-16 w-6 h-6 text-brand-neon-cyan animate-pulse drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{ animationDelay: '1s' }} />
            <Sparkles className="absolute bottom-8 right-16 w-6 h-6 text-brand-neon-blue animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{ animationDelay: '1.5s' }} />
            
            <h2 className="text-4xl sm:text-5xl font-black mb-6 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-white/90 mb-10 font-medium">
              30초 후, 당신의 첫 마케팅 콘텐츠가 완성됩니다
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => router.push('/studio')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-8 sm:px-12 py-4 sm:py-6 rounded-2xl text-lg sm:text-xl font-black text-white shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:shadow-[0_0_60px_rgba(168,85,247,0.8)] transition-all duration-300 hover:scale-105"
              >
                <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                <span>무료로 시작하기</span>
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              
              <button
                onClick={() => router.push('/waitlist')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm border-2 border-brand-neon-purple px-8 sm:px-12 py-4 sm:py-6 rounded-2xl text-lg sm:text-xl font-black text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 relative group"
              >
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">특별혜택</span>
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
                <span>사전예약하기</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black/50">
        <div className="max-w-6xl mx-auto">
          {/* 푸터 메뉴 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
            {/* 회사 정보 */}
            <div>
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-neon-purple" />
                바로올림
              </h3>
              <p className="text-sm text-white/60">
                AI 기반 마케팅 콘텐츠<br />
                자동 생성 플랫폼
              </p>
            </div>

            {/* 서비스 */}
            <div>
              <h3 className="font-bold text-white mb-4">서비스</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li>
                  <button onClick={() => router.push('/studio')} className="hover:text-white transition-colors">
                    콘텐츠 생성
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/scheduled')} className="hover:text-white transition-colors">
                    예약 관리
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/pricing')} className="hover:text-white transition-colors">
                    요금제 안내
                  </button>
                </li>
              </ul>
            </div>

            {/* 정책 */}
            <div>
              <h3 className="font-bold text-white mb-4">정책</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li>
                  <button onClick={() => router.push('/privacy-policy')} className="hover:text-white transition-colors">
                    개인정보처리방침
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/terms-of-service')} className="hover:text-white transition-colors">
                    서비스 이용약관
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/refund-policy')} className="hover:text-white transition-colors">
                    환불 정책
                  </button>
                </li>
              </ul>
            </div>

            {/* 고객센터 */}
            <div>
              <h3 className="font-bold text-white mb-4">고객센터</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li>
                  이메일:<br />
                  <a href="mailto:pernar.go@gmail.com" className="hover:text-white transition-colors">
                    pernar.go@gmail.com
                  </a>
                </li>
                <li>
                  전화:<br />
                  <a href="tel:010-5850-1255" className="hover:text-white transition-colors">
                    010-5850-1255
                  </a>
                </li>
                <li className="text-xs text-white/40">
                  평일 09:00-18:00<br />
                  (주말 및 공휴일 제외)
                </li>
              </ul>
            </div>
          </div>

          {/* 하단 링크 (토스페이먼츠 승인용) */}
          <div className="border-t border-white/10 pt-6 mb-6">
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
              <button onClick={() => router.push('/privacy-policy')} className="hover:text-white transition-colors">
                개인정보처리방침
              </button>
              <span>|</span>
              <button onClick={() => router.push('/terms-of-service')} className="hover:text-white transition-colors">
                서비스 이용약관
              </button>
              <span>|</span>
              <button onClick={() => router.push('/refund-policy')} className="hover:text-white transition-colors">
                환불 정책
              </button>
            </div>
          </div>

          {/* 저작권 */}
          <div className="text-center text-white/60">
            <p className="text-base mb-2">© 2025 바로올림 | AI 마케팅 콘텐츠 생성 플랫폼</p>
            <p className="text-sm">Made with ❤️ by Baroolim Team</p>
            <p className="text-xs mt-4 text-white/40">
              상호: 바디편한 | 대표: 이주연 | 사업자등록번호: 308-32-01281<br />
              경남 창원시 의창구 북면 동곡로 33, 101-1304<br />
              전화: 010-5850-1255 | 이메일: pernar.go@gmail.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
