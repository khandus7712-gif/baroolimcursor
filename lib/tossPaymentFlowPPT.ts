/**
 * 토스페이먼츠 심사용 결제경로 PPT 생성
 * 토스페이먼츠 심사 기준에 100% 맞춘 PPT 생성
 */

import PptxGenJS from 'pptxgenjs';

export interface MerchantInfo {
  상호명: string;
  사업자등록번호: string;
  대표자명: string;
  사업장주소: string;
  홈페이지URL: string;
  고객센터연락처: string;
  테스트ID?: string;
  테스트PW?: string;
  통신판매업신고번호?: string;
  대표전화번호?: string;
}

/**
 * 토스페이먼츠 결제경로 PPT 생성
 * @param merchantInfo - 가맹점 정보
 * @returns PPTX 파일 버퍼
 */
export async function generateTossPaymentFlowPPT(
  merchantInfo: MerchantInfo
): Promise<Buffer> {
  const pptx = new PptxGenJS();

  // 슬라이드 비율 설정
  pptx.layout = 'LAYOUT_WIDE'; // 16:9
  pptx.author = '바로올림';
  pptx.company = merchantInfo.상호명;

  // 헤더/푸터 설정
  const headerText = '토스페이먼츠 결제경로 파일(심사용)';

  // ① 가맹점 정보 기재 (필수 텍스트 페이지)
  const slide1 = pptx.addSlide();
  slide1.background = { color: 'FFFFFF' };
  slide1.addText('① 가맹점 정보', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: '1F2937',
    align: 'left',
  });
  slide1.addText('아래는 토스페이먼츠 결제경로 심사를 위한 가맹점 기본 정보입니다.', {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: 0.5,
    fontSize: 18,
    color: '6B7280',
    align: 'left',
  });
  slide1.addText([
    { text: '상호명: ', options: { bold: true, fontSize: 20 } },
    { text: merchantInfo.상호명, options: { fontSize: 20 } },
  ], {
    x: 0.5,
    y: 2.0,
    w: 9,
    h: 0.6,
    align: 'left',
  });
  slide1.addText([
    { text: '사업자등록번호: ', options: { bold: true, fontSize: 20 } },
    { text: merchantInfo.사업자등록번호, options: { fontSize: 20 } },
  ], {
    x: 0.5,
    y: 2.7,
    w: 9,
    h: 0.6,
    align: 'left',
  });
  slide1.addText([
    { text: '대표자명: ', options: { bold: true, fontSize: 20 } },
    { text: merchantInfo.대표자명, options: { fontSize: 20 } },
  ], {
    x: 0.5,
    y: 3.4,
    w: 9,
    h: 0.6,
    align: 'left',
  });
  slide1.addText([
    { text: '사업장 주소: ', options: { bold: true, fontSize: 20 } },
    { text: merchantInfo.사업장주소, options: { fontSize: 20 } },
  ], {
    x: 0.5,
    y: 4.1,
    w: 9,
    h: 0.6,
    align: 'left',
  });
  slide1.addText([
    { text: '홈페이지 URL: ', options: { bold: true, fontSize: 20 } },
    { text: merchantInfo.홈페이지URL, options: { fontSize: 20, color: '0066CC' } },
  ], {
    x: 0.5,
    y: 4.8,
    w: 9,
    h: 0.6,
    align: 'left',
  });
  slide1.addText([
    { text: '고객센터 연락처: ', options: { bold: true, fontSize: 20 } },
    { text: merchantInfo.고객센터연락처, options: { fontSize: 20 } },
  ], {
    x: 0.5,
    y: 5.5,
    w: 9,
    h: 0.6,
    align: 'left',
  });
  slide1.addText([
    { text: '테스트 ID: ', options: { bold: true, fontSize: 20 } },
    { text: merchantInfo.테스트ID || '테스트 계정 없음', options: { fontSize: 20 } },
  ], {
    x: 0.5,
    y: 6.2,
    w: 9,
    h: 0.6,
    align: 'left',
  });
  slide1.addText([
    { text: '테스트 PW: ', options: { bold: true, fontSize: 20 } },
    { text: merchantInfo.테스트PW || '테스트 계정 없음', options: { fontSize: 20 } },
  ], {
    x: 0.5,
    y: 6.9,
    w: 9,
    h: 0.6,
    align: 'left',
  });

  // ② 하단 정보 캡처 페이지
  const slide2 = pptx.addSlide();
  slide2.background = { color: 'FFFFFF' };
  const slide2Objects = [
      {
        text: '② 하단 사업자 정보(푸터) 캡처',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 32,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        text: '아래 항목들이 모두 보이도록 하단(푸터) 화면을 캡처하여 이미지를 삽입하세요.',
        options: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.5,
          fontSize: 16,
          color: '6B7280',
          align: 'left',
        },
      },
      {
        rect: {
          x: 0.5,
          y: 2.0,
          w: 9,
          h: 4.5,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[이미지 삽입 영역]\n\n필수 포함 항목:\n• 상호명\n• 대표자명\n• 사업자등록번호\n• 통신판매업신고번호\n• 사업장 주소\n• 대표 전화번호',
        options: {
          x: 0.5,
          y: 2.0,
          w: 9,
          h: 4.5,
          fontSize: 18,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
      {
        text: '※ 도메인(URL)이 반드시 보이도록 전체 화면을 캡처하세요.',
        options: {
          x: 0.5,
          y: 6.8,
          w: 9,
          h: 0.4,
          fontSize: 14,
          color: 'EF4444',
          italic: true,
          align: 'left',
        },
      },
    ];
  slide2Objects.forEach((obj: any) => {
    if (obj.text) {
      slide2.addText(obj.text, obj.options || {});
    } else if (obj.rect) {
      slide2.addShape(pptx.ShapeType.rect, obj.rect);
    }
  });

  // ③ 환불 규정 캡처 페이지
  const slide3 = pptx.addSlide();
  slide3.background = { color: 'FFFFFF' };
  const slide3Objects = [
      {
        text: '③ 환불 및 교환 규정 캡처',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 32,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        text: '환불 규정 전체가 포함된 화면을 캡처하여 이미지를 삽입하세요.',
        options: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.5,
          fontSize: 16,
          color: '6B7280',
          align: 'left',
        },
      },
      {
        rect: {
          x: 0.5,
          y: 2.0,
          w: 9,
          h: 4.5,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[환불 규정 캡처 이미지 삽입 영역]',
        options: {
          x: 0.5,
          y: 2.0,
          w: 9,
          h: 4.5,
          fontSize: 20,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
      {
        text: '※ 환불 규정 전체 내용이 보이도록 캡처하세요.',
        options: {
          x: 0.5,
          y: 6.8,
          w: 9,
          h: 0.4,
          fontSize: 14,
          color: 'EF4444',
          italic: true,
          align: 'left',
        },
      },
    ];
  slide3Objects.forEach((obj: any) => {
    if (obj.text) {
      slide3.addText(obj.text, obj.options || {});
    } else if (obj.rect) {
      slide3.addShape(pptx.ShapeType.rect, obj.rect);
    }
  });

  // ④ 로그인 / 회원가입 경로 페이지
  const slide4 = pptx.addSlide();
  slide4.background = { color: 'FFFFFF' };
  const slide4Objects = [
      {
        text: '④ 로그인 / 회원가입 / 비회원 구매 경로',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 32,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        text: '로그인, 회원가입, 비회원 구매 화면을 캡처하여 이미지를 삽입하세요.',
        options: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.5,
          fontSize: 16,
          color: '6B7280',
          align: 'left',
        },
      },
      {
        text: '1. 로그인 화면',
        options: {
          x: 0.5,
          y: 2.0,
          w: 4.3,
          h: 0.4,
          fontSize: 18,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        rect: {
          x: 0.5,
          y: 2.5,
          w: 4.3,
          h: 2.0,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[로그인 화면 캡처]',
        options: {
          x: 0.5,
          y: 2.5,
          w: 4.3,
          h: 2.0,
          fontSize: 16,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
      {
        text: '2. 회원가입 화면',
        options: {
          x: 5.2,
          y: 2.0,
          w: 4.3,
          h: 0.4,
          fontSize: 18,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        rect: {
          x: 5.2,
          y: 2.5,
          w: 4.3,
          h: 2.0,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[회원가입 화면 캡처]',
        options: {
          x: 5.2,
          y: 2.5,
          w: 4.3,
          h: 2.0,
          fontSize: 16,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
      {
        text: '3. 비회원 구매 버튼 (해당 시)',
        options: {
          x: 0.5,
          y: 4.8,
          w: 9,
          h: 0.4,
          fontSize: 18,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        rect: {
          x: 0.5,
          y: 5.3,
          w: 9,
          h: 1.5,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[비회원 구매 버튼 캡처]',
        options: {
          x: 0.5,
          y: 5.3,
          w: 9,
          h: 1.5,
          fontSize: 16,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
    ];
  slide4Objects.forEach((obj: any) => {
    if (obj.text) {
      slide4.addText(obj.text, obj.options || {});
    } else if (obj.rect) {
      slide4.addShape(pptx.ShapeType.rect, obj.rect);
    }
  });

  // ⑤ 상품 선택 과정 페이지
  const slide5 = pptx.addSlide();
  slide5.background = { color: 'FFFFFF' };
  const slide5Objects = [
      {
        text: '⑤ 상품 선택 과정',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 32,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        text: '상품 리스트 → 상품 상세 → 장바구니 화면을 캡처하여 이미지를 삽입하세요.',
        options: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.5,
          fontSize: 16,
          color: '6B7280',
          align: 'left',
        },
      },
      {
        text: '1. 상품 리스트 화면',
        options: {
          x: 0.5,
          y: 2.0,
          w: 9,
          h: 0.4,
          fontSize: 18,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        rect: {
          x: 0.5,
          y: 2.5,
          w: 9,
          h: 1.8,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[상품 리스트 화면 캡처]\n※ 상품 정보, 가격, 상세설명이 보이도록 캡처',
        options: {
          x: 0.5,
          y: 2.5,
          w: 9,
          h: 1.8,
          fontSize: 16,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
      {
        text: '2. 상품 상세 화면',
        options: {
          x: 0.5,
          y: 4.5,
          w: 9,
          h: 0.4,
          fontSize: 18,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        rect: {
          x: 0.5,
          y: 5.0,
          w: 9,
          h: 1.8,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[상품 상세 화면 캡처]',
        options: {
          x: 0.5,
          y: 5.0,
          w: 9,
          h: 1.8,
          fontSize: 16,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
    ];
  slide5Objects.forEach((obj: any) => {
    if (obj.text) {
      slide5.addText(obj.text, obj.options || {});
    } else if (obj.rect) {
      slide5.addShape(pptx.ShapeType.rect, obj.rect);
    }
  });

  // 장바구니 화면 추가
  const slide5_2 = pptx.addSlide();
  slide5_2.background = { color: 'FFFFFF' };
  const slide5_2Objects = [
      {
        text: '⑤-2 장바구니 화면',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 32,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        text: '장바구니 화면을 캡처하여 이미지를 삽입하세요.',
        options: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.5,
          fontSize: 16,
          color: '6B7280',
          align: 'left',
        },
      },
      {
        rect: {
          x: 0.5,
          y: 2.0,
          w: 9,
          h: 4.5,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[장바구니 화면 캡처]',
        options: {
          x: 0.5,
          y: 2.0,
          w: 9,
          h: 4.5,
          fontSize: 20,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
    ];
  slide5_2Objects.forEach((obj: any) => {
    if (obj.text) {
      slide5_2.addText(obj.text, obj.options || {});
    } else if (obj.rect) {
      slide5_2.addShape(pptx.ShapeType.rect, obj.rect);
    }
  });

  // ⑥ 주문서 & 결제수단 선택
  const slide6 = pptx.addSlide();
  slide6.background = { color: 'FFFFFF' };
  const slide6Objects = [
      {
        text: '⑥ 주문서 & 결제수단 선택',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 32,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        text: '주문서 작성 및 결제수단 선택 화면을 캡처하여 이미지를 삽입하세요.',
        options: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.5,
          fontSize: 16,
          color: '6B7280',
          align: 'left',
        },
      },
      {
        text: '1. 주문서 작성 화면',
        options: {
          x: 0.5,
          y: 2.0,
          w: 9,
          h: 0.4,
          fontSize: 18,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        rect: {
          x: 0.5,
          y: 2.5,
          w: 9,
          h: 1.8,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[주문서 작성 화면 캡처]\n※ 주문자 정보, 배송 정보가 보이도록 캡처',
        options: {
          x: 0.5,
          y: 2.5,
          w: 9,
          h: 1.8,
          fontSize: 16,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
      {
        text: '2. 결제수단 선택 화면',
        options: {
          x: 0.5,
          y: 4.5,
          w: 9,
          h: 0.4,
          fontSize: 18,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        rect: {
          x: 0.5,
          y: 5.0,
          w: 9,
          h: 1.8,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[결제수단 선택 화면 캡처]\n※ 모든 결제수단 선택 창이 보이도록 캡처',
        options: {
          x: 0.5,
          y: 5.0,
          w: 9,
          h: 1.8,
          fontSize: 16,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
    ];
  slide6Objects.forEach((obj: any) => {
    if (obj.text) {
      slide6.addText(obj.text, obj.options || {});
    } else if (obj.rect) {
      slide6.addShape(pptx.ShapeType.rect, obj.rect);
    }
  });

  // ⑦ 카드 결제 경로 페이지 (필수)
  const slide7 = pptx.addSlide();
  slide7.background = { color: 'FFFFFF' };
  const slide7Objects = [
      {
        text: '⑦ 카드 결제 흐름 전체',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 32,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        text: '카드 결제 과정의 각 단계를 캡처하여 이미지를 삽입하세요.',
        options: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.5,
          fontSize: 16,
          color: '6B7280',
          align: 'left',
        },
      },
      {
        text: '1. 카드 약관 동의 화면',
        options: {
          x: 0.5,
          y: 2.0,
          w: 9,
          h: 0.4,
          fontSize: 18,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        rect: {
          x: 0.5,
          y: 2.5,
          w: 9,
          h: 1.5,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[카드 약관 동의 화면 캡처]',
        options: {
          x: 0.5,
          y: 2.5,
          w: 9,
          h: 1.5,
          fontSize: 16,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
      {
        text: '2. 카드 번호 입력 화면',
        options: {
          x: 0.5,
          y: 4.2,
          w: 9,
          h: 0.4,
          fontSize: 18,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        rect: {
          x: 0.5,
          y: 4.7,
          w: 9,
          h: 1.5,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[카드 번호 입력 화면 캡처]',
        options: {
          x: 0.5,
          y: 4.7,
          w: 9,
          h: 1.5,
          fontSize: 16,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
    ];
  slide7Objects.forEach((obj: any) => {
    if (obj.text) {
      slide7.addText(obj.text, obj.options || {});
    } else if (obj.rect) {
      slide7.addShape(pptx.ShapeType.rect, obj.rect);
    }
  });

  // 카드 결제 - 본인 인증 화면
  const slide7_2 = pptx.addSlide();
  slide7_2.background = { color: 'FFFFFF' };
  const slide7_2Objects = [
      {
        text: '⑦-2 카드 결제 - 본인 인증',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 32,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        text: '본인 인증 화면을 캡처하여 이미지를 삽입하세요.',
        options: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.5,
          fontSize: 16,
          color: '6B7280',
          align: 'left',
        },
      },
      {
        rect: {
          x: 0.5,
          y: 2.0,
          w: 9,
          h: 4.5,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[본인 인증 화면 캡처]\n(비밀번호/간편인증 등)',
        options: {
          x: 0.5,
          y: 2.0,
          w: 9,
          h: 4.5,
          fontSize: 18,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
    ];
  slide7_2Objects.forEach((obj: any) => {
    if (obj.text) {
      slide7_2.addText(obj.text, obj.options || {});
    } else if (obj.rect) {
      slide7_2.addShape(pptx.ShapeType.rect, obj.rect);
    }
  });

  // ⑧ 비씨카드 결제창 (해당 시)
  const slide8 = pptx.addSlide();
  slide8.background = { color: 'FFFFFF' };
  const slide8Objects = [
      {
        text: '⑧ 비씨카드 결제창 (해당 시 필수)',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 32,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        text: '비씨카드 연동 시 반드시 실제 카드 결제창을 캡처하여 이미지를 삽입하세요.',
        options: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.5,
          fontSize: 16,
          color: 'EF4444',
          bold: true,
          align: 'left',
        },
      },
      {
        text: '1. 비씨카드 결제창',
        options: {
          x: 0.5,
          y: 2.0,
          w: 9,
          h: 0.4,
          fontSize: 18,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        rect: {
          x: 0.5,
          y: 2.5,
          w: 9,
          h: 1.8,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[비씨카드 결제창 캡처]',
        options: {
          x: 0.5,
          y: 2.5,
          w: 9,
          h: 1.8,
          fontSize: 16,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
      {
        text: '2. 비씨카드 인증창',
        options: {
          x: 0.5,
          y: 4.5,
          w: 9,
          h: 0.4,
          fontSize: 18,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        rect: {
          x: 0.5,
          y: 5.0,
          w: 9,
          h: 1.8,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[비씨카드 인증창 캡처]',
        options: {
          x: 0.5,
          y: 5.0,
          w: 9,
          h: 1.8,
          fontSize: 16,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
    ];
  slide8Objects.forEach((obj: any) => {
    if (obj.text) {
      slide8.addText(obj.text, obj.options || {});
    } else if (obj.rect) {
      slide8.addShape(pptx.ShapeType.rect, obj.rect);
    }
  });

  // ⑨ 정기결제 카드 입력창 (해당 시)
  const slide9 = pptx.addSlide();
  slide9.background = { color: 'FFFFFF' };
  const slide9Objects = [
      {
        text: '⑨ 정기결제 카드 입력창 (해당 시)',
        options: {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.8,
          fontSize: 32,
          bold: true,
          color: '1F2937',
          align: 'left',
        },
      },
      {
        text: '정기결제 사용 시 카드 입력 페이지를 캡처하여 이미지를 삽입하세요.',
        options: {
          x: 0.5,
          y: 1.2,
          w: 9,
          h: 0.5,
          fontSize: 16,
          color: '6B7280',
          align: 'left',
        },
      },
      {
        rect: {
          x: 0.5,
          y: 2.0,
          w: 9,
          h: 4.5,
          fill: { color: 'F3F4F6' },
          line: { color: 'D1D5DB', width: 2, dashType: 'dash' },
        },
      },
      {
        text: '[정기결제 카드 입력창 캡처]\n\n필수 포함 항목:\n• 카드 번호 입력\n• 유효기간\n• 정기결제 안내 문구',
        options: {
          x: 0.5,
          y: 2.0,
          w: 9,
          h: 4.5,
          fontSize: 18,
          color: '9CA3AF',
          align: 'center',
          valign: 'middle',
        },
      },
    ];
  slide9Objects.forEach((obj: any) => {
    if (obj.text) {
      slide9.addText(obj.text, obj.options || {});
    } else if (obj.rect) {
      slide9.addShape(pptx.ShapeType.rect, obj.rect);
    }
  });

  // ⑩ 마지막 종료 페이지
  const slide10 = pptx.addSlide();
  slide10.background = { color: 'FFFFFF' };
  const slide10Objects = [
      {
        text: '감사합니다',
        options: {
          x: 0.5,
          y: 3.0,
          w: 9,
          h: 1.5,
          fontSize: 48,
          bold: true,
          color: '1F2937',
          align: 'center',
          valign: 'middle',
        },
      },
      {
        text: `가맹점: ${merchantInfo.상호명}\n토스페이먼츠 결제경로 심사 파일`,
        options: {
          x: 0.5,
          y: 5.0,
          w: 9,
          h: 1.0,
          fontSize: 20,
          color: '6B7280',
          align: 'center',
        },
      },
    ];
  slide10Objects.forEach((obj: any) => {
    if (obj.text) {
      slide10.addText(obj.text, obj.options || {});
    } else if (obj.rect) {
      slide10.addShape(pptx.ShapeType.rect, obj.rect);
    }
  });

  // 모든 슬라이드에 헤더 추가
  const slides = pptx.slides;
  slides.forEach((slide) => {
    slide.addText(headerText, {
      x: 0.5,
      y: 0.1,
      w: 9,
      h: 0.3,
      fontSize: 12,
      color: '9CA3AF',
      align: 'left',
    });
  });

  // PPTX 파일 생성
  const pptxBuffer = await pptx.write({ outputType: 'nodebuffer' });
  return Buffer.from(pptxBuffer);
}






