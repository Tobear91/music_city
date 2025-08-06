/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['image.tmdb.org'],
  },
  sassOptions: {
    implementation: "sass-embedded",
  },
};

module.exports = nextConfig;
