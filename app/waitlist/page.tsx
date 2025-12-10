/**
 * 사전예약 페이지
 * 결제 시스템 준비 전까지 잠재 고객 확보
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, User, Building2, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function WaitlistPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
    phone: '',
    interest: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '등록에 실패했습니다.');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-12 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="w-20 h-20 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              등록 완료! 🎉
            </h1>
            <p className="text-white/70 text-lg mb-8">
              사전예약이 완료되었습니다.<br />
              출시 소식을 가장 먼저 알려드릴게요!
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-6 py-4 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-brand-neon-purple/50 transition-all"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-brand-neon-purple drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
            <span className="text-2xl sm:text-4xl font-black text-white">바로올림</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4">
            🚀 사전예약
          </h1>
          <p className="text-base sm:text-xl text-white/80 mb-4 sm:mb-6 px-4">
            결제 시스템 준비 중입니다!<br />
            출시 알림을 받고 <span className="text-brand-neon-purple font-bold">특별 혜택</span>을 받으세요
          </p>
        </div>

        {/* 혜택 카드 */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">🎁 사전예약 특별 혜택</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white font-semibold">무료 생성권 10회 추가</p>
                  <p className="text-white/60 text-sm">기본 5회 → 총 15회 무료</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white font-semibold">2026년 1월까지 30% 할인</p>
                  <p className="text-white/60 text-sm">유료 플랜 가입 시 첫 달부터 적용</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 등록 폼 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">지금 바로 등록하세요</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 */}
            <div>
              <label className="block text-white/90 font-medium mb-2 text-sm">
                이메일 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  disabled={isSubmitting}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-neon-purple focus:ring-2 focus:ring-brand-neon-purple/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* 이름 */}
              <div>
                <label className="block text-white/90 font-medium mb-2 text-sm">
                  이름
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="홍길동"
                    disabled={isSubmitting}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-neon-purple focus:ring-2 focus:ring-brand-neon-purple/50 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* 전화번호 */}
              <div>
                <label className="block text-white/90 font-medium mb-2 text-sm">
                  전화번호
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="010-1234-5678"
                    disabled={isSubmitting}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-neon-purple focus:ring-2 focus:ring-brand-neon-purple/50 transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* 업체명 */}
            <div>
              <label className="block text-white/90 font-medium mb-2 text-sm">
                업체명
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="예: 강남맛집"
                  disabled={isSubmitting}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-neon-purple focus:ring-2 focus:ring-brand-neon-purple/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* 관심 분야 */}
            <div>
              <label className="block text-white/90 font-medium mb-2 text-sm">
                업종
              </label>
              <select
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                disabled={isSubmitting}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-brand-neon-purple focus:ring-2 focus:ring-brand-neon-purple/50 transition-all disabled:opacity-50"
              >
                <option value="">선택해주세요</option>
                <option value="food">음식/식당</option>
                <option value="beauty">뷰티/미용</option>
                <option value="retail">소매/유통</option>
                <option value="fitness">피트니스</option>
                <option value="education">교육</option>
                <option value="pet">반려동물</option>
                <option value="cafe">카페</option>
                <option value="other">기타</option>
              </select>
            </div>

            {/* 문의사항 */}
            <div>
              <label className="block text-white/90 font-medium mb-2 text-sm">
                문의사항 (선택)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-white/40" />
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="궁금하신 점이나 요청사항을 자유롭게 작성해주세요"
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand-neon-purple focus:ring-2 focus:ring-brand-neon-purple/50 transition-all disabled:opacity-50 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-6 py-4 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-brand-neon-purple/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
            >
              {isSubmitting ? '등록 중...' : '🎉 사전예약 하기'}
            </button>
          </form>

          <p className="mt-4 text-center text-white/60 text-sm">
            등록하시면{' '}
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
          className="mt-8 w-full text-white/70 hover:text-white transition-colors text-center py-3"
        >
          ← 홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

