const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "@/css/variables.scss";
          @import "@/css/components/default.scss";
         `,
      }
    }
  },
  devServer: {
    proxy: {
      '/api/v1/model': {
        target: 'https://autotag-ml.hrabit64.xyz/',
        changeOrigin: true
      },
      '/api/v1/stream': {
        target: 'https://autotag-ml.hrabit64.xyz/',
        changeOrigin: true
      },
    }
  }
})
