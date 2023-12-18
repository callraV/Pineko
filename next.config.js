/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");

const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/newsapi/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "https://newsapi.org/v2/:path*"
            : "https://newsapi.org/v2/:path*",
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
