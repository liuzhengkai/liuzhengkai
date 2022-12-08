<template>
  <view class="record">
    <TitleBar :title-bar-obj="titleBarObj" @goBack="goBack"/>
    <scroll-view class="ele-record" :style="{'height': 'calc(100vh - '+ titleBarHeight +'px)'}" :scroll-y="true">
      <view class="mian">
        <view class="content">
          <view class="record-order">
            <view class="record-view-info">
              <view class="order-info-line">
                <view class="order-label">订单编号</view>
                <view class="order-words">{{detail.orderId}}</view>
              </view>
              <view class="order-info-line">
                <view class="order-label">订单时间</view>
                <view class="order-words">{{detail.createTime}}</view>
              </view>
              <view class="order-info-line">
                <view class="order-label">订单状态</view>
                <view class="order-words">{{ORDERSTATUS_TEXT}}</view>
              </view>
              <view class="order-info-line">
                <view class="order-label">订单金额</view>
                <view class="order-words">{{detail.amount}}元</view>
              </view>
              <view class="order-info-line">
                <view class="order-label">红包抵扣金额</view>
                <view class="order-words">{{detail.redPackAmount}}元</view>
              </view>
              <view class="order-info-line">
                <view class="order-label">积分抵扣金额</view>
                <view class="order-words">{{detail.integralAmt}}元</view>
              </view> 
              <view class="order-info-line">
                <view class="order-label">优惠券抵扣金额</view>
                <view class="order-words">{{detail.couponAmount}}元</view>
              </view>
              <view class="order-info-line" v-if="detail.fullDeductionAmount && detail.fullDeductionAmount / 1 > 0">
                <view class="order-label">立减金额</view>
                <view class="order-words">{{detail.fullDeductionAmount}}元</view>
              </view>
              <view class="order-info-line">
                <view class="order-label">实付金额</view>
                <view class="order-words">{{detail.payAmount}}元</view>
              </view>
            </view>
            <view class="record-view-list">
              <view class="record-list-box">交费共计：{{data.CONS_NUM}}户</view>
              <view class="record-list-item" v-for="(item, index) in data.ORDER_LIST" :key="index">
                <view class="record-list-top">
                  <view class="record-list-info">
                    <view class="detail-list-num">{{item.consNo}}</view><view class="detail-symbol">|</view>
                    <view class="detail-list-name">{{item.consName}}</view>
                  </view>
                  <view class="detail-list-amount">{{item.totalAmount}}元</view>
                </view>
                <!-- 北京预付费补加扣减金额 -->
                <view class="detail-sup-ded" v-if="(item.addAmt || item.dedAmt) && item.powerUserType == '01' && item.provinceCode == '11102'">
                  <view class="detail-sup-ded-info">
                    <view class="order-label">其中补加金额</view>
                    <view class="order-words">{{item.addAmt}}元</view>
                  </view>
                  <view class="detail-sup-ded-info">
                    <view class="order-label">其中扣减金额</view>
                    <view class="order-words">{{item.dedAmt}}元</view>
                  </view>
                  <view class="detail-repair-hand" v-if="item.dedAmt && item.dedAmt > 0">
                    <view class="detail-repair-hand-info" v-if="item.repairLadderAmt && item.repairLadderAmt > 0">
                      <view class="order-label">补交阶梯差价金额</view>
                      <view class="order-words">{{item.repairLadderAmt}}元</view>
                    </view>
                    <view class="detail-repair-hand-info" v-if="item.repairLadderYm">
                      <view class="order-label">补交阶梯差价电费月份</view>
                      <view class="order-words">{{item.repairLadderYm}}</view>
                    </view>
                    <view class="detail-repair-hand-info" v-if="item.repairPresetAmt && item.repairPresetAmt > 0 ">
                      <view class="order-label">补交预置金额</view>
                      <view class="order-words">{{item.repairPresetAmt}}元</view>
                    </view>
                    <view class="detail-repair-hand-info" v-if="item.repairUrgentAmt && item.repairUrgentAmt > 0">
                      <view class="order-label">补交应急购电金额</view>
                      <view class="order-words">{{item.repairUrgentAmt}}元</view>
                    </view>
                    <view class="detail-repair-hand-info" v-if="item.repairRefundAmt && item.repairRefundAmt > 0">
                      <view class="order-label">补交退费调整金额</view>
                      <view class="order-words">{{item.repairRefundAmt}}元</view>
                    </view>
                    <view class="detail-repair-hand-info" v-if="item.repairExceedAmt && item.repairExceedAmt > 0">
                      <view class="order-label">补交煤改电超补金额</view>
                      <view class="order-words">{{item.repairExceedAmt}}元</view>
                    </view>
                    <view class="detail-repair-hand-info" v-if="item.repairExceedMonth">
                      <view class="order-label">补交煤改电超补电费月份</view>
                      <view class="order-words">{{item.repairExceedMonth}}</view>
                    </view>
                  </view>
                </view>
                <view class="detail-list-content">
                  <view class="detail-list-address">{{item.eleAddress}}</view>
                  <view class="detail-list-status">{{item.PAY_STATUS_TEXT}}</view>
                </view>
                <!-- 交费失败退款成功 -->
                <view class="detail-list-footer" v-if="item.orderStatus == '6' && item.refundStatus == '6'">
                  <view class="detail-list-refund">
                    <view class="order-label">退款状态</view>
                    <view class="order-words">{{item.REFUND_STATUS_TEXT}}</view>
                  </view>
                  <view class="detail-list-refund">
                    <view class="order-label">退款订单号</view>
                    <view class="order-words">{{item.refundId}}</view>
                  </view>
                  <view class="detail-list-refund">
                    <view class="order-label">退红包金额</view>
                    <view class="order-words">{{item.refundRedPackAmt}}元</view>
                  </view>
                  <view class="detail-list-refund">
                    <view class="order-label">退积分金额</view>
                    <view class="order-words">{{item.refundIntegralAmt}}元</view>
                  </view>
                  <view class="detail-list-refund">
                    <view class="order-label">退实付金额</view>
                    <view class="order-words">{{item.refundAmt}}元</view>
                  </view>
                </view>
              </view>
            </view>
            <view class="business-fixed-buttons" v-if="detail.orderStatus == '0' && detail.payStatus != '05'">
              <button class="msui-main-blue" @tap="gotoPay">立即付款</button>
              <button class="msui-main-blue transparent" @tap="cancerPay">取消订单</button>
            </view>
          </view>
        </view>
        <!-- <view class="auth-bg">
          <view class="auth-bg-exp">交费 · 查账 · 开票 · 办电 · 报修</view>
          <view class="auth-bg-tips">尽在网上国网App，您的随身电管家</view>
        </view> -->
      </view>
    </scroll-view>
    <Modal :modalValue="cencelModalValue" :showComponents="showCencelComponents" @cancel="cencelCancel" @confirm="cencelConfirm"/>
    <Modal :modalValue="continueModalValue" :showComponents="showContinueComponents" @cancel="continueCancel" @confirm="continueConfirm"/>
  </view>
