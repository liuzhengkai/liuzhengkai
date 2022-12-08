//引入app交互桥方法，提供所有方法的输出
import { taroH5 } from './taroH5'
import { abilityOpenPlatform } from './abilityOpenPlatform'
import { wsgwBridgeApp } from './wsgwBridgeApp'
import { vuapApp } from './vuapApp'
import Taro from '@tarojs/taro'
import { log , initAppNativeJs } from '../commonPlugin/validate'
import urlReplace from './urlReplace'
import { util } from '../../utils/util'
import { showLoadingUtil, hideLoadingUtil } from '../commonPlugin/interactive'

let taroEnv = process.env.TARO_ENV
// const projectJSON=[
//   {name:'a',wsgwPlat:'1'},
//   {name:'taroBaseProject','wsgwPlat':'2'}
// ]

const globalData = {
  interFaceFlag: true,
  interceptArr: [],
  nowTime: '',
  lastTime: '',
  eventFlag: true,
}

const eventIntercept = (fn,timer = 3000)=> {
  if (globalData.eventFlag) {
    globalData.eventFlag = false
    if (fn) fn()
    setTimeout(() => {
      globalData.eventFlag = true
    }, timer);
  } else {
    console.log('重复点击或触发')
  }
}

// function request(url, options) {
//   globalData.nowTime = new Date().getTime()
//   if(globalData.interceptArr.includes(url)) {
//     if(globalData.nowTime -  globalData.lastTime > 1500) {
//       sendRequest(url, options)
//       globalData.lastTime = globalData.nowTime;
//     }
//   } else {
//     globalData.interceptArr.push(url)
//     sendRequest(url, options)
//     globalData.lastTime = globalData.nowTime;
//   }
// }

// async function request(url, options) {
//   try {
//     if(globalData.interFaceFlag == true){
//       globalData.interFaceFlag = false
//       await sendRequest(url, options)
//       globalData.interFaceFlag = await true
//     }
//   } catch(e) {
//     globalData.interFaceFlag = true
//   }
// }

