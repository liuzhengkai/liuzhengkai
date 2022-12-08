<template>
  <view :class="careEnv == '1'? 'careWrap':'defaultWrap'">
    <view class="container_ele">
      <TitleBar :title-bar-obj="titleBarObj"  @goBack="goBack"/>
      <image class="header_bg" v-if="taroEnv == 'h5'" mode="widthFix" src="../../images/ds_header_eleList.png"></image>
      <image class="header_bg" v-else mode="widthFix" src="../../images/ds_header.png"></image>
      <view class="content_box" :class="taroEnv == 'h5' ? 'ELE_TitleBar_H5' : 'ELE_TitleBar_Alipay'">
        <view class="ele_tips">您可以为以下常用户号进行交费</view>
        <view :class="taroEnv == 'h5' ? 'ele_list_h5' : 'ele_list_alipay'">
          <scroll-view>
            <view class="ele_list_item" v-model="ELEC_TYPE_LIST" v-for="(item, index) in ELEC_TYPE_LIST" :key="index" :class="{active:item.isTouchMove}" @tap="goDetail(item)" :data-index='index' :data-item="item" @touchstart="drawStart" @touchmove="drawMove">
              <view class="ele_content">
                <view class="name_box">
                  <text class="name">{{item.POWER_USER_NAME}}</text>
                  <image class="right-arrow" src="../../../assets/images/ds_right_arrow.png"></image>
                </view>
                <view class="consNum">用电户号：<text>{{item.POWER_USER_ID}}</text></view>
                <text class="address">{{item.POWER_USER_ADDR}}</text>
              </view>
              <view class="del" @tap="delItem($event,item.POWER_USER_ID,item.BING_ACCOUNT_CODE,item.PROVINCE_CODE,item.SENSITIVE_POWER_USER_ID)">
                <image class="remove_img" src="../../images/ds_remove.png"></image>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
	  <view class="h5_footer" v-if="taroEnv == 'h5'">
		  <button :class="taroEnv == 'h5' ? 'btn_green_eleList' : 'btn_eleList'" @tap="addcons">为其他户号交费</button>
	  	  <TableBar @goBack="goBack" @goHome="goHome"/>
	  </view>
      <view class="footer" v-else>
        <button class="btn_eleList" @tap="addcons">为其他户号交费</button>
        <view class="record" @tap="goRecord">查看交费记录</view>
      </view>
      <Modal :modalValue="modalValue" :showComponents="showComponents" @cancel="cancel" @confirm="confirm"/>
	  <view class="springFrameMask" v-show="showSpringFrameMask">
		<view class="springFrame">
			<image class="springFrameImage" mode="widthFix" :src="PICTURE_URL" v-show="POP_TYPE== '01' || POP_TYPE== '03'" @tap="toMenu"></image>
			<view class="springFrameContent" v-show="POP_TYPE== '01' || POP_TYPE== '02'" @tap="toMenu">
				<view class="springFrameContentTitle">{{POP_TITLE}}</view>
				<view class="springFrameContentTitleContext">{{POP_TEXT}}</view>
			</view>
			<image class="closeFrame" @tap="closeFrame" src="../../images/ds_closeFrame.png"></image>
		</view>
	  </view>
	  <Toast v-if="innerText.length" :innerText="innerText" />
    </view>
  </view>
</template>

<script>

