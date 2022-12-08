import Taro from '@tarojs/taro'
import { toast } from './interactive'
/**
* 时间戳格式化
* @params datetime 时间戳
* @params type 格式化后拼接格式 type="normal"时 为常用格式，不为"normal"时 为自定义模式
*/
const formatDate = (datetime, type) => {
  if (/^(-)?\d{1,10}$/.test(datetime)) {
    v = v * 1000;
  } else if (/^(-)?\d{1,13}$/.test(datetime)) {
    v = v * 1;
  }
  var dateObj = new Date(datetime);
  var month = dateObj.getMonth() + 1;
  var day = dateObj.getDate();
  var hours = dateObj.getHours();
  var minutes = dateObj.getMinutes();
  var seconds = dateObj.getSeconds();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var UnixTimeToDate = '';
  if (type == "normal") {
    UnixTimeToDate = dateObj.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
  } else {
    UnixTimeToDate = dateObj.getFullYear() + type + month + type + day + type + hours + type + minutes + type + seconds;
  }
  return UnixTimeToDate;
}
/**
* 时间日期格式化
* @params theDate 时间
* @params val 返回时间格式 1.为xxxx年xx月xx日; 2为xxxx/xx/xx xx:xx:xx; 3为xxxx-xx-xx xx:xx:xx 4.xxxx年xx月xx日 xx:xx:xx 5.xxxx-xx-xx xx:xx(时:分)
*/
const formatTime = (theDate, val = 1) => {
  theDate = new Date(theDate)
  const year = theDate.getFullYear()
  const month = theDate.getMonth() + 1
  const day = theDate.getDate()
  const hour = theDate.getHours()
  const minute = theDate.getMinutes()
  const second = theDate.getSeconds()
  if (val === 1) {
    return `${year}年${month}月${day}日`
  } else if (val === 2) {
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  } else if (val === 3) {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  } else if (val === 4) {
    return `${year}年${month}月${day}日` + ' ' + [hour, minute, second].map(formatNumber).join(':')
  } else if (val === 5) {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const log = (data, double) => {
  let arr = ['red', 'green', 'blue', 'orange', 'brown']
  if (double) {
    console.log('%c' + JSON.stringify(data), "color:green")
  } else {
    console.log(data)
  }

}
// 创建localstorage缓存

function getStorageSync(key) {
  return Taro.getStorageSync(key)
}

function setStorageSync(key, value) {
  Taro.setStorageSync(key, value)
}


const setStorage = (name, value) => {
  let pattern = /^DS_/
  if (pattern.test(name)) {
    Taro.setStorage({
      key: name,
      data: value
    })
  } else {
    toast('缓存命名请以DS_开头', 'none')
  }
}
// 获取localstorage缓存
const getStorage = (name, outSuccess, outfail) => {
  Taro.getStorage({
    key: name,
    success: function (res) {
      outSuccess(res)
    },
    fail: function (res) {
      outfail(res)
    },
  })

}
// 移除localstorage缓存
const removeStorage = (name) => {
  let pattern = /^DS_/
  if (pattern.test(name)) {
    Taro.removeStorage({ key: name })
  } else {
    toast('仅可以清除以DS_开头的缓存', 'none')
  }
}

//同步删除操作，直接传key名
const removeStorageSync = (name) => {
  let pattern = /^DS_/
  if (pattern.test(name)) {
    Taro.removeStorageSync(name)
  } else {
    toast('仅可以清除以DS_开头的缓存', 'none')
  }
}


/**
 * 删除依据DS开头的所有缓存
 */

const removeAllDSStorageSync = () => {
  Taro.getStorageInfoSync().keys.map((item) => {
    let pattern = /^DS_/
    if (pattern.test(item)) {
      removeStorageSync(item)
    }
  })
}


const navigateTo = (params) => {
    initAppNativeJs().then(()=>{
      navigateToImpl(params)
    })
}

/**
 * 程序内页面间跳转方法（不关闭原页面）
 * @params url 跳转目标页面的地址
 * @params flag 跳转方式标识 ：
 *         navigateTo == 程序内页面间跳转方法（不关闭原页面）
 *         redirectTo == 程序内页面间跳转方法（关闭原页面）
 *         switchTab == 跳转到tabBar页面（在app.json中注册过的tabBar页面），同时关闭其他非tabBar页面
 *         reLanch == 关闭所有页面，打开到应用内的某个页面
 */
const navigateToImpl = (params) => {
  switch (params.flag) {
    case "navigateTo":
      Taro.navigateTo({
        url: params.url
      })
      break;
    case "redirectTo":
      Taro.redirectTo({
        url: params.url
      })
      break;
    case "switchTab":
      Taro.switchTab({
        url: params.url
      })
      break;
    case "reLaunch":
      Taro.reLaunch({
        url: params.url
      })
      break;
    default:
      Taro.navigateTo({
        url: params.url
      })
  }
}
/**
 * 【注意：】新写项目该方法弃用，用navigateBackByPath代替
 * 程序内返回跳转之前的页面
 * @params num 返回之前的第几个页面
 */
const navigateBack = (pageNumber, Pagepath) => {
  if (process.env.TARO_ENV == 'h5' && (typeof uexCore) != 'undefined' && navigator.userAgent.indexOf("iPhone") > -1) {
    return navigateTo({
      url: Pagepath,
      flag: 'redirectTo'
    })
  }
  Taro.navigateBack({
    delta: pageNumber
  })
}

/**
 * 通过页面路径跳转
 * @param {*} pagePath  页面全路径与app.config一直
 * @returns 
 */
const navigateBackByPath = (pagePath) => {
  if (process.env.TARO_ENV == 'h5' && (typeof uexCore) != 'undefined' && navigator.userAgent.indexOf("iPhone") > -1) {
    return navigateTo({
      url: pagePath,
      flag: 'redirectTo'
    })
  }

  //根据页面路径查询index，计算需要向前返回的页面，
  var pageNumber = 0
  let pageArr = Taro.getCurrentPages()
  if (pageArr) {
    pageArr.forEach((item, index) => {
      if (item?.path?.indexOf(pagePath) > -1) {
        pageNumber = pageArr.length - 1 - index;
      }
    })
    Taro.navigateBack({
      delta: pageNumber
    })
  }

}


/**
 * 倒计时&定时器方法 方法一
 * @params time 传入定时器内的后台给的时间戳
 * @params func 传入定时器内的定制函数
 * @params flag 根据此参数判定是否把天数转换成小时数合并入hour中,默认false，传入true则会转
 */
const countdown = (time, func, flag) => {
  let nowtime, endtime, lefttime, leftd, lefth, leftm, lefts, timer, endFlag = false;
  timer = setInterval(function () {
    nowtime = new Date();  //获取当前时间
    endtime = time;  //定义结束时间
    lefttime = endtime - nowtime.getTime();  //距离结束时间的毫秒数
    if (flag) {
      leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)) >= 10 ? Math.floor(lefttime / (1000 * 60 * 60 * 24)) : "0" + Math.floor(lefttime / (1000 * 60 * 60 * 24)) >= 10;  //计算天数
      lefth = Math.floor(lefttime / (1000 * 60 * 60) % 24) >= 10 ? Math.floor(lefttime / (1000 * 60 * 60) % 24) : "0" + Math.floor(lefttime / (1000 * 60 * 60) % 24);  //计算小时数
    } else {
      leftd = "00";  //计算天数
      lefth = Math.floor(lefttime / (1000 * 60 * 60)) >= 10 ? Math.floor(lefttime / (1000 * 60 * 60)) : "0" + Math.floor(lefttime / (1000 * 60 * 60));  //计算小时数
    }
    leftm = Math.floor(lefttime / (1000 * 60) % 60) >= 10 ? Math.floor(lefttime / (1000 * 60) % 60) : "0" + Math.floor(lefttime / (1000 * 60) % 60);  //计算分钟数
    lefts = Math.floor(lefttime / 1000 % 60) >= 10 ? Math.floor(lefttime / 1000 % 60) : "0" + Math.floor(lefttime / 1000 % 60);  //计算秒数
    if (lefttime <= 0) {
      endFlag = true;//倒计时停止标识
      clearInterval(timer);
      return false;
    }
    func([leftd, lefth, leftm, lefts, endFlag]);
  }, 1000);
}
/**
 * 倒计时&定时器方法 方法二
 * @params time 传入定时器内的秒数
 * @params func 传入定时器内的定制函数
 * @params flag 根据此参数判定是否把天数转换成小时数合并入hour中,默认false，传入true则会转
 */
