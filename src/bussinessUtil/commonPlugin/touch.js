var startX
var startY

const _angle = (start, end) => {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    }
 const _touchstart = (e, items) => {
    //开始触摸时 重置所有删除
    items.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    if (process.env.TARO_ENV == 'jd') {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    } else {
      startX = e.changedTouches[0].clientX
      startY = e.changedTouches[0].clientY
    }

    
    return items
  }
 
  const _touchmove = (e, items) => {
      var index = e.currentTarget.dataset.index //当前索引
      if (process.env.TARO_ENV == 'jd') {
        var touchMoveX = e.touches[0].clientX //滑动变化坐标
        var touchMoveY = e.touches[0].clientY //滑动变化坐标
      } else {
        var touchMoveX = e.changedTouches[0].clientX //滑动变化坐标
        var touchMoveY = e.changedTouches[0].clientY //滑动变化坐标
      }
      //获取滑动角度
      var angle = _angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
      });
      items.forEach(function (v, i) {
        v.isTouchMove = false
      })
      if (Math.abs(angle) > 45) {
        return false
      } else {
        return {touchMoveX, startX};
      }
  }
 
 
export {
    _touchstart,
    _touchmove
  }