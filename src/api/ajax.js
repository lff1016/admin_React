// 封装请求
import axios from "axios";
import {message} from 'antd';

export default function ajax(url, data = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    let promise
    if (method === 'GET') {
      promise = axios.get(url, {params: data}) // query参数
    } else {
      promise = axios.post(url, data)
    }

    promise.then(response => {
      // 成功了，就调用 resolve
      resolve(response.data)
    }).catch(err => {
      message.error('请求错误' + err.message)
    })
  })
}