import "./eleList.scss";
import { dsUtils } from "@/dsUtils";
import TitleBar from "@/components/titleBar/titleBar";
import Modal from "@/components/modal/modal";
import TableBar from "@/components/tableBar/tableBar";
import { _touchstart,_touchmove } from "../../../bussinessUtil/commonPlugin/touch";
import Toast from '@/components/toast/toast.vue';
export default {
  components: { TitleBar, Modal, TableBar, Toast },
	data() {
		return {
			titleBarObj: {
				title: "交电费",
				arrowWhite: true, //箭头默认false为黑色，ture为白色
				isOpenBgBlue: false, // true 背景蓝。 false 默认色。
			},
			showComponents: false, // 是否显示弹框
			modalType: '', // 弹框类型 del|query
			modalValue: {
				modalTitle: '提示',//弹窗标题
				modalContent: [
					{
						content: '弹框内容'
					}
				],//弹窗内容
				modalBtn: ['取消', '确认'], //弹窗按钮(一个按钮或两个按钮，默认两个)
				cancelColor: '', // 左按钮颜色
				confirmColor: '', // 右按钮颜色
                isContent: true, // 文字是否居中
			},
			ELEC_TYPE_LIST: [], // 电费列表
			power_user_id: '', // 户号（删除户号接口参数）
			province_code: '', // 省码
			sensitive_power_user_id: '', // userId
			taroEnv: '', // 环境标识
      		careEnv: '', // 0: 普通版; 1: 关怀版
			LEFT_QUERY_CODE: '', // 弹框左按钮跳转码值
			RIGHT_QUERY_CODE: '', // 弹框右按钮跳转码值
			flag: true, //是否自动跳转添加户号页面标识
			showSpringFrameMask: false, // 默认开启列表弹框
			POP_TYPE: '', // 弹框类型 00=无 、 01=图+文 、 02=文 、 03=图
			POP_TITLE: '' , //标题
			POP_TEXT: '' , //文本
			PICTURE_URL: '' , //图片地址
			STOP_WATCH: '' , //场景业务类型
			SKIP_URL: '' , //场景h5url
			SKIP_PARAMS: '' , //H5封装参数
			innerText: '', // message提示字段
		}
	},
	onShow() {
		this.getEleList()
	},
	created() {
		this.taroEnv = process.env.TARO_ENV;
    	this.careEnv = dsUtils.careEnv;
		dsUtils.dataCollection({
			"ACTTYPE": '0204',
			"SERVICEID": 'W2021000301',
			"PAGENAME": '交费小程序：户号选择页',
			"CHANNEL": dsUtils.getUserInfo().channelCode,
		})
	},
	mounted() {
		// 进入页面，隐藏webview容器topbar
		if(dsUtils.bridge_WSGWBridge()){
			var data={
				"key": "hiddenNavigitor",
				"value": {"hiddenNavigitor":"0"}
			}
			dsUtils.bridge_setTempCache(data)
		}
 		
	},
	methods: {
		toMenu() {
			let that =this
			if(that.STOP_WATCH) {
				if(that.taroEnv == 'h5') {
					dsUtils.bridge_setTempCache(that.SKIP_PARAMS)
					dsUtils.bridge_jumpToMenu({menuId: that.STOP_WATCH, url: that.SKIP_URL})
					// 若需传入参数 需用 dsUtils.bridge_setTempCache 方法写入缓存
					// dsUtils.bridge_setTempCache({ key: "xxx", value: that.SKIP_PARAMS});
				} else {
					if(that.SKIP_URL) {
						dsUtils.navigateTo({
							url: `/packageDSEleCharge/pages/webView/webView?url=${that.SKIP_URL}`
						})
					}
				}
			}
		},
		closeFrame() {
			this.showSpringFrameMask = false
		},
		// app端点返回，关闭当前页面
		goBack(){
			if(dsUtils.bridge_WSGWBridge()){
				dsUtils.bridge_close()
			} else {
				dsUtils.navigateBack(1);
			}
		},
		goHome() {
			if(dsUtils.bridge_WSGWBridge()){
				dsUtils.bridge_close()
			}
		},
		// 弹框左按钮
		cancel() {
			this.showComponents = false;
			if(this.modalType == 'query') {
				if(this.LEFT_QUERY_CODE == '1') {
					dsUtils.navigateTo({
						url: "/packageDSEleCharge/pages/payElectricityCharges/payElectricityCharges"
					})
				}
			}
		},
		// 弹框右按钮
		confirm() {
			this.showComponents = false;
			if(this.modalType == 'del') {
				this.deleteItem()
			} else {
				if(this.RIGHT_QUERY_CODE == '1') {
					dsUtils.navigateTo({
						url: "/packageDSEleCharge/pages/payElectricityCharges/payElectricityCharges"
					})
				}
			}
		},
		// 删除动作开始
		drawStart(e) {
			let data = _touchstart(e, this.ELEC_TYPE_LIST)
			this.ELEC_TYPE_LIST = data;
			this.ELEC_TYPE_LIST.map((item,i)=>{
				this.$set(item,'isTouchMove', false)
			})
		},
		// 删除动作中
		drawMove(e) {
			let data = _touchmove(e, this.ELEC_TYPE_LIST)
			if(data) {
				this.ELEC_TYPE_LIST.map((item,i)=>{
					if(e.currentTarget.dataset.index == i) {
						if ((data.touchMoveX ? data.touchMoveX : 0) > (data.startX ? data.startX : 1)){
							this.$set(item,'isTouchMove', false)
						} else {
							this.$set(item,'isTouchMove', true)
						}
					}
				})
			}
		},
		//删除条目
		delItem(e,POWER_USER_ID,BING_ACCOUNT_CODE,PROVINCE_CODE,SENSITIVE_POWER_USER_ID) {
			e.stopPropagation()
			console.log(BING_ACCOUNT_CODE, '1绑定0未绑定')
			this.power_user_id = POWER_USER_ID;
			this.province_code = PROVINCE_CODE;
			this.sensitive_power_user_id = SENSITIVE_POWER_USER_ID;

			if (BING_ACCOUNT_CODE == '1') {
				this.showComponents = true;
				this.modalType = 'del';
				this.modalValue = {
					modalTitle: '提示',
					modalContent: [
						{
							content: '删除后将同时解绑此户号，是否继续删除'
						}
					],//弹窗内容
					modalBtn: ['取消', '删除'],
					cancelColor: '#666666',
					confirmColor: '#DA392C',
                	isContent: true, // 文字是否居中
				}
			} else {
				this.showComponents = true;
				this.modalType = 'del';
				this.modalValue = {
					modalTitle: '提示',
					modalContent: [
						{
							content: '是否确认删除此户号'
						}
					],//弹窗内容
					modalBtn: ['取消', '删除'],
					cancelColor: '#666666',
					confirmColor: '#DA392C',
					isContent: true, // 文字是否居中
				}
			}
		},
		deleteItem() {
			dsUtils.request('osg-p0002/member/c9/f03', {
				params: {
					POWER_USER_ID:this.power_user_id,
					PROVINCE_CODE: this.province_code,
					SENSITIVE_POWER_USER_ID: this.sensitive_power_user_id,
				},
				success:response => {
					if (response.data.RESULT == '0') {
						let ELEC_TYPE_LIST = [];
						this.ELEC_TYPE_LIST.map((item, value) => {
							if (this.sensitive_power_user_id != item.SENSITIVE_POWER_USER_ID) {
								ELEC_TYPE_LIST.push(item)
							}
						})
						this.ELEC_TYPE_LIST = ELEC_TYPE_LIST;
						dsUtils.toast(response.data.MESSAGE)
					} else {
						dsUtils.toast(response.data.MESSAGE)
					}
					this.province_code = '';
				},
				fail:(res)=>{
					console.log(res)
				}
			})
		},
		// 跳转下单页面
		goDetail(item) {
			this.province_code = item.PROVINCE_CODE
			dsUtils.request('osg-p0002/member/p1/f01', {
				params: {
					TYPE: '2',
					PROVINCE_CODE: item.PROVINCE_CODE,
					POWER_USER_ID: item.POWER_USER_ID,
					SENSITIVE_POWER_USER_ID: item.SENSITIVE_POWER_USER_ID
				},
				success: response => {
					if (response.data.ELEC_TYPE_LIST[0] && response.data.ELEC_TYPE_LIST[0].ARREARS_LIST[0]) {
						let ARREARS_LIST = response.data.ELEC_TYPE_LIST[0].ARREARS_LIST[0];

						dsUtils.setStorageSync("DS_ITEMDATA",ARREARS_LIST ? ARREARS_LIST : [])

						// PROMPT_STATUS：0=成功、1=toast、2=弹框
						// PROMPT_MESSAGE 提示框内容
						// BTN_SIZE 提示框按钮个数
						// LEFT_BTN.TITLE 左按钮文字
						// LEFT_BTN.QUERY_CODE  是否跳转码值：1=跳转、2=不跳转、3=跳转其他；
						console.log('PROMPT_STATUS (0=成功、1=toast、2=弹框)===========================',ARREARS_LIST.PROMPT_STATUS)
						if(ARREARS_LIST.PROMPT_STATUS == '0') {
							dsUtils.navigateTo({
								url: "/packageDSEleCharge/pages/payElectricityCharges/payElectricityCharges"
							})
						} else if (ARREARS_LIST.PROMPT_STATUS == '2') {
							this.LEFT_QUERY_CODE = ARREARS_LIST.LEFT_BTN.QUERY_CODE;
							this.RIGHT_QUERY_CODE = ARREARS_LIST.RIGHT_BTN.QUERY_CODE;
							console.log('LEFT_QUERY_CODE (1=跳转、2=不跳转、3=跳转其他)===========================',this.LEFT_QUERY_CODE)
							console.log('RIGHT_QUERY_CODE (1=跳转、2=不跳转、3=跳转其他)===========================',this.RIGHT_QUERY_CODE)
							this.showComponents = true;
							this.modalType = 'query';
							this.modalValue = {
								modalTitle: '提示',
								modalContent: [
									{
										content: ARREARS_LIST.PROMPT_MESSAGE
									}
								],//弹窗内容
								modalBtn: [],
								cancelColor: '#666666',
								confirmColor: '#0C82F1',
                				isContent: true, // 文字是否居中
							}
							if(ARREARS_LIST.LEFT_BTN.TITLE != undefined) {
								this.modalValue.modalBtn.push(ARREARS_LIST.LEFT_BTN.TITLE)
							}
							if(ARREARS_LIST.RIGHT_BTN.TITLE != undefined) {
								this.modalValue.modalBtn.push(ARREARS_LIST.RIGHT_BTN.TITLE)
							}
						} else {
							console.log('ARREARS_LIST.PROMPT_STATUS不等于0|2',ARREARS_LIST.PROMPT_STATUS)
							return false;
						}
					}
				},
				fail:(res)=>{
					console.log(res)
				}
			})
			dsUtils.dataCollection({
				"ACTTYPE": '0301',
				"SERVICEID": 'W202100030101',
				"PAGENAME": '交费小程序-户号选择：点击展示户号',
				"CHANNEL": dsUtils.getUserInfo().channelCode,
			})
		},
		// 跳转添加户号页面
		addcons() {
			dsUtils.navigateTo({
				url: "/packageDSEleCharge/pages/addElePowerNum/addElePowerNum"
			})
			dsUtils.dataCollection({
				"ACTTYPE": '0301',
				"SERVICEID": 'W20210003010101',
				"PAGENAME": '交费小程序-户号选择：点击“为其他户号交费”',
				"CHANNEL": dsUtils.getUserInfo().channelCode,
			})
		},
		// 跳转交费记录页面
		goRecord() {
			dsUtils.navigateTo({
				url: "/packageDSRecord/pages/index/index"
			})
			dsUtils.dataCollection({
				"ACTTYPE": '0301',
				"SERVICEID": 'W20211008010401',
				"PAGENAME": '交费小程序-户号选择：点击“查看交费记录”',
				"CHANNEL": dsUtils.getUserInfo().channelCode,
			})
		},
		// 列表数据请求
		getEleList() {
			dsUtils.request('osg-p0002/member/p1/f01', {
				params: {
					TYPE: '0'
				},
				isHideToast: true,
				isResponseAll: true,
				success: response=> {
					// 小程序接口1是成功 关怀版接口0是成功
					if((this.taroEnv != 'h5' && response.code == '0') || (this.taroEnv == 'h5' && response.code != '0')) {
						this.innerText = response.message;
						if(this.flag) {
							if (response.message == '请先添加交费户号。') {
								dsUtils.navigateTo({
									url:'/packageDSEleCharge/pages/addElePowerNum/addElePowerNum'
								})
								this.flag = false;
							}
						}
						setTimeout(() => {
							this.innerText = ''
						}, this.innerText.length < 40 ? 2200 : this.innerText.length*57);
						return false;
					}
					
					let ELEC_TYPE_LIST = []
					if (response?.data?.data?.ELEC_TYPE_LIST) {
						response.data.data.ELEC_TYPE_LIST.map((value, key) => {
							if (value?.ARREARS_LIST) {
								ELEC_TYPE_LIST = ELEC_TYPE_LIST.concat(value.ARREARS_LIST)
							}
						});
						console.log('ELEC_TYPE_LIST',ELEC_TYPE_LIST)
						this.ELEC_TYPE_LIST = ELEC_TYPE_LIST
					}

					if(dsUtils.getStorageSync('DS_SPRINGFRAME') == '') {
						if(response?.data?.data?.POP_INFO?.POP_TYPE != undefined && response?.data?.data?.POP_INFO?.POP_TYPE != '00') {
							this.showSpringFrameMask = true;
							dsUtils.setStorageSync('DS_SPRINGFRAME','true')
							this.POP_TYPE = response.data.data.POP_INFO.POP_TYPE
							this.PICTURE_URL = response.data.data.POP_INFO.PICTURE_URL
							this.POP_TITLE = response.data.data.POP_INFO.POP_TITLE
							this.POP_TEXT = response.data.data.POP_INFO.POP_TEXT
							this.STOP_WATCH = response.data.data.POP_INFO.STOP_WATCH
							this.SKIP_URL = response.data.data.POP_INFO.SKIP_URL
							this.SKIP_PARAMS = response.data.data.POP_INFO.SKIP_PARAMS
						}
					}
				},
				fail:(res)=>{
					console.log(res)
				}
			})
		}
	},
	onShareAppMessage(res) {
		return {
			title: '网上国网',
			desc: '电费轻松缴纳，随时随地享受便捷服务。',
			// imageUrl: '',
			// bgImgUrl: '',
			path: 'pages/index/index',
			channel:'Wxfriends,Wxmoments',
		}
	},
}
</script>
<style scoped>

</style>
