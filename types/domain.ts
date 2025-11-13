/**
 * 업종별 도메인 프로필 타입 정의
 */

export type DomainProfile = {
  id: string;
  tone: {
    brandVoiceDesc: string;
    formality: 'casual' | 'neutral' | 'pro';
  };
  valueProps: string[];
  entities: string[];
  mandatoryPhrases?: string[];
  bannedPhrases?: string[];
  complianceNotes?: string[];
  kpis: string[];
  sampleCTAs: string[];
  hashtagSeeds: string[];
};
