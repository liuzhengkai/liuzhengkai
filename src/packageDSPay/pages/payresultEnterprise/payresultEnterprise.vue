<template>
  <view :class="careEnv === '1'? 'careWrap':'defaultWrap'">
    <view class="pay-result-enterprise">
      <TitleBar v-if="careEnv == '1'" :title-bar-obj="titleBarObj" @goBack="goBack" style="background-color:white" />
      <TitleBar v-else :title-bar-obj="titleBarObj" @goBack="goBack"  />
      <view class="pay-result-enterprise-content">
        <view class="pay-result-enterprise-content-pic">
          <image v-show="isOrderSuccess===true" class="pay-result-enterprise-content-pic-img" src="../../images/ds_pay_payresultEnterprise_orderSuccess.png" alt=""></image>
          <image v-show="isOrderSuccess===false" class="pay-result-enterprise-content-pic-img" src="../../images/ds_pay_payresultEnterprise_orderProcessing.png" alt=""></image>
        </view>
        <view class="pay-result-enterprise-content-main">{{orderSatus}}</view>
        <view class="pay-result-enterprise-content-date">{{theDate}}</view>
        <view class="pay-result-enterprise-content-tips">{{errorMessage}}</view>
      </view>
      <view class="pay-result-enterprise-btn">
        <view class="pay-result-enterprise-button" @tap="goBack">完 成</view>
      </view>
    </view>
  </view>
</template>

<script>
  import './payresultEnterprise.scss'
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
          arrowWhite: false, //箭头默认false为黑色，ture为白色
          // isNoShowArrow: true // 不显示箭头，默认false;  显示，true
        },
        careEnv: '', //控制样式 普通版0 关怀版1
        theDate: '--年--月--日',//
        isOrderSuccess: null,//是否支付成功 (true支付成功, false支付处理中, null未完成失败等其他情况)
        orderSatus: '', //订单状态
        errorMessage: '', //订单错误原因
        isback: 0, //监听是否触发返回键或者完成键
        lfMsg: ''
      }
    },
    created() {
      this.careEnv = dsUtils.careEnv
      this.taroEnv = process.env.TARO_ENV
    },
    mounted() {
      let orderSatus = '' //状态
      let errorMessage = '' //错误描述
      switch (dsUtils.getStorageSync("DS_resultData").ORDERSTATUS) {
        case "01":
          orderSatus = '支付未完成';
          break;
        case "02":
          orderSatus = '支付成功';
          errorMessage = '支付成功，请稍后查询，部分订单可能出现延迟，以实际到账为准，历史交费记录可至服务记录中查看'
          this.isOrderSuccess = true
          break;
        case "03":
          orderSatus = '支付失败';
          break;
        case "04":
          orderSatus = '支付处理中';
          errorMessage = '支付处理中，可稍后前往服务记录中查看付款结果'
          this.isOrderSuccess = false
          break;
      }
      this.orderSatus = orderSatus //订单状态
      this.errorMessage = errorMessage //订单错误原因
      let theDate = new Date()
      let theYear = theDate.getFullYear()
      let theMonth = theDate.getMonth() + 1 < 10 ? '0' + (theDate.getMonth() + 1) : theDate.getMonth() + 1
      let theDay = theDate.getDate() < 10 ? '0' + theDate.getDate() : theDate.getDate()
      this.theDate = theYear + '年' + theMonth + '月' + theDay + '日'
    },
    methods: {
      goBack() {
        if (process.env.TARO_ENV == 'h5') {
          dsUtils.bridge_close()
        }

      },

      jumpToRecord() {
        dsUtils.navigateTo({
          url: "/packageDSRecord/pages/index/index"
        });
      }


    }
  }
</script>
