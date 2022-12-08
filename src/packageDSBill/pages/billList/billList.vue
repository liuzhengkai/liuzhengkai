<template>
    <view :class="prohibit ? 'preventTouchMove' : 'root'">
        <view class="noList" v-if="show">
            <image class="ds_bill_bg" src="../../images/ds_bill_bg.png"/>
			<TitleBar :title-bar-obj="titleBarObj" @goBack="goBack"/>
            <view class="noList_content">
                <text class="bl_tips">查询到您还未绑定户号</text>
                <text class="bl_tips">您可以通过以下方式绑定户号</text>
                <image class="ds_bill_bg_content" src="../../images/ds_bill_bg_content.png"/>
            </view>
        </view>
        <view class="list" v-else>
			<image class="ds_topBg" src="../../../assets/images/ds_topBg.png"/>
			<TitleBar :title-bar-obj="titleBarObj" @goBack="goBack"/>
            <view class="list_content">
                <view class="immediatelyPay">
                    <view>
                        <image class="notice" src="../../images/ds_bill_notice.png"/>
                        <text>交电费，告别排队，快速到账</text>
                    </view>
                    <view class="immediatelyPayBtn" @tap="goEleList">立即交费</view>
                </view>
                <view class="scrollBox">
                    <view class="consInfo">
                        <view class="userName">
                            <text>{{consName}}</text>
                            <image @tap="openMark" class="ds_bill_change" src="../../../assets/images/ds_changeCons.png"></image>
                        </view>
                        <view class="consNum">用电户号：{{consNo}}</view>
                        <view class="address">{{elecAddr}}</view>
                    </view>
                    
                    <view class="billDetail">
                        <view class="date">
                            <view>{{year}}</view>
                            <view class="lastMonth" @tap="showModal">{{f_ym}}月</view>
                            <view class="sameMonth">{{ym}}月</view>
                        </view>
                        <view class="detail_box">
                            <view class="total_eleFees">
                                <view class="total_eleFees_title">本期合计电费（元）</view>
                                <view class="total_eleFees_amt">{{totalAmount}}</view>
                            </view>
                            <view class="line"></view>
                            <view class="total_eleQuantity">
                                <view class="total_eleQuantity_title">本期合计电量（千瓦时）</view>
                                <view class="total_eleQuantity_amt">{{totalPq}}</view>
                            </view>
                        </view>
                        <view class="seeMore" @tap="showModal('交费小程序-电费账单：点击“查看账单详情”','W20211008010703')">
                            <view class="detailBillText">查看账单详情</view>
                            <image class="ds_bill_select" src="../../images/ds_bill_select.png"></image>
                        </view>
                    </view>
                    <view class="quickJump">
                        <view @tap="showModal('交费小程序-电费账单：点击“电量电费”','W20211008010704')" class="quickJump_box quickJump_box_top">
                            <image class="quickJump_img" src="../../images/ds_bill_eleFees.png"></image>
                            <text class="quickJump_text">电量电费</text>
                        </view>
                        <view @tap="goRecord" class="quickJump_box quickJump_box_top quickJump_box_right">
                            <image class="quickJump_img" src="../../images/ds_bill_record.png"></image>
                            <text class="quickJump_text">交费记录</text>
                        </view>
                        <view @tap="showModal('交费小程序-电费账单：点击“电子发票”','W20211008010706')" class="quickJump_box">
                            <image class="quickJump_img" src="../../images/ds_bill_invoice.png"></image>
                            <text class="quickJump_text">电子发票</text>
                        </view>
                        <view @tap="showModal('交费小程序-电费账单：点击“用能分析”','W20211008010707')" class="quickJump_box quickJump_box_right">
                            <image class="quickJump_img" src="../../images/ds_bill_analysis.png"></image>
                            <text class="quickJump_text">用能分析</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="footer">
                <image class="ds_bill_buttonBg" src="../../../assets/images/ds_footer.png"></image>
            </view>
        </view>  
        <Modal :modalValue="modalValue" :showComponents="showComponents" @cancel="cancel"/>
        <view class="changeConsMatk" v-show="showMark">
            <view class="matkAll">
                <view class="mark_title">
                    <image class="ds_bill_close_changeList" @tap="closeMark" src="../../../assets/images/ds_bill_close_changeList.png"></image>
                    <view>
                        <text class="changeNum">选择户号</text>
                        <text class="bindNum">已绑定{{length}}户</text>
                    </view>
                    <view></view>
                </view>
                <view class="mark_center">
                    <view class="mark_consInfo" @tap="changeCons(item)" v-for="(item, index) in powerUserList" :key="index">
                        <view class="mark_userName">
                            <text>{{item.consName}}</text>
                            <image class="ds_bill_right" src="../../images/ds_bill_right.png"></image>
                        </view>
                        <view class="mark_consNum">用电户号：{{item.consNo}}</view>
                        <view class="mark_address">{{item.elecAddr}}</view>
                    </view>
                </view>
                <view class="mark_footer">
                    <view>温馨提示</view>
                    <view>绑定新户号，请前往各大应用商城下载网上国网APP</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import "./billList.scss";
