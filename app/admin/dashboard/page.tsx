/**
 * 관리자 대시보드
 * 회원 관리, 통계, 사전예약 목록 확인
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Users, TrendingUp, DollarSign, FileText, Calendar,
  Search, Filter, Download, RefreshCw, Eye, Mail,
  Phone, Building2, Clock, Check, X, Sparkles,
  BarChart3, PieChart, Activity, User
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface DashboardStats {
  totalUsers: number;
  todaySignups: number;
  totalGenerations: number;
  monthlyRevenue: number;
  freeUsers: number;
  paidUsers: number;
  waitlistCount: number;
}

interface UserData {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  totalGenerations: number;
  monthlyGenerationCount: number;
  lastGenerationMonth: string | null;
  createdAt: string;
}

interface WaitlistData {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  interest: string | null;
  message: string | null;
  createdAt: string;
  notified: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistData[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'waitlist'>('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 인증 체크
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/dashboard');
    }
  }, [status, router]);

  // 데이터 로드
  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setUsers(data.users);
        setWaitlist(data.waitlist);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (type: 'users' | 'waitlist') => {
    // CSV 내보내기 구현
    alert(`${type === 'users' ? '회원' : '사전예약'} 데이터를 CSV로 내보내는 기능은 곧 추가됩니다!`);
  };

  if (status === 'loading' || loading) {
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <img 
                src="/logo.svg" 
                alt="바로올림" 
                className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
              />
              <h1 className="text-2xl sm:text-4xl font-black text-white">관리자 대시보드</h1>
            </div>
            <p className="text-sm sm:text-base text-white/60">바로올림 운영 현황을 한눈에</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-white transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              새로고침
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-6 py-2 rounded-xl font-bold text-white hover:shadow-lg transition-all"
            >
              홈으로
            </button>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 sm:px-6 py-3 rounded-xl font-bold transition-all text-sm sm:text-base ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            📊 개요
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            👥 회원 관리 ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('waitlist')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'waitlist'
                ? 'bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            🎉 사전예약 ({waitlist.length})
          </button>
        </div>

        {/* 개요 탭 */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* 통계 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 총 회원 수 */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-blue-400" />
                  <span className="text-white/60 text-sm font-medium">전체 회원</span>
                </div>
                <div className="text-4xl font-black text-white mb-2">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-green-400 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  오늘 +{stats.todaySignups}명
                </div>
              </div>

              {/* 총 생성 횟수 */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-8 h-8 text-purple-400" />
                  <span className="text-white/60 text-sm font-medium">총 생성</span>
                </div>
                <div className="text-4xl font-black text-white mb-2">{stats.totalGenerations.toLocaleString()}</div>
                <div className="text-white/60 text-sm">전체 콘텐츠 생성</div>
              </div>

              {/* 월 매출 */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-green-400" />
                  <span className="text-white/60 text-sm font-medium">이번 달 매출</span>
                </div>
                <div className="text-4xl font-black text-white mb-2">₩{stats.monthlyRevenue.toLocaleString()}</div>
                <div className="text-white/60 text-sm">결제 시스템 준비 중</div>
              </div>

              {/* 사전예약 */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 text-pink-400" />
                  <span className="text-white/60 text-sm font-medium">사전예약</span>
                </div>
                <div className="text-4xl font-black text-white mb-2">{stats.waitlistCount.toLocaleString()}</div>
                <div className="text-brand-neon-purple text-sm font-semibold">출시 대기 중</div>
              </div>
            </div>

            {/* 플랜별 분포 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <PieChart className="w-6 h-6" />
                플랜별 회원 분포
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-2xl p-6">
                  <div className="text-white/60 text-sm mb-2">무료 회원</div>
                  <div className="text-3xl font-black text-white mb-1">{stats.freeUsers.toLocaleString()}명</div>
                  <div className="text-white/40 text-sm">
                    {stats.totalUsers > 0 ? ((stats.freeUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-6">
                  <div className="text-white/60 text-sm mb-2">유료 회원</div>
                  <div className="text-3xl font-black text-white mb-1">{stats.paidUsers.toLocaleString()}명</div>
                  <div className="text-white/40 text-sm">
                    {stats.totalUsers > 0 ? ((stats.paidUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            </div>

            {/* 빠른 링크 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveTab('users')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 p-6 text-left transition-all group"
              >
                <Users className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-lg font-bold text-white mb-1">회원 관리</div>
                <div className="text-white/60 text-sm">전체 회원 목록 보기</div>
              </button>
              <button
                onClick={() => setActiveTab('waitlist')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 p-6 text-left transition-all group"
              >
                <Calendar className="w-8 h-8 text-pink-400 mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-lg font-bold text-white mb-1">사전예약 명단</div>
                <div className="text-white/60 text-sm">대기자 확인 및 관리</div>
              </button>
              <button
                onClick={() => router.push('/studio')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 p-6 text-left transition-all group"
              >
                <Activity className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-lg font-bold text-white mb-1">콘텐츠 생성</div>
                <div className="text-white/60 text-sm">스튜디오로 이동</div>
              </button>
            </div>
          </div>
        )}

        {/* 회원 관리 탭 */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* 검색 및 필터 */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="이메일 또는 이름으로 검색..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-brand-neon-purple"
                />
              </div>
              <button
                onClick={() => exportToCSV('users')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl text-white transition-all"
              >
                <Download className="w-5 h-5" />
                CSV 내보내기
              </button>
            </div>

            {/* 회원 목록 테이블 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-white/80 font-semibold">이메일</th>
                      <th className="px-6 py-4 text-left text-white/80 font-semibold">이름</th>
                      <th className="px-6 py-4 text-left text-white/80 font-semibold">플랜</th>
                      <th className="px-6 py-4 text-left text-white/80 font-semibold">잔여 횟수</th>
                      <th className="px-6 py-4 text-left text-white/80 font-semibold">가입일</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users
                      .filter(user => 
                        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-white">{user.email}</td>
                          <td className="px-6 py-4 text-white">{user.name || '-'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              user.plan === 'FREE' ? 'bg-gray-500/20 text-gray-300' :
                              user.plan === 'BASIC' ? 'bg-blue-500/20 text-blue-300' :
                              user.plan === 'PRO' ? 'bg-purple-500/20 text-purple-300' :
                              'bg-yellow-500/20 text-yellow-300'
                            }`}>
                              {user.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {(() => {
                              // 월 체크 및 리셋
                              const now = new Date();
                              const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                              currentMonth.setHours(0, 0, 0, 0);
                              
                              let monthlyCount = user.monthlyGenerationCount;
                              if (user.lastGenerationMonth) {
                                const lastMonth = new Date(user.lastGenerationMonth);
                                lastMonth.setHours(0, 0, 0, 0);
                                if (lastMonth.getTime() !== currentMonth.getTime()) {
                                  monthlyCount = 0; // 월이 바뀌었으면 0으로 표시
                                }
                              }

                              if (user.plan === 'FREE') {
                                const remaining = 5 - user.totalGenerations;
                                return (
                                  <div>
                                    <span className={`text-lg font-bold ${
                                      remaining <= 1 ? 'text-red-400' : remaining <= 2 ? 'text-yellow-400' : 'text-green-400'
                                    }`}>
                                      {remaining}회 남음
                                    </span>
                                    <span className="text-white/40 text-sm ml-2">
                                      ({user.totalGenerations}/5 사용)
                                    </span>
                                  </div>
                                );
                              } else {
                                const limits: Record<string, number> = {
                                  BASIC: 150, // Starter: 월 150개
                                  PRO: 400, // Growth: 월 400개
                                };
                                const limit = limits[user.plan] || 0;
                                const remaining = limit - monthlyCount;
                                return (
                                  <div>
                                    <span className={`text-lg font-bold ${
                                      remaining <= 1 ? 'text-red-400' : remaining <= limit * 0.3 ? 'text-yellow-400' : 'text-green-400'
                                    }`}>
                                      {remaining}회 남음
                                    </span>
                                    <span className="text-white/40 text-sm ml-2">
                                      (이번 달 {monthlyCount}/{limit} 사용)
                                    </span>
                                    <div className="text-white/30 text-xs mt-1">
                                      전체: {user.totalGenerations}회
                                    </div>
                                  </div>
                                );
                              }
                            })()}
                          </td>
                          <td className="px-6 py-4 text-white/60 text-sm">
                            {format(new Date(user.createdAt), 'yyyy-MM-dd', { locale: ko })}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 사전예약 탭 */}
        {activeTab === 'waitlist' && (
          <div className="space-y-6">
            {/* 검색 및 필터 */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="이메일 또는 업체명으로 검색..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-brand-neon-purple"
                />
              </div>
              <button
                onClick={() => exportToCSV('waitlist')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl text-white transition-all"
              >
                <Download className="w-5 h-5" />
                CSV 내보내기
              </button>
            </div>

            {/* 사전예약 목록 */}
            <div className="grid gap-4">
              {waitlist
                .filter(item => 
                  item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.company?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Mail className="w-5 h-5 text-brand-neon-purple" />
                          <span className="text-white font-semibold text-lg">{item.email}</span>
                          {item.notified && (
                            <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                              알림 발송됨
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {item.name && (
                            <div className="flex items-center gap-2 text-white/70">
                              <User className="w-4 h-4" />
                              {item.name}
                            </div>
                          )}
                          {item.company && (
                            <div className="flex items-center gap-2 text-white/70">
                              <Building2 className="w-4 h-4" />
                              {item.company}
                            </div>
                          )}
                          {item.phone && (
                            <div className="flex items-center gap-2 text-white/70">
                              <Phone className="w-4 h-4" />
                              {item.phone}
                            </div>
                          )}
                          {item.interest && (
                            <div className="flex items-center gap-2 text-white/70">
                              <Activity className="w-4 h-4" />
                              {item.interest}
                            </div>
                          )}
                        </div>
                        {item.message && (
                          <div className="mt-3 p-3 bg-white/5 rounded-lg text-white/80 text-sm">
                            💬 {item.message}
                          </div>
                        )}
                      </div>
                      <div className="text-right text-white/60 text-sm ml-4">
                        <div className="flex items-center gap-1 justify-end mb-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm', { locale: ko })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {waitlist.length === 0 && (
              <div className="text-center py-20 text-white/60">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">아직 사전예약자가 없습니다</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

