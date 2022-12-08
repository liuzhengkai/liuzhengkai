<template>
  <view v-show="isShow" class="picker_view_integral">
    <view v-if="isShow" class="picker_view">
        <view class="taro-example">
            <view class="picker_view_title">
                <view class="close" @tap="close">×</view>
                    <view>选择积分</view>
                <view class="no" @tap="notUsed">暂不使用</view>
            </view>
            <view class="tipsInfo">
                <view>账户积分共：{{pickerValue.integralNum}}分</view>
                <view v-if="pickerValue.integralList.length > 0">本单最多可用{{pickerValue.integralList[0].jifen}}分，抵￥{{pickerValue.integralList[0].dikou}}</view>
                <view v-else>暂不可使用积分</view>
            </view>
            <picker-view v-if="pickerValue.integralList.length > 0 && taroEnv != 'h5'" indicator-style="height: 50px;" style="width: 100%; height: 180px; text-align: center;" :value="[pickerValue.integralInd]" @change="onChange" @onPickStart="onPickStart" @onPickEnd="onPickEnd">
                <picker-view-column>
                    <view v-for="(item, index) in pickerValue.integralList" :key="index">抵扣￥{{item.dikou}}，使用{{item.jifen}}积分</view>
                </picker-view-column>
            </picker-view>
            <van-picker
                v-if="pickerValue.integralList.length > 0 && taroEnv == 'h5'"
                :columns="integralList"
                @change="onChange"
                :default-index="pickerValue.integralInd"
            />
        </view>
        <button v-if="pickerValue.integralList.length > 0" class="btn" @tap="sure" :disabled="disabled">确认</button>
        <view v-if="pickerValue.integralList.length == 0">
            <view class="text">本订单使用的红包数量已达最大可抵扣金额，您可手动更改红包积分的使用数量<image class="pk_tips" @tap="rules" src="../../assets/images/ds_tips.png" /></view>
        </view>
        <view class="un-red-Envelope-box" v-if="pickerValue.integralList.length <= 0">
            <image class="un-red-Envelope" src="../../assets/images/ds_un_red_Envelope.png" />
        </view>
        <view style="height: 20px"></view>
    </view>
    <Modal :modalValue="modalValue" :showComponents="isShowModal" @cancel="cancel"/>
  </view>
</template>

<script>
import './picker.scss';
import Modal from '../modal/modal'
import {dsUtils} from '@/dsUtils'
export default {
    props: {
        pickerValue: {
            type: Object
        },
        isShow: {
            type: Boolean
        }
    },
    components: { Modal },
    name: "Index",
    data() {
        return {
            value: '', // 选中的选项
            disabled: false, // 按钮默认可以点击
            picker_val: 0, // 回显索引
            isShowModal: false, // 规则弹框显隐
            modalValue: {
				modalTitle: '提示',//弹窗标题
				modalContent: [
					{
						content: '弹框内容'//弹窗内容
					}
				],//弹窗内容
				modalBtn: ['取消', '确认'], //弹窗按钮(一个按钮或两个按钮，默认两个)
				cancelColor: '', // 左按钮颜色
				confirmColor: '', // 右按钮颜色
                isContent: false, // 文字是否居中
			},
            integralList: [], // 积分列表转义后
            careEnv: '', // 0: 普通版; 1: 关怀版
        }
    },
    created(){
        this.careEnv = dsUtils.careEnv
        this.taroEnv = process.env.TARO_ENV
    },
    watch:{
        isShow: function(newValue) {
            // console.log(newValue,'newValue')
        },
        'pickerValue.integralList': function(newValue) {
            // console.log(newValue, 'newValue')
            if(process.env.TARO_ENV == 'h5') {
                this.integralList = [];
                newValue.map((item,index)=> {
                    this.integralList.push('抵扣￥' + newValue[index].dikou +'，使用' + newValue[index].jifen + '积分')
                })
                // console.log(this.integralList,'this.integralList')
            }
        }
    },
    methods: {
        // 选择器change事件
        // onChange: function(e) {
        //     this.value = e.detail.value[0]
        //     console.log(this.value,'===============value')
        // },
        onChange(e, value, index) {
            if(process.env.TARO_ENV != 'h5') {
                this.value = e.detail.value[0]
            } else {
                this.value = index;
            }
        },
        // 选择器开始滚动事件
        onPickStart() {
            this.disabled = true;
            // console.log('onPickStart')
        },
        // 选择器滚动结束事件
        onPickEnd() {
            this.disabled = false;
            // console.log('onPickEnd')
        },
        // 左上角关闭按钮
        close() {
            this.$emit('close')
        },
        // 右上角暂不使用
        notUsed() {
            this.$emit('notUsed')
        },
        // 点击确认
        sure() {
            // console.log(this.value,'this.value')
            this.$emit('sure', this.value != '' ? this.value : 0)
        },
        // 查看规则
        rules() {
            this.isShowModal = true;
            this.modalValue = {
                modalTitle: '积分红包使用规则',
                modalContent: [
                    {
                        content: '使用条件'
                    },{
                        content: '1、积分满200积分可用，单笔使用数量不可超过20000积分（等同于100元）'
                    },{
                        content: '2、电费红包单笔使用金额不可超过200元'
                    },{
                        content: `3、红包积分合计使用金额不可超过应付订单金额的${this.pickerValue.deductionRatio}`
                    },{
                        content: '使用规则'
                    },{
                        content: '1、使用积分数量为200的整数倍'
                    },{
                        content: '2、200积分可抵1元'
                    },{
                        content: '3、电费红包最小使用单位为0.01元'
                    },
                ],//弹窗内容
                modalBtn: ['我知道了'],
                confirmColor: '#0C82F1',
                isContent: false, // 文字是否居中
            }
        },
        // 点击我知道了按钮
        cancel() {
            this.isShowModal = false;
        }
    }
}
</script>
