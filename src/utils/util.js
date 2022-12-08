import AOP from './wsgwH5Sdk/wsgwH5Sdk'
import VConsole from '../utils/h5/vconsole.min.js'

let taroEnv = process.env.TARO_ENV

const initTingyunSdk = () => {
  if (taroEnv == 'alipay') {
    let alipayTingyun = require('./alipay/tingyun-mp-agent-alipay-private.js')
    if (AOP.envConfig.env == 'test') {//测试
      try {
        // alipayTingyun.config({
        //   env: 'test',
        // })
      } catch (e) { }
    } else {
      try {
        // alipayTingyun.config({
        //   env: 'prod',
        // })
      } catch (e) { }
    }
  } else if (taroEnv == 'weapp') {
    let weChatTingyun = require('./wechat/wx-tingyun-mp-agent')
    if (AOP.envConfig.env == 'test') {//测试
      try {
        weChatTingyun.config({
          sgcc_beacon: 'https://sgcc.mjjpipi.xyz:18083/track',
          key: 'KhQGvQ2wY3E',
          id: 'yh4w40trYjs',
          sampleRate: 1
        })
      } catch (e) { }
    } else {
      try {
        weChatTingyun.config({
          sgcc_beacon: 'https://osg-apm.sgcc.com.cn:18084/track-mp',
          key: '4Nl_NnGbjwY',
          id: '4gA5HRiCw8g',
          sampleRate: 1
        })
      } catch (e) { }
    }
  }
}

const dataCollection = (params) => {
  let data = {
    'FUNBLOCKID': '',
    'ACTTYPE': params.ACTTYPE || '',//点击0301  页面0204
    'SERVICEID': params.SERVICEID || '',//B10070100
    'PAGENAME': params.PAGENAME || '',//去交费页
    'ATTRS': {
      'BUSINAME': '',
      'BUSIID': AOP.getUserInfo().openId,
      'RECOMMEND_CODE': '',
      'NEXT_CHANNEL': 2,
      'EXTENT_CODE': ''
    },
    'EVENT_ID': AOP.getUserInfo().openId + parseInt(Math.random() * (999), 10) + new Date().getTime(),
    'FLOWCODE': '',
    'GPSLOCATION': '',
    'RECORDTIME': new Date().getTime(),//new Date().getTime()
    'CHANNEL': params.CHANNEL || '',//小程序3369 
    'LONG_STAY': ''
  }
  try {
    if (taroEnv == 'alipay') {
      // let alipayTingyun = require('./alipay/tingyun-mp-agent-alipay-private.js')
      // alipayTingyun.track(data)
    } else if (taroEnv == 'weapp') {
      let weChatTingyun = require('./wechat/wx-tingyun-mp-agent')
      weChatTingyun.track(data)
    }
  } catch (e) { }

}

/**
 * 动态显示vconsole，北七家测试环境显示，其他均不显示
 */
const initVConsole = () =>{
  let flag = false;
  if(taroEnv === 'h5'  ){
    if((window?.location?.origin?.indexOf('http') > -1) && (window?.location?.origin?.indexOf('sgcc') < 0)){
      new VConsole() // 静态资源host以http开头，根据此点判断是否开启vconsole
      flag = true
      //四位版本号,第一位代表sdk大版本号 第二位代表年份 第三位代表月份 第四位代表日 第5️位标记当天打的第几个版本
      console.log('%c' +'发版请修改：'+ SDKVERSION, "color:red")
    }

    //如果是uap的容器，因为uap未加在完成，无法获取当前环境，因此需要延迟执行
    let time = setInterval(function () {
      if ((typeof uexCore) != 'undefined') {
        if (!flag) {
          flag=true;
          uexCore.fromJsFunction_init("{}", function(res){
            if(res?.data?.environmentUrl?.indexOf('sgcc') < 0){
              new VConsole() 
              //四位版本号,第一位代表sdk大版本号 第二位代表年份 第三位代表月份 第四位代表日 第5️位标记当天打的第几个版本
              console.log('%c' +'发版请修改：'+ SDKVERSION, "color:red")
            }
          })
        }
      }
    }, 10)
    setTimeout(function () {
      clearInterval(time);
    }, 3000)
  }
}

const util = {
  initTingyunSdk,
  dataCollection,
  initVConsole
}
export { util }