// localStorage 本地存储
const USER_KEY = 'user_key'

export default {
  // 保存用户信息
  saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  // 获取用户信息
  getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
  },

  // 删除用户信息
  deleteUser() {
    localStorage.removeItem(USER_KEY)
  }
}