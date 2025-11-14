/**
 * 스튜디오 페이지 - 개선된 UI/UX
 * 좌측: 입력 영역 (40%) | 우측: 결과 영역 (60%)
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';
import { 
  Upload, ArrowLeft, Copy, RefreshCw, Edit3, Check, X, 
  Loader2, Image as ImageIcon, Sparkles, AlertCircle,
  Instagram, FileText, MessageSquare, MapPin, Calendar
} from 'lucide-react';
import ScheduleModal from '../components/ScheduleModal';

const DOMAINS = [
  { id: 'food', name: '음식/식당', emoji: '🍜' },
  { id: 'beauty', name: '뷰티/미용', emoji: '💇' },
  { id: 'retail', name: '소매/유통', emoji: '🛍️' },
];

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'blog', name: 'Blog', icon: FileText, color: 'text-blue-500' },
  { id: 'threads', name: 'Threads', icon: MessageSquare, color: 'text-gray-700' },
  { id: 'gmb', name: 'Google My Business', icon: MapPin, color: 'text-red-500' },
];

const PLUGINS = [
  { id: 'reviewReply', name: '리뷰 답변', desc: '고객 리뷰 답변 톤' },
  { id: 'adCopy', name: '광고 카피', desc: '판매 촉진 문구' },
  { id: 'bookingCta', name: '예약 CTA', desc: '예약 유도 문구' },
  { id: 'hashtag', name: '해시태그', desc: '관련 해시태그 생성' },
];

interface GenerateResult {
  output: string;
  hashtags: string[];
  warnings: string[];
}

function StudioPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  
  // 로그인 체크
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/studio');
    }
  }, [status, router]);
  
  // State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [domainId, setDomainId] = useState(searchParams?.get('domain') || 'food');
  const [platformId, setPlatformId] = useState('instagram');
  const [selectedPlugins, setSelectedPlugins] = useState<string[]>(['hashtag']);
  const [brandName, setBrandName] = useState('');
  const [region, setRegion] = useState('');
  const [link, setLink] = useState('');
  const [voiceHints, setVoiceHints] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const domain = searchParams?.get('domain');
    if (domain) setDomainId(domain);
  }, [searchParams]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 드래그 앤 드롭
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleImageFile = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSchedule = async (scheduleData: {
    scheduledFor: Date;
    memo: string;
    notifyBefore: number;
  }) => {
    if (!result) {
      alert('생성된 콘텐츠가 없습니다.');
      return;
    }

    if (!session?.user?.id) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    try {
      const userId = session.user.id;

      const res = await fetch('/api/scheduled-posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          domainId,
          platformIds: [platformId],
          content: { [platformId]: result },
          imageUrl: imagePreview,
          scheduledFor: scheduleData.scheduledFor.toISOString(),
          memo: scheduleData.memo,
          notifyBefore: scheduleData.notifyBefore,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('예약이 완료되었습니다! 🎉');
        setIsScheduleModalOpen(false);
        router.push('/scheduled');
      } else {
        alert(data.error || '예약에 실패했습니다.');
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  const handleGenerate = async () => {
    if (!domainId || !platformId) {
      setError('도메인과 플랫폼을 선택해주세요.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      if (imageFile) formData.append('image', imageFile);
      if (notes) formData.append('notes', notes);
      if (keywords) {
        keywords.split(',').map(k => k.trim()).filter(k => k).forEach(keyword => {
          formData.append('keywords', keyword);
        });
      }
      formData.append('domainId', domainId);
      formData.append('platformId', platformId);
      if (brandName) formData.append('brandName', brandName);
      if (region) formData.append('region', region);
      if (link) formData.append('link', link);
      if (voiceHints) {
        voiceHints.split(',').map(h => h.trim()).filter(h => h).forEach(hint => {
          formData.append('voiceHints', hint);
        });
      }
      selectedPlugins.forEach(pluginId => formData.append('plugins', pluginId));

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '콘텐츠 생성에 실패했습니다.');
      }

      const data: GenerateResult = await response.json();
      setResult(data);

      if (data.warnings && data.warnings.length > 0) {
        setToast({ message: `경고: ${data.warnings.join(', ')}`, type: 'warning' });
      } else {
        setToast({ message: '콘텐츠가 생성되었습니다!', type: 'success' });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '콘텐츠 생성에 실패했습니다.';
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    const fullContent = result.output + (result.hashtags?.length > 0 ? `\n\n${result.hashtags.map(tag => `#${tag}`).join(' ')}` : '');
    try {
      await navigator.clipboard.writeText(fullContent);
      setToast({ message: '클립보드에 복사되었습니다!', type: 'success' });
    } catch (err) {
      setToast({ message: '복사에 실패했습니다.', type: 'error' });
    }
  };

  const selectedDomain = DOMAINS.find(d => d.id === domainId);
  const selectedPlatform = PLATFORMS.find(p => p.id === platformId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* 토스트 알림 */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl animate-slide-up ${
          toast.type === 'success' ? 'bg-green-500 text-white' :
          toast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-yellow-500 text-white'
        }`}>
          {toast.type === 'success' ? <Check className="w-5 h-5" /> :
           toast.type === 'error' ? <X className="w-5 h-5" /> :
           <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-40 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-gray-700 hover:text-brand-primary font-medium transition-colors min-h-[56px] px-4 hover:bg-orange-50 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold">홈으로</span>
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">콘텐츠 생성 스튜디오</h1>
            </div>
            {selectedDomain && (
              <div className="bg-brand-cream px-4 py-2 rounded-full text-sm sm:text-base font-medium">
                {selectedDomain.emoji} {selectedDomain.name}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* 좌측: 입력 영역 (40%) */}
          <div className="lg:col-span-2 space-y-6 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">입력</h2>

              {/* 이미지 업로드 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 (선택사항)
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all ${
                    isDragging ? 'border-brand-primary bg-orange-50' : 'border-gray-300 hover:border-brand-primary'
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="rounded-xl shadow-md max-w-full h-auto mx-auto max-h-64 object-contain" />
                      <button
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm sm:text-base text-gray-600 mb-2">
                        사진을 끌어다 놓거나 클릭하세요
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-block bg-brand-primary hover:bg-orange-600 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors font-medium"
                      >
                        파일 선택
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* 메모 입력 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  메모 *
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="예: 점심특선 8,000원, 맵지 않아요, 가족외식 추천"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none text-base text-gray-900 placeholder:text-gray-400"
                />
                <div className="text-xs sm:text-sm text-gray-500 mt-1 text-right">
                  {notes.length}자
                </div>
              </div>

              {/* 키워드 입력 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  키워드 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="아롱사태전골, 점심특선, 가족외식"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent text-base text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* 플랫폼 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  플랫폼 선택 *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PLATFORMS.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.id}
                        onClick={() => setPlatformId(platform.id)}
                        className={`flex items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all min-h-[56px] ${
                          platformId === platform.id
                            ? 'border-brand-primary bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${platform.color}`} />
                        <span className="font-medium text-sm sm:text-base text-gray-900">{platform.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 플러그인 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  플러그인 (복수 선택 가능)
                </label>
                <div className="space-y-2">
                  {PLUGINS.map((plugin) => (
                    <label
                      key={plugin.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlugins.includes(plugin.id)}
                        onChange={() => {
                          setSelectedPlugins(prev =>
                            prev.includes(plugin.id)
                              ? prev.filter(p => p !== plugin.id)
                              : [...prev, plugin.id]
                          );
                        }}
                        className="mt-1 w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                      />
                      <div>
                        <div className="font-medium text-sm sm:text-base text-gray-900">{plugin.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{plugin.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 추가 설정 */}
              <details className="mb-6">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-3">
                  추가 설정 (선택사항)
                </summary>
                <div className="space-y-4 mt-4">
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="브랜드 이름"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-base text-gray-900 placeholder:text-gray-400"
                  />
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="지역 (예: 강남구)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-base text-gray-900 placeholder:text-gray-400"
                  />
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="링크 (예: 예약 페이지)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-base text-gray-900 placeholder:text-gray-400"
                  />
                  <input
                    type="text"
                    value={voiceHints}
                    onChange={(e) => setVoiceHints(e.target.value)}
                    placeholder="톤 힌트 (예: 친근하게, 전문적으로)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-base text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </details>

              {/* 생성 버튼 */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !notes}
                className={`relative w-full py-5 rounded-2xl font-black text-xl transition-all duration-300 flex items-center justify-center gap-3 min-h-[64px] overflow-hidden group ${
                  isGenerating || !notes
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-brand-primary hover:bg-orange-600 text-white shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(255,122,61,0.6)] transform hover:scale-105 hover:-translate-y-1'
                }`}
              >
                {!isGenerating && notes && (
                  <>
                    {/* 반짝이는 효과 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
                    {/* 펄스 효과 */}
                    <div className="absolute inset-0 rounded-2xl bg-orange-400 animate-ping opacity-20"></div>
                  </>
                )}
                
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin relative z-10" />
                    <span className="text-white relative z-10">생성 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
                    <span className="text-white relative z-10">콘텐츠 생성하기 ✨</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 우측: 결과 영역 (60%) */}
          <div className="lg:col-span-3 animate-slide-up">
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 min-h-[600px]">
              <h2 className="text-xl font-bold text-gray-900 mb-6">결과</h2>

              {/* 로딩 상태 */}
              {isGenerating && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-16 h-16 text-brand-primary animate-spin mb-4" />
                  <p className="text-lg text-gray-600 animate-pulse-slow">
                    AI가 열심히 작성 중이에요...
                  </p>
                </div>
              )}

              {/* 에러 상태 */}
              {error && !isGenerating && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-red-900 mb-2">오류 발생</h3>
                      <p className="text-red-700">{error}</p>
                      <button
                        onClick={handleGenerate}
                        className="mt-4 text-sm text-red-600 hover:text-red-800 underline"
                      >
                        다시 시도하기
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 결과 표시 */}
              {result && !isGenerating && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {selectedPlatform && (
                          <>
                            <selectedPlatform.icon className={`w-5 h-5 ${selectedPlatform.color}`} />
                            <h3 className="font-bold text-lg">{selectedPlatform.name}</h3>
                          </>
                        )}
                      </div>
                      <button
                        onClick={handleCopy}
                        className="relative flex items-center gap-2 px-8 py-4 bg-brand-accent hover:bg-green-700 text-white rounded-xl transition-all duration-300 font-black text-lg shadow-2xl hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.6)] transform hover:scale-110 min-h-[56px] group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-500"></div>
                        <Copy className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">복사하기</span>
                      </button>
                    </div>

                    {/* 본문 */}
                    <div className="prose max-w-none mb-4">
                      <pre className="whitespace-pre-wrap font-sans text-gray-800 text-base leading-relaxed">
                        {result.output}
                      </pre>
                    </div>

                    {/* 해시태그 */}
                    {result.hashtags && result.hashtags.length > 0 && (
                      <div className="border-t pt-4 mt-4">
                        <p className="text-sm text-gray-500 mb-2">해시태그</p>
                        <div className="flex flex-wrap gap-2">
                          {result.hashtags.map((tag, index) => (
                            <span key={index} className="text-brand-secondary font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 글자수 */}
                    <div className="border-t pt-4 mt-4">
                      <p className="text-sm text-gray-500">
                        총 {result.output.length}자
                      </p>
                    </div>

                    {/* 경고 */}
                    {result.warnings && result.warnings.length > 0 && (
                      <div className="border-t pt-4 mt-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-yellow-900 mb-2">⚠️ 알림</p>
                          <ul className="text-sm text-yellow-800 space-y-1">
                            {result.warnings.map((warning, index) => (
                              <li key={index}>• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleGenerate}
                      className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border-2 border-brand-secondary hover:border-blue-600 text-brand-secondary hover:text-blue-600 rounded-xl transition-all font-bold shadow-md hover:shadow-lg min-h-[56px]"
                    >
                      <RefreshCw className="w-5 h-5" />
                      다시 생성하기
                    </button>
                    <button
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink hover:scale-105 text-white rounded-xl transition-all font-bold shadow-lg min-h-[56px]"
                    >
                      <Calendar className="w-5 h-5" />
                      예약 발행하기
                    </button>
                  </div>
                </div>
              )}

              {/* 초기 상태 */}
              {!result && !isGenerating && !error && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ImageIcon className="w-20 h-20 text-gray-300 mb-4" />
                  <p className="text-lg text-gray-500">
                    좌측에서 정보를 입력하고<br />
                    생성 버튼을 눌러주세요
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 예약 설정 모달 */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleSchedule}
        generatedContent={result}
      />
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    }>
      <StudioPageContent />
    </Suspense>
  );
}