const countdown1 = (times, func, flag) => {
  var timer = null;
  timer = setInterval(function () {
    var day = 0,
      hour = 0,
      minute = 0,
      second = 0;//时间默认值
    var endFlag = false;//倒计时停止标识
    if (times > 0) {
      if (flag) {
        day = Math.floor(times / (60 * 60 * 24));
        hour = Math.floor(times / (60 * 60)) - (day * 24);
      } else {
        day = "0";
        hour = Math.floor(times / (60 * 60));
      }
      minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
      second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    }
    if (day <= 9) day = '0' + day;
    if (hour <= 9) hour = '0' + hour;
    if (minute <= 9) minute = '0' + minute;
    if (second <= 9) second = '0' + second;
    times--;
    if (times <= 0) {
      endFlag = true;//倒计时停止标识
      clearInterval(timer);
    }
    func([day, hour, minute, second, endFlag]);
  }, 1000);
}

/**
 * 下单页面用户信息部分金额字段分转元
 * @params number 下单页面用户信息部分金额字段分转元
 */
const fenToYuan = (number) => {
  return (Number(floatDivide(number, 100)).toFixed(2)).toString();
}

/**
  * 下单页面用户信息部分金额字段元转分
  * @params number 下单页面用户信息部分金额字段元转分
  */