const request = (url, options) => {
  let modifiedUrl = ''
  let wsgwPlat = ''
  // console.log('projectName:',projectName)
  // projectJSON.forEach(item=>{
  //   console.log('aaa:',item)
  //   if(item.name == projectName){
  //     console.log('item.wsgwPlat:',item.wsgwPlat)
  //   }
  // })
  if (taroEnv == 'weapp') {
    modifiedUrl = urlReplace[url] ? urlReplace[url] : "/" + url
    wsgwPlat = '6'
    if (options.params.ORDER_SOURCE) {
      options.params.ORDER_SOURCE = '05'
    }
  } else if (taroEnv == 'alipay') {
    modifiedUrl = urlReplace[url] ? urlReplace[url] : "/" + url
    wsgwPlat = '7'
    if (options.params.ORDER_SOURCE) {
      options.params.ORDER_SOURCE = '06'
    }
  }else if (taroEnv == 'jd') {
    modifiedUrl = urlReplace[url] ? urlReplace[url] : "/" + url
    wsgwPlat = '10'
    if (options.params.ORDER_SOURCE) {
      options.params.ORDER_SOURCE = '08'
    }
  }else if (taroEnv == 'swan') {
    modifiedUrl = urlReplace[url] ? urlReplace[url] : "/" + url
    wsgwPlat = '12'
    if (options.params.ORDER_SOURCE) {
      options.params.ORDER_SOURCE = '09'
    }
  }else if (taroEnv == 'h5') {
    wsgwPlat = '8'
    if (options.params.ORDER_SOURCE) {
      options.params.ORDER_SOURCE = '07'
    }
  }
  options.params.timestamp = new Date().getTime()
  var finnalParams = {
    "target": "12101",
    "source": "app",
    'serviceCode': '0102150',
    data: options.paramsFlag == '1' ? options.params : {
      "common": {
        "APPVERSION": "1.0",
        "CHANNEL_RESOURCE": "5",
        "REQTYPE": "3",
        "PLAT": "4",
        "WSGW_PLAT": wsgwPlat, // 6 微信小程序 7支付宝小程序 8关怀版
        "REQUEST_SOURCE": "10",
        "SDKVERSION": SDKVERSION,
        "RISK_CHECK": "1qaz@WSX3edc$RFV"
        // "ENCRYPTTYPE": "0",
      },
      "data": options.params
    }

  }

  // 设置开关,paramsFlag : 默认不传该字段，支付中心报文格式，有嵌套; 1 账单中心数据，无嵌套; 2 用户中心数据，入参和返参数是任意内容
  options.params =  options.paramsFlag == '2' ? options.params : finnalParams

  //公共数据token,version，统一处理，业务侧不需要传入token,version
  if (options && options.params) {
    options.params.token = getUserInfo().token
    options.params.TOKEN = getUserInfo().token
    options.params.SDKVERSION = SDKVERSION
    if (options.params.data) {
      options.params.data.TOKEN = getUserInfo().token
      options.params.data.token = getUserInfo().token
      options.params.data.SDKVERSION = SDKVERSION
      if (options.params.data.common) {
        options.params.data.common.TOKEN = getUserInfo().token
        options.params.data.common.token = getUserInfo().token
        options.params.data.common.SDKVERSION = SDKVERSION
      }
      if (options.params.data.data) {
        options.params.data.data.TOKEN = getUserInfo().token
        options.params.data.data.token = getUserInfo().token
      }
    }
  }
  // 设置code成功的编码 codeFlag: 0正常成功编码 为0 ; 1 特殊模式编码 为所传参数
  options.code = options.code === '1' ? '1' : '0'
  // showLoad 是否显示加载,l默认为'0' 如果不传则请求开始之前,都会出现loading.若不需要,则传'1'
  options.showLoad = options.showLoad === '1' ? '1' : '0'
  options.isResponseAll = !!options.isResponseAll
  options.isHideToast = !!options.isHideToast

  //是否为白名单接口?
  options.isWhiteList = !!options.isWhiteList
  //是否开启防重点击，适用于点击按钮后调用接口场景
  options.isForbidDoubleClick = !!options.isForbidDoubleClick
  console.log('【当前环境】' + taroEnv)

  if (taroEnv === 'h5') {
    var env = 4; //1.在线链接(app内部交互桥) 2.微应用(app内部uexCore) 2.微信公众号、支付宝生活号 3.pc项目，taro请求
    if (wsgwBridgeApp.bridge_WSGWBridge()) {
      env = 1
    }
    if (vuapApp.vuap_uexCore()) {
      env = 2
    }
    console.log('env:' + env)
    if (env == 1) {
      wsgwBridgeApp.bridge_request(url, options.params, options.success, options.fail, options.showLoad, options.isResponseAll, options.isHideToast, options.code)
    } else if (env == 2) {
      vuapApp.vuap_request(url, options.params, options.success, options.fail, options.showLoad, options.isResponseAll, options.isHideToast, options.code)
    } else {
      taroH5.request(url, options.params, (res) => {
        if (!options.isResponseAll) {
          if (res.data.code == options.code) {
            options.success(res.data.data)
          }
        } else {
          // 适用于业务中需要全部参数的情况
          options.success(res.data)
        }
        if ((res.data.code + "") != options.code && !options.isHideToast) {
          Taro.showToast({
            title: res.data.message,
            icon: 'none',
          })
        }
        //成功日志打印
        log('【请求url地址】 ' + url)
        log(options.params, true)
        log(res.data, true)
      }, (err) => {
        options.fail && options.fail(err)
        log('【请求url地址】' + url)
        log(options.params, true)
        log(err, true)
      }, options.showLoad)
    }
  } else if (taroEnv === 'alipay' || taroEnv === 'weapp' || taroEnv === 'jd' || taroEnv === 'swan') {
    // return new Promise((resolve, reject)=> {
      abilityOpenPlatform.request(modifiedUrl, options.params, (res) => {
        if (!options.isResponseAll) {
          if (res.code == '1') {
            options.success(res.data)
          }
        } else {
          // 适用于业务中需要全部参数的情况
          options.success(res)
        }
        //成功日志打印
        // resolve()
        log('【请求url地址】' + url)
        log(options.params, true)
        log(res.data, true)
        console.log('【请求url地址】' + url)
        console.log(options.params)
        console.log(res)
      }, (err) => {
        if (Object.prototype.toString.call(options.fail) == '[object Function]') {
          options.fail(err)
        }
        // reject()
        log(options.params, true)
        log(err, true)
      },
        options.showLoad,
        options.isWhiteList,
        options.isHideToast,
        options.isForbidDoubleClick)
    // })
  }
}

