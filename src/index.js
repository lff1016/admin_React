import React from "react";
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import App from "./App";
import memoryUtils from "./utils/memoryUtils";
import storageUtils from "./utils/storageUtils";
import store from "./redux/store";

// 引入 antd 的样式
import 'antd/dist/antd.css';
import '@ant-design/pro-table/dist/table.css';

// localStorage 中存储了用户信息的话，就保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user
console.log(memoryUtils.user);

createRoot(document.getElementById('root'))
  .render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  )