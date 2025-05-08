import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: false, // 关闭严格模式防止影响debug
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
