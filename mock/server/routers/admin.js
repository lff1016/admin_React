
const express = require('express')

const { userList } = require('../../db/index')

// 借用 express 开启路由
const admin = express.Router()

// login 登录界面
admin.post('/login',async (req, res) => {
  const {username, password} = req.body

  // 根据 username, password 查询用户
  const user = await userList.users.filter(item => {
    return item.username === username && item.password === password+''
  })
  
  // 如果用户存在，返回成功状态码
  if(user) {
    res.cookie('userid', user.id, {maxAge: 1000 * 60 * 60 * 24})
    res.send({status: 0, data: user})
    } else {
      res.send({status: 1, msg: '用户名或密码不正确!'})
    }
})

// admin.get('/user', (req, res) => {
//   res.json(userList)
// })


module.exports = admin