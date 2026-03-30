import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type StoreMenuItem = { name: string; price?: number | string };

function normalizeStoreMenu(input: unknown): { name: string; price?: number }[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      const obj = item as StoreMenuItem;
      const name = String(obj?.name || '').trim();
      const rawPrice = obj?.price;
      const price =
        rawPrice === undefined || rawPrice === null || rawPrice === ''
          ? undefined
          : Number(String(rawPrice).replace(/[^\d]/g, ''));
      if (!name) return null;
      if (price !== undefined && Number.isNaN(price)) return { name };
      return price !== undefined ? { name, price } : { name };
    })
    .filter((v): v is { name: string; price?: number } => Boolean(v));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  const userId = session.user.id;

  if (req.method === 'GET') {
    try {
      const profile = await prisma.storeProfile.findUnique({
        where: { userId },
      });
      return res.status(200).json({ profile });
    } catch (error) {
      console.error('GET store profile error:', error);
      return res.status(500).json({ error: '가게 프로필 조회에 실패했습니다.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        storeName,
        category,
        storeAddress,
        storePhone,
        storeHours,
        storeOffDay,
        storeMenu,
        storeFeature,
        storeIntro,
        storeLink,
      } = req.body || {};

      if (!storeName || !String(storeName).trim()) {
        return res.status(400).json({ error: '상호명은 필수입니다.' });
      }
      if (!category || !String(category).trim()) {
        return res.status(400).json({ error: '업종 카테고리는 필수입니다.' });
      }

      const normalizedMenu = normalizeStoreMenu(storeMenu);

      const saved = await prisma.storeProfile.upsert({
        where: { userId },
        update: {
          storeName: String(storeName).trim(),
          category: String(category).trim(),
          storeAddress: storeAddress ? String(storeAddress).trim() : null,
          storePhone: storePhone ? String(storePhone).trim() : null,
          storeHours: storeHours ? String(storeHours).trim() : null,
          storeOffDay: storeOffDay ? String(storeOffDay).trim() : null,
          storeMenu: normalizedMenu as unknown as object,
          storeFeature: storeFeature ? String(storeFeature).trim() : null,
          storeIntro: storeIntro ? String(storeIntro).trim() : null,
          storeLink: storeLink ? String(storeLink).trim() : null,
        },
        create: {
          userId,
          storeName: String(storeName).trim(),
          category: String(category).trim(),
          storeAddress: storeAddress ? String(storeAddress).trim() : null,
          storePhone: storePhone ? String(storePhone).trim() : null,
          storeHours: storeHours ? String(storeHours).trim() : null,
          storeOffDay: storeOffDay ? String(storeOffDay).trim() : null,
          storeMenu: normalizedMenu as unknown as object,
          storeFeature: storeFeature ? String(storeFeature).trim() : null,
          storeIntro: storeIntro ? String(storeIntro).trim() : null,
          storeLink: storeLink ? String(storeLink).trim() : null,
        },
      });

      return res.status(200).json({ success: true, profile: saved });
    } catch (error) {
      console.error('POST store profile error:', error);
      return res.status(500).json({ error: '가게 프로필 저장에 실패했습니다.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

