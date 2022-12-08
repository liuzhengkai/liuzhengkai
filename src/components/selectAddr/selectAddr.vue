<template>
  <view class="rule">
    <TitleBar :title-bar-obj="titleBarObj" @goBack="clickBack" />
    <view
      class="listStyle"
      :class="{ continerIOS: isbackIOS, isAndorid: !isbackIOS }"
    >
      <view
        class="letterProvince"
        v-for="(item, index) in letterProvince"
        :key="index"
      >
        <view v-if="item.proList.length > 0">
          <view class="letter">{{ item.letter }}</view>
          <view
            class="proListItem"
            v-for="(items, indexs) in item.proList"
            :key="indexs"
            @tap="queryAddr(items.id, items.regionName)"
          >
            {{ items.regionName }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import "./selectAddr.scss";
import TitleBar from "@/components/titleBar/titleBar";
import Modal from "@/components/modal/modal";
import { strChineseFirstPY, oMultiDiff, areaList } from "./addressManage";
import { dsUtils } from "@/dsUtils";
export default {
  components: { TitleBar, Modal },
  props: {
    addressObj: {
      type: Object,
    },
  },
  computed: {},
  data() {
    return {
      letterProvince: [],
      clickBackArea: [],
      areaInfo: {
        province: "",
        provinceId: "",
        city: "",
        cityId: "",
        districtId: "",
        district: "",
      },
      AreaId: "",
      isbackIOS: false,
      show: true,
      stroageFlag: true,
      provinceList: [],
      cityList: [],
      titleBarObj: {
        //titleBar组件
        title: "选择地址",
        arrowWhite: false,
        TBRight: {
          srcPath: "",
        },
      },
    };
  },
  created() {
    this.compare();
    this.initFunc(this.AreaId, "");
    dsUtils.log(this.addressObj);
  },
  beforeDestroy() {},
  methods: {
    //初始化
    initFunc(AreaId, regionName) {
      let that = this,
        data = {
          superiorId: AreaId,
        };
      if (this.areaInfo.province != "" && this.areaInfo.city != "") {
        this.areaInfo.district = regionName;
        this.areaInfo.districtId = AreaId;
        //组件传值
        this.$emit("selectAddrFunc", {
          areaInfo: that.areaInfo,
          selectAddrFlag: false,
        });
        this.areaInfo = {
          province: "",
          provinceId: "",
          city: "",
          cityId: "",
          districtId: "",
          district: "",
        };
        return;
      }
      dsUtils.request(this.addressObj.url, {
        params: data,
        code: "1",
        paramsFlag: "1",
        success: (response) => {
          dsUtils.log(response, "osg-ic0001/member/c1/01030029");
          if (response.rcode == 0) {
            if (response.content.responseCode == "0000") {
              for (let item in areaList) {
                areaList[item].proList = [];
              }
              let list = response.content.regionList;
              for (let item in list) {
                for (let items in areaList)
                  if (
                    that.checkCh(list[item].regionName[0])[0] ==
                    areaList[items].letter
                  ) {
                    areaList[items].proList.push(list[item]);
                  }
              }
              that.letterProvince = areaList;
              if (that.stroageFlag) {
                if (that.areaInfo.province == "") {
                  that.areaInfo.provinceId = AreaId;
                  that.areaInfo.province = regionName;
                } else if (that.areaInfo.city == "") {
                  that.areaInfo.cityId = AreaId;
                  that.areaInfo.city = regionName;
                }
              }
            } else {
              dsUtils.toast(response.content.responseDesc);
            }
          } else {
            dsUtils.toast(response.resultMsg);
          }
        },
        fail() {},
      });
    },
    //判断ios 安卓
    compare() {
      dsUtils.log(navigator.userAgent, "navigator.userAgent");
      if (navigator.userAgent.indexOf("iPhone") > -1) {
        this.isbackIOS = true;
      } else {
        this.isbackIOS = false;
      }
    },
    //点击返回按钮
    clickBack() {
      this.stroageFlag = false;
      if (this.areaInfo.city != "") {
        let id = this.areaInfo.provinceId,
          city = this.areaInfo.province;
        this.areaInfo.provinceId = "";
        this.areaInfo.city = "";
        this.initFunc(id, city);
        return;
      } else if (this.areaInfo.province != "") {
        this.areaInfo.province = "";
        this.areaInfo.provinceId = "";
        this.initFunc("", "");
        return;
      }
      //传输关闭组件标识
      this.$emit("selectAddrFunc", {
        areaInfo: this.areaInfo,
        selectAddrFlag: false,
      });
    },
    //查询地区信息
    queryAddr(AreaId, regionName) {
      this.stroageFlag = true;
      this.initFunc(AreaId, regionName);
    },
    //处理多音字
    checkCh(ch) {
      let uni = ch.charCodeAt(0);
      //如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
      if (uni > 40869 || uni < 19968) return ch; //dealWithOthers(ch);
      //检查是否是多音字,是按多音字处理,不是就直接在strChineseFirstPY字符串中找对应的首字母
      return oMultiDiff[uni]
        ? oMultiDiff[uni]
        : strChineseFirstPY.charAt(uni - 19968);
    },
  },
};
</script>
