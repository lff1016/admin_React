import React from "react";
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';  
import App from "./App";
import memoryUtils from "./utils/memoryUtils";
import storageUtils from "./utils/storageUtils";

// 引入 antd 的样式
import 'antd/dist/antd.css';

// localStorage 中存储了用户信息的话，就保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user
console.log(memoryUtils.user);

createRoot(document.getElementById('root'))
.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
)