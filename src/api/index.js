// n 个接口的请求函数的模块， 返回promise

import ajax from './ajax'

// 登录
export const reqLogin = (username, password) => ajax('/api/login', {username, password}, 'POST')