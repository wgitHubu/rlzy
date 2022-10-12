// 该文件负责所有的公共的组件的全局注册   Vue.use
// Vue.use 这个方法 注册全局组件
// import PageTools from './PageTools'
// const components = [PageTools]

import * as filters from '@/filters' // 引入工具类
const fn = require.context('./', true, /\.vue$/)
// 找文件
// console.log(fn.keys())
// 找模块
// console.log(fn('./PageTools/index.vue'))

// 从文件中找模块
const components = fn.keys().map(ele => {
//   console.log(fn(ele))
  return fn(ele)
})

export default {
  install: function(Vue) {
    components.forEach(ele => {
    //   console.log(ele)
      Vue.component(ele.default.name, ele.default)
    })
    Object.keys(filters).forEach(key => {
      // 注册过滤器
      // console.log(key)
      Vue.filter(key, filters[key])
    })
  }
}
