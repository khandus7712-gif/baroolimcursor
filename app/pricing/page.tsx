'use client';

/**
 * 💰 요금제 안내 페이지
 */

import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, X, Sparkles, Zap, Crown, Rocket } from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Sparkles,
      price: '0원',
      period: '평생',
      description: '가볍게 경험해보세요',
      features: [
        { text: '평생 5개 생성', included: true },
        { text: '4개 플랫폼 자유 생성', included: true },
        { text: '카드 등록 없이 사용 가능', included: true },
        { text: '기본 업종 3개 (음식/뷰티/소매)', included: true },
        { text: 'AI 콘텐츠 생성', included: true },
        { text: '플러그인 포함', included: true },
      ],
      gradient: 'from-gray-600 to-gray-800',
      badge: null,
      buttonText: '무료로 시작하기',
      isFree: true,
    },
    {
      id: 'single',
      name: '단건 구매',
      icon: Sparkles,
      price: '990원',
      period: '1회',
      description: '필요할 때만 가볍게',
      features: [
        { text: '콘텐츠 1개 생성', included: true },
        { text: '블로그 긴 글도 1회 차감', included: true, tooltip: '길이, 플랫폼, 이미지 여부 상관없이 1회 차감됩니다.' },
        { text: '전체 업종 7개 이용', included: true },
        { text: '4개 플랫폼 지원', included: true },
        { text: '모든 플러그인 포함', included: true },
        { text: '90일 이내 사용', included: true },
      ],
      gradient: 'from-amber-500 to-orange-500',
      badge: '간편',
      badgeColor: 'bg-amber-500',
      buttonText: '990원으로 시작',
    },
    {
      id: 'basic',
      name: 'Starter',
      icon: Zap,
      price: '49,900원',
      period: '월',
      description: '바쁜 사장님이 걱정 없이 쓰도록 넉넉하게 월 150개를 드립니다.',
      features: [
        { text: '월 150개 생성', included: true, highlight: true },
        { text: '인스타 / 블로그 / 스레드 / GBP 전체 지원', included: true },
        { text: '업종 7개 전체 제공', included: true },
        { text: '예약·광고·해시태그·리뷰 자동 생성 플러그인', included: true },
        { text: '예약 저장 + 알림', included: true },
        { text: '7일 100% 환불', included: true },
      ],
      gradient: 'from-blue-600 to-cyan-600',
      badge: 'BEST',
      badgeColor: 'bg-blue-500',
      buttonText: '30초 만에 마케팅 시작하기',
      popular: true,
      valueText: '필요한 플랫폼만 선택해서 쓰세요. 모자라서 막힐 일 없도록 넉넉하게 드리는 양입니다.',
    },
    {
      id: 'pro',
      name: 'Growth',
      icon: Crown,
      price: '79,000원',
      period: '월',
      description: '여러 매장이든 대행사든 물량 걱정 없이 운영하세요.',
      features: [
        { text: '월 400개 생성', included: true, highlight: true },
        { text: '다점포 운영 최적화', included: true },
        { text: '브랜드 톤 설정', included: true },
        { text: '우선 지원', included: true },
        { text: '인스타 / 블로그 / 스레드 / GBP 전체 지원', included: true },
        { text: '업종 7개 전체 제공', included: true },
        { text: '모든 플러그인 포함', included: true },
        { text: '예약 저장 + 알림', included: true },
        { text: '향후 팀 계정 기능 예정', included: true },
      ],
      gradient: 'from-purple-600 to-pink-600',
      badge: null,
      buttonText: '지금 시작하기',
      valueText: '한 달 작업량이 많아도 400개면 충분합니다. 넉넉하게 운영하세요.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black">💰 요금제 안내</h1>
              <p className="text-sm text-white/60">
                사장님께 딱 맞는 플랜을 선택하세요
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* 안내 섹션 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink">
              간단하고 명확한
            </span>
            <br />
            요금제
          </h2>
          <p className="text-xl text-white/70 mb-8">
            복잡한 계산 없이, 딱 필요한 만큼만 사용하세요
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/5 px-6 py-3 rounded-full border border-white/20">
              ✅ 언제든 해지 가능
            </div>
            <div className="bg-white/5 px-6 py-3 rounded-full border border-white/20">
              ✅ 카드 등록 없이 체험
            </div>
            <div className="bg-white/5 px-6 py-3 rounded-full border border-white/20">
              ✅ 환불 보장 (7일 이내)
            </div>
          </div>
        </div>

        {/* 요금제 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-white/5 backdrop-blur-xl rounded-3xl border ${
                  plan.popular ? 'border-brand-neon-purple scale-105 shadow-lg shadow-brand-neon-purple/20' :
                  plan.isFree ? 'border-gray-700' :
                  plan.badge ? 'border-white/30' : 'border-white/10'
                } overflow-hidden transition-all hover:scale-105 hover:border-white/50`}
              >
                {/* 배지 */}
                {plan.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`${plan.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* 헤더 */}
                <div className={`bg-gradient-to-br ${plan.gradient} p-8`}>
                  <Icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                  <p className="text-white/80 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">{plan.price}</span>
                    {plan.period && (
                      <span className="text-white/70">/ {plan.period}</span>
                    )}
                  </div>
                </div>

                {/* 기능 목록 */}
                <div className="p-8 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 group">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`${feature.included ? 'text-white/90' : 'text-white/40'} ${(feature as any).highlight ? 'text-xl font-bold' : ''}`}>
                        {feature.text}
                      </span>
                      {(feature as any).tooltip && (
                        <div className="relative flex items-center">
                          <span className="text-white/50 text-xs cursor-help">?</span>
                          <div className="absolute left-full ml-2 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-48 z-20">
                            {(feature as any).tooltip}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 가치 문구 */}
                {plan.valueText && (
                  <div className="px-8 pb-4">
                    <p className="text-white/60 text-sm italic">"{plan.valueText}"</p>
                  </div>
                )}

                {/* 버튼 */}
                <div className="p-8 pt-0">
                  <button
                    onClick={() => {
                      if (plan.id === 'free') {
                        router.push('/studio');
                      } else if (plan.id === 'single') {
                        router.push('/payment?plan=SINGLE_CONTENT');
                      } else {
                        router.push(`/payment?plan=${plan.id.toUpperCase()}`);
                      }
                    }}
                    className={`w-full py-4 rounded-xl font-bold transition-all ${
                      plan.popular || plan.badge
                        ? `bg-gradient-to-r ${plan.gradient} hover:scale-105 shadow-lg text-white`
                        : plan.isFree
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ 섹션 */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12">
          <h3 className="text-3xl font-black mb-8 text-center">자주 묻는 질문</h3>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h4 className="text-lg font-bold mb-2">💳 결제 수단은 무엇을 지원하나요?</h4>
              <p className="text-white/70">
                신용카드, 체크카드, 계좌이체, 간편결제(토스/카카오페이)를 지원합니다.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">🔄 언제든지 해지할 수 있나요?</h4>
              <p className="text-white/70">
                네! 언제든 해지 가능하며, 해지 후에도 남은 기간 동안 서비스를 이용하실 수 있습니다.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">💰 환불은 어떻게 되나요?</h4>
              <p className="text-white/70">
                결제 후 7일 이내 서비스를 3회 미만 이용한 경우 전액 환불 가능합니다. 
                자세한 내용은 <a href="/refund-policy" className="text-brand-neon-purple hover:underline">환불 정책</a>을 참고하세요.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">📈 플랜을 변경할 수 있나요?</h4>
              <p className="text-white/70">
                네! 언제든 상위/하위 플랜으로 변경 가능하며, 차액은 일할 계산됩니다.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">🎁 무료 체험은 어떻게 하나요?</h4>
              <p className="text-white/70">
                Free 플랜으로 카드 등록 없이 바로 시작하실 수 있습니다. 5회 생성 후에도 유료 플랜으로 업그레이드 가능합니다.
              </p>
            </div>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-black mb-4">아직 고민 중이신가요?</h3>
          <p className="text-xl text-white/70 mb-8">
            무료로 체험해보고 결정하세요!
          </p>
          <button
            onClick={() => router.push('/studio')}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-12 py-6 rounded-2xl text-xl font-black hover:scale-105 transition-transform shadow-[0_0_40px_rgba(168,85,247,0.6)]"
          >
            <Sparkles className="w-8 h-8" />
            무료로 시작하기
          </button>
        </div>
      </main>
    </div>
  );
}


