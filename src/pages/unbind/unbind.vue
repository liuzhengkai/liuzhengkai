<template>
  <view class="unbind-wrap">
    <!-- <image
      class="unbind_bg"
      src="../../assets/images/ds_bill_topBg.png"
    /> -->
    <TitleBar :title-bar-obj="titleBarObj" @goBack="goBack" />
    <view style="position:absolute;z-index:2;">
      <view action="" class="unbind-form">
        <view class="unbind-phone">
          <view class="phone-title">
            原绑定手机号
          </view>
          <view class="unbind-number">
            {{ secretPhone }}
          </view>
        </view>
        <view class="tips-box">
          <view class="tips-title">
            退出账号后，将有以下影响：
          </view>
          <view class="tips-content">
            <image class="leftArrow" src="../../assets/images/ds_Unbound.png" />
            <view class="tips-text">
              您的当前登录的网上国网账号将与{{channel}}解绑，解绑后可进行重新绑定
            </view>
          </view>
        </view>
        <view class="after-line" />
        <view class="after-tips">
          为了您的账号安全，请输入当前登录手机号验证码：
        </view>
        <view class="unbind-content padb-30">
          <input class="unbind-input" name="code" v-model="code" placeholder="请输入验证码" maxlength="6"
          type="number" :controlled="true" @input="codeChange">
          <view class="getcode-btn">
            <view class="code-box">
              <view v-if="!showTimes" class="getcode-text" style="color: #0c82f1" @tap="getCode">
                获取验证码
              </view>
              <view v-else class="getcode-text" style="color: #333333">
                {{ times }}s
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="unbind-btn" :style="{
        background: activeNext
          ? ''
          : 'linear-gradient(-45deg,#0c82f180 0%,#5db2ff80 100%)',
      }"
        @tap="handleValidatePhone">
        确认
      </view>
    </view>

  </view>
