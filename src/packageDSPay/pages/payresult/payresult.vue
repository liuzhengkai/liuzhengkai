<template>
  <view :class="careEnv === '1'? 'careWrap':'defaultWrap'">
    <view class="pay-result">
      <TitleBar v-if="careEnv == '1'" :title-bar-obj="titleBarObj" @goBack="goBack" style="background-color:white" />
      <TitleBar v-else :title-bar-obj="titleBarObj" @goBack="goBack"  />
      <view class="pay-result-content">
        <view class="pay-result-num pay-bgcolor" v-if="orderStatus == '支付成功'">
          <view class="first">
            <view class="pay-money">
              <view class="pay-money-rmb">￥</view>
              <view class="pay-money-first">{{actualMoney[0]}}</view>
              <view class="pay-money-last">.{{actualMoney[1]}}</view>
            </view>
          </view>
          <view v-show="discountAmount" class="last">
            已优惠：{{discountAmount}}元
          </view>
        </view>
        <view class="orderStatusBox" v-show="orderStatus != '支付成功'">
          <image v-if="orderStatus == '支付失败'" class="ds_payFail" src="../../images/ds_payFail.png" alt="" />
          <image v-else src="../../images/ds_payProcessing.png" class="ds_payProcessing" alt="" />
          <view v-if="orderStatus == '支付失败'" class="orderStatusFail">{{orderStatus}}</view>
          <view v-else class="orderStatus">{{orderStatus}}</view>
          <view class="errorMessage">{{errorMessage}}</view>
        </view>
        <view class="pay-result-rate pay-bgcolor" v-if="orderStatus == '支付成功'">
          <view class="pay-result-rate-line">
            <view class="ay-result-rate-line-view"></view>
            <view class="pay-result-rate-line-view"></view>
          </view>
          <view class="pay-result-rate-main">
            <view class="pay-result-rate-main-view">
              <image class="pay-result-rate-main-view-pic" src="../../images/ds_pay_succ_do.png" alt="">
              </image>
              <view class="pay-result-rate-main-view-one">{{orderStatus}}</view>
            </view>
            <view class="pay-result-rate-main-view">
              <image class="pay-result-rate-main-view-pic" src="../../images/ds_paying.png" alt="">
              </image>
              <view class="pay-result-rate-main-view-two">{{rechargePay}}</view>
            </view>
            <view class="pay-result-rate-main-view">
              <image class="pay-result-rate-main-view-pic" src="../../images/ds_pay_done.png" alt="">
              </image>
              <view class="pay-result-rate-main-view-two">{{rechargePayDone}}</view>
            </view>
          </view>
        </view>
        <view class="pay-result-tips pay-bgcolor" v-if="orderStatus == '支付成功'">{{errorMessage}}</view>
        <view class="pay-line"></view>
        <view class="pay-result-desc pay-bgcolor">
          <view class="pay-result-desc-view">
            <text class="pay-result-desc-view-one">交费金额</text>
            <text class="pay-result-desc-view-two">￥{{deductionAmount}}</text>
          </view>
          <view class="pay-result-desc-view" v-show="taroEnv == 'h5'">
            <text class="pay-result-desc-view-one">优惠券</text>
            <text class="pay-result-desc-view-two">-￥{{couponSelectedMoney}}</text>
          </view>
          <view class="pay-result-desc-view" v-show="taroEnv == 'h5'">
            <text class="pay-result-desc-view-one">抵扣金额（红包、积分）</text>
            <text class="pay-result-desc-view-two">-￥{{integralMoney}}</text>
          </view>
        </view>
        <!-- 立返数据 -->
        <view v-if="lfMsg.length && orderStatus == '支付成功'" class="page-lf pay-bgcolor">
          <view class="page-lf-content">
            <view class="left">交费有礼</view>
            <view class="center">
              {{lfMsg}}
            </view>
            <view class="right" @tap="toUse">去使用 ></view>
          </view>
          <view class="page-lf-text">奖励获得积分，红包，优惠券仅限网上国网app端使用</view>
        </view>
        <view class="pay-result-btn">
          <view class="pay-result-button" @tap="finish">完 成</view>
          <view class="pay-result-button jump-record" v-show="taroEnv != 'h5'" @tap="jumpToRecord">查看交费记录</view>
        </view>
      </view>
      <view class="pay-result-bottom" v-show="taroEnv != 'h5'">
        <image class="pay-result-bottom-pic" src="../../../assets/images/ds_pay_result_bottom.png" alt=""></image>
        <view class="pay-result-bottom-main">
          <view class="pay-result-bottom-main-view">
            <view class="pay-result-bottom-main-view-one">更多精彩活动就在网上国网APP，扫码下载吧</view>
            <view>
              <image class="pay-result-bottom-main-pic" src="../../../assets/images/ds_reg_code.png" alt="">
              </image>
            </view>
          </view>
        </view>
        <view class="pay-result-bottom-desc">
          <view class="pay-result-bottom-desc-one">交费 · 查账 · 开票 · 办电 · 报修</view>
          <view class="pay-result-bottom-desc-two">— 尽在网上国网App，您的随身电管家 —</view>
        </view>
      </view>
    </view>
    <view class="modal" v-if="showModal">
      <view class="modal-content">
        <view class="model-content-upper">
          <image class="model-content-upper-bg" src="../../../assets/images/ds_pay_result_bottom.png"></image>
          <view class="model-content-upper-code">
            <image  class="model-content-code-img" mode="widthFix" src="../../../assets/images/ds_reg_code.png" alt=""></image>
          </view>
        </view>
        <view class="modal-content-text">请前往应用商店下载“网上国网”APP，或扫描二维码打开下载链接进行下载APP</view>
        <view class="modal-content-btn" @tap="know">我知道了</view>
      </view>
    </view>
  </view>
