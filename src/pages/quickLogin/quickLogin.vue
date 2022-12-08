<template>
  <!-- pages/auth/index.wxml -->
  <view class="auth-wrap">
    <TitleBar :title-bar-obj="titleBarObj" @goBack="goBack" />
    <view class="register">
      <view class="ds_register_bg">
        <image src="../../assets/images/ds_register_bg.png" />
      </view>
      <view class="locationText" @tap="getAddress">
        <image class="locationText_left" src="../../assets/images/ds_address.png" />
        <view class="locationText_middle">{{locationText}}</view>
        <image class="locationText_right" src="../../assets/images/ds_right_arrow.png" />
      </view>
      <view v-show="!isChecked || !locationOK">
        <button class="loginBtn" @tap="quickLogin">手机号一键登录</button>
      </view>
      <view v-show="isChecked && locationOK">
        <button class="loginBtn" openType="getAuthorize" scope="phoneNumber" @getAuthorize="allowDecryTel" v-if="taroEnv == 'alipay'">手机号一键登录</button>
        <button class="loginBtn" openType="getPhoneNumber" @getPhoneNumber="allowDecryTel" v-else>手机号一键登录</button>
      </view>
      <view class="describe">若您的手机号未注册，将为您自动注册。</view>
      <view class="otherPhNum" @tap="otherPhNum">其他手机号登录</view>
    </view>
    <!-- <view class="agreement">
      <checkbox v-show="taroEnv=='alipay'" class="auth-radio" color='#0c82f1' :checked="isChecked" @change="changeCheckBox" />
      <label v-show="taroEnv=='weapp' || taroEnv=='jd'">
        <checkbox class="auth-radio" color='#0c82f1' :value="isChecked" :checked="isChecked" @tap="changeCheckBox"></checkbox>
      </label>
      <view class="agreementBD" v-show="taroEnv=='swan'">
        <image class="agreementBDTrue" src="../../assets/images/ds_checkedTrue.png"  v-show="isChecked" @tap="changeCheckBox"></image>
        <view class="agreementBDFalse" v-show="!isChecked" @tap="changeCheckBox"></view>
      </view>
      <view>
        <text>我已经阅读并同意</text>
        <text style="color:#0c82f1" data-gid='0' @tap="showDocInfo">《用户绑定协议》</text>
        <text style="color:#0c82f1">、</text>
        <text style="color:#0c82f1" data-gid='1' @tap="showDocInfo">《隐私声明》</text>
        <text>若您的手机号未注册，将为您自动注册。</text>
      </view>
    </view> -->
    <view class="footer">
      <image class="footerBg" src="../../assets/images/ds_pay_result_bottom.png" />
      <view class="downLoadCode">更多精彩活动就在网上国网APP，扫码下载吧</view>
      <image class="ds_reg_code" src="../../assets/images/ds_reg_code.png" />
      <view class="ql_tip">交费 · 查账 · 开票 · 办电 · 报修</view>
      <view class="ql_tips">— 尽在网上国网App，您的随身电管家 —</view>
    </view>
    <Modal :modalValue="modalValue" :showComponents="showComponents" @cancel="cancel" />
  </view>
</template>

