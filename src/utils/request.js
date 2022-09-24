// 实现对axios引入
import axios from 'axios'
// 通过axios创建实例
const service = axios.create({
  baseURL: '/dev',
  timeout: 5000
})
export default service

