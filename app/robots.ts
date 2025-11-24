import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/studio/', '/mypage/', '/scheduled/', '/payment/'],
    },
    sitemap: 'https://baroolim.com/sitemap.xml',
  };
}

