<template>
  <view class="confirmpay">
    <TitleBar v-if="careEnv == '1'" :title-bar-obj="titleBarObj" @goBack="goBack" style="background-color:white" />
    <TitleBar v-else :title-bar-obj="titleBarObj" @goBack="goBack"  />
    <view class="confirmpay_body">
      <view class="confirmpay_body_info">
        <view class="confirmpay_body_info_view">收款方<text class="confirmpay_body_info_view_text">{{MERCHANT_NAME}}</text></view>
        <view class="confirmpay_body_info_view">支付金额<text
            class="confirmpay_body_info_view_text">￥{{sendPayMoney}}</text>
        </view>
      </view>
      <view class="confirmpay_body_payment">
        <view class="payTitle">支付方式</view>
        <radio-group  @change="onChange">
            <view class="payLableBoxView" v-for="item in list" :key="item.value">
              <view class="payLableBoxViewLeft">
                <view class="leftBox">
                  <image class="leftImage" alt="" :src="item.paySrc"></image>
                  <view class="leftContent">
                    <text class="payName">{{item.payName}}支付</text>
                    <text class="payText">推荐{{item.payName}}用户使用</text>
                    <text class="payLableDown" v-show="item.down && item.down.length" v-for="(down, index) in item.down" :key="index" @tap="toWebView(down)">{{down.label}}</text>
                  </view>
                </view>
                <view class="rightBox">
                  <view class="payLableBoxViewRight" v-if="item.right" @tap="toWebView(item.right)">{{item.right.label}}</view>
                </view>
              </view>
              <view class="payRadio">
                <label>
                  <radio :value="item.value" :checked="item.checked" color="#11A9B0"></radio>
                </label>
              </view>
            </view>
        </radio-group>
      </view>
      <view class="payTips">以上支付服务由电e宝平台提供</view>
    </view>
    <view class="payFooter">
      <view class="payFooterBtn" @tap="confirmPay">确认支付</view>
    </view>
    <Modal :modalValue="modalValue" :showComponents="showComponents" @cancel="cancel" @confirm="confirm"/>
  </view>
</template>

