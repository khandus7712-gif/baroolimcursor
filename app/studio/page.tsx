/**
 * 스튜디오 페이지 - 개선된 UI/UX
 * 좌측: 입력 영역 (40%) | 우측: 결과 영역 (60%)
 */

'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';
import { 
  Upload, ArrowLeft, Copy, RefreshCw, Edit3, Check, X, 
  Loader2, Image as ImageIcon, Sparkles, AlertCircle,
  Instagram, FileText, MessageSquare, MapPin, Calendar, Search
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
const MAX_IMAGES = 10;

interface GenerateResult {
  output: string;
  hashtags: string[];
  warnings: string[];
  imageUrls?: string[];
  imageCaptions?: string[];
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
  const [enableSearch, setEnableSearch] = useState(true); // 웹 검색 기본 활성화
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewMode, setPreviewMode] = useState<'plain' | 'blog'>('plain');
  const trimmedBrandName = brandName.trim();
  const trimmedRegion = region.trim();
  const isSearchInfoReady = Boolean(trimmedBrandName) && Boolean(trimmedRegion);
  const isGenerateDisabled = isGenerating || !notes || (enableSearch && !isSearchInfoReady);

  const convertFileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageFiles = async (files: FileList | File[]) => {
    console.log('[Image] handleImageFiles called with', files.length, 'files');
    const incoming = Array.from(files).filter((file) => file.type.startsWith('image/'));
    console.log('[Image] Filtered to', incoming.length, 'image files');
    if (incoming.length === 0) {
      setToast({ message: '이미지 파일만 업로드할 수 있습니다.', type: 'error' });
      return;
    }

    const availableSlots = MAX_IMAGES - imageFiles.length;
    if (availableSlots <= 0) {
      setToast({ message: `이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있습니다.`, type: 'warning' });
      return;
    }

    const filesToAdd = incoming.slice(0, availableSlots);
    try {
      const previews = await Promise.all(filesToAdd.map((file) => convertFileToDataUrl(file)));
      setImageFiles((prev) => [...prev, ...filesToAdd]);
      setImagePreviews((prev) => [...prev, ...previews]);
    } catch (error) {
      console.error('Failed to read image files:', error);
      setToast({ message: '이미지 파일을 불러오지 못했습니다.', type: 'error' });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

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
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      void handleImageFiles(files);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[Image] File input changed:', e.target.files?.length || 0, 'files');
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('[Image] Processing', files.length, 'files');
      void handleImageFiles(files);
    } else {
      console.warn('[Image] No files selected');
    }
    e.target.value = '';
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
          imageUrl: result?.imageUrls?.[0] || imagePreviews[0] || null,
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

    if (enableSearch && !isSearchInfoReady) {
      const warnMsg = '기존 콘텐츠 조사를 사용하려면 업체명과 지역을 입력해주세요.';
      setError(warnMsg);
      setToast({ message: warnMsg, type: 'error' });
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => formData.append('image', file));
      }
      if (notes) formData.append('notes', notes);
      if (keywords) {
        keywords.split(',').map(k => k.trim()).filter(k => k).forEach(keyword => {
          formData.append('keywords', keyword);
        });
      }
      formData.append('domainId', domainId);
      formData.append('platformId', platformId);
      if (trimmedBrandName) formData.append('brandName', trimmedBrandName);
      if (trimmedRegion) formData.append('region', trimmedRegion);
      if (link) formData.append('link', link);
      if (voiceHints) {
        voiceHints.split(',').map(h => h.trim()).filter(h => h).forEach(hint => {
          formData.append('voiceHints', hint);
        });
      }
      selectedPlugins.forEach(pluginId => formData.append('plugins', pluginId));
      formData.append('enableSearch', enableSearch ? 'true' : 'false');

      console.log('[generate] Sending request to /api/generate');
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });
      console.log('[generate] Response status:', response.status, response.statusText);

      // 응답 본문을 텍스트로 먼저 읽기 (한 번만 읽을 수 있음)
      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = '콘텐츠 생성에 실패했습니다.';
        try {
          // 응답이 비어있지 않고 JSON 형식인지 확인
          if (responseText && responseText.trim().length > 0) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData.error || errorMessage;
            } else {
              errorMessage = responseText || `서버 오류 (${response.status})`;
            }
          } else {
            errorMessage = `서버 오류 (${response.status}): ${response.statusText || 'Method not allowed'}`;
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `서버 오류 (${response.status}): ${response.statusText || 'Unknown error'}`;
          if (responseText) {
            errorMessage += ` - ${responseText.substring(0, 100)}`;
          }
        }
        throw new Error(errorMessage);
      }

      // 성공 응답 처리
      if (!responseText || responseText.trim().length === 0) {
        throw new Error('서버에서 빈 응답을 받았습니다.');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`서버에서 잘못된 형식의 응답을 받았습니다. Content-Type: ${contentType}`);
      }

      let data: GenerateResult;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        console.error('Response text:', responseText.substring(0, 500));
        throw new Error('서버 응답을 파싱할 수 없습니다.');
      }
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

  const buildBlogMarkdown = () => {
    if (!result) {
      return '';
    }

    const paragraphs = result.output
      .trim()
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

    const imageSources =
      (result.imageUrls && result.imageUrls.length > 0 ? result.imageUrls : imagePreviews) || [];
    const captions = result.imageCaptions || [];

    if (imageSources.length === 0) {
      return paragraphs.join('\n\n');
    }

    const totalBlocks = paragraphs.length + imageSources.length;
    const imagePositions = new Set<number>();

    for (let i = 1; i <= imageSources.length; i++) {
      const pos = Math.round((i * totalBlocks) / (imageSources.length + 1));
      imagePositions.add(pos);
    }

    const markdown: string[] = [];
    let paragraphIndex = 0;
    let imageIndex = 0;

    for (let i = 0; i < totalBlocks; i++) {
      if (imagePositions.has(i) && imageIndex < imageSources.length) {
        const src = imageSources[imageIndex];
        const caption = captions[imageIndex] || `사진 ${imageIndex + 1}`;
        markdown.push(`![${caption}](${src})`);
        markdown.push('');
        markdown.push(caption);
        markdown.push('');
        imageIndex += 1;
      }

      if (paragraphIndex < paragraphs.length) {
        markdown.push(paragraphs[paragraphIndex]);
        markdown.push('');
        paragraphIndex += 1;
      }
    }

    while (imageIndex < imageSources.length) {
      const src = imageSources[imageIndex];
      const caption = captions[imageIndex] || `사진 ${imageIndex + 1}`;
      markdown.push(`![${caption}](${src})`);
      markdown.push('');
      markdown.push(caption);
      markdown.push('');
      imageIndex += 1;
    }

    return markdown.join('\n').trim();
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

  const blogMarkdown = useMemo(() => buildBlogMarkdown(), [result, imagePreviews]);

  const handleCopyBlogMarkdown = async () => {
    const markdown = blogMarkdown;
    if (!markdown) {
      setToast({ message: '복사할 콘텐츠가 없습니다.', type: 'error' });
      return;
    }

    try {
      await navigator.clipboard.writeText(markdown);
      setToast({ message: '블로그 형식으로 복사되었습니다!', type: 'success' });
    } catch (error) {
      setToast({ message: '복사에 실패했습니다.', type: 'error' });
    }
  };

  const selectedDomain = DOMAINS.find(d => d.id === domainId);
  const selectedPlatform = PLATFORMS.find(p => p.id === platformId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 토스트 알림 */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg animate-slide-up ${
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
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors px-3 py-2 hover:bg-gray-50 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">홈으로</span>
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">콘텐츠 생성 스튜디오</h1>
            </div>
            {selectedDomain && (
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700">
                {selectedDomain.emoji} {selectedDomain.name}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* 좌측: 입력 영역 (40%) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">입력</h2>
              <p className="text-gray-600 text-sm mb-6">콘텐츠 생성을 위한 정보를 입력하세요</p>

              {/* 이미지 업로드 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-1">
                      이미지 (최대 {MAX_IMAGES}장)
                    </label>
                    <p className="text-sm text-gray-600">블로그용 사진을 업로드하면 이미지 설명을 자동으로 생성합니다.</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {imageFiles.length}/{MAX_IMAGES}
                  </span>
                </div>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all bg-gray-50 ${
                    isDragging ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    사진을 이 영역에 끌어다 놓거나
                    <label
                      htmlFor="image-upload"
                      className="text-brand-primary font-semibold cursor-pointer ml-1"
                    >
                      파일 선택
                    </label>
                  </p>
                  <p className="text-xs text-gray-500">JPG, PNG 업로드 가능 (최대 {MAX_IMAGES}장)</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                </div>

                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={`${preview}-${index}`}
                        className="relative rounded-lg overflow-hidden border border-gray-100 bg-white shadow-sm"
                      >
                        <img src={preview} alt={`업로드 이미지 ${index + 1}`} className="w-full h-32 object-cover" />
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                          #{index + 1}
                        </div>
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-600 rounded-full p-1 shadow"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                <div className="mb-4">
                  <label className="block text-lg font-semibold text-gray-900 mb-1">
                    플랫폼 선택 *
                  </label>
                  <p className="text-sm text-gray-600">콘텐츠를 게시할 플랫폼을 선택하세요</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {PLATFORMS.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => {
                          console.log('[Platform] Clicked:', platform.id);
                          setPlatformId(platform.id);
                        }}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all min-h-[100px] cursor-pointer ${
                          platformId === platform.id
                            ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${platform.color}`} />
                        <span className="font-medium text-sm text-gray-900">{platform.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 웹 검색 옵션 */}
              <div className="mb-6">
                <div className="mb-3">
                  <label className="block text-lg font-semibold text-gray-900 mb-1">
                    고급 기능
                  </label>
                  <p className="text-sm text-gray-600">콘텐츠 품질을 높이는 옵션입니다</p>
                </div>
                <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={enableSearch}
                    onChange={(e) => setEnableSearch(e.target.checked)}
                    className="mt-1 w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Search className="w-5 h-5 text-brand-primary" />
                      <div className="font-semibold text-base text-gray-900">
                        기존 콘텐츠 조사
                      </div>
                      <span className="bg-brand-primary text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      관련 블로그 포스트를 검색하여 더 풍부하고 트렌드에 맞는 콘텐츠를 생성합니다
                    </div>
                  </div>
                </label>
              {enableSearch && !isSearchInfoReady && (
                <p className="mt-2 text-xs text-red-500">
                  업체명과 지역을 입력해야 정확한 조사가 가능합니다.
                </p>
              )}
              </div>

              {/* 플러그인 선택 */}
              <div className="mb-6">
                <div className="mb-4">
                  <label className="block text-lg font-semibold text-gray-900 mb-1">
                    플러그인
                  </label>
                  <p className="text-sm text-gray-600">추가 기능을 선택하세요 (복수 선택 가능)</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PLUGINS.map((plugin) => (
                    <label
                      key={plugin.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedPlugins.includes(plugin.id)
                          ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                      }`}
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
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-900 mb-1">{plugin.name}</div>
                        <div className="text-xs text-gray-600">{plugin.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 추가 설정 */}
              <details className="mb-6" open>
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-3">
                  추가 설정 (브랜드 정보, 지역 등)
                </summary>
                <div className="space-y-4 mt-4">
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="브랜드 이름"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-base text-gray-900 placeholder:text-gray-400"
                  />
                  {enableSearch && !trimmedBrandName && (
                    <p className="text-xs text-red-500">
                      기존 콘텐츠 조사를 위해 브랜드/업체 이름을 입력해주세요.
                    </p>
                  )}
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="지역 (예: 강남구)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-base text-gray-900 placeholder:text-gray-400"
                  />
                  {enableSearch && !trimmedRegion && (
                    <p className="text-xs text-red-500">
                      기존 콘텐츠 조사를 위해 도시/지역 정보를 입력해주세요.
                    </p>
                  )}
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
                disabled={isGenerateDisabled}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
                  isGenerateDisabled
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-brand-primary hover:bg-orange-600 text-white shadow-sm hover:shadow-md'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>생성 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>콘텐츠 생성하기</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 우측: 결과 영역 (60%) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[600px]">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">결과</h2>
                <p className="text-sm text-gray-600">생성된 콘텐츠를 확인하세요</p>
              </div>

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
                  <div className="bg-gray-50 rounded-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        {selectedPlatform && (
                          <>
                            <selectedPlatform.icon className={`w-5 h-5 ${selectedPlatform.color}`} />
                            <h3 className="font-bold text-lg">{selectedPlatform.name}</h3>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                          <button
                            onClick={() => setPreviewMode('plain')}
                            className={`px-3 py-1 text-sm rounded-md ${
                              previewMode === 'plain'
                                ? 'bg-brand-primary text-white'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            기본 보기
                          </button>
                          <button
                            onClick={() => setPreviewMode('blog')}
                            className={`px-3 py-1 text-sm rounded-md ${
                              previewMode === 'blog'
                                ? 'bg-brand-primary text-white'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            블로그 미리보기
                          </button>
                        </div>
                        <button
                          onClick={handleCopyBlogMarkdown}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 rounded-lg transition-all font-medium shadow-sm hover:shadow-md bg-white"
                        >
                          <FileText className="w-4 h-4" />
                          <span>블로그 형식 복사</span>
                        </button>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-2 px-6 py-3 bg-brand-accent hover:bg-green-600 text-white rounded-lg transition-all font-semibold shadow-sm hover:shadow-md"
                        >
                          <Copy className="w-5 h-5" />
                          <span>복사하기</span>
                        </button>
                      </div>
                    </div>

                    {/* 본문 */}
                    {previewMode === 'plain' ? (
                      <div className="prose max-w-none mb-4">
                        <pre className="whitespace-pre-wrap font-sans text-gray-800 text-base leading-relaxed">
                          {result.output}
                        </pre>
                      </div>
                    ) : (
                      <div className="prose max-w-none mb-4 border border-gray-100 rounded-lg bg-white">
                        <pre className="whitespace-pre-wrap font-sans text-gray-800 text-base leading-relaxed p-4">
                          {blogMarkdown || '블로그 형식을 생성하려면 이미지가 필요합니다.'}
                        </pre>
                      </div>
                    )}

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
                      className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 rounded-lg transition-all font-semibold shadow-sm hover:shadow-md"
                    >
                      <RefreshCw className="w-5 h-5" />
                      다시 생성하기
                    </button>
                    <button
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-orange-600 text-white rounded-lg transition-all font-semibold shadow-sm hover:shadow-md"
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
