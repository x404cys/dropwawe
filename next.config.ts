/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'ihdkfonxtrohbetdllyt.supabase.co' },
      { protocol: 'https', hostname: 'uat.dropwave.online' },
      { protocol: 'https', hostname: 'www.matager.store' },
      { protocol: 'https', hostname: 'www.dropwave.cloud' },
    ],
  },
  allowedDevOrigins: ['http://192.168.0.111:3000', 'http://localhost:3000'],
};

module.exports = nextConfig;
