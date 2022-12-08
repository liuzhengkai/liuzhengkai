import { log , getStorageSync , setStorageSync} from '../commonPlugin/validate'
import {toast} from '../commonPlugin/interactive'

//网上国网app交互方法封装类,使用范围：静态资源部署，加载app内部webview容器内
const vuap_request = (url, params, success, fail, showLoad,isResponseAll,isHideToast,code) => {
  let finalData = {
    url: url,
    data: params,
    notShowLoading:showLoad, 
    type: '01'
  }
 
  if ((typeof uexCore) != "undefined") {
    uexCore.request(finalData, function(res){
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
    log('not find uexCore!')
  }
}
// 1.获取基础数据
const vuap_init = (func) => {
  if ((typeof uexCore) != "undefined") {
    uexCore.fromJsFunction_init("{}", function(res){
      if(res && res.data && res.data.token){
        setStorageSync('DS_TOKEN',res.data.token)
        setStorageSync('DS_USERID',res.data.userId)
        setStorageSync('DS_LOCATION',{
          regionId :  res.data.target ,
          regionName : res.data.provinceName
        })
      }
      if (func) { func(res) }
      return res;
    })
  } else {
    log('not find uexCore!')
  }
}
// 2.微应用间跳转
const vuap_jumpToMenu = (data,func) => {
  // data = {menuId:'',url:''}
  if ((typeof uexCore) != "undefined") {
    // uap.ready(function(){
      uexCore.jumpToMenu(data, function(res){
        if(func){
          func(res)
        }  
    })

  } else {
    log('not find uexCore!')
  }

}
// 3.设置缓存
const vuap_setTempCache = (data, func) => {
  if ((typeof uexCore) != "undefined") {
    uexCore.setTempCache(data,function(res){
      if (func) { func(res) }
    })
  } else {
    log('not find uexCore!')
  }

}
// 4.获取缓存
const vuap_getTempCache = (data, func) => {
  if ((typeof uexCore) != "undefined") {
    uexCore.getTempCache(data,function(res){
      if (func) { func(res) }
      return res
    })
  } else {
    log('not find uexCore!')
  }
}
// 5.选择并上传图片
const vuap_chooseAndUpLoadImage = (data, func) => {
  // data={count:'',contractChannel:'',areaNo:'',serviceType:'',busiType:'',busiSubType:'',token:'',picType:''}
  if ((typeof uexCore) != "undefined") {
    uexCore.chooseAndUpLoadImage(data,function(res){
      if (func) { func(res) }
    }) 
  } else {
    log('not find uexCore!')
  }
}
// 6.关闭当前页
const vuap_close = () => {
  if ((typeof uexCore) != "undefined") {
    uexCore.closeWebPage(JSON.stringify({}), function(data) {
 
    })
  } else {
    log('not find uexCore!')
  }
}
// 7.跳转APP首页
const vuap_jumpAppHome = () => {
  if ((typeof uexCore) != "undefined") {
    uexCore.jumpAppHome(JSON.stringify({}),function(res){

    })
  } else {
    log('not find uexCore!')
  }
}
// 8.打开资讯页面
const vuap_jumpToTitleView = (data) => {
  // data={url:'',title:',shareTitle:'',image:'',isShare:'',description:''}
  if ((typeof uexCore) != "undefined") {
    uexCore.jumpToTitleView(data,function(data){

    })
  } else {
    log('not find uexCore!')
  }
}
// 9.存图片到本地
const vuap_downloadToPhone = (data) => {
  if ((typeof uexCore) != "undefined") {
    //TODO  uexImageTranser.saveToPhotoAlbum
    
  } else {
    log('not find uexCore!')
  }
}
// 10.绑定户号扫描二维码
const vuap_scanQrCode = (data, func) => {
  // data={proviceId:'',cityCode:''}
  if ((typeof uexCore) != "undefined") {
    uexCore.scanQrCode(data,function(res){
      if (func) { func(res) }
    })
  } else {
    log('not find uexCore!')
  }
}
// 11.如何获取户号
const vuap_howToGetConsNum = (data) => {
  // data={proCode:''}
  if ((typeof uexCore) != "undefined") {
     uexCore.howToGetConsNum(JSON.stringify(data),function(res){
        console.log(res)
     })
  } else {
    log('not find uexCore!')
  }
}
// 12.户号模糊搜索
const vuap_consNoFuzzyQuery = (func) => {
  if ((typeof uexCore) != "undefined") {
    uexCore.consNoFuzzyQuery(JSON.stringify({}),function(res){
      if (func) { func(res) }
    })
  } else {
    log('not find uexCore!')
  }
}
// 13.长按识别二维码
const vuap_fromJsFunction_qrDroid = (data, func) => {
  // data={QRValue:'',QRType:''}
  if ((typeof uexCore) != "undefined") {
    uexCore.fromJsFunction_qrDroid(data,function(res){
      if (func) { func(res) }
    })
  } else {
    log('not find uexCore!')
  }
}
// 14.分享方法
const vuap_fromJsFunction_share = (data, func) => {
  // data={title:'',imageType:'',image:'',url:'',description:'',array:''}
  if ((typeof uexCore) != "undefined") {
     uexCore.share(data,function(res){
      if (func) { func(res) }
     })
  } else {
    log('not find uexCore!')
  }
}
// 15.数据采集
const vuap_dataCollection = (data) => {
  if ((typeof uexCore) != "undefined") {
    log('333333')
    uexCore.dataCollection(data,function(res){
      log('111111')
    })
  } else {
    log('not find uexCore!')
  }
}
// 15.原生支付
const vuap_tradePay = (data, func) => {
  if ((typeof uexCore) != "undefined") {
    data = {
      'jsonStr':JSON.stringify(data),
      'token': getUserInfo().token
    }
    uexCore.paymentViewController(data,function(res){
      if (func) { func({'data':JSON.parse(res)}) }
    })
  } else {
    log('not find uexCore!')
  }
}

/**
 * 跳转原生交费费（android、ios）
 * @param {} data 
 * @param {*} func 
 */
const vuap_toNativeEleList = (data, func) => {
  if ((typeof uexCore) != "undefined") {
    uexCore.payWithParameterController(data,function(res){
      if (func) { func(res) }
    })
  } else {
    log('not find uexCore!')
  }
}
// 判断当前环境是否有wsgwBridge
const vuap_uexCore = () => {
  let flag = false
  if ((typeof uexCore) != "undefined") {
    flag = true
  }
  return flag
}

const getUserInfo =()=>{
  if ((typeof uexCore) != "undefined") {
    return {
      'token':getStorageSync('DS_TOKEN') || '',
      'userId':getStorageSync("DS_USERID") || '',
      'location':getStorageSync("DS_LOCATION") || ''
    }
  } else {
    log('not find uexCore!')
  }
}
// 选择地区
const vuap_chooseAddressInfo = (data, func) => {
  // let data = {"type":"14","codeValue":"","showHotCitys":"1"} 
  // 11 北京市一级 
  // 12 ios北京市 市辖区  android 北京市 市辖区 昌平区 
  // 13 北京市 市辖区 昌平区 
  // 14 北京市 市辖区 昌平区 街道

  if ((typeof uexCore) != "undefined") {
    uexCore.chooseAddressInfo(data, (res) => {
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
    log('not find uexCore!')
  }
}

//调起刷脸组件
const vuap_newFaceMatce4 = (data,func) => {
  if ((typeof uexCore) != "undefined") {
    uexCore.newFaceMatce4( data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find uexCore!')
  }
}

const vuap_sendNotice = (data,func) => {
  if ((typeof uexCore) != "undefined") {
    uexCore.sendNotice( data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find uexCore!')
  }
}

const vuap_registerNotice = (data,func)=>{
  if ((typeof uexCore) != "undefined") {
    uexCore.registerNotice( data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find uexCore!')
  }
}

const vuap_shareWXMiniProgram = (data,func) => {
  if ((typeof uexCore) != "undefined") {
    uexCore.shareWXMiniProgram( data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find uexCore!')
  }
}

/**
 * 风控埋点，原理：
 * @param {*} data 
 * @param {*} func 
 */
const vuap_windControlBuryingPoint = (data,func) =>{
  uexCore.buryingPoint(JSON.stringify(data),(res) => {
    if(func){
      func(res)
    }
  })
}

/**
 * 微信分享，
 * @param {*} data 
 * @param {*} func 
 */
const vuap_weiXinShare= (data,func) =>{
  uexCore.weiXinShare(JSON.stringify(data),(res) => {
    if(func){
      func(res)
    }
  })
}

const vuap_choosePhoneContact = (data,func) =>{
  uexCore.choosePhoneContact(data,(res) => {
    if(func){
      func(res)
    }
  })
}

const vuap_showLoading = (data,func) =>{
  uexCore.showLoading(data,(res) => {
    if(func){
      func(res)
    }
  })
}

const vuap_hideLoading = (data,func) =>{
  uexCore.closeLoading(data,(res) => {
    if(func){
      func(res)
    }
  })
}

const vuap_bankViewController = (data,func) => {
  if ((typeof uexCore) != "undefined") {
    uexCore.bankViewController( data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find uexCore!')
  }
}

const vuap_makePhoneCall = (data,func) => {
  if ((typeof uexCore) != "undefined") {
    uexCore.makePhoneCall( data, (res) => {
      if(func){
        func(res)
      }
    })
  } else {
    log('not find uexCore!')
  }
}

const vuap_jumpToHotNews = (func) => {
  if ((typeof uexCore) != "undefined") {
    uexCore.jumpToHotNews(JSON.stringify({}),function(res){
      if(func){
        func(res)
      }
    })
  } else {
    log('not find uexCore!')
  }
}
// 从A跳到B,B做某些操作，再找参数给A返回，
const vuap_setInfoToLastWidget = (data, func) => {
  if ((typeof uexCore) != "undefined") {
    uexCore.setInfoToLastWidget(JSON.stringify(data), function(res){
      if(func){
        func(res)
      }
    })
  } else {
    log('not find uexCore!')
  }
}


const vuapApp = {
  vuap_request,
  vuap_init,
  vuap_jumpToMenu,
  vuap_setTempCache,
  vuap_getTempCache,
  vuap_chooseAndUpLoadImage,
  vuap_close,
  vuap_jumpAppHome,
  vuap_jumpToTitleView,
  vuap_downloadToPhone,
  vuap_scanQrCode,
  vuap_howToGetConsNum,
  vuap_consNoFuzzyQuery,
  vuap_fromJsFunction_qrDroid,
  vuap_fromJsFunction_share,
  vuap_dataCollection,
  vuap_tradePay,
  vuap_toNativeEleList,
  vuap_uexCore,
  vuap_chooseAddressInfo,
  getUserInfo,
  vuap_newFaceMatce4,
  vuap_sendNotice,
  vuap_registerNotice,
  vuap_shareWXMiniProgram,
  vuap_windControlBuryingPoint,
  vuap_weiXinShare,
  vuap_choosePhoneContact,
  vuap_showLoading,
  vuap_hideLoading,
  vuap_bankViewController,
  vuap_makePhoneCall,
  vuap_jumpToHotNews,
  vuap_setInfoToLastWidget
}
export {
  vuapApp
}