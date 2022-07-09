// 配置反向代理文件
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware( {
            target: 'http://localhost:3001',
            changeOrigin: true,
            pathRewrite: { '^/api': '' }
        })
    ),
    app.use(
        '/api1',
        createProxyMiddleware({
            target: 'http://192.168.1.106:7777',
            changeOrigin: true,
            pathRewrite: { '^/api1': '' }
        })
    )
}