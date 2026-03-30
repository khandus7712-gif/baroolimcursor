export interface StoreMenuItem {
  name: string;
  price?: number | string | null;
}

export interface StoreProfileContextInput {
  storeName?: string | null;
  storeAddress?: string | null;
  storePhone?: string | null;
  storeHours?: string | null;
  storeOffDay?: string | null;
  storeMenu?: StoreMenuItem[] | null;
  storeFeature?: string | null;
  storeIntro?: string | null;
  storeLink?: string | null;
}

export function buildStoreContext(profile?: StoreProfileContextInput | null): string {
  if (!profile) return '';

  const menuText =
    profile.storeMenu
      ?.map((m) => {
        const name = String(m?.name || '').trim();
        if (!name) return '';
        const raw = m?.price;
        const price =
          raw === undefined || raw === null || raw === ''
            ? ''
            : String(raw).replace(/[^\d]/g, '');
        return price ? `${name} ${price}원` : name;
      })
      .filter(Boolean)
      .join(', ') || '';

  const lines: string[] = ['[가게 정보]'];
  if (profile.storeName) lines.push(`가게명: ${profile.storeName}`);
  if (profile.storeAddress) lines.push(`주소: ${profile.storeAddress}`);
  if (profile.storePhone) lines.push(`전화: ${profile.storePhone}`);
  if (profile.storeHours) lines.push(`영업시간: ${profile.storeHours}`);
  if (profile.storeOffDay) lines.push(`휴무: ${profile.storeOffDay}`);
  if (menuText) lines.push(`대표메뉴: ${menuText}`);
  if (profile.storeFeature) lines.push(`특징: ${profile.storeFeature}`);
  if (profile.storeIntro) lines.push(`소개: ${profile.storeIntro}`);
  if (profile.storeLink) lines.push(`링크: ${profile.storeLink}`);

  return lines.join('\n').trim();
}

