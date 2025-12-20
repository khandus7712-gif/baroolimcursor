/**
 * 마이페이지
 * 사용자의 플랜, 사용량, 결제 내역 확인
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  User, Mail, Calendar, CreditCard, TrendingUp, Package,
  Settings, LogOut, Crown, Zap, Check, X, ArrowRight,
  Sparkles, FileText, Clock, AlertCircle, Star
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  planExpiry: string | null;
  totalGenerations: number;
  monthlyGenerationCount: number;
  lastGenerationMonth: string | null;
  createdAt: string;
}

interface PlanInfo {
  id: string;
  name: string;
  price: number;
  monthlyLimit: number | null;
  totalLimit: number | null;
  features: string[];
}

const PLANS: PlanInfo[] = [
  {
    id: 'FREE',
    name: '무료 플랜',
    price: 0,
    monthlyLimit: null,
    totalLimit: 5,
    features: ['평생 5회 무료', '모든 플랫폼 지원', '기본 AI 기능', '커뮤니티 지원']
  },
  {
    id: 'BASIC',
    name: 'Starter',
    price: 49900,
    monthlyLimit: 150,
    totalLimit: null,
    features: ['월 150개 생성', '모든 플랫폼 지원', '고급 AI 기능', '이메일 지원', '예약 발행']
  },
  {
    id: 'PRO',
    name: 'Growth',
    price: 79000,
    monthlyLimit: 400,
    totalLimit: null,
    features: ['월 400개 생성', '모든 플랫폼 지원', '프리미엄 AI', '우선 지원', '예약 발행', '분석 리포트']
  },
  {
    id: 'ENTERPRISE',
    name: '엔터프라이즈',
    price: 0,
    monthlyLimit: null,
    totalLimit: null,
    features: ['무제한 생성', '무제한 플랫폼', '커스텀 AI', '전담 매니저', '예약 발행', '고급 분석', 'API 제공']
  },
];

export default function MyPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/mypage');
    } else if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !profile) {
    return null;
  }

  const currentPlan = PLANS.find(p => p.id === profile.plan);
  const remainingGenerations = currentPlan?.totalLimit 
    ? currentPlan.totalLimit - profile.totalGenerations 
    : null;
  
  // 월간 제한 계산 (월이 바뀌었는지 확인)
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastGenMonth = profile.lastGenerationMonth ? new Date(profile.lastGenerationMonth) : null;
  const isNewMonth = !lastGenMonth || 
    lastGenMonth.getFullYear() !== currentMonth.getFullYear() || 
    lastGenMonth.getMonth() !== currentMonth.getMonth();
  
  const monthlyRemaining = currentPlan?.monthlyLimit && !isNewMonth
    ? currentPlan.monthlyLimit - profile.monthlyGenerationCount 
    : currentPlan?.monthlyLimit || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <User className="w-10 h-10 text-brand-neon-purple" />
              <h1 className="text-4xl font-black text-white">마이페이지</h1>
            </div>
            <p className="text-white/60">내 정보 및 사용 현황</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/studio')}
              className="bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-6 py-2 rounded-xl font-bold text-white hover:shadow-lg transition-all"
            >
              콘텐츠 생성하기
            </button>
          </div>
        </div>

        {/* 프로필 카드 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{profile.name || '사용자'}</h2>
              <div className="flex items-center gap-2 text-white/70 mb-3">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Calendar className="w-4 h-4" />
                <span>가입일: {format(new Date(profile.createdAt), 'yyyy년 MM월 dd일', { locale: ko })}</span>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors px-4 py-2"
            >
              <LogOut className="w-5 h-5" />
              로그아웃
            </button>
          </div>
        </div>

        {/* 현재 플랜 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-6">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Crown className="w-6 h-6 text-yellow-400" />
            현재 플랜
          </h3>
          
          {currentPlan && (
            <div className="bg-white/5 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-3xl font-black text-white mb-2">{currentPlan.name}</h4>
                  <p className="text-2xl font-bold text-brand-neon-purple">
                    {currentPlan.price === 0 ? '무료' : `₩${currentPlan.price.toLocaleString()}/월`}
                  </p>
                </div>
                {profile.plan !== 'FREE' && profile.planExpiry && (
                  <div className="text-right">
                    <div className="text-white/60 text-sm mb-1">만료일</div>
                    <div className="text-white font-semibold">
                      {format(new Date(profile.planExpiry), 'yyyy-MM-dd', { locale: ko })}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-white/80">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 사용량 */}
          <div className="space-y-4">
            {profile.plan === 'FREE' ? (
              // 무료 플랜 - 평생 횟수
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">남은 생성 횟수</span>
                  <span className="text-2xl font-bold text-white">
                    {remainingGenerations !== null ? remainingGenerations : 0} / 5회
                  </span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      remainingGenerations !== null && remainingGenerations <= 1 
                        ? 'bg-red-500' 
                        : 'bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink'
                    }`}
                    style={{ 
                      width: `${remainingGenerations !== null ? (remainingGenerations / 5) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                {remainingGenerations !== null && remainingGenerations <= 1 && (
                  <div className="mt-3 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="font-semibold">무료 횟수가 거의 소진되었습니다</div>
                    </div>
                    <div className="ml-7 space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-red-200/90">
                        <Check className="w-4 h-4 flex-shrink-0" />
                        <span>생성 제한 없이 사용</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-200/90">
                        <Check className="w-4 h-4 flex-shrink-0" />
                        <span>카드 등록은 결제 시에만 진행돼요</span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/pricing')}
                      className="ml-7 w-auto bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-6 py-2 rounded-lg font-semibold text-white hover:shadow-lg transition-all"
                    >
                      유료 플랜으로 계속하기
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // 유료 플랜 - 월간 제한
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">이번 달 남은 생성 횟수</span>
                  <span className="text-2xl font-bold text-white">
                    {monthlyRemaining !== null ? monthlyRemaining : 0} / {currentPlan?.monthlyLimit || 0}회
                  </span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      monthlyRemaining !== null && monthlyRemaining <= 0
                        ? 'bg-red-500'
                        : 'bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink'
                    }`}
                    style={{ 
                      width: `${monthlyRemaining !== null && currentPlan?.monthlyLimit 
                        ? Math.max(0, (monthlyRemaining / currentPlan.monthlyLimit) * 100)
                        : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="mt-3 text-white/60 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  다음 달 1일에 자동으로 충전됩니다
                </div>
                {monthlyRemaining !== null && monthlyRemaining <= 0 && (
                  <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                    <div className="mb-3">
                      <p className="text-yellow-200 text-sm mb-1">더 필요하신가요?</p>
                      <p className="text-yellow-200/80 text-sm">→ 상위 플랜으로 업그레이드하면 즉시 더 사용할 수 있어요.</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => router.push('/mypage')}
                        className="flex-1 px-4 py-2 border-2 border-yellow-300 text-yellow-200 rounded-lg font-semibold hover:bg-yellow-500/20 transition-all"
                      >
                        다음 달까지 기다리기
                      </button>
                      <button
                        onClick={() => router.push('/pricing')}
                        className="flex-1 bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-4 py-2 rounded-lg font-semibold text-white hover:shadow-lg transition-all"
                      >
                        플랜 업그레이드
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 총 생성 횟수 */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/80">
                  <FileText className="w-5 h-5" />
                  <span>전체 생성 횟수</span>
                </div>
                <span className="text-xl font-bold text-white">{profile.totalGenerations.toLocaleString()}회</span>
              </div>
            </div>
          </div>

          {/* 플랜 업그레이드 버튼 */}
          {profile.plan === 'FREE' && (
            <button
              onClick={() => router.push('/pricing')}
              className="w-full mt-6 bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-6 py-4 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-brand-neon-purple/50 transition-all flex items-center justify-center gap-2"
            >
              <Star className="w-5 h-5" />
              유료 플랜으로 계속하기
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 다른 플랜 보기 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-6">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Package className="w-6 h-6" />
            다른 플랜 둘러보기
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white/5 rounded-2xl p-6 border-2 transition-all ${
                  plan.id === profile.plan
                    ? 'border-brand-neon-purple bg-brand-neon-purple/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                  <p className="text-2xl font-black text-brand-neon-purple">
                    {plan.price === 0 ? '무료' : `₩${(plan.price / 1000).toFixed(0)}K`}
                  </p>
                </div>
                
                <div className="space-y-2 mb-6">
                  {plan.monthlyLimit && (
                    <div className="text-white/70 text-sm">월 {plan.monthlyLimit}개</div>
                  )}
                  {plan.totalLimit && (
                    <div className="text-white/70 text-sm">평생 {plan.totalLimit}회</div>
                  )}
                </div>

                {plan.id === profile.plan ? (
                  <div className="w-full bg-green-500/20 text-green-300 px-4 py-2 rounded-xl font-semibold text-center flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    현재 플랜
                  </div>
                ) : (
                  <button
                    onClick={() => router.push('/pricing')}
                    className="w-full bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl font-semibold text-white transition-all"
                  >
                    자세히 보기
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 빠른 링크 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/studio')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 p-6 text-left transition-all group"
          >
            <Sparkles className="w-8 h-8 text-brand-neon-purple mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-lg font-bold text-white mb-1">콘텐츠 생성</div>
            <div className="text-white/60 text-sm">새로운 콘텐츠 만들기</div>
          </button>
          <button
            onClick={() => router.push('/scheduled')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 p-6 text-left transition-all group"
          >
            <Calendar className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-lg font-bold text-white mb-1">예약 관리</div>
            <div className="text-white/60 text-sm">예약된 포스트 확인</div>
          </button>
          <button
            onClick={() => router.push('/pricing')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 p-6 text-left transition-all group"
          >
            <TrendingUp className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-lg font-bold text-white mb-1">플랜 업그레이드</div>
            <div className="text-white/60 text-sm">더 많은 혜택 받기</div>
          </button>
        </div>

        {/* 홈으로 */}
        <button
          onClick={() => router.push('/')}
          className="mt-8 w-full text-white/70 hover:text-white transition-colors text-center py-3"
        >
          ← 홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

