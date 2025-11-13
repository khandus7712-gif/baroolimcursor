'use client';

/**
 * 📱 예약 콘텐츠 발행 페이지
 */

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ArrowLeft,
  Copy,
  Check,
  Instagram,
  Globe,
  Hash,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface ScheduledPost {
  id: string;
  domainId: string;
  platformIds: string[];
  content: any;
  imageUrl?: string;
  scheduledFor: string;
  status: string;
  memo?: string;
  notifyBefore: number;
}

const PLATFORM_INFO: Record<string, { name: string; icon: any; color: string }> = {
  instagram: { name: 'Instagram', icon: Instagram, color: 'from-purple-600 to-pink-600' },
  blog: { name: 'Blog', icon: Globe, color: 'from-blue-600 to-cyan-600' },
  threads: { name: 'Threads', icon: Hash, color: 'from-gray-700 to-purple-600' },
  gmb: { name: 'Google My Business', icon: MapPin, color: 'from-green-600 to-blue-600' },
};

export default function ScheduledPostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const id = params?.id as string;

  const [post, setPost] = useState<ScheduledPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  // 로그인 체크
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/scheduled');
    }
  }, [status, router]);

  useEffect(() => {
    if (id && session?.user?.id) {
      fetchPost();
    }
  }, [id, session]);

  const fetchPost = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      const res = await fetch(`/api/scheduled-posts/list?userId=${session.user.id}`);
      const data = await res.json();

      if (data.success) {
        const foundPost = data.scheduledPosts.find((p: ScheduledPost) => p.id === id);
        if (foundPost) {
          setPost(foundPost);
        } else {
          setError('예약을 찾을 수 없습니다.');
        }
      } else {
        setError(data.error || '예약을 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (platformId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedPlatform(platformId);
      setTimeout(() => setCopiedPlatform(null), 2000);
    } catch (err) {
      alert('복사에 실패했습니다.');
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours() >= 12 ? '오후' : '오전'} ${(date.getHours() % 12 || 12).toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">오류가 발생했습니다</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <button
            onClick={() => router.push('/scheduled')}
            className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/scheduled')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black">⏰ 발행 시간이에요!</h1>
              <p className="text-sm text-white/60">
                예약: {formatDateTime(post.scheduledFor)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* 메모 */}
        {post.memo && (
          <div className="mb-8 bg-blue-900/30 border border-blue-500/30 rounded-2xl p-6">
            <h3 className="font-bold mb-2">📝 메모</h3>
            <p className="text-white/80">{post.memo}</p>
          </div>
        )}

        {/* 이미지 */}
        {post.imageUrl && (
          <div className="mb-8">
            <img 
              src={post.imageUrl} 
              alt="콘텐츠 이미지" 
              className="max-w-md mx-auto rounded-2xl shadow-2xl"
            />
          </div>
        )}

        {/* 플랫폼별 콘텐츠 */}
        <div className="space-y-6">
          {post.platformIds.map((platformId) => {
            const platform = PLATFORM_INFO[platformId];
            if (!platform) return null;

            const Icon = platform.icon;
            const platformContent = post.content[platformId];
            if (!platformContent) return null;

            return (
              <div
                key={platformId}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
              >
                {/* 플랫폼 헤더 */}
                <div className={`bg-gradient-to-r ${platform.color} p-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6" />
                    <span className="text-lg font-bold">{platform.name}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(platformId, platformContent.copy || '')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                      copiedPlatform === platformId
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    {copiedPlatform === platformId ? (
                      <>
                        <Check className="w-5 h-5" />
                        복사됨!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        복사하기
                      </>
                    )}
                  </button>
                </div>

                {/* 콘텐츠 본문 */}
                <div className="p-6 space-y-4">
                  <div className="bg-white/5 rounded-xl p-4 font-mono text-sm whitespace-pre-wrap">
                    {platformContent.copy}
                  </div>

                  {/* 해시태그 */}
                  {platformContent.hashtags && platformContent.hashtags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold mb-2 text-white/60">해시태그</h4>
                      <div className="flex flex-wrap gap-2">
                        {platformContent.hashtags.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-brand-neon-cyan text-sm font-bold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 경고사항 */}
                  {platformContent.warnings && platformContent.warnings.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold mb-2 text-yellow-400">⚠️ 주의사항</h4>
                      <ul className="space-y-1 text-sm text-white/70">
                        {platformContent.warnings.map((warning: string, idx: number) => (
                          <li key={idx}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 글자수 */}
                  <div className="text-xs text-white/50">
                    글자수: {(platformContent.copy || '').length}자
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 완료 버튼 */}
        <div className="mt-8 text-center space-y-4">
          <button
            onClick={async () => {
              const res = await fetch(`/api/scheduled-posts/${id}/publish`, {
                method: 'POST',
              });
              const data = await res.json();
              if (data.success) {
                alert('발행 완료로 표시되었습니다! 🎉');
                router.push('/scheduled');
              }
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 px-10 py-4 rounded-2xl text-lg font-black hover:scale-105 transition-transform"
          >
            <Check className="w-6 h-6" />
            발행 완료
          </button>
          <p className="text-sm text-white/50">
            모든 플랫폼에 콘텐츠를 붙여넣은 후 클릭하세요
          </p>
        </div>
      </main>
    </div>
  );
}