import { dsUtils } from "@/dsUtils";
import TitleBar from "@/components/titleBar/titleBar";
import Modal from "@/components/modal/modal";
export default {
	components: {
		TitleBar,Modal
	},
    data() {
        return {
            titleBarObj: {
                title: "电费账单", // 户号绑定
                isOpenAlipayJump: false, // 返回到指定页面
				tokenBol: false, // 点击返回退出
				arrowWhite: false, //箭头默认false为黑色，ture为白色
                isOpenBgBlue: false,
				// isNoShowArrow: true // 不显示箭头，默认false;  显示，true
            },
            show: false, 
            showComponents: false,
            showMark: false,
            year: '',
            modalValue: {
				modalTitle: '温馨提示',//弹窗标题
				modalContent: [
					{
						content: '前往网上国网APP，超多用电信息等你来查~'
					}
				],//弹窗内容
				modalBtn: ['确认'], //弹窗按钮(一个按钮或两个按钮，默认两个)
				cancelColor: '#11A9B0', // 左按钮颜色
				confirmColor: '', // 右按钮颜色
                isContent: true, // 文字是否居中
			},
            consName: '', // 名称
            consNo: '', // 户号
            elecAddr: '', // 地址
            totalAmount: '', // 本期合计电费
            totalPq: '', // 本期合计电量
            ym: '', // 月份
            f_ym: '', // 前一个月
            powerUserList: [], // 户号列表
            length: '', // 列表长度
            prohibit: false, // 默认显示root
        };
    },

    created() {
        this.powerUserList = dsUtils.getStorageSync('DS_billList');
        dsUtils.removeStorageSync("DS_billList");
        this.show = !(this.powerUserList instanceof Array && this.powerUserList.length > 0);
        if (this.show) {
            return;
        }

        this.year = new Date().getFullYear() + '年';
        this.length = this.powerUserList.length;
        this.consName = this.powerUserList[0].consName;
        this.consNo = this.powerUserList[0].consNo;
        this.elecAddr = this.powerUserList[0].elecAddr
        this.getBillEleInfo(this.powerUserList[0]);
        dsUtils.dataCollection({
            "ACTTYPE": '0204',
            "SERVICEID": 'W20211008010701',
            "PAGENAME": '交费小程序：电费账单页',
            "CHANNEL": dsUtils.getUserInfo().channelCode,
        })
    },

    watch: {
        "show": function(newVal, oldVal) { 
            if(newVal) {
                this.titleBarObj = {
                    title: "户号绑定", // 户号绑定
                    isOpenAlipayJump: false, // 返回到指定页面
                    tokenBol: false, // 点击返回退出
                    arrowWhite: true, //箭头默认false为黑色，ture为白色
                    // isNoShowArrow: true // 不显示箭头，默认false;  显示，true
                }
            } else {
                this.titleBarObj = {
                    title: "电费账单", // 户号绑定
                    isOpenAlipayJump: false, // 返回到指定页面
                    tokenBol: false, // 点击返回退出
                    arrowWhite: true, //箭头默认false为黑色，ture为白色
                    // isNoShowArrow: true // 不显示箭头，默认false;  显示，true
                }
            }
        }
    },

    methods: {
        // 返回上一页
        goBack() {
            dsUtils.navigateBack(1);
        },
        changeCons(item) {
            this.totalAmount = '',
            this.totalPq = '',
            this.ym = '',
            this.f_ym = '',
            this.consName = item.consName,
            this.consNo = item.consNo,
            this.elecAddr = item.elecAddr,

            this.getBillEleInfo(item);
            this.showMark = false;
            this.prohibit = false;
        },

        getBillEleInfo(item) {
            let that = this,
                date = new Date().getFullYear() + '' + ("0" + (new Date().getMonth() + 1)).slice(-2);
               
            let params = {
                data : {
                    "promotCode": "1",
                    "bgnDate"   : date,
                    "searchType": "0",
                    "endDate"   : date,
                    "promotType": "1",
                    "provinceCode": item.proNo, // 省码
                    "funcCode"  : "11",
                    "acctId"    : "manager",
                    "userName"  : "111",
                    "consNo"    : item.consNo,  // 户号
                    "serialNo"  : new Date().getTime(),
                    "srvCode"   : "osg-bc0001/member/c31/f01",
                    "orgNo"     : "324120107",
                    "userAccountId": "123",
                    "channelCode": dsUtils.getUserInfo().channelCode
                },
                "serviceCode"   : "BCP_00026",
                "searchType"    : "0",
                "source"        : "manager",
                "target"        : item.proNo    // 省码
            };
            dsUtils.request('osg-bc0001/member/c31/f01', {
                params,
                paramsFlag: "2",
                code : '1',
                success(response) {
                    that.totalAmount = response.totalAmount;
                    that.totalPq = response.totalPq;
                    let ym = response.ym;
                    if(ym.slice(4) < 10) {
                        that.ym = ym.slice(5);
                        that.f_ym = ym.slice(4) == '01' ? "12" : ym.slice(5) - 1;
                    } else {
                        that.ym = ym.slice(4);
                        that.f_ym = ym.slice(4) - 1;
                    }
                }
            });
        },
        // 跳转电费列表
        goEleList() {
            dsUtils.navigateBack(1);
            dsUtils.dataCollection({
                "ACTTYPE": '0301',
                "SERVICEID": 'W20211008010702',
                "PAGENAME": '交费小程序-电费账单：点击“立即交费”',
                "CHANNEL": dsUtils.getUserInfo().channelCode,
            })
        },

        // 打开切换户号
        openMark() {
            this.showMark = true;
            this.prohibit = true;
        },

        // 关闭切换户号
        closeMark() {
            this.showMark = false;
            this.prohibit = false;
        },

        // 弹框
        showModal(PAGENAME,SERVICEID) {
            this.showComponents = true;
            this.prohibit = true;
            dsUtils.dataCollection({
                "ACTTYPE": '0301',
                SERVICEID,
                PAGENAME,
                "CHANNEL": dsUtils.getUserInfo().channelCode,
            })
        },

        // 跳转交费记录
        goRecord() {
            dsUtils.navigateTo({
                url: "/packageDSRecord/pages/index/index"
            });
            dsUtils.dataCollection({
                "ACTTYPE": '0301',
                "SERVICEID": 'W20211008010705',
                "PAGENAME": '交费小程序-电费账单：点击“交费记录”',
                "CHANNEL": dsUtils.getUserInfo().channelCode,
            })
        },

        // 弹框左按钮
		cancel() {
			this.showComponents = false;
            this.prohibit = false;
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

<style>

</style>