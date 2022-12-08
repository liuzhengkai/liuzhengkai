<template>
  <view class="page-help-with-coupon" :class="{'page-help-with-coupon-noscroll': showPageContainer||toastFlag}">
    <TitleBar class="help-with-coupon-titlebar" :title-bar-obj="titleBarObj" @goBack="" />
    <!-- 页面头部和中间 -->
    <view class="help-with-coupon-c">
      <!-- 头部 -->
      <view class="top-banner">
        <image class="top-banner-bannerpic" src="../../images/ds_banner.png" alt=""></image>
        <view class="top-banner-rules" @tap='toActiveRules'>活动规则</view>
      </view>
      <!-- 中间 -->
      <view class="group">
        <!-- 活动时间 -->
        <image class="group-pic" src="../../images/ds_group2.png" alt=""></image>
        <view class="group-title">
          <view class="group-title-area">仅可领取活动地区电费优惠券</view>
          <view class="group-title-time">活动时间：{{acStartDate}}-{{acEndDate}}</view>
        </view>

        <!-- 1 待助力 2 助力中 -->
        <view v-show="helpStatus == 0">
          <view class="group-contant">
            <!-- 上半张卡片 -->
            <view class="group-contant-coupon">
              <image class="coupon-pic-left" src="../../images/ds_dou_left.png" alt=""></image>
              小伙伴，快来帮我助力吧，你也有奖励噢
              <image class="coupon-pic-right" src="../../images/ds_dou_right.png" alt=""></image>
            </view>
            <!-- 倒计时 -->
            <view class="group-contant-endtime">
              <text class="group-contant-endtime-text">助力倒计时</text>
              <text class="group-contant-endtime-e-text">{{showtime[1]}}</text>
              :
              <text class="group-contant-endtime-e-text">{{showtime[2]}}</text>
              :
              <text class="group-contant-endtime-e-text">{{showtime[3]}}</text>
            </view>
            <view class="group-contant-dashed"></view>
            <!-- 下半张卡片 -->
            <view class="group-contant-done">
              <!-- 列表 -->
              <view v-show="memberList.length">
                <view class="group-contant-list-continued" v-for="(item, index) in memberList" :key="index">
                  <image class="coupon-contant-self" src="../../images/ds_friend.png" alt=""></image>
                  <view class="coupon-contant-info">
                    <view class="coupon-contant-phone">{{item.phone}} 已助力</view>
                    <view class="coupon-contant-time">{{item.createTime}}</view>
                  </view>
                  <!-- 好友获得优惠券 -->
                  <view class="discount-coupon">
                    <image class="discount-coupon-picture" src="../../images/ds_suc_coupon_continued.png" alt="">
                    </image>
                    <view class="discount-coupon-info">
                      <view class="discount-coupon-info-view"><text class="discount-coupon-info-text">￥</text>{{item.rewardValue}}</view>
                      <view class="discount-coupon-info-view2">好友获得</view>
                    </view>
                  </view>
                </view>
              </view>
              <!-- 加号 -->
              <view class="group-contant-list-add">
                <image class="coupon-contant-add" @tap='hClickHelp' src="../../images/ds_build_group.png" alt=""></image>
                <view class="coupon-contant-num">仅差{{numOfPeople}}人即可完成助力</view>
              </view>
            </view>
          </view>
          <!-- 按钮卡片 -->
          <view class="group-button-area">
            <view class="group-button-dashed"></view>
            <view class="button" @tap='hClickHelp'>
              <image class="coupon-button-bg" src="../../images/ds_button_bg.png" alt=""></image>
              <text class="coupon-button-text">帮好友助力</text>
            </view>
          </view>
        </view>

        <!-- 3 助力成功 -->
        <view class="group-succ-area" v-show="helpStatus == 1">
          <!-- 上半张卡片 -->
          <view class="group-succ-area-title">
            <view class="group-contant-coupon">
              <image class="group-succ-coupon-pic-left" src="../../images/ds_dec_left.png" alt="">
              </image>
              <text class="group-contant-coupon-text">助力成功</text>
              <image class="group-succ-coupon-pic-right" src="../../images/ds_dec_left.png" alt="">
              </image>
            </view>
          </view>
          <!-- 下半张卡片-->
          <view class="group-succ-area-content">
            <view class="group-succ-area-dashed"></view>

            <view class="group-contant-list-finished" v-for="(item, index) in memberList" :key="index">
              <view class="coupon-contant-myinfo">
                <image class="coupon-contant-self" src="../../images/ds_friend.png" alt="">
                </image>
                <text class="coupon-contant-phone">{{item.phone}}</text>
              </view>
              <!-- 好友获得优惠券 -->
              <view class="discount-coupon">
                <image class="discount-coupon-picture" src="../../images/ds_suc_coupon_finished.png" alt="">
                </image>
                <view class="discount-coupon-info">
                  <view class="discount-coupon-info-view"><text class="discount-coupon-info-text">￥</text>{{item.rewardValue}}</view>
                  <view class="discount-coupon-info-view2">好友获得</view>
                </view>
              </view>
              <text class="coupon-contant-time">{{item.createTime}}</text>
            </view>
          </view>
        </view>

        <!-- 4 助力活动已结束 -->
        <view class="group-assis-end" v-show="helpStatus == 2">
          <view class="group-assis-end-title">您来晚啦</view>
          <view class="group-assis-end-text">助力活动已过期</view>
          <image class="group-assis-end-img" src="../../images/ds_assis_end.png" alt=""></image>
        </view>
      </view>
      <!-- 页面底部 -->
      <view class="group-bottom">
        <image class="group-bottom-pic" src="../../images/ds_group_bottom.png" alt=""></image>
        <view class="group-bottom-content">
          <view class="group-bottom-content-describe">更多精彩活动就在网上国网APP，扫码下载吧</view>
          <image class="group-bottom-content-qrcode" src="../../images/ds_qrcode.png" alt=""></image>
        </view>
      </view>
    </view>

    <!-- 视图容器start 请选择领券地区 -->
    <view class="selector-page-bg" :style="{'top': titleBarHeight}" v-if="showPageContainer">
      <view class="selector-page-container">
        <image class="selector-bg" src="../../images/ds_get_region_coupon_toast.png" alt=""></image>
        <view class="selector-content">
          <view class="selector-content-title">请选择领券地区</view>
          <view class="selector-picker" @tap="hClickOpenPicker">
            <view class="selector-picker-view">{{provinceNameView}}</view>
            <image class="selector-select" src="../../images/ds_select.png" alt=""></image>
          </view>
          <view class="select-content-annotation">领取优惠券仅可为选择地区的低压居民户号交费时抵扣使用</view>
          <!-- 确认领取↓ -->
          <view @tap="hClickGet" class="selector-get" style="background-color: pink;"></view>
          <image class="selector-close" @tap="hClickClose" src="../../images/ds_close.png" alt="">
          </image>
        </view>
        <!-- 选择器 taro -->
        <view v-if="showPicker">
          <view class="page-help-with-coupon-picker-title">
            <text @tap="cacel" :style="{'color': isClickPicker?'':'#c2c2c2'}">取消</text>
            <text @tap="sure" :style="{'color': isClickPicker?'':'#c2c2c2'}">确认</text>
          </view>
          <picker-view @change="bindChange" @pickEnd="bindpickend" @pickStart="bindpickstart" :value="provinceIndexSelected" style="width: 100%; height: 300px;background-color:white;text-align:center;" indicator-style="height: 30px;">
            <picker-view-column>
              <view v-for="(item, index) in provinceList" :key="index">{{item.provinceName}}</view>
            </picker-view-column>
          </picker-view>
        </view>
      </view>
    </view>
    <!-- 视图容器end -->
    <!-- 弹窗start 助力结果 -->
    <view class="common-toast-tips" catchtouchmove="return" v-if="toastFlag">
      <view class="common-toast-tips-bg" :style="{'top': titleBarHeight}"></view>
      <view class="position-view">
        <view class="common-toast-tips-contant">
          <image v-if="toastContant==0" class="common-toast-tips-bg-pic0" src="../../images/ds_success_toast_coupon.png" alt=""></image>
          <image v-if="toastContant==1||toastContant==2" class="common-toast-tips-bg-pic12" src="../../images/ds_success_toast_too.png" alt=""></image>
          <image v-if="toastContant==3||toastContant==4" class="common-toast-tips-bg-pic34" src="../../images/ds_success_toast.png" alt=""></image>
          <image class="common-toast-tips-close-pic" @tap="clickClose" src="../../images/ds_close.png" alt=""></image>
        </view>
        <view class="common-toast-tips-main">
          <!-- 0 助力成功 -->
          <view v-show="toastContant==0" class="a-great-success">
            <view>恭喜您</view>
            <view>成功帮好友助力</view>
            <view class="i-got-this-coupon">
              <view>获得<text class="i-got-this-coupon-text">{{rewardValue}}元</text>电费优惠券</view>
              <view>有效期<text class="i-got-this-coupon-text">{{validityDays}}</text>天</view>
            </view>
          </view>
          <!-- 1 已帮助该好友助力 2 活动配置的助力次数已用完 -->
          <view v-show=" toastContant==1 || toastContant==2 " class="a-complete-failure">
            <view v-show="toastContant==1">您已帮好友助力当前链接</view>
            <view v-show="toastContant==1">无法再次助力</view>
            <view v-show="toastContant==2">您的助力次数已用光</view>
            <view v-show="toastContant==2">无法为好友助力</view>
            <view>快去发起自己的助力吧！</view>
            <view @tap="clickClose" class="i-want-to-initiate">
              <image class="i-want-to-initiate-image" src="../../images/ds_btn_i_want_to_initiate.png" alt=""></image>
              <button id="i-want-to-initiate-view" openType="launchApp" appParameter="" size="" @error="launchAppError">我也要发起助力活动</button>
            </view>
          </view>
          <!-- 3 授权后此链接人数已满 -->
          <view v-show="toastContant==3">
            <view>您来晚了</view>
            <view>当次分享已无助力席位</view>
          </view>
          <!-- 4 预算已用空 -->
          <view v-show="toastContant==4">
            <view>当前地区优惠券已领完</view>
            <view>请稍后再来</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 弹窗end -->
  </view>
