// 实现对axios引入
import axios from 'axios'
// 引入Message错误提示框
import { Message } from 'element-ui'
// 通过axios创建实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
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

