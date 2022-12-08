<template>
  <view :class="careEnv == '1'? 'careWrap':'defaultWrap'">
    <view class="container_add">
      <TitleBar :title-bar-obj="titleBarObj" @goBack="goBack"/>
      <image class="header_bg_addCons" v-if="taroEnv == 'h5'" mode="widthFix" src="../../images/ds_header_eleList.png"></image>
      <image class="header_bg_addCons" v-else src="../../images/ds_add_header.png"></image>
      <view class="add_content" :class="taroEnv == 'h5' ? 'ADD_TitleBar_H5' : 'ADD_TitleBar_Alipay'">
        <view class="addAccountNum">
          <text class="addressText">所在地区</text>
          <view class="chooseAddress" @tap="chooseAddress">
            <text class="provinceName" v-if="province_name">{{province_name}}</text>
            <text class="provinceNameText" v-else>请选择交费地区</text>
            <image class="rightArrow" src="../../../assets/images/ds_right_arrow.png"></image>
          </view>
          <text class="inputText">用电户号</text>
		  <van-field
		  	v-if="taroEnv == 'h5'"
			v-model="consNum"
			placeholder="请输入用电户号"
			type="digit"
			maxlength="13"
			class="input_cons"
		  />
		  <input v-else v-model="consNum" type="number" placeholder="请输入用电户号" placeholder-class="placeholder-class" maxlength="13" class="input_cons" @input="changeInput" :controlled="true"/>
        </view>
        <view class="getCons" v-if="taroEnv == 'h5'">
          <view></view>
          <view @tap="getConsBtn">如何获取户号</view>
        </view>
        <button :class="taroEnv == 'h5' ? 'btn_green_addCons' : 'btn_addCons'" @tap="query">去交费</button>
        <view class="add_tips" v-if="listData.length">系统为您匹配到以下用电户号</view>
        <view class="add_list">
          <view class="add_list_item" v-for="(item,index) in listData" :key="index" @tap="goDetail(item)">
            <view class="left">
              <view><text>{{item.POWER_USER_ID}}</text> | <text>{{item.POWER_USER_NAME}}</text></view>
              <text class="item_address">{{item.POWER_USER_ADDR}}</text>
            </view>
            <view class="rightArrow2">
              <image class="rightArrow" src="../../../assets/images/ds_right_arrow.png"></image>
            </view>
          </view>
        </view>
      </view>
      <Modal :modalValue="modalValue" :showComponents="showComponents" @cancel="cancel" @confirm="confirm"/>
	  <Toast v-if="innerText.length" :innerText="innerText" />
    </view>
  </view>
</template>

<script>