/**
   * get请求，服务链接平台剔除校验逻辑
   * @param {*} url 
   * @param {*} params 
   * @param {*} success 
   * @param {*} fail 
   * @param {*} showLoad 
   */
 const requestByGET = (url, params, successCallBack, failCallBack) => {
    showLoading()
     var platfromUrl =  (process.env.TARO_ENV === 'h5' && process.env.NODE_ENV === 'development') ? '/api/'+url : 'https://osg-static.sgcc.com.cn:18888/'+ url
    Taro.request({
      method: 'GET',
      url: platfromUrl,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        hideLoading()
        if(res && res.data){
          successCallBack(res.data)
        }
      },
      fail(err) {
       hideLoading()
       if(failCallBack){
        failCallBack(err)
       }

      }
    })
 }

//该方法仅仅使用pc端使用，请求调用验收测试环境https+授权token

const requestToken = (url, options) => {
  taroH5.request(url, options.params, (res) => {
    if (res.data.code == 1) {
      if (res.data.data) {//接口请求成功
        options.success(res)
      }
    } else {
      log(res.data.message, true)
      Taro.showToast({
        title: res.data.message,
        icon: 'none',
      })
    }
    //成功日志打印
    log('【请求url地址】 ' + url)
    log(options.params, true)
    log(res.data, true)
  }, (err) => {
    options.fail && options.fail(err)
    log('【请求url地址】' + url)
    log(options.params, true)
    log(err, true)
  }, options.showLoad)
}

/*
// 当前是什么环境， 0 生产环境  1 灰度环境（1.1为电费专用）  2 测试环境（2.1为电费专用） 3 护网环境
1.默认生产环境 https://osg-service.sgcc.com.cn:18600
2.灰度环境 （1）默认：https://osg-service-simu.sgcc.com.cn:28600 （2）电费专用：https://osg-base-simu.sgcc.com.cn:28660
3.北七家 （1）默认: http://211.160.62.35:28600 (2)电费专用：http://211.160.62.37:28660
4.护网环境：http://30.20.110.183:18000 
*/
const publishEnv = (url) => {
  let env = '0'
  let pattern = /^http:/
  if (!url) return

  if (pattern.test(url)) {
    if (url.indexOf('30.20.110.183') != -1) {
      env = '3'
    } else if (url.indexOf('211.160.62.35') != -1) {
      env = '2'
    } else if (url.indexOf('211.160.62.37') != -1) {
      env = '2.1'
    } else {
      env = '2'
    }
  } else {
    if (url.indexOf('simu') != -1) {
      if (url.indexOf('service') != -1) {
        env = '1'
      } else if (url.indexOf('base') != -1) {
        env = '1.1'
      }
    } else if (url.indexOf('osg-service.sgcc') != -1) {
      env = '0'
    }
  }
  return env
}

const weapp_openSelectCity = () => {
  abilityOpenWeapp.openSelectCity()
}

const openSelectCity = () => {
  if (taroEnv === 'h5') {
    // wsgwBridgeApp.bridge_openSelectCity()
  } else if (taroEnv === 'weapp') {
    abilityOpenWeapp.openSelectCity()
  }
}
// 唤起支付
const tradePay = (params, successCk, failCk) => {
  // 调取tradeNo
  let url = '';
  let data = {}
  if (taroEnv === 'alipay') {
    my.tradePay({
      tradeNO: params.tradeNo,
      success: (res) => {
        successCk(res)
      },
      fail: (res) => {
        failCk(res)
      }
    });
  } else if (taroEnv === 'weapp' ) {
    wx.requestPayment(Object.assign(JSON.parse(params.tradeNo), {
      success: successCk,
      fail: failCk,
    }))

  } else if (taroEnv === 'jd') {
    jd.requestWXH5Payment({
      orderInfo:{
          orderId: params.PAYORDERID,// 订单id
          payInfo: params.tradeNo,// 微信支付
          // payInfo: 'https://netpay.95598pay.com/gdwj/wxpaymiddle.html?redirectUrl='+ encodeURIComponent(params.tradeNo),// 微信支付，示例：https://lvtest.lvcampaign.com/bdpay.html?redirectUrl=https%3A%2F%2Fwx.tenpay.com%2Fcgi-bin%2Fmmpayweb-bin%2Fcheckmweb%3Fprepay_id%3Dwx16152021742544e47f76623970c20c0000%26package%3D3575196563
          merchantDomain: "", //商户域名标识，如：jd.vtest.lvcampaign.com
      },
      success(res) {
        log('jdjdjdjdjd===',res)
        successCk(res)
      },
      fail(e){
        log('fail===',e)
        failCk(e)
      }
    })
  } else if (taroEnv === 'swan') {
    log('swan')
    swan.requestThirdPayment({
      orderInfo: JSON.parse(params.tradeNo),
      success(res) {
        //success 回调对于支付方式为微信支付时，并不能用于判断为支付成功，只能说明微信调起成功，请开发者以自己服务收到支付后端成功结果为准，来判断状态。
        log('bdbdbdbdbd===',res)
        successCk(res)
      },
      fail(e){
        log('fail===',e)
        failCk(e)
      }
    })
  } else if (taroEnv === 'h5') {
    log('h5支付')
  }
}

