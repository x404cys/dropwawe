/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.matager.store',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'ihdkfonxtrohbetdllyt.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'uat.dropwave.online',
      },
      {
        protocol: 'https',
        hostname: 'www.dropwave.cloud',
      },
    ],
  },
};

module.exports = nextConfig;
