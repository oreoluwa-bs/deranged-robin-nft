/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["replicate.delivery"],
    remotePatterns: [
      { hostname: "**.ipfs.dweb.link" },
      { hostname: "**.ipfs.w3s.link" },
      { hostname: "w3s.link" },
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