/**
 * 获取用户信息，包含有全渠道TOKEN，小程序OPENID，交互桥域名、app版本信息等
 * @returns 
 */
const getUserInfo = () => {
  if (wsgwBridgeApp.bridge_WSGWBridge()) {
    return wsgwBridgeApp.getUserInfo()
  } else if (vuapApp.vuap_uexCore()) {
    return vuapApp.getUserInfo()
  } else if (taroEnv == 'h5') {
    return taroH5.getUserInfo()
  } else {
    return abilityOpenPlatform.getUserInfo()
  }
}

const initSDK = ()=>{
  return abilityOpenPlatform.initSDK()
}

/**
 * 能力开放平台的方法
 * 地区选择组件,暂时提供供电编码，如果后续需要行政编码再新增返回字段
 * @returns eg :{'proviceCode':'33101',proviceName:'浙江省'}
 */
const chooseAddressInfo = (params) => {
  return abilityOpenPlatform.chooseAddressInfo(params)
}
const getLocation = () => {
  return abilityOpenPlatform.getLocation()
}
const loginDispatcher = () => {
  return abilityOpenPlatform.loginDispatcher()
}
const loginStatusListener = () => {
  return abilityOpenPlatform.loginStatusListener()
}
/**
 * 获取APP登录后的基础数据，包含有token、userid、请求域名、绑定户号信息等等
 */
const bridge_init = (func) => {
  initAppNativeJs().then(() => {
    if (vuapApp.vuap_uexCore()) {
      vuapApp.vuap_init(func)
    } else {
      wsgwBridgeApp.bridge_init(func)
    }
  })
}

/**
 * 跳转微应用
 * @param {*} data ={‘menuId’:‘微应用id’,'url':'跳转页面，空值默认跳转首页'}
 */
const bridge_jumpToMenu = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_jumpToMenu(data, func)
  } else {
    wsgwBridgeApp.bridge_jumpToMenu(data, func)
  }
}
/**
 * 存缓存
 * @param {*} data ={ 'key':'唯一字符串','value':{存业务信息} }
 */
const bridge_setTempCache = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_setTempCache(data,func)
  } else {
    wsgwBridgeApp.bridge_setTempCache(data,func)
  }
}

/**
 * 取缓存
 * @param {*} data 
 * @param {*} func 
 */
const bridge_getTempCache = (data, func) => {
  initAppNativeJs().then(() => {
    if (vuapApp.vuap_uexCore()) {
      vuapApp.vuap_getTempCache(data, func)
    } else {
      wsgwBridgeApp.bridge_getTempCache(data, func)
    }
  })
}

/**
 * 上传图片
 * @param {*} data ={参照demo.vue}
 * @param {*} func 
 */
const bridge_chooseAndUpLoadImage = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_chooseAndUpLoadImage(data, func)
  } else {
    wsgwBridgeApp.bridge_chooseAndUpLoadImage(data, func)
  }
}

/**
 * 关闭当前webview
 */
const bridge_close = () => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_close()
  } else {
    wsgwBridgeApp.bridge_close()
  }
}

/**
 * 关闭当前容器并且跳转到APP首页
 */
