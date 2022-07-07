// n 个接口的请求函数的模块， 返回promise
import ajax from './ajax';
import jsonp from 'jsonp';
import { message } from 'antd';
import axios from 'axios';

// 登录
export const reqLogin = (email, password) => ajax('/api/admin/login', { email, password }, 'POST')

// 查询某个用户
export const reqGetUser = id => ajax(`/api/admin/user?id=${id}`)

// 获取用户列表
export const reqUsersList = () => ajax('/api/admin/users/list')

// 修改用户权限
export const reqUserAuth = (id, auth) => ajax('/api/admin/users/auth',{_id: id, auth}, 'POST')

// 删除用户头像
export const reqDeleteAvatar = name => ajax('/api/admin/users/deleteAvatar',  {name}, 'POST')

// 修改用户信息
export const reqUserUpdate = userInfo => ajax('/api/admin/users/update', userInfo, 'POST')

// 修改用户名
export const reqUserEdit = (id, username, role) => ajax('/api/admin/users/edit', {_id: id, username, role}, 'POST')

// 修改用户角色
// export const reqUserRoleUpdate = (id, role) => ajax('/api/admin/users/role', {_id: id, role}, 'POST')

// 删除用户
export const reqDeleteUser = id => ajax('/api/admin/users/delete', {_id: id}, 'POST')

// 获取文章列表
export const reqArticles = () => ajax('/api/admin/article/list')

// 获取每日一句
export const getSentence = () => ajax('https://v1.hitokoto.cn/?c=b')

// 获取用户的ip地址
export const reqWeather = () => {
  return new Promise((resolve, reject) => {
    const url = 'https://restapi.amap.com/v3/ip?output=JSON&key=c629ac8a9edae7a5ae44d2837fed4ece'
    jsonp(url, {}, async (err, data) => {
      // 如果获取成功，返回当地的邮编地址
      if (!err && data.status == 1) {
        const adcode = data.adcode
        const weatherData = await axios.get(`https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&key=c629ac8a9edae7a5ae44d2837fed4ece`)
        if(weatherData.status === 200) {
          const weather = weatherData.data.lives[0]
          resolve(weather)
        }    
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

// 获取评论
export const reqCommentsList = () => ajax('/api/admin/comment/list')

// 审核评论
export const reqCommentVerify = (_id, isShow) => ajax('/api/admin/comment/verify', {_id, isShow}, 'POST')

// 删除评论
export const reqCommentDelete = _id => ajax('/api/admin/comment/delete', {_id}, 'POST')

// 获取电影地区
export const reqCountry = () => ajax('/api1/movie/country/list')

// 获取电影列表
export const reqMovieList = () => ajax('/api1/movie/list')

// 添加电影
export const reqAddMovie = movieObj => ajax('/api1/movie/save', movieObj, 'POST')