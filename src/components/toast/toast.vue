<template>
  <view class="toast_content_box" v-if='innerText.length'>  
    <view class="toast_content">  
      <view class="toast_content_text">  
        {{innerText}}
      </view>  
    </view>  
  </view> 
</template>

<script>

import "./toast.scss";
export default {
  props: {
    innerText: {
      type: String
    }
  }
}
</script>
<style scoped>

</style>
