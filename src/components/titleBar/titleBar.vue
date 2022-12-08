<template>
  <view>
    <view v-if="!titleBO.tokenBol" class="atd-config-transparent-header">
      <view
        class="content-wrap"
        id="contentWrap"
        :style="{
            'backgroundColor':titleBO.TBBg.color,
            'paddingTop': device
          }"
      >
        <!-- left -->
        <view
          @tap="goBack"
          class="content-left"
          :style="{'height': systemInfo.titleBarHeight+'px','paddingTop': systemInfo.statusBarHeight+'px', }"
        >
          <image class="back_bg" v-show="!titleBO.isNoShowArrow" v-if="platSupport" :src="dsBack" />
          <view class="content-left-word" v-if="titleBO.TBLeft.backWord && platSupport">返回</view>
        </view>
        <!-- center -->
        <view
          class="content-center"
          :style="{ 'color':titleBO.TBTitle.color,'height': systemInfo.titleBarHeight+'px','paddingTop': systemInfo.statusBarHeight+'px', }"
        >{{ titleBO.title }}</view>
        <!-- right -->
        <view
          class="content-right"
          :style="{'height': systemInfo.titleBarHeight+'px','paddingTop': systemInfo.statusBarHeight+'px', }"
        >
          <view v-for="(item, index) in titleBO.TBRightArr" :key="index" v-show="taroEnv == 'h5'">
            <image
              class="content-right-image"
              :src="item.TBRight.srcPath"
              @tap="TBRHandleClick(item.TBRight.TBRClickName)"
              v-if="item.TBRight.srcPath.length"
            />
          </view>
        </view>
      </view>
    </view>
    <view v-if="titleBO.tokenBol">
      <navigator open-type="exit" target="miniProgram">
        <view class="atd-config-transparent-header">
          <view
            class="content-wrap"
            id="contentWrap"
            :style="{
            'backgroundColor':titleBO.TBBg.color,
            'paddingTop': device
          }"
          >
            <!-- left -->
            <view
              @tap="goBack"
              class="content-left"
              :style="{'height': systemInfo.titleBarHeight+'px','paddingTop': systemInfo.statusBarHeight+'px', }"
            >
              <image
                class="back_bg"
                v-show="!titleBO.isNoShowArrow"
                v-if="platSupport"
                :src="dsBack"
              />
              <view class="content-left-word" v-if="titleBO.TBLeft.backWord && platSupport">返回</view>
            </view>
            <!-- center -->
            <view
              class="content-center"
              :style="{ 'color':titleBO.TBTitle.color,'height': systemInfo.titleBarHeight+'px','paddingTop': systemInfo.statusBarHeight+'px', }"
            >{{ titleBO.title }}</view>
            <!-- right -->
            <view
              class="content-right"
              :style="{'height': systemInfo.titleBarHeight+'px','paddingTop': systemInfo.statusBarHeight+'px', }"
            >
              <view
                v-for="(item, index) in titleBO.TBRightArr"
                :key="index"
                v-show="taroEnv == 'h5'"
              >
                <image
                  class="content-right-image"
                  :src="item.TBRight.srcPath"
                  @tap="TBRHandleClick(item.TBRight.TBRClickName)"
                  v-if="item.TBRight.srcPath.length"
                />
              </view>
            </view>
          </view>
        </view>
      </navigator>
    </view>
    <view class="content-white" :style="{ 'height': systemInfo.whiteFillHeight + 'px','paddingTop': device}"></view>
  </view>
