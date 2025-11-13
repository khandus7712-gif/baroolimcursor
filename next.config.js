/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // ESLint를 빌드 시 경고만 표시 (배포 차단 방지)
  eslint: {
    ignoreDuringBuilds: false, // 경고는 표시하되 빌드는 계속
  },
  // TypeScript 에러만 체크 (ESLint 에러로 빌드 차단 방지)
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;

