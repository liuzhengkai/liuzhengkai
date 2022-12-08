<template>
  <view>
    canvas
    <view
      class="inner"
      :style="{width:canvasProps.width, height:canvasProps.height}"
      id="inner"
      @tap="canvasClickFn"
    >
      <canvas class="_canvas" canvas-id="shareImg" id="shareImg"></canvas>
    </view>
  </view>
</template>
<script>
import Taro from '@tarojs/taro'
import { dsUtils } from '@/dsUtils'
export default {
  data() {
    return {
      taroEnv: process.env.TARO_ENV,
      context: {},
      canvasWidth: '200',
      canvasHeight: '100',
      randomNumber: '1234',
      canvasProps: {
        randomNumber: '',
        width: '',
        height: '',
      },
    }
  },
  props: {
    canvasObj: {
      type: Object,
    },
  },
  watch: {
    canvasObj(newval) {
      this.canvasProps = newval
    },
    'canvasObj.randomNumber'(val) {
      this.canvasProps.randomNumber = val

      this.queryMsg()
    },
  },
  mounted() {
    this.initCanvasObj()
    setTimeout(() => {
      this.queryMsg()
    }, 1000)
    dsUtils.getElementNode('#inner').then((res) => {
      console.log('**dsutils@@@@@@@@@@@************', res)
    })
  },
  onReady() {},
  methods: {
    canvasClickFn() {
      this.$emit('canvasClickFn')
    },
    initCanvasObj() {
      this.canvasProps = { ...this.canvasProps, ...this.canvasObj }
    },
    queryMsg() {
      console.log('queryMsg')
      this.context = Taro.createCanvasContext('shareImg')
      this.context.textBaseline = 'middle'
      this.context.fillStyle = this.randomColor(180, 240)
      this.context.fillRect(
        0,
        0,
        this.canvasProps.width,
        this.canvasProps.height
      )
      console.log(
        'context',
        this.context,
        'this.canvasHeight:',
        this.canvasProps.width,
        this.canvasProps.height
      )
      let randomNumber = this.canvasProps.randomNumber
      for (let i = 0; i < 4; i++) {
        let letter = randomNumber[i],
          x = (100 / 6) * i + 5,
          y = 30 / 2,
          deg = this.randomNum(-30, 30)
        this.context.font = 25 + 'px SimHei' //随机生成字体大小;
        this.context.fillStyle = this.randomColor(50, 160)
        this.context.shadowOffsetX = this.randomNum(0, 0)
        this.context.shadowOffsetY = this.randomNum(0, 0)
        this.context.shadowBlur = this.randomNum(-3, 3)
        this.context.shadowColor = 'rgba(0, 0, 0, 0.3)'
        this.context.translate(x, y)
        this.context.rotate((deg * Math.PI) / 180)
        this.context.fillText(letter, 0, 0)
        this.context.rotate((-deg * Math.PI) / 180)
        this.context.translate(-x, -y)
      }
      for (let i = 0; i < 3; i++) {
        this.context.strokeStyle = this.randomColor(40, 180)
        this.context.beginPath()
        this.context.moveTo(this.randomNum(0, 100), this.randomNum(0, 30))
        this.context.lineTo(this.randomNum(0, 100), this.randomNum(0, 30))
        this.context.stroke()
      }
      this.context.draw()
      this.context.stroke()
    },
    //随机生成字体颜色
    randomColor(min, max) {
      let r = this.randomNum(min, max)
      let g = this.randomNum(min, max)
      let b = this.randomNum(min, max)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    //随机生成数字
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
  },
}
</script>