</template>
<script>
import './titleBar.scss'
import Taro from '@tarojs/taro'
// 下面是导入两张图片的相对地址
import dsBackWhite from '../../assets/images/ds_btn_back_white.png'
import dsBackBlank from '../../assets/images/ds_btn_back_black.png'
import { dsUtils } from '@/dsUtils'
export default {
  props: {
    titleBarObj: {
      type: Object,
    },
  },
  computed: {
    device() {
      if (this.taroEnv == 'h5') {
        // 这个先去掉，不然微应用会出现titleBar被浏海盖住的情况，但是iphone6没有浏海的iphone会高出一点点。待解决。
        //   if(dsUtils.bridge_WSGWBridge()){
        //   return '0em'
        // }
        const events = navigator.userAgent
        if (
          events.indexOf('Android') > -1 ||
          events.indexOf('Linux') > -1 ||
          events.indexOf('Adr') > -1
        ) {
          return '0em'
        } else if (events.indexOf('iPhone') > -1) {
          //根据尺寸进行判断 苹果的型号
          if (screen.height == 812 && screen.width == 375) {
            return '1.5em'
          } else if (screen.height == 736 && screen.width == 414) {
            return '1em'
          } else if (screen.height == 667 && screen.width == 375) {
            return '1em'
          } else if (screen.height == 568 && screen.width == 320) {
            return '1em'
          } else {
            return '2em'
          }
        }
      } else {
        return '0em'
      }
    },
  },
  data() {
    return {
      systemInfo: {
        statusBarHeight: '',
        titleBarHeight: 44,
        whiteFillHeight: '',
      },
      platSupport: true,
      taroEnv: '',
      dsBack: dsBackBlank,

      titleBO: {
        title: '',
        isOpenAlipayJump: false,
        tokenBol: false,
        arrowWhite: false,
        isNoShowArrow: false,
        isOpenBgBlue: true,
        TBRightArr: [],
        TBBg: {
          color: '',
        },
        TBTitle: {
          color: '',
        },
        TBLeft: {
          backWord: false,
        },
      },
      // titleBarObj: {
      //   title: "index", //自定义标题
      //   isOpenAlipayJump: false, //仅用于支付宝小程序，并且需要单独配置返回页面时，开启为true
      //   tokenBol: true //当页面进入时不带有token,需要点击返回按钮退出小程序时使用，开启为true,不支持支付宝小程序
      //   arrowWhite:false //箭头默认false为黑色，ture为白色
      //   isNoShowArrow:false // 不显示箭头，默认false;  显示，true
      // }
    }
  },
  created() {
    this.taroEnv = process.env.TARO_ENV
    if (this.taroEnv == 'alipay' || this.taroEnv == 'swan') {
      this.platSupport = false
    }

    this.initTitleBar()
    this.initBgColor()
  },
  mounted() {
    this.initHeight()
    this.getElementNodeFn()
  },
  beforeDestroy() {
    if ((this.taroEnv === 'alipay' || this.taroEnv === 'jd' || this.taroEnv === 'swan') && this.titleBarObj.isOpenAlipayJump) {
      console.log('titlebar-beforeDestroy')
      this.$emit('goBack')
    }
  },
  watch: {
    titleBarObj: {
      deep: true,
      handler(newVal, oldVal) {
        this.titleBO = Object.assign(this.titleBO, newVal)
      },
    },
  },
  methods: {
    initBgColor() {
      if (this.taroEnv != 'h5' && this.titleBO.isOpenBgBlue) {
        this.titleBO.TBBg.color = '#5db2ff'
      }
    },
    TBRHandleClick(TBRClickName) {
      this.$emit('TBRHandleClick', TBRClickName)
    },
    //返回上一页
    goBack() {
      dsUtils.log('goBack')
      this.$emit('goBack')
    },
    initTitleBar() {
      this.titleBO = { ...this.titleBO, ...this.titleBarObj }
      if (this.titleBO.arrowWhite) {
        this.dsBack = dsBackWhite
      }
      if (!this.titleBO.TBTitle.color) {
        this.titleBO.TBTitle.color = this.titleBO.arrowWhite ? '#fff' : '#333'
      }
    },
    initHeight() {
      let getSysInfo = dsUtils.getSystemInfoSync()
      console.log('getSysInfo', getSysInfo)
      if (this.taroEnv == 'alipay') {
        this.systemInfo.statusBarHeight = getSysInfo.statusBarHeight
        this.systemInfo.titleBarHeight = getSysInfo.titleBarHeight
      } else if (
        this.taroEnv == 'swan' ||
        this.taroEnv == 'weapp' ||
        this.taroEnv == 'jd'
      ) {
        this.systemInfo.statusBarHeight = getSysInfo.statusBarHeight
        this.systemInfo.titleBarHeight = 44
      }
    },
    getElementNodeFn() {
      this.systemInfo.whiteFillHeight=this.systemInfo.statusBarHeight+this.systemInfo.titleBarHeight
      // dsUtils
      //   .getElementNode('#contentWrap')
      //   .then((res) => {
      //       this.systemInfo.whiteFillHeight = res[0].height
          
      //   })
      //   .catch(() => {})
    },
  },
}
</script>
