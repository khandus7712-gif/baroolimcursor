/**
 * Payment Provider Interface
 * 결제 프로바이더 추상화 인터페이스
 */

export type Plan = 'starter' | 'pro' | 'biz' | 'pass5';

export interface PaymentProvider {
  /**
   * 구독 생성
   * @param userId - 사용자 ID
   * @param plan - 구독 플랜
   * @returns 구독 ID 및 상태
   */
  createSubscription(userId: string, plan: Plan): Promise<{ id: string; status: string }>;

  /**
   * 구독 취소
   * @param subId - 구독 ID
   */
  cancelSubscription(subId: string): Promise<void>;

  /**
   * 패스 구매
   * @param userId - 사용자 ID
   * @param count - 패스 개수
   * @returns 패스 ID 및 상태
   */
  purchasePass(userId: string, count: number): Promise<{ id: string; status: string }>;
}

/**
 * Memory Payment Provider (Mock)
 * 개발 및 테스트용 메모리 기반 결제 프로바이더
 */
export class MemoryPaymentProvider implements PaymentProvider {
  private subscriptions: Map<string, { id: string; userId: string; plan: Plan; status: string }> = new Map();
  private passes: Map<string, { id: string; userId: string; count: number; status: string }> = new Map();
  private subscriptionCounter = 0;
  private passCounter = 0;

  async createSubscription(userId: string, plan: Plan): Promise<{ id: string; status: string }> {
    this.subscriptionCounter++;
    const subId = `sub_${this.subscriptionCounter}_${Date.now()}`;

    const subscription = {
      id: subId,
      userId,
      plan,
      status: 'active',
    };

    this.subscriptions.set(subId, subscription);

    // 메모리 기반이므로 항상 성공
    return {
      id: subId,
      status: 'active',
    };
  }

  async cancelSubscription(subId: string): Promise<void> {
    const subscription = this.subscriptions.get(subId);
    if (!subscription) {
      throw new Error(`Subscription not found: ${subId}`);
    }

    subscription.status = 'canceled';
    this.subscriptions.set(subId, subscription);
  }

  async purchasePass(userId: string, count: number): Promise<{ id: string; status: string }> {
    if (count <= 0) {
      throw new Error('Pass count must be greater than 0');
    }

    this.passCounter++;
    const passId = `pass_${this.passCounter}_${Date.now()}`;

    const pass = {
      id: passId,
      userId,
      count,
      status: 'active',
    };

    this.passes.set(passId, pass);

    // 메모리 기반이므로 항상 성공
    return {
      id: passId,
      status: 'active',
    };
  }

  // 테스트용 헬퍼 메서드
  getSubscription(subId: string) {
    return this.subscriptions.get(subId);
  }

  getPass(passId: string) {
    return this.passes.get(passId);
  }

  getAllSubscriptions() {
    return Array.from(this.subscriptions.values());
  }

  getAllPasses() {
    return Array.from(this.passes.values());
  }
}

/**
 * Payment Provider Factory
 * 환경에 따라 적절한 결제 프로바이더 반환
 */
export function createPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER || 'memory';

  switch (provider) {
    case 'memory':
      return new MemoryPaymentProvider();
    // case 'toss':
    //   return new TossPaymentProvider();
    // case 'iamport':
    //   return new IamportPaymentProvider();
    default:
      return new MemoryPaymentProvider();
  }
}

/**
 * 싱글톤 인스턴스
 */
export const paymentProvider = createPaymentProvider();