</template>

<script>
import './detail.scss'
import TitleBar from "../../../components/titleBar/titleBar";
import { dsUtils } from "../../../bussinessUtil/dsUtils";
import Modal from "../../../components/modal/modal";
import Taro from "@tarojs/taro";

export default {
  components: { TitleBar, Modal },
  data () {
    return {
      titleBarHeight : 0,
      cencelModalValue: {       // 取消订单弹窗
        modalTitle: '关闭订单',
        modalContent: [
            {
              content: '您已提交企业网银付款申请，建议您在网银端完成付款，若已完成，请不要关闭订单，否则无法正常退款'
            }
        ],
        modalBtn: ['暂不关闭','继续关闭'],
        cancelColor: '', 
        confirmColor: '#0C82F1', 
        isContent: true,
			},
      continueModalValue: {       // 继续付款弹窗
        modalTitle: '提示',
        modalContent: [{content: ''}],
        modalBtn: ['取消','重新下单'], //弹窗按钮(一个按钮或两个按钮，默认两个)
        cancelColor: '',          // 左按钮颜色
        confirmColor: '#0C82F1',  // 右按钮颜色
        isContent: true,          // 文字是否居中
			},
      titleBarObj: {
        title         : "交电费",
        arrowWhite    : true,
        isNoShowArrow : false,
      },
      showCencelComponents  : false,      // 取消付款弹窗
      showContinueComponents: false,      // 继续付款弹窗
      detail: {
        "createTime"      : "",   // 订单时间
        "orderId"				  : "",   // 订单编号
        "orderStatus"			: "",   // 订单状态
        "amount"				  : "",   // 订单金额
        "redPackAmount" 	: "",   // 红包抵扣金额
        "integralAmt"   	: "",   // 积分抵扣金额
        "fullDeductionAmount": "",// 立减金额
        "consNo"        	: "",   // 户号
        "payAmount"				: "",   // 实付金额
        "purIntabStatus"	: "",	  // 北京购电入表状态  02入表成功
        "payStatus"				: "",	  // 支付状态 05支付中
        "couponAmount"		: "",   // 优惠券抵扣金额
        "userId"          : "",   // userId
        "payName"         : "",   // 支付方式
      },
      data : {
        "ORDER_STATUS_TEXT" : "",
        "CONS_NUM"          : 0,
        "ORDER_LIST"        : [],
      },
      orderId             : "",
      closeType           : "",
      isJdChannel         : false,
    }
  },
  computed : {
    ORDERSTATUS_TEXT() {
    	switch (this.detail.orderStatus) {
        case "0" : return this.detail.payStatus == "05" ? "支付中" : "待付款";
        case "1" : return "待发货";
        case "2" : return "待收货";
        case "3" : return "已付款";
        case "4" : return "已关闭";
        case "5" : return "退款中";
        case "6" : return "退款成功";
        case "7" : return "退款失败";
        default: return "";
			}
    },

  },
  onShow() {
    this.orderId = dsUtils.getStorageSync("jdmporderid") || dsUtils.getStorageSync("DS_orderId") || this.orderId;
    console.log('detail---onShow---DS_orderId',dsUtils.getStorageSync("DS_orderId"))
    console.log('detail---onShow---orderId',this.orderId)
    Taro.removeStorageSync("jdmporderid");
    dsUtils.removeStorageSync("DS_orderId");

    this.isJdChannel = dsUtils.getStorageSync("DS_isJdChannel") ? dsUtils.getStorageSync("DS_isJdChannel") : this.isJdChannel;
    dsUtils.removeStorageSync("DS_isJdChannel");

    let eleList = dsUtils.getStorageSync("DS_eleRecordInfo");
    dsUtils.removeStorageSync("DS_eleRecordInfo");
    
    if (eleList && eleList != "") {
      this.ELE_RECORD_TEXT(eleList);
    } else {
      this.getDetailInfo();
    }
  },
  methods: {
    goBack() {
      dsUtils.navigateBack(1)
    },
    gotoPay() { // 立即付款
      let that = this;
      dsUtils.request("osg-oc0002/member/c1/f11", {
        params : {
          "busType"	: "1",
          "orderId" : that.orderId,
          "userId"	: that.detail.userId
        },
        paramsFlag  : "2",
        code        : "1",
        success(response) {
          switch(response["rcode"]) {
            case "1":
              if (response["payStatus"] == "01") {  // 跳转支付页
                
                dsUtils.navigateTo({
                  url: '/packageDSPay/pages/confirmpay/confirmpay' +
                    `?ORDER_ID=${response["ordNo"]}&SALE_PAY_ID=${that.detail.channelOrderId}&sendPayMoney=${response["payAmount"]}&STOP_WATCH=B90000001`
                });
                return;
              }
              break;
            case "3": // 存在企业支付
              that.continueModalValue.modalContent[0].content = response["resultMsg"] || response.message
              that.showContinueComponents = true;
              break;
            case "4": // 当前账号下的待支付订单笔数>=1
              // dsUtils.showModal({
              //   title: "提示",
              //   content: response["resultMsg"] || response.message,
              //   success: res => {},
              //   fail: res => {},
              //   // confirmText: "重新下单",
              //   cancelText: "取消"
              // });
              dsUtils.toast(response.resultMsg || response.message);
              break;
            default :
              dsUtils.toast(response.resultMsg || response.message);
              break;
          }
        }
      });
    },
    continueCancel() {    // 存在企业支付弹窗取消
      this.showContinueComponents = false;
    },
    continueConfirm() {   // 存在企业支付弹窗继续
      dsUtils.navigateTo({
        url: '/packageDSEleCharge/pages/eleList/eleList'
      });
    },
    cencelCancel() {      // 取消订单取消
      this.showCencelComponents = false;
    },
    cencelConfirm() {     // 取消订单继续
      let params = {
        "orderId"   : this.orderId,
        "closeType"	: this.closeType  // 01:校验企业支付  02:不校验企业支付
      }
      this.cancerPaySendInface(params);
    },
    cancerPay() { // 取消订单
      let params = {
        "orderId"   : this.orderId,
        "closeType"	: "01"
      }
      this.cancerPaySendInface(params);
    },
    cancerPaySendInface(params){
      let that = this;
      dsUtils.request("osg-oc0002/member/c1/f10", {
        params,
        paramsFlag : "2",
        code       : "1",
        success(response) {
          switch(response.rcode) {
            case "1": 
                that.showCencelComponents = false;
                that.getDetailInfo();
                dsUtils.toast("订单取消成功");
              break;
            case "2":
                that.closeType = response.closeType;
                that.showCencelComponents = true;
              break;
            default:
              dsUtils.toast(response.resultMsg || response.message );
              break;
          }
        }
      });
    },
    getDetailInfo() {
      var that = this;
      let orderId = that.isJdChannel ? 'erpOrderId' : 'orderId'
      dsUtils.request("osg-oc0002/member/c1/f02", {
        params : {
          [orderId] : that.orderId
        },
        paramsFlag : "2",
        code       : "1",
        showLoad   : "1",
        success(response) {
          that.ELE_RECORD_TEXT(response);
        }
      });
    },

    ELE_RECORD_TEXT(recordData) {
      if (recordData &&  recordData.list &&  recordData.list.length > 0) {
        recordData.list.forEach(item => {
          item.PAY_STATUS_TEXT  =  this.PAY_STATUS(item),                     // 订单状态
          item.REFUND_STATUS_TEXT = this.REFUND_STATUS(item.refundStatus);    // 退款状态 
        });
      }
      this.detail = recordData;
      this.data = {
        "ORDER_STATUS_TEXT" : this.ORDER_STATUS(recordData),
        "CONS_NUM"          : recordData.list ? recordData.list.length : 0,
        "ORDER_LIST"        : recordData.list
      };
    },
    ORDER_STATUS(order) {
      switch (order.orderStatus) {
        case "0" : return order.payStatus == "05" ? "支付中" : "待付款";
        case "1" : return "待发货";
        case "2" : return "待收货";
        case "3" : return "已付款";
        case "4" : return "已关闭";
        case "5" : return "退款中";
        case "6" : return "退款成功";
        case "7" : return "退款失败";
        default: return "";
      }
    },
    PAY_STATUS(order) {
      switch (order.orderStatus) {
        case "0" : return "";
        case "3" :
          if (order.shipStatus=="02") {					// 销账状态 
            if (order.provinceCode == "11102" || order.provinceCode == "51101") {		// 北京、四川
              return order.purIntabStatus == "02" ? "入表成功" : "购电成功";
            } else {
              return "交费成功";
            }
          } else if (order.shipStatus=="03") {
            if (order.provinceCode == "11102" || order.provinceCode == "51101") {		// 北京、四川
              return "购电失败";
            } else {
              return "交费失败";
            }
          } else {
            if (order.provinceCode == "11102" || order.provinceCode == "51101") {		// 北京、四川
              return "购电中";
            } else {
              return "交费中";
            }
          }
        case "4" : return "";
        case "6" : return "交费失败";
        case "7" : return "交费失败";
        default: return "";
      }
    },
    REFUND_STATUS(refundStatus) {
      switch (refundStatus) {
        case "5"	: return "退款中";
        case "6"	: return "已退款";
        case "7"	: return "退款失败";
        default		: return "";
      }
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
}
</script>