const bridge_jumpAppHome = () => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_jumpAppHome()
  } else {
    wsgwBridgeApp.bridge_jumpAppHome()
  }
}

/**
 * 打开一个资讯页面
 * @param {*} data ={参照demo.vue}
 */
const bridge_jumpToTitleView = (data) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_jumpToTitleView(data)
  } else {
    wsgwBridgeApp.bridge_jumpToTitleView(data)
  }
}

/**
 * 下载图片到手机
 * @param {*} data ={'imageType':'01','image':'图片地址' };
 */
const bridge_downloadToPhone = (data) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_downloadToPhone(data)
  } else {
    wsgwBridgeApp.bridge_downloadToPhone(data)
  }
}

/**
 * 扫描二维码组件，用于扫描电表二维码／条形码，获取户号
 * @param {*} data ={'proviceId':'供电编码','cityCode':'市码' }
 * @param {*} func 
 */
const bridge_scanQrCode = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_scanQrCode(data, func)
  } else {
    wsgwBridgeApp.bridge_scanQrCode(data, func)
  }
}

/**
 * 跳转如何获取户号信息
 * @param {*} data ={'proCode':'供电编码' }
 */
const bridge_howToGetConsNum = (data) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_howToGetConsNum(data)
  } else {
    wsgwBridgeApp.bridge_howToGetConsNum(data)
  }
}

/**
 * 跳转户号模糊搜索组件
 * @param {*} func 
 */
const bridge_consNoFuzzyQuery = (func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_consNoFuzzyQuery(func)
  } else {
    wsgwBridgeApp.bridge_consNoFuzzyQuery(func)
  }
}

/**
 *长按识别二维码  
 * @param {*} data ={'QRValue':'','QRType':'' }
 * @param {*} func 
 */
const bridge_fromJsFunction_qrDroid = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_fromJsFunction_qrDroid(data, func)
  } else {
    wsgwBridgeApp.bridge_fromJsFunction_qrDroid(data, func)
  }
}

/**
 * 调用分享组件
 * @param {*} data ={'title':'分享标题','imageType':'01分享类型','image':'图片地址','url':'分享的链接','description':'分享描述信息','array':['wechat','wechatTimeLine']}
 * @param {*} func 
 */
const bridge_fromJsFunction_share = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_fromJsFunction_share(data, func)
  } else {
    wsgwBridgeApp.bridge_fromJsFunction_share(data, func)
  }
}


/**
 * 跳转原生(android和ios)支付SDK
 * @param {*} data ={'BUS_TYPE':'A002','AMOUNT':'支付金额','PRE_ORDER_ID':'订单号'}
 * @param {*} func 
 * @returns 
 */
const bridge_tradePay = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_tradePay(data, func)
  } else {
    return wsgwBridgeApp.bridge_tradePay(data, func)
  }
}

/**
 * 跳转原生(android和ios)交电费
 * @param data={'TYPE':'2','PROVINCE_CODE':'供电编码','POWER_USER_ID':'户号','SENSITIVE_POWER_USER_ID':'脱敏因子'}  
 * @param {*} func 
 * @returns 
 */
const bridge_toNativeEleList = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_toNativeEleList(data, func)
  } else {
    return wsgwBridgeApp.bridge_toNativeEleList(data, func)
  }
}
/**
 * 判断是否是运行在网上国网APP内部
 * @returns true:APP内部,false:APP外部
 */
const bridge_WSGWBridge = () => {
  return wsgwBridgeApp.bridge_WSGWBridge() || vuapApp.vuap_uexCore()
}

/**
 * 选择地区组件
 * @param {*} data ={"type":"13","codeValue":"","showHotCitys":"1"}
 * @param {*} func 
 * @returns dsUtils.getStorageSync('DS_PROVINCE_NAME') dsUtils.getStorageSync('DS_PROVINCE_CODE')
 */
const bridge_chooseAddressInfo = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_chooseAddressInfo(data, func)
  } else {
    return wsgwBridgeApp.bridge_chooseAddressInfo(data, func)
  }
}

/**
 * 刷脸组件,判断登录账号是否本人,业务中用于电费下单风控刷脸(busiType=02)
 * @param {*} data = {'type':'2222','busiType':'02','relaName':'','certNo':''}
 * @param {*} func 
 * @returns 
 */
