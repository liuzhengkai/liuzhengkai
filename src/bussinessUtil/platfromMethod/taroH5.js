
import Taro from '@tarojs/taro'
import { getStorageSync, log } from '../commonPlugin/validate'
import { showLoading,hideLoading } from '../commonPlugin/interactive'
//使用范围：无加解密，本地请求，taro自转多平台请求方法
// var baseUrl = "http://192.168.9.54:8882/"//http的header需要加{t:"sh342432",ispProd:"0"}  ispProd:0测试，1灰度，2生产
const taroH5 = {
    request(url, params, success, fail, showLoad) {
    console.log('当前baseURL:'+baseUrl)
    log('showLoad:'+showLoad)
    showLoad == '0' && showLoading()
    var platfromUrl = process.env.TARO_ENV === 'h5' ? '/api/'+url : baseUrl+url
    Taro.request({
      method: 'POST',
      url: platfromUrl,
      data: params,
      header: {
        'content-type': 'application/json',
        // 't':this.getUserInfo().token || 'QWERTYUIOPLKJHGFDSAZXCVBNM0987654321202020200520',
        // 'Authorization': "QWERTYUIOPLKJHGFDSAZXCVBNM0987654321202020200520",//调用生产环境测试用
        't':this.getUserInfo().token || 'QWERTYDF1BCDADDD6E422A8C0159CB09F4C2C4',
        'Authorization': "QWERTYDF1BCDADDD6E422A8C0159CB09F4C2C4",//调用验收环境测试用
        'secureToken': 'zhongtai',
        'version': '6.2.3',
        'wsgwType':"ios"
      },
      success(res) {
        showLoad == '0' && hideLoading()
        success(res)
      },
      fail(res) {
        showLoad == '0' && hideLoading()
        fail(res)
      }
    })
  },


 getUserInfo(){
  return {
    'token':getStorageSync('DS_TOKEN') || ''
  }
}
}

export { taroH5 }