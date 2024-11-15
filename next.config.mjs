/** @type {import('next').NextConfig} */
const nextConfig = {
  // async redirects() {
  //   return [
  //     {
  //       source: "/auth",
  //       destination: "/auth/sign-in",
  //       permanent: true,
  //     },
  //   ];
  // },
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
    ],
  },
  // reactStrictMode: false
};

export default nextConfig;
