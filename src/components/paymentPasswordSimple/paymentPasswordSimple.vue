<template>

  <view class="payment-password-simple-bg" v-if="isShow && taroEnv == 'h5'">
    <view class="payment-password-simple-main">
      <view class="payment-password-simple-title">
        <text class="payment-password-simple-title-text" @tap="handleClickClose">×</text>
        请输入支付密码
      </view>
      <view class="payment-password-simple-needpwd">使用虚拟资产需输入支付密码</view>
      <view class="payment-password-simple-actualMoney">￥{{moneyYuan}}</view>
      <view class="payment-password-simple-contain">

        <view class='payment-password-simple-contain-keyboard'>
          <!-- 数字键盘 -->
          <view class="payment-password-simple-contain-keyboard-view" v-show="keyType == 'Number'">
            <text class="payment-password-simple-contain-keyboard-view-text">输入密码</text>
            <view class="payment-password-simple-contain-keyboard-view-iptbox">
              <input id="PAYPSW_COMPLEX_SIMPLE_NUM" maxlength="6" type="password" label="支付密码" placeholder="请输入支付密码"
                autocomplete="new-password" class="keyboard payment-password-simple-contain-keyboard-view-ipt"
                data-ktype="Number" style-placeholder="color: #CCCCCC;" />
            </view>
          </view>
          <!-- 复杂键盘 -->
          <view class="payment-password-simple-contain-keyboard-view" v-show="keyType == ''">
            <text class="payment-password-simple-contain-keyboard-view-text">输入密码</text>
            <view class="payment-password-simple-contain-keyboard-view-iptbox">
              <input id="PAYPSW_COMPLEX_SIMPLE" maxlength="12" type="password" label="支付密码" placeholder="请输入支付密码"
                autocomplete="new-password" class="keyboard payment-password-simple-contain-keyboard-view-ipt"
                style-placeholder="color: #CCCCCC;" />
            </view>
          </view>
          <view class="payment-password-simple-contain-code" v-show="needCode">
            <view class="payment-password-simple-contain-code-view">
              <text class="payment-password-simple-contain-code-view-text">验证码</text>
              <input id="codePhone" class="payment-password-simple-contain-code-view-ipt" maxlength="6" type="number"
                style-placeholder="color: #CCCCCC;" @input="codeInputFn" :value="codeValue" />
              <text class="payment-password-simple-contain-code-view-btn" @tap="handleClickGetCode"
                v-show="!countdowning">获取验证码</text>
                <text class="payment-password-simple-contain-code-view-btn" v-show="countdowning">{{countseconds}}s</text>
            </view>
          </view>
          <view class="payment-password-simple-contain-safe" v-if="needCode">{{phoneCodeTips}}</view>
        </view>
        <!-- <view class="payment-password-simple-contain-forget">忘记密码</view> -->
      </view>
      <view class="payment-password-simple-btn">
        <view class="payment-password-simple-btn-button" @tap="handleClickOk">确认</view>
      </view>
    </view>
  </view>
</template>

<script>
  import './paymentPasswordSimple.scss'
  import {
    dsUtils
  } from "../../bussinessUtil/dsUtils";
  export default {
    props: {
      isShow: {
        type: Boolean
      },
      needCode: {
        type: Boolean
      },
      money: {
        type: Number
      },
      keyType: {
        type: String
      }
    },
    data() {
      return {
        taroEnv: process.env.TARO_ENV,
        moneyYuan: '', //父组件传来的金额
        codeValue: '', //验证码
        password: '', //密码
        phoneCodeTips: '为保障您的账户资金安全，需进行短信验证',
        countseconds: 60, // 倒计时默认时间
        countdowning: false, // 计时器开关
        countInteval: undefined, //计时器编号
        phoneLastNum:'', //手机后四位
      }
    },
    watch: {
      isShow() {
        if (this.taroEnv == 'h5' && this.isShow) {
          const getSecurityPad = require('../../utils/h5/keyboard-wrap')
          this.initPad = getSecurityPad
          console.log(this.initPad)
          setTimeout(() => {
            this.initPad.SecurityPad.init('https://wsgw.95598pay-test.com:29943')
          }, 0)
        }
        if(this.taroEnv == 'h5' && !this.isShow){
          //清除定时器
          clearInterval(this.countInteval)
          this.phoneCodeTips = '为保障您的账户资金安全，需进行短信验证'
          this.countseconds = 60
          this.countdowning = false
          //清除密码隐藏键盘
          this.initPad.SecurityPad.clearAll()
          this.initPad.SecurityPad.hideAll()
          this.initPad.SecurityPad.distoryAll()
          //清除验证码和密码
          this.codeValue = ''
          this.password = ''
        }
        //转换金额
        this.moneyYuan = dsUtils.fenToYuan(this.money)
      }
    },
    mounted(){

    },
    methods: {
      handleClickGetCode() { // 获取验证码
        dsUtils.request('osg-p0001/member/p1/f03', {
          params: {
            "DEVICE_NO": "",
            "CRDEXPDT": "",
            "PRE_ORDER_ID": "",
            "CVN2": "",
            "SMSTOKEN": "",
            "USETYP": "99",
            "CRDHOLDERNM": ""
          },
          success: (res) => {
            let phoneNum = res.data.MBL_NO
            let phoneLastNum = '*' + phoneNum.substring(8,11)
            this.phoneLastNum = phoneLastNum
            // 返参 res.data.data.MBL_NO   String 接收短信手机号 发短信的手机号
            dsUtils.toast("短信验证码发送成功，请注意查收");
            this.countDownStart()
          },
          fail:(err)=>{
            console.log(err,'errrrrrrrrrrrrr')
          }
        })
      },
      countDownStart() { // 倒计时开始
        clearInterval(this.countInteval)
        this.countseconds = 60
        this.phoneCodeTips = `验证码已发送至您尾号${this.phoneLastNum}的手机`
        this.countInteval = setInterval(() => {
          this.countdowning = true //计时器开关
          this.countseconds = this.countseconds--

          if (this.countseconds-- <= 0) {
            clearInterval(this.countInteval)
            this.countseconds = 60
            this.phoneCodeTips = '为保障您的账户资金安全，需进行短信验证'
            this.countdowning = false
            this.phoneLastNum = ''

          }
        }, 1000)
      },
      codeInputFn(e) { //验证码输入框
        this.codeValue = e.detail.value
      },
      handleClickClose() {
        this.$emit('handleClickClose')
      },
      handleClickOk() {
        if (this.keyType == ''&& this.initPad.SecurityPad.length('PAYPSW_COMPLEX_SIMPLE') < 8) {
          dsUtils.toast("请输入8-12位数字和字母组合")
          return
        }
        if (this.keyType == 'Number' && this.initPad.SecurityPad.length('PAYPSW_COMPLEX_SIMPLE_NUM') !== 6) {
          dsUtils.toast("请输入6位数字")
          return false
        }
        if (this.needCode && this.codeValue.length !== 6) {
          dsUtils.toast("请输入6位验证码")
          return false
        }
        if (this.keyType == 'Number') {
          this.password = this.initPad.SecurityPad.value('PAYPSW_COMPLEX_SIMPLE_NUM')
        } else {
          this.password = this.initPad.SecurityPad.value('PAYPSW_COMPLEX_SIMPLE')
        }

        let arr = []
        arr.push(this.password)
        this.needCode ? arr.push(this.codeValue) : arr.push('')
        this.$emit('handleClickOk', arr)
      }
    }
  }
</script>

<style scoped>

</style>
