'use client';

/**
 * 📆 예약된 콘텐츠 관리 페이지
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  Send,
  ArrowLeft,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface ScheduledPost {
  id: string;
  domainId: string;
  platformIds: string[];
  content: any;
  imageUrl?: string;
  scheduledFor: string;
  status: 'PENDING' | 'NOTIFIED' | 'PUBLISHED' | 'CANCELLED';
  memo?: string;
  notifyBefore: number;
  notifiedAt?: string;
  publishedAt?: string;
  createdAt: string;
}

export default function ScheduledPage() {
  const router = useRouter();
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [groupedPosts, setGroupedPosts] = useState<Record<string, ScheduledPost[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 임시 userId (실제로는 인증 시스템에서 가져와야 함)
  const userId = 'demo-user-1';

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/scheduled-posts/list?userId=${userId}`);
      const data = await res.json();

      if (data.success) {
        setScheduledPosts(data.scheduledPosts);
        setGroupedPosts(data.groupedByDate);
      } else {
        setError(data.error || '예약 목록을 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 예약을 취소하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/scheduled-posts/${id}/delete`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        alert('예약이 취소되었습니다.');
        fetchScheduledPosts();
      } else {
        alert(data.error || '취소에 실패했습니다.');
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  const handlePublishNow = async (id: string) => {
    if (!confirm('지금 바로 발행하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/scheduled-posts/${id}/publish`, {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success) {
        alert('발행 완료로 표시되었습니다. 각 플랫폼에 콘텐츠를 붙여넣으세요!');
        // 상세 페이지로 이동
        router.push(`/scheduled/${id}`);
      } else {
        alert(data.error || '발행 처리에 실패했습니다.');
      }
    } catch (err) {
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateKey = date.toISOString().split('T')[0];
    const todayKey = today.toISOString().split('T')[0];
    const tomorrowKey = tomorrow.toISOString().split('T')[0];

    if (dateKey === todayKey) return '오늘';
    if (dateKey === tomorrowKey) return '내일';
    
    return `${date.getMonth() + 1}/${date.getDate()} (${['일', '월', '화', '수', '목', '금', '토'][date.getDay()]})`;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    const hour12 = hours % 12 || 12;
    return `${ampm} ${hour12}:${minutes.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            대기 중
          </span>
        );
      case 'NOTIFIED':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
            <AlertCircle className="w-3 h-3" />
            알림 발송됨
          </span>
        );
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" />
            발행 완료
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            <XCircle className="w-3 h-3" />
            취소됨
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-black">📆 예약된 콘텐츠</h1>
                <p className="text-sm text-white/60">
                  {scheduledPosts.length}개의 예약
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/studio')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" />
              새 콘텐츠 생성
            </button>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-xl p-4 text-red-200">
            {error}
          </div>
        )}

        {scheduledPosts.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-20 h-20 text-white/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">예약된 콘텐츠가 없습니다</h2>
            <p className="text-white/60 mb-6">
              콘텐츠를 생성하고 발행 시간을 예약해보세요!
            </p>
            <button
              onClick={() => router.push('/studio')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
            >
              <Plus className="w-6 h-6" />
              첫 콘텐츠 생성하기
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.keys(groupedPosts).sort().map((dateKey) => (
              <div key={dateKey}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-neon-purple" />
                  {formatDate(dateKey)}
                </h2>
                <div className="space-y-4">
                  {groupedPosts[dateKey].map((post) => (
                    <div
                      key={post.id}
                      className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-brand-neon-purple/50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-5 h-5 text-brand-neon-cyan" />
                            <span className="text-lg font-bold">
                              {formatTime(post.scheduledFor)}
                            </span>
                            {getStatusBadge(post.status)}
                          </div>
                          {post.memo && (
                            <p className="text-white/80 mb-3">{post.memo}</p>
                          )}
                          <div className="flex flex-wrap gap-2 text-sm text-white/60">
                            <span>📱 {post.platformIds.length}개 플랫폼</span>
                            <span>•</span>
                            <span>🔔 {post.notifyBefore}분 전 알림</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {post.status === 'PENDING' || post.status === 'NOTIFIED' ? (
                            <>
                              <button
                                onClick={() => handlePublishNow(post.id)}
                                className="p-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                title="지금 발행"
                              >
                                <Send className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => router.push(`/scheduled/${post.id}/edit`)}
                                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                title="수정"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(post.id)}
                                className="p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                title="취소"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


