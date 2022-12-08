<template>
  <view class="page-help-with-coupon-rules">
    <TitleBar class="help-with-coupon-rules-titlebar" :title-bar-obj="titleBarObj" @goBack="goBack" />
    <view class="page-help-with-coupon-rules-mainbox">
      <!-- 头部banner -->
      <view class="top-banner">
        <image class="top-banner-bannerpic" src="../../images/ds_banner.png" alt=""></image>
      </view>
      <!-- 规则内容部分 -->
      <view class="rules-content">
        <image class="rules-content-pic" src="../../images/ds_rules_content_top.png" alt=""></image>
        <view class="rules-content-title">活动规则</view>
        <view class="rules-content-main">
          <view>一、 活动对象</view>
          <view>完成网上国网人脸认证， 并绑定活动地区低压居民户号的用户。</view>
          <view>二、 活动时间</view>
          <view>以活动页面为准</view>
          <view>三、 活动地区</view>
          <view>北京、 天津、 河北、 江苏、 湖北、 蒙东、 陕西、 宁夏、 新疆</view>
          <view>四、 活动入口</view>
          <view>1. 交费完成页面；</view>
          <view>2. APP首页 - 活动专区 - 助力有礼活动。</view>
          <view>五、 活动规则</view>
          <view>1、 活动期间， 用户在网上国网App内对活动地区低压居民户号交费， 单笔实付30元以上（ 不含红包、 积分、 电费券兑换部分）， 可发起助力， 发起后需在24小时内邀请好友完成助力。</view>
          <view>2、 发起助力者需通过微信小程序邀请5名好友助力， 助力成功后， 发起助力者可获得活动地区满50减10元的电费优惠券。</view>
          <view>3、 助力者通过微信小程序参加助力， 如果助力者是老用户， 参与助力可获得活动地区满30减2元的电费优惠券。 如果助力者是新用户， 参与助力获得活动地区满30减5元的电费优惠券。</view>
          <view>4、 用户发起助力之后， 若24小时内助力人数未满即视为助力失败， 用户可重新发起助力， 直至助力成功。</view>
          <view>5、 活动期间， 针对同一省份的多笔交费， 用户最多可同时发起3个助力活动链接， 最多可完成3次助力活动。</view>
          <view>6、 活动期间， 每个助力者仅可助力3次， 发起助力者不可帮自己助力。</view>
          <view>7、 活动期间， 助力失败也会消耗助力者的助力次数。 助力次数满3次后， 助力者不可再次参与助力活动。</view>
          <view>8、 活动不支持退费操作， 如有作弊、 恶意刷奖等行为， 网上国网有权取消其获得奖励资格并追回奖励。</view>
          <view>9、 跨活动地区多户号交费订单不满足活动参与条件。</view>
          <view>六、 奖励查看及使用</view>
          <view>1、 电费优惠券到账后， 可在App“ 我的”——“ 我的资产”——“ 优惠券” 中查看， 有效期为7天。</view>
          <view>2、 如优惠券超过24小时未到账， 可向在线客服反馈， 我们将及时为您处理。</view>
          <view>3、 优惠券可在网上国网App交电费时抵扣使用， 不可与交费立减活动同时使用。</view>
        </view>
      </view>
      <!-- 底部返回按钮 -->
      <view class="group-button-area">
        <image class="coupon-button-bg" @tap='goBack' src="../../images/ds_rules_bottom_button.png" alt=""></image>
        <view @tap='goBack' class="coupon-button-text">返回</view>
      </view>
    </view>
  </view>
</template>

<script>
  import "./helpWithCouponRules.scss"
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
