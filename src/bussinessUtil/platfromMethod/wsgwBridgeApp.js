import { log , getStorageSync , setStorageSync} from '../commonPlugin/validate'
import {toast} from '../commonPlugin/interactive'

//网上国网app交互方法封装类,使用范围：静态资源部署，加载app内部webview容器内
const bridge_request = (url, params, success, fail, showLoad,isResponseAll,isHideToast,code) => {
  let finalData = {
    url: url,
    data: params,
    notShowLoading:showLoad, 
    type: '01'
  }
 
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction("request", finalData, function (res) {
      if(!isResponseAll){
        if(res.code==code){
          success(res.data)
        }
      } else {
        // 适用于业务中需要全部参数的情况
        success(res)
      }
      if ((res.code +"")!= code && !isHideToast) {
        toast(res.message)
      }
      log('【请求url地址】 ' + url)
      log(params, true)
      log(res, true)
      return res
    })
  } else {
    log('not find WSGWBridge!')
  }
}
// 1.获取基础数据
const bridge_init = (func) => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('init', '{}', (res) => {
      if(res && res.data && res.data.token){
        setStorageSync('DS_TOKEN',res.data.token)
        setStorageSync('DS_USERID',res.data.userId)
        setStorageSync('DS_TARGET',res.data.target)
        setStorageSync('DS_PROVICENAME',res.data.provinceName)
        setStorageSync('DS_LOCATION',{
          regionId :  res.data.target || '',
          regionName : res.data.provinceName || ''
        })
      }
      if (func) { func(res) }
      return res;
    })
    
  } else {
    log('not find WSGWBridge!')
  }
}
// 2.微应用间跳转
const bridge_jumpToMenu = (data,func) => {
  // data = {menuId:'',url:''}
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('jumpToMenu', data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find WSGWBridge!')
  }

}
// 3.设置缓存
const bridge_setTempCache = (data, func) => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('setTempCache', data, (res) => {
      if (func) { func(res) }
      return res;
    })
  } else {
    log('not find WSGWBridge!')
  }

}
// 4.获取缓存
const bridge_getTempCache = (data, func) => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('getTempCache', data, (res) => {
      if (func) { func(res) }
      return res
    })
  } else {
    log('not find WSGWBridge!')
  }
}
// 5.选择并上传图片
const bridge_chooseAndUpLoadImage = (data, func) => {
  // data={count:'',contractChannel:'',areaNo:'',serviceType:'',busiType:'',busiSubType:'',token:'',picType:''}
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('chooseAndUpLoadImage', data, (res) => {
      if (func) { func(res) }
      return res
    })
  } else {
    log('not find WSGWBridge!')
  }
}
// 6.关闭当前页
const bridge_close = () => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('close', '{}', (res) => {
      return res
    })
  } else {
    log('not find WSGWBridge!')
  }
}
// 7.跳转APP首页
const bridge_jumpAppHome = () => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('jumpAppHome', '{}', (res) => {
      return res
    })
  } else {
    log('not find WSGWBridge!')
  }
}
// 8.打开资讯页面
const bridge_jumpToTitleView = (data) => {
  // data={url:'',title:',shareTitle:'',image:'',isShare:'',description:''}
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('jumpToTitleView', data, (res) => {
      return res
    })
  } else {
    log('not find WSGWBridge!')
  }
}
// 9.存图片到本地
const bridge_downloadToPhone = (data) => {
  // data={imageType:'',image:''}
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('downloadToPhone', data, (res) => {
      if (res.code == 1) {
        // log(res.message, true)
      }
    })
  } else {
    log('not find WSGWBridge!')
  }
}
// 10.绑定户号扫描二维码
const bridge_scanQrCode = (data, func) => {
  // data={proviceId:'',cityCode:''}
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('scanQrCode', data, (res) => {
      if (func) { func(res) }
      return res
    })
  } else {
    log('not find WSGWBridge!')
  }
}
// 11.如何获取户号
const bridge_howToGetConsNum = (data) => {
  // data={proCode:''}
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('howToGetConsNum', data, (res) => {
      return res
    })
  } else {
    log('not find WSGWBridge!')
  }
}
// 12.户号模糊搜索
const bridge_consNoFuzzyQuery = (func) => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('consNoFuzzyQuery', '{}', (res) => {
      if (func) { func(res) }
      return res
    })
  } else {
    log('not find WSGWBridge!')
  }
}
// 13.长按识别二维码
const bridge_fromJsFunction_qrDroid = (data, func) => {
  // data={QRValue:'',QRType:''}
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('fromJsFunction_qrDroid', data, (res) => {
      if (func) { func(res) }
      return res
    })
  } else {
    log('not find WSGWBridge!')
  }
}
// 14.分享方法
const bridge_fromJsFunction_share = (data, func) => {
  // data={title:'',imageType:'',image:'',url:'',description:'',array:''}
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('fromJsFunction_share', data, (res) => {
      if (func) { func(res) }
      return res
    })
  } else {
    log('not find WSGWBridge!')
  }
}
// 15.数据采集
const bridge_dataCollection = (data) => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('dataCollection', data, (res) => {
      return res
    })
  } else {
    log('not find WSGWBridge!')
  }
}
// 15.原生支付
const bridge_tradePay = (data, func) => {
  if ((typeof WSGWBridge) != "undefined") {
    // var  data={
    // "PRE_ORDER_ID":"订单号",
    // "AMOUNT":"100",
    // "BUS_TYPE":"A002",
    // "MERCHANT_NAME":"商户名称"
    // "STOP_WATCH":"e享家微应用id"
    // }
    WSGWBridge.callNativeFunction('paymentViewController', data, res=> {
      if (func) {
        func(res)
      }
      return res
    });
  } else {
    log('not find WSGWBridge!')
  }
}

