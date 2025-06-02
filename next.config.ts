import type { NextConfig } from 'next';
import path from 'path';
import type { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config: Configuration) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/app'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@lib': path.resolve(__dirname, 'src/lib'),
    };
    return config;
  },
  images: {
    domains: ['example.com'],
  },
  experimental: {
    optimizePackageImports: ['axios'],
  },
};

export default nextConfig;
