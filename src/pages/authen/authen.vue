<template>
  <view class="authen">
    <TitleBar class="authen_titlebar" :title-bar-obj="titleBarObj" @goBack="goBack" />
    <view class="authen_body">
      <!-- <image class="authen_img" mode="widthFix" src="../../assets/images/ds_topBg.png" /> -->
      <!-- 手机号 -->
      <view class="authen_info">
        <view class="info_tit">手机号码</view>
        <view class="info_con">
          <input class="con_input" maxlength="11" @input="phoneChange" v-model="phone" :controlled="true" type="number" name="phone" placeholder="请输入手机号" placeholder-class="con_input_placeholder" />
        </view>
        <view class="info_line"></view>
      </view>
      <!-- 验证码 -->
      <view class="authen_info">
        <view class="info_tit">验证码</view>
        <view class="info_con gc">
          <input class="con_input" name="code" v-model="code" placeholder="请输入验证码" maxlength="6" type="number" :controlled="true"  @input="codeChangeInput" placeholder-class="con_input_placeholder" slot=""/>
          <view class="con_getcode" v-if="!showTimes" @tap='getCode'>获取验证码</view>
          <view class="con_getcode" style="color:#333333"  v-else>{{times}}s</view>
        </view>
        <view class="info_line"></view>
      </view>
      <!-- 按钮 -->
      <button class="authen_btn" @tap="handleSubmit">授权绑定</button>
      <!-- 协议 -->
      <view class="agreement">
        <view class="agreement_checkBox">
          <image class="checkBox_img" src="../../assets/images/ds_checkedTrue.png"  v-show="isChecked" @tap="changeCheckBox"></image>
          <image class="checkBox_img" src="../../assets/images/ds_checkedFalse.png"  v-show="!isChecked" @tap="changeCheckBox"></image>
        </view>
        <view class="agreement_textBox">
          <text>我已经阅读并同意</text>
          <text style="color:#11A9B0" data-gid='0' @tap="showDocInfo">《用户绑定协议》</text>
          <text style="color:#11A9B0" data-gid='1' @tap="showDocInfo"> 《隐私声明》</text>
          <text>。若您的手机号未注册，将为您自动注册。</text>
        </view>
      </view>
    </view>
    <view class="authen_footer">
      <image class="footer_img" mode="widthFix" src="../../assets/images/ds_footer.png" />
    </view>
    <Modal :modalValue="modalValue" :showComponents="showComponents" @cancel="cancel" />
  </view>
</template>

<script>
import './authen.scss'
import Taro from "@tarojs/taro";
import AOP from '../../utils/wsgwH5Sdk/wsgwH5Sdk'
import TitleBar from "@/components/titleBar/titleBar";
import { util } from '../../utils/util'
import Modal from "@/components/modal/modal";

