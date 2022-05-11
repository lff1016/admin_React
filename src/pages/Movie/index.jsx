import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Tag,
  Space,
  Button,
  Tooltip,
  Popconfirm,
  message,
  Image,
  Input,
  Select,
  Typography,
  Popover
} from 'antd';
import { PlusOutlined, HeartTwoTone, SettingTwoTone } from '@ant-design/icons';

import './index.css';
import errImg from '../../assets/img/img_err.jpg';
import { connect } from 'react-redux';
import { getMovies } from '../../redux/actions'

const { Option } = Select;
const { Paragraph, Text } = Typography;

const Movies = ({movies, getMovies}) => {

  const tagsColor = ['magenta', 'blue', 'red', 'orange']

  const movieData = [
    {
      movieId: '01',
      movieName: '间谍过家家',
      movieCover: 'https://puui.qpic.cn/vcover_vt_pic/0/mzc002004c2egrs1648550551453/220',
      movieScore: '9.9',
      movieCategory: ['热血', '战争'],
      movieArea: '日本',
      movieYear: '2022',
      movieWatchYear: '2022-5-10',
      movieUrl: 'http://www.agefans.top/acg/69091/',
      movieComment: '在一周内组建家庭，并潜入戴斯蒙德儿子所就读的学校吧“。但是，他所遇到的「女儿」是会读心的超能力者、「妻子」则是暗杀者！为了互相的利益而成为家庭，决定在隐藏真实身分的情况下共同生活的3人。世界的和平就托付即将发生一系列事件的暂定的家庭…？'
    },
    {
      movieId: '02',
      movieName: '鬼灭之刃 游郭篇',
      movieCover: 'http://tvax4.sinaimg.cn/large/006sgDEegy1gv2c98nol7j607i0aign902.jpg',
      movieScore: '9.6',
      movieCategory: ['热血', '漫改'],
      movieArea: '日本',
      movieYear: '2022',
      movieWatchYear: '2022-4-10',
      movieComment: '结束了无限列车的任务，炭治郎前往下一个任务地点。与鬼杀队最强之一的音柱·宇髄天元一同前往鬼所栖身的游郭之中。新的战斗即将开幕！'
    },
    {
      movieId: '03',
      movieName: '紫罗兰永恒花园 剧场版',
      movieCover: 'http://tvax4.sinaimg.cn/large/006sgDEegy1gli5o7f3jgj307i0al3yy.jpg',
      movieScore: '9.9',
      movieCategory: ['爱情', '奇幻', '剧情'],
      movieArea: '日本',
      movieYear: '2021',
      movieWatchYear: '2022-3-24',
      movieComment: '从事代笔职业的她，名叫薇尔莉特·伊芙加登。在让人们伤痕累累的战争结束后数年，崭新的时代来临，世界也逐渐恢复平稳，生活也随着新技术的开发而改变，大家都在向前迈进。但是，薇尔莉特每天都在思念“那个人”，她坚信他一定还活着。直到某天，她在邮局的仓库里发现了一封收件人不明的信……'
    },
    {
      movieId: '04',
      movieName: '擅长捉弄的高木同学 第三季',
      movieCover: 'http://tvax4.sinaimg.cn/large/006sgDP3gy1gxo1mns34rj307i0a3abd.jpg',
      movieScore: '9.9',
      movieCategory: ['漫改', '恋爱', '校园'],
      movieArea: '日本',
      movieYear: '2022',
      movieWatchYear: '2022-4-27',
      movieComment: '“捉弄”缩短了二人的距离，2022年想要守候的初恋就在这里。在一所初中里，有一个叫做西片的男生，他时不时就会遭到同桌女生高木的捉弄。西片每次思考对策，想要捉弄回高木，都会被高木看透。于是西片每天都绞尽脑汁，想要扳回一城…然而随着时间变化的不止是季节，还有西片的心境？看似占据优势的高木似乎也发生了让她动摇的事情？是看对方喜欢自己，还是将喜欢展现给对方看——让人止不住微笑和心动的“捉弄战争”，终于要进入最终回合！？'
    }
  ]

  const [movieShow, setMovieShow] = useState([])

  // 文本省略
  const [ellipsis, setEllipsis] = React.useState(true);

  // 设置按钮的 html 内容
  const content = (
    <div style={{ width: '30px' }}>
      <a>编辑</a>
      <a>删除</a>
    </div>
  )

  // 异步获取电影，并放入 redux
  const getAllMovies = () => {
    getMovies(movieData)
  }

  useEffect(() => {
    getAllMovies()
  }, [])

  // 组件挂载时将所有数据放到 movieShow 中
  useEffect(() => {
    // 将 redux 中的数据展示出来
    setMovieShow(movies)
    console.log('重新渲染');
  }, [movies])



  // ————根据输入内容搜索 start ————
  const [searchByCategory, setSearchByCategory] = useState([])
  // ----根据关键词搜索----
  const searchKeywords = useRef()
  // 按下回车后的搜索
  const searchByKeywords = e => {
    // 初始化按分类搜索
    setSearchByCategory([])
    const keywords = e.target.value.toLowerCase()
    // 如果没有关键词就渲染全部电影
    if (!keywords) {
      setMovieShow(movieData)
      return
    }
    // 过滤出要展示的电影
    const newMovieShow = movieData.filter(item => item.movieName.toLowerCase().indexOf(keywords) !== -1)
    console.log(newMovieShow);
    setMovieShow(newMovieShow)
  }

  // ————根据输入内容搜索 end ————

  // 渲染每个 Item
  const renderItem = (
    movieShow.map(item => {
      return (
        <div className='card-item' key={item.movieId}>
          <div className='movie-cover'>
            <Image
              className='movie-img'
              src={item.movieCover}
              alt=""
              fallback={errImg}
            />
          </div>
          <div className='movie-info'>
            <div className='info movie-name'>
              <Text
                style={ellipsis ? { width: 150 } : undefined}
                ellipsis={ellipsis ? { tooltip: item.movieName } : false}
              >
                {item.movieName}
              </Text>
              <span className='movie-score'>{item.movieScore}</span>
            </div>
            <div className='info movie-category'>
              类型：
              {
                item.movieCategory.map((tag, index) => {
                  return <Tag key={index} color={tagsColor[index]}>{tag}</Tag>
                })
              }
            </div>
            <div className='infomovie-area'>
              地区：{item.movieArea}
            </div>
            <div className='info movie-year'>
              <span className='movie-publishDate'>年份：{item.movieYear}</span>
              <span className='movie-watchDate'>观看：{item.movieWatchYear}</span>
            </div>
            <div className='info movie-comment'>
              <Paragraph ellipsis={ellipsis ? { rows: 2, tooltip: item.movieComment } : false}>
                简介：{item.movieComment}
              </Paragraph>
            </div>
            <div className='movie-action'>
              <Button className='play-btn' type="primary" shape='round'>立即播放</Button>
              <HeartTwoTone className='movie-like' style={{ fontSize: '20px' }} />
              <Popover content={content} trigger="click" overlayStyle={{ width: '80px' }} placement='topRight' arrowPointAtCenter>
                <SettingTwoTone className='setting' style={{ fontSize: '20px' }} />
              </Popover>

            </div>
          </div>
        </div>
      )
    })
  )

  return (
    <div className='movies'>
      {/* 头部筛选框 start */}
      <div className='movies-nav'>
        <div className='movie-filter movie-filter-title'>
          电影名：
          <Input
            ref={searchKeywords}
            style={{ width: 350 }}
            placeholder='请选择电影名~'
            onPressEnter={searchByKeywords} // 按下回车后再进行搜索，防止页面抖动
          />
        </div>
        <div className='movie-filter movie-filter-category'>
          类型：
          <Select
            mode="multiple"
            style={{ width: 350 }}
            placeholder='请选择电影类型~'
            allowClear
            showArrow
            showSearch
          >
            <Option key='1'>悬疑</Option>
            <Option key='2'>爱情</Option>
            <Option key='3'>战争</Option>
          </Select>
        </div>
      </div>
      {/* 头部筛选框 end */}
      <div className='movies-list'>
        <div className='list-title'>
          <span>电影列表</span>
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            size='large'
          >
            添加
          </Button>
        </div>
        <div className='list-content'>
          {renderItem}
        </div>
      </div>
    </div>
  )
}

export default connect(
  state => ({
    movies: state.movies
  }),
  {getMovies}
)(Movies)