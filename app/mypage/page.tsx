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

interface StoreMenuItem {
  name: string;
  price: string;
}

interface StoreProfileForm {
  storeName: string;
  category: string;
  storeAddress: string;
  storePhone: string;
  storeHours: string;
  storeOffDay: string;
  storeFeature: string;
  storeIntro: string;
  storeLink: string;
  storeMenu: StoreMenuItem[];
}

const PLANS: PlanInfo[] = [
  {
    id: 'FREE',
    name: 'Free',
    price: 0,
    monthlyLimit: null,
    totalLimit: 5,
    features: ['평생 5회 무료', '4개 플랫폼 지원', '기본 AI 기능', '카드 등록 없이 사용']
  },
  {
    id: 'BASIC',
    name: 'Starter',
    price: 49900,
    monthlyLimit: 150,
    totalLimit: null,
    features: ['월 150개 생성', '인스타/블로그/스레드/GBP 전체 지원', '업종 7개 전체 제공', '모든 플러그인', '예약 저장 + 알림', '7일 100% 환불']
  },
  {
    id: 'PRO',
    name: 'Growth',
    price: 79000,
    monthlyLimit: 400,
    totalLimit: null,
    features: ['월 400개 생성', '다점포 운영 최적화', '브랜드 톤 설정', '우선 지원', '모든 플랫폼 지원', '모든 플러그인', '향후 팀 계정 기능 예정']
  },
];

const STORE_CATEGORIES = [
  { id: 'food', name: '음식점' },
  { id: 'beauty', name: '뷰티/미용' },
  { id: 'retail', name: '소매/유통' },
  { id: 'cafe', name: '카페/베이커리' },
  { id: 'fitness', name: '운동/헬스' },
  { id: 'pet', name: '반려동물' },
  { id: 'education', name: '교육/학원' },
];

