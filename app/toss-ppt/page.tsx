/**
 * 토스페이먼츠 결제경로 PPT 생성 페이지
 */

'use client';

import { useState } from 'react';
import { Download, FileText, Loader2, Check } from 'lucide-react';
import type { MerchantInfo } from '@/lib/tossPaymentFlowPPT';

export default function TossPPTPage() {
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo>({
    상호명: '',
    사업자등록번호: '',
    대표자명: '',
    사업장주소: '',
    홈페이지URL: '',
    고객센터연락처: '',
    테스트ID: '',
    테스트PW: '',
    통신판매업신고번호: '',
    대표전화번호: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof MerchantInfo, value: string) => {
    setMerchantInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    // 필수 필드 검증
    if (
      !merchantInfo.상호명 ||
      !merchantInfo.사업자등록번호 ||
      !merchantInfo.대표자명 ||
      !merchantInfo.사업장주소 ||
      !merchantInfo.홈페이지URL ||
      !merchantInfo.고객센터연락처
    ) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/toss-payment-flow-ppt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(merchantInfo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'PPT 생성에 실패했습니다.');
      }

      // 파일 다운로드
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `결제경로_${merchantInfo.상호명.replace(/\s+/g, '_')}.pptx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'PPT 생성에 실패했습니다.';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-brand-primary" />
            <h1 className="text-3xl font-bold text-gray-900">토스페이먼츠 결제경로 PPT 생성</h1>
          </div>
          <p className="text-gray-600">
            토스페이먼츠 심사 기준에 맞춘 결제경로 PPT를 자동으로 생성합니다.
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">가맹점 정보 입력</h2>

          <div className="space-y-4">
            {/* 필수 항목 */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">필수 항목 *</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상호명 *
              </label>
              <input
                type="text"
                value={merchantInfo.상호명}
                onChange={(e) => handleInputChange('상호명', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="예: 바로올림"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업자등록번호 *
              </label>
              <input
                type="text"
                value={merchantInfo.사업자등록번호}
                onChange={(e) => handleInputChange('사업자등록번호', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="예: 123-45-67890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대표자명 *
              </label>
              <input
                type="text"
                value={merchantInfo.대표자명}
                onChange={(e) => handleInputChange('대표자명', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="예: 홍길동"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업장 주소 *
              </label>
              <input
                type="text"
                value={merchantInfo.사업장주소}
                onChange={(e) => handleInputChange('사업장주소', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="예: 서울특별시 강남구 테헤란로 123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                홈페이지 URL *
              </label>
              <input
                type="url"
                value={merchantInfo.홈페이지URL}
                onChange={(e) => handleInputChange('홈페이지URL', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="예: https://baroolim.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                고객센터 연락처 *
              </label>
              <input
                type="text"
                value={merchantInfo.고객센터연락처}
                onChange={(e) => handleInputChange('고객센터연락처', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="예: 02-1234-5678"
              />
            </div>

            {/* 선택 항목 */}
            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">선택 항목</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                테스트 ID
              </label>
              <input
                type="text"
                value={merchantInfo.테스트ID || ''}
                onChange={(e) => handleInputChange('테스트ID', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="없으면 비워두세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                테스트 PW
              </label>
              <input
                type="password"
                value={merchantInfo.테스트PW || ''}
                onChange={(e) => handleInputChange('테스트PW', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="없으면 비워두세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                통신판매업신고번호
              </label>
              <input
                type="text"
                value={merchantInfo.통신판매업신고번호 || ''}
                onChange={(e) => handleInputChange('통신판매업신고번호', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="예: 제2024-서울강남-1234호"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대표 전화번호
              </label>
              <input
                type="text"
                value={merchantInfo.대표전화번호 || ''}
                onChange={(e) => handleInputChange('대표전화번호', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="예: 02-1234-5678"
              />
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* 성공 메시지 */}
          {success && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-green-700">PPT가 성공적으로 생성되었습니다!</p>
            </div>
          )}

          {/* 생성 버튼 */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`mt-6 w-full py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
              isGenerating
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-brand-primary hover:bg-orange-600 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>PPT 생성 중...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>PPT 생성 및 다운로드</span>
              </>
            )}
          </button>
        </div>

        {/* 안내 사항 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📌 안내 사항</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• 생성된 PPT 파일에 각 화면 캡처 이미지를 직접 삽입하세요.</li>
            <li>• 모든 캡처 화면은 도메인(URL)이 반드시 보이도록 전체 화면을 캡처하세요.</li>
            <li>• PC 기준 화면으로 캡처하세요.</li>
            <li>• 상품 정보, 가격, 상세설명이 반드시 기재된 화면을 포함하세요.</li>
            <li>• 모든 결제수단 선택 창이 보이도록 구성하세요.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}






