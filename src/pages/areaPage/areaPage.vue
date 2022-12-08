<template>
  <view class="area_wrapper">
    <TitleBar :title-bar-obj="titleBarObj" @goBack="goBack" />
    <view class="list-warpper">
      <!-- <view class="list-right-wrapper" v-show="rightIsShow">
        <view v-for="(rightArr, index2) in list" :key="'index' + index2" :data-id="'index' + index2" :id="'index' + index2" @tap="jumpMt(index2)" :class="['right-item', listIndex == index2 ? 'active' : '']" v-show="rightArr.title != '常用城市'">
          {{ rightArr.title }}
        </view>
      </view> -->
      <!-- 搜索框 最新UE不需要搜索
      <view v-show="config.search" class="list-search" :style="{ height: config.searchHeight + 'px' }">
        <view class="list-search-box">
          <icon type="search" size="15" @tap="jumpMt" />
          <input class="list-search-box-input" placeholder="输入城市名搜索" @input="input" @blur="searchMt" />
        </view>

        <view class="cancel-button" @tap="jumpMt"> 搜索</view>
      </view> -->
      <!-- <view v-show="config.suctionTop" class="fiexed-box list-title" :style="{
          transform: `translateY(-${moveDistance}px)`,
          top: `${search}` ? `${90}rpx` : 0,
        }">
      </view> -->
      <!-- 搜索到所有数据的时候显示 -->
      <scroll-view v-show="list.length != 0" :scroll-y="true" class="scroll-view-area" @scroll="scroll" :scroll-into-view="listGroup">
        <!-- 我的位置  -->
        <!-- <view v-show="{{myCity}}">
          <view class='list-title fixed-title-hock'>我的位置</view>
          <view class='list-horizontal'>
            <view class='list-name {{idx === 0 ?"":"border"}}' data-detail="{{city}}" @tap='locationMt'>
              {{myCity}}
            </view>
          </view>
        </view> -->
        <!-- 主体内容显示 -->
        <view v-for="(item, index) in list" :key="`group${index}`" :id="`list-group-id${index}`">
          <view class="list-title fixed-title-hock" :class="{'title-white':item.type === 'hot'}">
            {{ item.title }}
          </view>
          <view :class="(config.horizontal && item.type === 'hot') || item.type === 'hot' ? 'list-horizontal' : ''">
            <view class="list-name" :class="{'list-name-border': index !== 0}" v-for="(it, ind) in item.item" :key="`name${ind}`" @tap="detailMt(it)">
              {{ it.name }}
            </view>
          </view>
        </view>
      </scroll-view>
      <!-- 右侧索引显示  -->
      <view class="list-right-wrapper">
        <view class="right-item" :style="{'color': rAct== ind ? '#11A9B0':'#666'}" v-show="it.title != '常用城市'" v-for="(it, ind) in list" :key="ind" @tap="jumpMt(ind)">
          {{ it.title }}
        </view>
      </view>

      <!-- 没有搜索到数据的时候显示 -->
      <view v-show="list.length == 0">
        <view class="nodata">没有搜索到相关的数据哦</view>
      </view>
    </view>
  </view>
