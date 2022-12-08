<template>
    <view :class="careEnv == '1'? 'modal_careWrap':'modal_defaultWrap'">
        <view class='modal-mask' v-show='showComponents'>
            <view class='modal-content'>
                <view class="modal-content-title">{{modalValue.modalTitle}}</view>
                <image v-if="modalValue.beforeImg" :src="require(`../../assets/images/${modalValue.beforeImg.url}`)" ></image>
                <view class="modal-content-text" :class="modalValue.isContent ? 'content' : ''" v-for="(item, index) in modalValue.modalContent" :key="index">
                    {{item.content}}
                </view>
                <image v-if="modalValue.afterImg" :src="require(`../../assets/images/${modalValue.afterImg.url}`)"></image>
                <view class='modal-footer' v-if="modalValue.modalBtn.length > 1">
                    <view class='cancel-btn' @tap='cancel' :style="{color: modalValue.cancelColor}">{{modalValue.modalBtn[0]}}</view>
                    <view class='confirm-btn' @tap='confirm' :style="{color: modalValue.confirmColor}">{{modalValue.modalBtn[1]}}</view>
                </view>
                <view class='modal-footer' v-else>
                    <view class='confirm-btn' @tap='cancel' :style="{color: modalValue.confirmColor}">{{modalValue.modalBtn[0]}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>

import "./modal.scss";
import Taro from '@tarojs/taro'
import { dsUtils } from "@/dsUtils";
export default {
    props: {
        modalValue: {
            type: Object
        },
        showComponents: {
            type: Boolean
        }
    },
	data() {
		return {
      		careEnv: '', // 0: 普通版; 1: 关怀版
		}
	},
    watch: {
        modalValue(newVal, oldVal) {
            console.log('弹框组件接收参数===================',newVal)
        }
    },
	created() {
    	this.careEnv = dsUtils.careEnv
	},
	methods: {
		// 点击取消按钮的回调函数
        cancel() {
            this.$emit('cancel')
        },
        // 点击确定按钮的回调函数
        confirm() {
            this.$emit('confirm')
        }
	}
}
</script>
<style scoped>

</style>