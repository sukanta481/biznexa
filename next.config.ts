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
  // The previous PHP site's URLs are still indexed. Permanent redirects
  // transfer their history to the App Router equivalents instead of 404ing.
  async redirects() {
    return [
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/services.php", destination: "/services", permanent: true },
      { source: "/about.php", destination: "/about", permanent: true },
      { source: "/contact.php", destination: "/contact", permanent: true },
      { source: "/blog.php", destination: "/blog", permanent: true },
      { source: "/portfolio.php", destination: "/case-studies", permanent: true },
    ];
  },
};

export default nextConfig;