const yuanToFen = (value) => {
  return floatMultiply(Number(value.toString().replace(/[^\d.]/g, "")), 100).toString();
}
var toNonExponential = (num) => {
  if (num == null) {
    return num;
  }
  if (typeof num == "number") {
    var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
  } else {
    return num;
  }
}

/**
* 乘法 - js运算精度丢失问题
* @param arg1  数1
* @param arg2  数2
* 0.0023 * 100 ==> 0.22999999999999998
* {{ 0.0023 | multiply(100) }} ==> 0.23
*/
function floatMultiply(arg1, arg2) {
  arg1 = Number(arg1);
  arg2 = Number(arg2);
  if ((!arg1 && arg1 !== 0) || (!arg2 && arg2 !== 0)) {
    return null;
  }
  arg1 = toNonExponential(arg1);
  arg2 = toNonExponential(arg2);
  var n1, n2;
  var r1, r2; // 小数位数
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  n1 = Number(arg1.toString().replace(".", ""));
  n2 = Number(arg2.toString().replace(".", ""));
  return n1 * n2 / Math.pow(10, r1 + r2);
}

/**
* 除法 - js运算精度丢失问题
* @param arg1  数1
* @param arg2  数2
* 0.0023 / 0.00001 ==> 229.99999999999997
* {{ 0.0023 | divide(0.00001) }} ==> 230
*/
function floatDivide(arg1, arg2) {
  arg1 = Number(arg1);
  arg2 = Number(arg2);
  if (!arg2) {
    return null;
  }
  if (!arg1 && arg1 !== 0) {
    return null;
  } else if (arg1 === 0) {
    return 0;
  }
  arg1 = toNonExponential(arg1);
  arg2 = toNonExponential(arg2);
  var n1, n2;
  var r1, r2; // 小数位数
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  n1 = Number(arg1.toString().replace(".", ""));
  n2 = Number(arg2.toString().replace(".", ""));
  return floatMultiply((n1 / n2), Math.pow(10, r2 - r1));
  // return (n1 / n2) * Math.pow(10, r2 - r1);   // 直接乘法还是会出现精度问题
}

/**
* 加法 - js运算精度丢失问题
* @param arg1  数1
* @param arg2  数2
* 0.0023 + 0.00000000000001 ==> 0.0023000000000099998
* {{ 0.0023 | plus(0.00000000000001) }} ==> 0.00230000000001
*/
function floatAdd(arg1, arg2) {
  arg1 = Number(arg1) || 0;
  arg2 = Number(arg2) || 0;
  arg1 = toNonExponential(arg1);
  arg2 = toNonExponential(arg2);
  var r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (floatMultiply(arg1, m) + floatMultiply(arg2, m)) / m;
}

/**
* 减法 - js运算精度丢失问题
* @param arg1  数1
* @param arg2  数2
* 0.0023 - 0.00000011  ==>  0.0022998899999999997
* {{ 0.0023 | minus( 0.00000011 ) }}  ==>  0.00229989
*/
function floatSub(arg1, arg2) {
  arg1 = Number(arg1) || 0;
  arg2 = Number(arg2) || 0;
  arg1 = toNonExponential(arg1);
  arg2 = toNonExponential(arg2);
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  // 动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((floatMultiply(arg1, m) - floatMultiply(arg2, m)) / m).toFixed(n);
}

/**
 * 金额格式化
 * @params payMoney (string) 金额
 * @params bool （true/false）是否格式化 00.00 类型的格式，可不传，不格式化
 */
