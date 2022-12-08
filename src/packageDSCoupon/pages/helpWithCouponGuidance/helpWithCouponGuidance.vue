<template>
  <view class="page-help-with-coupon-guidance">
    <TitleBar class="help-with-coupon-guidance-titlebar":title-bar-obj="titleBarObj" @goBack="goBack" />
    <view class="page-help-with-coupon-guidance-body">
      <image class="page-help-with-coupon-guidance-banner" src="../../images/ds_banner.png" alt="">
      </image>
      <view class="page-help-with-coupon-guidance-title">
        <image class="page-help-with-coupon-guidance-title-image" src="../../images/ds_group.png" alt=""></image>
        <view class="page-help-with-coupon-guidance-title-view">发起助力说明</view>
      </view>

      <view class="page-help-with-coupon-guidance-contant">
        <view class="page-help-with-coupon-guidance-contant-view">1.前往应用商城下载【网上国网】</view>
        <view class="page-help-with-coupon-guidance-contant-view">2.通过首页——活动专区进入活动，完成交费任务，即可发起助力</view>
        <image class="page-help-with-coupon-guidance-contant-image" src="../../../assets/images/ds_reg_code.png" alt=""></image>
        <view class="page-help-with-coupon-guidance-contant-view2">扫码下载网上国网APP</view>
      </view>
    </view>
    <view class="page-help-with-coupon-guidance-footer">
      <image class="page-help-with-coupon-guidance-footer-image" src="../../images/ds_wsgw_steward.png" alt=""></image>
    </view>

  </view>
</template>

<script>
  import "./helpWithCouponGuidance.scss"
  import { dsUtils } from "@/dsUtils"
  import TitleBar from "@/components/titleBar/titleBar"
  
  export default {
    components: {
      TitleBar,
    },
    data() {
      return {
        titleBarObj: {
          title: "邀请助力领优惠",
          arrowWhite: true,
          isNoShowArrow: false,
        },
        taroEnv: '',

      }
    },
    mounted() {
      this.taroEnv = process.env.TARO_ENV
    },
    onShow() {

    },
    methods: {
      goBack() {
        dsUtils.navigateBack(1)
      }
    }
  }
</script>
