/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'img.mservice.com.vn',
      },
      {
        protocol: 'https',
        hostname: 'vietqr.net',
      },
      {
        protocol: 'https',
        hostname: 'api.vietqr.io',
      },
    ],
  },
}

module.exports = nextConfig 