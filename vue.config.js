module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://115.182.62.165:5000', // 修改为你的Django服务器地址
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
  ]
}