<script>
  import './confirmpay.scss'
  import { dsUtils } from '../../../bussinessUtil/dsUtils.js'
  import TitleBar from "@/components/titleBar/titleBar"
  import Modal from "@/components/modal/modal"
  import Vue from "vue";

  export default {
    components: { TitleBar, Modal },
    data() {
      return {
        titleBarObj: {
        	title: "确认支付",
        	arrowWhite: true, //箭头默认false为黑色，ture为白色
          isOpenBgBlue: '#11A9B0', // true 背景蓝。 false 默认色。
        },
			  showComponents: false, // 是否显示弹框
        modalValue: {
          modalTitle: '是否退出支付',//弹窗标题
          modalContent: [
            {
              content: '您的订单将被取消，请确认'
            }
          ],//弹窗内容
          modalBtn: ['取消', '确认'], //弹窗按钮(一个按钮或两个按钮，默认两个)
          cancelColor: '', // 左按钮颜色
          confirmColor: '', // 右按钮颜色
          isContent: true, // 文字是否居中
        },
        modalType: '', // 区分模态框 exitPay/isPay
        ORDER_ID: '', // 42的 电e宝 支付订单号
        SALE_PAY_ID: '', // 98的 业务 销售订单号 
        MERCHANT_NAME: '', //商户名称
        sendPayMoney: '', //支付金额
        cancelTips: '', //返回键弹窗的内容
        STOP_WATCH: '',
        list: [], //支付方式列表
        payWay: '',
        env: '', //环境标识
        careEnv: '',
        lableData: {}, // 标签对象
      }
    },
    onLoad(options) {
      if(options){
        this.ORDER_ID = options.ORDER_ID ? options.ORDER_ID : '' 
        this.SALE_PAY_ID = options.SALE_PAY_ID ?  options.SALE_PAY_ID : '' 
        this.MERCHANT_NAME = options.MERCHANT_NAME ? options.MERCHANT_NAME : '国家电网公司'
        this.sendPayMoney = dsUtils.fenToYuan(options.sendPayMoney)
        // this.CANCEL_TIPS = options.CANCEL_TIPS ?  options.CANCEL_TIPS : ''
      }
      this.env = process.env.TARO_ENV
      this.careEnv = dsUtils.careEnv
      // confirmpay.vue页面仅在小程序环境下使用, 所以【支付方式列表】第一个默认为当前环境的支付方式
      if(this.env == 'alipay' || this.env == 'swan'){
        this.list.unshift({
          value: 'alipay', 
          checked: false,
          payName: '支付宝', //用于在页面展示支付方式对应名称
          paySrc: require('../../images/ds_htjc_zfb.png'), //用于在页面展示支付方式对应图标
        })
      }
      if (this.env == 'weapp' || this.env == 'swan' || this.env == 'jd') {
        this.list.unshift({
          value: 'weapp', 
          checked: false,
          payName: '微信',
          paySrc: require('../../images/ds_wechat_icon.png'),
        })
      }
      this.list[0].checked = true
      this.payWay = this.list[0].value //用户选择的支付方式
      
      dsUtils.dataCollection({
        "ACTTYPE": '0204',
        "SERVICEID": 'W2021000501',
        "PAGENAME": '交费小程序：支付方式选择页',
        "CHANNEL": dsUtils.getUserInfo().channelCode,
      })
      let that = this;
      dsUtils.request('osg-p0001/member/p2/f01', {
        params: {
          serialNo: that.SALE_PAY_ID
        },
        success: response => {
          let list = that.list.map((item,index)=> {
            if(item.value == 'weapp') {
              return Object.assign(item,response.data.WX_FLAG)
            } else if (item.value == 'alipay') {
              return Object.assign(item,response.data.ZFB_FLAG)
            }
          })
          Vue.nextTick(()=> {
            that.list = list;
          })
        }
      })
    },
    onShow() {

    },
    methods: {
      showThirdPayModal() {
        this.showComponents = true;
        this.modalType = 'isPay';
        this.modalValue = {
					modalTitle: '是否支付完成？',
					modalContent: [
						{
							content: '请确认您已在支付页面完成付款',
						}
					],//弹窗内容
					modalBtn: ['未完成', '已完成'],
					cancelColor: '#666666',
					confirmColor: '#11A9B0',
          isContent: true, // 文字是否居中
				}
      },
      payStatus(buttonType) {
        let that = this;
        dsUtils.request('osg-p0001/member/p1/f26', {
          params: {
            PAYORDERID: that.ORDER_ID
          },
          success: response => {
            that.ORDERSTATUS = response.data.ORDERSTATUS;
            if((that.env == 'jd' || that.env == 'swan') && response.data.ORDERSTATUS == '01') {
              if(buttonType == 'confirm') {
                return dsUtils.toast('订单尚未完成支付，您可继续进行支付操作')
              }
              return false;
            }
            let resultData = {
              ORDERSTATUS: response.data.ORDERSTATUS, //订单状态 01：未处理  02：成功 03：失败 04：未名 05：处理中 99：订单关闭
              SALE_PAY_ID: that.SALE_PAY_ID, //订单id
              ERRORMESSAGE: response.data.ERRORMESSAGE, //订单错误原因
            }
            dsUtils.setStorageSync('DS_resultData', resultData);
            dsUtils.navigateTo({
              url: '/packageDSPay/pages/payresult/payresult'
            })
          },
          fail: (err)=> {
            console.log('err',err)
          }
        })
      },
      toWebView(params) {
        if(params.stopWatch) {
          dsUtils.navigateTo({
            url: `/packageDSEleCharge/pages/webView/webView?url=${params.skipUrl}`
          })
        }
      },
      // 弹框左按钮
      cancel() {
        if(this.modalType == 'exitPay') {
          this.exitPayment()
        } else if (this.modalType == 'isPay') {
          this.payStatus('cancel')
        }
        this.showComponents = false;
      },
      // 弹框右按钮
      confirm() {
        if(this.modalType == 'isPay') {
          this.payStatus('confirm')
        }
        this.showComponents = false;
      },
      goBack() { // 左上角返回
        if(this.env == 'alipay' || this.env == 'swan') {
          return
        }
        this.showComponents = true;
        this.modalType = 'exitPay';
        this.modalValue = {
					modalTitle: '是否退出支付？',
					modalContent: [
						{
							content: '您的订单将被取消，请确认',
						}
					],//弹窗内容
					modalBtn: ['退出支付', '继续支付'],
					cancelColor: '#666666',
					confirmColor: '#11A9B0',
          isContent: true, // 文字是否居中
				}
      },
      onChange(e) { //切换支付方式
        console.log(e.detail.value,'选择的支付方式是') // 对应list中每个对象的value    // 注意list里的对象 只能有一个checked为true的
        this.payWay = e.detail.value
      },

      confirmPay(e) { // 点击确认支付
        if (this.payWay == 'alipay') { //当前选择的支付方式为支付宝
          let ZFB_TYPE = {
            'alipay':  "APPLET",
            'swan': "APP",
          }
          let SUB_BUS_TYPE = {
            'alipay': "",
            'swan': "BIDU",
          }
          dsUtils.request('osg-p0001/member/p1/f10', {
            params: {
              PRE_ORDER_ID: this.ORDER_ID,                 // 预支付订单编号
              ZFB_TYPE: ZFB_TYPE[process.env.TARO_ENV],                            // 支付类型  SDK :APP支付 APPLET :小程序支付
              ZFB_USER_ID: dsUtils.getUserInfo().openId,              // 授权编码 支付方式APPLET时必填
              SUB_BUS_TYPE: SUB_BUS_TYPE[process.env.TARO_ENV],
            },
            isForbidDoubleClick: true,
            success: response => {
              console.log(response,'response===zfb')
              this.tradePayZfb(response.data.PAY_PARAM)
            }
          })
        } else if (this.payWay == 'weapp') { //当前选择的支付方式为微信
          let __this = this
          let CHANNEL_ID = {
            'weapp': "WX_JSAPI", //微信小程序
            'jd': "WX_MWEB", //京东小程序
            'swan': "WX_MWEB", //百度小程序
          }
          let SUB_BUS_TYPE = {
            'swan': "BIDU", //百度小程序
            'jd': "JD", //京东小程
          }
          dsUtils.request('osg-p0001/member/p1/f09', {
            params: {
              PRE_ORDER_ID: this.ORDER_ID,
              OPENID: dsUtils.getUserInfo().openId,
              CHANNEL_ID: CHANNEL_ID[process.env.TARO_ENV],
              SUB_BUS_TYPE: SUB_BUS_TYPE[process.env.TARO_ENV]
            },
            isForbidDoubleClick: true,
            success (res) {
              if(res && res.data && res.data.PAY_PARAM){
                __this.tradePayWx(res.data.PAY_PARAM) //唤起微信支付收银台
              } 

            },
            fail(err){
              console.log(err)
            }
          })
        }
        dsUtils.dataCollection({
          "ACTTYPE": '0301',
          "SERVICEID": 'W202100050101',
          "PAGENAME": '交费小程序-支付方式选择页：点击“确认支付”',
          "CHANNEL": dsUtils.getUserInfo().channelCode,
        })
      },

      tradePayZfb(PAY_PARAM) { // 唤起支付宝收银台，引导用户完成支付
        let that = this;
        dsUtils.tradePay({tradeNo:PAY_PARAM}, res => {
          console.log('zfb支付res',res)
          if(that.env == 'alipay') {
            if (res && res.resultCode == '9000') {
              dsUtils.request('osg-p0001/member/p1/f13', {
                params: {
                  ZFB_RT_DATA: res
                },
                success: response => {
                  let resultData = {
                    ORDERSTATUS: response.data.ORDERSTATUS || '', //订单状态 01：未处理  02：成功 03：失败 04：未名 05：处理中 99：订单关闭
                    SALE_PAY_ID: that.SALE_PAY_ID, //订单id
                    ERRORMESSAGE: response.data.ERRORMESSAGE, //订单错误原因
                  }
                  dsUtils.setStorageSync('DS_resultData', resultData);
                  dsUtils.navigateTo({
                    url: '/packageDSPay/pages/payresult/payresult'
                  })
                }
              })
            } else {
              dsUtils.toast(res.memo) // 支付未完成 或者 用户中途取消
            }
          }
        },(err)=>{
          console.log('zfb支付err',err)
        })
        if (that.env == 'swan') {
          that.showThirdPayModal()
        }
      },
      
      tradePayWx(PAY_PARAM){ // 唤起微信收银台，引导用户完成支付
        let __this = this
        let pData = {
          PAYORDERID:__this.ORDER_ID,
          tradeNo: PAY_PARAM
        }
        dsUtils.tradePay(pData, (res)=>{
          console.log('wx支付res',res)
          if(this.env == 'jd' || this.env == 'swan') {
            __this.showThirdPayModal()
          } else if (this.env == 'weapp') {
            let resultData = {
              ORDERSTATUS: '02', //订单状态 01：未处理  02：成功 03：失败 04：未名 05：处理中 99：订单关闭
              SALE_PAY_ID: __this.SALE_PAY_ID, //订单id
            }
            dsUtils.setStorageSync('DS_resultData', resultData);
            dsUtils.navigateTo({
              url: '/packageDSPay/pages/payresult/payresult'
            })
          }
        },(err)=>{
          console.log('wx支付err',err)
        })
      },
      exitPayment(e) { // 退出支付
        dsUtils.request('osg-p0002/member/c9/f04', { //退出支付,调用取消订单接口
          params: {
            ORDER_ID: this.ORDER_ID,
            STOP_WATCH: this.STOP_WATCH
          },
          success: response => {
            console.log('取消订单', response);
          }
        })

        dsUtils.navigateBack(2);
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
