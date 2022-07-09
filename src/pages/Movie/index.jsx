import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { useBoolean } from 'ahooks';

import './index.css';
import { getMovies } from '../../redux/actions';
import { reqMovieList, reqDeleteMovie } from '../../api/index';

import Add from './Add';
import MovieItem from '../Movie/MovieItem'



const Movies = ({ movies, getMovies }) => {

  const { Option } = Select;

  const tagsColor = ['magenta', 'blue', 'red', 'orange']

  // —————— 请求电影数据并展示 start ——————
  /* 定义要展示的数据 */
  const [movieShow, setMovieShow] = useState([])

  /* 方法：请求电影列表 */
  const getAllMovies = async () => {
    const res = await reqMovieList()
    if (res.code === 0) {
      getMovies(res.info.records)
    }
  }
  /* 组件挂载时请求数据，并将数据放到 state 中用于页面渲染展示 */
  useEffect(() => {
    getAllMovies()
    setMovieShow(movies)
  }, [movies])
  // —————— 请求电影数据并展示 end ——————


  // —————— 数据根据【关键词】和【类型】筛选功能 start ——————
  /* ---- 根据【类型】搜索 start ---- */ 
  const [searchByCategory, setSearchByCategory] = useState([])
  /* ---- 根据【类型】搜索 end ---- */ 

  /* ---- 根据【关键词】搜索 start ---- */ 
  const searchKeywords = useRef()
  /* 按下回车后进行搜索 */ 
  const searchByKeywords = e => {
    /* 初始化按分类搜索 */
    setSearchByCategory([])
    const keywords = e.target.value.toLowerCase()
    /* 如果没有关键词就全部渲染 */
    if (!keywords) {
      setMovieShow(movies)
      return
    }
    /* 过滤出要展示的电影 */
    const newMovieShow = movies.filter(item => item.movieName.toLowerCase().indexOf(keywords) !== -1)
    setMovieShow(newMovieShow)
  }
  /* ---- 根据【关键词】搜索 end ---- */ 

  // —————— 数据根据关键词和类型筛选功能 end ——————


  // ————— 添加电影 start ————
  /* 添加弹窗是否显示 */
  const [showAddDrawer, { toggle: toggleAddDrawer, setTrue: openAddDrawer, setFalse: closeAddDrawer }] = useBoolean(false)

  // ————— 添加电影 end ————

  // —————— 编辑电影 start ——————
  /* 获取要修改/删除的电影编号 */
  const [editMovieNo, setEditMovieNo] = useState('')
//  const [movieActionType, setMovieActionType] = useState('')

  const getMovieNoAndAction = (movieNo, movieAction) => {
    console.log('点击子元素', movieNo, movieAction);
    if(movieAction === 'edit') {
      /* 编辑请求的操作 */
      setEditMovieNo(movieNo)
      openAddDrawer()
    } else {
      /* 删除电影的操作 */
      deleteMovie(movieNo)
    }
  }

  // —————— 编辑电影 end ——————

  // —————— 删除电影 start ————
  const deleteMovie = async movieNo => {
    const res = await reqDeleteMovie(movieNo)
    console.log('删除', res);
    if (res.code === 0) {
      message.success('电影删除成功！😀')
    }
  }
  // —————— 删除电影 end ————
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

      {/* 添加电影的 modal框 */}
      <Add 
        showAddDrawer={showAddDrawer} 
        changeShowDrawer={closeAddDrawer} // 关闭添加框
        refreshMovieList={() => getAllMovies()} // 子组件增加电影时，通知此组件更新 redux 的数据并刷新页面
        editMovieNo={editMovieNo} // 编辑时填充表单的信息
      />
      {/* 电影列表展示区域 */}
      <div className='movies-list'>
        <div className='list-title'>
          <span>电影列表</span>
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            size='large'
            onClick={toggleAddDrawer}
          >
            添加
          </Button>
        </div>
        <div className='list-content'>
          {
            movieShow.map(movieItem => <MovieItem key={movieItem.movieNo} movieItemInfo={movieItem} getMovieNoAndAction={getMovieNoAndAction}/>)
          }
        </div>
      </div>
    </div>
  )
}

export default connect(
  state => ({
    movies: state.movies
  }),
  { getMovies }
)(Movies)