</template>

<script>
  import './payresult.scss'
  import { dsUtils } from "@/dsUtils";
  import TitleBar from "@/components/titleBar/titleBar";

  export default {
    components: {
      TitleBar
    },
    data() {
      return {
        titleBarObj: {
          title: "支付结果",
          isOpenAlipayJump: true, // 返回到指定页面
          tokenBol: false, // 点击返回退出
          arrowWhite: true, //箭头默认false为黑色，ture为白色
          isOpenBgBlue:true, // true 背景蓝。 false 默认色。
          // isNoShowArrow: true // 不显示箭头，默认false;  显示，true
        },
        careEnv: '', //控制样式 普通版0 关怀版1
        actualMoney: '', //实付金额
        actualMoneyNoSplit: '',// 实付金额未切割
        deductionAmount: '', //交费金额
        discountAmount: '', //CR优惠(后端返的特定字段)
        couponSelectedMoney: '', //优惠券金额
        integralMoney: '', //积分、红包金额
        orderId: '', //订单id
        orderStatus: '', //订单状态
        errorMessage: '', //订单错误原因
        rechargePay: '充值中',
        rechargePayDone: '电费到账',
        isback: 0, //监听是否触发返回键或者完成键
        lfMsg: '',
        showModal: false,
      }
    },
    created() {
      this.careEnv = dsUtils.careEnv
      this.taroEnv = process.env.TARO_ENV
      if(this.careEnv == '1') {
        this.titleBarObj.arrowWhite = false;
      }
      if(process.env.TARO_ENV == 'alipay' || process.env.TARO_ENV == 'weapp') {
        this.titleBarObj.arrowWhite = true
      }
      dsUtils.dataCollection({
        "ACTTYPE": '0204',
        "SERVICEID": 'W2021000601',
        "PAGENAME": '交费小程序：交费完成页',
        "CHANNEL": dsUtils.getUserInfo().channelCode,
      })
    },
    mounted() {
      let orderStatus = '' //状态
      let errorMessage = '' //错误描述
      switch (dsUtils.getStorageSync("DS_resultData").ORDERSTATUS) {
        case "02":
          orderStatus = '支付成功';
          errorMessage = '部分订单可能出现延迟，以实际到账为准。'
          break;
        case "03":
          orderStatus = '支付失败';
          errorMessage = dsUtils.getStorageSync("DS_resultData").ERRORMESSAGE
          break;
        case "99":
          orderStatus = '支付失败';
          errorMessage = '订单已关闭，请重新下单支付'
          break;
        default :
          orderStatus = '支付处理中';
          errorMessage = '支付处理中，请耐心等待，稍后可在交费记录中查看交费结果。'
      }
      this.orderStatus = orderStatus //订单状态
      this.errorMessage = errorMessage //订单错误原因

      
      this.getPayResult() //查询付费结果页数据
    },
    methods: {
      toUse() {
        this.showModal = true;
      },
      know() {
        this.showModal = false;
      },
      getPayResult() {
        //查询付费结果页数据
        let that = this;
        dsUtils.request('osg-p0016/member/c2/f01', {
          params: {
            ORDER_ID: dsUtils.getStorageSync("DS_resultData").SALE_PAY_ID
          },
          success: res => {
            if (res && res.data) {
              let response = res.data
              that.actualMoney = dsUtils.formatMoney(dsUtils.fenToYuan(response.ACTUAL_PAY_AMOUNT), true).split('.') //实付金额
              that.actualMoneyNoSplit = dsUtils.formatMoney(dsUtils.fenToYuan(response.ACTUAL_PAY_AMOUNT), true)
              that.deductionAmount = dsUtils.formatMoney(dsUtils.fenToYuan(response.ORDER_AMOUNT), true) //交费金额
              if(response.CR_REDUCE_AMOUNT && response.CR_REDUCE_AMOUNT*1 != 0){ //字段存在且不为0
                that.discountAmount = dsUtils.formatMoney(dsUtils.fenToYuan(response.CR_REDUCE_AMOUNT), true) //CR已优惠 (后端返的特定字段)
              }
              that.couponSelectedMoney = dsUtils.formatMoney(dsUtils.fenToYuan(response.COUPON_AMOUNT),
                true) //优惠券金额
              that.integralMoney = dsUtils.formatMoney(dsUtils.fenToYuan(response.DEDUCTION_AMOUNT),
                true) //积分红包-抵扣金额
              that.orderId = response.ORDER_CENTRE_ORDER_ID //订单ID
              that.lfMsg = response.RETURN_INFO ? response.RETURN_INFO.replace(/,/g,'，') : '' //立返优惠信息
               
            } else {
              dsUtils.toast('查询结果失败, 请稍后重试')
            }
          },
          fail: () => {
            let arr = ['actualMoney', 'deductionAmount', 'couponSelectedMoney', 'integralMoney', 'orderStatus', 'errorMessage']
            arr.forEach(item => {
              this[item] = '--'
            })
          }
        })

      },
      goBack() {
        if (process.env.TARO_ENV == 'h5') {
          dsUtils.bridge_close()
        } else {//支付宝
          dsUtils.navigateTo({
            url: "/pages/index/index",
            flag: 'reLaunch'
          });
        }
      },

      finish() {
        if (process.env.TARO_ENV == 'h5') {
          dsUtils.bridge_close()
        } else {//支付宝
          dsUtils.navigateTo({
            url: "/pages/index/index",
            flag: 'reLaunch'
          });
        }
        dsUtils.dataCollection({
          "ACTTYPE": '0301',
          "SERVICEID": 'W202100060101',
          "PAGENAME": '交费小程序-交费完成页：点击“完成”',
          "CHANNEL": dsUtils.getUserInfo().channelCode,
        })
      },

      jumpToRecord() {
        let orderId = this.orderId;
        dsUtils.request("osg-oc0002/member/c1/f02", {
          params: {
            orderId: orderId,
          },
          paramsFlag: "2",
          code: "1",
          success(response) {
            dsUtils.setStorageSync("DS_orderId", orderId);
            dsUtils.setStorageSync("DS_eleRecordInfo", response);
            dsUtils.navigateTo({
              url: "/packageDSRecord/pages/detail/detail",
            });
          },
        });
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
