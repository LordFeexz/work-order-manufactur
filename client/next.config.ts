import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    BACKEND_DOMAIN: process.env.BACKEND_DOMAIN,
  },
};

export default nextConfig;
