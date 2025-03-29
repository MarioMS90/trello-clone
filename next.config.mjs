/** @type {import('next').NextConfig} */
const nextConfig = {
  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   },
  // },
  experimental: {
    staleTimes: {
      // Max value possible
      dynamic: 4294967295,
    },
  },
  reactStrictMode: false,
};

export default nextConfig;
