/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

// 🟢 قم بتغيير السطر الأخير ليكون هكذا:
module.exports = nextConfig;