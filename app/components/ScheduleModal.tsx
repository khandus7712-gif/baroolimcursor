'use client';

/**
 * 📅 예약 발행 설정 모달
 */

import { useState } from 'react';
import { X, Calendar, Clock, Bell } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (data: {
    scheduledFor: Date;
    memo: string;
    notifyBefore: number;
  }) => void;
  generatedContent: any;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  onSchedule,
  generatedContent,
}: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [memo, setMemo] = useState('');
  const [notifyBefore, setNotifyBefore] = useState(10);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      alert('날짜와 시간을 선택해주세요.');
      return;
    }

    const scheduledFor = new Date(`${selectedDate}T${selectedTime}`);
    if (scheduledFor <= new Date()) {
      alert('예약 시간은 현재 시간 이후여야 합니다.');
      return;
    }

    onSchedule({
      scheduledFor,
      memo,
      notifyBefore,
    });
  };

  // 최소 날짜 (오늘)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        {/* 헤더 */}
        <div className="sticky top-0 bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-7 h-7 text-white" />
            <h2 className="text-2xl font-black text-white">예약 발행 설정</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6 space-y-6">
          {/* 발행 날짜 */}
          <div>
            <label className="block text-sm font-bold text-white/90 mb-2">
              📅 발행 날짜 *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-brand-neon-purple focus:border-transparent"
            />
          </div>

          {/* 발행 시간 */}
          <div>
            <label className="block text-sm font-bold text-white/90 mb-2">
              🕐 발행 시간 *
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-brand-neon-purple focus:border-transparent"
            />
          </div>

          {/* 알림 설정 */}
          <div>
            <label className="block text-sm font-bold text-white/90 mb-2">
              🔔 알림 받기
            </label>
            <select
              value={notifyBefore}
              onChange={(e) => setNotifyBefore(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-brand-neon-purple focus:border-transparent"
            >
              <option value="5">5분 전</option>
              <option value="10">10분 전 (추천)</option>
              <option value="15">15분 전</option>
              <option value="30">30분 전</option>
              <option value="60">1시간 전</option>
            </select>
            <p className="mt-2 text-xs text-white/50">
              💡 발행 시간 {notifyBefore}분 전에 알림을 받으실 수 있어요
            </p>
          </div>

          {/* 메모 */}
          <div>
            <label className="block text-sm font-bold text-white/90 mb-2">
              📝 메모 (선택)
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예: 월요일 아침 포스팅"
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:ring-2 focus:ring-brand-neon-purple focus:border-transparent resize-none"
            />
          </div>

          {/* 미리보기 */}
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white/90 mb-3">📋 예약 요약</h3>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-neon-cyan" />
                <span>
                  {selectedDate && selectedTime
                    ? `${selectedDate} ${selectedTime}`
                    : '날짜와 시간을 선택해주세요'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-neon-cyan" />
                <span>발행 {notifyBefore}분 전 알림</span>
              </div>
              {memo && (
                <div className="flex items-center gap-2">
                  <span className="text-brand-neon-cyan">📝</span>
                  <span>{memo}</span>
                </div>
              )}
            </div>
          </div>

          {/* 알림 채널 안내 */}
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="text-sm font-bold text-yellow-300 mb-2">🔔 알림 방법</h3>
            <ul className="space-y-1 text-xs text-white/70">
              <li>✅ 이메일 알림 (기본)</li>
              <li>⚠️ 카카오톡 알림 (준비 중)</li>
              <li>⚠️ 브라우저 푸시 (준비 중)</li>
            </ul>
          </div>
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 bg-gradient-to-t from-black to-transparent p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-white transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-brand-neon-purple to-brand-neon-pink hover:scale-105 rounded-xl font-bold text-white shadow-lg transition-transform"
          >
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
}