export default function MyPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingStoreProfile, setSavingStoreProfile] = useState(false);
  const [storeProfileMessage, setStoreProfileMessage] = useState<string | null>(null);
  const [storeProfileForm, setStoreProfileForm] = useState<StoreProfileForm>({
    storeName: '',
    category: 'food',
    storeAddress: '',
    storePhone: '',
    storeHours: '',
    storeOffDay: '',
    storeFeature: '',
    storeIntro: '',
    storeLink: '',
    storeMenu: [{ name: '', price: '' }],
  });

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
      const storeRes = await fetch('/api/user/store-profile');
      if (storeRes.ok) {
        const storeData = await storeRes.json();
        if (storeData?.profile) {
          const p = storeData.profile;
          const menus = Array.isArray(p.storeMenu) && p.storeMenu.length > 0
            ? p.storeMenu.map((m: { name?: string; price?: number }) => ({
                name: m?.name || '',
                price: m?.price ? String(m.price) : '',
              }))
            : [{ name: '', price: '' }];
          setStoreProfileForm({
            storeName: p.storeName || '',
            category: p.category || 'food',
            storeAddress: p.storeAddress || '',
            storePhone: p.storePhone || '',
            storeHours: p.storeHours || '',
            storeOffDay: p.storeOffDay || '',
            storeFeature: p.storeFeature || '',
            storeIntro: p.storeIntro || '',
            storeLink: p.storeLink || '',
            storeMenu: menus,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStoreMenu = (index: number, key: 'name' | 'price', value: string) => {
    setStoreProfileForm((prev) => {
      const next = [...prev.storeMenu];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, storeMenu: next };
    });
  };

  const addStoreMenu = () => {
    setStoreProfileForm((prev) => ({ ...prev, storeMenu: [...prev.storeMenu, { name: '', price: '' }] }));
  };

  const removeStoreMenu = (index: number) => {
    setStoreProfileForm((prev) => {
      const next = prev.storeMenu.filter((_, i) => i !== index);
      return { ...prev, storeMenu: next.length > 0 ? next : [{ name: '', price: '' }] };
    });
  };

  const saveStoreProfile = async () => {
    setStoreProfileMessage(null);
    if (!storeProfileForm.storeName.trim()) {
      setStoreProfileMessage('상호명을 입력해주세요.');
      return;
    }
    if (!storeProfileForm.category.trim()) {
      setStoreProfileMessage('업종 카테고리를 선택해주세요.');
      return;
    }
    if (!storeProfileForm.storeAddress.trim()) {
      setStoreProfileMessage('주소를 입력해주세요.');
      return;
    }

    setSavingStoreProfile(true);
    try {
      const payload = {
        ...storeProfileForm,
        storeMenu: storeProfileForm.storeMenu
          .map((m) => ({ name: m.name.trim(), price: m.price.trim() }))
          .filter((m) => m.name),
      };
      const res = await fetch('/api/user/store-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setStoreProfileMessage(data?.error || '가게 프로필 저장에 실패했습니다.');
        return;
      }
      setStoreProfileMessage('가게 프로필이 저장되었습니다.');
    } catch (e) {
      console.error('Failed to save store profile:', e);
      setStoreProfileMessage('가게 프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setSavingStoreProfile(false);
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
  
  // 월간 잔여 횟수 계산
  let monthlyRemaining: number | null = null;
  if (currentPlan?.monthlyLimit) {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    currentMonth.setHours(0, 0, 0, 0);
    
    let monthlyCount = profile.monthlyGenerationCount;
    if (profile.lastGenerationMonth) {
      const lastMonth = new Date(profile.lastGenerationMonth);
      lastMonth.setHours(0, 0, 0, 0);
      if (lastMonth.getTime() !== currentMonth.getTime()) {
        monthlyCount = 0; // 월이 바뀌었으면 0으로 표시
      }
    }
    
    monthlyRemaining = currentPlan.monthlyLimit - monthlyCount;
  }

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

        {/* 가게 프로필 등록/수정 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-6">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Settings className="w-6 h-6 text-brand-neon-purple" />
            가게 프로필
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">상호명 *</label>
              <input
                value={storeProfileForm.storeName}
                onChange={(e) => setStoreProfileForm((prev) => ({ ...prev, storeName: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40"
                placeholder="예: 아롱하다"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2">업종 카테고리 *</label>
              <select
                value={storeProfileForm.category}
                onChange={(e) => setStoreProfileForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
              >
                {STORE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id} className="text-black">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-white/80 text-sm mb-2">주소 *</label>
              <input
                value={storeProfileForm.storeAddress}
                onChange={(e) => setStoreProfileForm((prev) => ({ ...prev, storeAddress: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40"
                placeholder="예: 창원 의창구 도계동 OO번지 (OO 근처)"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">전화번호</label>
              <input
                value={storeProfileForm.storePhone}
                onChange={(e) => setStoreProfileForm((prev) => ({ ...prev, storePhone: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2">영업시간</label>
              <input
                value={storeProfileForm.storeHours}
                onChange={(e) => setStoreProfileForm((prev) => ({ ...prev, storeHours: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2">정기 휴무</label>
              <input
                value={storeProfileForm.storeOffDay}
                onChange={(e) => setStoreProfileForm((prev) => ({ ...prev, storeOffDay: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2">예약/홈페이지 링크</label>
              <input
                value={storeProfileForm.storeLink}
                onChange={(e) => setStoreProfileForm((prev) => ({ ...prev, storeLink: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-white/80 text-sm mb-2">대표 메뉴</label>
              <div className="space-y-2">
                {storeProfileForm.storeMenu.map((menu, idx) => (
                  <div key={`menu-${idx}`} className="grid grid-cols-12 gap-2">
                    <input
                      value={menu.name}
                      onChange={(e) => updateStoreMenu(idx, 'name', e.target.value)}
                      placeholder="메뉴명"
                      className="col-span-7 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder:text-white/40"
                    />
                    <input
                      value={menu.price}
                      onChange={(e) => updateStoreMenu(idx, 'price', e.target.value)}
                      placeholder="가격(원)"
                      className="col-span-4 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder:text-white/40"
                    />
                    <button
                      type="button"
                      onClick={() => removeStoreMenu(idx)}
                      className="col-span-1 text-white/60 hover:text-white"
                    >
                      <X className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addStoreMenu}
                  className="text-sm text-brand-neon-purple hover:text-brand-neon-pink"
                >
                  + 메뉴 추가
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-white/80 text-sm mb-2">가게 특징</label>
              <input
                value={storeProfileForm.storeFeature}
                onChange={(e) => setStoreProfileForm((prev) => ({ ...prev, storeFeature: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/80 text-sm mb-2">한 줄 소개</label>
              <input
                value={storeProfileForm.storeIntro}
                onChange={(e) => setStoreProfileForm((prev) => ({ ...prev, storeIntro: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm text-white/60">저장하면 스튜디오 추가 설정 입력칸에 자동으로 채워집니다.</p>
            <button
              type="button"
              onClick={saveStoreProfile}
              disabled={savingStoreProfile}
              className="bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-6 py-2 rounded-xl font-bold text-white disabled:opacity-60"
            >
              {savingStoreProfile ? '저장 중...' : '저장하기'}
            </button>
          </div>
          {storeProfileMessage && <p className="mt-3 text-sm text-white/80">{storeProfileMessage}</p>}
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
                  <div className="mt-3 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">무료 횟수가 거의 소진되었습니다</div>
                      <div className="text-red-200/80">유료 플랜으로 업그레이드하고 무제한으로 사용하세요!</div>
                    </div>
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
                    className="h-full bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink transition-all"
                    style={{ 
                      width: `${monthlyRemaining !== null && currentPlan?.monthlyLimit 
                        ? (monthlyRemaining / currentPlan.monthlyLimit) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="mt-3 text-white/60 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  매월 1일에 초기화됩니다
                </div>
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
              유료 플랜으로 업그레이드
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
            <img 
              src="/logo.svg" 
              alt="바로올림" 
              className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
            />
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

