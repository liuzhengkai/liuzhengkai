<template>
  <scroll-view
    class="my-scroll"
    id="myScroll"
    @scroll.passive="onScroll($event)"
    @touchstart="touchStart($event)"
    @touchmove="touchMove($event)"
    @touchend="touchEnd($event)"
    ref="myScroll"
    :style="'margin-top: '+ scrollMarginTop +'px;height: calc(100vh - ' + scrollMarginTop + 'px);'"
    :scroll-y="true"
  >
    <view class="scroll-top" :style="'height:'+top+'px;'">
      <view v-if="aspect==2">
        <view class="my-scroll-p" v-if="state==6">{{stateITObj.refreshBegin}}</view>
        <view class="my-scroll-p" v-if="state==2">{{stateITObj.refreshRelease}}</view>
        <view class="my-scroll-p" v-if="state==1">{{stateITObj.refreshGoing}}</view>
        <view class="my-scroll-p" v-if="state==3">{{stateITObj.refreshEnd}}</view>
      </view>
    </view>

    <view class="scroll-list" id="scrollList">
      <slot name="scrollList"></slot>
      <!-- <view>
        <ul>
          <li v-for="(x,index) in list" :key="index">列表</li>
        </ul>
      </view>-->

      <view class="scroll-bottom">
        <view class="my-scroll-p" v-if="state==4">{{stateITObj.loadMoreGoing}}</view>
        <view class="my-scroll-p" v-if="state==5">{{stateITObj.loadMoreEnd}}</view>
        <view v-if="state==7" class="my-scroll-p no-more-data" v-show="noMoreState">{{stateITObj.noMore}}</view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import './refreshmore.scss'
import { dsUtils } from '@/dsUtils'
export default {
  name: 'myScroll',
  props: {
    page: {
      type: Object, //counter:当前页  pageStart:开始页数  pageEnd:结束页数  total:总页数
    },
    onRefresh: {
      //刷新回调
      type: Function,
      require: true,
    },
    onLoadMore: {
      //加载回调
      type: Function,
      require: true,
    },
    getScrollTop: {
      //获取滚动条位置
      type: Function,
    },
    setScrollPage: {
      //改变滚动条位置
      type: Function,
    },
    scrollState: {
      //是否可滑动
      type: Boolean,
      require: true,
    },
    noMoreState: {
      //没有更多是否显示
      type: Boolean,
      require: true,
    },
    scrollMarginTop: {
      type: Number,
      default: 10,
    },
    stateInnerTextObj: {
      type: Object,
    },
    refreshState: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      pageX: 0,
      pageY: 0,
      state: 0,
      scrollPosition: 0,
      myScroll: null,
      myScrollList: null,
      top: 0,
      aspect: 0, //1:向下 2:向上
      listHeight: 0,
      taroEnv: process.env.TARO_ENV,
      scrollListOffsetHeight: 0,
      myScrollOffsetHeight: 0,
      stateITObj: {
        refreshBegin: '下拉刷新',
        refreshRelease: '松开刷新',
        refreshGoing: '刷新中……',
        refreshEnd: '刷新完成',
        loadMoreGoing: '加载中……',
        loadMoreEnd: '加载完成',
        noMore: '没有更多',
      },
      nowScrollTop:0
    }
  },
  watch:{
    stateInnerTextObj:{
      deep:true,
      handler(newVal){
        this.stateITObj={...this.stateITObj, ...newVal}
      }
    },
    refreshState: {
      deep:true,
      handler(newVal){
        this.setState(newVal)
      }
    },
  },
  mounted() {
    this.stateITObj={...this.stateITObj, ...this.stateInnerTextObj}
    this.myScroll = this.$refs.myScroll //获取滑条dom
    this.myScrollList = this.myScroll.children[1] //获取列表dom
    
    dsUtils
      .getElementNode('#myScroll')
      .then((res) => {
        console.log('myScroll:',res)
        this.myScrollOffsetHeight = res[0].height
      })
      .catch(() => {})
    dsUtils
      .getElementNode('#scrollList')
      .then((res) => {
        console.log('myscrollList:',res)
        this.scrollListOffsetHeight = res[0].height
      })
      .catch(() => {})
   
  },
  methods: {
    ScrollTop(top) {
      //修改滚动条位置
      this.myScroll.scrollTop = top
    },
    // /*
    //   * 刷新中：1
    //   * 松开刷新：2
    //   * 刷新完成：3
    //   * 加载中：4
    //   * 加载完成：5
    //   * 下拉刷新：6
    //   * 没有更多：7
    //   */
    setState(index) {
      //修改状态
      this.state = index
      if (index == 5 || index == 3) {
        setTimeout(() => {
          this.state = 0
          this.$emit('update:refreshState',0)
          this.top = 0
        }, 500)
      }
    },
    touchStart(e) {
      //触摸事件
      if (this.taroEnv == 'h5') {
        this.pageX = e.targetTouches[0].pageX
        this.pageY = e.targetTouches[0].pageY
      } else {
        this.pageX = e.touches[0].pageX
        this.pageY = e.touches[0].pageY
      }
    },
    touchMove(e) {
      //触摸滑动事件
      this.scrollPosition = 0 //获取滚动条位置
      let nowPageY =
        this.taroEnv == 'h5' ? e.targetTouches[0].pageY : e.touches[0].pageY
      if (this.scrollState && nowPageY > this.pageY) {
        //向上滑动
        this.aspect = 2
        let diff = nowPageY - this.pageY - this.scrollPosition
        this.top = Math.pow(diff, 0.9)
        let ranget = (diff / this.myScrollOffsetHeight) * 100 //计算在屏幕上滑动了多少
        if(this.nowScrollTop == 0){
          if (ranget > 20) { 
          this.state = 2 //松开刷新
        } else if (ranget < 15) {
          this.state = 6 //下拉刷新
        }
        }
        
        // e.preventDefault()
      } else if (this.scrollState && this.state != 4) {
        //向下滑动
        this.aspect = 1
      }
    },
    touchEnd(e) {
      if ((this.aspect == 2 && this.state == 2) || this.state == 1) { //下拉刷新并且松开刷新,或者 刷新中
        //上拉处理
        if(this.nowScrollTop == 0){
          this.top = 100
          this.state = 1
          this.topCallback()
        }
      } else if (this.aspect == 2) {
        this.state = 0
        this.top = 0
      }
    },
    onScroll(e) {
      let listHeight = 0
      let listScrollTop = 0
      if (this.taroEnv == 'h5') {
        listHeight = this.myScrollList.offsetHeight //列表总高度
        listScrollTop = e.target.scrollTop + this.myScroll.offsetHeight //当前滚动条位置
        this.nowScrollTop = e.target.scrollTop
      } else {
        listHeight = this.scrollListOffsetHeight //列表总高度
        listScrollTop = e.detail.scrollTop + this.myScrollOffsetHeight //当前滚动条位置
        this.nowScrollTop = e.detail.scrollTop
      }
      let diff = listHeight-listScrollTop
      if (this.state == 0 && diff < 100) {
        this.bottomCallback()
      }
      if (this.getScrollTop) {
        //返回X，Y
        this.getScrollTop(e.target.scrollTop)
      }
    },
    topCallback() {
      //刷新回调 如果现在不是在顶部，我不希望可以加载这个刷新功能
        this.onRefresh(this.state)
    },
    bottomCallback() {
      //加载回调
      if (this.state != 7) {
        this.state = 4 //加载中
        this.onLoadMore()
      }
    },
  },
}
</script>
