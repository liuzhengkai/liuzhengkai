import Taro from '@tarojs/taro'
// toast提示
const toast = (title, icon, duration) => {
  if(!title) return;
  Taro.showToast({
    title: title,
    icon: icon ? icon : 'none',
    duration: title.length < 40  ? 2200 : title.length * 57,
    mask: true
  })
}
// showModal模态弹窗
const showModal = (params) => {
  console.log(params,'showModal_params')
  Taro.showModal({
    title: params.title ? params.title : '提示',
    content: params.content ? params.content : '这是一个模态弹窗',
    cancelColor: params.cancelColor ? params.cancelColor : '#7B7B7B',
    confirmColor: params.confirmColor ? params.confirmColor :'#43A2FA',
    cancelText:params.cancelText ? params.cancelText:'取消',
    confirmText:params.confirmText? params.confirmText:'确定',
    success: params.success,
    fail:params.fail
  })
}
// 显示加载
const showLoading = () => {
  Taro.showLoading({
    title: '加载中',
    mask: true
  })
}
//扩展方法支撑上层封装使用
const showLoadingUtil = () => {
  showLoading()
}

// 隐藏加载
const hideLoading = () => {
  Taro.hideLoading()
}

//扩展方法支撑上层封装使用
const hideLoadingUtil = () => {
  hideLoading()
}
// 显示下拉弹窗
const showActionSheet = (list, sucess, fail) => {
  Taro.showActionSheet({
    itemList:list?list:[],
    success: sucess,
    fail: fail
  })
}
//  ****在这里添加的方法，必须去dsUtils.js里导入并导出，才可以使用。****
export {
  toast,
  showModal,
  showLoading,
  hideLoading,
  showActionSheet,
  showLoadingUtil,
  hideLoadingUtil
}