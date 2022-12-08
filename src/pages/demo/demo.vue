<template>
  <view :class="careEnv === '1' ? 'careWrap' : 'defaultWrap'">
    <TitleBar :title-bar-obj="titleBarObj" @goBack="goBack" />
    <view
      class="move-view"
      @touchstart="touchStartHandle"
      @touchmove="touchMoveHandle"
    >
      快来点我呀
    </view>
    <view class="index">
      <text class="fs20 titleBarTest">
        {{ msg }}
      </text>
    </view>
    <view>
      H5密码键盘
    </view>
    <view v-if="taroEnv !== 'alipay'">
      <view  @tap="getHeight" style="border:1px solid #f00;">
         <input id="PAYPSW_COMPLEX1" class="keyboard" maxlength="6" type="password" label="支付密码" placeholder="请输入8-12位数字和字母组合"  autocomplete="new-password"  data-ktype="Number"/>
      </view>
     
      <input id="PAYPSW_COMPLEX2" class="keyboard" maxlength="12" type="password" label="确诊密码" placeholder="请输入8-12位数字和字母组合"  autocomplete="new-password"  />
      <input id="PAYPSW_COMPLEX3" class="keyboard" maxlength="12" type="password" label="确诊密码" placeholder="请输入8-12位数字和字母组合"  autocomplete="new-password"  />
      <button @tap="submit">提交</button>
    </view>
    <view class="index">
      <text class="fs20 titleBarTest">
        {{ msg }}
      </text>
    </view>
    <view />
    <view>
      <view>
        <button type="primary" class="mb10" @tap="setStorageFn">
          缓存创建使用
        </button>
      </view>
      <view>
        <button type="primary" class="mb10" @tap="removeStorageFn">
          缓存删除使用
        </button>
      </view>
      <view>
        <button type="primary" class="mb10" @tap="requestFn">
          接口调用
        </button>
      </view>
      <view>
        <button type="primary" class="mb10" @tap="zhuliFn">
          接口调用助力列表
        </button>
      </view>
      <view>
        <button type="primary" class="mb10" @tap="showModalFn">
          showModal
        </button>
      </view>
      <view />
      <view>
        <button type="primary" class="mb10" @tap="tradePayFn">
          唤起支付
        </button>
      </view>
      <view>
        <button type="primary" class="mb10" @tap="goGZHFn">
          跳转外链
        </button>
        <view v-if="goGZHShow">
          <web-view src="https://mp.weixin.qq.com/s/JGI7HPkeRfnXiPd_X6m33g" />
        </view>
      </view>
    </view>
    <view style="height:100px;border:1px solid #f00;">
      {{ info }}
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeChooseAddressInfo">
        WSGW获取城市
      </button>
    </view>
    <view>
      <text>{{ chooseAddressInfo }}</text>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeInit">
        WSGW获取基础数据
      </button>
    </view>
    <view>
      <text>{{ initInfo }}</text>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeJumpToMenu">
        WSGW微应用间跳转
      </button>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeSetTempCache">
        WSGW设置缓存
      </button>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeGetTempCache">
        WSGW获取缓存
      </button>
    </view>
    <view>
      <text>{{ tempCache }}</text>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeChooseAndUpLoadImage">
        WSGW选择并上传图片
      </button>
    </view>

    <view v-for="(item, index) of attachment" :key="index">
      <image :src="'data:image/jpeg;base64,' + item.fileContent"> </image>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeClose">
        WSGW关闭当前页
      </button>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeJumpAppHome">
        WSGW跳转APP首页
      </button>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeJumpToTitleView">
        WSGW打开资讯页面
      </button>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeDownloadToPhone">
        WSGW存图片到本地
      </button>
    </view>
    <view>
      <image
        src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fquotlr.com%2Fimages%2Fquotes%2Fdont-let-the-past-steal-your-present-your-past-has-not-defined-deterred-or-defeated-you-it.jpg&refer=http%3A%2F%2Fquotlr.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1632044746&t=a7ae37dd3bc69248143e875223d463eb"
      >
      </image>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeScanQrCode">
        WSGW绑定户号扫描二维码
      </button>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeHowToGetConsNum">
        WSGW如何获取户号
      </button>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeConsNoFuzzyQuery">
        WSGW户号模糊搜索
      </button>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeFromJsFunctionQrDroid">
        WSGW长按识别二维码
      </button>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeFromJsFunctionShare">
        WSGW分享方法
      </button>
    </view>
    <view>
      <text>{{ share }}</text>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeDataCollection">
        WSGW数据采集
      </button>
    </view>
    <view>
      <text>{{ dataCollection }}</text>
    </view>
    <view>
      <button type="primary" class="mb10" @tap="bridgeTradepay">
        WSGW支付
      </button>
    </view>
    <view>
      <text>{{ bridgeTradepayData }}</text>
    </view>
  </view>
