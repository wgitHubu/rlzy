// 实现对axios引入
import axios from 'axios'
// 引入Message错误提示框
import { Message } from 'element-ui'
// 引入vuex的store
import store from '@/store'
// 通过axios创建实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 每个请求的时候加token字段
service.interceptors.request.use(config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    // 如果token存在 注入token
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
// 在挂载service响应拦截器interceptors.response.use
service.interceptors.response.use(response => {
  // axios默认加了一层data解构
  const { success, message, data } = response.data
  //   要根据success判断业务逻辑的成功与否决定下面的操作
  if (success) {
    return data
  } else { // 业务逻辑没有成功的时候执行
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})

export default service

