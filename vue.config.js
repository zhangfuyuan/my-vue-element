module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/translator/' : '/',

  devServer: {
    port: '8126',
    host: '192.168.1.83',
    open: true,
    proxy: {
      '/api': {
        target: 'lango-tech.cn/apm-web',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
