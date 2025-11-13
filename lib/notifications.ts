/**
 * 알림 시스템 유틸리티
 * Resend 이메일 서비스 사용
 */

import { Resend } from 'resend';

interface NotificationData {
  scheduledPostId: string;
  userId: string;
  scheduledFor: Date;
  memo?: string;
  notifyBefore: number;
}

// Resend 초기화
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * 이메일 알림 발송 (Resend 사용)
 */
export async function sendEmailNotification(
  email: string,
  data: NotificationData
): Promise<boolean> {
  try {
    // API 키가 없으면 개발 모드 (콘솔만 출력)
    if (!resend) {
      console.log('📧 [DEV] 이메일 알림 발송:', {
        to: email,
        scheduledPostId: data.scheduledPostId,
        scheduledFor: data.scheduledFor,
        memo: data.memo,
      });
      return true;
    }

    const scheduledTime = new Date(data.scheduledFor);
    const formattedTime = scheduledTime.toLocaleString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    // 이메일 발송
    await resend.emails.send({
      from: 'no-reply@baroolim.com',
      to: email,
      subject: `🔔 [바로올림] 오늘 ${formattedTime}에 콘텐츠 발행 예정이에요!`,
      html: generateEmailHTML(data, formattedTime),
    });

    console.log('✅ 이메일 발송 성공:', email);
    return true;
  } catch (error) {
    console.error('❌ 이메일 발송 실패:', error);
    return false;
  }
}

/**
 * 카카오톡 알림 발송
 * TODO: 카카오톡 비즈니스 API 연동 필요
 */
export async function sendKakaoNotification(
  phoneNumber: string,
  data: NotificationData
): Promise<boolean> {
  try {
    console.log('💬 카카오톡 알림 발송:', {
      to: phoneNumber,
      scheduledPostId: data.scheduledPostId,
      scheduledFor: data.scheduledFor,
      memo: data.memo,
    });

    // TODO: 실제 카카오톡 알림톡 발송 로직
    // 카카오톡 비즈니스 API 필요

    return true;
  } catch (error) {
    console.error('카카오톡 발송 실패:', error);
    return false;
  }
}

/**
 * 브라우저 푸시 알림 발송
 * TODO: Web Push API 연동 필요
 */
export async function sendPushNotification(
  subscription: any,
  data: NotificationData
): Promise<boolean> {
  try {
    console.log('🔔 푸시 알림 발송:', {
      subscription,
      scheduledPostId: data.scheduledPostId,
      scheduledFor: data.scheduledFor,
      memo: data.memo,
    });

    // TODO: Web Push 발송 로직

    return true;
  } catch (error) {
    console.error('푸시 알림 발송 실패:', error);
    return false;
  }
}

/**
 * 이메일 HTML 템플릿 생성
 */
function generateEmailHTML(data: NotificationData, formattedTime?: string): string {
  const scheduledTime = formattedTime || new Date(data.scheduledFor).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header {
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          padding: 40px 30px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 900;
        }
        .content {
          padding: 40px 30px;
        }
        .time-box {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          padding: 30px;
          border-radius: 15px;
          margin: 30px 0;
          text-align: center;
        }
        .time-box .time {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin: 10px 0;
        }
        .memo {
          background: #fffbeb;
          border-left: 4px solid #f59e0b;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          color: white;
          text-decoration: none;
          padding: 18px 40px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 18px;
          margin: 20px 0;
          box-shadow: 0 10px 30px rgba(168, 85, 247, 0.4);
        }
        .footer {
          text-align: center;
          padding: 30px;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 발행 시간이 다가왔어요!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">
            바로올림에서 알려드립니다
          </p>
        </div>
        
        <div class="content">
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            안녕하세요! 사장님이 예약하신 콘텐츠의 발행 시간이 다가왔습니다.
          </p>

          <div class="time-box">
            <div style="color: #6b7280; font-size: 14px;">예약 시간</div>
            <div class="time">📅 ${scheduledTime}</div>
          </div>

          ${
            data.memo
              ? `
          <div class="memo">
            <strong>📝 메모:</strong><br />
            ${data.memo}
          </div>
          `
              : ''
          }

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/scheduled/${data.scheduledPostId}" class="button">
              지금 바로 포스팅하기 👉
            </a>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 10px;">
            <strong style="color: #1f2937;">💡 발행 방법</strong>
            <ol style="margin: 10px 0; padding-left: 20px; color: #6b7280;">
              <li>위 버튼을 클릭하여 발행 페이지로 이동</li>
              <li>각 플랫폼별로 "복사하기" 버튼 클릭</li>
              <li>해당 플랫폼 앱에서 붙여넣기</li>
              <li>모두 완료 후 "발행 완료" 버튼 클릭</li>
            </ol>
          </div>
        </div>

        <div class="footer">
          <p style="margin: 5px 0;">
            © 2024 바로올림 | Made with ❤️ by 퍼나르
          </p>
          <p style="margin: 5px 0; font-size: 12px;">
            이 메일은 예약 발행 알림입니다. 예약을 취소하려면 
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/scheduled" style="color: #a855f7;">여기</a>를 클릭하세요.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 모든 알림 채널로 발송
 */
export async function sendNotification(
  userId: string,
  userEmail: string,
  userPhone: string | null,
  data: NotificationData
): Promise<{ email: boolean; kakao: boolean; push: boolean }> {
  const results = {
    email: false,
    kakao: false,
    push: false,
  };

  // 이메일 알림
  if (userEmail) {
    results.email = await sendEmailNotification(userEmail, data);
  }

  // 카카오톡 알림 (전화번호가 있을 경우)
  if (userPhone) {
    results.kakao = await sendKakaoNotification(userPhone, data);
  }

  // 푸시 알림 (구독 정보가 있을 경우)
  // TODO: 사용자의 푸시 구독 정보 조회 및 발송

  return results;
}