const bridge_newFaceMatce4 = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_newFaceMatce4(data, func)
  } else {
    return wsgwBridgeApp.bridge_newFaceMatce4(data, func)
  }
}

/**
 * 注册通知方法，A跳转B页面，B页面关闭给A通知信息，需要用该方法。此方法调用在A页面
 * @param {*} data  = {'appId':'A的微应用编号','notice':[{'meunId:'B的微应用编号','key':'A和B约定的一个唯一字符串'}]}
 * @param {*} func 
 * @returns 
 */
const bridge_registerNotice = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_registerNotice(data, func)
  } else {
    return wsgwBridgeApp.bridge_registerNotice(data, func)
  }
}

/**
 * 发送通知方法，A跳转B页面，B页面关闭给A通知信息，需要用该方法。此方法调用在B页面
 * @param {*} data = {'appId':'B的微应用编号','key':'A和B约定的一个唯一字符串','value':{'code':'1'}}
 * @param {*} func 
 * @returns 
 */
const bridge_sendNotice = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_sendNotice(data, func)
  } else {
    return wsgwBridgeApp.bridge_sendNotice(data, func)
  }
}

/**
 * 分享微信小程序
 * @param {*} data ={'url':'','image':'图片地址','description':'','path':'小程序页面路径','userName':'','miniPreView':'0分享正式版，1分享开发版，2分享体验版'}
 * @param {*} func 
 * @returns 
 */
const bridge_shareWXMiniProgram = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_shareWXMiniProgram(data, func)
  } else {
    return wsgwBridgeApp.bridge_shareWXMiniProgram(data, func)
  }
}

/**
 * 数据埋点方法,该方法聚合了微信小程序、支付宝小程序、桥接方法、uap方法
 * @param {*} data 
 * @param {*} func 
 * @returns 
 */
const dataCollection = (params, func) => {
  if (taroEnv === 'alipay' || taroEnv === 'weapp') {
    util.dataCollection(params)
  } else if (taroEnv === 'h5') {

    let data = {
      'FUNBLOCKID': '',
      'ACTTYPE': params.ACTTYPE || '',//点击0301  页面0204
      'SERVICEID': params.SERVICEID || '',//B10070100
      'PAGENAME': params.PAGENAME || '',//去交费页
      'ATTRS': {
        'BUSINAME': '',
        'BUSIID': getUserInfo().userId,
        'RECOMMEND_CODE': '',
        'NEXT_CHANNEL': 2,
        'EXTENT_CODE': ''
      },
      'EVENT_ID': getUserInfo().userId + parseInt(Math.random() * (999), 10) + new Date().getTime(),
      'FLOWCODE': '',
      'GPSLOCATION': '',
      'RECORDTIME': new Date().getTime(),//new Date().getTime()
      'CHANNEL': params.CHANNEL || '',//小程序3369 
      'LONG_STAY': ''
    }
    if (vuapApp.vuap_uexCore()) {
      vuapApp.vuap_dataCollection(data, func)
    } else {
      return wsgwBridgeApp.bridge_dataCollection(data, func)
    }
  }
}

/**
 * 获取当前路由实例，用于页面参数传递的取值
 * @returns 当前taro实例
 */
const getCurrentInstance = () => {
  return Taro.getCurrentInstance()
}

/**
 * 异步方法，获取系统信息，windows等
 * @returns Promise
 */
const getSystemInfo = () => {
  return Taro.getSystemInfo()
}

/**
 * 同步方法，获取系统信息，windows等
 * @returns 
 */
const getSystemInfoSync = () => {
  return Taro.getSystemInfoSync()
}

/**
 * 该方法需要确认是否使用
 * @param {*} data 
 * @param {*} func 
 */
const bridge_windControlBuryingPoint = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_windControlBuryingPoint(data, func)
  } else {
    // return wsgwBridgeApp.bridge_shareWXMiniProgram(data,func)
  }
}

/**
 * 微信分享
 * @param {*} data
 *  {
      "title"         : "送您电费小红包",
      "description"   : "送您电费小红包，快来网上国网交电费吧！",
      "type"          : "01",     // 01微信好友，02朋友圈
      "imageType"     : "02",
      "image"         : "",
      "url"           : response["data"]["YHQ_RECEIVE_LINK"]
    } 
 * @param {*} func 
 */
