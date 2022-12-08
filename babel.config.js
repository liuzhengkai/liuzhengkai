// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
const prodPlugins = []
// if(process.env.NODE_ENV === 'production'){
//   prodPlugins.push('transform-remove-console')
// }

module.exports = {
  presets: [
    ['taro', {
      framework: 'vue',
      ts: false,
    }]
  ],
  plugins:[
    ...prodPlugins,
    [
      "import",
      
        {
          "libraryName": "vant",
          "style": true
        }
      
    ]
  ],
  
}