/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
      {
        protocol: "https",
        hostname: "assets.ourproperty.ng",
      },
      {
        protocol: "https",
        hostname: "pubassets.ourproperty.ng",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: false
};

export default nextConfig;
