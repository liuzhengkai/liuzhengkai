const isH5 = process.env.TARO_ENV === 'h5'
// const HOST = '"http://30.20.110.183:18000/"' // 测试 (暂时不用)
// const HOST = '"https://csc-base-cs.sgwsgw.com.cn:28002/"' // 北京测试 (暂时不用)

//==== 关怀版pc测试 切换环境步骤: ====
//==== 1 切换环境地址 ====
const HOST = '"https://csc-service-simu.sgcc.com.cn:28630/"' // 调用北京业务验证环境测试用
// const HOST = '"https://csc-service.sgcc.com.cn:28630/"' // 调用北京生产环境测试用
//==== 2 切换首页dsUtils.requestToken中的请求头参数 ==== (拿token)
//==== 3 切换taroH5.js文件中的请求头参数 ==== (业务接口)
//==== 4 重新dev:h5 ====

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
