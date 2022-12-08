import Taro from "@tarojs/taro"
import envConfig from './env_config.js' // 入参字段区分测试灰度生产
import tools from './tools.min.js' // 封装的方法 (sm)
import qqMapWX from './lib/qqmap-wx-jssdk1.2/qqmap-wx-jssdk' // 定位用
import swanCityCode from './lib/swan-citycode-js/swanCityCode'
import onfire  from "./onfire.js" // 订阅发布

/**
 * 能力开放基础组件,对外提供以下能力
 * 1. AOP.initSDK()  初始化SDK
 * 2. AOP.httpApi()  网络请求组件
 * 3. AOP.getUserInfo() 获取用户信息
 * 4. AOP.getLocation() 获取定位信息
 * 5. AOP.getPhoneNumber() 获取授权手机号
 * 6. AOP.chooseCity()  调用选择省市地区组件
 * 7. AOP.loginDispatcher() 注册拦截页面
 * 8. AOP.loginStatusListener() 登录状态监听
 * 9. AOP.checkSession() 检查登录态是否过期 //过期重新获取
 */

 const allAccountType = { // 所有账户类型 // 01=腾讯QQ，02=微信，03=新浪 04=支付宝生活号 05=京东小程序 07=百度小程序
  'h5': '',
  'weapp': '02',
  'alipay': '04',
  'jd': '05',
  'swan': '07',
}
const AOP = {
  onfire,
  envConfig,
  accountType: allAccountType[process.env.TARO_ENV], // 当前账户类型
  RSI: tools.randomkey(false, 34),
  /**
   * 网络请求方法
   * @param {*} theObj : {url:"",data:{}}
   * @returns Promise() 接口返回的数据
   */
  httpApi(theObj = {}) {
    let obj = JSON.parse(JSON.stringify(theObj))
    return new Promise((resolve, reject) => {
      let isInner = obj.isInner ? obj.isInner : false
      if (isInner) {
        __this.oauthHttpApi(obj).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      } else {
        __this.outerHttpApi(obj).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }
    })
  },
  /**
   * [外部方法,业务侧用]
   * @param {} obj
   * @returns
   */
  outerHttpApi(obj) { // 业务调用(有token)
    return new Promise((resolve, reject) => {
      let url = obj.url ? obj.url : ''
      let data = obj.data ? obj.data : {}
      let isHideToast=obj.isHideToast?obj.isHideToast:false

      let requstToken = __this.getUserInfo().token
      data._t = requstToken ? requstToken.substring(requstToken.length / 2) : ""
      let theData = JSON.stringify(data)

      let encryptionData = tools.encryptBodyData(__this.RSI, theData) // sm4加密data
      let timestamp = new Date().getTime() // 时间戳
      let skey = tools.encryptData(__this.RSI) // sm2加密随机字符串
      let sign = tools.signData(skey + encryptionData + timestamp) // sm3验签
      let encData = {
        "client_id": envConfig.client_id,
        "skey": skey,
        "data": encryptionData,
        "sign": sign,
        "timestamp": timestamp
      }
      let theEncData = JSON.parse(JSON.stringify(encData)) // 请求入参
      let headers = { // 请求头
        "wsgwType": "mnpg",
        "content-type": 'application/json',
        "version": "1.0",
        "Accept": "application/json;charset=UTF-8", //这个是解决中文乱码的'
        't':__this.getUserInfo().token
      }

      tools.debug('【'+url+'】'+"请求入参====明文=>", theData);
      if (__this.getUserInfo().accessToken) {
        headers["Authorization"] = "Bearer " + __this.getUserInfo().accessToken
        __this.sendRequest(url, headers, theEncData, isHideToast).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      } else {
        __this.toGrantAuthorization().then(()=>{
          headers["Authorization"] = "Bearer " + __this.getUserInfo().accessToken
          __this.sendRequest(url, headers, theEncData, isHideToast).then((res) => {
            resolve(res)
          }).catch((err) => {
            reject(err)
          })
        }).catch((err)=>{reject(err)})
      }


    })
  },
  /**
   * [内部方法,业务侧禁用]
   * @param {*} obj
   * @returns
   */
  oauthHttpApi(obj) { // 能力开放内部调用 或 业务调用(无token)
    return new Promise((resolve, reject) => {
      let isHideToast=obj.isHideToast?obj.isHideToast:false
      let url = obj.url ? obj.url : ''
      let entryPubParam = {
        "client_id": envConfig.client_id,
        "client_secret": envConfig.client_screct,
      }
      let theData = obj.data ? JSON.stringify(Object.assign(obj.data, entryPubParam)) : JSON.stringify(
        entryPubParam)
      let encryptionData = tools.encryptBodyData(__this.RSI, theData) // sm4加密data
      let timestamp = new Date().getTime() // 时间戳
      let skey = tools.encryptData(__this.RSI) // sm2加密随机字符串
      let sign = tools.signData(skey + encryptionData + timestamp) // sm3验签
      let encData = {
        "client_id": envConfig.client_id,
        "skey": skey,
        "data": encryptionData,
        "sign": sign,
        "timestamp": timestamp
      }
      let theEncData = JSON.parse(JSON.stringify(encData)) // 请求入参
      let headers = { // 请求头
        "wsgwType": "mnpg",
        "content-type": 'application/json',
        "version": "1.0",
        "Accept": "application/json;charset=UTF-8", //这个是解决中文乱码的
        "client_id": envConfig.client_id, //这个是过网关验证的
        't':__this.getUserInfo().token
      }
      tools.debug('【'+url+'】'+"请求入参====明文=>", theData);
      // tools.debug('【'+url+'】'+"请求入参====密文=>", theEncData);
      __this.sendRequest(url, headers, theEncData,isHideToast).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  sendRequest(url, headers, theEncData,isHideToast=false,smKey=null) { //Taro.resquest
    console.log(headers,'======请求头==========',url)
    smKey = smKey===null ? __this.RSI: smKey
    return new Promise((resolve, reject) => {
      Taro.request({
        url: url.indexOf('http') == -1 ? envConfig.base_url + url : url,
        data: theEncData,
        method: "POST",
        header: headers,
        success(res) {
          let resData = res.data.encryptData ? res.data.encryptData : res.data.data
          if(JSON.stringify(resData)=='{}'){
            reject(res)
            if(!isHideToast){
              setTimeout(()=> {
                Taro.showToast({
                  title: res.data.message,
                  icon: 'none',
                  mask: true
                })
              })
            }
            return
          }

          let outRes = {}
          let resDecData = tools.doDecryptBodyData(smKey, resData) // sm4解密
          if (Object.prototype.toString.call(resDecData) === "[object String]") {
            if(resDecData){
              try {
                outRes = JSON.parse(resDecData)
              } catch(e) {}
            }
          }
          if(JSON.stringify(outRes) == '{}'){
            reject()
            if(!isHideToast){
              setTimeout(()=> {
                Taro.showToast({
                  title: '系统异常，请稍后再试!',
                  icon: 'none',
                  mask: true
                })
              })
            }
          } else {
            // tools.debug('【'+url+'】'+"请求返参======密文====>", res);
            tools.debug('【'+url+'】'+"请求返参======明文====>", JSON.stringify(outRes));
            resolve(outRes)
            //接口请求不通，toast提示用户
            if (!isHideToast) {
              let theTitle = ''
              if(outRes.code != "1" && outRes.message) {
                theTitle = outRes.message
              } else if (outRes.srvrt?.resultCode != "0000" && outRes.srvrt?.resultMessage) {
                theTitle = outRes.srvrt.resultMessage
              } else if (outRes.data?.srvrt?.resultCode != "0000" && outRes.data?.srvrt?.resultMessage) {
                theTitle = outRes.data.srvrt.resultMessage
              }
              if(theTitle) {
                setTimeout(()=> {
                  Taro.showToast({
                    title: theTitle,
                    icon: 'none',
                    mask: true,
                  })
                })
              }
            }
          }

        },
        fail(e) {
          reject(e)
        }
      })
    })
  },
  /**
   * [内部方法,业务侧禁用]
   * @returns Promise()
   */
  toGrantAuthorization() { // 授权 // 获取AOP_ACCESS_TOKEN并存入缓存
    return new Promise((resolve, reject) => {
      let url1 = "/oauth2/oauth/authorize"
      let headers = {
        'content-type': 'application/x-www-form-urlencoded'
      }
      let timestamp = new Date().getTime()
      let data = {
        client_id: envConfig.client_id,
        response_type: "code",
        redirect_url: "/OPF_TRQG5UQN/OPF_M0K4URCA/index.html", //redirectUrl是回调地址,国网小程序配置的
        rsi: __this.getUserInfo().token,
        timestamp,
        sign: tools.signData(envConfig.client_id + timestamp), // sm3验签
      }
      __this.sendRequest(url1,headers,data,true,__this.getUserInfo().token).then((theRes)=>{ //先拿授权码
        if (theRes.code == '1' && theRes.data && theRes.data.redirect_url) {
          let num = theRes.data.redirect_url.indexOf("code")
          let theCode = theRes.data.redirect_url.substring(num + 5)// 取code=后面的
          let url2 = envConfig.base_url + '/oauth2/oauth/getMiniPGToken'
          let timestamp2 = new Date().getTime()
          let sign2 = tools.signData(envConfig.client_id + timestamp2)
          Taro.request({ //再授权
            url: url2,
            method: "POST",
            data: {
              grant_type: 'authorization_code',
              sign: sign2,
              client_secret: envConfig.client_screct,
              state: tools.uuid(url2).toString(),
              client_id: envConfig.client_id,
              timestamp: timestamp2,
              code: theCode,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res){
              if (res.data && res.data.code == '1' && res.data.data) {
                Taro.setStorageSync('AOP_ACCESS_TOKEN',res.data.data.access_token)
                resolve(res.data)
              } else {
                reject({
                  code: res.data.code || '9999',
                  message: res.data.message || '[AOP]授权失败'
                })
              }
            },
            fail(err) {
              reject(err)
            }
          })
        } else { //失败
          reject({
            "code": theRes.code,
            "message":theRes.message || '',
          })
        }
      }).catch((err)=>{reject(err)})
    })
  },

  /**
   * 获取用户信息
   * @param {*} inner false默认获取基础信息,ture获取全部信息
   * @returns Promise() 用户信息
   */
  getUserInfo(inner=false){ // 获取缓存信息
    //区分微信、支付宝、交互桥针对性返参数
    if (process.env.TARO_ENV == 'alipay') {
        return {
          openId:Taro.getStorageSync('AOP_ALIPAY_OPENID')?Taro.getStorageSync('AOP_ALIPAY_OPENID'):'',
          token:Taro.getStorageSync('AOP_TOKEN')?Taro.getStorageSync('AOP_TOKEN'):'',
          channelCode:Taro.getStorageSync('AOP_CHANNEL_CODE')?Taro.getStorageSync('AOP_CHANNEL_CODE'):'3372',
          accessToken:Taro.getStorageSync('AOP_ACCESS_TOKEN')?Taro.getStorageSync('AOP_ACCESS_TOKEN'):''
        }
    } else if (process.env.TARO_ENV == "weapp") {
      return {
        openId:Taro.getStorageSync('AOP_WEAPP_OPENID')?Taro.getStorageSync('AOP_WEAPP_OPENID'):'',
        token:Taro.getStorageSync('AOP_TOKEN')?Taro.getStorageSync('AOP_TOKEN'):'',
        channelCode:Taro.getStorageSync('AOP_CHANNEL_CODE')?Taro.getStorageSync('AOP_CHANNEL_CODE'):'3369',
        accessToken:Taro.getStorageSync('AOP_ACCESS_TOKEN')?Taro.getStorageSync('AOP_ACCESS_TOKEN'):'',

        session_key:(inner&&Taro.getStorageSync('AOP_WEAPP_SESSIONKEY'))?Taro.getStorageSync('AOP_WEAPP_SESSIONKEY'):'',
        unionid:Taro.getStorageSync('AOP_WEAPP_UNIONID')?Taro.getStorageSync('AOP_WEAPP_UNIONID'):''
        // AOP_phoneNumber
      }
    } else if (process.env.TARO_ENV == "jd") {
      return {
        openId:Taro.getStorageSync('AOP_JD_OPENID')?Taro.getStorageSync('AOP_JD_OPENID'):'',
        accessTokenJD:Taro.getStorageSync('AOP_JD_ACCESS_TOKEN')?Taro.getStorageSync('AOP_JD_ACCESS_TOKEN'):'',
        token:Taro.getStorageSync('AOP_TOKEN')?Taro.getStorageSync('AOP_TOKEN'):'',
        channelCode:Taro.getStorageSync('AOP_CHANNEL_CODE')?Taro.getStorageSync('AOP_CHANNEL_CODE'):'3373',
        accessToken:Taro.getStorageSync('AOP_ACCESS_TOKEN')?Taro.getStorageSync('AOP_ACCESS_TOKEN'):'',
        jsCode: Taro.getStorageSync('AOP_JD_JSCODE')?Taro.getStorageSync('AOP_JD_JSCODE'):''
      }
    } else if (process.env.TARO_ENV == "swan") {
      return {
        channelCode:Taro.getStorageSync('AOP_CHANNEL_CODE')?Taro.getStorageSync('AOP_CHANNEL_CODE'):'3375',
        openId:Taro.getStorageSync('AOP_SWAN_OPENID')?Taro.getStorageSync('AOP_SWAN_OPENID'):'',
        session_key:(inner&&Taro.getStorageSync('AOP_SWAN_SESSIONKEY'))?Taro.getStorageSync('AOP_SWAN_SESSIONKEY'):'',
        jsCode: Taro.getStorageSync('AOP_SWAN_JSCODE')?Taro.getStorageSync('AOP_SWAN_JSCODE'):'',
        token:Taro.getStorageSync('AOP_TOKEN')?Taro.getStorageSync('AOP_TOKEN'):'',
        accessToken:Taro.getStorageSync('AOP_ACCESS_TOKEN')?Taro.getStorageSync('AOP_ACCESS_TOKEN'):'',
      }
    } else {
      return {}
    }
  },

  /**
   * [内部方法,业务侧禁用]
   * 用户登录,用于获取
   * @param {*} isMenuRegist   默认false:未获取到正确token不跳转页面, true:未获取到token需要手动去授权登录
   * @returns  Promise() 返回值不建议使用,统一使用getUserInfo()获取)
   */
  login(isMenuRegist=false) {
    let url = '/osg-open-uc0001/outer/c03/initLogin'
    return new Promise((resolve, reject)=>{
      let obj = {
        isInner: true,
        url,
        isHideToast:true,
        data: {
          "quInfo":{
            "thirdPartnerId": __this.getUserInfo().openId,
            "thirdUnionId": __this.getUserInfo().openId,
            "accountType": __this.accountType,

          },
          "uscInfo": {
            "member": __this.getUserInfo().channelCode,
            "proNo": "00000"
           },
        }
      }
      __this.httpApi(obj).then((res)=>{
        Taro.hideLoading()
        if (res?.srvrt?.resultCode == "0000") {
          Taro.setStorageSync('AOP_TOKEN',res.bizrt.token)
          __this.toGrantAuthorization().then(()=>{
            resolve()
          }).catch((err)=>{
            console.log(err,'授权失败')
            reject(err)
          })
        } else {
          if(res?.srvrt?.resultCode == "0100"){ //运管注销过帐号返0100
            Taro.removeStorageSync('AOP_TOKEN')
            Taro.removeStorageSync('AOP_ACCESS_TOKEN')
            // Taro.removeStorageSync('AOP_CITY_DATA')
            // Taro.removeStorageSync('AOP_COMMON_ADDRESS')
          }
          //测试用
          if(isMenuRegist){ // 跳转注册
            __this.signUp().then(()=>{resolve()}).catch((err)=>{reject(err)})
          } else {reject(res)}
        }
      }).catch((err)=>{
        Taro.hideLoading()
        reject(err)
      })
    })
  },
  /**
   * SDK初始化
   * @returns Promise
   */
  initSDK(){
    return new Promise((resolve, reject) => {
      __this.appLogin().then(()=>{
        __this.getToken().then(()=>{
          console.log('====获取到了新的token')
          __this.onfire.fire("login", null)
        }).catch((e)=>{
          console.log('====未能获取新的token')
          __this.onfire.fire("login", null)
        })
      }).catch(()=>{
        if (process.env.TARO_ENV == 'swan') {
          setTimeout(()=>{
            console.log('====宿主未登录')
            __this.onfire.fire("login", { swanNeedLogin: true })
          },300)
        } else {
          console.log('====宿主未登录')
          __this.onfire.fire("login", null)
        }
      })
    })
  },

  loginStatusListener(){
    return new Promise((resolve, reject)=>{
      __this.onfire.on("login", function (data) {
        resolve(data)
      })
    })
  },

  /**
 * [内部方法,业务侧禁用]
 * 获取宿主登录状态/唤起宿主登录组件
 * @returns Promise().resolve()已登录宿主app  Promise().reject()未登录宿主app
 */
  appLogin() {
    return new Promise((resolve, reject) => {
      if (process.env.TARO_ENV == 'swan') {
        Taro.removeStorageSync('AOP_SWAN_JSCODE')
        Taro.removeStorageSync('AOP_SWAN_OPENID')
        Taro.removeStorageSync('AOP_SWAN_SESSIONKEY')
        Taro.removeStorageSync('AOP_TOKEN')
        Taro.removeStorageSync('AOP_ACCESS_TOKEN')
        let res = swan.isLoginSync()
        if (res.isLogin) {
          resolve()
        } else {
          reject()
        }
      } else if (process.env.TARO_ENV == 'jd') {
        Taro.removeStorageSync('AOP_JD_JSCODE')
        Taro.removeStorageSync('AOP_JD_OPENID')
        Taro.removeStorageSync('AOP_JD_ACCESS_TOKEN')
        Taro.removeStorageSync('AOP_TOKEN')
        Taro.removeStorageSync('AOP_ACCESS_TOKEN')
        jd.login({ //调用接口 jd.login() 唤起原生登录组件 IDE暂时不支持调用jd.login()，请用真机查看
          success: function(res) {
            if (res.code) {
              resolve()
            } else {
              reject()
            }
          },
          fail: function(err) {
            reject()
          }
        })
      } else if (process.env.TARO_ENV != 'h5') { // 其他 非h5(weapp alipay)
        resolve()
      }
    })
  },

  /**
   * [内部方法,业务侧禁用]
   * 获取用户登录后的身份信息
   * @param {*} isMenuRegist 默认false:未获取到正确token不跳转页面, true:未获取到token需要手动去授权登录
   * @returns
   */
  getToken(isMenuRegist) {
    return new Promise((resolve, reject) => {
      if(!__this.getUserInfo().openId){
        __this.getOpenId(isMenuRegist).then(()=>{
          __this.login(isMenuRegist).then(()=>{resolve()}).catch((err)=>{reject(err)})
        }).catch((err)=>{
          reject(err)
        })
      } else {
        __this.login(isMenuRegist).then(()=>{resolve()}).catch((err)=>{reject(err)})
      }
    })
  },
  /**
   * [内部方法,业务侧禁用]
   * 获取第三方唯一标识
   * @returns Promise() 微信openid,支付宝userid
   */
  getOpenId(isMenuRegist) {
    return new Promise((resolve, reject) => {
      __this.getJsCode(isMenuRegist).then((jsCode) => {
        let obj = {
          isInner: true,
          url:"/osg-open-uc0001/outer/c03/queryOpenId",
          data: {
            "quInfo": {
              "accountType": __this.accountType,
              "jsCode": jsCode,
            }
          }
        }
        __this.httpApi(obj).then((res) => {
          if (res && res.srvrt && res.srvrt.resultCode == "0000" && res.wechatVo && res.wechatVo.openid) {
            if (process.env.TARO_ENV == 'alipay') { // 支付宝小程序 后端接口只返回openid
              Taro.setStorageSync('AOP_ALIPAY_OPENID',res.wechatVo.openid)
              resolve( __this.getUserInfo())
            } else if (process.env.TARO_ENV == 'weapp') { // 微信小程序 后端接口除了openid还返回了session_key和unionid
              Taro.setStorageSync('AOP_WEAPP_OPENID',res.wechatVo.openid)
              Taro.setStorageSync('AOP_WEAPP_UNIONID',res.wechatVo.unionid)
              Taro.setStorageSync('AOP_WEAPP_SESSIONKEY',res.wechatVo.session_key)
              resolve( __this.getUserInfo())
            } else if (process.env.TARO_ENV == 'jd') { // 京东小程序 后端接口除了openid还返回了access_token(京东的access_token)
              Taro.setStorageSync('AOP_JD_OPENID',res.wechatVo.openid)
              Taro.setStorageSync('AOP_JD_ACCESS_TOKEN',res.wechatVo.access_token)
              Taro.setStorageSync('AOP_JD_JSCODE',jsCode) //京东一键登录作为入参使用
              resolve( __this.getUserInfo())
            } else if (process.env.TARO_ENV == 'swan') { // 百度小程序 后端接口除了openid还返回了session_key
              Taro.setStorageSync('AOP_SWAN_OPENID',res.wechatVo.openid)
              Taro.setStorageSync('AOP_SWAN_SESSIONKEY',res.wechatVo.session_key)
              Taro.setStorageSync('AOP_SWAN_JSCODE',jsCode)
              resolve( __this.getUserInfo())
            } else { //其他..
              reject('目前仅支持微信支付宝京东小程序百度小程序')
            }
          } else {
            reject(res)
          }
        }).catch((err) => {
          reject(err)
        })
      }).catch((err) => {
        reject(err)
      })
    })
  },
  /**
   * 获取手机号
   * TOOD必须把方法逻辑封装在这里,以便于其他业务场景使用
   * @returns Promise() 用户弹框选择的手机号
   */
  getPhoneNumber(e) {
    return new Promise((resolve, reject) => {
      let result = {}
      if (process.env.TARO_ENV == 'weapp') {
        // detail:{ cloudID: "",encryptedData: "",errMsg: "getPhoneNumber:ok",iv: ""}
        console.log(e)
        console.log(typeof e.detail.encryptedData)
        if (typeof e.detail.encryptedData == 'string') {
          result = {...e.detail,sessionKey:Taro.getStorageSync('AOP_WEAPP_SESSIONKEY') }
          resolve(result)
        } else {
          resolve({
            code: "9999",
            msg: "获取手机号失败"
          })
        }
      } else if (process.env.TARO_ENV == 'alipay') {
        // {response: "{"response":""}"}
        my.getPhoneNumber({
          success(res) {
            result = {
              encryptedData:res.response
            }
            resolve(result)
          },
          fail(err) {
            resolve({
              code: "9999",
              msg: err.errMsg || "获取手机号失败"
            })
          }
        })

      } else if (process.env.TARO_ENV == 'jd') {
        if (e?.detail?.errMsg == "getPhoneNumber:ok") {
          result = {
            jsCode: __this.getUserInfo().jsCode
          }
          resolve(result)
        } else {
          resolve({
            code: "9999",
            msg: e.detail.errMsg || "获取手机号失败"
          })
        }
      } else {
        reject('目前仅支持微信支付宝京东小程序')
      }
    })
  },
  /**
   * 解绑时获取手机号
   * TOOD必须把方法逻辑封装在这里,以便于其他业务场景使用
   * @returns Promise() 用户解绑时需要的手机号
   */
  unbindGetPhoneNumber() {
    return new Promise((resolve, reject) => {
      let url = "/osg-open-uc0001/outer/c03/queryUserInfo";
      let data = {
        "quInfo": {
          "token": __this.getUserInfo().token,
          "thirdPartnerId": __this.getUserInfo().openId,
          "thirdUnionId": __this.getUserInfo().openId,
          "accountType": __this.accountType,
        },
      }
      __this.httpApi({
        isInner: true,
        url: url,
        data: data,
      })
        .then((res) => {
          console.log(res, "res=====httpApi", url);
          if (res && res.srvrt && res.srvrt.resultCode == "0000") {
            resolve(res.userInfo[0])
          } else {
             resolve({
              code: "9999",
              msg: "获取手机号失败"
            })
          }
        })
        .catch((err) => {
          reject(err)
        });

    })
  },
  /**
   * [内部方法,业务侧禁用]
   * 获取第三方jscode值,用获取openid
   * @returns Promise() 第三方jscode值
   */
  getJsCode(isMenuRegist) {
    return new Promise((resolve, reject) => {
      if (process.env.TARO_ENV == 'weapp') { //微信jscode
        Taro.login({ // Taro仅支持微信小程序 http://taro-docs.jd.com/taro/docs/apis/open-api/login/login
          success(res) {
            res.code ? resolve(res.code) : reject(null)
          }
        })
      } else if (process.env.TARO_ENV == 'alipay') { //支付宝jscode
        my.getAuthCode({ // 参考支付宝小程序文档 https://opendocs.alipay.com/mini/api/openapi-authorize
          scopes: 'auth_base',
          success(res) {
            res.authCode ? resolve(res.authCode) : reject(null)
          },

        })
      } else if (process.env.TARO_ENV == 'jd') {
        jd.getAuthCode({
          success(res) {
            res.code ? resolve(res.code) : reject(null)
          },
          fail() {
            reject(null)
          }
        })
      } else if(process.env.TARO_ENV == 'swan') {
        swan.getLoginCode({
          success(res){
            res.code ? resolve(res.code) : reject(null)
          },
          fail() {
            reject(null)
          }
        })
      } else { // 其他..
        reject('目前仅支持微信支付宝京东小程序百度小程序')
      }
    })
  },

  /**
   * 获取定位方法
   * @returns Promise()
   */
  getLocation() {
    let url = '/osg-open-om0001/member/c27/f02'
    return new Promise((resolve, reject) => {
      __this.getSDKLocation().then((res) => {
        if (Object.prototype.toString.call(res) != '[object Object]' ) { //res是省市编号
          let obj = {
            isInner: true,
            url,
            data: {
              countyNo: res,
            }
          }
          // console.log(obj,'_this.httpApi=====obj',url)
          __this.httpApi(obj).then((dwRes) => {
            // console.log(JSON.stringify(dwRes),'_this.httpApi=====dwRes',url)
            // {"code":1,"message":"成功","data":{"cityName":"杭州市","provincePowerId":"33101","cityId":"330100","provinceName":"浙江省","provinceId":"330000","cityPowerId":"33401"}}
            if (dwRes && dwRes.data && dwRes.code == "1") {
              const resAddrData = dwRes.data;
              console.log(resAddrData,'定位返参')
              let data={
                'provinceCode5': resAddrData.provincePowerId ? resAddrData.provincePowerId : '',
                'provinceCode6': resAddrData.provinceId ? resAddrData.provinceId : '',
                'provinceName':resAddrData.provinceName ? resAddrData.provinceName : '',
                'cityCode':resAddrData.cityId ? resAddrData.cityId : '',
                'cityName':resAddrData.cityName ? resAddrData.cityName : '',
                'countyCode':resAddrData.countyId ? resAddrData.countyId : '',
                'countyName':resAddrData.countyName ? resAddrData.countyName : '',
              }

              resolve(data);
            } else {
              reject({
                code: dwRes.code,
                msg: dwRes.message
              })
            }

          })
        } else { //res是错误对象,例如 {code: 2001, msg: "用户不允许授权"}
          reject(res)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },
  /**
   * [内部方法,业务侧禁用]
   * 通过第三方SDKAPI获取位置信息
   * @returns Promise() 经纬度信息
   */
  getSDKLocation() {
    return new Promise((resolve, reject) => {
      if (process.env.TARO_ENV == 'alipay') {
        my.getLocation({
          type: 1,
          success(res) {
            // {accuracy: "200.000000",
            // city: "北京市", cityAdcode: "110100",
            // country: "中国", countryCode: "156",
            // district: "东城区", districtAdcode: "110101",
            // horizontalAccuracy: "200.000000",
            // latitude: "39.9", longitude: "116.4", }
            // resolve(res.cityAdcode)
            resolve(res.districtAdcode) // 2021-12-1 lzk 参照微信小程序 （返参多countyId、countyName）用于注册接口参数
          },
          fail (res) {
            // {error: 2001, message: "用户不允许授权"}
            // {error: 11, errorMessage: "请确认定位相关权限已开启"}
            // {error: 12, errorMessage: "网络异常，请稍后再试"}
            // {error: 13, errorMessage: "定位失败，请稍后再试"}
            // {error: 14, errorMessage: "业务定位超时"}
            resolve({
              code: res.error,
              msg: res.errorMessage || res.message,
            })
          },
        })
      } else if (process.env.TARO_ENV == "weapp") { //待完善
        const qqmapsdk = new qqMapWX({
          key: envConfig.GPS_KEY
        })
        wx.getLocation({
          type: 'wgs84', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
          success(res) {
            // {accuracy: 65,
            // errMsg: "getLocation:ok",
            // horizontalAccuracy: 65,
            // latitude: 39.90469, longitude: 116.40717,
            // speed: -1, verticalAccuracy: 65}
            let location = {
              latitude: res.latitude,
              longitude: res.longitude
            }
            qqmapsdk.reverseGeocoder({ //地址逆解析
              location,
              complete(res){
                if (res.status == 0) {
                  resolve(res.result.ad_info.adcode)
                } else {
                  resolve({
                    code: "9999",
                    msg: "地址逆解析失败"
                  })
                }
              }
            })
          },
          fail(res) {
            // {errMsg: "getLocation:fail auth deny"}
            resolve({
              code: '9999',
              msg: res.errMsg,
            })
          },
        })
      } else if (process.env.TARO_ENV == "swan") {
        swan.authorize({
          scope: 'scope.userLocation',//获取定位授权
          success() {
            swan.getLocation({ //获取定位信息
              type: 'gcj02',
              altitude: true,
              success(res) {
                // {"speed":4,"accuracy":50,"altitude":65,"verticalAccuracy":65,"latitude":39.89786626175921,"longitude":116.39881865193846,"street":"肉市一巷","cityCode":"131","city":"北京市","country":"中国","province":"北京市","streetNumber":"9号","district":"东城区","countryCode":"0","horizontalAccuracy":0,"isFullAccuracy":false}
                swanCityCode[res.cityCode] ? resolve(swanCityCode[res.cityCode]) : resolve({code: '9999',msg: '城市编码映射失败'})
              },
              fail() {
                resolve({
                  code: '9999',
                  msg: '获取定位信息失败',
                })
              }
            })
          },
          fail(res) {
            // {errCode: 10003, errMsg: "user deny"} 用户拒绝授权
            resolve({
              code: res.errCode,
              msg: res.errMsg,
            })
          }
        })
      } else {
        resolve({
          code: '9999',
          msg: '暂未开发定位逻辑',
        })
      }
    })
  },


  /**
   * 选择省市地区组件
   * @returns Promise() 返回该省(市)下的数据
   */
   chooseAddressInfo(params={}) {
    let p = JSON.stringify(params)
    return new Promise((resolve, reject)=>{
      Taro.navigateTo({
        url: `/pages/areaPage/areaPage?params=${p}`,
      })
      onfire.one("onChoose", function (res) {
        if (res) {
          console.log("注册订阅事件-->选择地区.....", res)
          let data={
            'provinceCode5': res.content3 ? res.content3 : '',
            'provinceCode6': res.provinceCode ? res.provinceCode : '',
            'provinceName':res.provinceName ? res.provinceName : '',
            'cityCode': res.cityCode ? res.cityCode : '',
            'cityName': res.cityName ? res.cityName : '',
            'countyCode': res.countyCode ? res.countyCode : '',
            'countyName': res.countyName ? res.countyName : '',
          }
          resolve(data)
        }
      })
    })
  },

 /**
  * 授权注册拦截页面
  * eg:→  AOP.loginDispatcher().then(()=>{ 业务侧页面跳转 }
  * @returns Promise() 返回值不建议使用,统一使用getUserInfo()获取
  */
  isIntercept: false,//拦截 true拦截 false不拦截
  pages: '',
  async loginDispatcher(pages){
    __this.pages = pages || '/pages/index/index';
    if (__this.isIntercept) { return Promise.reject('loginDispatcher--拦截重复调用') }
    if (__this.getUserInfo().token) {
      console.log('loginDispatcher---判断有token')
      return Taro.navigateTo({
        url: pages
      })
    }
    try {
      __this.isIntercept = true
      await __this.appLogin()
      await __this.getToken(true)
      __this.isIntercept = await false
      return
    } catch(e) {
      __this.isIntercept = false
      return Promise.reject(e || 'loginDispatcher--用户未进行登录操作')
    }
  },

   /**
  * 检查登录态是否过期
  * eg:→  AOP.checkSession().then(()=>{ 业务侧内容 })
  * @returns Promise() 无返回值,统一使用getUserInfo()获取
  */
  checkSession(){
    return new Promise((resolve, reject)=>{
      if(process.env.TARO_ENV == 'weapp'){ // 仅支持微信小程序
        Taro.checkSession({
          success: function () { //session_key 未过期，并且在本生命周期一直有效
            resolve()
          },
          fail: function () { // session_key 已经失效，需要重新执行登录流程
            __this.getOpenId().then(()=>{
              resolve()
            }).catch((err) => {
              reject(err)
            })
          }
        })
      } else { //其他环境
        resolve()
      }
    })
  },

  allLoginWay : { //各小程序支持的登录注册方式  quickLogin=手机号一键 authen=验证码
    'weapp': { quickLogin: true, authen: true },
    'alipay': { quickLogin: true, authen: true },
    'jd': { quickLogin: true, authen: true },
    'swan': { quickLogin: false, authen: true },
  },
  /**
   * [内部方法,业务侧禁用]
   * 跳转授权登录页面(手机号+短信验证码)
   * @returns  Promise(返回值不建议使用,统一使用getUserInfo()获取)
   */
  signUp() {
    return new Promise((resolve, reject)=>{
      if(__this.allLoginWay[process.env.TARO_ENV].quickLogin) { //如果支持一键登录就跳转一键登录注册
        Taro.navigateTo({
          url: '/pages/quickLogin/quickLogin',
        })
      } else if (__this.allLoginWay[process.env.TARO_ENV].authen) { //跳验证码
        Taro.navigateTo({
          url: '/pages/authen/authen',
        })
      }
      onfire.on("onLogin", function (data) {
        if(data) {
          Taro.setStorageSync('AOP_TOKEN',data.token)
          __this.toGrantAuthorization().then(()=>{
            if(__this.pages == '/pages/index/index') {
              Taro.navigateBack({
                delta: data.delta,
              })
            } else {
              Taro.redirectTo({
                url: __this.pages
              })
            }
            resolve()
          }).catch((err)=>{
            console.log(err,'授权失败')
            if(__this.pages == '/pages/index/index') { // 头像登录
              Taro.navigateBack({
                delta: data.delta,
              })
            } else { // 非头像登录
              Taro.redirectTo({
                url: __this.pages
              })
            }
            reject()
          })
        } else {reject('用户返回, 未登录')}
      })
    })
  },
}
const __this = AOP

export default AOP
