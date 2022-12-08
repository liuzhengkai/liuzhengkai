<template>
    <view class='tableBar'>
        <view class="quickBtn">
            <image class="ds_goback" @tap="goBack" src="../../assets/images/ds_goback.png" />
            <image class="ds_goHome" @tap="goHome" src="../../assets/images/ds_goHome.png" />
            <image class="ds_customerService" @tap="goOnlineService" src="../../assets/images/ds_customerService.png" />
        </view>
    </view>
</template>

<script>

import "./tableBar.scss";
import Taro from '@tarojs/taro'
import { dsUtils } from '../../bussinessUtil/dsUtils';
export default {
    props: {

    },
	data() {
		return {
            
		}
	},
	methods: {
        // 返回 
        goBack() {
            this.$emit('goBack')
        },

        // 回首页
        goHome() {
            this.$emit('goHome')
        },
        
        // 在线客服
        goOnlineService() {
            dsUtils.bridge_jumpToMenu({menuId:'D10060000',url:''})
        }
	}
}
</script>
<style scoped>

</style>