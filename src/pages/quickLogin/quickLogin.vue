<template>
  <!-- pages/auth/index.wxml -->
  <view class="quickLogin">
    <TitleBar class="quickLogin_titlebar" :title-bar-obj="titleBarObj" @goBack="goBack" />
    <view class="quickLogin_body">
      <image class="quickLogin_img" mode="widthFix" src="../../assets/images/ds_quickLogin_banner.png" />
      <!-- 登录 -->
      <view class="register">
        <image class="loginBtn_img" mode="widthFix" src="../../assets/images/ds_quickLogin.png" alt="手机号一键登录"></image>
        <view v-show="!isChecked">
          <view class="loginBtn" @tap="quickLogin"></view>
        </view>
        <view v-show="isChecked">
          <button class="loginBtn" openType="getAuthorize" scope="phoneNumber" @getAuthorize="allowDecryTel" v-if="taroEnv == 'alipay'">手机号一键登录</button>
          <button class="loginBtn" openType="getPhoneNumber" @getPhoneNumber="allowDecryTel" v-else>手机号一键登录</button>
        </view>
        <view class="otherPhNum" @tap="otherPhNum">其他手机号登录</view>
      </view>
      <!-- 协议 -->
      <view class="agreement">
        <view class="agreement_checkBox">
          <image class="checkBox_img" src="../../assets/images/ds_checkedTrue.png"  v-show="isChecked" @tap="changeCheckBox"></image>
          <image class="checkBox_img" src="../../assets/images/ds_checkedFalse.png"  v-show="!isChecked" @tap="changeCheckBox"></image>
        </view>
        <view class="agreement_textBox">
          <text>我已经阅读并同意</text>
          <text style="color:#FF824F" data-gid='0' @tap="showDocInfo">《用户绑定协议》</text>
          <text style="color:#FF824F" data-gid='1' @tap="showDocInfo"> 《隐私声明》</text>
          <text>。若您的手机号未注册，将为您自动注册。</text>
        </view>
      </view>
    </view>
    <view class="quickLogin_footer">
      <image class="footer_img" mode="widthFix" src="../../assets/images/ds_footer.png" />
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
          isNoShowArrow: false,
          isOpenBgBlue: false,//默认false透明色 true蓝色  '#FFFFFF'指定色
        },
        modalValue: {
          modalTitle: '提示', //弹窗标题
          modalContent: [{
            content: '请点击下方按钮，手动选择地区'
          }], //弹窗内容
          modalBtn: ['选择地区'], //弹窗按钮(一个按钮或两个按钮，默认两个)
          cancelColor: '', // 左按钮颜色
          confirmColor: '#11A9B0', // 右按钮颜色
          isContent: true, // 文字是否居中
        },
        showComponents: false,
        isChecked: false,
        phone: '',
        taroEnv: process.env.TARO_ENV,
        onLogin: false, //登录成功了吗
      }
    },
    components: {
      TitleBar,
      Modal
    },
    onShow() {
      if (this.taroEnv == 'h5') { return }
      let that = this;
      let cityData = Taro.getStorageSync('AOP_CITY_DATA')
      if (cityData) { // 有缓存用缓存中的位置
        return
      } else { // 无缓存用定位    
        AOP.getLocation().then((res) => {
          if (res.provinceName && res.provinceCode5) {
            that.out_province_code = res.provinceCode5,
              that.out_province_name = res.provinceName
            Taro.setStorageSync('AOP_CITY_DATA', res)
          }
        }).catch((err) => {
          this.showComponents = true;
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
      cancel() {
        let that = this
        that.showComponents = false;
        AOP.chooseAddressInfo({ "Hierarchy": '3', "obtainHierarchy": '2' }).then((res) => {
          Taro.setStorageSync('AOP_CITY_DATA', res)
        })
      },
      // 一键登录按钮（未勾选协议）
      quickLogin() {
        Taro.showToast({
          title: '请先阅读并同意用户绑定协议和隐私声明',
          icon: 'none',
        })

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
