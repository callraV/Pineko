/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");

const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:5328/api/:path*"
            : "https://pineko-api.vercel.app/api/:path*",
      },
    ];
  },
};

const mp3FileLoaderConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp3)$/,
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/_next/static/sounds",
          outputPath: "static/sounds",
        },
      },
    });
    return config;
  },
};

module.exports = withPlugins([mp3FileLoaderConfig], nextConfig);
