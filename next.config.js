/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com','example.com','img.mservice.com.vn','img.mservice.io','static.momocdn.net'], // Remove example.com and localhost since they're not needed
  },
}

module.exports = nextConfig 