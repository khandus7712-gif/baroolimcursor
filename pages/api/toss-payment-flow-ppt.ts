/**
 * 토스페이먼츠 결제경로 PPT 생성 API
 * POST /api/toss-payment-flow-ppt
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { generateTossPaymentFlowPPT } from '@/lib/tossPaymentFlowPPT';
import type { MerchantInfo } from '@/lib/tossPaymentFlowPPT';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const merchantInfo: MerchantInfo = req.body;

    // 필수 필드 검증
    if (
      !merchantInfo.상호명 ||
      !merchantInfo.사업자등록번호 ||
      !merchantInfo.대표자명 ||
      !merchantInfo.사업장주소 ||
      !merchantInfo.홈페이지URL ||
      !merchantInfo.고객센터연락처
    ) {
      return res.status(400).json({
        error: '필수 필드가 누락되었습니다: 상호명, 사업자등록번호, 대표자명, 사업장주소, 홈페이지URL, 고객센터연락처',
      });
    }

    // PPT 생성
    const pptxBuffer = await generateTossPaymentFlowPPT(merchantInfo);

    // 파일명 생성
    const fileName = `결제경로_${merchantInfo.상호명.replace(/\s+/g, '_')}.pptx`;

    // 응답 헤더 설정
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader('Content-Length', pptxBuffer.length.toString());

    // PPTX 파일 전송
    return res.send(pptxBuffer);
  } catch (error) {
    console.error('Error generating PPT:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'PPT 생성에 실패했습니다.',
    });
  }
}






