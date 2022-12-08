<template>
  <view class="root" v-show="isShow">
    <view class="header" :style="{'padding-top': statusBarHeight + 'px', 'height': titleBarHeight + 'px' }">
      <view class="title">网上国网</view>

      <view v-if="out_province_name" v-tap="getAddress" class="address-box">
        <view class="spot">·</view>
        <view class="address">{{out_province_name}}</view>
        <view class="InvertedTriangle"></view>
      </view>
    </view>
    <image class="ds_guide_headerBg" src="../../assets/images/ds_bill_topBg.png"/>
    <view class="location">
      <view class="center">
          <view v-show="isLogin" class="userInfo" @tap="setting">
              <image class="ds_guide_noHeadP" src="../../assets/images/ds_guide_headP.png"></image>
              <view class="greetings">您好，欢迎使用网上国网</view>
              <image class="ds_guide_set" src="../../assets/images/ds_guide_set.png"></image>
          </view>
          <view v-show="!isLogin" class="userInfo">
              <image @tap="login" class="ds_guide_noHeadP" src="../../assets/images/ds_guide_noHeadP.png"></image>
              <view @tap="login" class="greetings">
                  <view class="login_btn">点击登录</view>
                  <view class="login_tips">登录后可查看个人信息</view>
              </view>
          </view>
          <view class="func">
              <view class="func_con">
                  <view class="func_con_item" v-tap="_goPay">
                      <image class="func_con_item_img" src="../../assets/images/ds_guide_anyTimePay.png"></image>
                      <text class="func_con_item_text">随时可交</text>
                  </view>
                  <view class="line">. . . . . . .</view>
                  <view class="func_con_item" v-tap="goRecord">
                      <image class="func_con_item_img" src="../../assets/images/ds_guide_timelyArrival.png"></image>
                      <text class="func_con_item_text">及时到账</text>
                  </view>
                  <view class="line">. . . . . . .</view>
                  <view class="func_con_item" v-tap="goBill">
                      <image class="func_con_item_img" src="../../assets/images/ds_guide_billQuery.png"></image>
                      <text class="func_con_item_text">账单查询</text>
                  </view>
              </view>
          </view>
          <view class="immediatelyPay" v-tap="goPay">
              <image class="ds_guide_immediatelyPay" src="../../assets/images/ds_guide_immediatelyQuery.png"></image>
              <view class="immediatelyPay_btn">立即交费</view>
          </view>
          <view class="immediatelyPay" v-tap="goBill_banner">
              <image class="ds_guide_immediatelyPay" src="../../assets/images/ds_guide_immediatelyPay.png"></image>
              <view class="immediatelyQuery_btn">立即查询</view>
          </view>
      </view>
      <view class="footer">
          <image class="ds_guide_hotLine" src="../../assets/images/ds_guide_hotLine.png"></image>
          <view class="hotLineNum">24小时供电服务热线 95598</view>
      </view>
      <button v-if="swanLoginBtnIsShow" class="swan-login" hover-class="none" contact open-type="login" @login="loginBaiDu"></button>
    </view>
    <view class="agmtMask" v-show="isAgreement">
      <view class="agmtContentBox">
        <view class="agmtTitle">协议与隐私</view>
        <view class="agmtText">感谢您使用网上国网，根据最新法律要求，使用我们的产品前，请先仔细阅读并同意《用户绑定协议》与《隐私声明》，感谢您的使用。</view>
        <view class="agmtChecked">
          <view class="agreementBD">
            <image class="agreementBDTrue" src="../../assets/images/ds_checkedTrue.png"  v-show="isChecked" @tap="changeCheckBox"></image>
            <view class="agreementBDFalse" v-show="!isChecked" @tap="changeCheckBox"></view>
          </view>
          <view>
            <text>阅读并同意</text>
            <text style="color:#0c82f1" data-gid='0' @tap="showDocInfo">《用户绑定协议》</text>
            <text style="color:#0c82f1" data-gid='1' @tap="showDocInfo">《隐私声明》</text>
          </view>
        </view>
        <view class="agmtBtn">
          <view class="agmtBtnLeft" @tap="agmtBtnLeft">取消</view>
          <view class="agmtBtnRight" @tap="agmtBtnRight">同意并继续</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import "./index.scss";
