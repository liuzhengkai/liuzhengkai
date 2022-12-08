<template>
  <view class="record">
    <TitleBar :title-bar-obj="titleBarObj" @goBack="goBack" />
    <scroll-view class="ele-record" :scroll-y="true" :scroll-top="TOP_NUM"  @scroll="scrollBox($event)">
      <view class="ele-record-list" v-if="RECORD_LIST.length > 0">
        <view>
          <view class="record-list-item"
          v-for="(item, index) in RECORD_LIST_DATA"
          :key="index"
          @tap="jumpDetail(item)">
            <view class="list-item-title">
              <view class="list-item-left">电费交纳</view>
              <view class="list-item-right">
                {{item.serContent.ORDER_STATUS_TEXT}}</view>
            </view>
            <view class="list-item-info number">用电户号：{{ item.serContent.consNo }}</view>
            <view class="list-item-info">交费金额：{{ item.serContent.amount }}元</view>
            <view class="list-item-info">{{ item.serContent.createTime }}</view>
          </view>
        </view>
        <view class="list-item-tips" :class="{'btn': IS_ANDROID}">{{ PAGE_DATA.RECORD_LIST_TIPS }}</view>
      </view>
      <view class="ele-record-empty" v-else>
        <image
          class="record-empty-img"
          src="../../images/ds_record_empty.png"
          alt=""
        />
        <view class="record-empty-words">您还没有交过电费，请交费后再进行查询！</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import "./index.scss";
import TitleBar from "../../../components/titleBar/titleBar";
import { dsUtils } from "../../../bussinessUtil/dsUtils";

export default {
  components: { TitleBar },
  data() {
    return {
      titleBarHeight: 0,
      titleBarObj: {
        title: "交电费",
        arrowWhite: true,
        isNoShowArrow: false,
      },
      RECORD_LIST: [],
      PAGE_DATA: {
        PAGE_NO: 1,
        RECORD_LIST_TIPS: "上滑继续查看",
        MORE: true,
      },
      IS_ANDROID: false,
      TOP_NUM : 0
    };
  },
  computed: {
    RECORD_LIST_DATA() {
      let that = this;
      return this.RECORD_LIST.map(function (item) {
        item.serContent.ORDER_STATUS_TEXT = that.STATUS_TEXT(item.serContent);
        return item;
      });
    },
    STATUS_TEXT() {
      return function (content) {
        switch (content.orderStatus) {
          case "0":
            return content.payStatus != "01" ? "付款中" : "待付款";
          case "1":
            return "待发货";
          case "2":
            return "待收货";
          case "3":
            return "已付款";
          case "4":
            return "已关闭";
          case "5":
            return "退款中";
          case "6":
            return "退款成功";
          case "7":
            return "退款失败";
          default:
            return "";
        }
      };
    },
  },
  created() {
    dsUtils.dataCollection({
        "ACTTYPE": '0204',
        "SERVICEID": 'W20211008010301',
        "PAGENAME": '交费小程序：交费记录页',
        "CHANNEL": dsUtils.getUserInfo().channelCode,
    })
  },
  mounted() {
    this.IS_ANDROID = navigator.userAgent.indexOf("Android") >= 0;
  },
  onShow() {
    this.PAGE_DATA = {
      RECORD_LIST_TIPS: "上滑继续查看",
      PAGE_NO: 1,
      MORE: true,
    };
    this.TOP_NUM = 0;
    this.getList();
  },
  // onReachBottom() {
  //   if (this.PAGE_DATA.MORE) {
  //     this.PAGE_DATA.PAGE_NO ++;
  //     this.getList();
  //   }
  // }, 
  methods: {
    scrollBox(e) {
      dsUtils.log('----滑动区域-----')
      let scrollTop = e.target.scrollTop; //滚动条距离顶部距离
      let scrollHeight = e.target.scrollHeight;   
      let clientHeight = e.target.clientHeight || dsUtils.getSystemInfoSync().windowHeight; //当前视口高度
     if (scrollTop + clientHeight > scrollHeight) {
       if (this.PAGE_DATA.MORE && this.RECORD_LIST.length > 0) {
          if (this.TOP_NUM == 0) {
            this.TOP_NUM  =  scrollTop;
          }
          this.PAGE_DATA.MORE = false;
          this.PAGE_DATA.PAGE_NO++ ;
          this.getList();
        }
      }
    },  
    goBack() {
      dsUtils.navigateBack(1);
    },
    getList() {
      var that = this;
      dsUtils.request("osg-uc0004/member/c2/f02", {
        params: {
          pageSize: 10,
          pageNo: this.PAGE_DATA.PAGE_NO,
          busyTypeCode: "02", // 业务类型 订单中心服务记录代码：02
          subBusyTypeCode: "0201", // 业务项； 0201:电费
        },
        paramsFlag: "2",
        code: "1",
        success(response) {
          if (that.PAGE_DATA.PAGE_NO == 1) {
            that.RECORD_LIST = [];
          }
          if (response && response.length >= 10) {
            that.PAGE_DATA.RECORD_LIST_TIPS = "上滑继续查看";
            that.PAGE_DATA.MORE = true;
          } else {
            that.PAGE_DATA.RECORD_LIST_TIPS = "已经到底了";
          }
          that.RECORD_LIST.push(...response);
        },
      });
    },
    jumpDetail(detail) {
      let orderId = detail.serContent.orderId;
      // dsUtils.request("osg-oc0002/member/c1/f02", {
      //   params: {
      //     orderId: orderId,
      //   },
      //   paramsFlag: "2",
      //   code: "1",
      //   success(response) {
          dsUtils.setStorageSync("DS_orderId", orderId);
          // dsUtils.setStorageSync("DS_eleRecordInfo", response);
          dsUtils.navigateTo({
            url: "/packageDSRecord/pages/detail/detail",
          });
      //   },
      // });
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