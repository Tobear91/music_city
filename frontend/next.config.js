/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [],
  },
  sassOptions: {
    implementation: "sass-embedded",
  },
};

module.exports = nextConfig;
