/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ["replicate.delivery"] },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
