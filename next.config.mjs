/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/",
        destination: "/auth/signin",
        permanent: true,
      },
      // Wildcard path matching
      {
        source: "/dashboard/dashboard",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
