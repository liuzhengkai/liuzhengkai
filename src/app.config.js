

//process.env.TARO_ENV 包括： weapp / swan / alipay / h5 / rn / tt / qq / quickapp
var config = {
    "pages": [
        "pages/index/index",
        "pages/demo/demo",
        "pages/authen/authen",
        "pages/areaPage/areaPage",
        "pages/unbind/unbind",
        "pages/editPhone/editPhone",
        "pages/quickLogin/quickLogin",
        "pages/docInfo/docInfo",
    ],
    "subPackages": [
        {
            "root": "packageDSPay",
            "pages": [
                "pages/confirmpay/confirmpay",
                "pages/payresult/payresult",
                "pages/payresultEnterprise/payresultEnterprise",
            ]
        },
        {
            "root": "packageDSEleCharge",
            "pages": [
                "pages/eleList/eleList",
                "pages/addElePowerNum/addElePowerNum",
                "pages/payElectricityCharges/payElectricityCharges",
                "pages/webView/webView",
                "pages/deductionRule/deductionRule",
            ]
        },
        {
            "root": "packageDSBill",
            "pages": [
                "pages/billList/billList",
            ]
        },
        {
            "root": "packageDSCoupon",
            "pages": [
                "pages/helpWithCoupon/helpWithCoupon",
                "pages/helpWithCouponGuidance/helpWithCouponGuidance",
                "pages/helpWithCouponRules/helpWithCouponRules",
            ]
        },
        {
            "root": "packageDSRecord",
            "pages": [
                "pages/index/index",
                "pages/detail/detail"
            ]
        }
    ],
    "window": {
        "navigationStyle": 'custom',
        "transparentTitle": "always",
        "titlePenetrate": "YES"
    },
    "usingComponents": {
    },
    "style": "v2",
    "sitemapLocation": "sitemap.json",
    "permission": {
      "scope.userLocation": {
        "desc": "请确认授权"
      }
    }
}
if(process.env.TARO_ENV=='jd'){
    config.subPackages.map((item)=>{
        item.root = item.root+'/'
    })
}
export default config