const bridge_weiXinShare = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_weiXinShare(data, func)
  } else {
    // return wsgwBridgeApp.bridge_shareWXMiniProgram(data,func)
  }
}

const bridge_choosePhoneContact = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_choosePhoneContact(data, func)
  } else {
    // return wsgwBridgeApp.bridge_shareWXMiniProgram(data,func)
  }
}

/**
 * 显示加载动画，适用于接口请求、延迟优化体验等
 * @param {*} data 
 * @param {*} func 
 */
const showLoading = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_showLoading(data, func)
  } else if (wsgwBridgeApp.bridge_WSGWBridge()) {
    wsgwBridgeApp.bridge_showLoading(data, func)
  } else {
    showLoadingUtil()
  }
}

/**
 * 隐藏加载动画，适用于接口请求、延迟优化体验等
 * @param {*} data 
 * @param {*} func 
 */
const hideLoading = (data, func) => {
  if (vuapApp.vuap_uexCore()) {
    vuapApp.vuap_hideLoading(data, func)
  } else if (wsgwBridgeApp.bridge_WSGWBridge()) {
    wsgwBridgeApp.bridge_hideLoading(data, func)
  } else {
    hideLoadingUtil()
  }
}

/**
 * 银行卡微应用跳转
 * @param {*} data 
 * @param {*} func 
 */
const bridge_bankViewController = (data,func) => {
  if(vuapApp.vuap_uexCore()){
    vuapApp.vuap_bankViewController(data,func)
  }else {
    wsgwBridgeApp.bridge_bankViewController(data,func)
  }
}

/**
 * 点击电话号码进行拨号
 * @param {*} data 
 * @param {*} func 
 */
const bridge_makePhoneCall = (data,func) => {
  if(vuapApp.vuap_uexCore()){
    vuapApp.vuap_makePhoneCall(data,func)
  }else {
    wsgwBridgeApp.bridge_makePhoneCall(data,func)
  }
}

/**
 * 跳转热点资讯
 * @param {} func 
 */
const bridge_jumpToHotNews = (func) => {
  if(vuapApp.vuap_uexCore()){
    vuapApp.vuap_jumpToHotNews(func)
  }else {
    wsgwBridgeApp.bridge_jumpToHotNews(func)
  }
}

// 
/**
 * 跳转热点资讯
 * @param {} func 
 */
const bridge_setInfoToLastWidget = (func) => {
  if(vuapApp.vuap_uexCore()){
    vuapApp.vuap_setInfoToLastWidget(func)
  }else {
    wsgwBridgeApp.bridge_setInfoToLastWidget(func)
  }
}

//  ****在这里添加的方法，必须去dsUtils.js里导入并导出，才可以使用。****
export {
  eventIntercept,
  request,
  requestByGET,
  weapp_openSelectCity,
  openSelectCity,
  tradePay,
  getUserInfo,
  initSDK,
  chooseAddressInfo,
  getLocation,
  loginDispatcher,
  loginStatusListener,
  bridge_init,
  bridge_jumpToMenu,
  bridge_setTempCache,
  bridge_getTempCache,
  bridge_chooseAndUpLoadImage,
  bridge_close,
  bridge_jumpAppHome,
  bridge_jumpToTitleView,
  bridge_downloadToPhone,
  bridge_scanQrCode,
  bridge_howToGetConsNum,
  bridge_consNoFuzzyQuery,
  bridge_fromJsFunction_qrDroid,
  bridge_fromJsFunction_share,
  bridge_tradePay,
  bridge_toNativeEleList,
  bridge_WSGWBridge,
  requestToken,
  bridge_chooseAddressInfo,
  bridge_newFaceMatce4,
  bridge_registerNotice,
  bridge_sendNotice,
  bridge_shareWXMiniProgram,
  dataCollection,
  getCurrentInstance,
  getSystemInfo,
  getSystemInfoSync,
  bridge_windControlBuryingPoint,
  bridge_weiXinShare,
  bridge_choosePhoneContact,
  showLoading,
  hideLoading,
  publishEnv,
  bridge_bankViewController,
  bridge_makePhoneCall,
  bridge_jumpToHotNews,
  bridge_setInfoToLastWidget
}
