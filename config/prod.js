let date = new Date()
let years = date.getFullYear()
let months =  (date.getMonth() + 1)
let dates = date.getDate()
let getYMD = years + '.' + (months < 10? '0'+months : months) + '.' + (dates < 10 ? '0'+dates: dates)
let sdkTime = '1.' + getYMD + '.01'
let taroEnv = process.env.TARO_ENV
let platformArr = ['h5', 'weapp', 'alipay','jd']
import fs from 'fs'
const path=require('path')
const chalk=require('chalk')
let zipProjectName= ''
if(taroEnv == 'h5'){
  const wsgwConf = require('../wsgwConfigure.json')
  let projectName = path.basename(path.resolve())
  zipProjectName = wsgwConf.projectName[projectName]
}

function ModifyFile() {
  const buffer = fs.readFileSync('version.json', 'utf-8')
  let mFile = JSON.parse(buffer)
  if (!mFile.length) {        
    platformArr.forEach((item) => {
      if(item === taroEnv){
        mFile.push({ 'platform': item, version: sdkTime })
      } else {
        mFile.push({ 'platform': item, version: '' })
      }
    })
  } else { 
    mFile.forEach((item) => {
      if (item.platform == taroEnv) {
        if (!item.version.length) {
          item.version = sdkTime
        } else {
          let arr = item.version.split('.')
          let comYMD = arr[1] + '.' + arr[2] + '.' + arr[3]
          if (comYMD != getYMD) {
            item.version = sdkTime  
          } else {
            let num = comYMD != getYMD ? 1 : parseInt(arr[arr.length - 1]) + 1
            arr[arr.length - 1] = num < 10 ? '0' + num : '' + num
            item.version = arr.join('.')
          }
        }
        sdkTime = item.version
      }
    })
  }
  WriteFile('version.json', mFile)
  tearDown()
}
function WriteFile(file, data) {
  let newData = JSON.stringify(data, null, 4)
  fs.writeFile(file, newData, (err) => {
    if (err) {
      console.log(err)
    } else { 
      console.log(chalk.red.bold(`版本号更新成功:{更新平台:${taroEnv},更新版本:${sdkTime}}`))
    }
  })
}
 //打包后置操作，复制config文件等到已打包目录
 function tearDown(){
  //  如果不是h5 
  if(taroEnv != 'h5'){return;}
  const __dirname = path.resolve()
  console.log(__dirname)
  const fromFile = path.resolve(__dirname + '/src/utils/h5','dsconfig.xml');
  const toFile = path.resolve(__dirname + `/dist/h5/${zipProjectName}`,'config.xml')
  setTimeout(() => { //打包脚本会清除会h5目录下所有文件，为了使脚本没有侵入性，延迟copy文件
    fs.copyFile(fromFile,toFile,0,(err) => {
      console.log(err)
    })
  }, 3000);
}
/**
 * 判断文件是否存在
 * @param fileName 文件路径
 */
let fileName = 'version.json'
try{
  fs.accessSync(fileName, fs.constants.R_OK)
  console.log('File does exist')
} catch(err){
  fs.appendFileSync(fileName, '[]')
  console.log('File does not exist,create new file')
}
// 读取文件大小，如果为空则赋值空数组
let statsObj= fs.statSync(fileName)
if(statsObj.size == 0){
  fs.appendFileSync(fileName,'[]')
}
ModifyFile()
  

module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  outputRoot: `dist/${taroEnv}/${zipProjectName}`,
  defineConstants: {
    SDKVERSION: `'${sdkTime}'`,
  },
  mini: {},
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  }
}
