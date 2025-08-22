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
};

export default nextConfig;
