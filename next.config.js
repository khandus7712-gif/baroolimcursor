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

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.baroolim.com' }],
        destination: 'https://baroolim.com/:path*',
        permanent: true,
      },
    ]
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  eslint: {
    ignoreDuringBuilds: false,
  },

  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