</template>

<script>
  import "./helpWithCoupon.scss"
  import { dsUtils } from "@/dsUtils"
  import TitleBar from "@/components/titleBar/titleBar"
  export default {
    components: {
      TitleBar,
    },
    data() {
      return {
        titleBarHeight: '',
        titleBarObj: {
          title: "邀请助力领优惠",
          arrowWhite: true,
          isNoShowArrow: false,
        },
        taroEnv: '',
        errToast: null, // 页面异常提示 (用于进入页面时或点击助力按钮时进行提示)
        helpStatus: 0, // 各种助力状态 // 0 发起助力后24小时内助力人数不足(待助力或助力中), 1 助力人数满了(助力成功), 2 发起助力超过24小时且助力人数不足(发起的助力已结束)
        acStartDate: '-- ', // 活动时间 开始
        acEndDate: ' --', // 活动时间 截止
        showtime: ["00", "00", "00", "00"], // 使用Utils的countdown1方法得到的数组 [天,时,分,秒]
        countdownHasBegun: false, // 是否显示 页面倒计时
        memberList: [], // 助力人列表
        numOfPeople: 0, // 仅需多少人即可完成助力
        assistanceId: '', // 助力id
        toastFlag: false, // 弹层 控制显示或隐藏
        toastBgSrc: '', // 弹层 背景图
        toastContant: 1, // 弹层中的插槽 各种内容
        showPageContainer: false, // 视图容器 控制显示或隐藏
        showPicker: false, // 视图容器中的选择器 控制显示或隐藏
        provinceList: [], // 选择器中的地区
        isClickPicker: true, // 选择器中确认按钮是否可点击
        provinceIndexChanging: [0], // 选择器中在改变的index
        provinceIndexSelected: [0], // 用户确定选择的index
        provinceNameView: '', //用户确定选择的index对应地区名
        rewardValue: 0, // 用户助力后获得优惠券 ?元
        validityDays: 0, // 用户助力后获得的优惠券 有效期
        clearNum: null, //计时器编号
      }
    },
    mounted() {
      this.taroEnv = process.env.TARO_ENV
      dsUtils.getSystemInfo({}).then(res => {
        if (process.env.TARO_ENV == 'weapp') { //微信titleBarHeight无法获取使用固定值'37'
          this.titleBarHeight = 37 + res.statusBarHeight + 'px';
        } else { // 支付宝
          this.titleBarHeight = res.titleBarHeight + res.statusBarHeight + 'px';
        }
      });
    },
    onLoad(options) {
      if (options && options.assistanceId) { //获取地址栏参数(助力活动id)
        this.assistanceId = options.assistanceId
      }
    },
    onShow() {
      this.getAssistanceMessage() //查询助力信息
    },
    watch: {
      provinceIndexSelected: { //用户确定选择的地区角标变化 最终显示的地区名称也跟着变化
        deep: true,
        handler() {
          this.provinceNameView = this.provinceList[this.provinceIndexSelected[0]].provinceName
        }
      },
    },
    methods: {
      clearCountdown() { // 清除计时器
        clearInterval(this.clearNum)
      },
      toActiveRules() { // 活动规则
        dsUtils.navigateTo({
          url: '../helpWithCouponRules/helpWithCouponRules'
        })
      },
      getAssistanceMessage() { // 查询助力信息
        let __this = this
        dsUtils.request("osg-p0014/acAssistance/c1/f02", { // 接口: 查询助力记录
          params: {
            data: {
              requestId: new Date().getTime(),
              assistanceId: __this.assistanceId,
            }
          },
          paramsFlag: '2', // params入参即为最终入参不再进行嵌套
          isWhiteList: true, //白名单接口无token也可调用成功
          success(res) {
            if (res && res.respCode == 'MAC0000') {
              for (let i = 0; i < res.memberList.length; i++) {
                res.memberList[i].createTime = dsUtils.formatTime(res.memberList[i].createTime, 3) // 助力时间戳
                res.memberList[i].rewardValue = res.memberList[i].rewardValue ? (res.memberList[i].rewardValue / 100).toFixed(0) : 0 //分转元(整数)
              }
              __this.acStartDate = dsUtils.formatTime(res.acStartDate, 1)
              __this.acEndDate = dsUtils.formatTime(res.acEndDate, 1)
              __this.numOfPeople = res.assistanceCount - res.assistingCount
              __this.memberList = res.memberList
              // 实际助力人数 等于 助力所需人数 (助力人数满了, 助力成功)
              if (res.assistingCount == res.assistanceCount) {
                __this.helpStatus = 1
                return
              }
              // 助力结束时间 早于 当前时间 (发起助力超过规定时间且助力人数不足, 发起的助力已结束)
              if (res.endTime - new Date().getTime() < 0) {
                __this.helpStatus = 2
                return
              }
              // 其他 (发起助力后规定时间内助力人数不足, 待助力或助力中)
              __this.helpStatus = 0
              __this.countdownHasBegun = true
              let clearNum = dsUtils.countdown1((res.endTime - new Date().getTime()) / 1000, (a) => { // 倒计时
                __this.countdownHasBegun = !a[4] // 根据dsUtils的countdown1方法可以看出, a[4]为false时 已经开始倒计时
                __this.showtime = a
                if (a[4]) { // a[4]为true时 已经停止倒计时
                  __this.helpStatus = 2
                }
              })
              __this.clearNum = clearNum
            } else { // 业务信息响应码 不成功
              dsUtils.toast(res.respMsg)
              __this.errToast = res.respMsg
            }
          },
          fail(err) {
            __this.errToast = "查询助力信息失败！"
          }
        })

      },
      hClickHelp() { //点击帮好友助力按钮
        let __this = this
        if (this.errToast) { // 当前页面异常
          dsUtils.toast(__this.errToast)
          return
        }
        //注: 虽然查询地区接口支持无token调用, 但用户点击帮好友助力按钮, 需要先登录, 再查询地区.
        dsUtils.loginDispatcher().then(() => {
          this.getProvinceList()
        }).catch((err) => {
          dsUtils.toast('请先登录')
        })
      },
      getProvinceList() { // 获取领券地区列表 // 接口: 查询有效活动省份
        let __this = this
        dsUtils.request("osg-p0014/acAssistance/c1/f05", {
          params: {
            requestId: (new Date().getTime()).toString()
          },
          isWhiteList: true, //白名单接口无token也可调用成功
          success(res) {
            if (res && res.respCode == "MAC0000") { // 业务信息响应码成功
              if (res.provinceList && res.provinceList.length != 0) {
                res.provinceList.forEach((item) => { // 省码13103对应的'冀北' 显示为 '冀北（唐山，张家口，秦皇岛，廊坊，承德）'
                  item.provinceName = item.provinceCode == '13103' ? '冀北（唐山，张家口，秦皇岛，廊坊，承德）' : item.provinceName
                })
                __this.provinceList = res.provinceList
                __this.provinceNameView = __this.provinceList[0].provinceName
                __this.showPageContainer = true
              } else {
                dsUtils.toast('暂无可选领券地区')
              }
            } else {
              dsUtils.toast(res.respMsg)
            }
          },fail(err) {
            dsUtils.toast("请求数据异常，请稍后重试")
          },
        })
      },
      hClickOpenPicker() { // 点击打开选择器
        this.showPicker = true
      },
      bindChange(e) { // 选择器 选中项的改变
        this.provinceIndexChanging = e.detail.value
      },
      bindpickstart(e) { // 选择器 开始滚动
        this.isClickPicker = false
      },
      bindpickend(e) { // 选择器 滚动结束
        this.isClickPicker = true
      },
      sure() { // 选择器 用户确定选择
        if (this.isClickPicker) {
          this.provinceIndexSelected = JSON.parse(JSON.stringify(this.provinceIndexChanging))
          this.showPicker = false
        }
      },
      cacel() { // 选择器 用户取消选择
        if (this.isClickPicker) {
          this.showPicker = false
        }
      },
      hClickGet() { // 点击确认领取
        this.hClickClose()
        this.goHelp()
      },
      hClickClose() { // 点击关闭视图容器
        if (!this.showPicker) {
          this.showPageContainer = false
          this.showPicker = false
        }
      },
      goHelp() { // 助力
        let __this = this
        dsUtils.request("osg-p0014/acAssistance/c1/f03", { // 接口: 开启助力（查询助力链接）
          params: {
            data: {
              requestId: (new Date().getTime()).toString(),
              token: dsUtils.getUserInfo().token,
              assistanceId: this.assistanceId,
              provinceCode: this.provinceList[this.provinceIndexSelected[0]].provinceCode
            }
          },
          paramsFlag: '2', // params入参即为最终入参不再进行嵌套
          success(res) {
            if (res && res.respCode == "MAC0000") { // 助力成功
              __this.rewardValue = (res.rewardValue / 100).toFixed(0) || 0
              __this.validityDays = res.validityDays - 1 //后端返回的天数会额外加一天,前端显示需要减去
              __this.toastFlag = true
              __this.toastContant = 0
            } else if (res.respCode === "MAC0010") { // 已帮助该好友助力-------MAC0010不能重复助力！
              __this.toastFlag = true
              __this.toastContant = 1
            } else if (res.respCode === "MAC0007") { // 活动配置的助力次数（3次）已用完-------MAC0007用户参与助力次数达到上限！
              __this.toastFlag = true
              __this.toastContant = 2
            } else if (res.respCode === "MAC0011" || res.respCode === "MAC0016") { // 授权后此链接人数已满-------MAC0011助力人数已满！MAC0016该助力订单已完成！
              __this.toastFlag = true
              __this.toastContant = 3
            } else if (res.respCode === "MAC0022") { // 预算已用空-------MAC0022预算不足，助力失败！
              __this.toastFlag = true
              __this.toastContant = 4
            } else { // 其他无法助力的情况
              dsUtils.toast(res.respMsg || "助力失败")
            }
          },
          fail() {
            dsUtils.toast("请求数据异常，请稍后重试")
          },
        })

      },
      clickClose() { // 点击关闭弹层
        this.toastFlag = false
        this.clearCountdown() //清除计时器
        this.getAssistanceMessage() // 重新查询助力信息
      },
      launchAppError(e) { // 监听跳回APP时的错误信息
        console.log(e.detail.errMsg || e.detail.errorMessage, "===跳回APP的错误信息===", )
        dsUtils.navigateTo({
          url: '../helpWithCouponGuidance/helpWithCouponGuidance',
        })
      },
    }
  }
</script>
