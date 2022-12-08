
import Taro from '@tarojs/taro'
import AOP from '../../utils/wsgwH5Sdk/wsgwH5Sdk'

//本文件为能力开放SDK输出文件，目前设计支撑微信小程序、支付宝小程序、京东小程序，
const request = (url, params,success, fail, showLoad,isWhiteList,isHideToast,isForbidDoubleClick) => {
    let obj = {
      isInner: isWhiteList,
      url:url,
      data: params,
      isHideToast:isHideToast
    }
    if(showLoad == '0') {
      Taro.showLoading({
        title: "加载中",
        mask: true
      })
    }
    if (isForbidDoubleClick){
      setTimeout(() => {
        AOP.httpApi(obj).then((response)=>{
          if(showLoad == '0') {
            Taro.hideLoading()
          }
          success(response)
        }).catch((err)=>{
          if(showLoad == '0') {
            Taro.hideLoading()
          }
          fail(err)
        })
      }, 200);
    }else{
      AOP.httpApi(obj).then((response)=>{
        if(showLoad == '0') {
          Taro.hideLoading()
        }
        success(response)
      }).catch((err)=>{
        if(showLoad == '0') {
          Taro.hideLoading()
        }
        fail(err)
      })
    }
    
}

const getUserInfo = () =>{
    return AOP.getUserInfo()
}
const chooseAddressInfo = (params) =>{
  return AOP.chooseAddressInfo(params)
}
const getLocation = ()=>{
  return AOP.getLocation()
}
const loginDispatcher = (pages)=>{
  return AOP.loginDispatcher(pages)
}
const loginStatusListener = ()=>{
  return AOP.loginStatusListener()
}
const initSDK = ()=>{
  return AOP.initSDK()
}
const abilityOpenPlatform = {
  request,
  getUserInfo,
  chooseAddressInfo,
  getLocation,
  loginDispatcher,
  loginStatusListener,
  initSDK,
}
export {
  abilityOpenPlatform
}