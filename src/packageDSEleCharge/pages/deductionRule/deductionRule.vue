<template>
  <view :class="careEnv === '1'? 'careWrap':'defaultWrap'" >
    <view class="deduction-rule">
      <TitleBar :title-bar-obj="titleBarObj" @goBack="goBack" />
      <view class="deduction-rule-scroll">
        <view class="deduction-rule-title">
          <view class="deduction-rule-title-text">一、优惠券</view>
          <view class="deduction-rule-title-imgview" @tap="couponRule = !couponRule">
            <image src="../../images/ds_bottom.png" class="deduction-rule-title-img" v-show="!couponRule"></image>
            <image src="../../images/ds_top.png" class="deduction-rule-title-img" v-show="couponRule"></image>
          </view>
        </view>
        <view class="deduction-rule-contain" v-show="couponRule">
          <view class="deduction-rule-contain-title">1. 如何使用优惠券？</view>
          <view>（1）优惠券为电费优惠券，只能在给归属省份的用电户号交纳电费时使用。</view>
          <view>（2）使用优惠券需满足最低交费金额，若优惠券最低交费金额与省公司交费业务限定的最低交费金额冲突时，以金额高的为准。</view>
          <view class="deduction-rule-contain-title">2.优惠券使用限制</view>
          <view>（1）优惠券只能使用一次。</view>
          <view>（2）优惠券需在有效期内使用，有效期以优惠券页面实际显示的日期为准。</view>
        </view>
        <view class="deduction-rule-title">
          <view class="deduction-rule-title-text">二、电费红包</view>
          <view class="deduction-rule-title-imgview" @tap="redpackageRule = !redpackageRule">
            <image src="../../images/ds_bottom.png" class="deduction-rule-title-img" v-show="!redpackageRule"></image>
            <image src="../../images/ds_top.png" class="deduction-rule-title-img" v-show="redpackageRule"></image>
          </view>
        </view>
        <view class="deduction-rule-contain" v-show="redpackageRule">
          <view class="deduction-rule-contain-title">1.如何使用电费红包</view>
          <view>（1）用户在交纳电费时，输入要使用的电费红包金额，系统会自动进行抵扣。</view>
          <view>（2）每次最多使用200元电费红包。</view>
          <view>（3）电费红包最小使用单位为0.01元。</view>
          <view>（4）使用电费红包进行支付时，会先锁定电费红包，若支付失败，或者支付过程中系统中断，或者您放弃支付，系统会在30分钟内将本次使用的电费红包退回至您的账户，您可在我的资产-红包查看。</view>
          <view>（5）您可在红包记录中查看电费红包的使用记录。</view>
        </view>
        <view class="deduction-rule-title">
          <view class="deduction-rule-title-text">三、积分</view>
          <view class="deduction-rule-title-imgview" @tap="integralRule = !integralRule">
            <image src="../../images/ds_bottom.png" class="deduction-rule-title-img" v-show="!integralRule"></image>
            <image src="../../images/ds_top.png" class="deduction-rule-title-img" v-show="integralRule"></image>
          </view>
        </view>
        <view class="deduction-rule-contain" v-show="integralRule">
          <view class="deduction-rule-contain-title">1.如何使用积分？</view>
          <view>（1）用户在交纳电费时，输入要使用的积分金额，系统会自动进行抵扣。</view>
          <view>（2）每次最多使用20000积分（等同于100元）。</view>
          <view>（3）积分最小使用单位为200积分（等同于1元）。</view>
          <view>（4）使用“积分”进行支付时，会先锁定积分，若支付失败，或者支付过程中系统中断，或者您放弃支付，系统会在30分钟内将本次使用的积分退回至您的账户，您可在我的资产-红包查看。</view>
          <view class="deduction-rule-contain-title">2.积分有效期说明</view>
          <view>（1）2019年6月1日起，客户新获取的积分有效期为三年（如2019年6月1日生成的积分，有效期保留至2022年5月31日）</view>
          <view>（2）2019年6月1日前，客户已获取的存量积分有效期不变。</view>
        </view>
        <view class="deduction-rule-line"></view>
      </view>
    </view>
  </view>
</template>

<script>
  import "./deductionRule.scss";
  import { dsUtils } from "@/dsUtils";
  import TitleBar from "@/components/titleBar/titleBar";
  export default {
    components: {
      TitleBar
    },
    data() {
      return {
        titleBarObj: {
          title: "优惠规则",
          isOpenAlipayJump: false, // 返回到指定页面
          tokenBol: false, // 点击返回退出
          // arrowWhite: true, //箭头默认false为黑色，ture为白色
          // isNoShowArrow: true // 不显示箭头，默认false;  显示，true
        },
        ELEC_TYPE_LIST: [], // 电费列表
        careEnv: '',
        couponRule: true,
        redpackageRule: true,
        integralRule: true,
      }
    },
    created() {
    },
    mounted() {
      this.careEnv = dsUtils.careEnv
    },
    methods: {
      goBack() {
        dsUtils.navigateBack(1)
      },
    }
  }
</script>
<style scoped>

</style>
