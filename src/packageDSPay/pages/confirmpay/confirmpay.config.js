const config = {}
const taroEnv = process.env.TARO_ENV
if(taroEnv == 'weapp'){
    config.navigationStyle = 'custom'
} else if(taroEnv === 'alipay'){
    config.transparentTitle = "always"
}

export default config
