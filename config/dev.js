const isH5 = process.env.TARO_ENV === 'h5'
// const HOST = '"http://30.20.110.183:18000/"' // 测试
const HOST = '"https://csc-base-cs.sgwsgw.com.cn:28002/"' // 北京测试
// const HOST = '"https://csc-service-simu.sgcc.com.cn:28630/"' // 北京业务验证
// const HOST = '"https://csc-service.sgcc.com.cn:28630/"' // 北京生产
module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    SDKVERSION:'"1.2021.09.03.01"',
  },
  mini: {},
  h5: {
    devServer: {
      proxy: {
        '/api/': {
          target: JSON.parse(HOST),
          pathRewrite: {
            '^/api/': '/'
          },
          changeOrigin: true
        }
      }
    }, 
  }
}
