/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['redis'],
  webpack: (config: import('webpack').Configuration, { dev, isServer }: { dev: boolean, isServer: boolean }) => {
    config.cache = true; // Enable Webpack cache

    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        }
      };
    }
    return config;
  }
};

module.exports = nextConfig;