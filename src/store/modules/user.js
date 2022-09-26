import { login } from '@/api/login'
export default {
  namespaced: true,
  state: {
    token: null
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    }
  },
  actions: {
    async loginAction({ commit }, loginData) {
      const data = await login(loginData) // 请求拦截器返回的data所以不需要结构
      // console.log(data)
      commit('SET_TOKEN', data)
    }
  }
}
