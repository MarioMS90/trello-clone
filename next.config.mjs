/** @type {import('next').NextConfig} */
const nextConfig = {
  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   },
  // },
  eslint: {
    // Warning: This allows production builds to successfully
    // complete even if the project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    staleTimes: {
      // Max value possible
      dynamic: 4294967295,
    },
  },
  reactStrictMode: false,
};

export default nextConfig;