</template>

<script>
import "./demo.scss";
import Taro from "@tarojs/taro";
import TitleBar from "@/components/titleBar/titleBar";
import { dsUtils } from "@/dsUtils";
// import { SecurityPad } from '../../utils/h5/keyboard-wrap';

export default {
  components: { TitleBar },
  data() {
    return {
      msg: "3.调研不同环境，引入不同样式，关怀版demo!",
      info: "",
      jump: "1",
      systemInfo: {},
      careEnv: "1",
      taroEnv: process.env.TARO_ENV,
      goGZHShow: false,
      attachment:[],
      titleBarObj: {
        title: "demo",
        // isOpenAlipayJump: true,
        // tokenBol: false,
        arrowWhite:true ,
        // isNoShowArrow:false
      },
      chooseAddressInfo:'我是选择地区返回值1',
      initInfo:'我是初始化信息返回值',
      tempCache:'我是获取缓存返回值',
      share:'我是分享方法返回值',
      dataCollection:'我是数据采集返回值 ',      
      bridgeTradepayData:'我是原生支付返回值 ',    
      initPad:{}
    };
  },
  created() {
    console.log(`process.env.NODE_ENV:${process.env.NODE_ENV}`)
    this.careEnv = dsUtils.careEnv
    dsUtils.log(careEnv, true);
    this.getInfo();
    dsUtils.log(dsUtils.formatDate("2021-08-09", "normal"));
  
    
    // window.vuePageShowAgain = this.requestFn
  },
  mounted(){
    this.testPublishEnv()
      if(this.taroEnv == 'h5'){
    const getSecurityPad= require( '../../utils/h5/keyboard-wrap')
    this.initPad = getSecurityPad
    console.log(this.initPad)
    setTimeout(()=>{
      this.initPad.SecurityPad.init('https://wsgw.95598pay-test.com:29943')
    },0)
    }
  },
  methods: {
    testPublishEnv(){
      /*
      1.默认生产环境 https://osg-service.sgcc.com.cn:18600
2.灰度环境 （1）默认：https://osg-service-simu.sgcc.com.cn:28600 （2）电费专用：https://osg-base-simu.sgcc.com.cn:28660
3.北七家 （1）默认: http://211.160.62.35:28600 (2)电费专用：http://211.160.62.37:28660
4.护网环境：http://30.20.110.183:18000 
      */ 
     let url = baseUrl
    //  let url = 'https://osg-service.sgcc.com.cn:18600' // 0
    //  let url = 'https://osg-service-simu.sgcc.com.cn:28600'// 1
    //  let url = 'https://osg-base-simu.sgcc.com.cn:28660'// 1.1
    //  let url = 'http://211.160.62.35:28600'// 2
    //  let url = 'http://211.160.62.37:28660'// 2.1
    //  let url = 'http://30.20.110.183:18000'// 3
     console.log('*********************::::'+dsUtils.publishEnv(url))
    },
    getHeight(){
      console.log(this.initPad.SecurityPad.height('PAYPSW_COMPLEX1'))
    },
    submit(){
      let length = this.initPad.SecurityPad.length('PAYPSW_COMPLEX1');
      console.log(this.initPad.SecurityPad)
     
				if (length > 12 || length < 8 ) {
					dsUtils.toast("请输入8-12位数字和字母组合");
					return false;
				}
       console.log(this.initPad.SecurityPad.value('PAYPSW_COMPLEX1'))
       console.log(this.initPad.SecurityPad.value('PAYPSW_COMPLEX2'))
       console.log(this.initPad.SecurityPad.same('PAYPSW_COMPLEX1', 'PAYPSW_COMPLEX2'))
    },
    bridgeChooseAddressInfo() {
      let data = {"type":"12","codeValue":"","showHotCitys":"1"}
      dsUtils.bridge_chooseAddressInfo(data,(res)=>{
        this.chooseAddressInfo = JSON.stringify(res)
      });
    },
    bridgeInit() {
      dsUtils.bridge_init((res)=>{
        this.initInfo = JSON.stringify(res)
      });
    },
    bridgeJumpToMenu() {
      let data = { menuId: "B90000001", url: "/record-collect-rotation.html" };
      dsUtils.bridge_jumpToMenu(data);
    },
    bridgeSetTempCache() {
      let data = { key: "coupon", value: { SOURCE_TYPE: "01" } };
      dsUtils.bridge_setTempCache(data);
      dsUtils.bridgeJumpToMenu({
        menuId: "B40070000",
        url: "/coupon.html"
      });
    },
    bridgeGetTempCache() {
      let data = { key: "coupon" };
      dsUtils.bridge_getTempCache(data, res => {
        console.log(res);
        this.tempCache = JSON.stringify(res)
      });
    },
    bridgeChooseAndUpLoadImage() {
      let data = {
        count: 1,
        contractChannel: "22",
        areaNo: '11102',
        serviceType: "A10070700",
        busiType: "101",
        busiSubType: "",
        token: "98t16ca78aae5cf4a4c854d835909d56181",
        picType: ""
        // target: this.$route.query.PROVINCE_CODE,
        // isShowFile: "0",
        // documentType: null
      };
      console.log(data)
      dsUtils.bridge_chooseAndUpLoadImage(data, (res) => {
        console.log(res)
        if(res.code == 1){
          this.attachment = res.data.attachment
        }
      });
    },
    bridgeClose() {
      dsUtils.bridge_close();
    },
    bridgeJumpAppHome() {
      dsUtils.bridge_jumpAppHome();
    },
    bridgeJumpToTitleView() {
      let data = {
        url: "http://211.160.62.32:18001/omg-static/00305101748182104881800738633111.html",
        title: "开一个在线h5页面，并支持分享",
        shareTitle: "",
        image: "",
        isShare: "",
        description: ""
      };
      dsUtils.bridge_jumpToTitleView(data);
    },
    bridgeDownloadToPhone() {
      let data = { imageType: "01", image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fquotlr.com%2Fimages%2Fquotes%2Fdont-let-the-past-steal-your-present-your-past-has-not-defined-deterred-or-defeated-you-it.jpg&refer=http%3A%2F%2Fquotlr.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1632044746&t=a7ae37dd3bc69248143e875223d463eb" };
      dsUtils.bridge_downloadToPhone(data);
    },
    bridgeScanQrCode() {
      let data = { proviceId: "35101", cityCode: "" };
      dsUtils.bridge_scanQrCode(data, () => {});
    },
    bridgeHowToGetConsNum() {
      let data = { proCode: "35101" };
      dsUtils.bridge_howToGetConsNum(data);
    },
    bridgeConsNoFuzzyQuery() {
      dsUtils.bridge_consNoFuzzyQuery(() => {});
    },
    bridgeFromJsFunctionQrDroid() {
      let data = { QRValue: "", QRType: "" };
      dsUtils.bridge_fromJsFunction_qrDroid(data, () => {});
    },
    bridgeFromJsFunctionShare() {
      let data = {
        title: "测试分享",
        imageType: "01",
        image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fquotlr.com%2Fimages%2Fquotes%2Fdont-let-the-past-steal-your-present-your-past-has-not-defined-deterred-or-defeated-you-it.jpg&refer=http%3A%2F%2Fquotlr.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1632044746&t=a7ae37dd3bc69248143e875223d463eb",
        url: "https://www.baidu.com/",
        description: "测试分享description",
        array: [ "wechat", //微信
          "wechatTimeLine", //朋友圈
]
      };
      dsUtils.bridge_fromJsFunction_share(data, (res) => {
        this.share= JOSN.stringify(res)
      });
    },
    bridgeDataCollection() {
      let data = {};
      dsUtils.bridge_dataCollection(data);
      this.dataCollection = '采集成功了。'
    },
    bridgeTradepay() {
      if(dsUtils.bridge_tradePay()){
        console.log('我是原生支付')
      } else {
        console.log('我是其他支付')
      }
    //   let data={
    // "PRE_ORDER_ID":"2017111521001104105336677922",
    // "AMOUNT":"100",
    // "BUS_TYPE":"A002",
    // "MERCHANT_NAME":"商户名称",
    // "STOP_WATCH":"e享家微应用id"
    // }
    //   dsUtils.bridge_tradePay(data,(res)=>{
    //     console.log(res)
    //     this.bridgeTradepayData = res
    //   });
      
    },
    goGZHFn() {
      this.goGZHShow = true;
    },
    goBack() {
      dsUtils.navigateBack(1);
      if (this.taroEnv === "weapp") {
        dsUtils.navigateTo({ url: "/packageDSPay/pages/index/index" });
      } else {
        // dsUtils.navigateBack(1)
      }
    },
    touchStartHandle(e) {
      console.log(e);
    },
    touchMoveHandle(e) {
      console.log(e);
    },
    removeStorageFn() {
      dsUtils.removeStorage("DS_token");
      dsUtils.removeStorage("token");
    },
    setStorageFn() {
      dsUtils.setStorage("token", "abc");
      dsUtils.setStorage("DS_token", "abc");
    },
    requestFn() {
      var params = {
        TYPE: "0"
      };
      dsUtils.request("osg-p0002/member/p1/f01", {
        params: params,
        success: res => {
          console.log("业务接口出参数");
          console.log(res);
        }
        // showLoad:'abc'// 是否显示加载toast,l默认为'0 如果不传则请求开始之前,都会出现loading.若不需要,则传'1'
        // paramsFlag: "1", //传参不需要再包装一层,请传此参数,值为0,若为默认嵌套,则不需要传
        // code: "1" //请求成功code码不为0,请自定义成功编码
      });
    },
    zhuliFn() {
      let dataObj = {
        serviceCode: "01030022",
        target: "wsgw",
        source: "01",
        data: {
          requestId: new Date().getTime(),
          token: "98tb333a6e639614588854568a0e3a2bd67",
          proNo: "",
          page: "1",
          pageSize: "10"
        }
      };
      dsUtils.request("osg-p0014/acAssistance/c1/f01", {
        params: dataObj,
        success: res => {
          console.log("业务接口出参数");
          console.log(res);
        },
        fail: res => {
          console.log(res);
        },
        paramsFlag: "1",
        code: "1"
      });
    },
    tradePayFn() {
      dsUtils.tradePay(
        '2017111521001104105336677922',
        res => {
          dsUtils.log("demo 调用");
          dsUtils.log(res);
          dsUtils.log(res, true); // {"result":"","resultCode":"6001","callbackUrl":"","memo":"支付未完成","extendInfo":{}}
          dsUtils.log("支付成功");
          // my.alert({
          //   content: JSON.stringify(res)
          // });
        },
        res => {
          dsUtils.log(res);
          dsUtils.log(res, true);
          dsUtils.log("支付失败");
          // my.alert({
          //   content: JSON.stringify(res)
          // });
        }
      );
    },
    showModalFn() {
      dsUtils.showModal({
        title: "是否退出支付？",
        content: "您订单将取消",
        success: res => {
          console.log(res);
          if (res.confirm) {
            console.log("继续支付");
          } else {
            console.log("退出支付");
          }
        },
        fail: res => {
          console.log(res);
          console.log("fail");
        },
        confirmText: "继续支付",
        cancelText: "退出支付"
      });
    },
    getInfo() {
      this.info = "zhihui333";
    },
    gotoDemo() {
      Taro.navigateTo({
        url: "pages/demo/demo"
      });
    }
  }
};
</script>
