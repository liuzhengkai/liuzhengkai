<template>
    <web-view :src="url" />
</template>

<script>

import "./webView.scss";
export default {
    data() {
        return {
            url: ''
        }
    },

    onLoad(options) {
        this.url = options.url
        console.log('onLoad接入参数',options)
    }
}
</script>
<style scoped>

</style>