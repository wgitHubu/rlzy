import request from '@/utils/request'

export function login(data) {

}
// 获取用户的信息
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}
// 获取用户的信息头像
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

// 保存用户信息
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

export function logout() { }
