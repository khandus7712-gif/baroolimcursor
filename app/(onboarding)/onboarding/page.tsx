/**
 * 온보딩 페이지
 * 업종 선택, 목표(KPI) 체크, 톤/금칙어/CTA 입력, 저장
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// 전체 업종 목록 (7개)
const ALL_DOMAINS = [
  { id: 'food', name: '음식/식당' },
  { id: 'beauty', name: '뷰티/미용' },
  { id: 'retail', name: '소매/유통' },
  { id: 'cafe', name: '카페/베이커리' },
  { id: 'fitness', name: '운동/헬스' },
  { id: 'pet', name: '반려동물' },
  { id: 'education', name: '교육/학원' },
];

// 모든 사용자가 7가지 업종 모두 사용 가능 (요금제는 생성 횟수만 제한)

const KPIS = [
  '예약 전환율',
  '방문 횟수',
  '리뷰 점수',
  '재방문율',
  '추천율',
  '구매 전환율',
  '평균 주문 금액',
  '고객 만족도',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [domainId, setDomainId] = useState('');
  const [selectedKpis, setSelectedKpis] = useState<string[]>([]);
  const [tone, setTone] = useState('');
  const [forbiddenWords, setForbiddenWords] = useState('');
  const [cta, setCta] = useState('');
  const [brandName, setBrandName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string>('FREE');

  // 사용자 플랜 정보 가져오기
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetch('/api/user/plan')
        .then(res => res.json())
        .then(data => {
          if (data.plan) {
            setUserPlan(data.plan);
          }
        })
        .catch(err => console.error('Failed to fetch user plan:', err));
    }
  }, [status, session]);

  // 모든 사용자가 7가지 업종 모두 사용 가능 (요금제는 생성 횟수만 제한)
  const availableDomains = useMemo(() => {
    return ALL_DOMAINS;
  }, []);

  const handleKpiToggle = (kpi: string) => {
    setSelectedKpis((prev) => (prev.includes(kpi) ? prev.filter((k) => k !== kpi) : [...prev, kpi]));
  };

  const handleSave = async () => {
    if (!domainId) {
      setError('업종을 선택해주세요.');
      return;
    }

    if (selectedKpis.length === 0) {
      setError('최소 하나의 목표를 선택해주세요.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // DomainConfig 생성
      const domainConfig = {
        domainId,
        kpis: selectedKpis,
        tone: tone || undefined,
        forbiddenWords: forbiddenWords
          ? forbiddenWords
              .split(',')
              .map((w) => w.trim())
              .filter((w) => w)
          : undefined,
        cta: cta || undefined,
        brandName: brandName || undefined,
      };

      // API 호출
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(domainConfig),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '저장에 실패했습니다.');
      }

      // 성공 시 스튜디오로 이동
      router.push('/studio');
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">바로올림 설정</h1>

          {/* 업종 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">업종 선택</label>
            <select
              value={domainId}
              onChange={(e) => setDomainId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">업종을 선택하세요</option>
              {availableDomains.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.name}
                </option>
              ))}
            </select>
          </div>

          {/* 목표(KPI) 체크 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">마케팅 목표 (복수 선택 가능)</label>
            <div className="space-y-2">
              {KPIS.map((kpi) => (
                <label key={kpi} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedKpis.includes(kpi)}
                    onChange={() => handleKpiToggle(kpi)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{kpi}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 브랜드 이름 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">브랜드 이름 (선택사항)</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="브랜드 이름을 입력하세요"
            />
          </div>

          {/* 톤 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">톤앤매너 (선택사항)</label>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 따뜻하고 친근한, 전문적이고 신뢰감 있는"
            />
          </div>

          {/* 금칙어 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              금칙어 (선택사항, 쉼표로 구분)
            </label>
            <input
              type="text"
              value={forbiddenWords}
              onChange={(e) => setForbiddenWords(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 최고, 최고급, 프리미엄"
            />
          </div>

          {/* CTA */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">CTA (선택사항)</label>
            <input
              type="text"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 지금 예약하시고 특별한 혜택을 받아보세요!"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>
          )}

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
            disabled={isSaving || !domainId || selectedKpis.length === 0}
            className={`w-full px-4 py-3 rounded-md font-semibold ${
              isSaving || !domainId || selectedKpis.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isSaving ? '저장 중...' : '저장하고 시작하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
