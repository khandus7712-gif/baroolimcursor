/**
 * 결제 관련 타입 정의
 */

/**
 * 구독 플랜 타입
 */
export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise';

/**
 * 구독 상태
 */
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

/**
 * 패스 타입 (일회성 구매)
 */
export type PassType = 'single' | 'pack_10' | 'pack_50' | 'pack_100';

/**
 * 사용자 구독 정보
 */
export interface UserSubscription {
  /** 사용자 ID */
  userId: string;
  /** 구독 플랜 */
  plan: SubscriptionPlan;
  /** 구독 상태 */
  status: SubscriptionStatus;
  /** 구독 시작일 */
  startDate: Date;
  /** 구독 종료일 */
  endDate?: Date;
  /** 결제 프로바이더 구독 ID */
  providerSubscriptionId?: string;
}

/**
 * 사용자 패스 정보
 */
export interface UserPass {
  /** 사용자 ID */
  userId: string;
  /** 패스 타입 */
  type: PassType;
  /** 남은 사용 횟수 */
  remainingUses: number;
  /** 구매일 */
  purchaseDate: Date;
  /** 만료일 */
  expiryDate?: Date;
}

/**
 * 결제 프로바이더 인터페이스
 */
export interface PaymentProvider {
  /** 프로바이더 이름 */
  name: string;
  /** 구독 생성 */
  createSubscription(
    userId: string,
    plan: SubscriptionPlan
  ): Promise<{ subscriptionId: string; clientSecret?: string }>;
  /** 구독 취소 */
  cancelSubscription(subscriptionId: string): Promise<void>;
  /** 구독 갱신 */
  renewSubscription(subscriptionId: string): Promise<void>;
  /** 패스 구매 */
  purchasePass(userId: string, passType: PassType): Promise<{ passId: string }>;
  /** 구독 정보 조회 */
  getSubscription(subscriptionId: string): Promise<UserSubscription | null>;
  /** 패스 정보 조회 */
  getPass(passId: string): Promise<UserPass | null>;
}

/**
 * 결제 요청
 */
export interface PaymentRequest {
  /** 사용자 ID */
  userId: string;
  /** 구독 플랜 또는 패스 타입 */
  type: SubscriptionPlan | PassType;
  /** 결제 금액 (센트 단위) */
  amount: number;
  /** 통화 */
  currency?: string;
}

/**
 * 결제 응답
 */
export interface PaymentResponse {
  /** 결제 ID */
  paymentId: string;
  /** 상태 */
  status: 'succeeded' | 'pending' | 'failed';
  /** 클라이언트 시크릿 (필요한 경우) */
  clientSecret?: string;
  /** 에러 메시지 (실패한 경우) */
  error?: string;
}