import Taro from "@tarojs/taro";
import { dsUtils } from "@/dsUtils";
import TitleBar from "@/components/titleBar/titleBar";

export default {
  components: {
    TitleBar
  },
  data() {
    return {
      isShow: false,
      out_province_code: '', // 省码
      out_province_name: '请选择地区', // 省份名称
      isLogin: false, // 是否登陆
      titleBarHeight: '',
      statusBarHeight: '',
      swanLoginBtnIsShow: false, //百度小程序遮罩按钮是否显示 (用于登录百度app)
      isChecked: false, // 默认不勾选协议
      isDisabled: false,//防抖
      isAgreement: true, // 协议遮罩默认显示
    };
  },
  created() {
//todo 业务初始化的时候判断是否有token，如果有token正常做业务，无token，在初始化页做监听事件，当token获取到之后，通知监听方法，继续执行onload或者onshow（created）
    Taro.getSystemInfo({}).then(res => {
      console.log(res,'getSystemInfo')
      this.statusBarHeight = res.statusBarHeight;
      this.titleBarHeight = res.titleBarHeight;
    });
		this.taroEnv = process.env.TARO_ENV;
    if(this.taroEnv == 'h5') {//如果是H5页面(app内部或者pc上web),不显示首页面内容
      this.isShow = false;
    } else {//支付宝、微信小程序,显示首页面
      this.isShow = true;
      return false;
    }
    if (dsUtils.bridge_WSGWBridge()) {//H5交互桥，直接跳转电费列表页面
      dsUtils.bridge_init(res => {
        console.log(res,'bridge_init返参');
        dsUtils.navigateTo({
          url: "/packageDSEleCharge/pages/eleList/eleList",
          flag: "redirectTo"
        });
      });
      
    } else {//pc端测试使用,后续改造为普通登录页面使用
      var params = {
        uscInfo: {
          devciceId: "861761033034989",
          member: "2202",
          tenant: "state_grid",
          deviceIp: "211.160.250.38"
        },
        quInfo: {
          password: "18e0e5f3389efa0b31738c2fd44630d8",
          account: "13323497937",
          addressCity: 110100,
          optSys: "ios",
          addressRegion: 110101,
          addressProvince: 110100,
          pushId: "1a0018970ab49abf389"
        }
      }
      dsUtils.requestToken("osg-uc0012/member/c2/f01", {
        params: params,
        header: {
          wsgwType: "ios",
          Authorization: "QWERTYDF1BCDADDD6E422A8C0159CB09F4C2C4",//调用北京业务验证环境测试用
          // Authorization: "QWERTYUIOPLKJHGFDSAZXCVBNM0987654321202020200520",//调用北京生产环境测试用
          secureToken: 'zhongtai',
          version: '6.2.3',
          "content-type": "application/json" // 默认值
        },
        success: res => {
          dsUtils.setStorageSync("DS_TOKEN", res.data.data.bizrt.token);
          dsUtils.navigateTo({
            url: "/packageDSEleCharge/pages/eleList/eleList",
            flag: "redirectTo"
          });
        }
      });
    }
    dsUtils.dataCollection({
      "ACTTYPE": '0204',
      "SERVICEID": 'W2021100801',
      "PAGENAME": '交费小程序：首页',
      "CHANNEL": dsUtils.getUserInfo().channelCode,
    })
  },
  onLoad(option) {
    let that = this;
    console.log('index-----option',option)
    console.log('index-----getStorageSync.DS_orderId',dsUtils.getStorageSync("DS_orderId"))
    if(dsUtils.getStorageSync("jdmporderid")) {
      return dsUtils.loginDispatcher().then((res)=>{
        dsUtils.setStorageSync("DS_isJdChannel", true);
        dsUtils.navigateTo({
          url: "/packageDSRecord/pages/detail/detail"
        });
      })
    }
    if(option?.jdmporderid) {
      dsUtils.loginDispatcher().then((res)=>{
        dsUtils.setStorageSync("DS_orderId", option.jdmporderid);
        dsUtils.setStorageSync("DS_isJdChannel", true);
        dsUtils.navigateTo({
          url: "/packageDSRecord/pages/detail/detail"
        });
      })
    } else if(option?.jumpTo == 'eleList') {
      dsUtils.loginDispatcher().then((res)=>{
        dsUtils.navigateTo({
          url: "/packageDSEleCharge/pages/eleList/eleList"
        });
      })
    } else if(option?.jumpTo == 'billList') {
      dsUtils.loginDispatcher().then((res)=>{
        that.jumpToBillList();
      })
    }
  },
  onShow() {
    console.log('-------onShow---index')
    if(dsUtils.getStorageSync("NOREMOVE_ISAGMT")) {
      this.isAgreement = false;
    }
    dsUtils.removeAllDSStorageSync()
    if(this.taroEnv == 'h5') {return}
    if (process.env.TARO_ENV == 'swan' && this.swanLoginBtnIsShow) {
      dsUtils.initSDK()
    }
    let that = this;
    dsUtils.loginStatusListener().then((res)=>{
      console.log('接收登录状态')
      that.isLogin = dsUtils.getUserInfo().token ? true : false
      console.log(that.isLogin,'---that.isLogin---')
      if (process.env.TARO_ENV == 'swan') {
        that.swanLoginBtnIsShow = res && res.swanNeedLogin ? res.swanNeedLogin : false
      }
    })
    that.isLogin = dsUtils.getUserInfo().token ? true : false //注销后改变状态
    console.log(that.isLogin,'---that.isLogin2---')
    let cityData = Taro.getStorageSync('AOP_CITY_DATA')
    if (cityData) { // 有缓存用缓存中的位置
       that.out_province_code = cityData.provinceCode,
        that.out_province_name = cityData.provinceName
    } else { // 无缓存用定位    
       dsUtils.getLocation().then((res)=> {
        if(res.provinceName && res.provinceCode5) {
          that.out_province_code = res.provinceCode5,
          that.out_province_name = res.provinceName
          Taro.setStorageSync('AOP_CITY_DATA',res)
        }
      })
    }
  },
  beforeDestroy(){
    console.log('页面销毁')
  },
  methods: {
    agmtBtnLeft() {
      // Taro.exitMiniProgram()
      if(this.taroEnv == 'swan') {
        return dsUtils.toast('很遗憾我们无法提供自动关闭，请您手动关闭退出小程序')
      } else if (this.taroEnv == 'jd') {
        return dsUtils.toast('很遗憾我们无法提供自动关闭，请您手动关闭退出小程序')
      } else if (this.taroEnv == 'alipay') {
        my.exitMiniProgram()
      } else if (this.taroEnv == 'weapp') {
        wx.exitMiniProgram()
      }
    },
    agmtBtnRight() {
      if(this.isChecked) {
        this.isAgreement = false;
        dsUtils.setStorageSync("NOREMOVE_ISAGMT",true)
      } else {
        dsUtils.toast('请先阅读并同意协议')
      }
    },
    // 切换协议
    changeCheckBox(e) {
      this.isChecked = !this.isChecked;
    },
    // 跳转协议方法
    showDocInfo(e) {
      if(this.isDisabled==false){
        this.isDisabled = true
        const eIndex = e.currentTarget.dataset.gid
        dsUtils.navigateTo({
          url: '/pages/docInfo/docInfo?index=' + eIndex
        })
        this.isDisabled = false
      }
    },
    loginBaiDu(e) { //登录百度APP
    //   console.log('登录信息:', e);
    //   if (e.detail.errCode === '10004' || e.detail.errCode === '904') {
    //       swan.showToast({
    //           title: '用户未登录',
    //           icon: 'none'
    //       });
    //       return;
    //   }
    //   swan.showToast({
    //       title: '用户登录成功',
    //       icon: 'none'
    //   });
    },
    // 更改地址
    getAddress() {
      dsUtils.chooseAddressInfo({"Hierarchy": '3',"obtainHierarchy": '2'}).then((res)=>{
        Taro.setStorageSync('AOP_CITY_DATA',res)
      })
      dsUtils.dataCollection({
        "ACTTYPE": '0301',
        "SERVICEID": 'W202110080105',
        "PAGENAME": '交费小程序：点击左上角定位',
        "CHANNEL": dsUtils.getUserInfo().channelCode,
      })
    },

    // 跳转电费账单页面
    goBill() {
      let that = this;
      dsUtils.loginDispatcher().then((res)=>{
        that.jumpToBillList();
      })
      dsUtils.dataCollection({
        "ACTTYPE": '0301',
        "SERVICEID": 'W202110080106',
        "PAGENAME": '交费小程序：点击账单查询',
        "CHANNEL": dsUtils.getUserInfo().channelCode,
      })
    },

    goBill_banner() {
      let that = this;
      dsUtils.loginDispatcher().then((res)=>{
        that.jumpToBillList();
      })
      dsUtils.dataCollection({
        "ACTTYPE": '0301',
        "SERVICEID": 'W202110080107',
        "PAGENAME": '交费小程序：点击电费账单banner',
        "CHANNEL": dsUtils.getUserInfo().channelCode,
      })
    },

    jumpToBillList() {
      let params = {
        "uscInfo": {
          "tenant": "state_grid",
          "member": dsUtils.getUserInfo().channelCode,
          "devciceId": "",
          "devciceIp": ""
        },
        "quInfo": {
          "token": dsUtils.getUserInfo().token
        },
      };
      dsUtils.request('osg-open-uc0001/member/arg/010360004', {
        params,
        paramsFlag: "2",
        code:'1',
        isForbidDoubleClick: true,
        success (response) {
          dsUtils.setStorageSync("DS_billList", response.bizrt.powerUserList);
          dsUtils.navigateTo({
            url: "/packageDSBill/pages/billList/billList"
          });
        },
        fail:(err)=>{
          console.log(err)
        }
      });
    },

    // 跳转解绑页面
    setting() {
      dsUtils.navigateTo({
        url: "/pages/editPhone/editPhone"
      })
    },
    
    // 跳转电费列表页面
    _goPay() {
      dsUtils.loginDispatcher().then((res)=>{
        dsUtils.navigateTo({
          url: "/packageDSEleCharge/pages/eleList/eleList"
        });
      })
      dsUtils.dataCollection({
        "ACTTYPE": '0301',
        "SERVICEID": 'W202110080102',
        "PAGENAME": '交费小程序：点击随时可缴',
        "CHANNEL": dsUtils.getUserInfo().channelCode,
      })
    },
    
    // 跳转电费列表页面
    goPay() {
      dsUtils.loginDispatcher().then((res)=>{
        console.log('跳转列表')
        dsUtils.navigateTo({
          url: "/packageDSEleCharge/pages/eleList/eleList"
        });
      })
      dsUtils.dataCollection({
        "ACTTYPE": '0301',
        "SERVICEID": 'W202110080104',
        "PAGENAME": '交费小程序：点击交电费banner',
        "CHANNEL": dsUtils.getUserInfo().channelCode,
      })
    },
    
    // 跳转交费记录页面
    goRecord() {
      dsUtils.loginDispatcher().then((res)=>{
        dsUtils.navigateTo({
          url: "/packageDSRecord/pages/index/index"
        });
      })
      dsUtils.dataCollection({
        "ACTTYPE": '0301',
        "SERVICEID": 'W202110080103',
        "PAGENAME": '交费小程序：点击及时到账',
        "CHANNEL": dsUtils.getUserInfo().channelCode,
      })
    },

    // 登录
    login() {
      dsUtils.loginDispatcher()
      dsUtils.dataCollection({
        "ACTTYPE": '0301',
        "SERVICEID": 'W202110080101',
        "PAGENAME": '交费小程序：点击登录',
        "CHANNEL": dsUtils.getUserInfo().channelCode,
      })
    }
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