import "./addElePowerNum.scss";
import TitleBar from "@/components/titleBar/titleBar";
import Modal from "@/components/modal/modal";
import Toast from '@/components/toast/toast.vue';
import { dsUtils } from "@/dsUtils";
export default {
	components: { TitleBar, Modal, Toast },
	data() {
		return {
			titleBarObj: {
				title: "添加户号",
				isOpenAlipayJump: false, // 返回到指定页面
				tokenBol: false, // 点击返回退出
				arrowWhite: false, //箭头默认false为黑色，ture为白色
          		isOpenBgBlue:false, // true 背景蓝。 false 默认色。
				// isNoShowArrow: true // 不显示箭头，默认false;  显示，true
			},
			showComponents: false, // 是否显示弹框
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
			length: '', // 列表页面条目数
			listData: [], // 添加户号页面户号列表
			consNum: '', // 户号
			province_code: '', // 省码
			province_name: '', // 省份名称
			isToken: '', // 是否有token
			getCons: true, // 是否显示（如何获取户号）
			taroEnv: '', // 环境标识
      		careEnv: '', // 0: 普通版; 1: 关怀版
			LEFT_QUERY_CODE: '', // 弹框左按钮跳转码值
			RIGHT_QUERY_CODE: '', // 弹框右按钮跳转码值
			innerText: '', // message提示字段
		}
	},
	created() {
		this.getEleList()
		this.taroEnv = process.env.TARO_ENV;
    	this.careEnv = dsUtils.careEnv
		if(dsUtils.getUserInfo().token) {
			this.titleBarObj.tokenBol = false
		} else {
			this.titleBarObj.tokenBol = true
		}
		dsUtils.dataCollection({
			"ACTTYPE": '0204',
			"SERVICEID": 'W2021000201',
			"PAGENAME": '交费小程序：去交费页',
			"CHANNEL": dsUtils.getUserInfo().channelCode,
		})
	},
	mounted() {
		this.province_code = dsUtils.getStorageSync('DS_PROVINCE_CODE') ? dsUtils.getStorageSync('DS_PROVINCE_CODE') : ''
		this.province_name = dsUtils.getStorageSync('DS_PROVINCE_NAME') ? dsUtils.getStorageSync('DS_PROVINCE_NAME') : ''
	},
	methods: {
		// 输入户号
		changeInput (e) {
			this.consNum = e.target.value.replace(/[^\d]/g, "");
		},
		// 弹框左按钮
		cancel() {
			this.showComponents = false;
			if(this.LEFT_QUERY_CODE == '1') {
				dsUtils.navigateBack(1)
			}
		},
		// 弹框右按钮
		confirm() {
			this.showComponents = false;
			if(this.RIGHT_QUERY_CODE == '1') {
				dsUtils.navigateBack(1)
			}
		},
		// 如何获取户号
		getConsBtn() {
			if(dsUtils.bridge_WSGWBridge()){
				let data = {"proCode": this.province_code ? this.province_code : ''}
				dsUtils.bridge_howToGetConsNum(data)
			}else {
				dsUtils.navigateTo({
					url: '/packageDSEleCharge/pages/webView/webView?url=https://mp.weixin.qq.com/s/JGI7HPkeRfnXiPd_X6m33g'
				})
			}
		},
		goBack() {
			dsUtils.navigateBack(1)
		},
		// 选择地区方法
		chooseAddress() {
			let that = this;
			if(dsUtils.bridge_WSGWBridge()){
				let data = {"type":"13","codeValue":"","showHotCitys":"1"}
				dsUtils.bridge_chooseAddressInfo(data,(res)=>{
					that.province_name = res.codeName;
					that.province_code = res.content3;
					dsUtils.setStorageSync('DS_PROVINCE_NAME', that.province_name)
					dsUtils.setStorageSync('DS_PROVINCE_CODE', that.province_code)
				});
			} else {
				console.log('点击地区组件')
				dsUtils.chooseAddressInfo({"Hierarchy": '2'}).then((res)=>{
					console.log(res,'----------------------------')
					that.province_name = res.provinceName
					that.province_code = res.provinceCode5
					dsUtils.setStorageSync('DS_PROVINCE_NAME', that.province_name)
					dsUtils.setStorageSync('DS_PROVINCE_CODE', that.province_code)
				})
			}
		},
		// 去交费按钮
		query() {
			if(this.province_name == '') {
				return dsUtils.toast('请选择交费地区')
			}
			if (this.province_code == '62101' && this.consNum.length < 7) { // 甘肃
				dsUtils.toast('请输入7-13位用电户号')
				return
			} 
			if (this.province_code == '32101' && this.consNum.length < 13) { // 江苏
				dsUtils.toast('请输入13位用电户号')
				return
			} 
			if(this.consNum.length < 10){
				dsUtils.toast('请输入10位用电户号')
				return
			}
			this.queryEleInfo()
			dsUtils.dataCollection({
				"ACTTYPE": '0301',
				"SERVICEID": 'W202100020101',
				"PAGENAME": '交费小程序：点击“去交费”',
				"CHANNEL": dsUtils.getUserInfo().channelCode,
			})
		},
		//添加户号（欠费查询接口）
		queryEleInfo() {
			dsUtils.request('osg-p0002/member/p1/f01', {
				params: {
					TYPE: '1',
					PROVINCE_CODE: this.province_code,
					POWER_USER_ID: this.consNum
				},
				isHideToast: true,
				isResponseAll: true,
				success: response => {
					// 小程序接口1是成功 关怀版接口0是成功
					if((this.taroEnv != 'h5' && response.code == '0') || (this.taroEnv == 'h5' && response.code != '0')) {
						this.innerText = response.message;
						return setTimeout(() => {
							this.innerText = ''
						}, this.innerText.length < 40 ? 2200 : this.innerText.length*57);
					}
					if(response.data.data.ELEC_TYPE_LIST[0] && response.data.data.ELEC_TYPE_LIST[0].ARREARS_LIST[0]) {
						let ARREARS_LIST = response.data.data.ELEC_TYPE_LIST[0].ARREARS_LIST[0];

						dsUtils.setStorageSync("DS_ITEMDATA",ARREARS_LIST ? ARREARS_LIST : [])


						console.log('PROMPT_STATUS (0=成功、1=toast、2=弹框)===========================',ARREARS_LIST.PROMPT_STATUS)
						// PROMPT_STATUS：0=成功、1=toast、2=弹框
						// PROMPT_MESSAGE 提示框内容
						// BTN_SIZE 提示框按钮个数
						// LEFT_BTN.TITLE 左按钮文字
						// LEFT_BTN.QUERY_CODE  是否跳转码值：1=跳转、2=不跳转、3=跳转其他；
						if(ARREARS_LIST.PROMPT_STATUS == '0') {
							dsUtils.navigateBack(1)
						} else if (ARREARS_LIST.PROMPT_STATUS == '2') {
							this.LEFT_QUERY_CODE = ARREARS_LIST.LEFT_BTN.QUERY_CODE;
							this.RIGHT_QUERY_CODE = ARREARS_LIST.RIGHT_BTN.QUERY_CODE;
							console.log('LEFT_QUERY_CODE (1=跳转、2=不跳转、3=跳转其他)===========================',this.LEFT_QUERY_CODE)
							console.log('RIGHT_QUERY_CODE (1=跳转、2=不跳转、3=跳转其他)===========================',this.RIGHT_QUERY_CODE)
							this.showComponents = true;
							this.modalValue = {
								modalTitle: '提示',
								modalContent: [
									{
										content: ARREARS_LIST.PROMPT_MESSAGE
									}
								],//弹窗内容
								modalBtn: [],
								cancelColor: '#666666',
								confirmColor: '#11A9B0',
								isContent: true, // 文字是否居中
							}
							if(ARREARS_LIST.LEFT_BTN.TITLE != undefined) {
								this.modalValue.modalBtn.push(ARREARS_LIST.LEFT_BTN.TITLE)
							}
							if(ARREARS_LIST.RIGHT_BTN.TITLE != undefined) {
								this.modalValue.modalBtn.push(ARREARS_LIST.RIGHT_BTN.TITLE)
							}
						} else {
							console.log('ARREARS_LIST.PROMPT_STATUS不等于0|2 toast',ARREARS_LIST.PROMPT_STATUS)
							dsUtils.toast(ARREARS_LIST.PROMPT_MESSAGE)
							return false;
						}
					}
				},
				fail:(error)=>{
					console.log(error,'error')
				}
			})
		},
		goDetail(item) {
			dsUtils.request('osg-p0002/member/p1/f01', {
				params: {
					TYPE: '2',
					PROVINCE_CODE: item.PROVINCE_CODE,
					POWER_USER_ID: item.POWER_USER_ID,
					SENSITIVE_POWER_USER_ID: item.SENSITIVE_POWER_USER_ID
				},
				isHideToast: true,
				isResponseAll: true,
				success: response => {
					// 小程序接口1是成功 关怀版接口0是成功
					if((this.taroEnv != 'h5' && response.code == '0') || (this.taroEnv == 'h5' && response.code != '0')) {
						this.innerText = response.message;
						return setTimeout(() => {
							this.innerText = ''
						}, this.innerText.length < 40 ? 2200 : this.innerText.length*57);
					}
					if(response.data.data.ELEC_TYPE_LIST[0] && response.data.data.ELEC_TYPE_LIST[0].ARREARS_LIST[0]) {
						let ARREARS_LIST = response.data.data.ELEC_TYPE_LIST[0].ARREARS_LIST[0];

						dsUtils.setStorageSync("DS_ITEMDATA",ARREARS_LIST ? ARREARS_LIST : [])

						// PROMPT_STATUS：0=成功、1=toast、2=弹框
						// PROMPT_MESSAGE 提示框内容
						// BTN_SIZE 提示框按钮个数
						// LEFT_BTN.TITLE 左按钮文字
						// LEFT_BTN.QUERY_CODE  是否跳转码值：1=跳转、2=不跳转、3=跳转其他；
						console.log('PROMPT_STATUS (0=成功、1=toast、2=弹框)===========================',ARREARS_LIST.PROMPT_STATUS)
						if(ARREARS_LIST.PROMPT_STATUS == '0') {
							dsUtils.navigateBack(1)
						} else if (ARREARS_LIST.PROMPT_STATUS == '2') {
							this.LEFT_QUERY_CODE = ARREARS_LIST.LEFT_BTN.QUERY_CODE;
							this.RIGHT_QUERY_CODE = ARREARS_LIST.RIGHT_BTN.QUERY_CODE;
							console.log('LEFT_QUERY_CODE (1=跳转、2=不跳转、3=跳转其他)===========================',this.LEFT_QUERY_CODE)
							console.log('RIGHT_QUERY_CODE (1=跳转、2=不跳转、3=跳转其他)===========================',this.RIGHT_QUERY_CODE)
							this.showComponents = true;
							this.modalValue = {
								modalTitle: '提示',
								modalContent: [
									{
										content: ARREARS_LIST.PROMPT_MESSAGE
									}
								],//弹窗内容
								modalBtn: [],
								cancelColor: '#666666',
								confirmColor: '#11A9B0',
								isContent: true, // 文字是否居中
							}
							if(ARREARS_LIST.LEFT_BTN.TITLE != undefined) {
								this.modalValue.modalBtn.push(ARREARS_LIST.LEFT_BTN.TITLE)
							}
							if(ARREARS_LIST.RIGHT_BTN.TITLE != undefined) {
								this.modalValue.modalBtn.push(ARREARS_LIST.RIGHT_BTN.TITLE)
							}
						} else {
							console.log('ARREARS_LIST.PROMPT_STATUS不等于0|2 toast',ARREARS_LIST.PROMPT_STATUS)
							dsUtils.toast(ARREARS_LIST.PROMPT_MESSAGE)
							return false;
						}
					}
				},
				fail:(res)=>{
					console.log(res)
				}
			})
		},
		// 列表数据请求
		getEleList() {
			dsUtils.request('osg-p0002/member/c10/f05', {
				params: {
					PAGER_NO: '0',
					PAGER_NUM: '20',
					TOKEN: dsUtils.getUserInfo().token
				},
				success: response=> {
					console.log('列表数据',response)
					if(response.data.POWER_USER_ID_LIST) {
						this.listData = response.data.POWER_USER_ID_LIST
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
			path: 'pages/index/index',
			channel:'Wxfriends,Wxmoments',
		}
	},
}
</script>
<style scoped>

</style>
