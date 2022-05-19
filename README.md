# 李帆的个人博客
  最近主要学习了 react 框架，想用 react 搭建一个个人博客掌握一下所学的知识，本来想用 Mock 的数据，但想着自己前段时间也学了 node ，所以就自己搞一个前后端完整的个人博客。自学前端，代码如有什么问题及需要改进的地方还需多多指教！
## 介绍
博客主要分为博客后台、博客前台（正在搭建中...）、博客后端，均由自己搭建
1. 博客后台主要利用 react + redux + antd + echart 进行搭建；
2. 博客前台技术栈与后台相同；
3. 博客后端主要利用 node + express + mongoose 进行搭建，端口：3001

## 博客后台
1. 主要功能
 - 登录
 - 添加文章
  - markdown 编辑器（markdown-it 第三方库）
 - 文章列表展示
  - 可根据文章关键字、分类、标签筛选文章
 - 修改文章
 - 删除文章
 - 分类和标签的增删改查
  - 在 Home 页和写文章页都可进行增删改查
  - 分类在首页利用 echart 图表进行展示
 - 用户列表
 - 说说功能
 - 我的观影功能（目前只完成前端显示及关键字筛选）
 - 个人信息的展示和修改

 2. 项目地址
  - 后台项目 github 地址(dev分支)：https://github.com/lff1016/admin_React.git
    - 运行： `npm start`
  - 后端node github 地址(dev分支)：https://github.com/lff1016/react-admin-server.git
    - 运行： `node server.js`/ `nodemon server.js`

## 欢迎联系
1. QQ : 1037305462
