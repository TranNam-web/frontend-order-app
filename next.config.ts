import NextBundleAnalyzer from '@next/bundle-analyzer'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin()
const nextConfig: NextConfig = {
 images: {
  remotePatterns: [
    {
      hostname: 'api.namqrcode.io.vn',   // 👈 THÊM DÒNG NÀY
      pathname: '/**'
    }
  ]
}
}
const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})
export default withBundleAnalyzer(withNextIntl(nextConfig))
