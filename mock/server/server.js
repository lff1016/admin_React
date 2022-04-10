var express = require('express')
var bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const admin = require('./routers/admin')
const home = require('./routers/home')

// 创建服务器
var app = express()

// 配置解析 post body 请求
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 配置路由请求路径
app.use('/', admin)
app.use('/home', home)

// 配置 cookie
app.use(cookieParser())

// 监听端口，开启服务器
app.listen(3001, () => {
  console.log('mock的服务器开启了...');
})