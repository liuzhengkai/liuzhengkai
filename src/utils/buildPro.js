const careEnv= process.env.TARO_ENV == 'h5'? '1':'0' //  0: 普通版; 1: 关怀版
// removeConsoleShow 本意是使用在babel.config.js里的，但是这个是配置项文件不支持导入自己的方法。所以这个是失效的。留在这，做一个参考。
export {
  careEnv
}