/**
 * 跳转原生交费费（android、ios）
 * @param {} data 
 * @param {*} func 
 */
const bridge_toNativeEleList = (data, func) => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('payWithParameterController', data, res=> {
      if (func) {
        func(res)
      }
      return res
    });
  } else {
    log('not find WSGWBridge!')
  }
}
// 判断当前环境是否有wsgwBridge
const bridge_WSGWBridge = () => {
  let flag = false
  if ((typeof WSGWBridge) != "undefined") {
    flag = true
  }
  return flag
}

const getUserInfo =()=>{
  if ((typeof WSGWBridge) != "undefined") {
    return {
      'token':getStorageSync('DS_TOKEN') || '',
      'userId':getStorageSync("DS_USERID") || '',
      'location':getStorageSync("DS_LOCATION") || ''
    }
  } else {
    log('not find WSGWBridge!')
  }
}
// 选择地区
const bridge_chooseAddressInfo = (data, func) => {
  // let data = {"type":"14","codeValue":"","showHotCitys":"1"} 
  // 11 北京市一级 
  // 12 ios北京市 市辖区  android 北京市 市辖区 昌平区 
  // 13 北京市 市辖区 昌平区 
  // 14 北京市 市辖区 昌平区 街道

  if ((typeof WSGWBridge) != "undefined") {

    WSGWBridge.callNativeFunction('chooseAddressInfo', data, (res) => {
      let result = {
        codeName: '',
        content3: ''
      }
      if(res.code == 1){
        bridge_init((resInit) => {
          if (resInit.data.optSys == 'ios') {
            result = {
              codeName: res.data.priovince.codeName,
              content3: res.data.city.content3 ? res.data.city.content3 : res.data.priovince.content3
            }
          } else if (resInit.data.optSys == 'android') {
            result = {
              codeName: res.data.proInfo.codeName,
              content3: res.data.cityInfo.content3 ? res.data.cityInfo.content3 : res.data.proInfo.content3
            }
          }
          if(func){
            func(result)
          }
        })
      } else {
        toast('获取地区组件失败')
      }
    })
  } else {
    log('not find WSGWBridge!')
  }
}

//调起刷脸组件
const bridge_newFaceMatce4 = (data,func) => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('newFaceMatce4', data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find WSGWBridge!')
  }
}

const bridge_sendNotice = (data,func) => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('sendNotice', data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find WSGWBridge!')
  }
}

const bridge_registerNotice = (data,func) => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('registerNotice', data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find WSGWBridge!')
  }
}

const bridge_shareWXMiniProgram = (data,func) => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('shareWXMiniProgram', data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find WSGWBridge!')
  }
}


const bridge_showLoading = (data,func) => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('showLoading', data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find WSGWBridge!')
  }
}


const bridge_hideLoading = (data,func) => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('closeLoading', data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find WSGWBridge!')
  }
}

const bridge_bankViewController = (data,func) => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('bankViewController', data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find uexCore!')
  }
}

const bridge_makePhoneCall = (data,func) => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('makePhoneCall', data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find uexCore!')
  }
}

const bridge_jumpToHotNews = (func) => {
  if ((typeof WSGWBridge) != "undefined") {
    WSGWBridge.callNativeFunction('jumpToHotNews', data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find uexCore!')
  }
}
// 从A跳到B,B做某些操作，再找参数给A返回，
const bridge_setInfoToLastWidget = (data, func) => {
  if ((typeof uexCore) != "undefined") {
    WSGWBridge.callNativeFunction('setInfoToLastWidget',data, function(res){
      if(func){
        func(res)
      }
    })
  } else {
    log('not find uexCore!')
  }
}
const wsgwBridgeApp = {
  bridge_request,
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
  bridge_dataCollection,
  bridge_tradePay,
  bridge_toNativeEleList,
  bridge_WSGWBridge,
  bridge_chooseAddressInfo,
  getUserInfo,
  bridge_newFaceMatce4,
  bridge_sendNotice,
  bridge_registerNotice,
  bridge_shareWXMiniProgram,
  bridge_showLoading,
  bridge_hideLoading,
  bridge_bankViewController,
  bridge_makePhoneCall,
  bridge_jumpToHotNews,
  bridge_setInfoToLastWidget
}
export {
  wsgwBridgeApp
}