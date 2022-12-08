let flag = false
let dsJsSdk = {}
let AOP = {}
if (flag) {
   // 压缩后的，已支持微信 和支付宝
   // if (process.env.TARO_ENV == 'alipay') {
   //  dsJsSdk = require('./alipayDsJsSdkAOP')
   //    AOP = dsJsSdk.AOP
   // } else if (process.env.TARO_ENV == 'weapp') {
   //  dsJsSdk = require('./weappDsJsSdkAOP')
   //    AOP = dsJsSdk.AOP
   // } else {
   //    dsJsSdk = require('./wsgwH5SdkBackup')
   //    AOP = dsJsSdk.default
   // }
   console.log('已压：',AOP)
} else {
   // 这个是压缩前的AOP,如果做切换，记得清缓存。因为存储数据格式不一样
   dsJsSdk = require('./wsgwH5SdkBackup')
   AOP = dsJsSdk.default
   console.log('未压：',AOP)
}
export default AOP