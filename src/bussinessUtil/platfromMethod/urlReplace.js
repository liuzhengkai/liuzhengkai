const urlData = {
    /********************************************支付中心接口*************************************************************/
    "osg-p0002/member/c9/f04": "/osg-open-p0001/member/c5/f18", // 取消订单支付全渠道调用
    "osg-p0002/member/p1/f01": "/osg-open-p0001/member/c5/f05", // 新版电费业务--多户欠费查询3.0（已聚合）
    "osg-p0002/member/c10/f05": "/osg-open-p0001/member/c5/f21", // 添加户号页面户号列表
    "osg-p0002/member/p3/f01": "/osg-open-p0001/member/c5/f22", // 新版电费业务--查询用户资产3.0
    "osg-p0002/member/p2/f01": "/osg-open-p0001/member/c5/f23", // 新版电费业务--下单3.0
    "osg-p0016/member/c2/f01": "/osg-open-p0001/member/c11/f01", // 支付成功页查询(电费公益之后从p0002中迁出)（与1.1.3重复）
    "osg-p0002/member/c9/f03": "/osg-open-p0001/member/c13/f01", // 删除未绑定的户号
    "osg-p0001/member/p1/f10": "/osg-open-p0001/member/c16/f01", //获取拉起支付宝支付参数接口
    "osg-p0001/member/p1/f13": "/osg-open-p0001/member/c16/f02",//获取支付宝支付结果接口 
    "osg-p0001/member/p1/f09": "/osg-open-p0001/member/c4/f06", // 获取拉起微信支付的参数的接口
    "osg-p0001/member/p1/f03": "/osg-open-p0001/member/c16/f03",//发送短信接口（设置或者修改密码功能用）
    "osg-p0001/member/p1/f02": "/osg-open-p0001/member/c16/f04",// 电费抵扣免密校验
    "osg-p0001/member/p2/f01": "/osg-open-p0001/member/c16/f05",// 查询支付列表渠道标签
    "osg-p0001/member/p1/f26": "/osg-open-p0001/member/c16/f06", // 支付结果查询
    "osg-p0014/acAssistance/c1/f02": "/osg-open-p0001/member/c13/f02", // 查询助力记录
    "osg-p0014/acAssistance/c1/f03": "/osg-open-p0001/member/c13/f03", // 助力接口
    "osg-p0014/acAssistance/c1/f05": "/osg-open-p0001/member/c13/f04", // 查询有效活动省份
    /********************************************账单中心接口*************************************************************/
    "osg-bc0001/member/c31/f01": "/osg-open-bc0001/member/arg/010070001", // 查询电子账单电量和电费
    /********************************************用户中心接口*************************************************************/
    "osg-uc0004/member/c2/f02": "/osg-open-uc0001/member/c11/f01", // 展示用户办理过业务记录
    /********************************************订单中心接口*************************************************************/
    "osg-oc0002/member/c1/f02": "/osg-open-oc0001/member/c07/f06", // 电费交费/业务费交费详情接口
    "osg-oc0002/member/c1/f10": "/osg-open-oc0001/member/c07/f13", // 电费取消订单
    "osg-oc0002/member/c1/f11": "/osg-open-oc0001/member/c07/f12", // 继续支付预查询
    /********************************************能力开放平台*************************************************************/
    "/osg-open-om0001/member/c72/f04": "/osg-open-om0001/member/c72/f04", // 地区搜索
    "osg-open-uc0001/member/arg/010360004": "/osg-open-uc0001/member/arg/010360004", // 查询户号绑定列表
}

export default urlData;