</template>
<script>
  import "./areaPage.scss";
  import TitleBar from "@/components/titleBar/titleBar";
  import AOP from "../../utils/wsgwH5Sdk/wsgwH5Sdk";
  import Taro from "@tarojs/taro";

  export default {
    components: {
      TitleBar,
    },
    data() {
      return {
        titleBarObj: {
          title: "地址选择",
          // tokenBol: false,
          arrowWhite: false,
          isNoShowArrow: false,
          isOpenBgBlue: '#11A9B0',//默认false透明色 true蓝色  '#FFFFFF'指定色
          arrowWhite: true,//文字颜色 true白 false黑

        },
        list: [], // 列表
        listGroup: '', // 每组城市元素的id 例如 list-group-id0
        rAct: 0, // 右侧索引红色字母ind
        scrollDistanceArr: [], //每组城市到scrollview顶部的滚动距离
        // rightIsShow: false, //右侧首字母导航
        // rightArr: [], // 右侧字母展示
        // jumpNum: 1, //跳转到那个字母
        // myCityName: "请选择", // 默认我的城市
        // topGroup: [], // 内容高度数据
        // pos: {
        //   isTop: false,
        //   y: 0,
        //   oldIndex: -1,
        // },
        // listIndex: 0,
        // moveDistance: 0,
        // data: {},
        // myCity: false,
        // search: "",

        // city: [],
        config: {
          horizontal: true, // 第一个选项是否横排显示（一般第一个数据选项为 热门城市，常用城市之类 ，开启看需求）
          // search: true, // 是否开启搜索
          // searchHeight: 45, // 搜索条高度
          // suctionTop: false, // 是否开启标题吸顶
          // scrollTop: 11,
        },

        commonAddressArr: [], //常用城市
        addressList: {}, // 存储点击省市区乡镇
        newDetail: false, //选择地区了吗
        // mt: '',
      };
    },
    // onLoad
    onLoad(option) {
      let params = JSON.parse('{"Hierarchy":"3","obtainHierarchy":"2"}')
      // console.log(option,'option')
      this.getAddressList("-1");
      this.commonAddressArr = Taro.getStorageSync("AOP_COMMON_ADDRESS") || [];
      this.Hierarchy = params.Hierarchy ? params.Hierarchy : 2
      this.obtainHierarchy = params.obtainHierarchy ? params.obtainHierarchy : 1
    },
    beforeDestroy() {
      let __this = this
      if (!__this.newDetail) {
        AOP.onfire.fire("onChoose", null)
      }
    },

    onShow() {

    },

    methods: {
      /**
       * 数据重新渲染
       */
      // resetRight(data) {
      //   let rightArr = [];
      //   for (let i in data) {
      //     if (data[i].title.length && data[i].title.length > 1) {
      //       rightArr.push("");
      //     } else {
      //       rightArr.push(data[i].title.substr(0, 1));
      //     }
      //   }
      //   this.list = data;
      //   this.rightArr = rightArr;
      //   if (data.length != 0) {
      //     this.queryMultipleNodes();
      //   }
      // },
      /**
       * 右侧字母点击事件
       */
      jumpMt(ind) { //索引改变内容滚动位置
        this.listGroup = 'list-group-id' + ind
        this.rAct = ind
      },
      /**
       * 返回上页面
       */
      goBack() {
        Taro.navigateBack({
          delta: 1,
        });
      },
      /**
       * 列表点击事件
       */
      detailMt(it) {
        this.bindtap({ detail: it });
      },
      // 获取搜索输入内容
      // input(e) {
      //   this.value = e.detail.value;
      // },
      // 基础搜索功能
      // searchMt() {
      //   this._search();
      // },
      /**
       * 搜索相关逻辑实现
       */
      // _search() {
      //   let data = this.city;
      //   let newData = [];
      //   for (let i = 0; i < data.length; i++) {
      //     let itemArr = [];
      //     for (let j = 0; j < data[i].item.length; j++) {
      //       if (data[i].item[j].name.indexOf(this.value) > -1) {
      //         let itemJson = {};
      //         for (let k in data[i].item[j]) {
      //           itemJson[k] = data[i].item[j][k];
      //         }
      //         itemArr.push(itemJson);
      //       }
      //     }
      //     if (itemArr.length === 0) {
      //       continue;
      //     }
      //     newData.push({
      //       title: data[i].title,
      //       type: data[i].type ? data[i].type : "",
      //       item: itemArr,
      //     });
      //   }
      //   this.resetRight(newData);
      // },
      // 城市定位
      locationMt() {
        // TODO 暂时没有实现 定位自己的城市，需要引入第三方api
      },
      scroll(e) { //内容滚动改变索引字母
        if (this.listGroup) {
          this.listGroup = ''
          return
        }
        let rAct = 0
        for (let i = 0; i < this.scrollDistanceArr.length - 1; i++) {
          if (this.scrollDistanceArr[i] <= e.detail.scrollTop && e.detail.scrollTop < this.scrollDistanceArr[i+1]) {
            rAct = i
            break;
          }
        }
        this.rAct = rAct
      },
      querySelectId(theId) { //根据id获取元素对应高度
        return new Promise((resolve,reject)=>{
          Taro.createSelectorQuery().select(theId).boundingClientRect().exec(function(res){ //微信 支付宝
            if (res && res[0] && res[0].height) {
              resolve(res[0].height)
            }
          })
        })
      },
      getScrollDistance(){ // 获取每组城市到scrollview顶部的滚动距离
        return new Promise((resolve,reject)=>{
          if (this.list.length > 0) {
            let arr = []
            this.list.forEach((item,index)=>{
              arr.push(this.querySelectId(`#list-group-id${index}`))
            })
            let scrollDistanceArr = []
            Promise.all([...arr]).then((res) => {
              let height = 0
              scrollDistanceArr.push(height) //初始为0
              for (let i = 0; i < res.length - 1; i++) {//其余累加
                height += res[i]
                scrollDistanceArr.push(height)
              }
              resolve(scrollDistanceArr)
            })
          }
        })
      },
      /**
       * 获取节点信息
       */
      // queryMultipleNodes() {
      //   let self = this;
      //   const query = Taro.createSelectorQuery().in(this);
      //   query
      //     .selectAll(".fixed-title-hock")
      //     .boundingClientRect((res) => {
      //       res.forEach(function(rect) {
      //         rect.top; // 节点的上边界坐标
      //       });
      //     })
      //     .exec((e) => {
      //       let arr = [];
      //       e[0].forEach((rect) => {
      //         let num = 0;
      //         if (rect.top !== 0) {
      //           num =
      //             rect.top -
      //             (self.data.config.search ? self.data.config.searchHeight : 0);
      //         }
      //         arr.push(num);
      //       });
      //       this.topGroup = arr;
      //     });
      // },

      /**
       * 获取地区数据重新渲染
       */
      getAddressList(code) {
        let __this = this
        Taro.showLoading({
          title: '加载中',
          mask: true
        })
        AOP.httpApi({ //地区搜索
          isInner: true,
          url: '/osg-open-om0001/member/c72/f04',
          data: {
            "pCodeValue": code,
          }
        }).then((res) => {
          if (res.code == '1' && res.data.length > 0) {
            __this.list = __this.handleAdrData(res.data);
            __this.city = __this.handleAdrData(res.data);
            Taro.nextTick(()=>{
              __this.getScrollDistance().then((scrollDistanceArr)=>{
                this.scrollDistanceArr = [...scrollDistanceArr]
                this.jumpMt(0)
              })
            })
          } else {
            Taro.showToast({
              title: '暂无信息', // {"code":1,"message":"成功","data":[]}
              icon: 'none',
            })
          }
          Taro.hideLoading()
        }).catch((err) => {
          Taro.hideLoading()
          console.log(err)
        })
      },
      /**
       * 处理数据为二维数组模式
       */
      handleAdrData(list) {
        let pinYinObj = {}; //key值为拼音的对象
        let erWeiArr = []; //最终二维数组数组
        // 提取Key值
        list.forEach((item, index) => {
          let pYKey = item.content5.slice(0, 1).toUpperCase();
          if (pinYinObj[pYKey]) {
            pinYinObj[pYKey].push(item);
          } else {
            pinYinObj[pYKey] = [item];
          }
        });
        // 排序并转换为二维数组
        for (var key in this.objKeySort(pinYinObj)) {
          this.objKeySort(pinYinObj)[key].forEach((item2, index2) => {
            item2.name = item2.codeName;
            item2.key = key;
          });
          erWeiArr.push({ title: key, item: pinYinObj[key] });
        }
        if (this.commonAddressArr.length > 0) {
          // 手动加入常用城市
          erWeiArr.unshift({
            title: "常用城市",
            type: "hot",
            item: this.commonAddressArr,
          });
        }

        return erWeiArr;
      },
      /**
       * 数据按字母顺序排序
       */
      objKeySort(obj) {
        //排序的函数
        var newkey = Object.keys(obj).sort();
        //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
        var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
        for (var i = 0; i < newkey.length; i++) {
          //遍历newkey数组
          newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
        }
        return newObj; //返回排好序的新对象
      },
      /**
       * 存储常用城市
       */
      handleCacheList(data) {
        let isIn = this.commonAddressArr.some((item) => { // 本次点击的城市是否已经包含在常用城市数组中? 是true 否false
          return (item.codeType == data.codeType && item.codeValue == data.codeValue)
        })
        if (!isIn) { //不包含
          if (this.commonAddressArr.length >= 8) {
            this.commonAddressArr.pop() // 尾部去掉一个记录的城市
          }
          this.commonAddressArr.unshift(data) // 头部新增本次点击的城市
          Taro.setStorageSync("AOP_COMMON_ADDRESS", this.commonAddressArr)
        }
      },
      bindtap(e) {
        const specialCity = ["110000", "120000", "310000", "500000"] // 四个直辖市 北京 天津 上海 重庆
        if (specialCity.indexOf(e.detail.codeValue) > -1) { //选择直辖市
          let newDetail = {
            pCodeName: e.detail.codeName
          }
          Object.assign(newDetail, e.detail) // 直辖市 省名=市名
          this.getAddressList(e.detail.codeValue) //再次渲染下一级地区列表
          console.log('直辖市', e.detail)
          this.addressList.provinceName = e.detail.codeName;
          this.addressList.provinceCode = e.detail.codeValue;
          // this.handleCacheList(newDetail) //记录常用地区
          // this.newDetail = true
          // AOP.onfire.fire("onChoose", newDetail)
          // setTimeout(()=>{
          //   Taro.navigateBack({
          //     delta:1,
          //   })
          // },0)
        } else if (e.detail.pCodeValue == "-1") { //选择省级城市
          console.log('省', e.detail)
          this.addressList.provinceName = e.detail.codeName;
          this.addressList.provinceCode = e.detail.codeValue;
          this.getAddressList(e.detail.codeValue) //再次渲染下一级地区列表
        } else if (e.detail.content0 * 1 <= this.Hierarchy) { //选择省下面的市级城市
          console.log('市', e.detail)
          this.addressList.cityName = e.detail.codeName;
          this.addressList.cityCode = e.detail.codeValue;
          this.getAddressList(e.detail.codeValue) //再次渲染下一级地区列表
        } else {
          this.addressList.countyName = e.detail.codeName;
          this.addressList.countyCode = e.detail.codeValue;
          console.log('区', e.detail)
          // let newDetail = {
          //   pCodeName: this.obtainHierarchy == '1' ? this.addressList.provinceName : (this.obtainHierarchy == '2' ? this.addressList.cityName : this.addressList.countyName)
          // }
          Object.assign(this.addressList, e.detail)
          this.handleCacheList(this.addressList) //记录常用地区
          this.newDetail = true
          AOP.onfire.fire("onChoose", this.addressList)
          setTimeout(() => {
            Taro.navigateBack({
              delta: 1,
            })
          }, 0)
        }
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
  };
</script>
