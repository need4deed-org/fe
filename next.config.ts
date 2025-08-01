import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'http://vmpub:5000/:path*' }]
  },
}

export default nextConfig