<script>
  import './quickLogin.scss'
  import Taro from "@tarojs/taro";
  import AOP from '../../utils/wsgwH5Sdk/wsgwH5Sdk'
  import TitleBar from "@/components/titleBar/titleBar";
  import Modal from "@/components/modal/modal";

  export default {
    data() {
      return {
        titleBarObj: {
          title: "用户授权",
          // tokenBol: false,
          arrowWhite: true,
          isNoShowArrow: false
        },
        modalValue: {
          modalTitle: '提示', //弹窗标题
          modalContent: [{
            content: '请点击下方按钮，手动选择地区'
          }], //弹窗内容
          modalBtn: ['选择地区'], //弹窗按钮(一个按钮或两个按钮，默认两个)
          cancelColor: '', // 左按钮颜色
          confirmColor: '#0C82F1', // 右按钮颜色
          isContent: true, // 文字是否居中
        },
        showComponents: false,
        locationText: '请选择登录地区',
        locationOK: false,
        isChecked: true, //用户已在首页同意协议(合规改版)
        phone: '',
        taroEnv: process.env.TARO_ENV,
        onLogin: false, //登录成功了吗
      }
    },
    components: {
      TitleBar,
      Modal
    },
    onLoad() {
      if (this.taroEnv == 'h5') { return }
      let cityData = Taro.getStorageSync('AOP_CITY_DATA')
      if (cityData) { // 有缓存用缓存中的位置
        this.locationText = cityData.provinceName
        this.locationOK = true
      } else { // 无缓存自动定位
        this.locationText = '定位中...'
        AOP.getLocation().then((res) => { 
          Taro.setStorageSync('AOP_CITY_DATA', res)
          this.locationText = res.provinceName
          this.locationOK = true
        }).catch(() => {
          this.locationText = '请选择登录地区'
          this.locationOK = false
        })
      }
    },
    created() {
      
    },
    beforeDestroy() {
      let __this = this
      if (!__this.onLogin) {
        console.log('quickLogin页--用户未进行登录操作')
        AOP.onfire.fire("onLogin", null)
      } else {
        console.log('quickLogin页--用户进行了登录操作')
      }
    },
    methods: {
      getAddress() {//手动选择地区
        if(this.locationText == '定位中...'){return}
        AOP.chooseAddressInfo({"Hierarchy": '3',"obtainHierarchy": '2'}).then((res)=>{
          Taro.setStorageSync('AOP_CITY_DATA',res)
          this.locationText = res.provinceName
          this.locationOK = true
        })
      },
      cancel() {
        let that = this
        that.showComponents = false;
        AOP.chooseAddressInfo({ "Hierarchy": '3', "obtainHierarchy": '2' }).then((res) => {
          Taro.setStorageSync('AOP_CITY_DATA', res)
        })
      },
      // 一键登录按钮（未勾选协议）
      quickLogin() {
        if(!this.checked){
          Taro.showToast({
            title: '请先阅读并同意用户绑定协议和隐私声明',
            icon: 'none',
          })
        }
        if (!this.locationOK) {
          Taro.showToast({
            title: '请选择登录地区',
            icon: 'none',
          })
        }
      },
      // 切换协议
      changeCheckBox() {
        this.isChecked = !this.isChecked;
        console.log(this.isChecked, 'this.isChecked')
      },
      // 其他账号登录
      otherPhNum() {
        Taro.navigateTo({
          url: '/pages/authen/authen',
        })
      },
      // 返回上一页
      goBack() {
        Taro.navigateBack({
          delta: 1,
        });
      },

      // 单选按钮点击事件
      radioChange() {
        console.log("this.radio", this.radio)
        this.radio = !this.radio
      },
      allowDecryTel(e) { // 获取手机号密文成功的回调(用户点击了同意)
        let __this = this;
        AOP.getPhoneNumber(e).then(response => {
          if (response.code == '9999') { //获取手机号失败
            return false;
            // return Taro.showToast({
            //   title: response.msg,
            //   icon: 'none',
            // })
          }
          Taro.showLoading({ title: '加载中' ,mask: true})
          AOP.checkSession().then(() => { //解密手机号前先验证微信小程序的session_key是否过期
            AOP.httpApi({ // 解密手机号
              isInner: true, // 内部方法调用接口
              url: '/osg-open-uc0001/outer/c03/decryTel',
              data: {
                "quInfo": {
                  "accountType": AOP.accountType, // (支付宝微信京东百度 填该字段)
                  "thirdPartnerId": AOP.getUserInfo().openId || '', // (京东 填该字段)
                  "jsCode": response.jsCode || '', // (京东 填该字段)
                },
                "telephoneNumBo": {
                  "encryptedData": response.encryptedData ? response.encryptedData : "", // (支付宝微信百度 填该字段)
                  "iv": response.iv ? response.iv : "", // (微信百度 填该字段)
                  "sessionKey": response.sessionKey ? response.sessionKey : "", // (微信百度 填该字段)
                  "uid": "", // (微信 填该字段)
                }
              },
            }).then((res) => {
              console.log(res, '解密手机号的res')
              if (res && res.srvrt && res.srvrt.resultCode == '0000') { //解密成功
                __this.phone = res.telephoneNum.phoneNumber
                AOP.httpApi({ //一键免密注册登录
                  isInner: true,
                  url: '/osg-open-uc0001/outer/c03/directRegister',
                  data: {
                    "uscInfo": {
                      "member": AOP.getUserInfo().channelCode,
                      "tenant": "state_grid",
                      "devciceName": ""
                    },
                    "quInfo": {
                      "mobile": __this.phone,
                      "proNo": '00000',
                      "accountType": AOP.accountType,
                      "addressRegion": Taro.getStorageSync('AOP_CITY_DATA').countyCode ? Taro.getStorageSync('AOP_CITY_DATA').countyCode : '',
                      "addressCity": Taro.getStorageSync('AOP_CITY_DATA').cityCode ? Taro.getStorageSync('AOP_CITY_DATA').cityCode : '',
                      "thirdPartnerId": AOP.getUserInfo().openId,
                      "thirdUnionId": AOP.getUserInfo().openId,
                      "addressProvince": Taro.getStorageSync('AOP_CITY_DATA').provinceCode6 ? Taro.getStorageSync('AOP_CITY_DATA').provinceCode6 : ''
                    }
                  },
                }).then((res2) => {
                  Taro.hideLoading()
                  if (res2.srvrt && res2.srvrt.resultCode == '0000') { //一键免密注册登录成功 // 拿到token
                    __this.onLogin = true
                    AOP.onfire.fire("onLogin", {
                      token: res2.bizrt.token,
                    })
                    Taro.navigateBack({
                      delta: 1
                    })
                  } else { //一键免密注册登录失败
                    Taro.showToast({
                      title: res2.srvrt.resultMessage,
                      icon: 'none',
                    })
                  }
                }).catch(() => {
                  Taro.hideLoading()
                })
              } else {
                Taro.hideLoading()
                console.log(res.srvrt.resultMessage)
                //手机号解密失败
              }
            }).catch(() => {
              Taro.hideLoading()
            })
          }).catch(() => {
            console.log('session_key已过期, 且重新获取session_key失败')
            Taro.hideLoading()
          })
        })
      },
      forbidDecryTel() { // 支付宝原生 // 获取手机号密文失败的回调(用户点击拒绝或系统异常)

      },
      // 跳转协议方法
      showDocInfo(e) {
        const eIndex = e.currentTarget.dataset.gid
        Taro.navigateTo({
          url: '/pages/docInfo/docInfo?index=' + eIndex
        })
      },
    },
    onShareAppMessage(res) {
      return {
        title: '网上国网',
        desc: '电费轻松缴纳，随时随地享受便捷服务。',
        path: 'pages/index/index',
        channel:'Wxfriends,Wxmoments',
      }
    },
  }
</script>
