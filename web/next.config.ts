import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@mxmweb/difychat"],
  env: {
    NEXT_PUBLIC_CHAT_URL: process.env.NEXT_PUBLIC_CHAT_URL,
    NEXT_PUBLIC_CHAT_TOKEN: process.env.NEXT_PUBLIC_CHAT_TOKEN,
    NEXT_PUBLIC_CHAT_MOCK: process.env.NEXT_PUBLIC_CHAT_MOCK,
  },

  // async rewrites() {
  //   return [
  //     {
  //       source: '/myproxy/:path*',
  //       destination: 'https://api.dify.ai/v1/:path*',
  //     },
  //   ]
  // },
};

export default nextConfig;
