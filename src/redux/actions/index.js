import {
  LOGIN,
  GET_ARTICLES,
  GET_CATEGORIES,
  GET_DRAFTS,
  GET_POEM,
  GET_TAGS,
  GET_SAYS,
  GET_MOVIES,
  GET_COMMENTS
} from '../constant';

// 登录
export const login = data => ({type: LOGIN, data})

// 获取所有文章
export const getArticles = data => ({type: GET_ARTICLES, data})

// 获取所有草稿
export const getDrafts = data => ({type: GET_DRAFTS, data})

// 获得所有分类
export const getCategories = data => ({type: GET_CATEGORIES, data})

// 获得所有标签
export const getTags = data => ({type: GET_TAGS, data})

// 获取所有说说
export const getSays = data => ({type: GET_SAYS, data})

// 获得每日诗句的信息
export const getPoem   = data => ({type: GET_POEM, data})

// 获得电影的信息
export const getMovies = data => ({type: GET_MOVIES, data})

// 获取评论列表
export const getComments = data => ({type: GET_COMMENTS, data})