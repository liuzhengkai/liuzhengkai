<template>
  <view  :class="careEnv === '1'? 'careWrap':'defaultWrap'">
    <view class="page">
      <TitleBar :title-bar-obj="titleBarObj" @goBack="goBack" />
      <image class="header_bg" v-if="taroEnv == 'h5'" mode="widthFix" src="../../images/ds_header_eleList.png"></image>
      <image class="header_bg" v-else mode="widthFix" src="../../images/ds_header.png"></image>
      
      <!-- 数据差异化开始 -->
      <scroll-view :scroll-y="true" class="page-view" :class="{'TitleBar_Alipay': taroEnv != 'h5','TitleBar_H5':taroEnv == 'h5', 'TitleBar_H5_lf': taroEnv == 'h5'&& module_lf}">
        <view class="page-view-card">
          <!-- <view class="page-view-cardBox"> -->
            <view class="tips_goELe" @tap="goNativeEleList" v-show="itemData.NOTICE_TEXT">
              <view class="tips_goELe_left">
                <view class="img_center"><image class="tips_logo" src="../../images/ds_p_tip.png" /></view>
                <view class="tips_text">{{itemData.NOTICE_TEXT}}</view>
              </view>
              <view class="img_center" v-show="itemData.STOP_WATCH"><image class="tips_back" src="../../images/ds_p_back.png" /></view>
            </view>
            <view class="infoBox">
              <!-- 公共部分 -->
              <view class="POWER_USER_NAME">
                <text class="shrink">户号信息</text>
                <view class="info">
                  <text>{{itemData.POWER_USER_ID}}</text> | <text>{{itemData.POWER_USER_NAME}}</text>
                </view>
              </view>
              <view class="POWER_USER_ADDR">
                <text class="shrink">用电地址</text>
                <text class="info">{{itemData.POWER_USER_ADDR}}</text>
              </view>
              <view class="POWER_COMPANY_NM">
                <text class="shrink">缴费单位</text>
                <text class="info">{{itemData.POWER_COMPANY_SHOW_NAME}}</text>
                <!-- POWER_COMPANY_SHOW_NAME 替换 POWER_COMPANY_NM liuzhengkai 2021-7-15 -->
              </view>

              <!-- 北京-POWER_USER_TYPE 00后付费-01预付费 -->
              <view v-if="itemData.PROVINCE_CODE == '11102'">
                <!-- 北京-预付费-00后付费-01预付费 -->
                <view v-if="itemData.POWER_USER_TYPE == '01'">
                  <view class="LAST_CHARGE_DATE">
                    <text class="shrink shrink2">上次购电时间</text>
                    <text class="info">{{itemData.LAST_CHARGE_DATE}}</text>
                  </view>
                  <view class="LAST_BUY_ADDR">
                    <text class="shrink shrink2">上次购电金额</text>
                    <text class="info">{{'￥' + itemData.LAST_BUY_ADDR}}</text>
                  </view>
                  <view class="ADD_AMT">
                    <text class="shrink">补加金额</text>
                    <text class="info">{{'￥' + itemData.ADD_AMT}}</text>
                  </view>
                  <view class="DED_AMT" v-if="itemData.DED_AMT > 0">
                    <text class="shrink">扣减金额</text>
                    <view style="display: flex;">
                      <text class="info">{{'￥' + itemData.DED_AMT}}</text>
                      <view class="arrowBox_up" @tap="changeArrow" data-status="up">
                        <image class="upArrow" src="../../images/ds_top.png"
                          v-if="itemData.DED_AMT > 0 && Arrow == 'up'"></image>
                      </view>
                      <view class="arrowBox_down" @tap="changeArrow" data-status="down">
                        <image class="downArrow" src="../../images/ds_bottom.png"
                          v-if="itemData.DED_AMT > 0 && Arrow == 'down'"></image>
                      </view>
                    </view>
                  </view>
                  <view v-if="itemData.POWER_USER_TYPE == '01' && Arrow == 'up'">
                    <view class="REPAIR_LADDER_AMT" v-if="itemData.REPAIR_LADDER_AMT && itemData.REPAIR_LADDER_AMT > 0">
                      <text>补交阶梯差价金额</text>
                      <text class="distance">{{'￥' + itemData.REPAIR_LADDER_AMT}}</text>
                    </view>
                    <view class="REPAIR_LADDER_MONTH" v-if="itemData.REPAIR_LADDER_MONTH">
                      <text>补交阶梯差价电费月份</text>
                      <text class="distance">{{itemData.REPAIR_LADDER_MONTH}}</text>
                    </view>
                    <view class="REPAIR_PRESET_AMT" v-if="itemData.REPAIR_PRESET_AMT && itemData.REPAIR_PRESET_AMT > 0">
                      <text>补交预置金额</text>
                      <text class="distance">{{'￥' + itemData.REPAIR_PRESET_AMT}}</text>
                    </view>
                    <view class="REPAIR_URGENT_AMT" v-if="itemData.REPAIR_URGENT_AMT && itemData.REPAIR_URGENT_AMT > 0">
                      <text>补交应急购电金额</text>
                      <text class="distance">{{'￥' + itemData.REPAIR_URGENT_AMT}}</text>
                    </view>
                    <view class="REPAIR_REFUND_AMT" v-if="itemData.REPAIR_REFUND_AMT && itemData.REPAIR_REFUND_AMT > 0">
                      <text>补交退费调整金额</text>
                      <text class="distance">{{'￥' + itemData.REPAIR_REFUND_AMT}}</text>
                    </view>
                    <view class="REPAIR_EXCEED_AMT" v-if="itemData.REPAIR_EXCEED_AMT && itemData.REPAIR_EXCEED_AMT > 0">
                      <text>补交煤改电超补金额</text>
                      <text class="distance">{{'￥' + itemData.REPAIR_EXCEED_AMT}}</text>
                    </view>
                    <view class="REPAIR_EXCEED_MONTH" v-if="itemData.REPAIR_EXCEED_MONTH">
                      <text>补交煤改电超补电费月份</text>
                      <text class="distance">{{itemData.REPAIR_EXCEED_MONTH}}</text>
                    </view>
                  </view>
                </view>
                <view class="line"></view>

                <!-- 北京-预付费-01预付费 -->
                <view class="BALANCE" v-if="itemData.POWER_USER_TYPE == '01'">
                  <text>表内余额</text>
                  <text class="info info2" v-if="itemData.AVALIABLE_BALANCE < 0">{{itemData.AVALIABLE_BALANCE}}</text>
                  <text class="info info2" v-else>{{'￥' + itemData.AVALIABLE_BALANCE}}</text>
                </view>
                <view class="Arrears" v-if="itemData.actAmt < '0'">
                  <text></text>
                  <text class="info Arrears_color">已欠费，请及时充值</text>
                </view>
                <view class="DEADLINE_TIME" v-if="itemData.POWER_USER_TYPE == '01' && itemData.DEADLINE_TIME">
                  <text></text>
                  <text class="info info3">截止时间：{{itemData.DEADLINE_TIME}}</text>
                </view>

                <!-- 北京-后付费-00后付费 -->
                <view class="accountBalance" v-if="itemData.POWER_USER_TYPE == '00'">
                  <text>账户余额</text>
                  <text class="info info4">{{'￥' + itemData.BALANCE}}</text>
                </view>
                <view class="TOTAL_PAY_BREACH" v-if="itemData.POWER_USER_TYPE == '00'">
                  <text>应交金额</text>
                  <view style="display: flex;">
                    <text class="info info2">{{'￥' + itemData.TOTAL_PAY_BREACH}}</text>
                    <view class="arrowBox_up" @tap="changeArrow" data-status="up">
                      <image class="upArrow" src="../../images/ds_top.png"
                        v-if="itemData.TOTAL_PAY_BREACH > 0 && Arrow == 'up'"></image>
                    </view>
                    <view class="arrowBox_down" @tap="changeArrow" data-status="down">
                      <image class="downArrow" src="../../images/ds_bottom.png"
                        v-if="itemData.TOTAL_PAY_BREACH > 0 && Arrow == 'down'"></image>
                    </view>
                  </view>
                </view>
                <view v-if="itemData.POWER_USER_TYPE == '00' && Arrow == 'up'">
                  <view class="REPAIR_LADDER_AMT" v-for="(item,index) in ARREA_REC" :key="index">
                    <text>基本电费 ({{item.ARREARAGE_MONTH}}) ：</text>
                    <text class="distance">{{item.ARREARAGE_AMOUNT}}</text>
                  </view>
                  <view class="PENALTY_AMT" v-if="itemData.PENALTY_AMT > 0">
                    <text>违约金 ：</text>
                    <text class="distance">{{'￥' + itemData.PENALTY_AMT}}</text>
                  </view>
                </view>
              </view>
              <!-- 四川-LOCAL_RCV_FLAG  0否-1是 -->
              <view v-else-if="itemData.PROVINCE_CODE == '51101'">
                <view class="LAST_CHARGE_DATE">
                  <text class="shrink shrink2">上次购电时间</text>
                  <text class="info">{{itemData.LAST_CHARGE_DATE}}</text>
                </view>
                <view class="LAST_BUY_ADDR">
                  <text class="shrink shrink2">上次购电金额</text>
                  <text class="info">{{'￥' + itemData.LAST_BUY_ADDR}}</text>
                </view>

                <view class="line"></view>

                <!-- 四川 预付费 本地费控 -->
                <view class="BALANCE" v-if="itemData.LOCAL_RCV_FLAG == '1'">
                  <text>表内余额</text>
                  <text class="info info2" v-if="itemData.AVALIABLE_BALANCE < 0">{{itemData.AVALIABLE_BALANCE}}</text>
                  <text class="info info2" v-else>{{'￥' + itemData.AVALIABLE_BALANCE}}</text>
                </view>
                <view class="Arrears" v-if="itemData.actAmt < '0'">
                  <text></text>
                  <text class="info Arrears_color">已欠费，请及时充值</text>
                </view>

                <view class="DEADLINE_TIME" v-if="itemData.LOCAL_RCV_FLAG == '1' && itemData.DEADLINE_TIME">
                  <text></text>
                  <text class="info info3">余额提取时间：{{itemData.DEADLINE_TIME}}</text>
                </view>

                <!-- 四川 后付费 -->
                <view class="TOTAL_PAY_BREACH" v-if="itemData.LOCAL_RCV_FLAG == '0'">
                  <text>应交金额</text>
                  <text class="info info2">{{'￥' + itemData.TOTAL_PAY_BREACH}}</text>
                </view>
              </view>
              <!-- 浙江 33101 -->
              <view v-else-if="itemData.PROVINCE_CODE == '33101'">
                <view class="line"></view>
                <view v-if="itemData.POWER_USER_TYPE == '01'">
                  <view class="BALANCE">
                    <text>余额</text>
                    <text class="info info2" v-if="itemData.AVALIABLE_BALANCE < 0">{{itemData.AVALIABLE_BALANCE}}</text>
                    <text class="info info2" v-else>{{'￥' + itemData.AVALIABLE_BALANCE}}</text>
                  </view>
                  <view class="Arrears" v-if="itemData.actAmt < '0'">
                    <text></text>
                    <text class="info Arrears_color">已欠费，请及时充值</text>
                  </view>

                  <view class="DEADLINE_TIME" v-if="itemData.DEADLINE_TIME">
                    <text></text>
                    <text class="info info3">截止时间：{{itemData.DEADLINE_TIME}}</text>
                  </view>
                </view>
                <view v-if="itemData.POWER_USER_TYPE == '00'">
                  <view class="accountBalance">
                    <text>账户余额</text>
                    <text class="info info4">{{'￥' + itemData.BALANCE}}</text>
                  </view>
                  <view class="TOTAL_PAY_BREACH">
                    <text>应交金额</text>
                    <text class="info info2">{{'￥' + itemData.TOTAL_PAY_BREACH}}</text>
                  </view>
                </view>
              </view>
              <!-- 天津 12101 -->
              <!-- LOCAL_RCV_FLAG  0否-1是 -->
              <view v-else-if="itemData.PROVINCE_CODE == '12101'">
                <view class="line"></view>
                <!-- 天津 预付费 非本地费控 -->
                <view class="BALANCE" v-if="itemData.POWER_USER_TYPE == '01' && itemData.LOCAL_RCV_FLAG == '0'">
                  <text>余额</text>
                  <text class="info info2" v-if="itemData.AVALIABLE_BALANCE < 0">{{itemData.AVALIABLE_BALANCE}}</text>
                  <text class="info info2" v-else>{{'￥' + itemData.AVALIABLE_BALANCE}}</text>
                </view>
                <!-- 天津 预付费 本地费控 -->
                <view class="BALANCE" v-if="itemData.POWER_USER_TYPE == '01' && itemData.LOCAL_RCV_FLAG == '1'">
                  <text>表内余额</text>
                  <text class="info info2" v-if="itemData.AVALIABLE_BALANCE < 0">{{itemData.AVALIABLE_BALANCE}}</text>
                  <text class="info info2" v-else>{{'￥' + itemData.AVALIABLE_BALANCE}}</text>
                </view>
                <view class="Arrears" v-if="itemData.actAmt < '0'">
                  <text></text>
                  <text class="info Arrears_color">已欠费，请及时充值</text>
                </view>
                <view class="DEADLINE_TIME" v-if="itemData.POWER_USER_TYPE == '01' && itemData.DEADLINE_TIME">
                  <text></text>
                  <text class="info info3">截止时间：{{itemData.DEADLINE_TIME}}</text>
                </view>
                <!-- 天津 后付费 -->
                <view class="BALANCE" v-if="itemData.POWER_USER_TYPE == '00'">
                  <text>应交金额</text>
                  <text class="info info2">{{'￥' + itemData.TOTAL_PAY_BREACH}}</text>
                </view>
              </view>
              <view v-else>
                <view class="line"></view>
                <!-- 预付费 -->
                <view v-if="itemData.POWER_USER_TYPE == '01'">
                  <view class="BALANCE">
                    <text>余额</text>
                    <text class="info info2" v-if="itemData.AVALIABLE_BALANCE < 0">{{itemData.AVALIABLE_BALANCE}}</text>
                    <text class="info info2" v-else>{{'￥' + itemData.AVALIABLE_BALANCE}}</text>
                  </view>
                  <view class="Arrears" v-if="itemData.actAmt < '0'">
                    <text></text>
                    <text class="info Arrears_color">已欠费，请及时充值</text>
                  </view>
                </view>

                <!-- 后付费 -->
                <view class="accountBalance" v-if="itemData.POWER_USER_TYPE == '00'">
                  <text>账户余额</text>
                  <text class="info info4">{{'￥' + itemData.BALANCE}}</text>
                </view>
                <view class="TOTAL_PAY_BREACH" v-if="itemData.POWER_USER_TYPE == '00'">
                  <text>应交金额</text>
                  <text class="info info2">{{'￥' + itemData.TOTAL_PAY_BREACH}}</text>
                </view>
              </view>
            </view>
          <!-- </view> -->
        </view>

        <!-- 输入金额  -->
        <view class="page-view-pay">
          <view class="pay-money-title">购电金额</view>
          <!-- 金额块和金额输入框 -->
          <view>
            <view class="checked-list" v-show="showArr">
              <view v-for="(item, index) in checkedArr" :key="index" @tap="checkedBlock(item)"
                :class="{'checked-block':true,  'checked-view': checkedIndex == index &&  item.checked && taroEnv != 'h5', 'checked-view-green': checkedIndex == index &&  item.checked && taroEnv == 'h5', 'disabled-block': !item.checked }">
                <view v-show="checkedIndex == index && item.checked"
                  :class="{'checked-view-el': checkedIndex == index && item.checked && taroEnv != 'h5',
                  'checked-view-el-green': checkedIndex == index && item.checked && taroEnv == 'h5'}">
                  <image src="../../images/ds_checked.png" class="checked-view-el-image"></image>
                </view>
                <view style="font-weight: 600;">￥{{item.value}}</view>
              </view>
            </view>
            <view class="pay-money-input" v-if="BDInputRefresh">
              <view class="pay-money-input-view">￥</view>
                <van-field v-show="this.taroEnv == 'h5'"
                v-model="payInputMoney" placeholder="请输入金额" type="number"
                @focus="moneyInputFocus" @blur="moneyInputBlur" @input="bindMoneyInput"
                :class="{'pay-money-input-input':true, 'input-view': true, 'money-input-focus': inputFocus && taroEnv != 'h5', 'money-input-focus-green': inputFocus && taroEnv == 'h5'}"
                />
                <input v-show="this.taroEnv != 'h5'" type="digit" :controlled="true" :enableNative="false"
                v-model="payInputMoney" placeholder="请输入金额" placeholder-class="placeholder-class"
                @focus="moneyInputFocus" @blur="moneyInputBlur" @input="bindMoneyInput"
                :class="{'pay-money-input-input':true, 'input-view': true, 'money-input-focus': inputFocus && taroEnv != 'h5', 'money-input-focus-green': inputFocus && taroEnv == 'h5'}"
                />
            </view>
            <!-- 立返活动名称 -->
            <view class="lf_label" v-show="module_lf">
              <view class="lf_label_item" v-for="(item, index) in lfResult" :key="index">{{item.acDescribe}}</view>
            </view>
          </view>
          <!-- 资产 start -->
          <view v-if="showAssets">
            <view class="proportion-tips" v-show="flagTips">
              <image src="../../images/ds_bell.png" class="proportion-tips-image"></image>
              本订单红包积分合计抵扣金额不可超过￥{{proportionTipsMoney}}
            </view>
            <!-- 优惠券 -->
            <view class="page-item" v-show="module_coupon">
              <view class="page-item-left">
                <image src="../../images/ds_coupon.png" class="page-item-left-cou-img"></image>
                <view>优惠券</view>
                <view v-show="recommendCouponTag" class="page-item-left-explain recommend-coupon-tag">已使用推荐优惠</view>
              </view>
              <view class="page-item-right" @tap="showCouponClick">
                <view class="page-item-right-usenum" style="color:#DA392C;margin-right: 10px;" v-show="couponSelectedMoney > 0">
                  -￥{{couponSelectedMoney}}</view>
                <view class="page-item-right-usenum" style="color:#929292;margin-right: 10px;"
                  v-show="currentMoney*1 > 0 && couponSelectedMoney*1 == 0 && couponUseRec.length > 0">
                  {{couponUseRec.length}}张可用
                </view>
                <view class="page-item-right-usenum" style="color:#929292;margin-right: 10px;"
                  v-show="currentMoney*1 > 0 && couponSelectedMoney*1 == 0 &&couponUseRec.length == 0">暂无可用</view>
                <view class="page-item-right-usenum" style="color:#929292;margin-right: 10px;"
                  v-show="currentMoney*1 == 0 && couponSelectedMoney*1 == 0">请选择</view>
                <image src="../../../assets/images/ds_right_arrow.png" class="page-item-left-cou-img2"></image>
              </view>
            </view>
            <!-- 红包 -->
            <view class="page-item page-item-red">
              <view class="page-item-left">
                <image src="../../images/ds_red_envelopes.png" class="page-item-left-image"></image>
                <view>红包</view>
                <view class="page-item-left-explain" v-show="redPackageAmount*1">共{{redPackageAmountCom}}元</view>
              </view>
              <view class="page-item-right">
                <view>
                  <van-field v-if="redPackageAmount*1 && this.taroEnv == 'h5'"
                  v-model="inputRedpackage" placeholder="单笔最多可用200.00" type="number"
                  @focus="redpackageInputFocus" @blur="redpackageInputBlur" @input="bindRedPackageInput"
                  style="text-align:right;"
                  />
                  <input v-if="redPackageAmount*1 && this.taroEnv != 'h5'" type="digit" :controlled="true"
                  v-model="inputRedpackage" placeholder="单笔最多可用200.00"
                  @focus="redpackageInputFocus" @blur="redpackageInputBlur" @input="bindRedPackageInput"
                  style="text-align:right;"
                  />
                </view>
               <view v-show="redPackageAmount*1" class="page-item-right-view">￥</view>
               <view style="color:#929292;margin-right: 10px;" v-show="!(redPackageAmount*1)"
                  class="page-item-right-view">暂无可用</view>
              </view>
            </view>
            <!-- 积分 -->
            <view class="page-item">
              <view class="page-item-left">
                <image src="../../images/ds_integral.png" class="page-item-left-image"></image>
                <view>积分</view>
                <view class="page-item-left-explain">{{integralTipsCom}}</view>
              </view>
              <!-- 如果用户不选择初始交费金额, 不允许选择积分 -->
              <view class="page-item-right" v-show="canIUseIntegral" @tap="currentMoney*1 ? openPicker() : redpackageInputFocus()">
                <view style="color:#DA392C;margin-right: 10px;" v-show="integralSelectedMoney" class="page-item-right-view">
                  -￥{{integralSelectedMoney}}</view>
                <view style="color:#929292;margin-right: 10px;" v-show="!integralSelectedMoney"
                  class="page-item-right-view">请选择</view>
                <image src="../../../assets/images/ds_right_arrow.png" class="page-item-right-image"></image>
              </view>
              <view class="page-item-right" v-show="!canIUseIntegral">
                <view style="color:#929292;margin-right: 10px;" v-show="pickerValue.integralNum < 200"
                  class="page-item-right-view">暂无可用</view>
              </view>
            </view>
            <view class="page-card-bottom">
              <view class="page-card-bottom-view" @tap="deductionRule">
                <image src="../../images/ds_tips.png" class="page-card-bottom-image"></image>
                <view class="page-card-bottom-gdk">共抵扣：</view>
                <view style="color:#DA392C;margin-right: 10px;" class="page-card-bottom-rmb">￥{{deductionAmount}}</view>
              </view>
            </view>
            <view class="page-card-tips" v-show="false&&showTips">
              注：优惠券、红包、积分抵扣部分无法开具发票
            </view>
          </view>
          <!-- 资产---end  -->
        </view>
        <!-- 输入金额---end -->
        

      </scroll-view>
      <!-- 数据差异化结束 -->
      <!-- 立返文案展示开始 -->
      <view class="backDiscount" v-if="module_lf && discountList.length && currentMoney > 0">
        <view class="backContent" v-show="taroEnv == 'h5'" v-if="refresh" v-html="lfInfo"></view>
        <rich-text v-show="taroEnv != 'h5'" v-if="refresh" :nodes="lfInfo"></rich-text>
        <view class="backDetail" @tap="openMark">
          <view>查看详情</view>
          <image class="ds_xdRight" src="../../images/ds_xdRight.png"></image>
        </view>
      </view>
      <!-- 立返文案展示结束 -->
      <!-- 实付金额---start -->
      <view class="page-footer">

          <view class="page-footer-row">
            <view class="page-footer-left">
              实付金额：
              <view style="color:#DA392C;display: flex;align-items: flex-end;">
                <view style="color:#DA392C; font-weight: 600;" class="sfje-num-rmb">￥</view>
                <view style="font-size:48rpx;margin-bottom: -6rpx; font-weight: 600;" class="sfje-num-left">
                  {{splitActualMoney[0]}}
                </view>
                <view class="sfje-num-right">.{{splitActualMoney[1]}}</view>
              </view>
            </view>
            <view @tap="confirmPay" :class="{'foot-btn':true, 'click-btn': isPay && taroEnv != 'h5', 'click-btn-green': isPay && taroEnv == 'h5', 'not-click-btn': !isPay && taroEnv != 'h5', 'not-click-btn-green': !isPay && taroEnv == 'h5'} ">立即支付</view>
          </view>
      </view>
      <!-- 实付金额---end -->
      <TableBar @goBack="goBack" @goHome="goHome" class="pay-electricity-charges-tablebar"></TableBar>
    </view>
    <!-- 立返优惠明细开始 -->
    <view class="discountDetailMatk" v-show="showMark">
      <view class="matkAll_d">
          <view class="mark_d_titleBox">
            <image class="mark_d_close" @tap="closeMark" src="../../../assets/images/ds_bill_close_changeList.png"></image>
            <view>
                <text class="mark_d_title">优惠明细</text>
            </view>
            <view class="mark_d_close"></view>
          </view>
          <view class="mark_d_center" v-if="refreshIt">
              <view class="mark_d_item" v-for="(item, index) in discountList" :key="index">
                <view class="mark_d_addressBox" v-show="item.frist">
                  <image class="ds_xdLeft" src="../../images/ds_xdLeft.png"></image>
                  <view class="mark_d_address">{{item.frist}}</view>
                </view>
                <view class="mark_d_name">{{item.activeName}}</view>
                <view class="mark_d_content" v-if="refreshIt" v-html="item.content">
                </view>
                <view class="mark_d_join" v-show="item.isJoin">已享活动</view>
              </view>
          </view>
          <view class="mark_d_footer">
            <image class="ds_xdTips" src="../../images/ds_xdTips.png"></image>
            <view>
              <view>活动奖励以电费到账后实际派发的为准。</view>
              <view>奖励获得积分，红包，优惠券仅限网上国网app端使用</view>
            </view>
          </view>
      </view>
    </view>
    <!-- 立返优惠明细结束 -->
    <!-- 积分picker -->
    <Picker :pickerValue="pickerValue"  @close="close"  @sure="sure" @notUsed="notUsed" :isShow="pickerIsShow"></Picker>
    <!-- 优惠券弹窗 -->
    <view class="picker_view_box" v-show="isShowCoupon">
      <view class="picker_view">
        <view class="picker_view_title">
          <view class="close" @tap="closeCoupon">×</view>
          <view>优惠券</view>
          <view class="no"></view>
        </view>
        <view class="tapChange">
          <view @tap="changeTap(true)" :class="{'tapChange_blue':coupon_type}">可用优惠券({{couponUseRec_num}})</view>
          <view @tap="changeTap(false)" :class="{'tapChange_blue':!coupon_type}">
            不可用优惠券({{couponList.length - couponUseRec_num}})</view>
        </view>
        <view class="noCoupon" v-show="couponUseRec.length == 0">
          <image class="noCouponImg" src="../../images/ds_un_coupon.png" />
          <text class="noCouponText">暂无优惠券</text>
        </view>
        <view v-show="coupon_type && couponUseRec.length > 0" class="deductionBox">
          您已选中优惠券<text>{{checkedCouponArr.length}}</text>张，共可抵用<text class="deductionMoney">¥{{couponSum}}</text>
          <view v-show="recommendCouponBtn" @tap="useRecommendCoupon" class="use-recommend-coupon">使用推荐优惠</view>
        </view>
        <view v-show="couponUseRec.length > 0" :class="{'couponList':true,'couponListShort':coupon_type && couponUseRec.length > 0}">
          <view :class="{'couponItem':coupon_type,'couponItem_gray':!coupon_type}" v-for="(item, index) in couponUseRec"
            :key="index" @tap="handleClickCoupon(item, index, coupon_type)">
            <view class="couponItem-left">
              <view class="couponItem-left-view">￥<text class="couponItem-left-text">{{item.COUPON_AMOUNT}}</text>
              </view>
              <view class="couponItem-left-view">满{{item.FULL_REDUCTOINO}}元可用</view>
            </view>
            <view class="couponItem-right">
              <view class="couponItem-right-l">
                <view class="right-title"><text class="right-title-text">{{item.COUPON_DESCRIBE}}</text></view>
                <!--                <view v-show="item.USE_STRATEGY.singleFlag == '01'">单张</view>
                <view v-show="!item.USE_STRATEGY.singleFlag">多张</view> -->
                <view class="right-time"><text style="color:#EA7120" v-show="false">即将到期</text>{{item.START_DATE}}-{{item.END_DATE}}</view>
                <view class="right-time right-time-describe" v-show="item.describe">{{item.describe}}</view>
                <image src="../../images/ds_overly.png" class="right-overly" v-show="item.img" alt="可叠加">
                </image>
              </view>
              <view class="couponItem-right-r">
                <view class="page-section-demo" v-show="coupon_type">
                  <radio :checked="item.checked" />
                </view>
              </view>
            </view>
          </view>
          <view class="btn_box" v-show="coupon_type && couponUseRec.length > 0">
            <button class="btn" @tap="sureCoupon">确认</button>
          </view>
        </view>
      </view>
    </view>
    <!-- 优惠券end -->
    <!-- 密码弹窗 -->
    <PaymentPasswordNoSet :isShow="paymentPasswordNoSetIsShow" @handleClickClose="paymentPasswordNoSetIsShow = false"
      @handleClickOk="surePaymentPassword">
    </PaymentPasswordNoSet>
    <PaymentPasswordSimple :isShow="paymentPasswordSimpleIsShow" :needCode="needCode" :money="moneyFen"
      :keyType="keyType" @handleClickClose="paymentPasswordSimpleIsShow = false" @handleClickOk="surePaymentPassword">
    </PaymentPasswordSimple>
    <!-- 密码弹窗 end -->
    <!-- 提示框 -->
    <Modal :modalValue="modalValue" :showComponents="showComponents" @cancel="cancel"/>
    <!-- 提示框end -->
  </view>

