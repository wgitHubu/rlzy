// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例

const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
// 路由的前置守卫
router.beforeEach(async function(to, from, next) {
  if (store.getters.token) { // 这是有token的情况
    if (!store.getters.userId) { // 判断接口是否有用户的id 如果有则不重复调用接口 没有有则调用
      await store.dispatch('user/getUserInfo')
    }
    if (to.path === '/login') { //  表示去的是登录页的时候重定向跳去主页
      next('/') // 跳到主页
    } else {
      next() // 直接放行
    }
  } else { // 没有token的情况
    if (whiteList.includes(to.path)) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }
})
