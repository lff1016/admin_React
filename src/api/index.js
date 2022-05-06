// n 个接口的请求函数的模块， 返回promise
import ajax from './ajax';
import jsonp from 'jsonp';
import { message } from 'antd';
import axios from 'axios';

// 登录
export const reqLogin = (username, password) => ajax('/api/login', { username, password }, 'POST')

// 获取用户列表
export const reqUsersList = () => ajax('/api/admin/users/list')

// 修改用户权限
export const reqUserAuth = (id, auth) => ajax('/api/admin/users/auth',{_id: id, auth}, 'POST')

// 获取文章列表
export const reqArticles = () => ajax('/api/admin/article/list')

// 获取每日一句
export const getSentence = () => ajax('https://v1.hitokoto.cn/?c=b')

// 获取用户的ip地址
export const reqWeather = () => {
  return new Promise((resolve, reject) => {
    const url = 'https://apis.map.qq.com/ws/location/v1/ip?key=TCUBZ-MLY6X-CT54A-7HUJH-OEL3O-GTFGU&output=jsonp'
    jsonp(url, {}, async (err, data) => {
      // 如果获取成功，返回当地的邮编地址
      if (!err && data.message === 'Success') {
        const ip = data.result.ip
        const weatherData = await axios.get(`https://wttr.in/${ip}?format="%l+\\+%c+\\+%t+\\+%h"`)
        const weather = weatherData.data
        resolve(weather)
      } else {
        message.error('天气获取失败')
        reject(err)
      }
    })
  })
}

// 获取分类列表
export const reqCategoryList = () => ajax('/api/admin/category/list')

// 添加分类
export const reqAddCategory = (category) => ajax('/api/admin/category/add', {name: category}, 'POST')

// 删除分类
export const reqDeleteCategory = (id,category) => ajax('/api/admin/category/delete', {_id: id, name: category}, 'POST')

// 修改分类
export const reqUpdateCategory = (id,category) => ajax('/api/admin/category/update', {categoryId: id, categoryName: category}, 'POST')

// 获取标签列表
export const reqTagsList = () => ajax('/api/admin/tags/list')

// 添加标签
export const reqAddTag = (tag) => ajax('/api/admin/tags/add', {name: tag}, 'POST')

// 删除标签
export const reqDeleteTag = (tagId) => ajax('/api/admin/tags/delete', {_id: tagId}, 'POST')

// 修改标签
export const reqUpdateTag = (tagId, tagName) => ajax('/api/admin/tags/edit', {_id: tagId, name: tagName}, 'POST')

// 删除图片
export const reqDeleteImg = (name) => ajax('/api/admin/img/delete', {name}, 'POST')

// 添加/更新文章
export const reqAddOrUpdateArticle = (article) => ajax('/api/admin/article/' + (article._id ? 'update' : 'add'), {article}, 'POST')

// 删除文章
export const reqDeleteArticel = id => ajax('/api/admin/article/delete', {_id: id}, 'POST')

// 获取所有说说
export const reqSaysList = () => ajax('/api/admin/says/list')

// 添加/更新说说
export const reqAddAndUpdateSays = say => ajax('/api/admin/says/'+ (say._id ? 'update' : 'add'), say, 'POST')

// 删除说说
export const reqDeleteSay = id => ajax('/api/admin/says/delete', {_id: id}, 'POST')