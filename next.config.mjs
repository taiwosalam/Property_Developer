/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.ourproperty.ng",
      },
      {
        protocol: "https",
        hostname: "pubassets.ourproperty.ng",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "khrimisay.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "nigerianbanks.xyz",
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // reactStrictMode: false
};

export default nextConfig;
