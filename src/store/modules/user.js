import { login } from '@/api/login'
import { getUserInfo, getUserDetailById } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: {}
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    // 设置用户信息
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    },
    // 删除用户信息
    RMOVE_USER_INFO(state) {
      state.userInfo = {}
    }
  },
  actions: {
    async loginAction({ commit }, loginData) {
      const data = await login(loginData) // 请求拦截器返回的data所以不需要结构
      // console.log(data)
      commit('SET_TOKEN', data)
    },
    async getUserInfo({ commit }) {
      // await getUserInfo()
      const res = await getUserInfo() // 获取返回值
      const res1 = await getUserDetailById(res.userId)
      // console.log(res1)
      const result = { ...res, ...res1 }
      commit('SET_USER_INFO', result) // 将整个的个人信息设置到用户的vuex数据中
      return JSON.parse(JSON.stringify(result))
      // return res // 这里为什么要返回 为后面埋下伏笔
    }
  }
}