const formatMoney = (payMoney, bool) => {
  //判断金额是否为空
  if (payMoney === '' || payMoney === '.') {
    return '';
  }
  //判断金额大于最大值
  if (payMoney * 1 > 10000000) {
    return '10000000';
  }
  payMoney = payMoney.toString().replace(/[^\d.]/g, "")
  //正则校验输入金额
  if (payMoney.length > 2) {
    if (payMoney.substr(0, 2) != "0.") {
      if (payMoney.substr(0, 1) == '0' && payMoney.length == 2) {
        payMoney = payMoney.substr(1, payMoney.length)
      }
    }
    var array = payMoney.split(".");
    array[0] = (Number(array[0])).toString();
    if ((array.length >= 1 && array[1] && array[1].length >= 2) || array.length > 2) {
      let value = array[0] * 1 + "." + array[1].substr(0, 2);
      payMoney = value;
    } else if (array[0].length >= 1 && array[1] && array[1].length >= 1) {
      let value = array[0] * 1 + "." + array[1].substr(0, 2);
      payMoney = value;
    }
  }
  //需要带00.00格式
  if (bool) {
    let value = payMoney.toString().split('.');
    value[0] = (Number(value[0])).toString();
    // 判断当前金额是否带小数点（切割后长度为2）
    if (value.length === 1) {
      payMoney = value[0] + '.00'
    } else {
      if (value[0].length >= 1 && value[1].length < 2) {
        payMoney = value[0] + '.' + value[1] + '0'
      } else if (value[0].length >= 1 && value[1].length === 2) {
      } else {
        payMoney = value[0] + '.00'
      }
    }
  } else {
    var array = payMoney.toString().split(".");
    if (array.length === 1) {
      payMoney = (Number(array[0])).toString();
    }
  }
  return payMoney
}

// 防抖:多次触发事件后，事件处理函数只执行一次，并且是在触发操作结束时执行。
var timer;
const debounce = (fn, interval) => {
  var gapTime = interval || 200;//间隔时间，如果interval不传，则默认200ms
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}
// 节流:触发函数事件后，短时间间隔内无法连续调用，只有上一次函数执行后，过了规定的时间间隔，才能进行下一次的函数调用。
let lastTime = 0;
const throttle = (fn) => {
  // 上一次执行的时间
  return function (...args) {
    // 当前时间 单位毫秒
    let now = +new Date()
    // 将当前时间和上一次执行时间对比
    // 如果大于设置的await就执行函数
    if ((now - lastTime) > 1000) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}
// 手机号验证
const checkPhone = (phone) => {
  if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
    toast("手机号码不合法，请重新输入");
    return false;
  } else {
    return true
  }
}

const getElementNode=(id) =>{
  const promise = new Promise((resolve) => {
    Taro.nextTick(() => {
      console.log(process.env.TARO_ENV)
      let query;
      if(process.env.TARO_ENV == 'h5'){
        query = Taro.createSelectorQuery().in(this)
      }else {
        query = Taro.createSelectorQuery()
      }
      query.select(id).boundingClientRect()
      query.selectViewport()
      query.exec((res) => {
        resolve(res)
      })
    })
  })
  return promise
}

/**
 * 轮询uexCore和wsgwBridge对象，保证使用对象方法前能拿到改对象
 * @returns 
 */
const initAppNativeJs = () =>{
  return new Promise((resolve) =>{
    if (process.env.TARO_ENV != 'h5' || !(navigator.userAgent.indexOf("iPhone") > -1 || navigator.userAgent.indexOf("Android") > -1)){
      resolve()
      return
    }
    let timer = setInterval(() => {
      if ((typeof uexCore)!='undefined' || (typeof WSGWBridge)!='undefined'){
        clearInterval(timer)
        resolve()
      }
    }, 20);
    setTimeout(() => {
      clearInterval(timer)
    }, 3000);
  })
}

//  ****在这里添加的方法，必须去dsUtils.js里导入并导出，才可以使用。****
export {
  formatDate,
  formatTime,
  formatNumber,
  log,
  setStorage,
  getStorage,
  removeStorage,
  removeStorageSync,
  removeAllDSStorageSync,
  getStorageSync,
  setStorageSync,
  navigateTo,
  navigateBack,
  navigateBackByPath,
  countdown,
  countdown1,
  fenToYuan,
  yuanToFen,
  formatMoney,
  floatDivide,
  floatMultiply,
  floatAdd,
  floatSub,
  debounce,
  throttle,
  checkPhone,
  getElementNode,
  initAppNativeJs
}
