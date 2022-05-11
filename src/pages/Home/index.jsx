import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';

import './index.css';
import memoryUtils from '../../utils/memoryUtils';
import format from '../../utils/format';
import { reqWeather, reqArticles, reqSaysList } from '../../api/index';
import { getArticles, getSays } from '../../redux/actions';

import Category from '../../components/Category';
import Tags from '../../components/Tags';

const Home = (props) => {

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
  const [weather, setWeather] = useState({})
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
  // function formatWeather(weatherData) {
  //   const res_text = weatherData.replace(/not found/g, 'not found,not found').replace(/"/g, '').replace(/\+/g, '').replace(/,/g, '\\').replace(/ /g, '').replace(/°C/g, '');
  //   const res_list = res_text.split('\\');
  //   return res_list
  // }
  // 组件挂载时请求地址，获取天气信息
  useEffect(() => {
    const weatherReq = async () => {
      const weather = await reqWeather()
      console.log('home',weather );
      setWeather(weather)
    }
    weatherReq()
  }, [])
  // ————时钟card end————


  // 向数据库中获取所有的文章，并放入redux中
  const getAllArticles = async () => {
    const res = await reqArticles()
    props.getArticles(res.data)
  }

  useEffect(() => {
    getAllArticles()
  }, [])

  // 向数据库中获取所有的说说,放入redux中
  const getAllSays = async () => {
    const res = await reqSaysList()
    console.log(res);
    if (res.status === 0) {
      props.getSays(res.data)
    }
  }

  // 组件挂载时将数据放入用于展示数据的 state 中
  useEffect(() => {
    getAllSays()
  }, [])

  const [draftsNum, setdraftsNum] = useState(0)
  const [articlesNum, setArticlesNum] = useState(0)

  useEffect(() => {
    if(props.articles.count) {
      const a_num = props.articles.count.find(item => item._id == 1).total
      const d_num = props.articles.count.find(item => item._id == 0).total
      setArticlesNum(a_num)
      setdraftsNum(d_num) 
    }
    
  }, [props])

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
              <span className='clock-weather'>{weather.weather} {weather.temperature}℃</span>
              <span className='clock-humidity'>💧 {weather.humidity}</span>
            </div>
            <div className='clock-row'>
              <span className='clock-curTime'>{curTime[1]}</span>
            </div>
            <div className='clock-row'>
              <span className='clock-location'>{weather.province}</span>
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
          <div className='data-count'>{articlesNum}</div>
        </div>
        <div className='card data-item'>
          <div className='data-count-title'>草稿数</div>
          <div className='data-count'>{draftsNum}</div>
        </div>
        <div className='card data-item'>
          <div className='data-count-title'>说说数</div>
          <div className='data-count'>{props.says.length}</div>
        </div>
        <div className='card data-item message'>
          <div className='data-count-title'>留言数</div>
          <div className='data-count'>65</div>
        </div>

      </div>


      {/* 第三行的内容 */}
      <div className='function'>
        <Category />
        <Tags />
        <div className='card'>
          3
        </div>
      </div>
    </div>
  )
}

export default connect(
  state => ({
    articles: state.articles,
    says: state.says
  }),
  {
    getArticles, getSays
  }
)(Home)
