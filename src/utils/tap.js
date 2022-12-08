/**
 * 点击指令，使用：
 * tapFn 点击后执行的方法
 * <button v-tap="tapFn">点击</button>
 */
import { dsUtils } from '../bussinessUtil/dsUtils.js';
const tap = {
  bind: function (el, binding, vNode) {
    el.addEventListener('tap', ()=>{
      dsUtils.eventIntercept(function() {
        binding.value()
      })
    })
  }
}
 
export default tap