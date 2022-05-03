import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Table, Popconfirm, } from 'antd';


import './index.css';
import memoryUtils from '../../utils/memoryUtils';
import format from '../../utils/format';
import { reqWeather } from '../../api/index';

import Category from '../../components/Category';
import Tags from '../../components/Tags';

export default function Home() {
  // 获取用户信息
  const user = memoryUtils.user
  

  // —————每日一句 start————
  const [peom, setPeom] = useState({})
  
  function loadSentence() {
    const jinrishici = require('jinrishici');
    jinrishici.load(result => {
      // console.log(result);
      setPeom(result.data)
    }, err => {
      console.log("获取每日一句失败");
    })
  }

  useEffect(() => {
    loadSentence()
  }, [])

  // —————每日一句 end————

  // ————时钟card start————
  const [weather, setWeather] = useState([])
  const [curTime, setCurTime] = useState(format(Date.now()))
  // 组件挂载时获取时间，return 后进行组件卸载之前的操作
  useEffect(() => {
    const timer = setInterval(() => {
      setCurTime(format(Date.now()))
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  //处理天气的格式
  function formatWeather(weatherData) {
    const res_text = weatherData.replace(/not found/g, 'not found,not found').replace(/"/g, '').replace(/\+/g, '').replace(/,/g, '\\').replace(/ /g, '').replace(/°C/g, '');
    const res_list = res_text.split('\\');
    return res_list
  }
  // 组件挂载时请求地址，获取天气信息
  useEffect(() => {
    const weatherReq = async () => {
      const weather = await reqWeather()
      setWeather(formatWeather(weather))
    }
    weatherReq()
  }, [])
  // ————时钟card end————

  return (
    <div className='home'>
      {/* 第一行的内容 */}
      <Row className='basic-info' justify='space-between'>
        <Col className="card gutter-row" span={11}>
          <div className='card-content author-info'>
            <div className='welcom-word'>
              <h2 className='username'>{user.username}</h2>
              ，欢迎回来！
            </div>
            <div className='peom'>"{peom.content}" </div>
          </div>
        </Col>
        <Col span={6} className="card gutter-row">
          <div className='card-content time-weather'>
            <div className='clock-row'>
              <span className='clock-date'>{curTime[0]}</span>
              <span className='clock-weather'>{weather[2]}{weather[3]}℃</span>
              <span className='clock-humidity'>💧{weather[4]}</span>
            </div>
            <div className='clock-row'>
              <span className='clock-curTime'>{curTime[1]}</span>
            </div>
            <div className='clock-row'>
              <span className='clock-location'>{weather[0]}</span>
              <span className='clock-am_pm'>{curTime[2]}</span>
            </div>
          </div>
        </Col>
        <Col span={6} className="card gutter-row">
          <div className='card-content notice'>
            <h2 className='notice-title'>公告🔊</h2>
            <div className='notice-content'>
              期待我的博客吧😀！
            </div>
          </div>
        </Col>
      </Row>

      {/* 第二行的内容 */}
      <div className='article-data'>
        <div className='card data-item'>
          <div className='data-count-title'>文章数</div>
          <div className='data-count'>100</div>
        </div>
        <div className='card data-item'>
          <div className='data-count-title'>草稿数</div>
          <div className='data-count'>23</div>
        </div>
        <div className='card data-item'>
          <div className='data-count-title'>说说数</div>
          <div className='data-count'>35</div>
        </div>
        <div className='card data-item message'>
          <div className='data-count-title'>留言数</div>
          <div className='data-count'>65</div>
        </div>

      </div>


    {/* 第三行的内容 */}
    <div className='function'>
      <Category/>
      <Tags/>
      <div className='card'>
        3
      </div>
    </div>
    </div>
  )
}