export default {
  data () {
    return {
      titleBarObj: {
        title: "用户授权",
        // tokenBol: false,
        isNoShowArrow: false,
        isOpenBgBlue: '#11A9B0', //默认false透明色 true蓝色  '#FFFFFF'指定色
        arrowWhite: true,//文字颜色 true白 false黑
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
      arrowImgUrl:require("../../assets/images/ds_right_arrow.png"),
      showTimes: false,
      times: 60,
      phone: '',
      code: '',
      codeKey: '',
      isAgreeMentKey: '', // 短信开关接口返回值,用于注册接口的入参
      taroEnv:process.env.TARO_ENV,
      showComponents: false,
      isChecked: false, // 默认不勾选协议
      isDisabled: false,//防抖
      timer: null,
      onLogin: false,//登录成功了吗
    }
  },
  components:{
    TitleBar,
    Modal
  },
  computed:{

  },
  created(){
    util.dataCollection({
      "ACTTYPE": '0204',
      "SERVICEID": 'W20211008010101',
      "PAGENAME": '交费小程序：用户绑定页',
      "CHANNEL": Taro.getStorageSync('AOP_CHANNEL_CODE'),
    })
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
  beforeDestroy(){
    let __this = this
    clearInterval(__this.timer)
    if(!__this.onLogin) {
      console.log('authen页--用户未进行登录操作')
      AOP.onfire.fire("onLogin",null)
    } else {
      console.log('authen页--用户进行了登录操作')
    }
    
  },
  methods:{
    cancel() {
      let that = this
      that.showComponents = false;
      AOP.chooseAddressInfo({ "Hierarchy": '3', "obtainHierarchy": '2' }).then((res) => {
        Taro.setStorageSync('AOP_CITY_DATA', res)
      })
    },
    // 切换协议
    changeCheckBox(e) {
      this.isChecked = !this.isChecked;
    },
    // 返回上一页
    goBack() {
      Taro.navigateBack({
        delta: 1,
      });
    },

    /**
    *  获取验证码方法
    */
    getCode() {
      if(this.isDisabled==false){
        this.isDisabled = true
        // 手机号正则
        const verificationPhone =/^1\d{10}$/
        if (!verificationPhone.test(this.phone)) {
          Taro.showToast({
            title: '请您输入正确的手机号',
            icon: 'none'
          })
          this.isDisabled = false
        } else {
          Taro.showLoading({
            title: '加载中',
            mask: true
          })
          let __this = this
          Promise.all([
            AOP.httpApi({ //短信授权
              isInner: true,
              url: '/osg-open-uc0001/outer/c03/empowermentRegister',
              data: {
                "uscInfo": {
                  "member": AOP.getUserInfo().channelCode,
                  "tenant": "state_grid"
                },
                "quInfo": {
                  "isAgreeMent": "1",
                  "mobile": __this.phone,
                }
              },
            }),AOP.httpApi({ // 发短信
                isInner: true,
                url: '/osg-open-uc0001/outer/c03/sendVerifyCode',
                data: {
                  "uscInfo":{
                    "member": AOP.getUserInfo().channelCode,
                    "tenant": "state_grid"
                  },
                  "quInfo":{
                    "isAgreeMentKey": "",
                    "thirdPartnerId": AOP.getUserInfo().openId,
                    "thirdUnionId": AOP.getUserInfo().openId,
                    "accountType": AOP.accountType,
                    "businessType":"thirdbind",
                    "sendType":"0", //短信
                    "account": __this.phone,
                  }
                },
            }),
          ]).then((val)=>{
            this.isDisabled = false
            Taro.hideLoading() // 关闭loading
            if(val[0].srvrt && val[0].srvrt.resultCode == "0000" && val[1].srvrt && val[1].srvrt.resultCode == "0000") { //短信授权和发送短信都成功
              __this.isAgreeMentKey = val[0].bizrt.isAgreeMentKey
              __this.codeKey = val[1].bizrt.codeKey
              __this.showTimes = true
              __this.times = 59
              __this.timer = setInterval(() => {
                if (__this.times === 0 || __this.times === 60) {
                  clearInterval(__this.timer)
                  __this.showTimes =  false
                  __this.times = 60
                }
                __this.times = __this.times - 1
              }, 1000)
            } else {
              Taro.showToast({
                title: (val[1].srvrt && val[1].srvrt.resultCode != "0000") ? val[1].srvrt.resultMessage : "短信验证码获取失败",
                icon: 'none',
              })
            }
          }).catch((err)=>{
            this.isDisabled = false
            Taro.hideLoading() // 关闭loading
          }).catch((err)=>{
            console.log(err)
            this.isDisabled = false
            Taro.hideLoading() // 关闭loading
          })
        }
      }
    },
    /**
    *  点击注册 1、获取三方agreeKey 2.走三方注册接口 3. 自动免密登录
    */
    handleSubmit() {
      if (!this.isChecked) {
        return Taro.showToast({
          title: '请先阅读并同意用户绑定协议和隐私声明',
          icon: 'none',
        })
      }
      if (this.codeKey == '') {
        return Taro.showToast({
          title: '请先获取验证码',
          icon: 'none',
        })
      }
      if (this.code == '') {
        return Taro.showToast({
          title: '请先输入验证码',
          icon: 'none',
        })
      }
      if(this.isDisabled==false){
        this.isDisabled = true
        this.handleRegSub()
      }
      util.dataCollection({
        "ACTTYPE": '0301',
        "SERVICEID": 'W20211008010102',
        "PAGENAME": '交费小程序-用户绑定：点击授权绑定',
        "CHANNEL": Taro.getStorageSync('AOP_CHANNEL_CODE'),
      })
    },
    /**
    *  三方注册接口集成
    */
    handleRegSub() {
      Taro.showLoading({title: '加载中',mask: true})
      let __this = this
      AOP.httpApi({ //使用验证码注册
        isInner: true,
        url: '/osg-open-uc0001/outer/c03/wechatRegister',
        data: {
          "uscInfo":{
            "member": AOP.getUserInfo().channelCode,
            "tenant": "state_grid"
          },
          "quInfo":{
            "code": __this.code, //短信验证码
            "codeKey": __this.codeKey,
            "isAgreeMentKey": __this.isAgreeMentKey,
            "appCode": AOP.getUserInfo().channelCode,
            "mobile": __this.phone,
            "proNo": '00000',
            "thirdUnionId": AOP.getUserInfo().openId,
            "addressProvince": Taro.getStorageSync('AOP_CITY_DATA').provinceCode6 ? Taro.getStorageSync('AOP_CITY_DATA').provinceCode6 : '',
            "accountType": AOP.accountType,
            "addressRegion": Taro.getStorageSync('AOP_CITY_DATA').countyCode ? Taro.getStorageSync('AOP_CITY_DATA').countyCode : '', //省侧
            "addressCity": Taro.getStorageSync('AOP_CITY_DATA').cityCode ? Taro.getStorageSync('AOP_CITY_DATA').cityCode : '',//省侧
            "clientId": AOP.envConfig.client_id,
            "thirdPartnerId": AOP.getUserInfo().openId,
            "thirdUnionId": AOP.getUserInfo().openId,
            "provinceNum": "", //省侧供电单位编码
            "randomCode": "", //省侧的通行令牌
          }
        },
      }).then((res) => {
        __this.isDisabled = false
        Taro.hideLoading()
        if (res && res.srvrt && res.srvrt.resultCode == "0000") { //注册成功 // 返参能直接拿到token
          __this.onLogin = true
          AOP.onfire.fire("onLogin",{
            token: res.bizrt.token,
            delta: AOP.allLoginWay[process.env.TARO_ENV].quickLogin ? 2 : 1
          })
        } else{
          Taro.showToast({
            title: res.srvrt.resultMessage || "注册失败",
            icon: 'none',
          })
        }
      }).catch((err)=>{
        __this.isDisabled = false
        Taro.hideLoading()
      })
    },

    // 手机号输入事件
    phoneChange(e) {
      const value = e.detail.value
      const rule = /^[+]{0,1}(\d+)$/
      if (!rule.test(value)) {
        this.phone = "";
      } else if (value.length > 11) {
        this.phone =  value.slice(0, 11);
      } else {
        this.phone = value;
      }
    },
    codeChange() {
      this.handleChangeSubmitBtn()
    },
    codeChangeInput(e){
      this.code = e.detail.value;
    },
    forbidDecryTel() { // 支付宝原生 // 获取手机号密文失败的回调(用户点击拒绝或系统异常)

    },
    // 跳转协议方法
    showDocInfo(e) {
      if(this.isDisabled==false){
        this.isDisabled = true
        const eIndex = e.currentTarget.dataset.gid
        Taro.navigateTo({
          url: '/pages/docInfo/docInfo?index=' + eIndex
        })
        this.isDisabled = false
      }
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
