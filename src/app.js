import './app.scss'
import './utils/h5/deprecated.js'; // 非h5发版需注释文件中内容
import AOP from './utils/wsgwH5Sdk/wsgwH5Sdk'
import { util } from './utils/util';
import Vue from 'vue';
import tap from './utils/tap.js';
import Taro from '@tarojs/taro'

const directives = {
  tap
}

Object.keys(directives).forEach(key => Vue.directive(key, directives[key]))


const App = {
  onShow (options) {
  },
  onLaunch: function (e) {
    Taro.setStorageSync("jdmporderid", e?.query?.jdmporderid);
    console.log(e,'app.js--onLaunch')
    console.log(Taro.getStorageSync("jdmporderid"),'jdmporderid')
    if(process.env.TARO_ENV != 'h5'){
      AOP.initSDK({'envFlag':1})
      util.initTingyunSdk()
    }
    util.initVConsole()
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  },
  // SDKVERSION: '1.2021.00.00.00'
}
//四位版本号,第一位代表sdk大版本号 第二位代表年份 第三位代表月份 第四位代表日 第5️位标记当天打的第几个版本
console.log('%c' +'发版请修改：'+ SDKVERSION, "color:red")

export default App;
