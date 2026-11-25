/** @type {import('next').NextConfig} */
const nextConfig = { images: { remotePatterns: [{ protocol: 'images', hostname: '**' }] } };
export default nextConfig;
