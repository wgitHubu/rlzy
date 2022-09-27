// 实现对axios引入
import axios from 'axios'
// 引入Message错误提示框
import { Message } from 'element-ui'
// 引入vuex的store
import store from '@/store'
// 通过axios创建实例
import router from '@/router'
const TimeOut = 3600
// 对比两次的时间差看token是否过期
function IsCheckTimeOut() {
  const currentTime = Date.now()
  const timeStamp = (currentTime - store.getters.hrsaasTime) / 1000
  return timeStamp > TimeOut
}
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 每个请求的时候加token字段
service.interceptors.request.use(config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    // 如果token存在 注入token
    // 如果限制token的失效时间
    if (IsCheckTimeOut()) {
      store.dispatch(`user/logout`)
      router.push('/login')
      return Promise.reject(new Error('token过期'))
    }

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
  if (error.response && error.response.status === 401) {
    store.dispatch(`user/logout`)
    router.push('/login')
    Message.error('token 超时')
  } else {
    Message.error(error.message) // 提示错误信息
  }

  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})

export default service

