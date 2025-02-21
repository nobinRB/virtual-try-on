/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig