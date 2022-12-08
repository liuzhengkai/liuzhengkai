<!-- pages/auth/index.wxml -->
<template>
  <view class="auth-wrap">
    <TitleBar :title-bar-obj="titleBarObj" @goBack="goBack" />
    <view class="auth-flex">
      <view>当前绑定手机号</view>
      <view v-show="secretPhone">
        <view>{{ secretPhone }}</view>
      </view>
    </view>
    <view>
      <view class="auth-btn" @tap="handleLoginOut" >退出账号</view
      >
    </view>
  </view>
</template>

<script>
import "./editPhone.scss";
import Taro from "@tarojs/taro";
import TitleBar from "@/components/titleBar/titleBar";
import AOP from "../../utils/wsgwH5Sdk/wsgwH5Sdk";
import { dsUtils } from '../../bussinessUtil/dsUtils';


export default {
  /**
   * 页面的初始数据
   */
  data() {
    return {
      secretPhone: "", //脱敏电话
      phone: "", //明文电话
      titleBarObj: {
        title: "我的账号",
        // tokenBol: false,
        arrowWhite:true ,
        isNoShowArrow: false,
      },
    };
  },
  components: {
    TitleBar,
  },

  // 对应 onShow
  onShow() {
    let that = this;
    // 查询用户信息 ----可以获取手机号
    if(!dsUtils.getUserInfo().token) return;
    AOP.unbindGetPhoneNumber().then((res) => {
      let mobile = res.mobile
      if (mobile) {
        that.phone = mobile;
        that.secretPhone = that.setPhone(mobile, 3, 4);
      } else {
        Taro.showToast({
          title: res.msg,
          icon: "none",
        });
      }
      Taro.hideLoading()
    })
  },

  methods: {
    // 返回上一页
    goBack() {
      dsUtils.navigateBack(1)
    },

    // 退出账号
    handleLoginOut() {
      let p = JSON.stringify({
        phone: this.phone,
        secretPhone: this.secretPhone
      })
      dsUtils.navigateTo({
        url: `/pages/unbind/unbind?params=${p}`,
      })
    },
    /**
     * @方法名: setPhone
     * @注释: 电话号码脱敏处理
     * @param {*} num 电话号
     * @param {*} start 开始截取位置
     * @param {*} length 截取长度
     * @返回值: 模糊处理后的电话号码
     * @ReturnType: string
     */
    setPhone(num, start, length) {
      let newNum = num + "";
      return (
        newNum.slice(0, start) +
        "*".repeat(length) +
        newNum.slice(newNum.length - start - 1)
      );
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
