/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'ihdkfonxtrohbetdllyt.supabase.co',
      'uat.dropwave.online',
      'www.matager.store',
      'images.remotePatterns',
    ],
  },
  allowedDevOrigins: ['http://192.168.0.111:3000', 'http://localhost:3000'],
};

module.exports = nextConfig;
