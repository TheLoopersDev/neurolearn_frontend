/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com','example.com'], // Remove example.com and localhost since they're not needed
  },
}

module.exports = nextConfig 