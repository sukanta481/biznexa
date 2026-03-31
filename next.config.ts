import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Forward Amplify env vars to the server runtime
  env: {
    DB_TARGET: process.env.DB_TARGET,
    DB_LIVE_HOST: process.env.DB_LIVE_HOST,
    DB_LIVE_PORT: process.env.DB_LIVE_PORT,
    DB_LIVE_NAME: process.env.DB_LIVE_NAME,
    DB_LIVE_USER: process.env.DB_LIVE_USER,
    DB_LIVE_PASSWORD: process.env.DB_LIVE_PASSWORD,
  },
};

export default nextConfig;
