module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://45.63.85.11:5000', // 修改为你的Django服务器地址
        changeOrigin: true,
        pathRewrite:{
          '^/api':''
        },
      }
    }
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
}
