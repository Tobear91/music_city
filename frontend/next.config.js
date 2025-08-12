/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["image.tmdb.org", "i.discogs.com", "i.scdn.co"],
  },
  sassOptions: {
    implementation: "sass-embedded",
  },
};

module.exports = nextConfig;