</template>

<script>
  import "./payElectricityCharges.scss";
  import Vue from 'vue';
  import { dsUtils } from "@/dsUtils";
  import TitleBar from "@/components/titleBar/titleBar";
  import Modal from "@/components/modal/modal";
  import Picker from "@/components/picker/picker";
  import PaymentPasswordNoSet from "@/components/paymentPasswordNoSet/paymentPasswordNoSet";
  import PaymentPasswordSimple from "@/components/paymentPasswordSimple/paymentPasswordSimple";
  import TableBar from "@/components/tableBar/tableBar";
  import { demoDataObj, demoDataAssets  } from './demoData';
  var flag
  export default {
    components: {
      TitleBar,
      Picker,
      PaymentPasswordNoSet,
      PaymentPasswordSimple,
      TableBar,
      Modal
    },
    data() {
      return {
        titleBarObj: {
          title: "交电费",
          arrowWhite: true, //箭头默认false为黑色，ture为白色
          isOpenBgBlue: false, // true 背景蓝。 false 默认色。
        },
			  showComponents: false, // 是否显示弹框
        modalValue: {
          modalTitle: '提示',//弹窗标题
          modalContent: [
            {
              content: '弹框内容'
            }
          ],//弹窗内容
          modalBtn: ['取消', '确认'], //弹窗按钮(一个按钮或两个按钮，默认两个)
          cancelColor: '', // 左按钮颜色
          confirmColor: '', // 右按钮颜色
          isContent: true, // 文字是否居中
        },
        itemData: [], // 页面数据对象
        Arrow: 'down', // 箭头切换
        AVALIABLE_BALANCE: '',
        ARREA_REC: [],
        careEnv: '', //控制样式 普通版0 关怀版1
        taroEnv: process.env.TARO_ENV,// 当前环境
        //交费金额相关--------------------------------
        checkedArr: [], //金额块数组
        checkedIndex: null, //当前选中的金额块
        showArr: true, // v-show金额块是否展示
        payInputMoney: '', //金额输入框
        BDInputRefresh: true,//百度小程序刷金额输入框dom
        inputFocus: false, //金额输入框高亮
        currentMoney: '', //【--初始金额--】 (输入框或者点击块的金额)
        actualMoney: '', //【--实付金额--】
        splitActualMoney: ['0', '00'], //切割实付金额
        isPay: false, //是否可点击立即支付按钮
        //资产及活动的开关----在created中根据环境判断修改----------------------------
        module_integralAndRedpackage: false, // 是否使用积分红包的相关模块
        module_coupon: false, // 在已开启红包积分模块的基础上, 是否增加优惠券模块
        module_recommendCoupon: false, // 在已开启优惠券模块的基础上, 是否使用[使用推荐优惠]功能
        module_defaultDeductio: false, // 是否使用默认抵扣非默认抵扣功能
        module_lf: false, // 是否使用立返的相关模块
        //资产抵扣时的比例---------------------------------------------------------------
        deductionRatio: '', //抵扣比例 【后端返的】
        //限制用户超额抵扣的提示--------------------------------------------------------------------------
        proportionTipsMoney: '', //提示横幅 - 本订单红包积分合计抵扣金额不可超过{{proportionTipsMoney}}
        flagTips: false, //是否显示横幅(v-if控制)
        //是否默认抵扣------------------------------------------------------
        isDefaultDeductio: '',  // 是否默认抵扣：0：不是 1：是 【后端返的】
        //优惠券相关------------------------------------------------------------------
        couponRec: [], // 优惠券列表【后端返的】
        couponList: [], //优惠券所有列表(优化时间格式的)
        couponUseRec: [], //优惠券可用列表
        couponListBeforeClose: [], //记录
        isShowCoupon: false, //优惠券弹窗v-show
        coupon_type: true, // 优惠券弹窗中 默认true显示可用优惠券列表(用于切换)
        couponUseRec_num: 0, // 优惠券弹窗中 切换栏上显示的可用条数
        province: {
          "11102":"北京",
          "12101":"天津",
          "13102":"河北",
          "13103":"冀北",
          "66103":"冀北", // 老掌电用户冀北省码
          "14101":"山西",
          "15101":"内蒙古东部",
          "21102":"辽宁",
          "22101":"吉林",
          "23101":"黑龙江",
          "31102":"上海",
          "32101":"江苏",
          "34101":"安徽",
          "33101":"浙江",
          "35101":"福建",
          "36101":"江西",
          "37101":"山东",
          "41101":"河南",
          "42102":"湖北",
          "43101":"湖南",
          "50101":"重庆",
          "51101":"四川",
          "54101":"西藏",
          "61102":"陕西",
          "62101":"甘肃",
          "63101":"青海",
          "64101":"宁夏", 
          "65101":"新疆"
        }, //省码
        checkedCouponArr: [], // 用户勾选的优惠券
        checkedCouponArrBeforeClose: [],//记录
        couponSum: '', // 用户勾选的优惠券合计减
        recommendCouponBtn: false, //优惠券弹窗中 [使用推荐优惠]按钮v-show
        recommendMoney: 0, // 推荐优惠金额
        recommendKey: [], //优惠券推荐方案的key
        recommendCouponTag: false, // 优惠券[已使用推荐优惠]标签v-show
        couponSelectedMoney: '', //【--优惠券优惠的金额--】
        //红包积分相关------------------------------------------------------------------
        showAssets: false, //是否显示资产(积分红包)(v-if控制页面样式)
        redPackageAmount: '', // 可用电费小红包总额(分) 【后端返的】
        inputRedpackage: '', //【--红包输入框的金额--】
        canIUseIntegral: false, //积分足够使用吗(v-show控制页面样式)
        pickerIsShow: false, //积分picker选择器是否显示
        pickerValue: { // 传入组件的对象
          integralList: [], //积分选择列表
          integralInd: 0, //选中的角标
          integralAble: '', // 可用总积分【后端返的】
          integralNum: '0', //帐号总积分【后端返的】
          deductionRatio: '', // 抵扣比例百分比
        },
        integralSelectedMoney: '', //【--积分picker最终选中的金额--】pick给出的角标所对应的金额
        //资产合计抵扣-------------------------------------------------------------------------
        deductionAmount: '0.00', // 抵扣金额
        //支付弹窗相关------------------------------------------------------------------------------------
        payPassword: '', //支付密码
        phoneCode: '', //手机验证码
        payPwdLeve: '', //支付密码等级
        payMark: '', //支付标识
        paymentPasswordNoSetIsShow: false, //未设置密码的弹窗
        paymentPasswordSimpleIsShow: false, //设置过密码的弹窗
        moneyFen: 0, // 传给组件的值 钱 (分)
        needCode: false, // 传给组件的值 是否需要验证码
        keyType: 'Number', // 传给组件的值 键盘类型
        optKey:'',//下单风控刷脸之后获取的值，需要代入下单接口里
        // 立返相关------------------------------------------------------------------------
        showMark: false, // 优惠明细弹框
        discountList: [], // 优惠明细
        lfInfo: '', // 立返展示文案
        acAddress: '', // 活动地区
        WALLET_COUNT: 0, // 红包活动笔数
        INTEGRAL_COUNT: 0, // 积分活动笔数
        COUPON_COUNT: 0, // 优惠券活动笔数
        refresh: true, // 刷新立返轮播文案
        refreshIt: true, // 刷新立返明细文案
        ACTIVITY_INFO: "", // 结果页立返文案
        activityList: [], // 立返信息汇总
        ACTIVITY_LIST: [], // 立返信息汇总(参数)
        SUB_RETURN_LIST: [], // 立返明细
        lfResult: [], // 立返标签数组
      }
    },
    created() {
      this.careEnv = dsUtils.careEnv
      this.itemData = dsUtils.getStorageSync('DS_ITEMDATA');
      // this.itemData = demoDataObj.data; // 测试立返放开 注释上一行
      this.itemData.BALANCE = dsUtils.fenToYuan(this.itemData.BALANCE); // 账户余额
      this.itemData.AVALIABLE_BALANCE = dsUtils.fenToYuan(this.itemData.AVALIABLE_BALANCE); // 测算可用余额
      this.itemData.TOTAL_PAY_BREACH = dsUtils.fenToYuan(this.itemData.TOTAL_PAY_BREACH); // 应交金额（欠费金额）
      this.itemData.PENALTY_AMT = dsUtils.fenToYuan(this.itemData.PENALTY_AMT); // 违约金
      this.itemData.WARN_AMT = dsUtils.fenToYuan(this.itemData.WARN_AMT); // 协议预警金额
      this.itemData.LAST_BUY_ADDR = dsUtils.fenToYuan(this.itemData.LAST_BUY_ADDR); // 上次购电金额
      this.itemData.ADD_AMT = dsUtils.fenToYuan(this.itemData.ADD_AMT); // 补加金额
      this.itemData.DED_AMT = dsUtils.fenToYuan(this.itemData.DED_AMT); // 扣减金额
      this.itemData.REPAIR_LADDER_AMT = dsUtils.fenToYuan(this.itemData.REPAIR_LADDER_AMT); // 补交阶梯差价金额
      this.itemData.REPAIR_PRESET_AMT = dsUtils.fenToYuan(this.itemData.REPAIR_PRESET_AMT); // 补交预置金额
      this.itemData.REPAIR_URGENT_AMT = dsUtils.fenToYuan(this.itemData.REPAIR_URGENT_AMT); // 补交应急购电金额
      this.itemData.REPAIR_REFUND_AMT = dsUtils.fenToYuan(this.itemData.REPAIR_REFUND_AMT); // 补交退费调整金额
      this.itemData.REPAIR_EXCEED_AMT = dsUtils.fenToYuan(this.itemData.REPAIR_EXCEED_AMT); // 补交煤改电超补金额
      if(this.taroEnv == 'h5'){ //h5开启 积分红包、优惠券
        this.module_integralAndRedpackage = true
        this.module_coupon = true
        this.module_recommendCoupon = true
        this.module_defaultDeductio = true
      } else {
        this.module_lf = true
      }
      dsUtils.dataCollection({
        "ACTTYPE": '0204',
        "SERVICEID": 'W2021000401',
        "PAGENAME": '交费小程序：输入金额页',
        "CHANNEL": dsUtils.getUserInfo().channelCode,
      })
    },
    mounted() {
      this.related() // 初始化
    },

    watch: {
      checkedIndex() { // 监听已选金额块的变动---影响初始交费金额currentMoney
        if (this.checkedArr[this.checkedIndex]) {
          this.inputFocus = false // 输入框无蓝边
          this.currentMoney = this.checkedArr[this.checkedIndex].val
        } else {
          this.currentMoney = this.payInputMoney
        }
      },
      currentMoney(newValue, oldValue) { // 监听初始交费金额currentMoney---1影响实付金额actualMoney---2红包积分优惠券需清零
        this.actualMoney = this.currentMoney
        if (this.actualMoney == 0) {
          this.splitActualMoney = ["0", "00"]
          this.isPay = false
        } else {
          this.splitActualMoney = dsUtils.formatMoney(this.actualMoney, true).split('.') // 切割实付金额
          this.isPay = true
        }

        if (this.module_integralAndRedpackage) { // (如果开启红包积分模块)
          this.inputRedpackage = '' //红包清零
          this.pickerValue.integralInd = 0 // 积分picker清零
          this.integralSelectedMoney = '' // 积分清零
          this.proportionTips() // 提示横幅功能可用 - 本订单红包积分合计抵扣金额不可超过{{proportionTipsMoney}}
        }
        if (this.module_coupon) { // (如果还开启了优惠券模块)
          this.couponListCanIUsed() // 优惠券可用不可用 (用于显示 暂无可用/n张可用)
          this.calcRecommendCoupon() //计算优惠券推荐金额
          this.checkedCouponArr = []
          this.couponSelectedMoney = ''
        }
        if (this.module_defaultDeductio) { // (如果还开启了默认抵扣/非默认抵扣功能)
          this.useDefaultProportion() // 使用默认抵扣
        }
        if(this.module_lf) { // (如果还开启了立返活动的相关模块)
          this.gear() // 立返档位判定
        }

      },
      inputRedpackage() { //监听红包金额
        this.calcMoney()

      },
      integralSelectedMoney() { //监听积分金额
        this.calcMoney()
      },
      checkedCouponArr: { //监听优惠券选择方案
        deep: true,
        handler() {
          let sum = 0
          this.checkedCouponArr.forEach((item) => {
            sum = dsUtils.floatAdd(sum, this.couponUseRec[item].COUPON_AMOUNT)
          })
          this.couponSum = sum
          if (this.module_recommendCoupon) { //如果用了[使用推荐优惠]功能
            this.recommendCouponBtn = this.compareCouponPlan(this.couponSum) === undefined ? false : !this.compareCouponPlan(this.couponSum) // 是否显示[使用推荐优惠]按钮
          }
        }
      },
      couponSelectedMoney(newValue, oldValue) { //监听使用优惠券优惠的金额couponSelectedMoney--影响实付金额
        let warn = this.proportionTips() //更新 最大抵扣金额 以及横幅是否显示
        if(warn == true){ // 选完优惠券后, 抵扣金额加起来超过实付金额
          this.inputRedpackage = '' //红包清零
          this.pickerValue.integralInd = 0 // 积分picker清零
          this.integralSelectedMoney = '' // 积分清零
        }
        this.calcMoney()
      }
    },
    computed: {
      integralTipsCom() {
        if (this.pickerValue.integralNum * 1 < 200) {
          this.canIUseIntegral = false
          return `共${this.pickerValue.integralNum}分，满200分可用`
        } else {
          this.canIUseIntegral = true
          return `共${this.pickerValue.integralNum}分`
        }
      },
      redPackageAmountCom() {
        return dsUtils.fenToYuan(this.redPackageAmount)
      }
    },
    methods: {
      // 打开立返详情弹框
      openMark() {
        this.showMark = true;
      },
      // 关闭立返详情弹框
      closeMark() {
        this.showMark = false;
      },
      // 判断立返档位 判断this.currentMoney/this.actualMoney在哪个档位  遍历rewardRule 放回index
      gear() {
        this.refresh = false
        this.lfInfo = '' //重置轮播内容
        Vue.nextTick(()=>{
          this.refresh = true
        })
        this.INTEGRAL_COUNT = this.WALLET_COUNT = this.COUPON_COUNT = 0; // 随机笔数
        this.discountList = []; // 弹窗列表
        this.ACTIVITY_LIST = []; // 前置立返活动信息
        this.SUB_RETURN_LIST = []; // 立返明细
        let arr = [];
        this.itemData?.HD_RESULT?.lfResult?.map((item,i)=> { // 遍历活动列表 item每个活动
          this.discountList.push({"activeName": item.acName,"content": "","isJoin":false,"province": item.provinceCode})
          Object.assign(this.discountList[0],{"frist": `${this.province[item.provinceCode]}地区活动`})
          let index = -1, money = item.ruleKey == 'orderAmount'? this.currentMoney : this.actualMoney;
          item.rewardRule.map((rewardRule)=> { // 判断档位
            if(rewardRule.compareMinValue * 1 <= dsUtils.yuanToFen(money) * 1) {
              index = index + 1
            }
          })
          
          let res = this.calculateRewards([{
            rewardList: index == -1 ? [] : item.rewardRule[index].rewardList,
            PROVINCE_CODE: item.provinceCode,
            AC_ID: item.acId,
            money: money <= item.rewardRule[item.rewardRule.length-1].compareMaxValue / 100 ? money : item.rewardRule[item.rewardRule.length-1].compareMaxValue / 100,
          }])
          this.ACTIVITY_LIST = this.ACTIVITY_LIST.concat(res.ACTIVITY_LIST)
          this.SUB_RETURN_LIST = this.SUB_RETURN_LIST.concat(res.SUB_RETURN_LIST)
          let str = ''; // 立返明细文案
          str = index >= 0 ? `${item.ruleKey == 'orderAmount'? '交费满' : '实付满'}<view class="diffColor">${dsUtils.
          formatMoney(item.rewardRule[index].compareMinValue / 100, false)}元</view>，预计${res.rewardInfo}` : ''
          this.discountList[i].isJoin = index < 0 ? false : true
          if (index != item.rewardRule.length-1){ // 不是最大档位
            str = str +  `多交<view class="diffColor">${dsUtils.formatMoney(dsUtils.floatSub(item.rewardRule[index + 1].compareMinValue / 100, money) * 1, false)}元</view>，预计${this.calculateRewards([{
            rewardList: item.rewardRule[index + 1].rewardList,
            PROVINCE_CODE: item.provinceCode,
            AC_ID: item.acId,
            money: item.rewardRule[index + 1].compareMinValue / 100,
          }]).rewardInfo}`
          }

          str = str.slice(0,-1)
          this.refreshIt = false;
          this.discountList[i].content = str;
          arr.push({
            rewardList: index == -1 ? [] : item.rewardRule[index].rewardList,
            PROVINCE_CODE: item.provinceCode,
            AC_ID: item.acId,
            money: money <= item.rewardRule[item.rewardRule.length-1].compareMaxValue / 100 ? money : item.rewardRule[item.rewardRule.length-1].compareMaxValue / 100,
          })
          Vue.nextTick(()=>{
            this.refreshIt = true;
          })
        })
        // 多个活动 滚动显示 刷新数据
        if(this.discountList.length > 0) {
          let i = 1;
          clearInterval(flag);
          this.refresh = false;
          this.lfInfo = this.lfNodes(this.discountList[0].content);
          Vue.nextTick(()=>{
            this.refresh = true;
          })
          if(this.discountList.length > 1) {
            flag = setInterval(() => {
              this.refresh = false;
              this.lfInfo = this.lfNodes(this.discountList[i].content);
              i++;
              if(i >= this.discountList.length){
                i = 0
              }
              Vue.nextTick(()=>{
                this.refresh = true;
              })
            },3000);
          }
        } else {
          clearInterval(flag);
        }
        let {rewardInfo, IS_RETURN_FLAG} = this.calculateRewards(arr, false);
        this.IS_RETURN_FLAG = IS_RETURN_FLAG
        this.ACTIVITY_INFO = rewardInfo == '' ? '' : `预计${rewardInfo}`.slice(0,-1).replace(/，/g, ',').replace(/[^\u4E00-\u9FA5\d\,\~\.]/g, '') // 入参需要处理成英文逗号
        console.log('IS_RETURN_FLAG：',this.IS_RETURN_FLAG)
        console.log('ACTIVITY_LIST：',JSON.parse(JSON.stringify(this.ACTIVITY_LIST)))
        console.log('SUB_RETURN_LIST：',JSON.parse(JSON.stringify(this.SUB_RETURN_LIST)))
        console.log('结果页立返文案:',this.ACTIVITY_INFO)
      },

      /**
        * 每个活动的立返奖励明细计算
        * @param {Object} item 每个活动
        * @param {Number} gear 档位
        * @param {Number} money 计算金额（元）
        */
      calculateRewards(arr, label=true) {
        let obj = {
          RANDOM_FLAG: false, 
          WALLET_AMOUNT: 0, INTEGRAL_AMOUNT: 0, COUPON_AMOUNT: 0,
          WALLET_RANDOM: [], INTEGRAL_RANDOM: [], COUPON_RANDOM: [],
          rewardInfo: '', ACTIVITY_LIST: [], SUB_RETURN_LIST: [], IS_RETURN_FLAG: false
        }
        arr.map((item)=> {
          item.rewardList.map((rewardList)=> {
            let finalVal = rewardList.rewardType == '02' && rewardList.maxLimit ? Math.min(rewardList.maxLimit, rewardList.rewardValue) : Number(rewardList.rewardValue)
            if(rewardList.rewardWay + rewardList.rewardType == '0101') {
              obj.INTEGRAL_AMOUNT = dsUtils.floatAdd(Number(obj.INTEGRAL_AMOUNT), Number(rewardList.rewardValue));
            } else if (rewardList.rewardWay + rewardList.rewardType == '0102') {
              obj.INTEGRAL_AMOUNT = dsUtils.floatAdd(Number(obj.INTEGRAL_AMOUNT), Math.floor(dsUtils.floatMultiply(item.money, finalVal) / 100))
            } else if (rewardList.rewardWay + rewardList.rewardType == '0103') {
              obj.INTEGRAL_RANDOM.push(rewardList?.rewardDesc.split('随机')[1].replace(/[^\d\~\.]/g, ""));
              obj.RANDOM_FLAG = true;
            } else if (rewardList.rewardWay + rewardList.rewardType == '0201') {
              obj.WALLET_AMOUNT = dsUtils.floatAdd(Number(obj.WALLET_AMOUNT), Number(rewardList.rewardValue / 100));
            } else if (rewardList.rewardWay + rewardList.rewardType == '0202') {
              obj.WALLET_AMOUNT = dsUtils.floatAdd(Number(obj.WALLET_AMOUNT), dsUtils.floatMultiply(item.money, finalVal))
            } else if (rewardList.rewardWay + rewardList.rewardType == '0203') {
              obj.WALLET_RANDOM.push(rewardList?.rewardDesc.split('随机')[1].replace(/[^\d\~\.]/g, ""));
              obj.RANDOM_FLAG = true;
            } else if (rewardList.rewardWay + rewardList.rewardType == '0301') {
              obj.COUPON_AMOUNT = dsUtils.floatAdd(Number(obj.COUPON_AMOUNT), Number(rewardList.rewardValue / 100))
            } else if (rewardList.rewardWay + rewardList.rewardType == '0302') {
              obj.COUPON_AMOUNT = dsUtils.floatAdd(Number(obj.COUPON_AMOUNT), dsUtils.floatMultiply(item.money, finalVal))
            } else if (rewardList.rewardWay + rewardList.rewardType == '0303') {
              obj.COUPON_RANDOM.push(rewardList?.rewardDesc.split('随机')[1].replace(/[^\d\~\.]/g, ""));
              obj.RANDOM_FLAG = true;
            }
          });
          obj.ACTIVITY_LIST.push({
            "AC_ID":item.AC_ID,
            "RETURN_WALLET_AMOUNT":dsUtils.yuanToFen(obj.WALLET_AMOUNT) * 1 || (obj.WALLET_RANDOM.length > 0 ? `随机${obj.WALLET_RANDOM[0]}` : 0),
            "RETURN_INTEGRAL_AMOUNT":obj.INTEGRAL_AMOUNT * 1 || (obj.INTEGRAL_RANDOM.length > 0 ? `随机${obj.INTEGRAL_RANDOM[0]}` : 0),
            "RETURN_COUPON_AMOUNT":dsUtils.yuanToFen(obj.COUPON_AMOUNT) * 1 || (obj.COUPON_RANDOM.length > 0 ? `随机${obj.COUPON_RANDOM[0]}` : 0),
            "RANDOM_FLAG":obj.RANDOM_FLAG,
            "PROVINCE_CODE":item.PROVINCE_CODE,
          })
          obj.SUB_RETURN_LIST.push({
            "AC_ID":item.AC_ID,
            "SUB_RETURN_WALLET_AMOUNT":dsUtils.yuanToFen(obj.WALLET_AMOUNT) * 1 || (obj.WALLET_RANDOM.length > 0 ? `随机${obj.WALLET_RANDOM[0]}` : 0),
            "SUB_RETURN_INTEGRAL_AMOUNT":obj.INTEGRAL_AMOUNT * 1 || (obj.INTEGRAL_RANDOM.length > 0 ? `随机${obj.INTEGRAL_RANDOM[0]}` : 0),
            "SUB_RETURN_COUPON_AMOUNT":dsUtils.yuanToFen(obj.COUPON_AMOUNT) * 1 || (obj.COUPON_RANDOM.length > 0 ? `随机${obj.COUPON_RANDOM[0]}` : 0),
            "RANDOM_FLAG":obj.RANDOM_FLAG,
          })
        })
        let infoArr = [
          obj.WALLET_AMOUNT == 0 ? '' : label ? `返<view class="diffColor">${obj.WALLET_AMOUNT}元</view>电费红包，` : `返${obj.WALLET_AMOUNT}元红包，` ,
          obj.INTEGRAL_AMOUNT == 0 ? '' : label ? `返<view class="diffColor">${obj.INTEGRAL_AMOUNT}</view>积分，` : `返${obj.INTEGRAL_AMOUNT}积分，`,
          obj.COUPON_AMOUNT == 0 ? '' : label ? `返<view class="diffColor">${this.province[arr[0].PROVINCE_CODE]}</view>地区<view class="diffColor">${obj.COUPON_AMOUNT}元</view>电费优惠券，` : `送您${this.province[arr[0].PROVINCE_CODE]}地区${obj.COUPON_AMOUNT}元优惠券，`,
          obj.WALLET_RANDOM.length == 0 ? '' : label ? `随机返<view class="diffColor">${obj.WALLET_RANDOM.length}笔</view>电费红包，` : `随机返${obj.WALLET_RANDOM.length}笔电费红包，`,
          obj.INTEGRAL_RANDOM.length == 0 ? '' : label ? `随机返<view class="diffColor">${obj.INTEGRAL_RANDOM.length}笔</view>积分，` : `随机返${obj.INTEGRAL_RANDOM.length}笔积分，`,
          obj.COUPON_RANDOM.length == 0 ? '' : label ? `送您<view class="diffColor">${obj.COUPON_RANDOM.length}张</view>${this.province[arr[0].PROVINCE_CODE]}地区电费优惠券，` : `送您${obj.COUPON_RANDOM.length}张${this.province[arr[0].PROVINCE_CODE]}地区优惠券，`,
        ]
        obj.rewardInfo = infoArr.reduce((str, item)=>{return str + item},'')
        obj.IS_RETURN_FLAG =  (obj.WALLET_AMOUNT || obj.INTEGRAL_AMOUNT || obj.COUPON_AMOUNT || obj.WALLET_RANDOM.length || obj.INTEGRAL_RANDOM.length || obj.COUPON_RANDOM.length) == 0 ? false : true
        return obj;
      },
      lfNodes(str){ //小程序立返轮播文字转换nodes节点列表
        if(this.taroEnv != 'h5'){
          let arr = str.split(/<[^>]+>|&[^>]+;/g)
          let nodes = [{
            name: 'div',
            attrs: {
              class: 'rich_div_class'
            },
            children: []
          }]
          for(let i = 0; i < arr.length; i++){
            if (i % 2 == 0) {//黑字
              nodes[0].children.push({
                type: 'text',
                text: arr[i]
              })
            } else {//红字
              nodes[0].children.push({
                name: 'span',
                attrs: { class: 'rich_span_class'},
                children: [{
                  type: 'text',
                  text: arr[i]
                }]
              })
            }

          }
          return nodes
        } else {
          return str
        }
      },
      // 弹框右按钮
      cancel() {
        this.showComponents = false;
      },
      goNativeEleList() {
        let that =this
        if(that.itemData.STOP_WATCH) {
          if(that.taroEnv == 'h5') {
            if(that.itemData.STOP_WATCH == 'B10070100') {
              dsUtils.bridge_toNativeEleList({
                'TYPE':'3', // 2022-03-28  由2改成3
                'PROVINCE_CODE':that.itemData.PROVINCE_CODE,
                'POWER_USER_ID':that.itemData.POWER_USER_ID,
                'SENSITIVE_POWER_USER_ID':that.itemData.SENSITIVE_POWER_USER_ID,
              })
            } else {
              dsUtils.bridge_setTempCache(that.itemData.SKIP_PARAMS)
              dsUtils.bridge_jumpToMenu({menuId: that.itemData.STOP_WATCH, url: that.itemData.SKIP_URL})
              // 若需传入参数 需用 dsUtils.bridge_setTempCache 方法写入缓存
              // dsUtils.bridge_setTempCache({ key: "xxx", value: that.itemData.SKIP_PARAMS});
            }
          } else {
            if(that.itemData.SKIP_URL) {
              dsUtils.navigateTo({
                url: `/packageDSEleCharge/pages/webView/webView?url=${that.itemData.SKIP_URL}`
              })
            }
          }
        }
      },
      goBack() {
        dsUtils.navigateBack(1)
      },

      goHome() {
        dsUtils.bridge_close()
      },
      changeArrow() {
        this.Arrow = this.Arrow == 'up' ? 'down' : 'up'
      },
      deductionRule(){
        dsUtils.navigateTo({
          url: '/packageDSEleCharge/pages/deductionRule/deductionRule'
        })
      },
      async related() { //初始化
        try {
          this.moneyInfo() // 金额块
          if (this.module_lf) { //如果开启立返模块
            this.itemData?.HD_RESULT?.acMsgResult?.forEach((acMsgResult)=> {
              this.itemData?.HD_RESULT?.lfResult?.forEach((lfResult)=> {
                if(acMsgResult.acId == lfResult.acId) {
                  this.lfResult.push(acMsgResult)
                }
              })
            })
          }
          if (this.module_integralAndRedpackage) { //如果开启积分红包模块
            this.showAssets = true // 视图
            await this.getAssets() // 接口请求查询资产
            if (this.module_coupon) { // 如果还开启了优惠券模块
              this.couponRelated() // 优惠券弹窗初始化
            }
            this.setInntegralPicker() // 积分弹窗初始化
          }
          this.moneyInfoIpt() //输入框
        } catch(err) {
          console.log(err,'[related方法]接口请求查询资产---失败')
          if (this.module_integralAndRedpackage){
            this.showAssets = true //视图
          }
          this.moneyInfoIpt() // 输入框
        }
      },
      couponRelated() { //优惠券总列表初始化 显示时间格式等
        if (this.couponRec.length == 0) {
          return
        }
        let couponList = []
        this.couponRec.forEach((item) => {
          let obj = {}
          for (let key in item) {
            obj[key] = item[key]
          }
          obj.checked = false
          obj.img = false
          obj.describe = ''
          obj.COUPON_AMOUNT = item.COUPON_AMOUNT / 100
          obj.FULL_REDUCTOINO = item.FULL_REDUCTOINO / 100
          // 2022.01.01
          obj.START_DATE = `${item.START_DATE.substring(0,4)}.${item.START_DATE.substring(4,6)}.${item.START_DATE.substring(6,8)}`
          obj.END_DATE = `${item.END_DATE.substring(0,4)}.${item.END_DATE.substring(4,6)}.${item.END_DATE.substring(6,8)}`
          // 2022/02/02 00: 00: 00
          obj.START__DATE = `${item.START_DATE.substring(0,4)}/${item.START_DATE.substring(4,6)}/${item.START_DATE.substring(6,8)} 00: 00: 00`
          obj.END__DATE = `${item.END_DATE.substring(0,4)}/${item.END_DATE.substring(4,6)}/${item.END_DATE.substring(6,8)} 23: 59: 59`
          couponList.push(obj)
        })
        this.couponList = couponList
      },
      couponListCanIUsed() { // 清除优惠券列表的选择方案,并显示 (请选择/暂无可用/n张可用)
        this.couponList.forEach((item) => {
          item.checked = false
          item.img = false
          item.describe = ''
        })
        this.couponUseRec_num = this.changeTap(true)
      },
      changeTap(type) { //切换-可用不可用优惠券
        this.coupon_type = type
        let couponUseRec = []
        let couponNoUseRec = []
        this.couponUseRec = [];
        this.couponList.map((item) => {
          if (
            (new Date(item.START__DATE).getTime() <= new Date().getTime() && new Date().getTime() <= new Date(item.END__DATE).getTime()) && //有效期内
            ((this.itemData && this.itemData.PROVINCE_CODE === item.PROVINCE_CODE) || item.PROVINCE_CODE === '00000') && //省份匹配
            (!item.USE_STRATEGY.consSortCode ||((this.itemData["HIGHANDLOW_FLAG"] && item.USE_STRATEGY.consSortCode) && ((item.USE_STRATEGY.consSortCode.split('|')).indexOf(this.itemData["HIGHANDLOW_FLAG"]) >= 0))) && //高低压匹配
            (!item.USE_STRATEGY.powerUserId ||((this.itemData["POWER_USER_ID"] && item.USE_STRATEGY.powerUserId) && (item.USE_STRATEGY.powerUserId == this.itemData["POWER_USER_ID"]))) && //单户券户号匹配
            (Number(this.currentMoney) >= Number(item.FULL_REDUCTOINO)) //满足门槛
          ) {
            couponUseRec.push(item)
          } else {
            couponNoUseRec.push(item)
            if (
              (new Date() < new Date(item.START__DATE)) && 
              ((this.itemData && this.itemData.PROVINCE_CODE === item.PROVINCE_CODE) || item.PROVINCE_CODE === '00000') && //省份匹配
              (!item.USE_STRATEGY.consSortCode ||((this.itemData["HIGHANDLOW_FLAG"] && item.USE_STRATEGY.consSortCode) && ((item.USE_STRATEGY.consSortCode.split('|')).indexOf(this.itemData["HIGHANDLOW_FLAG"]) >= 0))) && //高低压匹配
              (!item.USE_STRATEGY.powerUserId ||((this.itemData["POWER_USER_ID"] && item.USE_STRATEGY.powerUserId) && (item.USE_STRATEGY.powerUserId == this.itemData["POWER_USER_ID"]))) //单户券户号匹配
            ) {
              let date = JSON.parse(JSON.stringify(item.START_DATE))
              let arr = date.split('.')
              item.describe = `此券在${arr[0]}-${arr[1]}-${arr[2]} 00:00:00后可使用`
            } else {
              item.describe = '待交户号中无符合条件的户号'
            }
          }
        })
        if (this.coupon_type) {
          this.couponUseRec = this.couponSortFn(couponUseRec);
        } else {
          this.couponUseRec = this.couponSortFn(couponNoUseRec);
        }
        return this.couponUseRec.length
      },
      couponSortFn(arr) { //优惠券排序
        // 排序规则如下：
        // 1.日期小的排前面(END_DATE) "20220607" "20220609"
        // 2.金额大的排前面(COUPON_AMOUNT) "2" "1"
        // 3.省份编码大的排前面(PROVINCE_CODE) "11102" "00000"
        // 4.单张有字段的排前面(USE_STRATEGY.singleFlag==01), 多张无字段的排后面
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr.length - i - 1; j++) {
            let temp = arr[j + 1]
            if (arr[j].END_DATE > arr[j + 1].END_DATE) {
              arr[j + 1] = arr[j]
              arr[j] = temp
            } else if (arr[j].END_DATE == arr[j + 1].END_DATE && arr[j].COUPON_AMOUNT < arr[j + 1].COUPON_AMOUNT) {
              arr[j + 1] = arr[j]
              arr[j] = temp
            } else if (arr[j].END_DATE == arr[j + 1].END_DATE && arr[j].COUPON_AMOUNT == arr[j + 1].COUPON_AMOUNT &&
              arr[j].PROVINCE_CODE < arr[j + 1].PROVINCE_CODE) {
              arr[j + 1] = arr[j]
              arr[j] = temp
            } else if (arr[j].END_DATE == arr[j + 1].END_DATE && arr[j].COUPON_AMOUNT == arr[j + 1].COUPON_AMOUNT &&
              arr[j].PROVINCE_CODE == arr[j + 1].PROVINCE_CODE) {
              if (arr[j + 1].USE_STRATEGY && arr[j + 1].USE_STRATEGY.singleFlag && arr[j + 1].USE_STRATEGY.singleFlag ==
                '01') {
                arr[j + 1] = arr[j];
                arr[j] = temp;
              }
            }
          }
        }
        return arr;
      },
      handleClickCoupon(item, index, coupon_type) { //用户点击选择使用优惠券
        if (!coupon_type) {
          return
        }
        if (!item.checked) { // 未选中到选中
          if (!item.img) { //用户点击的券 右上角没有可叠加 (要么还没开始选, 要么违规操作) 需要复原为初始状态
            if (this.checkedCouponArr.length !== 0) {
              dsUtils.toast('为您取消不可同时使用的优惠券')
            }
            this.couponUseRec.forEach((it) => { //复原
              it.checked = false // 所有券的对勾
              it.describe = '此券暂不可和已勾选券叠加使用' //所有券的描述
              it.img = false // 多张券的img
            })
            this.checkedCouponArr = [] //复原
          }
          item.describe = '' // 当前券描述
          item.img = false //当前券右上角图片
          item.checked = true // 当前券选中
          this.checkedCouponArr.push(index)
          if (item.USE_STRATEGY && item.USE_STRATEGY.singleFlag && item.USE_STRATEGY.singleFlag ==
            '01') { // 当前券为单张券 不需要下面一行代码直接return
            return
          }
          this.couponFn(this.currentMoney, this.couponUseRec) //至少选择一张多张券的情况下, 对其余未勾选的多张券进行操作(右上角图片、文字描述)
        } else { // 选中到未选中
          if (this.checkedCouponArr.length == 1) { // 已选一张, 取消选择 ---复原为初始状态
            this.couponUseRec.forEach((it) => {
              it.checked = false // 所有券的对勾
              it.describe = '' //所有券的描述
              it.img = false // 多张券的img
            })
            this.checkedCouponArr = []
          } else { //已选2张及以上, 取消选择 ---对其余未勾选的多张券进行操作
            item.checked = false
            let indDel = this.checkedCouponArr.indexOf(index)
            this.checkedCouponArr.splice(indDel, 1)
            this.couponFn(this.currentMoney, this.couponUseRec)
          }
        }
      },
      couponFn(currentMoney, couponUseRec) { //至少选择一张多张券的情况下, 对其余未勾选的多张券进行操作(右上角图片、文字描述)
        function couponPlanFn(currentMoney, arr) { //计算当前优惠券是否可用
          arr.sort((a,b)=>{
            if(a.COUPON_AMOUNT< b.COUPON_AMOUNT){
                return 1
            } else {
              return -1
            }
          })
          let theResult = true
          let money = currentMoney
          for(let i = 0; i < arr.length; i++){
            if(money < arr[i].FULL_REDUCTOINO){
              theResult = false
              break
            }
            money = dsUtils.floatSub(money, arr[i].COUPON_AMOUNT)
            if(money < 0){
              theResult = false
              break
            }
          }
          return theResult
        }
        for (let k = 0; k < couponUseRec.length; k++) {
          if (couponUseRec[k].USE_STRATEGY && couponUseRec[k].USE_STRATEGY.singleFlag && couponUseRec[k].USE_STRATEGY
            .singleFlag ==
            '01') { //跳过单张券
            continue
          }
          if (currentMoney < couponUseRec[k].FULL_REDUCTOINO) { //跳过不满足门槛的多张券
            continue
          }
          if (!couponUseRec[k].checked) { // 对未勾选的多张券进行操作
            let arr = []
            couponUseRec.forEach((it) => {
              if (it.checked) {
                arr.push(it)
              }
            })
            arr.push(couponUseRec[k])
            let canIUse = couponPlanFn(currentMoney, arr)
            if (canIUse) {
              couponUseRec[k].img = true
              couponUseRec[k].describe = ''
            } else {
              couponUseRec[k].img = false
              couponUseRec[k].describe = '此券暂不可和已勾选券叠加使用'
            }
          }
        }
      },
      calcRecommendCoupon() { // 计算优惠券推荐金额
        // 优惠券推荐计算规则：
        // 1，使用推荐优惠显示
        // ①当选中优惠券使用金额小于推荐优惠金额时，显示使用推荐优惠按钮
        // 2，使用推荐优惠点击选中规则
        // ①选中可使用优惠券列表中组合金额最大组合优惠券勾选
        // ②多张满足时，按优惠券面额大的优先选中，金额一致时任意选中一张
        // ③按有效期到期优先使用，最近有效期的优先使用
        let singleCouponList = []
        let multipleCouponList = []
        for (let k = 0; k < this.couponUseRec.length; k++) { // 单多张分类
          if (this.couponUseRec[k].USE_STRATEGY && this.couponUseRec[k].USE_STRATEGY.singleFlag && this.couponUseRec[
              k].USE_STRATEGY.singleFlag == '01') { //单张券
            singleCouponList.push({
              item: this.couponUseRec[k],
              index: k, // this.couponUseRec的角标
            })
          } else { // 多张券
            multipleCouponList.push({
              item: this.couponUseRec[k],
              index: k, // this.couponUseRec的角标
            })
          }
        }

        function couponSortFn(theCouponList) { // 按优惠金额COUPON_AMOUNT(大→小)有效期(小→大)排序
          if (theCouponList.length <= 1) {
            return
          }
          theCouponList.sort((a, b) => {
            if (a.item.COUPON_AMOUNT < b.item.COUPON_AMOUNT) { //优惠金额大的在前面
              return 1
            } else if (a.item.COUPON_AMOUNT == b.item.COUPON_AMOUNT) { //金额一致 效期近的在前面
              if (a.item.END_DATE < b.item.END_DATE) {
                return -1
              } else {
                return 1
              }
            } else {
              return -1
            }
          })
        }

        function couponSumFn(arr) { //优惠金额求和(总共优惠金额)
          let sum = 0
          for (let i = 0; i < arr.length; i++) {
            sum = dsUtils.floatAdd(sum, arr[i].item.COUPON_AMOUNT)
          }
          return sum
        }

        // 计算单张=========================
        let singleMoney = 0 // 单张券最多优惠的钱
        let singleKey = [] // 对应k
        if (singleCouponList.length) { // 有一张及以上的单张券时
          couponSortFn(singleCouponList) // 排序
          singleMoney = singleCouponList[0].item.COUPON_AMOUNT
          singleKey.push(singleCouponList[0].index)
        }

        // 计算多张=========================
        let multipleMoney = 0 //多张券最多叠加优惠的钱
        let multipleKey = [] // 对应k
        if (multipleCouponList.length == 1) { // 只有一张多张券时
          multipleMoney = multipleCouponList[0].item.COUPON_AMOUNT
          multipleKey.push(multipleCouponList[0].index)
        }
        if (multipleCouponList.length > 1) { // 有两张及以上的多张券时
          couponSortFn(multipleCouponList) // 排序
          let multipleMoneyArr = []
          for (let j = 0; j < multipleCouponList.length; j++) {
            let arr = []
            arr.push(multipleCouponList[j])
            let theSum
            for (let i = 0; i < multipleCouponList.length; i++) {
              theSum = couponSumFn(arr)
              if (i <= j) { // 跳过自身及之前的
                continue
              }
              if (dsUtils.floatSub(this.currentMoney, theSum) < multipleCouponList[i].item.FULL_REDUCTOINO) { //跳过不满足门槛
                continue
              }
              if (dsUtils.floatSub(dsUtils.floatSub(this.currentMoney, theSum), multipleCouponList[i].item.COUPON_AMOUNT) < 0) { //跳过超额优惠
                continue
              }
              arr.push(multipleCouponList[i])
            }
            theSum = couponSumFn(arr)
            let theKey = []
            arr.forEach((it) => {
              theKey.push(it.index)
            })
            multipleMoneyArr.push({
              theSum: theSum,
              theKey: theKey
            })

          }
          multipleMoneyArr.sort((a, b) => { // 按最大优惠金额排序 大→小
            if (a.theSum < b.theSum) {
              return 1
            } else if (a.theSum == b.theSum) {
              return 0
            } else {
              return -1
            }
          })
          multipleMoney = multipleMoneyArr[0].theSum // ======多张券中最大优惠金额
          multipleKey = multipleMoneyArr[0].theKey // ======最大优惠金额对应的k
        }

        // 单多张比较=========================
        if (singleMoney >= multipleMoney) {
          this.recommendMoney = singleMoney
          this.recommendKey = singleKey
        } else {
          this.recommendMoney = multipleMoney
          this.recommendKey = multipleKey
        }
      },
      compareCouponPlan(theSum) { //比较传入的两种优惠券选择方案是否一致
        if(this.recommendMoney == 0) { //用户无券可用(无选择方案),无法比较
          return
        }
        if (theSum != this.recommendMoney) { //优惠总金额不一致
          return false
        }
        if (this.checkedCouponArr.length != this.recommendKey.length) { // 已选券数量不一致(用户可能少选了,或者选了多张面值小的忽略了面值大的)
          return false
        }
        let checkedCouponArr = JSON.parse(JSON.stringify(this.checkedCouponArr))
        let recommendKey = JSON.parse(JSON.stringify(this.recommendKey))
        checkedCouponArr.sort()
        recommendKey.sort()
        for(let ind = 0; ind < checkedCouponArr.length; ind++) {
          if(checkedCouponArr[ind] != recommendKey[ind]) {
            if (this.couponUseRec[checkedCouponArr[ind]].COUPON_AMOUNT == this.couponUseRec[recommendKey[ind]].COUPON_AMOUNT && this.couponUseRec[checkedCouponArr[ind]].END_DATE == this.couponUseRec[recommendKey[ind]].END_DATE){ //优惠额与效期相同, 根据UE[优惠券推荐计算规则], 两张可任选一, 视为相同
              continue
            } else {
              return false
            }
          }
        }
        return true
      },
      useRecommendCoupon() { //点击 使用推荐金额 按钮
        this.couponUseRec.forEach((it) => { //复原
          it.checked = false // 所有券的对勾
          it.describe = '此券暂不可和已勾选券叠加使用' //所有券的描述
          it.img = false // 多张券的img
        })
        this.recommendKey.forEach((k) => {
          this.couponUseRec[k].describe = '' // 在推荐方案中的券 描述
          this.couponUseRec[k].img = false // 在推荐方案中的券 右上角图片
          this.couponUseRec[k].checked = true // 在推荐方案中的券 选中
        })
        this.checkedCouponArr = JSON.parse(JSON.stringify(this.recommendKey)) // 根据推荐方案, 更改用户勾选的优惠券
      },
      showCouponClick() { // 打开优惠券选择弹窗
        if (Number(this.currentMoney) === 0) {
          return dsUtils.toast('请先输入交费金额')
        }
        this.couponListBeforeClose = JSON.parse(JSON.stringify(this.couponList)) //记录打开优惠券弹窗前的优惠券选择方案(checked状态)
        this.checkedCouponArrBeforeClose = JSON.parse(JSON.stringify(this.checkedCouponArr)) //记录打开优惠券弹窗前的优惠券选择方案(已选的角标)
        this.isShowCoupon = true
      },
      sureCoupon() { // 点击优惠券弹窗确认按钮
        this.couponSelectedMoney = this.couponSum
        if (this.module_recommendCoupon) { //如果用了[使用推荐优惠]功能
          this.recommendCouponTag = this.compareCouponPlan(this.couponSelectedMoney) === undefined ? false : this.compareCouponPlan(this.couponSelectedMoney) //是否显示[已使用推荐优惠]标签
        }
        this.isShowCoupon = false
        this.changeTap(true) // 切换栏还原
      },
      closeCoupon() { // 关掉优惠券弹窗
        this.isShowCoupon = false
        this.couponList = JSON.parse(JSON.stringify(this.couponListBeforeClose)) //还原打开优惠券弹窗前的优惠券选择方案(checked状态)
        this.checkedCouponArr = JSON.parse(JSON.stringify(this.checkedCouponArrBeforeClose)) //还原打开优惠券弹窗前的优惠券选择方案(已选的角标)
        this.changeTap(true) // 切换栏还原
      },
      getAssets() { //获取资产列表
        let __this = this
        return new Promise((resolve, reject)=>{
          dsUtils.request('osg-p0002/member/p3/f01', {
            params: {
              target: '',
              serviceCode: '',
              source: ''
            },
            success(response) {
              if (response && response.data) {
                let res = response.data
                // let res = JSON.parse(JSON.stringify(demoDataAssets)) //测试资产放开这一行 注释接口请求
                __this.isDefaultDeductio = res["IS_DEFAULT_DEDUCTIO"]
                __this.deductionRatio = res["DEDUCTION_RATIO"]
                __this.pickerValue.integralAble = res["INTEGRAL_ABLE"]
                __this.pickerValue.integralNum = res["INTEGRAL_NUM"]
                __this.pickerValue.deductionRatio = dsUtils.floatMultiply(res["DEDUCTION_RATIO"], 100) + '%'
                __this.redPackageAmount = res["REDPACKAGE_AMOUNT"]
                __this.couponRec = res["COUPON_REC"]
                resolve()
              } else {
                reject(response)
              }
            },fail(err){
              reject(err)
            }
          })
                
        })
      },
      moneyInfoIpt() { // 输入框初始化
        if (Number(this.itemData.IS_ADVICE_CHARGE_AMT)) { // 是否展示推荐充值金额
          this.payInputMoney = dsUtils.fenToYuan(this.itemData.ADVICE_CHARGE_AMT)
          this.currentMoney = dsUtils.fenToYuan(this.itemData.ADVICE_CHARGE_AMT)
          this.inputFocus = true
        }
      },
      moneyInfo() { //金额块初始化
        //设置推荐金额块
        let recommendArr = []
        this.itemData.RECOMMEND_AMOUNT_REC.forEach((item, index) => {
          recommendArr.push({
            value: (Number(item.AMOUNT) / 100).toString(), // 整数
            val: dsUtils.fenToYuan(item.AMOUNT), // 两位小数
            checked: Number(item.IS_PITCH) === 1 ? true : false,
            index: index
          })
        })
        this.checkedArr = recommendArr

        //隐藏金额块
        if (this.itemData && this.itemData.RECOMMEND_AMOUNT_REC.length == 0) {
          return this.showArr = false
        }
      },
      checkedBlock(obj) { // 点击选择金额块
        if (obj.checked) { //当前块可选
          this.checkedIndex = obj.index //金额块index
        }
      },
      bindMoneyInput(e) { // 金额输入框 实时校验输入的金额
        let payMoney
        if(this.taroEnv == 'h5'){ //h5
          payMoney = e
        } else { //支付宝微信
          payMoney = e.detail.value
        }
        this.payInputMoney = dsUtils.formatMoney(payMoney, false)
        this.currentMoney = dsUtils.formatMoney(payMoney)
        if(this.taroEnv == 'swan'){//百度小程序刷金额输入框dom
          this.BDInputRefresh = false
          Vue.nextTick(()=>{
            this.BDInputRefresh = true
          })
        }
      },
      moneyInputFocus() { // 金额输入框得到焦点
        this.inputFocus = true //高亮
        this.checkedIndex = null
      },
      moneyInputBlur(){// 金额输入框失去焦点
        if(this.payInputMoney.length && this.payInputMoney[this.payInputMoney.length-1] == '.'){
          this.payInputMoney = this.payInputMoney*1
        }
      },
      proportionTips() { // 抵扣比例提示横幅初始化
        // 积分加红包合计最大可抵 = (初始交费金额 - 优惠券优惠金额) * 抵扣比例
        // this.proportionTipsMoney = (this.currentMoney - this.couponSelectedMoney) * this.deductionRatio
        this.proportionTipsMoney = dsUtils.formatMoney(dsUtils.floatMultiply(dsUtils.floatSub(this.currentMoney, this.couponSelectedMoney), this.deductionRatio), true)
        if (this.deductionRatio && this.deductionRatio * 1 > 0 && this.deductionRatio * 1 < 1) { // 抵扣比例在0-1之间 
          let uRedPackage = dsUtils.fenToYuan(this.redPackageAmount*1) //用户拥有的红包金额
          let uIntegral = Math.floor(this.pickerValue.integralNum/200) //用户拥有的积分金额
          let ruleRIMoney = dsUtils.floatAdd(Math.min(200, uRedPackage), Math.min(100, uIntegral))
          if (this.proportionTipsMoney < ruleRIMoney){ //用户因抵扣比例的约束, 没能使用自己的红包积分进行全额抵扣, 需要显示横幅提示用户
            this.flagTips = this.currentMoney != 0 ? true : false
          } else {
            this.flagTips = false
          }
        } else { // 抵扣比例为1
          this.flagTips = false
        }
        // 用户是否更换了优惠券导致超额违规抵扣?
        return dsUtils.floatAdd(this.inputRedpackage, this.integralSelectedMoney) * 1 > this.proportionTipsMoney ? true : false
      },
      setInntegralPicker() { // 积分picker初始化
        let integralList = [] //
        let j
        // ①积分可用数量=((订单金额-优惠券金额)*抵扣比例-已使用红包金额)*200
        //picker中可选积分的最大值 不能超过 [用户拥有的总积分, 金额减红包后换算出的积分数, 积分最多可用20000] 这三个值
        let calculatedIntegralMoney = dsUtils.floatSub(this.proportionTipsMoney, this.inputRedpackage)
        let maxIntegralVal = Math.min(this.pickerValue.integralNum*1, calculatedIntegralMoney * 200, 20000)
        for (j = 1; j * 200 <= maxIntegralVal; j++) {
          integralList.unshift({
            dikou: dsUtils.formatMoney(j, true),
            jifen: j * 200
          })
        }
        integralList.forEach((it,ind)=>{
          if(it.dikou == this.integralSelectedMoney) {
            this.pickerValue.integralInd = ind
          }
        })
        this.pickerValue.integralList = integralList
      },
      openPicker() { // 打开积分picker
        this.setInntegralPicker()
        this.pickerIsShow = true
      },
      sure(ind) { //积分picker确认选择
        this.integralSelectedMoney = this.pickerValue.integralList[ind].dikou
        this.pickerValue.integralInd = Number(ind)
        this.pickerIsShow = false
      },
      close() { //关掉积分picker
        this.pickerIsShow = false
      },
      notUsed() { //点击积分弹窗的暂不使用
        this.pickerIsShow = false
        this.pickerValue.integralInd = 0
        this.integralSelectedMoney = ''
      },
      redpackageInputFocus(){ //红包输入框得到焦点
        if (Number(this.currentMoney) === 0) {
          dsUtils.toast('请先输入交费金额')
          if(this.taroEnv == 'h5'){ //h5
            document.querySelectorAll('.van-field__control')[1].blur()
          } else if (this.taroEnv == 'alipay') {
            my.hideKeyboard()
          } else if (this.taroEnv == 'weapp') {
            wx.hideKeyboard()
          }
        }
      },
      redpackageInputBlur(){ //红包输入框失去焦点
        if(this.inputRedpackage.length && this.inputRedpackage[this.inputRedpackage.length-1] == '.'){
          this.inputRedpackage = this.inputRedpackage*1
        }
      },
      bindRedPackageInput(e) { //红包输入框 实时校验输入的金额
        if (Number(this.currentMoney) === 0){ //无交费金额不能输入红包
          this.inputRedpackage = ''
        }
        let payMoney
        if(this.taroEnv == 'h5'){ //h5
          payMoney = e
        } else { //支付宝微信
          payMoney = e.detail.value
        }
        // 首先, 输入格式必须为金额格式
        this.inputRedpackage = dsUtils.formatMoney(payMoney, false)
        // 其次, 输入的金额的最大值 不能超过 [拥有的红包金额, 允许抵扣的金额-积分的钱, 红包最多可用200 ]这三个值
        let str = this.inputRedpackage.toString()
        if (str[str.length - 1] !== '.'){ // 如果最后一位不是小数点, 要校验值的大小 (最后一位是小数点, 说明用户正在输入 不校验值的大小)
          let maxRedpackageVal = Math.min(dsUtils.fenToYuan(this.redPackageAmount) * 1, dsUtils.floatSub(this.proportionTipsMoney * 1, this.integralSelectedMoney), 200)
          if (this.inputRedpackage * 1 > maxRedpackageVal) {
            this.inputRedpackage = maxRedpackageVal
          }
        }
      },
      calcMoney() { //计算实付金额 和 共抵扣 (红包积分) 和 立返档位判定
        // 实付金额 = 初始交费金额 - 红包 - 积分 -优惠券
        // this.actualMoney = (this.currentMoney - this.inputRedpackage - this.integralSelectedMoney)*this.deductionRatio - this.couponSelectedMoney
        this.actualMoney = dsUtils.floatSub(dsUtils.floatSub(dsUtils.floatSub(this.currentMoney, this.inputRedpackage), this.integralSelectedMoney), this.couponSelectedMoney)
        this.splitActualMoney = dsUtils.formatMoney(this.actualMoney, true).split('.') // 切割实付金额
        // 共抵扣 = 红包 + 积分 + 优惠券
        // this.deductionAmount  = this.inputRedpackage + this.integralSelectedMoney + this.couponSelectedMoney
        this.deductionAmount = dsUtils.formatMoney(dsUtils.floatAdd(dsUtils.floatAdd(this.inputRedpackage, this.integralSelectedMoney), this.couponSelectedMoney), true)
        // 立返档位判定
        if(this.module_lf) {
          this.gear()
        }
      },
      surePaymentPassword(arr) { //支付弹窗 里面的确认按钮
        this.payPassword = arr[0]
        this.phoneCode = arr[1]
        this.goPay()
        this.paymentPasswordNoSetIsShow = false
        this.paymentPasswordSimpleIsShow = false
      },
      useDefaultProportion() { //默认抵扣
        if (!this.module_integralAndRedpackage) { // 没开红包积分模块
          return
        }
        if (this.isDefaultDeductio == 0) { // 接口返参 //是否默认抵扣：0：不是 1：是
          return
        }
        if (this.currentMoney*1 == 0) { //无初始交费金额
          return
        }
        if (this.module_coupon) { // 已开启优惠券模块
          this.calcRecommendCoupon() //计算优惠券推荐金额
          this.useRecommendCoupon() // 使用优惠券推荐金额对应的优惠券选择方案
          Vue.nextTick(()=>{
            this.sureCoupon() // 确认使用此方案的优惠券
          })
        }

        Vue.nextTick(()=>{
          this.proportionTips() // 抵扣比例提示
          //=====方案1: 优先抵扣全部红包=====
          this.inputRedpackage = Math.min(this.proportionTipsMoney, 200, dsUtils.fenToYuan(this.redPackageAmount))
          this.setInntegralPicker()
          this.pickerValue.integralInd = 0
          this.sure(0)
          return
          //=====方案2: 优先抵扣最大金额=====
          // 红包默认抵扣金额最多不能超过 [本单红包积分最多可抵金额, 红包最多可用200元, 用户拥有的红包金额] 这三个值
          // 先找出这三个值的最小值theMinVal
          let theMinVal = Math.min( this.proportionTipsMoney, 200, dsUtils.fenToYuan(this.redPackageAmount))
          if (theMinVal == this.proportionTipsMoney) { // 最小值是"本单红包积分最多可抵金额", 说明用户只用红包做抵扣就够了, 无需使用积分
            this.inputRedpackage = theMinVal // 红包默认抵扣金额
          } else { //最小值是"红包最多可用200元"或者"用户拥有的红包金额", 说明用户把红包拉满, 还可继续使用积分做抵扣
            let remain = dsUtils.floatSub(this.proportionTipsMoney, theMinVal) // 红包拉满后, 剩余可抵金额remain = 本单红包积分最多可抵金额 - theMinVal
            // 积分默认抵扣金额最多不能超过 [剩余可抵金额remain, 积分最多可用100元, 用户拥有的积分金额 ] 这三个值
            // 先找出这三个值的最小值minVal
            let minVal = Math.min(remain, 100, Math.floor(this.pickerValue.integralNum/200))
            if((minVal == remain && Math.floor(remain) == remain) || minVal != remain){ // 最小值是"剩余可抵金额"并且它是整数, 或者最小值是其他两个, 说明红包拉满后, 使用当前minVal的值作为积分默认抵扣金额即可
              this.inputRedpackage = theMinVal // 红包默认抵扣金额
              this.setInntegralPicker() // 积分picker初始化
              this.pickerValue.integralInd = 0 // (选择器中第0项就是minVal 积分默认抵扣金额)
              this.sure(0) //积分picker确认选择
            } else { // 最小值是"剩余可抵金额"并且它不是整数, 说明红包抵扣不能拉满, 需要用红包抵去小数, 剩余的整数部分再用积分抵
              let xiaoShu =  dsUtils.floatSub(remain, Math.floor(remain)) // 小数
              let hongBaoFinal = dsUtils.floatSub(theMinVal,dsUtils.floatSub(1,xiaoShu)) // 使用红包抵小数, 那么红包默认抵扣金额hongBaoFinal = theMinVal - (1 - xiaoShu)元
              this.inputRedpackage = hongBaoFinal // 红包默认抵扣金额
              this.setInntegralPicker() // 积分picker初始化
              this.pickerValue.integralInd = 0 // (选择器中第0项就是minVal 积分默认抵扣金额)
              this.sure(0) //积分picker确认选择
            }
          }
        })
      },
      confirmPay() { //点击确认支付
        if (!this.isPay) {
          return;
        }
        if (Number(this.currentMoney) == 0) {
          return;
        }

        //--------https://payctl.95598pay.com/payunifycontroller/rest/payunify/unpwdpaymark
        if (this.deductionAmount * 1 > 0) { //如果使用了红包积分优惠券等道具, 需要调免密校验接口
          let __this = this
          dsUtils.request("osg-p0001/member/p1/f02", {
            params: {
              "WALLET_ACCDUC_AMOUNT": dsUtils.yuanToFen(__this.inputRedpackage), //红包(分)
              "INTEGRAL_AMOUNT": dsUtils.yuanToFen(__this.integralSelectedMoney), //积分(钱, 分)
              "PAY_AMOUNT": dsUtils.yuanToFen(__this.actualMoney), //实付金额(分)
              "PAY_WAY": "120001", //支付类型 余额+抵扣类支付
              "REDUCTION_AMT": "0", //立减
              "COUPON_AMT": dsUtils.yuanToFen(__this.couponSelectedMoney), //优惠券
              "ORDER_AMOUNT": dsUtils.yuanToFen(__this.currentMoney), //初始金额(分)
              "FINGER_PAY_CONFIG": "0", //是否设置了指纹支付
            },
            success: (response) => {
              if (response && response.data) {
                let res = response.data
                this.payMark = res.PAY_MARK
                this.payPwdLeve = res.PAY_PWD_LEVE
                if (res.PAY_MARK == 0) { // 情况一: 直接下单
                  this.goPay()
                  return
                } else if (res.PAY_MARK == 3) { //情况二: 弹出noSet组件
                  __this.paymentPasswordNoSetIsShow = true
                  return
                } else { // 情况三: 弹出Simple组件
                  __this.needCode = res.PAY_MARK == 1 ? false : true
                  __this.keyType = res.PAY_PWD_LEVE == 1 ? 'Number' : ''
                  __this.moneyFen = dsUtils.yuanToFen(__this.actualMoney) * 1
                  // if(res.PAY_MARK == 1 && __this.actualMoney*1 == 0){ // 防止后端返的PAY_MARK,在全额抵扣的情况下仍为1
                  //   __this.needCode = true
                  // }
                  __this.paymentPasswordSimpleIsShow = true
                }
              } else {
                dsUtils.toast('免密校验失败, 请稍候再试')
              }
            },
            fail(err) {
              dsUtils.toast('免密校验失败, 请稍候再试')
            }
          })
        } else {
          this.goPay()
        }
        
        dsUtils.dataCollection({
          "ACTTYPE": '0301',
          "SERVICEID": 'W202100040101',
          "PAGENAME": '交费小程序-输入金额页：点击“立即支付”',
          "CHANNEL": dsUtils.getUserInfo().channelCode,
        })
      },
      goPay() { //调支付接口
        let COUPON_LIST = []; //优惠券列表
        let SUB_COUPON_LIST = []; //优惠券明细
        if (this.couponSelectedMoney * 1 > 0) {
          this.couponUseRec.forEach((item) => {
            if (item.checked) {
              COUPON_LIST.push({
                "COUP_PROVINCE_CODE": item.PROVINCE_CODE, //优惠券省码
                "PRODUCT_CODE": item.PRODUCT_CODE, //优惠劵产品编码
                "COUPON_NUM": item.COUPON_NUM, //优惠券编号
                "COUPON_AMOUNT": dsUtils.yuanToFen(item.COUPON_AMOUNT).toString(), //优惠券金额
              })
              SUB_COUPON_LIST.push({
                "COUP_PROVINCE_CODE": item.PROVINCE_CODE, //优惠券省码
                "PRODUCT_CODE": item.PRODUCT_CODE, //优惠劵产品编码
                "SUB_COUPON_NUM": item.COUPON_NUM, //优惠券编号
                "SUB_COUPON_AMOUNT": dsUtils.yuanToFen(item.COUPON_AMOUNT).toString(), //优惠券金额
              })
            }
          })
        }

        let payObj = {
          "RISK_CHECK": "1qaz@WSX3edc$RFV", // 4.21
          "MSG_PSW": this.phoneCode,
          "WALLET_ACCDUC_AMOUNT": dsUtils.yuanToFen(this.inputRedpackage).toString(),
          "REDUCE_AMOUNT": "0",
          "INTEGRAL_AMOUNT": dsUtils.yuanToFen(this.integralSelectedMoney).toString(),
          "PAY_PWD_LEVE": this.payPwdLeve,
          "COUPON_AMOUNT": dsUtils.yuanToFen(this.couponSelectedMoney).toString(),
          "ACTIVITY_INFO": this.module_lf ? this.ACTIVITY_INFO : '',
          "INTEGRAL_NUM": (this.integralSelectedMoney * 200) + '',
          "POWER_LIST": [{
            "SUB_REDUCE_AMOUNT": "0",
            "IS_CONSNO_FLAG": "false",
            "SUB_PAY_AMOUNT": dsUtils.yuanToFen(this.actualMoney).toString(),
            "SUB_COUPON_LIST": SUB_COUPON_LIST,
            "SUB_INTEGRAL_AMOUNT": dsUtils.yuanToFen(this.integralSelectedMoney).toString(),
            "SUB_WALLET_ACCDUC_AMOUNT": dsUtils.yuanToFen(this.inputRedpackage).toString(),
            "SENSITIVE_POWER_USER_ID": this.itemData.SENSITIVE_POWER_USER_ID,
            "IS_RETURN_FLAG": this.IS_RETURN_FLAG,
            "IS_CRREDUCE_FLAG": this.itemData?.HD_RESULT?.crResult?.crFlag || false,
            "SUB_RETURN_LIST": this.module_lf ? this.SUB_RETURN_LIST : [],
            "PROVINCE_CODE": this.itemData.PROVINCE_CODE,
            "POWER_USER_ID": this.itemData.POWER_USER_ID,
            "SUB_ORDER_AMOUNT": dsUtils.yuanToFen(this.currentMoney).toString(),
          }],
          "ORDER_AMOUNT": dsUtils.yuanToFen(this.currentMoney).toString(),
          "PAY_MARK": this.payMark,
          "ACTIVITY_LIST": this.module_lf ? this.ACTIVITY_LIST : [],
          "PAY_PWD": this.payPassword,
          "PAY_AMOUNT": dsUtils.yuanToFen(this.actualMoney).toString(),
          "ORDER_SOURCE": "06",
          "MOBILE_PHONENO": "",
          "PAYABLE_DATE": "",
          "POWERUSER_TYPE": "",
          "COUPON_LIST": COUPON_LIST,
          "CONST_ID": "",
          "PAY_PWD_LV": this.payPwdLeve,
          "ORDER_TIME": new Date().valueOf() + '',
          "CHANNEL_SYSNO": "1000000002",
          "FACE_ID":this.optKey
        }


        dsUtils.request("osg-p0002/member/p2/f01", { //下单接口
          params: payObj,
          success: res => {
            if (res && res.data) {
              let response = res.data
              let STOP_WATCH = response.STOP_WATCH
              let ORDER_ID = response.ORDER_ID;
              let MERCHANT_NAME = response.MERCHANT_NAME;
              let sendPayMoney = dsUtils.yuanToFen(this.actualMoney).toString();
              let CANCEL_TIPS = response.CANCEL_TIPS; //是否使用资产 (退回红包优惠券等)
              let SALE_PAY_ID = response.SALE_PAY_ID;
              //判断全额抵扣
              if (payObj.PAY_AMOUNT * 1 === 0) { //dsUtils.yuanToFen(this.actualMoney).toString() //全额抵扣不需要支付, 直接跳结果页
                let resultData = {
                  ORDERSTATUS: '02', //订单状态 01：未完成  03：失败 04：处理中
                  SALE_PAY_ID: ORDER_ID, //订单id
                }
                dsUtils.setStorageSync('DS_resultData', resultData);
                dsUtils.navigateTo({
                  url: "/packageDSPay/pages/payresult/payresult"
                })
              } else {
                if ('FK_STATUS' in response && response.FK_STATUS !== '') {
                  if (response.FK_STATUS === 'RK002') { //人脸认证\
                      // if(dsUtils.bridge_WSGWBridge){//TODO：本逻辑需要APP原生发完商城，才能放开投入使用
                      //   var data={
                      //         "relaName":"",
                      //         "certNo":"",
                      //         "type":"2222",
                      //         "busiType":"02"
                      //   }
                      //   dsUtils.bridge_newFaceMatce4(data,res =>{
                      //     console.log('==============')
                      //     console.log(JSON.stringify(res))
                      //     if(res && res.code!=1){
                      //         dsUtils.toast(res.message)
                      //     }
                      //     if(res && res.code==1&& res.data.code!=1){
                      //         dsUtils.toast(res.data.message)
                      //     }
                      //   if(res && res.code==1&& res.data.code==1 && res.data.data.data.status!=1){
                      //         dsUtils.toast(res.data.data.data.message)
                      //     }
                      //     if(res && res.code==1&& res.data.code==1 && res.data.data.data.status==1){
                      //         this.optKey=res.data.data.data.optKey
                      //     }

                      //   })
                      // }else{
                        this.showComponents = true;
                        this.modalValue = {
                          modalTitle: '提示',
                          modalContent: [
                              {
                                content: `为了保障您的资金安全，请先前往【网上国网App-我的-账户与安全-实名认证】完成人脸认证后，再进行支付。`
                              }
                            ],//弹窗内容
                            modalBtn: ['确认'],
                            confirmColor: '#0C82F1',
                          }
                        // }

                  } else if (response.FK_STATUS === 'RK003') { //实名认证
                    if (dsUtils.bridge_WSGWBridge) {
                      dsUtils.bridge_jumpToMenu({menuId:'B40080100',url:''}) //实名
                    } else {
                      this.showComponents = true;
                      this.modalValue = {
                        modalTitle: '提示',
                        modalContent: [{
                          content: `为了保障您的资金安全，请先前往【网上国网App-我的-账户与安全-实名认证】完成实名认证后，再进行支付。`
                        }],//弹窗内容
                        modalBtn: ['确认'],
                        confirmColor: '#0C82F1',
                      }
                    }
                  }

                } else {
                  if (dsUtils.bridge_WSGWBridge()) {
                    response.PRE_ORDER_ID = ORDER_ID;
                    response.AMOUNT = sendPayMoney;
                    response.BUS_TYPE = 'A002';
                    response.STOP_WATCH = 'PAYU10000002';
                    dsUtils.bridge_tradePay(response, (res) => {
                      console.log('获取订单状态/订单id:',res)
                      dsUtils.bridge_init(initRes => {
                        console.log(initRes,'bridge_init返参',initRes.data.APP_VERSION.replace(/\./g, ""))
                        if(initRes && initRes.data && initRes.data.APP_VERSION && initRes.data.APP_VERSION.replace(/\./g, "") <= '227') {
                          if(res?.data?.CANCEL_PAY_FLAG != '1') {
                            let resultData2 = {
                              ORDERSTATUS: res?.data?.ORDERSTATUS, //订单状态 01：未完成  03：失败 04：处理中
                              SALE_PAY_ID: res?.data?.MERORDERID, //支付接口的订单id
                            }
                            dsUtils.setStorageSync('DS_resultData', resultData2);
                            dsUtils.navigateTo({
                              url: '/packageDSPay/pages/payresult/payresult'
                            })
                          }
                          return
                        }
                      });

                      if(res?.data?.CANCEL_PAY_FLAG != undefined && res.data.CANCEL_PAY_FLAG != '1' ){
                        let resultData2 = {
                          ORDERSTATUS: res?.data?.ORDERSTATUS, //订单状态 01：未完成  03：失败 04：处理中
                          SALE_PAY_ID: res?.data?.MERORDERID, //支付接口的订单id
                        }
                        dsUtils.setStorageSync('DS_resultData', resultData2);
                        if (res?.data?.REALY_PAY_WAY == '2') { // 跳企业支付结果页
                          dsUtils.navigateTo({
                            url: '/packageDSPay/pages/payresultEnterprise/payresultEnterprise'
                          })
                        } else { // 跳个人支付结果页
                          dsUtils.navigateTo({
                            url: '/packageDSPay/pages/payresult/payresult'
                          })
                        }
                      }
                    })
                  } else {
                    dsUtils.navigateTo({
                      //MERCHANT_NAME 商户名称 / ORDER_ID订单号 / sendPayMoney实付金额 / CANCEL_TIPS 弹框内容 / cancelTips 业务类型 电费:B10070100 / STOP_WATCH 场景业务类型	服务记录：B90000001 / SALE_PAY_ID 主流水号
                      url: '/packageDSPay/pages/confirmpay/confirmpay' +
                        `?MERCHANT_NAME=${MERCHANT_NAME}&ORDER_ID=${ORDER_ID}&sendPayMoney=${sendPayMoney}&CANCEL_TIPS=${CANCEL_TIPS}&STOP_WATCH=${STOP_WATCH}&SALE_PAY_ID=${SALE_PAY_ID}`
                    })
                  }
                }
              }
            } else {
              dsUtils.toast('下单失败, 请稍候再试')
            }
          },
          fail(err){
            dsUtils.toast('下单失败, 请稍候再试')
          }
        })
      }
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
<style scoped>

</style>