</template>
<script>
  import "./unbind.scss";
  import Taro from "@tarojs/taro";
  import AOP from "../../utils/wsgwH5Sdk/wsgwH5Sdk";
  import TitleBar from "@/components/titleBar/titleBar";
  export default {
    components: {
      TitleBar,
    },
    /**
     * 页面的初始数据
     */
    data() {
      return {
        linkImgUrl: require("../../assets/images/ds_Unbound.png"),
        showTimes: false,
        times: 60,
        phone: "",
        secretPhone: "",
        code: "",
        isphone: false,
        iscode: false,
        isgetcode: true,
        codeKey: "",
        isAgreeMentKey: "",
        memberCode: "",
        openId: "",
        innerText: "",
        codeMsg: "",
        titleBarObj: {
          title: "退出账号", // 户号绑定
          isOpenAlipayJump: false, // 返回到指定页面
          tokenBol: false, // 点击返回退出
          arrowWhite: true, //箭头默认false为黑色，ture为白色
          // isNoShowArrow: true // 不显示箭头，默认false;  显示，true
        },
        taroEnv: process.env.TARO_ENV,
        isDisabled: false,
        timer:null,
        channel: "",
      };
    },
    computed: {
      activeNext() {
        let arr = [this.code, this.secretPhone];
        return arr.every((item) => {
          return item;
        });
      },
    },
    // onLoad
    onLoad(options) {
      this.phone = JSON.parse(options.params).phone ?JSON.parse(options.params).phone : "";
      this.secretPhone = JSON.parse(options.params).secretPhone ?JSON.parse(options.params).secretPhone : "";
      if(this.taroEnv == 'alipay') {
        this.channel = '支付宝账号'
      } else if(this.taroEnv == 'weapp') {
        this.channel = '微信账号'
      } else if(this.taroEnv == 'jd') {
        this.channel = '京东账号'
      } else if(this.taroEnv == 'swan') {
        this.channel = '百度账号'
      }
    },
    methods: {
      // 返回上一页
      goBack() {
        Taro.navigateBack({
          delta: 1
        });

      },
      /**
       *  获取验证码方法
       */
      getCode() {
        let __this = this
        if(this.isDisabled==false){
          this.isDisabled = true
          Taro.showLoading({
            title: '加载中',
            mask: true
          })
          // 发短信验证码 (用于解绑)
          AOP.httpApi({
            isInner: true,
            url: "/osg-open-uc0001/outer/c03/sendManage",
            data: {
              "quInfo": {
                "mobile": __this.phone,
                "thirdPartnerId": AOP.getUserInfo().openId,
                "thirdUnionId": AOP.getUserInfo().openId,
                "accountType": AOP.accountType,
              },
            },
          }).then((res) => {
            __this.isDisabled = false
            Taro.hideLoading()
            if (res && res.srvrt && res.srvrt.resultCode == "0000") {
              __this.showTimes = true;
              __this.smsId = res.smsId;
              __this.codeKey = res.preSmsId;
              __this.codeMsg = res.returnMsg;
              __this.times = 59;
              __this.timer = setInterval(() => {
                if (__this.times === 0 || __this.times === 60) {
                  clearInterval(__this.timer);
                  __this.showTimes = false;
                  __this.times = 60;
                }
                __this.times = __this.times - 1;
              }, 1000);
            } else if (res && res.srvrt && res.srvrt.resultCode == "0900") {
              Taro.showToast({
                title: res.srvrt.resultMessage,
                icon: 'none',
              });
            } else {
              Taro.showToast({
                title: res.srvrt.resultMessage,
                icon: 'none',
              });
            }
          }).catch((err) => {
            __this.isDisabled = false
            Taro.hideLoading()
          });
        }
      },
      /**
       *  验证并解绑原手机号
       */
      handleValidatePhone() {
        let __this = this
        if(this.isDisabled==false){
          this.isDisabled = true
          if (this.codeKey === "") {
            Taro.showToast({
              title: "请点击获取验证码",
              icon: "none",
            });
            this.isDisabled = false
          } else {
            Taro.showLoading({
              title: '加载中',
              mask: true
            })
            AOP.httpApi({
              isInner: true,
              url: "/osg-open-uc0001/outer/c03/unbind",
              data: {
                "uscInfo": {
                  "member": AOP.getUserInfo().channelCode,
                  "tenant": "state_grid",
                },
                "quInfo": {
                  "mobile": __this.phone,
                  "token": AOP.getUserInfo().token,
                  "verificationCode": __this.code,
                  "appCode": AOP.getUserInfo().channelCode,
                  "proNo": "00000",
                  "accountType": AOP.accountType,
                  "thirdPartnerId": AOP.getUserInfo().openId,
                  "thirdUnionId": AOP.getUserInfo().openId,
                },
              },
            }).then((res) => {
              __this.isDisabled = false
              Taro.hideLoading()
              if (res && res.srvrt && res.srvrt.resultCode == '0000') {
                Taro.removeStorageSync('AOP_TOKEN')
                Taro.removeStorageSync('AOP_ACCESS_TOKEN')
                // Taro.removeStorageSync('AOP_CITY_DATA')
                // Taro.removeStorageSync('AOP_COMMON_ADDRESS')
                if (process.env.TARO_ENV == 'alipay') {
                  Taro.removeStorageSync('AOP_ALIPAY_OPENID')
                } else if (process.env.TARO_ENV == "weapp") {
                  Taro.removeStorageSync('AOP_WEAPP_OPENID')
                  Taro.removeStorageSync('AOP_WEAPP_UNIONID')
                  Taro.removeStorageSync('AOP_WEAPP_SESSIONKEY')
                } else if (process.env.TARO_ENV == "jd") {
                  Taro.removeStorageSync('AOP_JD_OPENID')
                  Taro.removeStorageSync('AOP_JD_ACCESS_TOKEN')
                  Taro.removeStorageSync('AOP_JD_JSCODE')
                } else if (process.env.TARO_ENV == "swan") {
                  Taro.removeStorageSync('AOP_SWAN_JSCODE')
                  Taro.removeStorageSync('AOP_SWAN_OPENID')
                  Taro.removeStorageSync('AOP_SWAN_SESSIONKEY')
                }
                Taro.navigateBack({
                  delta: 2,
                })
              } else {
                Taro.showToast({
                  title: res.srvrt.resultMessage,
                  icon: 'none',
                })
              }
            }).catch((err) => {
              __this.isDisabled = false
              Taro.hideLoading()
            })
          }
        }
      },
      codeChange(e) {
        this.code = e.detail.value;
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
  };
</script>
